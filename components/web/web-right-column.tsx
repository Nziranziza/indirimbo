import { router } from 'expo-router';
import { useCallback } from 'react';
import { Linking, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { GooglePlayIcon } from '@/components/ui/google-play-icon';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/constants/app-links';
import { RIGHT_COLUMN_WIDTH } from '@/constants/layout';
import type { TranslationKey } from '@/constants/translations';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import { trackEvent } from '@/utils/analytics';

interface FooterLink {
  readonly href: '/about' | '/privacy-policy' | '/terms-of-service' | '/support';
  readonly labelKey: TranslationKey;
}

const FOOTER_LINKS: readonly FooterLink[] = [
  { href: '/about', labelKey: 'settings.legal.about' },
  { href: '/privacy-policy', labelKey: 'settings.legal.privacy' },
  { href: '/terms-of-service', labelKey: 'settings.legal.terms' },
  { href: '/support', labelKey: 'settings.legal.help' },
];

export function WebRightColumn() {
  const colors = useColors();
  const { t } = useTranslation();

  const handleStorePress = useCallback(async (store: 'app_store' | 'play_store', url: string) => {
    trackEvent('tap_download_store', { store, variant: 'kinyarwanda' });
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening store URL:', error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          { borderColor: colors.icon + '20', backgroundColor: colors.background },
        ]}>
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          {t('webShell.downloadTitle')}
        </ThemedText>
        <ThemedText style={[styles.cardPitch, { color: colors.tabIconDefault }]}>
          {t('webShell.downloadPitch')}
        </ThemedText>

        <View style={styles.storeButtons}>
          {APP_STORE_URL && (
            <TouchableOpacity
              onPress={() => handleStorePress('app_store', APP_STORE_URL!)}
              activeOpacity={0.8}
              style={styles.storeButton}>
              <IconSymbol name="apple.logo" size={28} color="#FFFFFF" />
              <View>
                <ThemedText style={styles.storeLabel}>{t('download.appStoreLabel')}</ThemedText>
                <ThemedText style={styles.storeName}>{t('download.appStoreName')}</ThemedText>
              </View>
            </TouchableOpacity>
          )}

          {PLAY_STORE_URL && (
            <TouchableOpacity
              onPress={() => handleStorePress('play_store', PLAY_STORE_URL!)}
              activeOpacity={0.8}
              style={styles.storeButton}>
              <GooglePlayIcon size={28} />
              <View>
                <ThemedText style={styles.storeLabel}>{t('download.playStoreLabel')}</ThemedText>
                <ThemedText style={styles.storeName}>{t('download.playStoreName')}</ThemedText>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <ThemedText style={[styles.footerLink, { color: colors.tabIconDefault }]}>
          © 2026 Indirimbo
        </ThemedText>
        {FOOTER_LINKS.map((link) => (
          <Pressable
            key={link.href}
            onPress={() => router.navigate(link.href)}
            accessibilityRole="link">
            <ThemedText style={[styles.footerLink, { color: colors.tabIconDefault }]}>
              {t(link.labelKey)}
            </ThemedText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: RIGHT_COLUMN_WIDTH,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 20,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 6,
  },
  cardTitle: {
    fontSize: 17,
  },
  cardPitch: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  storeButtons: {
    gap: 10,
  },
  storeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#000000',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  storeLabel: {
    fontSize: 10,
    lineHeight: 13,
    color: '#CCCCCC',
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 20,
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 6,
    columnGap: 12,
  },
  footerLink: {
    fontSize: 13,
    lineHeight: 16,
  },
});
