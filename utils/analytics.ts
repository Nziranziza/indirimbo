import Constants from 'expo-constants';

import { getLastSeenAppVersion, setLastSeenAppVersion } from '@/utils/storage';

/**
 * Analytics facade. There is currently no analytics provider wired up on
 * native — `trackEvent` is a no-op and exists so call sites stay in place for
 * whichever provider comes next. Web session analytics run separately through
 * Microsoft Clarity (see app/+html.tsx).
 */
export function initAnalytics(): void {
  // No provider to initialize.
}

export function trackEvent(
  _eventName: string,
  _properties?: Record<string, string | number>,
): void {
  // No provider to send to.
}

export async function trackAppUpdateIfChanged(): Promise<void> {
  const currentVersion = Constants.expoConfig?.version;
  if (typeof currentVersion !== 'string' || !currentVersion) return;

  const lastSeen = await getLastSeenAppVersion();
  if (lastSeen && lastSeen !== currentVersion) {
    trackEvent('app_updated', {
      from_version: lastSeen,
      to_version: currentVersion,
    });
  }
  if (lastSeen !== currentVersion) {
    await setLastSeenAppVersion(currentVersion);
  }
}
