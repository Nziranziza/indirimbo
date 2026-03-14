import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BackToTopButtonProps {
  scrollY: SharedValue<number>;
  onPress: () => void;
}

export function BackToTopButton({ scrollY, onPress }: BackToTopButtonProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottom = Platform.OS === 'ios' ? insets.bottom + 16 : 16;

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const showThreshold = 500;
    const animationDistance = 200;
    const opacity = interpolate(
      scrollY.value,
      [showThreshold - animationDistance, showThreshold],
      [0, 1],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [showThreshold - animationDistance, showThreshold],
      [30, 0],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [showThreshold - animationDistance, showThreshold],
      [0.5, 1],
      Extrapolation.CLAMP
    );
    return {
      opacity,
      transform: [{ translateY }, { scale }],
      pointerEvents: scrollY.value >= showThreshold ? 'auto' : 'none',
    };
  }, []);

  return (
    <Animated.View pointerEvents="box-none" style={[styles.container, { bottom }]}>
      <Animated.View pointerEvents="box-none" style={[styles.shadow, animatedStyle]}>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.8}
          style={[styles.touchable, { backgroundColor: colors.tint }]}>
          <View pointerEvents="none">
            <IconSymbol name="arrow.up" size={24} color={colors.background} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 20,
    zIndex: 20,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderRadius: 28,
  },
  touchable: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
