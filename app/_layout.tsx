import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { AppInstallBanner } from '@/components/ui/app-install-banner';
import { ThemeProvider, useColorScheme } from '@/contexts/theme-context';
import { useHydrated } from '@/hooks/use-hydrated';

const BASE_URL = 'https://nziranziza.github.io/indirimbo';

export const unstable_settings = {
  anchor: '(tabs)',
};

function SEOHead() {
  return (
    <Head>
      <title>Indirimbo - Rwandan Hymns & Worship Songs</title>
      <meta name="description" content="Browse and search Rwandan church hymns from Gushimisha Imana and Agakiza hymnbooks. Find lyrics, save favorites, and share worship songs." />
      <meta name="keywords" content="indirimbo, rwandan hymns, gushimisha imana, agakiza, worship songs, church hymns, kinyarwanda, rwanda" />
      <meta name="theme-color" content="#0a7ea4" />
      <meta property="og:site_name" content="Indirimbo" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Indirimbo - Rwandan Hymns & Worship Songs" />
      <meta property="og:description" content="Browse and search Rwandan church hymns from Gushimisha Imana and Agakiza hymnbooks. Find lyrics, save favorites, and share worship songs." />
      <meta property="og:image" content={`${BASE_URL}/og-image.png`} />
      <meta property="og:url" content={BASE_URL} />
      <meta property="og:locale" content="rw_RW" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Indirimbo - Rwandan Hymns & Worship Songs" />
      <meta name="twitter:description" content="Browse and search Rwandan church hymns from Gushimisha Imana and Agakiza hymnbooks." />
      <meta name="twitter:image" content={`${BASE_URL}/og-image.png`} />
      <link rel="canonical" href={BASE_URL} />
    </Head>
  );
}

function RootLayoutContent() {
  const colorScheme = useColorScheme();

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
          name="song"
          options={({ route }) => {
            // Get direction from route params to determine animation
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
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const hasHydrated = useHydrated();
  const content = hasHydrated ? <RootLayoutContent /> : <ThemedView style={{ flex: 1 }} />;
  
  const inner = (
    <SafeAreaProvider>
      <ThemeProvider>
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
      </ThemeProvider>
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
