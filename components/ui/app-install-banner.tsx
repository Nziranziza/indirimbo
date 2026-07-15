import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GooglePlayIcon } from '@/components/ui/google-play-icon';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import { trackEvent } from '@/utils/analytics';
import { getMobileWebPlatform, getStoreUrl, isStandaloneWeb, openAppOrStore, type MobileWebPlatform } from '@/utils/mobile-web';

export function AppInstallBanner() {
  const colors = useColors();
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<MobileWebPlatform | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    const detectedPlatform = getMobileWebPlatform();
    setPlatform(detectedPlatform);
    setIsVisible(Boolean(detectedPlatform) && !isStandaloneWeb());
  }, []);

  const storeUrl = useMemo(() => (platform ? getStoreUrl(platform) : null), [platform]);
  // On mobile web, Linking.canOpenURL for custom schemes is unreliable (always
  // fails on iOS Safari). A known store URL means the app exists, so we
  // optimistically offer to open it — openAppOrStore falls back to the store
  // if the app isn't installed.
  const canOpenApp = Boolean(storeUrl);

  const handleOpenApp = useCallback(() => {
    if (!platform) {
      return;
    }
    trackEvent('tap_install_banner', { platform, action: 'open' });
    openAppOrStore(platform, storeUrl);
  }, [platform, storeUrl]);

  const handleInstall = async () => {
    if (!storeUrl) {
      return;
    }
    trackEvent('tap_install_banner', { platform: platform ?? 'unknown', action: 'install' });
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
          source={require('@/assets/images/app-logo.webp')}
          style={styles.appIcon}
          contentFit="cover"
          accessibilityLabel="Indirimbo app icon"
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
          <Text style={[styles.tagline, { color: colors.icon }]}>{t('appInstallBanner.tagline')}</Text>
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
        >
          <IconSymbol name="xmark.circle.fill" size={28} color={colors.icon} />
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
});
