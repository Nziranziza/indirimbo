import * as Haptics from 'expo-haptics';

// Centralized haptic feedback. Currently iOS-only; widen the platform check
// here when adding Android support.
const isHapticsSupported = (): boolean => process.env.EXPO_OS === 'ios';

export function lightImpact(): void {
  if (!isHapticsSupported()) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

export function mediumImpact(): void {
  if (!isHapticsSupported()) return;
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
}

export function successNotification(): void {
  if (!isHapticsSupported()) return;
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}
