import { Stack } from 'expo-router';
import { Platform } from 'react-native';

import { useColors } from '@/hooks/use-colors';

export default function SearchLayout() {
  const colors = useColors();
  const isIOS = Platform.OS === 'ios';

  return (
    <Stack
      screenOptions={{
        headerShown: isIOS,
        headerLargeTitleEnabled: isIOS,
        headerShadowVisible: false,
        headerBlurEffect: 'regular',
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        animation: 'default',
        ...(Platform.OS === 'ios' && {
          animationDuration: 350,
        }),
        ...(Platform.OS === 'android' && {
          animationDuration: 300,
        }),
      }}
    />
  );
}
