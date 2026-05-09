import { Image } from 'expo-image';
import { useCallback } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import type { TranslationKey } from '@/constants/translations';
import { useUpdateCheck } from '@/contexts/update-check-context';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import { trackEvent } from '@/utils/analytics';
import { openStoreForCurrentPlatform } from '@/utils/store';

import { IconSymbol } from './icon-symbol';

const APP_ICON = require('@/assets/images/icon.png');

const COPY_KEYS: Record<'required' | 'available', { titleKey: TranslationKey; bodyKey: TranslationKey }> = {
  required: {
    titleKey: 'common.update.requiredTitle',
    bodyKey: 'common.update.requiredBody',
  },
  available: {
    titleKey: 'common.update.availableTitle',
    bodyKey: 'common.update.availableBody',
  },
};

export function ForceUpdateModal() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { mode, acknowledgeSkip } = useUpdateCheck();
  const { t } = useTranslation();

  const isVisible = mode === 'modal-required' || mode === 'modal-available';
  const variant = mode === 'modal-required' ? 'required' : 'available';
  const canSkip = variant === 'available';

  const handleUpdatePress = useCallback(() => {
    trackEvent('update_tap', { variant: mode });
    void openStoreForCurrentPlatform();
  }, [mode]);

  const handleRequestClose = useCallback(() => {
    if (canSkip) acknowledgeSkip();
  }, [canSkip, acknowledgeSkip]);

  const { titleKey, bodyKey } = COPY_KEYS[variant];
  const title = t(titleKey);
  const body = t(bodyKey);

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={false}
      onRequestClose={handleRequestClose}
      statusBarTranslucent
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + 24,
            paddingBottom: insets.bottom + 24,
          },
        ]}
      >
        <Image source={APP_ICON} style={styles.appIcon} contentFit="contain" />
        <View style={styles.content}>
          <View style={[styles.iconCircle, { backgroundColor: colors.tint + '15' }]}>
            <IconSymbol name="arrow.down.circle.fill" size={56} color={colors.tint} />
          </View>
          <ThemedText style={styles.title} type="title">
            {title}
          </ThemedText>
          <ThemedText style={styles.body}>{body}</ThemedText>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleUpdatePress}
            style={[styles.button, { backgroundColor: colors.tint }]}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={t('common.update.updateNow')}
          >
            <ThemedText style={[styles.buttonText, { color: colors.tintForeground }]}>
              {t('common.update.updateNow')}
            </ThemedText>
          </TouchableOpacity>
          {canSkip && (
            <TouchableOpacity
              onPress={acknowledgeSkip}
              style={styles.skipButton}
              activeOpacity={0.6}
              accessibilityRole="button"
              accessibilityLabel={t('common.update.maybeLater')}
            >
              <ThemedText style={[styles.skipButtonText, { color: colors.icon }]}>
                {t('common.update.maybeLater')}
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const APP_ICON_SIZE = 64;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  appIcon: {
    width: APP_ICON_SIZE,
    height: APP_ICON_SIZE,
    borderRadius: APP_ICON_SIZE * 0.22,
    alignSelf: 'flex-start',
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
    paddingHorizontal: 16,
  },
  actions: {
    gap: 12,
  },
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '700',
  },
  skipButton: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
