import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack, useNavigationContainerRef } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ForceUpdateModal } from '@/components/ui/force-update-modal';
import { WebShell } from '@/components/web/web-shell';
import { EngagementProvider } from '@/contexts/engagement-context';
import { LanguageProvider } from '@/contexts/language-context';
import { SongbookPreferenceProvider } from '@/contexts/songbook-preference-context';
import { SongsProvider } from '@/contexts/songs-context';
import { ThemeProvider, useColorScheme } from '@/contexts/theme-context';
import { UpdateCheckProvider } from '@/contexts/update-check-context';
import { initAnalytics, trackAppUpdateIfChanged } from '@/utils/analytics';
import { runAfterPaint } from '@/utils/defer';
import { Sentry, initSentry, navigationIntegration } from '@/utils/sentry';
import { recordAppOpen } from '@/utils/storage';

// On native, initialize Sentry synchronously at boot. On web its init work is
// deferred past first paint (see RootLayout) so it stays off the critical path.
if (Platform.OS !== 'web') {
  initSentry();
}

const BASE_URL = 'https://indirimbo.rw';

export const unstable_settings = {
  initialRouteName: 'index',
};

function SEOHead() {
  return (
    <Head>
      <meta name="theme-color" content="#0a7ea4" />
      <meta property="og:site_name" content="Indirimbo" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${BASE_URL}/og-image.jpg`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:locale" content="rw_RW" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:image" content={`${BASE_URL}/og-image.jpg`} />
      <meta name="apple-itunes-app" content="app-id=6758376573" />
    </Head>
  );
}

function RootLayoutContent() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    initAnalytics();
    recordAppOpen().catch(console.error);
    trackAppUpdateIfChanged().catch(console.error);
  }, []);

  return (
    <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'default',
          // Smooth transitions for iOS
          ...(Platform.OS === 'ios' && {
            animationDuration: 350,
            animationTypeForReplace: 'push',
          }),
          // Smooth transitions for Android
          ...(Platform.OS === 'android' && {
            animationDuration: 300,
          }),
        }}>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="song/index"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="song/[playlist]/[songNumber]"
          options={({ route }) => {
            const direction = (route.params as { direction?: string })?.direction;
            const animation = direction === 'back'
              ? 'slide_from_left'
              : 'slide_from_right';

            return {
              headerShown: false,
              animation,
              animationDuration: Platform.OS === 'ios' ? 350 : 300,
            };
          }}
        />
        <Stack.Screen
          name="download"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: Platform.OS === 'ios' ? 350 : 300,
          }}
        />
        <Stack.Screen
          name="download-kirundi"
          options={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: Platform.OS === 'ios' ? 350 : 300,
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            title: 'Modal',
            animation: 'slide_from_bottom',
            animationDuration: 300,
          }}
        />
      </Stack>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <ForceUpdateModal />
    </NavigationThemeProvider>
  );
}

function RootLayout() {
  const navigationRef = useNavigationContainerRef();

  useEffect(() => {
    if (navigationRef?.current) {
      navigationIntegration.registerNavigationContainer(navigationRef);
    }
  }, [navigationRef]);

  // Defer Sentry init past first paint on web; native inits at module scope.
  useEffect(() => {
    if (Platform.OS === 'web') {
      return runAfterPaint(() => initSentry());
    }
  }, []);

  // Render real content directly. The former `useHydrated` gate blanked the
  // whole tree until a post-mount effect flipped it, which excluded every screen
  // from the static prerender and cost an extra render cycle after hydration.
  // Web/prerender theme mismatch is already handled in theme-context (forces
  // 'light' on web for both prerender and first client render).
  const content = <RootLayoutContent />;

  const inner = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <LanguageProvider>
        <SongsProvider>
        <SongbookPreferenceProvider>
        <ThemeProvider>
        <UpdateCheckProvider>
        <EngagementProvider>
          {Platform.OS === 'web' ? <WebShell>{content}</WebShell> : content}
        </EngagementProvider>
        </UpdateCheckProvider>
        </ThemeProvider>
        </SongbookPreferenceProvider>
        </SongsProvider>
        </LanguageProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );

  return (
    <Head.Provider>
      <SEOHead />
      {inner}
    </Head.Provider>
  );
}

export default Sentry.wrap(RootLayout);
