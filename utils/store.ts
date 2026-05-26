import * as StoreReview from 'expo-store-review';
import { Linking, Platform } from 'react-native';

import { APP_STORE_REVIEW_URL, APP_STORE_URL, PLAY_STORE_REVIEW_URL, PLAY_STORE_URL } from '@/constants/app-links';
import { getEngagementState } from '@/utils/storage';

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
// store review URL. We skip the in-app attempt:
//  - in dev (silently no-op'd in iOS Simulator and Play In-App Review needs a
//    Play-installed build)
//  - after the user has already been through the rate flow once (`hasRated`),
//    since Apple/Google's per-app quota means a second prompt would almost
//    certainly no-op silently
export async function requestAppReview(): Promise<void> {
  try {
    if (!__DEV__) {
      const { hasRated } = await getEngagementState();
      if (!hasRated) {
        const isAvailable = await StoreReview.isAvailableAsync();
        if (isAvailable) {
          await StoreReview.requestReview();
          return;
        }
      }
    }
    const url = Platform.OS === 'ios' ? APP_STORE_REVIEW_URL : PLAY_STORE_REVIEW_URL;
    if (!url) return;
    await Linking.openURL(url);
  } catch (error) {
    console.error('Failed to request app review:', error);
  }
}
