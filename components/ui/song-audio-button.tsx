import { memo, useCallback } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import { SONG_NAV_BUTTON_SIZE } from '@/constants/layout';
import { useSongTrackAudio } from '@/contexts/song-audio-context';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import { lightImpact } from '@/utils/haptics';
import type { SongAudioTrack } from '@/utils/song-audio';

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
  readonly track: SongAudioTrack;
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

/**
 * Play/pause control for a song's official recording, shown in place of the song
 * counter when a recording exists. Playback progress fills the navigation bar's
 * top border, and the recording repeats once per verse.
 *
 * The player itself lives in SongAudioProvider, not here — this only shows and
 * drives the state of one song within it.
 */
export function SongAudioButton({ track }: SongAudioButtonProps) {
  const { t } = useTranslation();
  const { isPlaying, isPreparing, hasError, progress, toggle } = useSongTrackAudio(track);

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
