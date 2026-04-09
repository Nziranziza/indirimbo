import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CONTENT_BOTTOM_SPACING, FAB_CLEARANCE } from '@/constants/layout';

interface BottomPaddingOptions {
  /** Is this screen inside the NativeTabs navigator? */
  readonly inTabs?: boolean;
  /** Does this screen have a floating action button that needs clearance? */
  readonly hasFab?: boolean;
}

export function useBottomPadding({ inTabs = false, hasFab = false }: BottomPaddingOptions = {}): number {
  const insets = useSafeAreaInsets();

  const base = inTabs && Platform.OS === 'android'
    ? CONTENT_BOTTOM_SPACING
    : insets.bottom + CONTENT_BOTTOM_SPACING;

  return base + (hasFab ? FAB_CLEARANCE : 0);
}
