import { Image } from 'expo-image';
import { memo, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useColors } from '@/hooks/use-colors';
import { useFabBottom } from '@/hooks/use-fab-bottom';
import { useTranslation } from '@/hooks/use-translation';
import { trackEvent } from '@/utils/analytics';
import { openStoreForCurrentPlatform } from '@/utils/store';

const APP_ICON = require('@/assets/images/icon.png');

interface UpdateAvailableBannerProps {
  readonly inTabs?: boolean;
}

export const UpdateAvailableBanner = memo(function UpdateAvailableBanner({
  inTabs = false,
}: UpdateAvailableBannerProps) {
  const colors = useColors();
  const bottom = useFabBottom(inTabs);
  const { t } = useTranslation();

  const handlePress = useCallback(() => {
    trackEvent('update_tap', { variant: 'banner-available' });
    void openStoreForCurrentPlatform();
  }, []);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={t('common.update.bannerA11y')}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.tint + '30',
          bottom,
        },
      ]}
    >
      <Image source={APP_ICON} style={styles.icon} contentFit="contain" />
      <View style={styles.text}>
        <ThemedText style={styles.title}>{t('common.update.bannerTitle')}</ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.icon }]}>{t('common.update.bannerSubtitle')}</ThemedText>
      </View>
      <View style={[styles.cta, { backgroundColor: colors.tint }]}>
        <ThemedText style={[styles.ctaText, { color: colors.tintForeground }]}>{t('common.update.bannerCta')}</ThemedText>
      </View>
    </TouchableOpacity>
  );
});

const ICON_SIZE = 36;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 50,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE * 0.22,
  },
  text: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  cta: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
