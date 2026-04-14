import { useColors } from '@/hooks/use-colors';
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '../themed-text';
import { IconSymbol } from './icon-symbol';

const DISMISS_THRESHOLD = 30;
const DIAMOND = 12;

interface FavoriteSuggestionTooltipProps {
  readonly headerHeight: number;
  readonly arrowRightOffset: number;
  readonly onDismiss: () => void;
  readonly onAddToFavorites: () => void;
}

export function FavoriteSuggestionTooltip({
  headerHeight,
  arrowRightOffset,
  onDismiss,
  onAddToFavorites,
}: FavoriteSuggestionTooltipProps) {
  const colors = useColors();
  const translateY = useSharedValue(-15);
  const opacity = useSharedValue(0);
  const isDismissing = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const borderColor = colors.icon + '25';

  const dismiss = useCallback(() => {
    if (isDismissing.current) return;
    isDismissing.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    translateY.value = withTiming(-15, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 });
    timerRef.current = setTimeout(onDismiss, 210);
  }, [onDismiss, translateY, opacity]);

  const accept = useCallback(() => {
    if (isDismissing.current) return;
    isDismissing.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    translateY.value = withTiming(-15, { duration: 200 });
    opacity.value = withTiming(0, { duration: 200 });
    timerRef.current = setTimeout(onAddToFavorites, 210);
  }, [onAddToFavorites, translateY, opacity]);

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 18, stiffness: 140 });
    opacity.value = withTiming(1, { duration: 250 });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [translateY, opacity]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY < 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY < -DISMISS_THRESHOLD) {
        runOnJS(dismiss)();
      } else {
        translateY.value = withSpring(0, { damping: 18, stiffness: 140 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <GestureHandlerRootView style={[styles.gestureRoot, { top: headerHeight }]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          {/* Arrow — rotated square, fully in flow, zIndex above card */}
          <View style={[styles.arrowRow, { paddingRight: arrowRightOffset - DIAMOND / 2 }]}>
            <View
              style={[
                styles.diamond,
                {
                  backgroundColor: colors.background,
                  borderTopColor: borderColor,
                  borderLeftColor: borderColor,
                },
              ]}
            />
          </View>
          {/* Card body */}
          <View
            style={[
              styles.container,
              {
                backgroundColor: colors.background,
                borderColor,
                shadowColor: '#000',
              },
            ]}
          >
            <TouchableOpacity
              style={styles.content}
              onPress={accept}
              activeOpacity={0.8}
              accessibilityLabel="Add to favorites"
              accessibilityRole="button"
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.tint + '15' }]}>
                <IconSymbol name="heart.fill" size={24} color={colors.tint} />
              </View>
              <View style={styles.textContainer}>
                <ThemedText style={styles.title}>Add to Your Favorites</ThemedText>
                <ThemedText style={[styles.description, { color: colors.icon }]}>
                  Save songs you love for quick access anytime.
                </ThemedText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={dismiss}
              style={[styles.closeButton, { backgroundColor: colors.icon + '20' }]}
              activeOpacity={0.7}
              accessibilityLabel="Dismiss"
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <IconSymbol name="xmark" size={12} color={colors.icon} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    position: 'absolute',
    left: 40,
    right: 12,
    zIndex: 100,
  },
  arrowRow: {
    alignItems: 'flex-end',
    marginBottom: -7,
    zIndex: 2,
  },
  diamond: {
    width: DIAMOND,
    height: DIAMOND,
    transform: [{ rotate: '45deg' }],
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
    gap: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
});
