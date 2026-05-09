import { en, type Translations } from './en';
import { fr } from './fr';

export type { TranslationKey } from './en';

export type Locale = 'en' | 'fr';

export const translations: Record<Locale, Translations> = {
  en,
  fr,
};
