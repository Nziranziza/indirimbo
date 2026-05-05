import { init, trackEvent as aptabaseTrackEvent } from '@aptabase/react-native';
import Constants from 'expo-constants';

import { getLastSeenAppVersion, setLastSeenAppVersion } from '@/utils/storage';

const APTABASE_APP_KEY = 'A-EU-6809558212';

let isInitialized = false;

export function initAnalytics(): void {
  if (isInitialized) return;
  try {
    init(APTABASE_APP_KEY);
    isInitialized = true;
  } catch (error) {
    console.error('Analytics initialization failed:', error);
  }
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, string | number>,
): void {
  aptabaseTrackEvent(eventName, properties);
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
