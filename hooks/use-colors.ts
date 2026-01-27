import { getColors } from '@/constants/theme';
import { useColorScheme, useTheme } from '@/contexts/theme-context';

/**
 * Hook to get colors with the current tint color preference
 */
export function useColors() {
  const colorScheme = useColorScheme();
  const { tintColor } = useTheme();

  return getColors(tintColor ?? undefined)[colorScheme ?? 'light'];
}
