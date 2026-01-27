/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { getColors } from '@/constants/theme';
import { useColorScheme, useTheme } from '@/contexts/theme-context';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: 'text' | 'background' | 'tint' | 'icon' | 'tabIconDefault' | 'tabIconSelected'
) {
  const theme = useColorScheme() ?? 'light';
  const { tintColor } = useTheme();
  const colors = getColors(tintColor ?? undefined);
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return colors[theme][colorName];
  }
}
