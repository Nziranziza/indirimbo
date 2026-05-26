import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

export function initSentry(): void {
  if (!SENTRY_DSN) {
    if (__DEV__) {
      console.warn(
        '[sentry] EXPO_PUBLIC_SENTRY_DSN not set — crash reporting disabled.',
      );
    }
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    enabled: !__DEV__,
    release: Constants.expoConfig?.version,
    environment: __DEV__ ? 'development' : 'production',
    tracesSampleRate: 0.1,
    attachStacktrace: true,
    sendDefaultPii: false,
    enableLogs: false,
  });
}

export { Sentry };
