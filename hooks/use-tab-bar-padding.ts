import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Hook to get the proper bottom padding for content in native tabs
 * This ensures content is not hidden behind the tab bar
 */
export function useTabBarPadding() {
  const insets = useSafeAreaInsets();

  // Native tabs handle content insets on iOS automatically for the first ScrollView
  // But we still need explicit padding on Android and as a safety buffer on iOS
  const bottomPadding = Platform.OS === 'ios' 
    ? Math.max(insets.bottom + 20, 20) // iOS auto-handles tab bar, just add safe area + buffer
    : Math.max(insets.bottom + 70, 80); // Android needs explicit tab bar height (~56-72px)

  return bottomPadding;
}
