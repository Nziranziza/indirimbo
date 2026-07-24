import { Image } from 'expo-image';
import { useCallback, useEffect, useMemo, useSyncExternalStore, type ReactElement } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GooglePlayIcon } from '@/components/ui/google-play-icon';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import type { TranslationKey } from '@/constants/translations';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import { trackEvent } from '@/utils/analytics';
import {
  getMobileWebPlatform,
  getStoreUrl,
  isStandaloneWeb,
  openAppOrStore,
  type MobileWebPlatform,
} from '@/utils/mobile-web';

const APP_ICON = require('@/assets/images/app-logo.webp');
const APP_ICON_SIZE = 48;
const FEATURE_ICON_SIZE = 18;

const FEATURES: readonly { icon: IconSymbolName; labelKey: TranslationKey }[] = [
  { icon: 'icloud.slash', labelKey: 'songEndCta.featureOffline' },
  { icon: 'heart.fill', labelKey: 'songEndCta.featureFavorites' },
  { icon: 'music.note.list', labelKey: 'songEndCta.featureCollection' },
  { icon: 'sparkles', labelKey: 'songEndCta.featureAdFree' },
];

// No external store to subscribe to — the visible platform is fixed for the
// life of the page, so the subscribe callback is a no-op.
const NO_SUBSCRIPTION = () => () => {};

/**
 * The mobile-web platform the CTA should target, or null when it shouldn't
 * show (desktop web, native, standalone PWA, or no store link). Read via a
 * client-only snapshot so it's null during the static prerender and first
 * hydration render, then the real value once mounted — no hydration mismatch.
 */
function getVisiblePlatform(): MobileWebPlatform | null {
  const detected = getMobileWebPlatform();
  if (!detected || isStandaloneWeb() || !getStoreUrl(detected)) {
    return null;
  }
  return detected;
}

/**
 * Descriptive end-of-song install card for mobile web. Shown inline after the
 * lyrics — once the reader has finished the song — instead of a floating
 * banner, so it reads as a natural next step rather than an ad. Renders nothing
 * on desktop web, native, standalone PWAs, or when no store link exists.
 */
export function SongEndCta(): ReactElement | null {
  const colors = useColors();
  const { t } = useTranslation();
  const platform = useSyncExternalStore(NO_SUBSCRIPTION, getVisiblePlatform, () => null);

  useEffect(() => {
    if (platform) {
      trackEvent('show_song_cta', { platform });
    }
  }, [platform]);

  const storeUrl = useMemo(() => (platform ? getStoreUrl(platform) : null), [platform]);

  const handleInstall = useCallback(() => {
    if (!platform) return;
    trackEvent('tap_song_cta', { platform });
    openAppOrStore(platform, storeUrl);
  }, [platform, storeUrl]);

  if (!platform) {
    return null;
  }

  const storeName = platform === 'ios' ? 'App Store' : 'Google Play';

  return (
    <View style={[styles.card, { backgroundColor: colors.tint + '0D', borderColor: colors.tint + '33' }]}>
      <View style={styles.headerRow}>
        <Image
          source={APP_ICON}
          style={styles.appIcon}
          contentFit="cover"
          accessibilityLabel="Indirimbo"
        />
        <View style={styles.headerText}>
          <Text style={[styles.title, { color: colors.text }]}>{t('songEndCta.title')}</Text>
          <Text style={[styles.description, { color: colors.icon }]}>{t('songEndCta.description')}</Text>
        </View>
      </View>

      <View style={styles.features}>
        {FEATURES.map((feature) => (
          <View key={feature.labelKey} style={styles.featureRow}>
            <IconSymbol name={feature.icon} size={FEATURE_ICON_SIZE} color={colors.tint} />
            <Text style={[styles.featureLabel, { color: colors.text }]}>
              {t(feature.labelKey)}
            </Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleInstall}
        activeOpacity={0.85}
        style={[styles.installButton, { backgroundColor: colors.tint }]}
        accessibilityRole="button"
        accessibilityLabel={t('songEndCta.install', { store: storeName })}
      >
        {platform === 'ios' ? (
          <IconSymbol name="apple.logo" size={18} color="#FFFFFF" />
        ) : (
          <GooglePlayIcon size={18} color="#FFFFFF" />
        )}
        <Text style={styles.installLabel}>{t('songEndCta.install', { store: storeName })}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 40,
    // The song heatmap sits in the right gutter (~20px wide from the edge). This
    // margin leaves a gap before it that matches the card's left inset, so the
    // card reads as evenly spaced rather than butting against the scrollbar.
    marginRight: 24,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appIcon: {
    width: APP_ICON_SIZE,
    height: APP_ICON_SIZE,
    borderRadius: 12,
  },
  headerText: {
    flex: 1,
    gap: 3,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  features: {
    gap: 10,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureLabel: {
    fontSize: 14,
    flex: 1,
  },
  installButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  installLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
