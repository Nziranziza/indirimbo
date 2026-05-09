import { CollapsibleHeaderScrollView } from '@/components/collapsible-header-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GooglePlayIcon } from '@/components/ui/google-play-icon';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { APP_STORE_URL, APP_UNIVERSAL_LINK_URL, PLAY_STORE_URL } from '@/constants/app-links';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import { trackEvent } from '@/utils/analytics';
import { useEffect } from 'react';
import { Image, Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export type DownloadVariant = 'default' | 'kirundi';

interface DownloadPageBodyProps {
  readonly variant?: DownloadVariant;
}

export function DownloadPageBody({ variant = 'default' }: DownloadPageBodyProps) {
  const colors = useColors();
  const { t } = useTranslation();
  const isKirundi = variant === 'kirundi';

  useEffect(() => {
    trackEvent('view_download_page', {
      variant: isKirundi ? 'kirundi' : 'kinyarwanda',
    });
  }, [isKirundi]);

  const handleStorePress = async (store: 'app_store' | 'play_store', url: string) => {
    trackEvent('tap_download_store', {
      store,
      variant: isKirundi ? 'kirundi' : 'kinyarwanda',
    });
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening store URL:', error);
    }
  };

  const tagline = isKirundi ? t('download.taglineKirundi') : t('download.taglineKinyarwanda');
  const description = isKirundi ? t('download.descriptionKirundi') : t('download.descriptionKinyarwanda');

  return (
    <CollapsibleHeaderScrollView
      title={t('download.title')}
      headerMaxHeight={260}
      contentGap={20}
      fallbackHref="/(tabs)/settings"
      headerContent={
        <View style={styles.heroSection}>
          <Image source={require('@/assets/images/icon.png')} style={styles.appIcon} />
          <ThemedText type="title" style={styles.appName}>
            Indirimbo
          </ThemedText>
          <ThemedText style={styles.tagline}>{tagline}</ThemedText>
        </View>
      }>
      <ThemedView
        style={[
          styles.card,
          { borderColor: colors.tint + '30', backgroundColor: colors.tint + '08' },
        ]}>
        <ThemedText style={styles.description}>{description}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.storeSection}>
        {APP_STORE_URL && (
          <TouchableOpacity
            onPress={() => handleStorePress('app_store', APP_STORE_URL!)}
            activeOpacity={0.8}
            style={[styles.storeButton, { borderColor: colors.icon + '40' }]}>
            <IconSymbol name="apple.logo" size={32} color="#FFFFFF" />
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
            style={[styles.storeButton, { borderColor: colors.icon + '40' }]}>
            <GooglePlayIcon size={32} />
            <View>
              <ThemedText style={styles.storeLabel}>{t('download.playStoreLabel')}</ThemedText>
              <ThemedText style={styles.storeName}>{t('download.playStoreName')}</ThemedText>
            </View>
          </TouchableOpacity>
        )}
      </ThemedView>

      <ThemedView
        style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
        <View style={styles.cardHeader}>
          <IconSymbol name="sparkles" size={20} color={colors.tint} />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            {t('download.whyDownload')}
          </ThemedText>
        </View>

        <View style={styles.featureList}>
          <FeatureRow icon="icloud.slash" text={t('download.feature.offline')} colors={colors} />
          <FeatureRow icon="heart.fill" text={t('download.feature.favorites')} colors={colors} />
          <FeatureRow icon="magnifyingglass" text={t('download.feature.search')} colors={colors} />
          <FeatureRow icon="textformat.size" text={t('download.feature.textSize')} colors={colors} />
          <FeatureRow icon="moon.fill" text={t('download.feature.darkMode')} colors={colors} />
          <FeatureRow icon="square.and.arrow.up" text={t('download.feature.sharing')} colors={colors} />
        </View>
      </ThemedView>

      {Platform.OS === 'web' && (
        <ThemedText style={styles.webNote}>
          {t('download.webNotePrefix')}
          <ThemedText
            style={[styles.webLink, { color: colors.tint }]}
            onPress={() => Linking.openURL(APP_UNIVERSAL_LINK_URL)}>
            indirimbo.rw
          </ThemedText>
        </ThemedText>
      )}
    </CollapsibleHeaderScrollView>
  );
}

function FeatureRow({
  icon,
  text,
  colors,
}: {
  icon: IconSymbolName;
  text: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.featureRow}>
      <IconSymbol name={icon} size={18} color={colors.tint} />
      <ThemedText style={styles.featureText}>{text}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  appIcon: {
    width: 100,
    height: 100,
    borderRadius: 22,
    marginBottom: 16,
  },
  appName: {
    fontSize: 32,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    opacity: 0.7,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
  },
  storeSection: {
    flexDirection: 'row',
    gap: 10,
  },
  storeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#000000',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  storeLabel: {
    fontSize: 10,
    lineHeight: 13,
    color: '#CCCCCC',
  },
  storeName: {
    fontSize: 17,
    fontWeight: '600',
    lineHeight: 21,
    color: '#FFFFFF',
  },
  featureList: {
    gap: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
  },
  webNote: {
    textAlign: 'center',
    fontSize: 14,
    opacity: 0.6,
    paddingBottom: 20,
  },
  webLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
