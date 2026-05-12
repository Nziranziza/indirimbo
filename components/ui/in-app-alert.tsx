import { useColors } from '@/hooks/use-colors';
import {
  heavyImpact,
  lightImpact,
  mediumImpact,
  successNotification,
} from '@/utils/haptics';
import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
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
const ANIMATION_OUT_MS = 250;
const ANIMATION_IN_MS = 200;
const BOTTOM_TWEEN_MS = 250;

export type InAppAlertHaptic = 'none' | 'light' | 'medium' | 'heavy' | 'success';

export interface InAppAlertAction {
  readonly label: string;
  readonly onPress: () => void;
}

interface InAppAlertBaseProps {
  readonly visible: boolean;
  readonly icon: IconSymbolName;
  /** Primary text (bold). */
  readonly title: string;
  /** Optional secondary line shown beneath the title in a lighter style. */
  readonly message?: string;
  readonly onDismiss: () => void;
  /** Distance from the bottom of the screen. Animates when changed. */
  readonly bottomOffset: number;
  /** Auto-dismiss timeout in ms. Defaults to 3000. Pass 0 to disable auto-dismiss. */
  readonly duration?: number;
  readonly action?: InAppAlertAction;
  /** Haptic fired once when the alert appears. Defaults to 'light'. */
  readonly haptic?: InAppAlertHaptic;
  /** Cap the title to N lines. Defaults to 1 when `message` is set, else 2. */
  readonly titleNumberOfLines?: number;
}

/** When dismissible, dismissA11y is required so non-English locales aren't silently served the English fallback. */
type InAppAlertDismissProps =
  | { readonly dismissible: true; readonly dismissA11y: string }
  | { readonly dismissible?: false; readonly dismissA11y?: never };

type InAppAlertProps = InAppAlertBaseProps & InAppAlertDismissProps;

function fireHaptic(haptic: InAppAlertHaptic): void {
  switch (haptic) {
    case 'light':
      lightImpact();
      return;
    case 'medium':
      mediumImpact();
      return;
    case 'heavy':
      heavyImpact();
      return;
    case 'success':
      successNotification();
      return;
    case 'none':
      return;
  }
}

export function InAppAlert({
  visible,
  icon,
  title,
  message,
  onDismiss,
  bottomOffset,
  duration = DEFAULT_DURATION_MS,
  action,
  haptic = 'light',
  titleNumberOfLines,
  dismissible,
  dismissA11y,
}: InAppAlertProps) {
  const colors = useColors();
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const animatedBottom = useSharedValue(bottomOffset);
  const isDismissing = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasVisibleRef = useRef(false);

  useEffect(() => {
    animatedBottom.value = withTiming(bottomOffset, { duration: BOTTOM_TWEEN_MS });
  }, [bottomOffset, animatedBottom]);

  const dismiss = useCallback(() => {
    if (isDismissing.current) return;
    isDismissing.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    translateY.value = withTiming(100, { duration: ANIMATION_OUT_MS });
    opacity.value = withTiming(0, { duration: ANIMATION_OUT_MS });
    timerRef.current = setTimeout(onDismiss, ANIMATION_OUT_MS + 10);
  }, [onDismiss, translateY, opacity]);

  const handleAction = useCallback(() => {
    if (!action || isDismissing.current) return;
    isDismissing.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    translateY.value = withTiming(100, { duration: ANIMATION_OUT_MS });
    opacity.value = withTiming(0, { duration: ANIMATION_OUT_MS });
    timerRef.current = setTimeout(() => {
      action.onPress();
      onDismiss();
    }, ANIMATION_OUT_MS + 10);
  }, [action, onDismiss, translateY, opacity]);

  useEffect(() => {
    if (!visible) {
      wasVisibleRef.current = false;
      return;
    }
    isDismissing.current = false;
    translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
    opacity.value = withTiming(1, { duration: ANIMATION_IN_MS });
    if (!wasVisibleRef.current) {
      wasVisibleRef.current = true;
      fireHaptic(haptic);
    }
    if (duration > 0) {
      timerRef.current = setTimeout(dismiss, duration);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, duration, dismiss, haptic, translateY, opacity]);

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

  const rootStyle = useAnimatedStyle(() => ({
    bottom: animatedBottom.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.gestureRoot, rootStyle]} pointerEvents="box-none">
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

          <View style={styles.textContainer}>
            <ThemedText style={styles.title} numberOfLines={titleNumberOfLines ?? (message ? 1 : 2)}>
              {title}
            </ThemedText>
            {message && (
              <ThemedText style={[styles.message, { color: colors.icon }]} numberOfLines={2}>
                {message}
              </ThemedText>
            )}
          </View>

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

          {dismissible && (
            <TouchableOpacity
              onPress={dismiss}
              style={[styles.closeButton, { backgroundColor: colors.icon + '20' }]}
              activeOpacity={0.7}
              accessibilityLabel={dismissA11y}
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <IconSymbol name="xmark" size={11} color={colors.icon} />
            </TouchableOpacity>
          )}
        </Animated.View>
      </GestureDetector>
    </Animated.View>
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
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  message: {
    fontSize: 12,
    lineHeight: 16,
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
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
