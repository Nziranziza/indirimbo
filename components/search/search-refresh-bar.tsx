import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  type LayoutChangeEvent,
} from 'react-native';

export const REFRESH_BAR_HEIGHT = 3;
const SEGMENT_RATIO = 0.35;
const SWEEP_DURATION = 850;

// Thin indeterminate progress bar. A segment slides back and forth within the
// track to signal a background refresh. It stays fully inside the track (never
// translated off-screen), so it's visible even before the animation advances.
// Built-in Animated API so it runs on web and native without extra setup.
export function SearchRefreshBar() {
  const colors = useColors();
  const { t } = useTranslation();
  const windowWidth = useWindowDimensions().width;
  const [measuredWidth, setMeasuredWidth] = useState(0);
  // Fall back to window width until onLayout measures, so the segment is sized.
  const width = measuredWidth || windowWidth;
  const segmentWidth = Math.max(1, width * SEGMENT_RATIO);
  const travel = Math.max(0, width - segmentWidth);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: SWEEP_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: SWEEP_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [progress]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, travel],
  });

  return (
    <View
      style={[styles.track, { backgroundColor: colors.tint + '22' }]}
      onLayout={(event: LayoutChangeEvent) => setMeasuredWidth(event.nativeEvent.layout.width)}
      accessibilityRole="progressbar"
      accessibilityLabel={t('search.searching')}
    >
      <Animated.View
        style={[
          styles.segment,
          { width: segmentWidth, backgroundColor: colors.tint, transform: [{ translateX }] },
        ]}
      />
    </View>
  );
}

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
