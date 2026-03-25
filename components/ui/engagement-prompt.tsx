import { useColors } from '@/hooks/use-colors';
import type { EngagementPromptType } from '@/hooks/use-engagement';
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

const AUTO_DISMISS_MS = 8_000;
const DISMISS_THRESHOLD = 40;

interface EngagementPromptProps {
  readonly type: EngagementPromptType;
  readonly songName?: string;
  readonly bottomInset: number;
  readonly onAccept: () => void;
  readonly onDismiss: () => void;
}

const PROMPT_CONFIG: Record<
  EngagementPromptType,
  { icon: IconSymbolName; text: string; button: string }
> = {
  rate: { icon: 'star.fill', text: 'Enjoying Indirimbo?', button: 'Rate' },
  share_app: { icon: 'person.2.fill', text: 'Know someone who\'d love this?', button: 'Share' },
  share_song: { icon: 'square.and.arrow.up', text: '', button: 'Share' },
};

function getPromptText(type: EngagementPromptType, songName?: string): string {
  if (type === 'share_song' && songName) {
    const truncated = songName.length > 22 ? `${songName.slice(0, 22)}...` : songName;
    return `Share ${truncated}`;
  }
  return PROMPT_CONFIG[type].text;
}

// Nav bar height: paddingTop(16) + button(48) + paddingBottom(bottomInset + 16) + border(1)
const NAV_BAR_PADDING = 16 + 48 + 16 + 1;

export function EngagementPrompt({ type, songName, bottomInset, onAccept, onDismiss }: EngagementPromptProps) {
  const colors = useColors();
  const translateY = useSharedValue(100);
  const opacity = useSharedValue(0);
  const isDismissing = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const config = PROMPT_CONFIG[type];
  const text = getPromptText(type, songName);

  const dismiss = useCallback(() => {
    if (isDismissing.current) return;
    isDismissing.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    translateY.value = withTiming(100, { duration: 250 });
    opacity.value = withTiming(0, { duration: 250 });
    timerRef.current = setTimeout(onDismiss, 260);
  }, [onDismiss, translateY, opacity]);

  const accept = useCallback(() => {
    if (isDismissing.current) return;
    isDismissing.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    translateY.value = withTiming(100, { duration: 250 });
    opacity.value = withTiming(0, { duration: 250 });
    timerRef.current = setTimeout(onAccept, 260);
  }, [onAccept, translateY, opacity]);

  // Entry animation
  useEffect(() => {
    translateY.value = withSpring(0, { damping: 15, stiffness: 120 });
    opacity.value = withTiming(1, { duration: 200 });

    timerRef.current = setTimeout(dismiss, AUTO_DISMISS_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [translateY, opacity, dismiss]);

  // Swipe-to-dismiss gesture
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

  return (
    <GestureHandlerRootView style={[styles.gestureRoot, { bottom: NAV_BAR_PADDING + bottomInset + 8 }]}>
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
            <IconSymbol name={config.icon} size={18} color={colors.tint} />
          </View>

          <ThemedText style={styles.text} numberOfLines={1}>
            {text}
          </ThemedText>

          <TouchableOpacity
            onPress={accept}
            style={[styles.button, { backgroundColor: colors.tint }]}
            activeOpacity={0.8}
            accessibilityLabel={config.button}
            accessibilityRole="button"
          >
            <ThemedText style={[styles.buttonText, { color: colors.tintForeground }]}>
              {config.button}
            </ThemedText>
          </TouchableOpacity>
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
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
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
