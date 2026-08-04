import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useSongAudio } from '@/contexts/song-audio-context';
import { trackEvent } from '@/utils/analytics';
import { isSameSongAudioTrack, type SongAudioTrack } from '@/utils/song-audio';

/**
 * Takes the reader to the song they can hear whenever they come back to this screen
 * — from the background, or from a modal opened over it.
 *
 * Tapping the OS media card is one reason this exists — it names a song, so it
 * should lead to it — but neither platform says the card is what reopened the app.
 * The Android notification carries nothing but the launch intent, built inside
 * expo-audio's playback service, and iOS offers no now-playing tap callback at all.
 * So the signal is a background-to-foreground return while a recording plays, which
 * a plain app switch also produces.
 *
 * The other reason is the reference modal: the run is held while it is open (see
 * useSuspendSongAudioAdvance), but not while the app is in the background, so a
 * reader can leave the app with the modal up, have playback move on, and come back
 * to dismiss it. Regaining focus is what covers that — nothing plays after a held
 * run, so an ordinary dismissal navigates nowhere.
 *
 * Three things keep this from hijacking navigation: it only runs from the song
 * screen — a reader who left from search or settings comes back to those — only
 * while something other than the song on screen is playing, and never on a screen's
 * first focus, or arriving at a song from search would bounce straight off it.
 */
export function useReturnToPlayingSong(screenTrack: SongAudioTrack | undefined): void {
  const router = useRouter();
  const { activeTrack, status } = useSongAudio();

  // What the listener below reads when it fires. Held in a ref because playback
  // moves on to the next song while the app is away, and re-registering the
  // listener for that would lose its record of having been backgrounded at all —
  // which is precisely the case this exists for.
  const latest = useRef({ activeTrack, isPlaying: status.isPlaying, screenTrack });
  useEffect(() => {
    latest.current = { activeTrack, isPlaying: status.isPlaying, screenTrack };
  }, [activeTrack, status.isPlaying, screenTrack]);

  const hasFocusedBefore = useRef(false);

  const goToPlayingSong = useCallback(() => {
    const { activeTrack: playing, isPlaying, screenTrack: onScreen } = latest.current;
    if (!playing || !isPlaying) return;
    if (onScreen && isSameSongAudioTrack(playing, onScreen)) return;

    trackEvent('navigate_song', { direction: 'resume', playlist: playing.playlist });
    router.replace({
      pathname: '/song/[playlist]/[songNumber]',
      params: {
        playlist: playing.playlist,
        songNumber: String(playing.songNumber),
        direction: 'forward',
      },
    });
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      // Coming back to this screen — the modal above it dismissed, most of the time.
      // The first focus is the reader arriving here on purpose, which is not a return.
      if (hasFocusedBefore.current) {
        goToPlayingSong();
      }
      hasFocusedBefore.current = true;

      // Only a real trip to the background counts. On iOS a glance at Control
      // Center or a pulled-down notification shade also reports 'inactive' and then
      // 'active' again, and that is not the reader coming back to anything.
      let hasBeenBackgrounded = false;

      const subscription = AppState.addEventListener('change', (state) => {
        if (state === 'background') {
          hasBeenBackgrounded = true;
          return;
        }
        if (state !== 'active' || !hasBeenBackgrounded) return;
        hasBeenBackgrounded = false;
        goToPlayingSong();
      });

      return () => subscription.remove();
    }, [goToPlayingSong]),
  );
}
