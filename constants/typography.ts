import type { FontSize } from '@/utils/storage';

export const FONT_SIZES = {
  small: { verse: 15, chorus: 16, lineHeight: 26 },
  medium: { verse: 17, chorus: 18, lineHeight: 30 },
  large: { verse: 19, chorus: 20, lineHeight: 34 },
} as const;

export const FONT_SIZE_OPTIONS: { label: string; value: FontSize; description: string }[] = [
  { label: 'Small', value: 'small', description: 'Compact text for more content' },
  { label: 'Medium', value: 'medium', description: 'Balanced size (recommended)' },
  { label: 'Large', value: 'large', description: 'Larger text for easier reading' },
];
