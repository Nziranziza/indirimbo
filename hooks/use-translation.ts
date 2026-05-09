import { translations, type Locale, type TranslationKey } from '@/constants/translations';
import { useLanguage } from '@/contexts/language-context';
import { useCallback } from 'react';

type TranslationParams = Readonly<Record<string, string | number>>;

function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key: string) => {
    const value = params[key];
    return value === undefined ? match : String(value);
  });
}

export function translate<K extends TranslationKey>(
  language: Locale,
  key: K,
  params?: TranslationParams,
): string {
  const template = translations[language][key];
  return interpolate(template, params);
}

export function useTranslation() {
  const { language } = useLanguage();
  const t = useCallback(
    <K extends TranslationKey>(key: K, params?: TranslationParams): string =>
      translate(language, key, params),
    [language],
  );
  return { t, language };
}
