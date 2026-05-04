import { Linking, Platform } from 'react-native';

import { APP_STORE_URL, PLAY_STORE_URL } from '@/constants/app-links';

export async function openStoreForCurrentPlatform(): Promise<void> {
  const url = Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
  if (!url) return;
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.error('Error opening store URL:', error);
  }
}
