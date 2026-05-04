import { init, trackEvent as aptabaseTrackEvent } from '@aptabase/react-native';

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
