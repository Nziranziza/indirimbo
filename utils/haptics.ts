import * as Haptics from 'expo-haptics';

// Centralized haptic feedback.
//
// iOS routes through the Taptic Engine via `impactAsync` / `notificationAsync`.
// Android exposes the platform's native HapticFeedbackConstants palette via
// `performAndroidHapticsAsync` (expo-haptics SDK 53+); calling `impactAsync`
// on Android falls back to a single generic vibration that feels nothing
// like the iOS counterparts. Mapping each helper to the appropriate Android
// constant gets us the right feel on both platforms.
//
// Web has no equivalent.

const isAndroid = (): boolean => process.env.EXPO_OS === 'android';
const isIOS = (): boolean => process.env.EXPO_OS === 'ios';

export function lightImpact(): void {
  if (isIOS()) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  } else if (isAndroid()) {
    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Keyboard_Tap).catch(() => {});
  }
}

export function mediumImpact(): void {
  if (isIOS()) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  } else if (isAndroid()) {
    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Virtual_Key).catch(() => {});
  }
}

export function heavyImpact(): void {
  if (isIOS()) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
  } else if (isAndroid()) {
    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Long_Press).catch(() => {});
  }
}

export function successNotification(): void {
  if (isIOS()) {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  } else if (isAndroid()) {
    Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm).catch(() => {});
  }
}
