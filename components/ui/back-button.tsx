import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, type ViewStyle } from 'react-native';

interface BackButtonProps {
  onPress?: () => void;
  color?: string;
  style?: ViewStyle;
  hitSlop?: { top: number; bottom: number; left: number; right: number };
}

export function BackButton({ onPress, color, style, hitSlop }: BackButtonProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={onPress ?? (() => router.back())}
      style={[styles.backButton, style]}
      activeOpacity={0.7}
      hitSlop={hitSlop ?? { left: 20, right: 10, top: 10, bottom: 10 }}>
      <IconSymbol name="arrow.left" size={24} color={color ?? colors.tint} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginLeft: -8,
  },
});
