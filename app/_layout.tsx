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

const BASE_URL = 'https://indirimbo.rw';

export const unstable_settings = {
  anchor: '(tabs)',
};

function SEOHead() {
  return (
    <Head>
      <title>Indirimbo - z'Agakiza no Gushimisha Imana</title>
      <meta name="description" content="Browse and search Rwandan church hymns from Agakiza and Gushimisha Imana hymnbooks. Find lyrics, save favorites, and share worship songs." />
      <meta name="keywords" content="indirimbo, agakiza, gushimisha imana, indirimbo z'agakiza, indirimbo zo gushimisha imana, rwandan hymns, worship songs, church hymns, kinyarwanda, rwanda" />
      <meta name="theme-color" content="#0a7ea4" />
      <meta property="og:site_name" content="Indirimbo" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Indirimbo - z'Agakiza no Gushimisha Imana" />
      <meta property="og:description" content="Browse and search Rwandan church hymns from Agakiza and Gushimisha Imana hymnbooks. Find lyrics, save favorites, and share worship songs." />
      <meta property="og:image" content={`${BASE_URL}/og-image.jpg`} />
      <meta property="og:image:width" content="1024" />
      <meta property="og:image:height" content="1024" />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:url" content={BASE_URL} />
      <meta property="og:locale" content="rw_RW" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Indirimbo - z'Agakiza no Gushimisha Imana" />
      <meta name="twitter:description" content="Browse and search Rwandan church hymns from Agakiza and Gushimisha Imana hymnbooks." />
      <meta name="twitter:image" content={`${BASE_URL}/og-image.jpg`} />
      <link rel="canonical" href={BASE_URL} />
      <meta name="apple-itunes-app" content={`app-id=6758376573, app-argument=${BASE_URL}`} />
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
