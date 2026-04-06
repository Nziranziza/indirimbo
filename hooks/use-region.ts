import { getLocales } from 'expo-localization';
import { useMemo } from 'react';

interface RegionInfo {
  readonly region: string | null;
  readonly isBurundi: boolean;
}

export function useRegion(): RegionInfo {
  return useMemo(() => {
    const locales = getLocales();
    const region = locales[0]?.regionCode ?? null;
    return { region, isBurundi: region === 'BI' };
  }, []);
}
