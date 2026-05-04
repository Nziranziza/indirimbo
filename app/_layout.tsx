import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { AppInstallBanner } from '@/components/ui/app-install-banner';
import { ForceUpdateModal } from '@/components/ui/force-update-modal';
import { SongbookPreferenceProvider } from '@/contexts/songbook-preference-context';
import { SongsProvider } from '@/contexts/songs-context';
import { ThemeProvider, useColorScheme } from '@/contexts/theme-context';
import { UpdateCheckProvider } from '@/contexts/update-check-context';
import { useHydrated } from '@/hooks/use-hydrated';
import { initAnalytics } from '@/utils/analytics';
import { recordAppOpen } from '@/utils/storage';

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
          name="(tabs)"
          options={{
            headerShown: false,
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

export default function RootLayout() {
  const hasHydrated = useHydrated();
  const content = hasHydrated ? <RootLayoutContent /> : <ThemedView style={{ flex: 1 }} />;
  
  const inner = (
    <SafeAreaProvider>
      <SongsProvider>
      <SongbookPreferenceProvider>
      <ThemeProvider>
      <UpdateCheckProvider>
        {Platform.OS === 'web' ? (
          <ThemedView style={{ flex: 1}}>
          <View style={styles.webWrapper}>
            <AppInstallBanner />
            {content}
          </View>
          </ThemedView>
        ) : (
          content
        )}
      </UpdateCheckProvider>
      </ThemeProvider>
      </SongbookPreferenceProvider>
      </SongsProvider>
    </SafeAreaProvider>
  );

  return (
    <Head.Provider>
      <SEOHead />
      {inner}
    </Head.Provider>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 428, // Typical mobile width (iPhone 14 Pro Max)
    alignSelf: 'center',
  },
});
