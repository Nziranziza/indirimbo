import { useFocusEffect } from 'expo-router';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';
import {
  IDLE_SONG_AUDIO_STATUS,
  useSongAudioEngine,
  type SongAudioEngineControls,
  type SongAudioStatus,
} from '@/hooks/use-song-audio-engine';
import {
  getNextSongAudioTrack,
  isSameSongAudioTrack,
  type SongAudioTrack,
} from '@/utils/song-audio';

/** Takes the reader to the song playback has rolled on to. */
type AdvanceNavigator = (track: SongAudioTrack) => void;

interface SongAudioContextValue {
  /** The song the player holds — playing, paused, or still downloading. */
  readonly activeTrack: SongAudioTrack | null;
  readonly status: SongAudioStatus;
  /** Play this song, or pause it when it is the one already playing. */
  readonly toggle: (track: SongAudioTrack) => void;
  readonly pause: () => void;
  /**
   * Stops this song, and only this song — a no-op once playback has moved on. What
   * the song screen calls as it goes away: the reader leaving a song stops it, but
   * a recording rolling on to the next song unmounts that screen too, and that
   * playback has to survive it.
   */
  readonly pauseTrack: (track: SongAudioTrack) => void;
  /**
   * Registered by the song screen while it is the visible song, so a recording
   * rolling on to the next one takes the screen with it. Left unregistered, audio
   * still advances — it just doesn't move the reader, which is what should happen
   * when they have browsed away.
   */
  readonly setAdvanceNavigator: (navigate: AdvanceNavigator | null) => void;
  /**
   * Unregisters a navigator, but only while it is still the registered one. What a
   * screen calls as it goes away: an auto-advance replaces the song screen with the
   * next song's, and the outgoing screen's cleanup runs after the incoming one has
   * registered — so clearing the slot outright would drop the navigator that has
   * just taken over, and the advance after that would leave the reader behind.
   */
  readonly clearAdvanceNavigator: (navigate: AdvanceNavigator) => void;
  /**
   * Holds playback at the end of the song it is on, rather than rolling on to the
   * next one, until the returned function is called. For a screen that puts a song
   * in front of the reader: someone reading a song is not asking for the next one.
   *
   * Ignored while the app is in the background, where nobody is reading and the run
   * should carry on. Use the useSuspendSongAudioAdvance hook rather than this.
   */
  readonly suspendAdvance: () => () => void;
}

const SongAudioContext = createContext<SongAudioContextValue | null>(null);

// Owns the player. Kept out of SongAudioProvider's own body so the player is built
// only once a song has been asked for: it starts downloading the recording as soon
// as it exists, and on web it builds a DOM `Audio` element that cannot be
// constructed while the song pages are prerendered in Node. Once mounted it stays
// mounted for the rest of the session — unmounting releases the native player, and
// with it the media session and its notification.
function SongAudioEngine(props: Parameters<typeof useSongAudioEngine>[0]): null {
  useSongAudioEngine(props);
  return null;
}

/**
 * Holds song playback for the whole app: one player, one media session, one
 * notification, outliving the screens that start and show it.
 *
 * Playback used to live in the song screen, which meant a new native player per
 * song and a lock screen handover on every auto-advance. See useSongAudioEngine
 * for why that broke on Android.
 */
export function SongAudioProvider({ children }: { readonly children: ReactNode }) {
  const [activeTrack, setActiveTrack] = useState<SongAudioTrack | null>(null);
  const [status, setStatus] = useState<SongAudioStatus>(IDLE_SONG_AUDIO_STATUS);
  const controlsRef = useRef<SongAudioEngineControls | null>(null);
  const advanceNavigatorRef = useRef<AdvanceNavigator | null>(null);
  // The active track as of right now, for callers that run outside a render — an
  // unmount cleanup reads whatever its closure captured, which during a handover is
  // the song that has just been left behind.
  const activeTrackRef = useRef<SongAudioTrack | null>(null);
  // Screens currently holding the run back, counted rather than flagged: the
  // reference modal replaces itself with the next reference, so two of them are
  // mounted for a frame and the outgoing one must not release the incoming one.
  const advanceSuspensions = useRef(0);
  // Whether the app is in the background, where a held-back run should carry on
  // anyway. Tracked rather than read from AppState.currentState at the moment a song
  // ends, because that reports 'inactive' while the phone is being locked — the very
  // moment a listener is least likely to be reading.
  const isBackgrounded = useRef(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      // 'inactive' is a glance at Control Center or a pulled-down shade as much as a
      // lock in progress, so it settles nothing either way.
      if (state === 'background') isBackgrounded.current = true;
      if (state === 'active') isBackgrounded.current = false;
    });
    return () => subscription.remove();
  }, []);

  const suspendAdvance = useCallback(() => {
    advanceSuspensions.current += 1;
    let isReleased = false;
    return () => {
      if (isReleased) return;
      isReleased = true;
      advanceSuspensions.current -= 1;
    };
  }, []);

  const playTrack = useCallback((track: SongAudioTrack) => {
    activeTrackRef.current = track;
    setActiveTrack(track);
  }, []);

  const toggle = useCallback(
    (track: SongAudioTrack) => {
      // The engine starts whatever song it is handed, so switching songs is just a
      // state change; only the song already loaded needs the transport.
      if (activeTrack && isSameSongAudioTrack(activeTrack, track)) {
        controlsRef.current?.toggle();
        return;
      }
      playTrack(track);
    },
    [activeTrack, playTrack],
  );

  const pause = useCallback(() => {
    controlsRef.current?.pause();
  }, []);

  const pauseTrack = useCallback((track: SongAudioTrack) => {
    const active = activeTrackRef.current;
    if (active && isSameSongAudioTrack(active, track)) {
      controlsRef.current?.pause();
    }
  }, []);

  const setAdvanceNavigator = useCallback((navigate: AdvanceNavigator | null) => {
    advanceNavigatorRef.current = navigate;
  }, []);

  const clearAdvanceNavigator = useCallback((navigate: AdvanceNavigator) => {
    if (advanceNavigatorRef.current === navigate) {
      advanceNavigatorRef.current = null;
    }
  }, []);

  // Reads the track from the ref so this stays stable: the engine watches it, and a
  // handler that changed identity per song would restart that watch mid-handover.
  const handleCompleted = useCallback(() => {
    const finished = activeTrackRef.current;
    if (!finished) return;

    // A song is open in front of the reader, and the app is theirs to look at, so the
    // run ends here. Playback is left parked at the end of the recording; play()
    // rewinds a track in that state, so the song's own button starts it over.
    if (advanceSuspensions.current > 0 && !isBackgrounded.current) return;

    const next = getNextSongAudioTrack(finished);
    if (!next) return;

    playTrack(next);
    advanceNavigatorRef.current?.(next);
  }, [playTrack]);

  const value = useMemo(
    () => ({
      activeTrack,
      status,
      toggle,
      pause,
      pauseTrack,
      setAdvanceNavigator,
      clearAdvanceNavigator,
      suspendAdvance,
    }),
    [
      activeTrack,
      status,
      toggle,
      pause,
      pauseTrack,
      setAdvanceNavigator,
      clearAdvanceNavigator,
      suspendAdvance,
    ],
  );

  return (
    <SongAudioContext.Provider value={value}>
      {activeTrack !== null && (
        <SongAudioEngine
          track={activeTrack}
          controlsRef={controlsRef}
          onStatusChange={setStatus}
          onCompleted={handleCompleted}
        />
      )}
      {children}
    </SongAudioContext.Provider>
  );
}

export function useSongAudio(): SongAudioContextValue {
  const context = useContext(SongAudioContext);
  if (!context) {
    throw new Error('useSongAudio must be used within a SongAudioProvider');
  }
  return context;
}

/**
 * Holds playback at the end of the song it is on while this screen is the one in
 * front of the reader — a song they opened to read, not the next one in the run.
 *
 * Scoped to focus, which is what makes it right: the reference modal releases the
 * hold when it is dismissed, and equally when it replaces itself with another
 * reference. The hold does not apply while the app is in the background.
 */
export function useSuspendSongAudioAdvance(): void {
  const { suspendAdvance } = useSongAudio();
  useFocusEffect(useCallback(() => suspendAdvance(), [suspendAdvance]));
}

interface SongTrackAudio extends SongAudioStatus {
  /** Play this song, or pause it when it is the one playing. */
  readonly toggle: () => void;
}

/**
 * Playback state for one song's recording. Reports idle for every song but the one
 * the player currently holds, so each song's button only ever reflects itself.
 */
export function useSongTrackAudio(track: SongAudioTrack): SongTrackAudio {
  const { activeTrack, status, toggle } = useSongAudio();
  const isActive = activeTrack !== null && isSameSongAudioTrack(activeTrack, track);

  const toggleThisTrack = useCallback(() => toggle(track), [toggle, track]);

  return {
    ...(isActive ? status : IDLE_SONG_AUDIO_STATUS),
    toggle: toggleThisTrack,
  };
}
