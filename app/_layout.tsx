import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { AppInstallBanner } from '@/components/ui/app-install-banner';
import { ThemeProvider, useColorScheme } from '@/contexts/theme-context';
import { useHydrated } from '@/hooks/use-hydrated';

export const unstable_settings = {
  anchor: '(tabs)',
};

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
  
  return (
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
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: 428, // Typical mobile width (iPhone 14 Pro Max)
    alignSelf: 'center',
  },
});
