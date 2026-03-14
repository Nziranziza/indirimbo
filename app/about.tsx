import { CollapsibleHeaderScrollView } from '@/components/collapsible-header-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { FloatingShareButton } from '@/components/ui/floating-share-button';
import { useColors } from '@/hooks/use-colors';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import Head from 'expo-router/head';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AboutScreen() {
  const colors = useColors();

  const FeatureItem = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
    <View style={styles.featureItem}>
      <View style={[styles.featureIcon, { backgroundColor: colors.tint + '15' }]}>
        <IconSymbol name={icon as any} size={24} color={colors.tint} />
      </View>
      <View style={styles.featureContent}>
        <ThemedText type="defaultSemiBold" style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={styles.featureDescription}>{description}</ThemedText>
      </View>
    </View>
  );

  return (
    <>
    <Head>
      <title>About | Indirimbo</title>
      <meta name="description" content="Indirimbo brings Rwandan hymns and worship songs to your fingertips. Browse Gushimisha Imana and Agakiza hymnbooks." />
    </Head>
    <CollapsibleHeaderScrollView
      title="About Indirimbo"
      headerMaxHeight={240}
      contentGap={20}
      extraBottomPadding={80}
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
          Indirimbo brings the beloved hymns and worship songs of Rwandan churches to your fingertips.
          Whether you&apos;re leading worship, singing along at church, or practicing at home,
          Indirimbo is your perfect companion.
        </ThemedText>
      </ThemedView>

      {/* Features */}
      <ThemedView style={styles.featuresSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Features
        </ThemedText>

        <FeatureItem
          icon="music.note.list"
          title="Complete Hymnbooks"
          description="Access songs from Gushimisha Imana and Agakiza hymnbooks, with all verses and choruses."
        />

        <FeatureItem
          icon="magnifyingglass"
          title="Powerful Search"
          description="Find any song instantly by number, title, or even words from the lyrics."
        />

        <FeatureItem
          icon="heart"
          title="Favorites"
          description="Save your most-used songs for quick access during worship or practice."
        />

        <FeatureItem
          icon="clock"
          title="Recent Songs"
          description="Quickly return to songs you've recently viewed."
        />

        <FeatureItem
          icon="textformat.size"
          title="Adjustable Text"
          description="Customize the font size for comfortable reading on any device."
        />

        <FeatureItem
          icon="chart.bar.fill"
          title="Song Navigation"
          description="Visual heatmap shows all verses and choruses. Tap any section to jump directly to it."
        />

        <FeatureItem
          icon="square.and.arrow.up"
          title="Easy Sharing"
          description="Share songs with friends, family, or your worship team."
        />

        <FeatureItem
          icon="icloud.slash"
          title="Works Offline"
          description="All songs are stored on your device. No internet needed after installation."
        />

        <FeatureItem
          icon="moon"
          title="Dark Mode"
          description="Easy on the eyes with automatic dark mode support."
        />
      </ThemedView>

      {/* Playlists */}
      <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
        <View style={styles.cardHeader}>
          <IconSymbol name="music.mic" size={20} color={colors.tint} />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Available Hymnbooks
          </ThemedText>
        </View>
        <View style={styles.playlistItem}>
          <ThemedText type="defaultSemiBold">Gushimisha Imana</ThemedText>
          <ThemedText style={styles.playlistDescription}>
            A collection of praise and worship songs widely used in Rwandan churches.
          </ThemedText>
        </View>
        <View style={[styles.playlistItem, styles.playlistItemLast]}>
          <ThemedText type="defaultSemiBold">Agakiza</ThemedText>
          <ThemedText style={styles.playlistDescription}>
            Traditional hymns focused on salvation and spiritual themes.
          </ThemedText>
        </View>
      </ThemedView>

      {/* Call to Action */}
      <ThemedView style={styles.ctaSection}>
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/home')}
          activeOpacity={0.8}
          style={[styles.ctaButton, { backgroundColor: colors.tint }]}>
          <IconSymbol name="play.fill" size={20} color={colors.tintForeground} />
          <ThemedText style={[styles.ctaText, { color: colors.tintForeground }]}>Start Exploring Songs</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Footer Links */}
      <ThemedView style={styles.footerLinks}>
        <TouchableOpacity
          onPress={() => router.push('/support')}
          activeOpacity={0.7}>
          <ThemedText style={[styles.footerLink, { color: colors.tint }]}>Support</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.footerDot}>•</ThemedText>
        <TouchableOpacity
          onPress={() => router.push('/privacy-policy')}
          activeOpacity={0.7}>
          <ThemedText style={[styles.footerLink, { color: colors.tint }]}>Privacy Policy</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.footerDot}>•</ThemedText>
        <TouchableOpacity
          onPress={() => router.push('/terms-of-service')}
          activeOpacity={0.7}>
          <ThemedText style={[styles.footerLink, { color: colors.tint }]}>Terms</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedText style={styles.version}>Version {Constants.expoConfig?.version ?? '1.0.0'}</ThemedText>
    </CollapsibleHeaderScrollView>
    <FloatingShareButton />
    </>
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
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
  },
  featuresSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 4,
  },
  featureItem: {
    flexDirection: 'row',
    gap: 14,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },
  playlistItem: {
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  playlistItemLast: {
    borderBottomWidth: 0,
  },
  playlistDescription: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 4,
    lineHeight: 20,
  },
  ctaSection: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 30,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '600',
  },
  footerLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingTop: 8,
  },
  footerLink: {
    fontSize: 14,
  },
  footerDot: {
    opacity: 0.3,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    opacity: 0.4,
    paddingBottom: 20,
  },
});
