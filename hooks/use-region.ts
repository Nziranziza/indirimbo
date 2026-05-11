import { getCalendars, getLocales } from 'expo-localization';
import { useMemo } from 'react';

interface RegionInfo {
  readonly region: string | null;
  readonly isBurundi: boolean;
}

const BURUNDI_REGION = 'BI';
const BURUNDI_LANGUAGE = 'rn';
const BURUNDI_TIMEZONE = 'Africa/Bujumbura';

export function useRegion(): RegionInfo {
  return useMemo(() => {
    const locales = getLocales();
    const calendars = getCalendars();
    const region = locales[0]?.regionCode ?? null;

    const isBurundi =
      locales.some((l) => l.regionCode === BURUNDI_REGION) ||
      locales.some((l) => l.languageRegionCode === BURUNDI_REGION) ||
      locales.some((l) => l.languageCode === BURUNDI_LANGUAGE) ||
      calendars.some((c) => c.timeZone === BURUNDI_TIMEZONE);

    return { region, isBurundi };
  }, []);
}
