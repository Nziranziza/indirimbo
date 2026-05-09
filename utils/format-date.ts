import type { Locale, TranslationKey } from '@/constants/translations';

type Translator = (key: TranslationKey, params?: Record<string, string | number>) => string;

export function formatShortTimeAgo(timestamp: number, t: Translator): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return t('common.time.justNow');
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return t('common.time.minutesAgoShort', { count: minutes });
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return t('common.time.hoursAgoShort', { count: hours });
  const days = Math.floor(hours / 24);
  if (days < 7) return t('common.time.daysAgoShort', { count: days });
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return t('common.time.weeksAgoShort', { count: weeks });
  if (days < 365) {
    const months = Math.floor(days / 30);
    return t('common.time.monthsAgoShort', { count: months });
  }
  const years = Math.floor(days / 365);
  return t('common.time.yearsAgoShort', { count: years });
}

export function localeForDate(language: Locale): string {
  return language === 'fr' ? 'fr-FR' : 'en-US';
}

export function formatLongTimeAgo(
  timestamp: number,
  t: Translator,
  language: Locale,
): string {
  const date = new Date(timestamp);
  // Clamp to 0 so a future timestamp (e.g. clock skew) doesn't render as "-1 days ago".
  const diffInDays = Math.max(0, Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)));

  if (diffInDays === 0) return t('favorites.date.today');
  if (diffInDays === 1) return t('favorites.date.yesterday');
  if (diffInDays < 7) return t('favorites.date.daysAgo', { count: diffInDays });
  if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1
      ? t('favorites.date.weekAgo')
      : t('favorites.date.weeksAgo', { count: weeks });
  }
  if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return months === 1
      ? t('favorites.date.monthAgo')
      : t('favorites.date.monthsAgo', { count: months });
  }
  return date.toLocaleDateString(localeForDate(language), {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
