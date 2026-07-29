import { Asset } from 'expo-asset';
import {
  requestNotificationPermissionsAsync,
  setAudioModeAsync,
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';
import { useCallback, useEffect, useRef } from 'react';
import { Platform } from 'react-native';

// How often the player reports status back to JS. Only the `playing` flag drives
// the UI, so this needs to be no finer than a button press feels.
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
// URL instead (see SongAudioMetadata.artworkUrl).
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

// A song screen stays mounted when another song is opened over it — the reference
// modal replaces itself with the new song, leaving the first screen in the stack —
// so leaving for another song has to stop its audio explicitly, or two recordings
// play at once. Overlays are deliberately not included: with the reference modal
// open the reader is still on the same song, so it keeps playing.
const activePausers = new Set<() => void>();

/** Stops audio playing on any mounted song screen. */
export function pauseSongAudio(): void {
  for (const pause of activePausers) pause();
}

interface SongAudioMetadata {
  readonly title: string;
  readonly artist: string;
  /**
   * Artwork for Android, where the media card uses it as a full-bleed background —
   * the collection's wide social image suits that, unlike an app icon. iOS draws a
   * small square thumbnail instead and uses the bundled icon.
   */
  readonly artworkUrl?: string;
}

interface SongAudioOptions {
  /**
   * Start as soon as the recording is ready. Not an auto-play feature: the player
   * is mounted only after the user presses play, so the press has already
   * happened by the time this hook runs, and waiting for a second one would be
   * wrong. Opening a song never starts playback.
   */
  readonly playWhenReady?: boolean;
  /**
   * How many times to play the recording back to back, one pass per verse. The
   * player stops after the last pass; pausing or leaving cancels the rest.
   */
  readonly repeatCount?: number;
  /** What the lock screen and notification show while this is playing. */
  readonly metadata?: SongAudioMetadata;
  /**
   * Called once the recording has played its last pass, so playback can carry on
   * into the next song. Not called when the listener pauses or leaves.
   */
  readonly onCompleted?: () => void;
}

interface SongAudioController {
  readonly isPlaying: boolean;
  /**
   * Playback was asked for but has not started — the recording is still being
   * fetched. Not `status.isBuffering`: with `downloadFirst` the wait happens before
   * the player has a source, so it never reports buffering.
   */
  readonly isPreparing: boolean;
  readonly hasError: boolean;
  /** Playback position as a fraction of the track, 0 when the length is unknown. */
  readonly progress: number;
  readonly toggle: () => void;
  /** Halt playback without losing the playhead. Registered for pauseSongAudio. */
  readonly pause: () => void;
}

/**
 * Plays a single song recording with play/pause semantics — pausing keeps the
 * playhead, so the next press resumes from there.
 *
 * The file is fetched and cached first, then played from local storage
 * (`downloadFirst`). Recordings are only a few hundred KB, and this avoids
 * playing over the network altogether: iOS applies App Transport Security to
 * AVFoundation media loads separately from URLSession, so a plain-HTTP dev-server
 * URL is safer downloaded than streamed. It also makes a replay instant.
 *
 * Mounting starts the download, so callers should mount this only once the user
 * has asked to play — see SongAudioButton. Unmounting releases the player, which
 * is how playback stops on navigation.
 */
export function useSongAudio(
  audioUrl: string,
  { playWhenReady = false, repeatCount = 1, metadata, onCompleted }: SongAudioOptions = {},
): SongAudioController {
  const player = useAudioPlayer(audioUrl, {
    updateInterval: STATUS_UPDATE_INTERVAL_MS,
    downloadFirst: true,
  });
  const status = useAudioPlayerStatus(player);
  // A press lands before the download finishes, while the player still has no
  // source and `play()` is a no-op. Latch the intent and start on arrival.
  const shouldPlayWhenReady = useRef(playWhenReady);
  // Passes completed in the current run, so repeats stop at the verse count.
  const passesPlayed = useRef(0);

  const pause = useCallback(() => {
    shouldPlayWhenReady.current = false;
    player.pause();
  }, [player]);

  const play = useCallback(() => {
    shouldPlayWhenReady.current = true;
    void (async () => {
      try {
        await setAudioModeAsync(SONG_AUDIO_MODE);
        await ensureNotificationPermission();
        // Hands the OS the transport controls: lock screen, Control Center, and
        // the Android notification that keeps background playback alive. Releasing
        // the player clears the entry again (AudioPlayer.sharedObjectWillRelease),
        // so there is nothing to tear down here — and trying to would throw, since
        // the native object is gone before a cleanup callback could run.
        player.setActiveForLockScreen(
          true,
          {
            ...metadata,
            albumTitle: 'Indirimbo',
            artworkUrl:
              Platform.OS === 'android' ? metadata?.artworkUrl : await resolveBundledArtworkUri(),
          },
          LOCK_SCREEN_OPTIONS,
        );
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
      if (shouldPlayWhenReady.current) {
        player.play();
      }
    })();
  }, [player, metadata]);

  // Starts playback requested before the file was ready, then drops the latch so
  // a track that runs to its end is not immediately replayed.
  //
  // Goes through `play()` rather than `player.play()` so the audio mode is applied
  // first: starting playback without it leaves iOS on its default `ambient`
  // category, which the ringer switch mutes — the playhead advances but nothing is
  // audible until the next press.
  useEffect(() => {
    if (!shouldPlayWhenReady.current) return;
    if (status.playing) {
      shouldPlayWhenReady.current = false;
      return;
    }
    if (status.isLoaded) {
      play();
    }
  }, [status.isLoaded, status.playing, play]);

  // Plays the recording again until it has run once per verse.
  //
  // The position check matters: replacing the source with the downloaded file also
  // emits `didJustFinish`, and treating that as a finished pass would restart
  // playback a second after it began.
  useEffect(() => {
    if (!status.didJustFinish) return;
    if (status.duration <= 0) return;
    if (status.currentTime < status.duration - END_OF_TRACK_EPSILON_S) return;

    passesPlayed.current += 1;
    if (passesPlayed.current >= repeatCount) {
      onCompleted?.();
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
    repeatCount,
    player,
    onCompleted,
  ]);

  useEffect(() => {
    activePausers.add(pause);
    return () => {
      activePausers.delete(pause);
    };
  }, [pause]);

  // An unreachable or undecodable recording fails silently otherwise — the
  // button would just never leave its idle state. The URL is the useful half of
  // the report, so log it too.
  useEffect(() => {
    if (status.error) {
      console.error(`Song audio failed: ${audioUrl}`, status.error);
    }
  }, [status.error, audioUrl]);

  const toggle = useCallback(() => {
    if (status.playing) {
      pause();
      return;
    }
    // Playback already requested but the file hasn't arrived yet — a second press
    // cancels it rather than queueing another start.
    if (shouldPlayWhenReady.current) {
      shouldPlayWhenReady.current = false;
      return;
    }
    play();
  }, [status.playing, play, pause]);

  const progress =
    status.duration > 0 ? Math.min(1, status.currentTime / status.duration) : 0;

  return {
    isPlaying: status.playing,
    // Derived at render rather than tracked as state: the press that sets the latch
    // renders this component anyway, and every later transition arrives as a status
    // update, so there is nothing an effect would catch that this misses.
    isPreparing: shouldPlayWhenReady.current && !status.playing,
    hasError: status.error !== null,
    progress,
    toggle,
    pause,
  };
}
