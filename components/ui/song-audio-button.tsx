import { memo, useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import { SONG_NAV_BUTTON_SIZE } from '@/constants/layout';
import { useColors } from '@/hooks/use-colors';
import { useSongAudio } from '@/hooks/use-song-audio';
import { useTranslation } from '@/hooks/use-translation';
import { lightImpact } from '@/utils/haptics';

const ICON_SIZE = 26;
const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 };
const PROGRESS_LINE_HEIGHT = 2;

interface AudioCircleButtonProps {
  readonly iconName: IconSymbolName;
  readonly accessibilityLabel: string;
  readonly onPress: () => void;
  /** Show a spinner in place of the icon while the recording is being fetched. */
  readonly isBusy?: boolean;
}

const AudioCircleButton = memo(function AudioCircleButton({
  iconName,
  accessibilityLabel,
  onPress,
  isBusy = false,
}: AudioCircleButtonProps) {
  const colors = useColors();

  const handlePress = useCallback(() => {
    lightImpact();
    onPress();
  }, [onPress]);

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.tint }]}
      onPress={handlePress}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      activeOpacity={0.7}
      hitSlop={HIT_SLOP}
    >
      {isBusy ? (
        <ActivityIndicator size="small" color={colors.background} />
      ) : (
        <IconSymbol name={iconName} size={ICON_SIZE} color={colors.background} />
      )}
    </TouchableOpacity>
  );
});

interface SongAudioButtonProps {
  readonly audioUrl: string;
  /** Passes to play back to back — one per verse. */
  readonly repeatCount: number;
  /** Shown on the lock screen and in the Android notification. */
  readonly title: string;
  readonly artist: string;
  /** Collection artwork, used by Android's media card. */
  readonly artworkUrl: string;
  /** Start playing on mount — set when playback carried over from the last song. */
  readonly startPlaying?: boolean;
  /** Playback finished every pass, so the next song can take over. */
  readonly onCompleted?: () => void;
}

// Fills the navigation bar's top border as the track plays. Absolutely positioned
// so it lays itself over the border of the bar that renders this button rather
// than taking part in its row layout.
//
// The fill is nested inside a full-width track: a percentage width resolves
// against the parent's content box, and the bar has horizontal padding, so a
// fill placed directly in it would stop ~10% short of the end.
const SongAudioProgressLine = memo(function SongAudioProgressLine({
  progress,
}: {
  readonly progress: number;
}) {
  const colors = useColors();

  return (
    <View
      style={styles.progressTrack}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View
        style={[styles.progressFill, { backgroundColor: colors.tint, width: `${progress * 100}%` }]}
      />
    </View>
  );
});

// Owns the player, so it is mounted only once playback has been asked for.
function SongAudioPlayer({
  audioUrl,
  repeatCount,
  title,
  artist,
  artworkUrl,
  onCompleted,
}: SongAudioButtonProps) {
  const { t } = useTranslation();
  const metadata = useMemo(() => ({ title, artist, artworkUrl }), [title, artist, artworkUrl]);
  const { isPlaying, isPreparing, hasError, progress, toggle } = useSongAudio(audioUrl, {
    // The press that mounted this component is the play press.
    playWhenReady: true,
    repeatCount,
    metadata,
    onCompleted,
  });

  const iconName: IconSymbolName = hasError
    ? 'exclamationmark.triangle'
    : isPlaying
      ? 'pause.fill'
      : 'play.fill';

  return (
    <>
      <SongAudioProgressLine progress={progress} />
      <AudioCircleButton
        iconName={iconName}
        // While fetching, a press cancels the pending playback, so it reads as pause.
        accessibilityLabel={t(
          isPlaying || isPreparing ? 'common.song.pauseAudioA11y' : 'common.song.playAudioA11y',
        )}
        onPress={toggle}
        isBusy={isPreparing && !hasError}
      />
    </>
  );
}

/**
 * Play/pause control for a song's official recording, shown in place of the song
 * counter when a recording exists. Playback progress fills the navigation bar's
 * top border, and the recording repeats once per verse.
 *
 * The player mounts on the first press rather than on render: it starts
 * downloading the recording as soon as it exists, which would otherwise cost a
 * few hundred KB for every song opened, and it builds a DOM `Audio` element that
 * cannot be constructed while the web song pages are prerendered in Node.
 */
export function SongAudioButton({
  audioUrl,
  repeatCount,
  title,
  artist,
  artworkUrl,
  startPlaying = false,
  onCompleted,
}: SongAudioButtonProps) {
  const { t } = useTranslation();
  const [hasStarted, setHasStarted] = useState(startPlaying);

  const handleStart = useCallback(() => setHasStarted(true), []);

  if (!hasStarted) {
    return (
      <AudioCircleButton
        iconName="play.fill"
        accessibilityLabel={t('common.song.playAudioA11y')}
        onPress={handleStart}
      />
    );
  }

  return (
    <SongAudioPlayer
      audioUrl={audioUrl}
      repeatCount={repeatCount}
      title={title}
      artist={artist}
      artworkUrl={artworkUrl}
      onCompleted={onCompleted}
    />
  );
}

const styles = StyleSheet.create({
  progressTrack: {
    position: 'absolute',
    // Sits on the bar's 1px top border rather than below it.
    top: -PROGRESS_LINE_HEIGHT / 2,
    left: 0,
    right: 0,
    height: PROGRESS_LINE_HEIGHT,
  },
  progressFill: {
    height: '100%',
  },
  button: {
    width: SONG_NAV_BUTTON_SIZE,
    height: SONG_NAV_BUTTON_SIZE,
    borderRadius: SONG_NAV_BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
