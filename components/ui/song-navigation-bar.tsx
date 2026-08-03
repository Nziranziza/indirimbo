import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SongAudioButton } from '@/components/ui/song-audio-button';
import { SONG_NAV_BUTTON_SIZE } from '@/constants/layout';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface SongNavigationBarProps {
  readonly currentIndex: number;
  readonly totalSongs: number;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly bottomInset: number;
  /** URL of the song's official recording, when one exists. */
  readonly audioUrl?: string;
  /** Passes the recording plays back to back — one per verse. */
  readonly audioRepeatCount?: number;
  /** Song title and collection, shown on the lock screen while playing. */
  readonly audioTitle?: string;
  readonly audioArtist?: string;
  /** Collection artwork for the Android media card. */
  readonly audioArtworkUrl?: string;
  /** Playback carried over from the previous song, so start without a press. */
  readonly audioStartPlaying?: boolean;
  /** The recording finished every pass — used to roll on to the next song. */
  readonly onAudioCompleted?: () => void;
}

export function SongNavigationBar({
  currentIndex,
  totalSongs,
  onPrevious,
  onNext,
  bottomInset,
  audioUrl,
  audioRepeatCount = 1,
  audioTitle = '',
  audioArtist = '',
  audioArtworkUrl = '',
  audioStartPlaying = false,
  onAudioCompleted,
}: SongNavigationBarProps) {
  const colors = useColors();
  const { t } = useTranslation();
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSongs - 1;

  return (
    <ThemedView
      style={[
        styles.navigationBar,
        {
          borderTopColor: colors.icon + '20',
          paddingBottom: bottomInset + 16,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.navButton,
          isFirst && styles.navButtonDisabled,
          { backgroundColor: colors.tint + '20' },
        ]}
        onPress={onPrevious}
        disabled={isFirst}
        accessibilityLabel={t('common.song.previousA11y')}
        accessibilityRole="button"
        activeOpacity={0.7}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <IconSymbol
          name="arrow.left"
          size={24}
          color={isFirst ? colors.icon : colors.tint}
        />
      </TouchableOpacity>

      {/* Songs with a recording show the player; the rest keep the counter. */}
      {audioUrl ? (
        <SongAudioButton
          key={audioUrl}
          audioUrl={audioUrl}
          repeatCount={audioRepeatCount}
          title={audioTitle}
          artist={audioArtist}
          artworkUrl={audioArtworkUrl}
          startPlaying={audioStartPlaying}
          onCompleted={onAudioCompleted}
        />
      ) : (
        <ThemedView style={styles.songCounter}>
          <ThemedText style={[styles.counterText, { color: colors.icon }]}>
            {currentIndex + 1} / {totalSongs}
          </ThemedText>
        </ThemedView>
      )}

      <TouchableOpacity
        style={[
          styles.navButton,
          isLast && styles.navButtonDisabled,
          { backgroundColor: colors.tint + '20' },
        ]}
        onPress={onNext}
        disabled={isLast}
        accessibilityLabel={t('common.song.nextA11y')}
        accessibilityRole="button"
        activeOpacity={0.7}
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
      >
        <IconSymbol
          name="arrow.right"
          size={24}
          color={isLast ? colors.icon : colors.tint}
        />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  navigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 12,
    zIndex: 10,
  },
  navButton: {
    width: SONG_NAV_BUTTON_SIZE,
    height: SONG_NAV_BUTTON_SIZE,
    borderRadius: SONG_NAV_BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  songCounter: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  counterText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
