import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CONTENT_BOTTOM_SPACING } from '@/constants/layout';

export function useFabBottom(inTabs: boolean = false): number {
  const insets = useSafeAreaInsets();

  if (inTabs) {
    return Platform.OS === 'ios'
      ? insets.bottom + CONTENT_BOTTOM_SPACING
      : CONTENT_BOTTOM_SPACING;
  }

  return Math.max(insets.bottom, CONTENT_BOTTOM_SPACING) + CONTENT_BOTTOM_SPACING;
}
