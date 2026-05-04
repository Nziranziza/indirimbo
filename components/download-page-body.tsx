import { CollapsibleHeaderScrollView } from '@/components/collapsible-header-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GooglePlayIcon } from '@/components/ui/google-play-icon';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { APP_STORE_URL, APP_UNIVERSAL_LINK_URL, PLAY_STORE_URL } from '@/constants/app-links';
import { useColors } from '@/hooks/use-colors';
import { Image, Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export type DownloadVariant = 'default' | 'kirundi';

interface DownloadPageBodyProps {
  readonly variant?: DownloadVariant;
}

export function DownloadPageBody({ variant = 'default' }: DownloadPageBodyProps) {
  const colors = useColors();
  const isKirundi = variant === 'kirundi';

  const tagline = isKirundi
    ? 'Cantiques Kirundi, Gushimisha Imana & Agakiza'
    : 'Gushimisha Imana & Agakiza';

  const description = isKirundi
    ? 'Get the Indirimbo app for the best experience. Browse Cantiques Kirundi, Gushimisha Imana, and Agakiza offline, save favorites, customize your reading experience, and more.'
    : 'Get the Indirimbo app for the best experience. Browse hymns offline, save favorites, customize your reading experience, and more.';

  return (
    <CollapsibleHeaderScrollView
      title="Download"
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
            onPress={() => Linking.openURL(APP_STORE_URL!)}
            activeOpacity={0.8}
            style={[styles.storeButton, { borderColor: colors.icon + '40' }]}>
            <IconSymbol name="apple.logo" size={32} color="#FFFFFF" />
            <View>
              <ThemedText style={styles.storeLabel}>Download on the</ThemedText>
              <ThemedText style={styles.storeName}>App Store</ThemedText>
            </View>
          </TouchableOpacity>
        )}

        {PLAY_STORE_URL && (
          <TouchableOpacity
            onPress={() => Linking.openURL(PLAY_STORE_URL!)}
            activeOpacity={0.8}
            style={[styles.storeButton, { borderColor: colors.icon + '40' }]}>
            <GooglePlayIcon size={32} />
            <View>
              <ThemedText style={styles.storeLabel}>Get it on</ThemedText>
              <ThemedText style={styles.storeName}>Google Play</ThemedText>
            </View>
          </TouchableOpacity>
        )}
      </ThemedView>

      <ThemedView
        style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
        <View style={styles.cardHeader}>
          <IconSymbol name="sparkles" size={20} color={colors.tint} />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Why download the app?
          </ThemedText>
        </View>

        <View style={styles.featureList}>
          <FeatureRow icon="icloud.slash" text="Works completely offline" colors={colors} />
          <FeatureRow icon="heart.fill" text="Save your favorite hymns" colors={colors} />
          <FeatureRow icon="magnifyingglass" text="Search by title, number, or lyrics" colors={colors} />
          <FeatureRow icon="textformat.size" text="Adjustable text size" colors={colors} />
          <FeatureRow icon="moon.fill" text="Dark mode support" colors={colors} />
          <FeatureRow icon="square.and.arrow.up" text="Share songs with friends" colors={colors} />
        </View>
      </ThemedView>

      {Platform.OS === 'web' && (
        <ThemedText style={styles.webNote}>
          You can also browse songs directly on the web at{' '}
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
