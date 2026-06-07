import { Platform, useWindowDimensions } from 'react-native';

import { WIDE_SCREEN_BREAKPOINT } from '@/constants/layout';
import { useHydrated } from '@/hooks/use-hydrated';

/**
 * True only on web, after hydration, when the viewport is at least
 * WIDE_SCREEN_BREAKPOINT wide. Gating on hydration keeps the static export's
 * first paint aligned with the narrow (mobile) layout to avoid a flash.
 */
export function useIsWideScreen(): boolean {
  const { width } = useWindowDimensions();
  const hasHydrated = useHydrated();

  return Platform.OS === 'web' && hasHydrated && width >= WIDE_SCREEN_BREAKPOINT;
}
