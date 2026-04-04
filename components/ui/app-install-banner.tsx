import { Image } from 'expo-image';
import { useEffect, useMemo, useState } from 'react';
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GooglePlayIcon } from '@/components/ui/google-play-icon';
import { IconSymbol } from '@/components/ui/icon-symbol';
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

  const storeName = platform === 'ios' ? 'App Store' : 'Google Play';

  return (
    <View style={[styles.container, { backgroundColor: colors.bottomTabBackground, borderColor: colors.icon + '20' }]}>
      <TouchableOpacity
        onPress={canOpenApp ? handleOpenApp : handleInstall}
        activeOpacity={0.7}
        style={styles.row}
      >
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.appIcon}
          contentFit="cover"
        />
        <View style={styles.textColumn}>
          <View style={styles.storeRow}>
            {platform === 'ios' ? (
              <IconSymbol name="apple.logo" size={12} color={colors.icon} />
            ) : (
              <GooglePlayIcon size={12} />
            )}
            <Text style={[styles.storeLabel, { color: colors.icon }]}>
              {storeName}
            </Text>
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>Indirimbo</Text>
          <Text style={[styles.tagline, { color: colors.icon }]}>Agakiza no Gushimisha Imana</Text>
        </View>
        {canOpenApp ? (
          <View style={[styles.actionButton, { backgroundColor: colors.tint }]}>
            <Text style={styles.actionButtonText}>OPEN</Text>
          </View>
        ) : (
          <IconSymbol name="arrow.down.circle.fill" size={28} color={colors.tint} />
        )}
        <TouchableOpacity
          onPress={() => setIsVisible(false)}
          activeOpacity={0.7}
          style={styles.closeButton}
        >
          <IconSymbol name="xmark.circle.fill" size={20} color={colors.icon} />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  textColumn: {
    flex: 1,
    gap: 1,
  },
  storeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  storeLabel: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  appName: {
    fontSize: 15,
    fontWeight: '600',
  },
  tagline: {
    fontSize: 12,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 4,
  },
});
