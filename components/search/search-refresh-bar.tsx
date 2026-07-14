import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import { memo, useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View, type LayoutChangeEvent } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

export const REFRESH_BAR_HEIGHT = 3;
const SEGMENT_RATIO = 0.35;
const SWEEP_DURATION = 850;

// Thin indeterminate progress bar: a segment eases back and forth within the
// track to signal a background refresh. Runs on reanimated's UI thread with a
// reversing repeat, so it animates smoothly regardless of JS-thread work or
// re-renders (RN's Animated stalled here on the New Architecture).
export const SearchRefreshBar = memo(function SearchRefreshBar() {
  const colors = useColors();
  const { t } = useTranslation();
  const windowWidth = useWindowDimensions().width;
  const [measuredWidth, setMeasuredWidth] = useState(0);
  // Fall back to window width until onLayout measures, so the segment is sized.
  const width = measuredWidth || windowWidth;
  const segmentWidth = Math.max(1, width * SEGMENT_RATIO);
  const travel = Math.max(0, width - segmentWidth);
  const progress = useSharedValue(0);

  useEffect(() => {
    // -1 = infinite, reverse = true gives an eased there-and-back ping-pong.
    progress.value = withRepeat(
      withTiming(1, { duration: SWEEP_DURATION, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: interpolate(progress.value, [0, 1], [0, travel]) }],
  }));

  return (
    <View
      style={[styles.track, { backgroundColor: colors.tint + '22' }]}
      onLayout={(event: LayoutChangeEvent) => setMeasuredWidth(event.nativeEvent.layout.width)}
      accessibilityRole="progressbar"
      accessibilityLabel={t('search.searching')}
    >
      <Animated.View
        style={[styles.segment, { width: segmentWidth, backgroundColor: colors.tint }, animatedStyle]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  track: {
    height: REFRESH_BAR_HEIGHT,
    width: '100%',
    borderRadius: REFRESH_BAR_HEIGHT / 2,
    overflow: 'hidden',
  },
  segment: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: REFRESH_BAR_HEIGHT / 2,
  },
});
