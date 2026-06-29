import { init, trackEvent as aptabaseTrackEvent } from '@aptabase/web';

const APTABASE_APP_KEY = 'A-EU-6809558212';

// Analytics are disabled in dev by default to avoid burning through Aptabase
// quota. Set EXPO_PUBLIC_ENABLE_ANALYTICS_IN_DEV=true to track a test sample.
const isAnalyticsEnabled = (): boolean =>
  !__DEV__ || process.env.EXPO_PUBLIC_ENABLE_ANALYTICS_IN_DEV === 'true';

let isInitialized = false;

export function initAnalytics(): void {
  if (isInitialized || !isAnalyticsEnabled()) return;
  init(APTABASE_APP_KEY);
  isInitialized = true;
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, string | number>,
): void {
  if (!isAnalyticsEnabled()) return;
  if (!isInitialized) initAnalytics();
  aptabaseTrackEvent(eventName, properties);
}

export async function trackAppUpdateIfChanged(): Promise<void> {
  // Web is always served the current deploy; no install version to compare.
}
