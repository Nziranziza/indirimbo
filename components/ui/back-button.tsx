import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { router, type Href } from 'expo-router';
import { Platform, StyleSheet, TouchableOpacity, type ViewStyle } from 'react-native';

interface BackButtonProps {
  onPress?: () => void;
  fallbackHref?: Href;
  color?: string;
  style?: ViewStyle;
  hitSlop?: { top: number; bottom: number; left: number; right: number };
}

function handleBack(fallback: Href) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      router.replace(fallback);
    }
  } else if (router.canGoBack()) {
    router.back();
  } else {
    router.replace(fallback);
  }
}

export function BackButton({ onPress, fallbackHref, color, style, hitSlop }: BackButtonProps) {
  const colors = useColors();
  const fallback = fallbackHref ?? '/(tabs)/(home)';

  return (
    <TouchableOpacity
      onPress={onPress ?? (() => handleBack(fallback))}
      style={[styles.backButton, style]}
      activeOpacity={0.7}
      accessibilityLabel="Go back"
      accessibilityRole="button"
      hitSlop={hitSlop ?? { left: 20, right: 10, top: 10, bottom: 10 }}>
      <IconSymbol name="arrow.left" size={24} color={color ?? colors.tint} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    marginLeft: -8,
  },
});
