import { usePathname } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedView } from '@/components/themed-view';
import { AppInstallBanner } from '@/components/ui/app-install-banner';
import { AppInstallPrompt } from '@/components/web/app-install-prompt';
import { WebRightColumn } from '@/components/web/web-right-column';
import { WebSidebar } from '@/components/web/web-sidebar';
import { CONTENT_MAX_WIDTH } from '@/constants/layout';
import { useEngagementOverlay } from '@/contexts/engagement-context';
import { useColors } from '@/hooks/use-colors';
import { useIsWideScreen } from '@/hooks/use-is-wide-screen';

/** Full-flow / redundant routes that should not get the 3-column frame */
const FRAME_EXCLUDED_PREFIXES = ['/onboarding', '/download'] as const;

interface WebShellProps {
  readonly children: ReactNode;
}

export function WebShell({ children }: WebShellProps) {
  const colors = useColors();
  const isWide = useIsWideScreen();
  const pathname = usePathname();
  const engagementOverlay = useEngagementOverlay();

  const isExcluded = FRAME_EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!isWide || isExcluded) {
    return (
      <ThemedView style={styles.fill}>
        <View style={styles.narrowWrapper}>
          <AppInstallBanner />
          {children}
          {engagementOverlay}
          <AppInstallPrompt />
        </View>
      </ThemedView>
    );
  }

  return (
    <View style={[styles.fill, { backgroundColor: colors.bottomTabBackground }]}>
      <View style={styles.row}>
        <WebSidebar />
        <View style={styles.mainArea}>
          <View
            style={[
              styles.contentColumn,
              {
                backgroundColor: colors.background,
                borderLeftColor: colors.icon + '20',
                borderRightColor: colors.icon + '20',
              },
            ]}>
            {children}
            {engagementOverlay}
          </View>
          <WebRightColumn />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  narrowWrapper: {
    flex: 1,
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH, // Typical mobile width (iPhone 14 Pro Max)
    alignSelf: 'center',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  // Centers the [content | right rail] block in the space beside the sidebar,
  // so empty space trails on the outsides rather than gaping in the middle.
  mainArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  contentColumn: {
    width: CONTENT_MAX_WIDTH,
    height: '100%',
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
  },
});
