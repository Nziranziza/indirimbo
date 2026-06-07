/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';
import type { TranslationKey } from '@/constants/translations';
import type { ThemePreference } from '@/utils/storage';

// Predefined tint color options that work well in both light and dark modes
export const TintColorOptions = {
  blue: {
    name: 'Blue',
    nameKey: 'settings.color.blue',
    light: '#0a7ea4',
    dark: '#4A9EFF',
  },
  purple: {
    name: 'Purple',
    nameKey: 'settings.color.purple',
    light: '#7C3AED',
    dark: '#A78BFA',
  },
  green: {
    name: 'Green',
    nameKey: 'settings.color.green',
    light: '#059669',
    dark: '#10B981',
  },
  teal: {
    name: 'Teal',
    nameKey: 'settings.color.teal',
    light: '#0D9488',
    dark: '#14B8A6',
  },
  orange: {
    name: 'Orange',
    nameKey: 'settings.color.orange',
    light: '#EA580C',
    dark: '#FB923C',
  },
  pink: {
    name: 'Pink',
    nameKey: 'settings.color.pink',
    light: '#DB2777',
    dark: '#F472B6',
  },
  indigo: {
    name: 'Indigo',
    nameKey: 'settings.color.indigo',
    light: '#4F46E5',
    dark: '#818CF8',
  },
  emerald: {
    name: 'Emerald',
    nameKey: 'settings.color.emerald',
    light: '#047857',
    dark: '#34D399',
  },
  red: {
    name: 'Red',
    nameKey: 'settings.color.red',
    light: '#DC2626',
    dark: '#F87171',
  },
  yellow: {
    name: 'Gold',
    nameKey: 'settings.color.yellow',
    light: '#CA8A04',
    dark: '#FCD34D',
  },
  cyan: {
    name: 'Cyan',
    nameKey: 'settings.color.cyan',
    light: '#0891B2',
    dark: '#22D3EE',
  },
  rose: {
    name: 'Rose',
    nameKey: 'settings.color.rose',
    light: '#E11D48',
    dark: '#FB7185',
  },
} as const satisfies Record<string, { name: string; nameKey: TranslationKey; light: string; dark: string }>;

export type TintColorKey = keyof typeof TintColorOptions;

// Helper function to get colors with custom tint
export const getColors = (tintColorKey: TintColorKey = 'blue') => {
  const tintColors = TintColorOptions[tintColorKey];
  
  return {
    light: {
      text: '#11181C',
      background: '#ffffff',
      bottomTabBackground: '#F5F5F7',
      sidebarBackground: '#F1F1F3',
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
      sidebarBackground: '#0D0E10',
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

export interface ThemeOption {
  readonly value: ThemePreference;
  readonly labelKey: TranslationKey;
  readonly descriptionKey: TranslationKey;
  readonly icon: string;
}

export const THEME_OPTIONS: readonly ThemeOption[] = [
  { value: 'light', labelKey: 'settings.theme.lightLabel', descriptionKey: 'settings.theme.lightDescription', icon: 'sun.max' },
  { value: 'dark', labelKey: 'settings.theme.darkLabel', descriptionKey: 'settings.theme.darkDescription', icon: 'moon' },
  { value: 'auto', labelKey: 'settings.theme.autoLabel', descriptionKey: 'settings.theme.autoDescription', icon: 'circle.lefthalf.filled' },
];
