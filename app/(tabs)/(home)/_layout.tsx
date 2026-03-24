import { Stack } from 'expo-router';
import { Platform } from 'react-native';

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
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
