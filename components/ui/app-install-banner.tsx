import { useEffect, useMemo, useState } from 'react';
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { APP_STORE_URL, PLAY_STORE_URL } from '@/constants/app-links';
import { useColors } from '@/hooks/use-colors';

const APP_SCHEME = 'indirimbo://';

function getCurrentWebPath() {
  if (typeof window === 'undefined') {
    return '/';
  }

  // Preserve route + query + hash so the app can open exactly where the user is.
  const { pathname, search, hash } = window.location;
  const path = `${pathname || '/'}${search || ''}${hash || ''}`;
  return path.startsWith('/') ? path : `/${path}`;
}

function getMobilePlatform(userAgent: string) {
  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return 'ios';
  }
  if (/android/i.test(userAgent)) {
    return 'android';
  }
  return null;
}

export function AppInstallBanner() {
  const colors = useColors();
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | null>(null);
  const [canOpenApp, setCanOpenApp] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    const userAgent = window.navigator.userAgent || '';
    const detectedPlatform = getMobilePlatform(userAgent);
    const isStandalone =
      window.matchMedia?.('(display-mode: standalone)')?.matches ||
      (window.navigator as typeof window.navigator & { standalone?: boolean }).standalone ||
      false;

    setPlatform(detectedPlatform);
    setIsVisible(Boolean(detectedPlatform) && !isStandalone);
  }, []);

  useEffect(() => {
    // On mobile web, Linking.canOpenURL for custom schemes is unreliable
    // (always fails on iOS Safari). When we know the app exists (store URL
    // is set), optimistically assume it can be opened — handleOpenApp will
    // fall back to the store if the app isn't installed.
    if (platform) {
      const hasStoreUrl = (platform === 'ios' && APP_STORE_URL) || (platform === 'android' && PLAY_STORE_URL);
      setCanOpenApp(Boolean(hasStoreUrl));
    }
  }, [platform]);

  const storeUrl = useMemo(() => {
    if (platform === 'ios') {
      return APP_STORE_URL;
    }
    if (platform === 'android') {
      return PLAY_STORE_URL;
    }
    return null;
  }, [platform]);

  const handleOpenApp = async () => {
    const currentPath = getCurrentWebPath();
    const scheme = APP_SCHEME.replace(/\/+$/, '');

    if (typeof window !== 'undefined' && platform === 'android') {
      // On Android, use an Intent URL so Chrome natively falls back to the
      // Play Store when the app isn't installed. A plain custom-scheme URL
      // would show an error page instead.
      const fallback = storeUrl ? `S.browser_fallback_url=${encodeURIComponent(storeUrl)};` : '';
      const intentUrl = `intent:/${currentPath}#Intent;scheme=indirimbo;package=com.indirimbo.app;${fallback}end`;
      window.location.href = intentUrl;
      return;
    }

    if (typeof window !== 'undefined' && platform === 'ios') {
      const schemeUrl = `${scheme}${currentPath}`;
      const fallback = storeUrl;

      // Navigate to the custom scheme. If the app is installed it will
      // open; if not, the browser stays on the page and the fallback
      // timer redirects to the store after a short delay.
      const fallbackTimer = fallback
        ? window.setTimeout(() => { window.location.href = fallback; }, 800)
        : null;

      window.location.href = schemeUrl;

      // If the app opens, the page will be hidden. Clear the fallback
      // so the user isn't redirected to the store when they return.
      const onVisibilityChange = () => {
        if (document.hidden && fallbackTimer) {
          window.clearTimeout(fallbackTimer);
        }
      };
      document.addEventListener('visibilitychange', onVisibilityChange, { once: true });

      window.setTimeout(() => {
        document.removeEventListener('visibilitychange', onVisibilityChange);
      }, 1200);
      return;
    }

    await Linking.openURL(`${scheme}${currentPath}`);
  };

  const handleInstall = async () => {
    if (!storeUrl) {
      return;
    }
    await Linking.openURL(storeUrl);
  };

  if (!isVisible) {
    return null;
  }

  const title = canOpenApp ? 'Open Indirimbo in the app' : 'Get the Indirimbo app';
  const subtitle = canOpenApp
    ? 'Continue where you left off in the app.'
    : 'Install the app for the best experience.';
  const primaryLabel = canOpenApp ? 'Open app' : 'Get app';

  return (
    <View style={[styles.container, { backgroundColor: colors.bottomTabBackground, borderColor: colors.icon + '20' }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.subtitle, { color: colors.icon }]}>{subtitle}</Text>
      </View>
      <View style={styles.actions}>
        {!canOpenApp && storeUrl && (
          <TouchableOpacity
            onPress={handleInstall}
            style={[styles.buttonBase, styles.secondaryButton, { borderColor: colors.icon + '30' }]}
            activeOpacity={0.7}>
            <Text style={[styles.secondaryText, { color: colors.text }]}>Install</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={canOpenApp ? handleOpenApp : handleInstall}
          style={[styles.buttonBase, styles.primaryButton, { backgroundColor: colors.tint }]}
          activeOpacity={0.8}>
          <Text style={styles.primaryText}>{primaryLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsVisible(false)}
          style={[styles.buttonBase, styles.closeButton, { borderColor: colors.icon + '30' }]}
          activeOpacity={0.7}>
          <Text style={[styles.closeText, { color: colors.text }]}>Not now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  content: {
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  buttonBase: {
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 1,
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: '600',
  },
  closeButton: {
    borderWidth: 1,
  },
  closeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
