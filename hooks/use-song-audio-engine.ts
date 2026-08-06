import { Asset } from 'expo-asset';
import {
  requestNotificationPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type RefObject,
} from 'react';
import { Platform } from 'react-native';
import { getNextSongAudioTrack, type SongAudioTrack } from '@/utils/song-audio';

// How often the player reports status back to JS. Only the `playing` flag and the
// progress line are driven by it, so this needs to be no finer than a button press
// feels.
const STATUS_UPDATE_INTERVAL_MS = 500;

// Play through the iOS silent switch — a hymnal recording is the user's explicit
// request, not incidental UI sound. Applied on every play because the session is
// shared with the rest of the system and another app may have changed it.
//
// `doNotMix` takes exclusive audio focus, so another player (Spotify, a podcast)
// pauses instead of playing underneath; expo-audio also requires it for lock
// screen controls.
const SONG_AUDIO_MODE = {
  playsInSilentMode: true,
  shouldPlayInBackground: true,
  interruptionMode: 'doNotMix',
} as const;

// Lock screen / notification transport. expo-audio registers no next/previous
// track command, so ±10s skip is the only jump control available — kept on, since
// an empty slot beside play/pause reads worse than a modest one.
const LOCK_SCREEN_OPTIONS = { showSeekForward: true, showSeekBackward: true } as const;

const ALBUM_TITLE = 'Indirimbo';

// Android 13+ needs notification permission before the media notification can
// show, and without that notification the OS stops background playback after a
// few minutes. Asked once per app run, on the first play.
let hasAskedForNotifications = false;
async function ensureNotificationPermission(): Promise<void> {
  if (Platform.OS !== 'android' || hasAskedForNotifications) return;
  hasAskedForNotifications = true;
  try {
    await requestNotificationPermissionsAsync();
  } catch (error) {
    console.error('Failed to request notification permission', error);
  }
}

// Lock screen artwork for iOS, from the bundled app icon: it draws a small square
// thumbnail, which the icon suits. Resolved once — a release build already has a
// file:// path, development fetches it from the dev server. Android takes a hosted
// URL instead (see SongAudioTrack.artworkUrl).
const artworkAsset = Asset.fromModule(require('@/assets/images/icon.png'));
let artworkUri: string | undefined;
async function resolveBundledArtworkUri(): Promise<string | undefined> {
  if (artworkUri) return artworkUri;
  try {
    await artworkAsset.downloadAsync();
    artworkUri = artworkAsset.localUri ?? artworkAsset.uri;
  } catch (error) {
    console.error('Failed to resolve lock screen artwork', error);
  }
  return artworkUri;
}

// Tolerance for "the playhead is at the end of the track", in seconds. Reported
// duration and position rarely match to the sample.
const END_OF_TRACK_EPSILON_S = 0.5;

/**
 * Fetches a recording to disk and returns the local path. expo-asset caches by
 * URL, so a replay — or the next song sharing the same melody file — resolves
 * without touching the network. On web `downloadAsync` is a no-op and the remote
 * URL comes back unchanged, which the browser's own cache covers.
 *
 * The explicit `mp3` type matters on iOS: AVPlayer refuses an asset whose type it
 * cannot infer, and these URLs carry no extension expo-asset would pick up.
 */
async function downloadRecording(url: string): Promise<string> {
  const asset = new Asset({
    name: url.split('/').pop()?.replace(/\.mp3$/, '') ?? 'recording',
    type: 'mp3',
    uri: url,
  });
  await asset.downloadAsync();
  return asset.localUri ?? asset.uri;
}

export interface SongAudioStatus {
  readonly isPlaying: boolean;
  /**
   * Playback was asked for but has not started — the recording is still being
   * fetched. Not `status.isBuffering`: the wait happens before the player has a
   * source at all, so it never reports buffering.
   */
  readonly isPreparing: boolean;
  readonly hasError: boolean;
  /** Playback position as a fraction of the track, 0 when the length is unknown. */
  readonly progress: number;
}

export const IDLE_SONG_AUDIO_STATUS: SongAudioStatus = {
  isPlaying: false,
  isPreparing: false,
  hasError: false,
  progress: 0,
};

/** Transport for the recording already loaded — see SongAudioProvider. */
export interface SongAudioEngineControls {
  /** Pause when playing, resume (or restart, at the end) when not. */
  readonly toggle: () => void;
  /** Halt playback without losing the playhead. */
  readonly pause: () => void;
}

interface SongAudioEngineOptions {
  /** The song to play. Handing over a different one starts it from the top. */
  readonly track: SongAudioTrack;
  readonly controlsRef: RefObject<SongAudioEngineControls | null>;
  readonly onStatusChange: (status: SongAudioStatus) => void;
  /**
   * Called once the recording has played its last pass, so playback can carry on
   * into the next song. Not called when the listener pauses.
   */
  readonly onCompleted: () => void;
}

function songKey(track: SongAudioTrack): string {
  return `${track.playlist}/${track.songNumber}`;
}

/**
 * Drives the app's one and only audio player.
 *
 * There is deliberately a single player for the whole session: on Android every
 * `AudioPlayer` owns its own media session and its own notification (keyed by the
 * player's identity), and handing lock screen ownership from one player to another
 * tears the playback service down and starts it again. A player per song left
 * stale media cards stacked in the shade, and once the app was in the background
 * the restart could be refused outright — which stopped playback mid-run. Swapping
 * the source on one long-lived player has neither problem, and playback survives
 * the song screen unmounting under it.
 *
 * The file is fetched and cached first, then played from local storage. Recordings
 * are only a few hundred KB, and this avoids playing over the network altogether:
 * iOS applies App Transport Security to AVFoundation media loads separately from
 * URLSession, so a plain-HTTP dev-server URL is safer downloaded than streamed. It
 * also makes a replay instant.
 *
 * The download is driven here rather than through the hook's own `downloadFirst`
 * option, because that swaps the source whenever it happens to finish: a song
 * change would start the player before the swap and replay a slice of the previous
 * recording. Loading is finished when `loadedUrl` says so, and nothing plays until
 * then.
 */
export function useSongAudioEngine({
  track,
  controlsRef,
  onStatusChange,
  onCompleted,
}: SongAudioEngineOptions): void {
  const player = useAudioPlayer(null, {
    updateInterval: STATUS_UPDATE_INTERVAL_MS,
    // iOS tears the audio session down every time a track ends or is paused, unless
    // this is set (AudioModule.swift, onPlaybackComplete). Playback here is a run of
    // songs with gaps in between — a repeat pass rewinding, the next recording being
    // fetched — and a torn-down session in one of those gaps lets the OS suspend a
    // backgrounded app, which ends the run for good.
    keepAudioSessionActive: true,
  });
  const status = useAudioPlayerStatus(player);
  // The recording the player currently holds — null until the first one is in.
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  // The same value, readable after an await: play() decides whether to start the
  // player once its preparation has finished, by which point a render may have
  // moved on. Starting a player whose source belongs to the song before this one
  // would resume that song under the current song's screen.
  const loadedUrlRef = useRef<string | null>(null);
  // The recording that failed to download, and the counter that lets the next press
  // ask for it again. The download effect is keyed by URL, so without the counter a
  // failure would be final for the session: the URL never changes, the effect never
  // re-runs, and the button would sit on a spinner that nothing can clear.
  //
  // Held as the URL rather than a flag so the error belongs to one recording — a
  // song handed over while the previous one's fetch was failing starts clean,
  // without the effect having to reset anything as it runs.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const [downloadAttempt, setDownloadAttempt] = useState(0);
  const hasDownloadError = failedUrl === track.url;
  // The engine is mounted by the first play request, so playback is wanted from
  // the start. A press lands before the download finishes, while the player still
  // has no source and `play()` is a no-op — latch the intent and start on arrival.
  //
  // Held as both a ref and state: the ref is what the async play path reads after
  // its awaits, while the state is what renders the button as busy. A press that
  // cancels a pending start produces no native status update at all, so without
  // the state the spinner would have nothing to turn it off.
  const shouldPlayWhenReady = useRef(true);
  const [isPlayIntended, setIsPlayIntended] = useState(true);
  const setPlayIntent = useCallback((intended: boolean) => {
    shouldPlayWhenReady.current = intended;
    setIsPlayIntended(intended);
  }, []);
  // Passes completed in the current run, so repeats stop at the verse count.
  const passesPlayed = useRef(0);
  // Whether the pass that `didJustFinish` reports has already been counted. The
  // flag stays set until a status update without it arrives, so the effect below
  // acts once per finished pass — it re-runs whenever the song or the completion
  // handler changes, which happens the moment a finished song hands over to the
  // next one, and counting that same finish again would skip a song per song.
  const hasCountedFinish = useRef(false);
  // The song the player is on, so handing over a new one is told apart from a
  // re-render of the same one.
  const loadedKey = useRef(songKey(track));
  // The song the engine is on as of the last commit. play() reads it after its
  // awaits to tell that the song it was started for is still the current one:
  // comparing against its own captured track proves nothing, since a stale request
  // carries the very song whose source is still loaded, and the play intent it
  // checks is shared with whatever song has taken over.
  //
  // Written from an effect rather than during render, so a render that is thrown
  // away never leaves the guard pointing at a song the engine is not on. Declared
  // ahead of every effect that starts playback, which is what makes that safe:
  // effects run in order, so the key is current before anything reads it.
  const trackKey = songKey(track);
  const currentKey = useRef(trackKey);
  useEffect(() => {
    currentKey.current = trackKey;
  }, [trackKey]);
  // Whether the OS has already been handed the transport controls for this player.
  const hasLockScreenControls = useRef(false);

  // Hands the OS the transport controls: lock screen, Control Center, and the
  // Android notification that keeps background playback alive. Done once per
  // player — re-registering releases the media session and builds a new one, so
  // later songs only refresh the metadata. Releasing the player clears the entry
  // again (AudioPlayer.sharedObjectWillRelease), so there is nothing to tear down
  // here — and trying to would throw, since the native object is gone before a
  // cleanup callback could run.
  const applyLockScreenControls = useCallback(async () => {
    const metadata = {
      title: track.title,
      artist: track.artist,
      albumTitle: ALBUM_TITLE,
      artworkUrl: Platform.OS === 'android' ? track.artworkUrl : await resolveBundledArtworkUri(),
    };

    if (hasLockScreenControls.current) {
      player.updateLockScreenMetadata(metadata);
      return;
    }
    // Flagged only once the session exists: a throw here would otherwise leave
    // every later song taking the metadata-only path against a session that was
    // never created.
    player.setActiveForLockScreen(true, metadata, LOCK_SCREEN_OPTIONS);
    hasLockScreenControls.current = true;
  }, [player, track.title, track.artist, track.artworkUrl]);

  const pause = useCallback(() => {
    setPlayIntent(false);
    player.pause();
  }, [player, setPlayIntent]);

  const play = useCallback(() => {
    setPlayIntent(true);
    // The recording never arrived last time round — ask for it again, and let the
    // effect that starts playback take over once it lands.
    if (hasDownloadError) {
      setFailedUrl(null);
      setDownloadAttempt((attempt) => attempt + 1);
    }
    void (async () => {
      try {
        await setAudioModeAsync(SONG_AUDIO_MODE);
        await ensureNotificationPermission();
        // A song took over while this was awaiting. Everything below states this
        // song to the OS and moves the playhead on its behalf, so a stale request
        // has to stop here: it would otherwise put the previous song back on the
        // lock screen — where it would stay, since the song that took over states
        // itself only once its own recording arrives.
        if (currentKey.current !== trackKey) return;
        await applyLockScreenControls();
        // A track parked at its end won't restart on play() alone; a paused one
        // resumes from where it stopped, so only rewind at the very end. Starting
        // over is a new run, so the repeats start counting again.
        if (player.duration > 0 && player.currentTime >= player.duration - END_OF_TRACK_EPSILON_S) {
          passesPlayed.current = 0;
          await player.seekTo(0);
        }
      } catch (error) {
        console.error('Failed to prepare song audio', error);
      }
      // Only ever start the recording this song asked for. The player keeps the
      // previous song's source until the new one has been fetched — a song change
      // just pauses it — so an unguarded play() here would resume the song before
      // this one, both while the fetch is in flight and after one has failed.
      // Leaving the latch set is what makes that safe: the effect below starts
      // playback the moment the right recording lands.
      if (
        shouldPlayWhenReady.current &&
        currentKey.current === trackKey &&
        loadedUrlRef.current === track.url
      ) {
        player.play();
      }
    })();
  }, [player, applyLockScreenControls, setPlayIntent, hasDownloadError, track.url, trackKey]);

  // Fetches the recording — from the cache on a replay — and hands it to the
  // player. Songs that share a melody share one file, so the URL may not change
  // between songs at all; that costs nothing, since the effect is keyed by URL.
  useEffect(() => {
    let isCancelled = false;

    void (async () => {
      try {
        const uri = await downloadRecording(track.url);
        if (isCancelled) return;
        player.replace({ uri });
        loadedUrlRef.current = track.url;
        setLoadedUrl(track.url);
        setFailedUrl(null);
      } catch (error) {
        console.error(`Failed to download song audio: ${track.url}`, error);
        if (isCancelled) return;
        // Drop the latch as well as recording the failure: nothing is going to
        // arrive to satisfy it, so leaving it set would keep the button busy for
        // good. The next press retries.
        setFailedUrl(track.url);
        setPlayIntent(false);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [track.url, player, downloadAttempt, setPlayIntent]);

  // Warms the next song's recording while this one plays, so rolling on to it is a
  // source swap rather than a download. Beyond the audible gap it closes, a long
  // silence between songs is what puts a backgrounded run at risk.
  useEffect(() => {
    const nextUrl = getNextSongAudioTrack(track)?.url;
    if (nextUrl === undefined || nextUrl === track.url) return;

    downloadRecording(nextUrl).catch((error: unknown) => {
      console.error(`Failed to prefetch song audio: ${nextUrl}`, error);
    });
  }, [track]);

  // A new song took over: play it from the top.
  const isLoaded = loadedUrl === track.url && status.isLoaded;
  useEffect(() => {
    if (loadedKey.current === trackKey) return;
    loadedKey.current = trackKey;
    passesPlayed.current = 0;
    setPlayIntent(true);

    // The recording is still on its way. Stop the one playing — replacing the
    // source starts the new one at the beginning — and let the effect below start
    // it when it lands.
    if (!isLoaded) {
      player.pause();
      return;
    }

    // Already loaded, so this song shares its recording with the one before it (a
    // shared melody). Rewind and go through play(), which is also what restates the
    // song on the lock screen — neither happens on its own when the file, and
    // possibly the playback, simply carry on.
    void player
      .seekTo(0)
      .catch((error: unknown) => {
        console.error('Failed to rewind song audio', error);
      })
      .finally(play);
  }, [trackKey, isLoaded, player, play, setPlayIntent]);

  // Starts playback once the recording is in — which for a press is well before the
  // download finishes — then drops the latch so a track that runs to its end is not
  // immediately replayed.
  //
  // Goes through `play()` rather than `player.play()` so the audio mode is applied
  // first: starting playback without it leaves iOS on its default `ambient`
  // category, which the ringer switch mutes — the playhead advances but nothing is
  // audible until the next press.
  useEffect(() => {
    if (!shouldPlayWhenReady.current) return;
    if (status.playing) {
      setPlayIntent(false);
      return;
    }
    if (isLoaded) {
      play();
    }
  }, [isLoaded, status.playing, play, setPlayIntent]);

  // Plays the recording again until it has run once per verse.
  //
  // The position check matters: replacing the source with the downloaded file also
  // emits `didJustFinish`, and treating that as a finished pass would restart
  // playback a second after it began.
  useEffect(() => {
    if (!status.didJustFinish) {
      hasCountedFinish.current = false;
      return;
    }
    if (hasCountedFinish.current) return;
    if (status.duration <= 0) return;
    if (status.currentTime < status.duration - END_OF_TRACK_EPSILON_S) return;

    hasCountedFinish.current = true;
    passesPlayed.current += 1;
    if (passesPlayed.current >= track.repeatCount) {
      onCompleted();
      return;
    }

    player
      .seekTo(0)
      .then(() => player.play())
      .catch((error: unknown) => {
        console.error('Failed to repeat song audio', error);
      });
  }, [
    status.didJustFinish,
    status.currentTime,
    status.duration,
    track.repeatCount,
    player,
    onCompleted,
  ]);

  // An unreachable or undecodable recording fails silently otherwise — the button
  // would just never leave its idle state. The URL is the useful half of the
  // report, so log it too.
  useEffect(() => {
    if (status.error) {
      console.error(`Song audio failed: ${track.url}`, status.error);
    }
  }, [status.error, track.url]);

  const toggle = useCallback(() => {
    if (status.playing) {
      pause();
      return;
    }
    // Playback already requested but the file hasn't arrived yet — a second press
    // cancels it rather than queueing another start.
    if (shouldPlayWhenReady.current) {
      setPlayIntent(false);
      return;
    }
    play();
  }, [status.playing, play, pause, setPlayIntent]);

  useImperativeHandle(controlsRef, () => ({ toggle, pause }), [toggle, pause]);

  const isPreparing = isPlayIntended && !status.playing;
  const progress = status.duration > 0 ? Math.min(1, status.currentTime / status.duration) : 0;

  useEffect(() => {
    onStatusChange({
      isPlaying: status.playing,
      isPreparing,
      hasError: status.error !== null || hasDownloadError,
      progress,
    });
  }, [status.playing, status.error, hasDownloadError, isPreparing, progress, onStatusChange]);
}
