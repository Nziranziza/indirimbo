import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InAppAlert, type InAppAlertAction } from '@/components/ui/in-app-alert';
import { useTranslation } from '@/hooks/use-translation';
import { trackEvent } from '@/utils/analytics';
import {
  getMobileWebPlatform,
  getStoreUrl,
  isStandaloneWeb,
  openAppOrStore,
  type MobileWebPlatform,
} from '@/utils/mobile-web';

const APP_ICON = require('@/assets/images/icon.png');
const APP_ICON_SIZE = 36;
const PROMPT_BOTTOM_GAP = 16;
// Wait a few seconds after the visitor starts interacting before nudging them,
// so the prompt lands once they're actually reading rather than on first paint.
const INTERACTION_DELAY_MS = 4_000;
// Session-scoped so the popup shows at most once per browser session.
const SESSION_SHOWN_KEY = '@indirimbo:install_prompt_shown';
const INTERACTION_EVENTS = ['scroll', 'pointerdown', 'keydown', 'touchstart'] as const;

function wasShownThisSession(): boolean {
  try {
    return window.sessionStorage?.getItem(SESSION_SHOWN_KEY) === '1';
  } catch {
    return false;
  }
}

function markShownThisSession(): void {
  try {
    window.sessionStorage?.setItem(SESSION_SHOWN_KEY, '1');
  } catch {
    // sessionStorage may be unavailable (private mode / blocked storage).
  }
}

/**
 * Secondary install nudge for mobile web. Complements the top {@link AppInstallBanner}
 * with a bottom card offering Install / Not now, shown once per session a few
 * seconds after the visitor first interacts with any page.
 */
export function AppInstallPrompt() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [isVisible, setIsVisible] = useState(false);
  const platformRef = useRef<MobileWebPlatform | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const platform: MobileWebPlatform | null = getMobileWebPlatform();
    // Only nudge mobile-web visitors who can install, haven't already, and
    // haven't been shown the popup yet this session.
    if (!platform || isStandaloneWeb() || !getStoreUrl(platform) || wasShownThisSession()) {
      return;
    }
    const mobilePlatform: MobileWebPlatform = platform;
    platformRef.current = platform;

    let showTimer: ReturnType<typeof setTimeout> | null = null;

    function removeInteractionListeners() {
      INTERACTION_EVENTS.forEach((event) =>
        window.removeEventListener(event, handleInteraction),
      );
    }

    function handleInteraction() {
      removeInteractionListeners();
      showTimer = setTimeout(() => {
        if (wasShownThisSession()) return;
        markShownThisSession();
        setIsVisible(true);
        trackEvent('show_install_prompt', { platform: mobilePlatform });
      }, INTERACTION_DELAY_MS);
    }

    INTERACTION_EVENTS.forEach((event) =>
      window.addEventListener(event, handleInteraction, { passive: true, once: true }),
    );

    return () => {
      removeInteractionListeners();
      if (showTimer) clearTimeout(showTimer);
    };
  }, []);

  const handleInstall = useCallback(() => {
    const platform = platformRef.current;
    if (!platform) return;
    // Opens the app if it's installed, otherwise the store — the same flow the
    // top banner uses, so installed users continue in the app instead of being
    // pushed to a redundant store listing.
    trackEvent('tap_install_prompt', { action: 'install', platform });
    openAppOrStore(platform, getStoreUrl(platform));
  }, []);

  const handleNotNow = useCallback(() => {
    trackEvent('tap_install_prompt', { action: 'dismiss', platform: platformRef.current ?? 'unknown' });
  }, []);

  const installAction = useMemo<InAppAlertAction>(
    () => ({ label: t('appInstallPrompt.install'), onPress: handleInstall }),
    [t, handleInstall],
  );
  const notNowAction = useMemo<InAppAlertAction>(
    () => ({ label: t('appInstallPrompt.notNow'), onPress: handleNotNow }),
    [t, handleNotNow],
  );

  const handleDismiss = useCallback(() => setIsVisible(false), []);

  if (!isVisible) {
    return null;
  }

  return (
    <InAppAlert
      visible
      iconImage={APP_ICON}
      iconSize={APP_ICON_SIZE}
      title={t('appInstallPrompt.title')}
      message={t('appInstallPrompt.message')}
      bottomOffset={insets.bottom + PROMPT_BOTTOM_GAP}
      duration={0}
      haptic="none"
      swipeable={false}
      action={installAction}
      secondaryAction={notNowAction}
      onDismiss={handleDismiss}
    />
  );
}
