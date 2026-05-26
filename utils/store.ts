import * as StoreReview from 'expo-store-review';
import { Linking, Platform } from 'react-native';

import { APP_STORE_REVIEW_URL, APP_STORE_URL, PLAY_STORE_REVIEW_URL, PLAY_STORE_URL } from '@/constants/app-links';

export async function openStoreForCurrentPlatform(): Promise<void> {
  const url = Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
  if (!url) return;
  try {
    await Linking.openURL(url);
  } catch (error) {
    console.error('Error opening store URL:', error);
  }
}

// Presents the native in-app review sheet when available, otherwise opens the
// store review URL. In dev we always take the URL path: SKStoreReviewController
// is silently no-op'd in iOS Simulator and Play In-App Review requires a
// Play-installed build, so the in-app path leaves nothing visible for testing.
export async function requestAppReview(): Promise<void> {
  try {
    if (!__DEV__) {
      const isAvailable = await StoreReview.isAvailableAsync();
      if (isAvailable) {
        await StoreReview.requestReview();
        return;
      }
    }
    const url = Platform.OS === 'ios' ? APP_STORE_REVIEW_URL : PLAY_STORE_REVIEW_URL;
    if (!url) return;
    await Linking.openURL(url);
  } catch (error) {
    console.error('Failed to request app review:', error);
  }
}
