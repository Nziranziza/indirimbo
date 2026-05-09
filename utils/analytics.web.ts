import { init, trackEvent as aptabaseTrackEvent } from '@aptabase/web';

const APTABASE_APP_KEY = 'A-EU-6809558212';

let isInitialized = false;

export function initAnalytics(): void {
  if (isInitialized) return;
  init(APTABASE_APP_KEY);
  isInitialized = true;
}

export function trackEvent(
  eventName: string,
  properties?: Record<string, string | number>,
): void {
  if (!isInitialized) initAnalytics();
  aptabaseTrackEvent(eventName, properties);
}

export async function trackAppUpdateIfChanged(): Promise<void> {
  // Web is always served the current deploy; no install version to compare.
}
