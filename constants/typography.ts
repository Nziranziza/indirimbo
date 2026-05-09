import type { TranslationKey } from '@/constants/translations';
import type { FontSize } from '@/utils/storage';

export const FONT_SIZES = {
  small: { verse: 15, chorus: 16, lineHeight: 26 },
  medium: { verse: 17, chorus: 18, lineHeight: 30 },
  large: { verse: 19, chorus: 20, lineHeight: 34 },
} as const;

export interface FontSizeOption {
  readonly value: FontSize;
  readonly labelKey: TranslationKey;
  readonly descriptionKey: TranslationKey;
}

export const FONT_SIZE_OPTIONS: readonly FontSizeOption[] = [
  { value: 'small', labelKey: 'settings.textSize.smallLabel', descriptionKey: 'settings.textSize.smallDescription' },
  { value: 'medium', labelKey: 'settings.textSize.mediumLabel', descriptionKey: 'settings.textSize.mediumDescription' },
  { value: 'large', labelKey: 'settings.textSize.largeLabel', descriptionKey: 'settings.textSize.largeDescription' },
];
