/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';
import type { ThemePreference } from '@/utils/storage';

// Predefined tint color options that work well in both light and dark modes
export const TintColorOptions = {
  blue: {
    name: 'Blue',
    light: '#0a7ea4',
    dark: '#4A9EFF',
  },
  purple: {
    name: 'Purple',
    light: '#7C3AED',
    dark: '#A78BFA',
  },
  green: {
    name: 'Green',
    light: '#059669',
    dark: '#10B981',
  },
  teal: {
    name: 'Teal',
    light: '#0D9488',
    dark: '#14B8A6',
  },
  orange: {
    name: 'Orange',
    light: '#EA580C',
    dark: '#FB923C',
  },
  pink: {
    name: 'Pink',
    light: '#DB2777',
    dark: '#F472B6',
  },
  indigo: {
    name: 'Indigo',
    light: '#4F46E5',
    dark: '#818CF8',
  },
  emerald: {
    name: 'Emerald',
    light: '#047857',
    dark: '#34D399',
  },
  red: {
    name: 'Red',
    light: '#DC2626',
    dark: '#F87171',
  },
  yellow: {
    name: 'Gold',
    light: '#CA8A04',
    dark: '#FCD34D',
  },
  cyan: {
    name: 'Cyan',
    light: '#0891B2',
    dark: '#22D3EE',
  },
  rose: {
    name: 'Rose',
    light: '#E11D48',
    dark: '#FB7185',
  },
} as const;

export type TintColorKey = keyof typeof TintColorOptions;

// Helper function to get colors with custom tint
export const getColors = (tintColorKey: TintColorKey = 'blue') => {
  const tintColors = TintColorOptions[tintColorKey];
  
  return {
    light: {
      text: '#11181C',
      background: '#ffffff',
      bottomTabBackground: '#F5F5F7',
      tint: tintColors.light,
      tintForeground: '#FFFFFF',
      icon: '#687076',
      tabIconDefault: '#687076',
      tabIconSelected: tintColors.light,
    },
    dark: {
      text: '#ECEDEE',
      background: '#151718',
      bottomTabBackground: '#0F1112',
      tint: tintColors.dark,
      tintForeground: '#1A1A1A',
      icon: '#9BA1A6',
      tabIconDefault: '#9BA1A6',
      tabIconSelected: tintColors.dark,
    },
  };
};

// Default colors (for backward compatibility)
export const Colors = getColors('blue');

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const THEME_OPTIONS: { label: string; value: ThemePreference; description: string; icon: string }[] = [
  { label: 'Light', value: 'light', description: 'Always use light theme', icon: 'sun.max' },
  { label: 'Dark', value: 'dark', description: 'Always use dark theme', icon: 'moon' },
  { label: 'Auto', value: 'auto', description: 'Follow system setting', icon: 'circle.lefthalf.filled' },
];
