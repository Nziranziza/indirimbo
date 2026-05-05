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
import { IconSymbol, type IconSymbolName } from './icon-symbol';

const DEFAULT_DURATION_MS = 3_000;
const DISMISS_THRESHOLD = 40;

export interface InAppAlertAction {
  readonly label: string;
  readonly onPress: () => void;
}

interface InAppAlertProps {
  readonly visible: boolean;
  readonly icon: IconSymbolName;
  readonly message: string;
  readonly onDismiss: () => void;
  /** Distance from the bottom of the screen. Caller decides how much to clear (safe area, nav bars, etc.). */
  readonly bottomOffset: number;
  /** Auto-dismiss timeout in ms. Defaults to 3000. Pass 0 to disable auto-dismiss. */
  readonly duration?: number;
  readonly action?: InAppAlertAction;
}

export function InAppAlert({
  visible,
  icon,
  message,
  onDismiss,
  bottomOffset,
  duration = DEFAULT_DURATION_MS,
  action,
}: InAppAlertProps) {
  const colors = useColors();
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const isDismissing = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    if (isDismissing.current) return;
    isDismissing.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    translateY.value = withTiming(100, { duration: 250 });
    opacity.value = withTiming(0, { duration: 250 });
    timerRef.current = setTimeout(onDismiss, 260);
  }, [onDismiss, translateY, opacity]);

  const handleAction = useCallback(() => {
    if (!action || isDismissing.current) return;
    isDismissing.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    translateY.value = withTiming(100, { duration: 250 });
    opacity.value = withTiming(0, { duration: 250 });
    timerRef.current = setTimeout(() => {
      action.onPress();
      onDismiss();
    }, 260);
  }, [action, onDismiss, translateY, opacity]);

  useEffect(() => {
    if (!visible) return;
    isDismissing.current = false;
    translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
    opacity.value = withTiming(1, { duration: 200 });
    if (duration > 0) {
      timerRef.current = setTimeout(dismiss, duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, duration, dismiss, translateY, opacity]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_THRESHOLD) {
        runOnJS(dismiss)();
      } else {
        translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <GestureHandlerRootView style={[styles.gestureRoot, { bottom: bottomOffset }]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: colors.background,
              borderColor: colors.icon + '15',
              shadowColor: '#000',
            },
            animatedStyle,
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.tint + '15' }]}>
            <IconSymbol name={icon} size={18} color={colors.tint} />
          </View>

          <ThemedText style={styles.text} numberOfLines={2}>
            {message}
          </ThemedText>

          {action && (
            <TouchableOpacity
              onPress={handleAction}
              style={[styles.button, { backgroundColor: colors.tint }]}
              activeOpacity={0.8}
              accessibilityLabel={action.label}
              accessibilityRole="button"
            >
              <ThemedText style={[styles.buttonText, { color: colors.tintForeground }]}>
                {action.label}
              </ThemedText>
            </TouchableOpacity>
          )}
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 50,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
