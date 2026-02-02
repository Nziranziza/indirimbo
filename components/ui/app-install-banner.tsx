import { useEffect, useMemo, useState } from 'react';
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { APP_STORE_URL, APP_UNIVERSAL_LINK_URL, PLAY_STORE_URL } from '@/constants/app-links';
import { useColors } from '@/hooks/use-colors';

const APP_SCHEME = 'indirimbo://';

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
    if (Platform.OS !== 'web') {
      return;
    }

    let active = true;
    Linking.canOpenURL(APP_SCHEME)
      .then((supported) => {
        if (active) {
          setCanOpenApp(Boolean(supported));
        }
      })
      .catch(() => {
        if (active) {
          setCanOpenApp(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

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
    const openUrl = platform ? APP_UNIVERSAL_LINK_URL : APP_SCHEME;

    if (Platform.OS === 'web' && typeof window !== 'undefined' && platform === 'ios') {
      // iOS Safari is picky; use a direct location change with a fallback.
      const fallback = storeUrl;
      const timeout = fallback
        ? window.setTimeout(() => {
            window.location.href = fallback;
          }, 1400)
        : null;

      window.location.href = openUrl;

      window.setTimeout(() => {
        if (timeout) {
          window.clearTimeout(timeout);
        }
      }, 2000);
      return;
    }

    await Linking.openURL(openUrl);
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
