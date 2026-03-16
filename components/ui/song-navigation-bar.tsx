import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface SongNavigationBarProps {
  readonly currentIndex: number;
  readonly totalSongs: number;
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly bottomInset: number;
}

export function SongNavigationBar({
  currentIndex,
  totalSongs,
  onPrevious,
  onNext,
  bottomInset,
}: SongNavigationBarProps) {
  const colors = useColors();
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
        accessibilityLabel="Previous song"
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

      <ThemedView style={styles.songCounter}>
        <ThemedText style={[styles.counterText, { color: colors.icon }]}>
          {currentIndex + 1} / {totalSongs}
        </ThemedText>
      </ThemedView>

      <TouchableOpacity
        style={[
          styles.navButton,
          isLast && styles.navButtonDisabled,
          { backgroundColor: colors.tint + '20' },
        ]}
        onPress={onNext}
        disabled={isLast}
        accessibilityLabel="Next song"
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
    width: 48,
    height: 48,
    borderRadius: 24,
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
