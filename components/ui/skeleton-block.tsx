import { useColors } from "@/hooks/use-colors";
import { useEffect } from "react";
import type { DimensionValue, StyleProp, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface SkeletonBlockProps {
  readonly width?: DimensionValue;
  readonly height?: number;
  readonly borderRadius?: number;
  readonly style?: StyleProp<ViewStyle>;
}

const PULSE_MIN_OPACITY = 0.35;
const PULSE_MAX_OPACITY = 0.7;
const PULSE_DURATION_MS = 900;

export function SkeletonBlock({
  width,
  height = 12,
  borderRadius = 6,
  style,
}: SkeletonBlockProps) {
  const colors = useColors();
  const opacity = useSharedValue(PULSE_MIN_OPACITY);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(PULSE_MAX_OPACITY, {
        duration: PULSE_DURATION_MS,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.icon + "30",
        },
        animatedStyle,
        style,
      ]}
    />
  );
}
