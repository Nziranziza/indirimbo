import { CollapsibleHeaderScrollView } from '@/components/collapsible-header-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { APP_STORE_URL, APP_UNIVERSAL_LINK_URL, PLAY_STORE_URL } from '@/constants/app-links';
import { useColors } from '@/hooks/use-colors';
import { Redirect } from 'expo-router';
import { PageHead } from '@/components/page-head';
import { Image, Linking, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

const BASE_URL = APP_UNIVERSAL_LINK_URL;

export default function DownloadScreen() {
  const colors = useColors();

  if (Platform.OS !== 'web') {
    return <Redirect href="/(tabs)/(home)" />;
  }

  return (
    <>
      <PageHead
        title="Download Indirimbo - Rwandan Hymns App"
        description="Download Indirimbo for iOS and Android. Browse Rwandan church hymns from Agakiza and Gushimisha Imana hymnbooks. Free on the App Store and Google Play."
        canonicalPath="/download"
        keywords="indirimbo download, indirimbo app, rwandan hymns app, agakiza app, gushimisha app, kinyarwanda worship songs"
      />

      <CollapsibleHeaderScrollView
        title="Download"
        headerMaxHeight={260}
        contentGap={20}
        fallbackHref="/(tabs)/settings"
        headerContent={
          <View style={styles.heroSection}>
            <Image
              source={require('@/assets/images/icon.png')}
              style={styles.appIcon}
            />
            <ThemedText type="title" style={styles.appName}>
              Indirimbo
            </ThemedText>
            <ThemedText style={styles.tagline}>
              Gushimisha Imana & Agakiza
            </ThemedText>
          </View>
        }>
        {/* Description */}
        <ThemedView
          style={[
            styles.card,
            { borderColor: colors.tint + '30', backgroundColor: colors.tint + '08' },
          ]}>
          <ThemedText style={styles.description}>
            Get the Indirimbo app for the best experience.
            Browse hymns offline, save favorites, customize your reading experience, and more.
          </ThemedText>
        </ThemedView>

        {/* Store Links */}
        <ThemedView style={styles.storeSection}>
          {APP_STORE_URL && (
            <TouchableOpacity
              onPress={() => Linking.openURL(APP_STORE_URL!)}
              activeOpacity={0.8}
              style={[styles.storeButton, { borderColor: colors.icon + '40' }]}>
              <IconSymbol name="apple.logo" size={32} color="#FFFFFF" />
              <View>
                <ThemedText style={styles.storeLabel}>
                  Download on the
                </ThemedText>
                <ThemedText style={styles.storeName}>
                  App Store
                </ThemedText>
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
                <ThemedText style={styles.storeLabel}>
                  Get it on
                </ThemedText>
                <ThemedText style={styles.storeName}>
                  Google Play
                </ThemedText>
              </View>
            </TouchableOpacity>
          )}
        </ThemedView>

        {/* Features Highlight */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
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

        {/* Web alternative */}
        {Platform.OS === 'web' && (
          <ThemedText style={styles.webNote}>
            You can also browse songs directly on the web at{' '}
            <ThemedText
              style={[styles.webLink, { color: colors.tint }]}
              onPress={() => Linking.openURL(BASE_URL)}>
              indirimbo.rw
            </ThemedText>
          </ThemedText>
        )}
      </CollapsibleHeaderScrollView>
    </>
  );
}

function GooglePlayIcon({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <LinearGradient id="blue_green" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#00C3FF" />
          <Stop offset="1" stopColor="#1BE2A0" />
        </LinearGradient>
      </Defs>
      {/* Blue - top left */}
      <Path d="M3 2.5 L12 12 L3 21.5 Z" fill="#4285F4" />
      {/* Green - top right */}
      <Path d="M3 2.5 L15 9 L12 12 Z" fill="#0F9D58" />
      {/* Red - bottom right */}
      <Path d="M12 12 L15 15 L3 21.5 Z" fill="#DB4437" />
      {/* Yellow - right */}
      <Path d="M15 9 L21 12 L15 15 L12 12 Z" fill="#F4B400" />
    </Svg>
  );
}

function FeatureRow({ icon, text, colors }: { icon: IconSymbolName; text: string; colors: ReturnType<typeof useColors> }) {
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
