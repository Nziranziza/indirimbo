import * as Sentry from '@sentry/react-native';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;

// Captures navigation breadcrumbs/transactions for Expo Router. Must be
// registered with the navigation container ref in the root layout once the
// router has mounted (see app/_layout.tsx).
export const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

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
    // release/dist are intentionally NOT set here — the Expo Sentry plugin
    // auto-detects them as `<bundleId>@<version>+<buildNumber>`, matching the
    // release that source maps and ProGuard mappings are uploaded under.
    // Overriding them breaks symbolication.
    environment: __DEV__ ? 'development' : 'production',
    tracesSampleRate: 0.1,
    attachStacktrace: true,
    sendDefaultPii: false,
    enableLogs: false,
    integrations: [navigationIntegration],
  });
}

export { Sentry };
