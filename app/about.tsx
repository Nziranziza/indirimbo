import { CollapsibleHeaderScrollView } from '@/components/collapsible-header-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FloatingShareButton } from '@/components/ui/floating-share-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { InfoCard } from '@/components/ui/info-card';
import { useSongbookPreference } from '@/contexts/songbook-preference-context';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import { PageHead } from '@/components/page-head';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

function FeatureItem({ icon, title, description }: { icon: IconSymbolName; title: string; description: string }) {
  const colors = useColors();

  return (
    <View style={styles.featureItem}>
      <View style={[styles.featureIcon, { backgroundColor: colors.tint + '15' }]}>
        <IconSymbol name={icon} size={24} color={colors.tint} />
      </View>
      <View style={styles.featureContent}>
        <ThemedText type="defaultSemiBold" style={styles.featureTitle}>{title}</ThemedText>
        <ThemedText style={styles.featureDescription}>{description}</ThemedText>
      </View>
    </View>
  );
}

export default function AboutScreen() {
  const colors = useColors();
  const { isBurundi } = useSongbookPreference();
  const { t } = useTranslation();

  return (
    <>
    <PageHead
      title={t('about.pageTitle')}
      description={isBurundi ? t('about.pageDescriptionKirundi') : t('about.pageDescriptionKinyarwanda')}
      canonicalPath="/about/"
    />
    <CollapsibleHeaderScrollView
      title={t('about.title')}
      headerMaxHeight={240}
      contentGap={20}
      hasFab
      fallbackHref="/(tabs)/settings"
      headerContent={
        <View style={styles.heroSection}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.appIcon}
            accessibilityLabel={t('about.iconA11y')}
          />
          <ThemedText type="title" style={styles.appName}>
            Indirimbo
          </ThemedText>
          <ThemedText style={styles.tagline}>
            {isBurundi ? t('about.taglineKirundi') : t('about.taglineKinyarwanda')}
          </ThemedText>
        </View>
      }>
      {/* Description */}
      <ThemedView
        style={[
          styles.descriptionCard,
          { borderColor: colors.tint + '30', backgroundColor: colors.tint + '08' },
        ]}>
        <ThemedText style={styles.description}>
          {isBurundi ? t('about.descriptionKirundi') : t('about.descriptionKinyarwanda')}
        </ThemedText>
      </ThemedView>

      {/* Features */}
      <ThemedView style={styles.featuresSection}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {t('about.featuresTitle')}
        </ThemedText>

        <FeatureItem
          icon="music.note.list"
          title={t('about.feature.completeHymnbooks.title')}
          description={isBurundi
            ? t('about.feature.completeHymnbooks.kirundi')
            : t('about.feature.completeHymnbooks.kinyarwanda')}
        />
        <FeatureItem icon="magnifyingglass" title={t('about.feature.search.title')} description={t('about.feature.search.description')} />
        <FeatureItem icon="heart" title={t('about.feature.favorites.title')} description={t('about.feature.favorites.description')} />
        <FeatureItem icon="clock" title={t('about.feature.recent.title')} description={t('about.feature.recent.description')} />
        <FeatureItem icon="textformat.size" title={t('about.feature.adjustableText.title')} description={t('about.feature.adjustableText.description')} />
        <FeatureItem icon="chart.bar.fill" title={t('about.feature.songNavigation.title')} description={t('about.feature.songNavigation.description')} />
        <FeatureItem icon="square.and.arrow.up" title={t('about.feature.sharing.title')} description={t('about.feature.sharing.description')} />
        <FeatureItem icon="icloud.slash" title={t('about.feature.offline.title')} description={t('about.feature.offline.description')} />
        <FeatureItem icon="moon" title={t('about.feature.darkMode.title')} description={t('about.feature.darkMode.description')} />
      </ThemedView>

      {/* Playlists */}
      <InfoCard icon="music.mic" title={t('about.hymnbooks.title')}>
        {isBurundi && (
          <View style={styles.playlistItem}>
            <ThemedText type="defaultSemiBold">Cantiques Kirundi</ThemedText>
            <ThemedText style={styles.playlistDescription}>
              {t('about.hymnbook.kirundi.description')}
            </ThemedText>
          </View>
        )}
        <View style={styles.playlistItem}>
          <ThemedText type="defaultSemiBold">Gushimisha Imana</ThemedText>
          <ThemedText style={styles.playlistDescription}>
            {t('about.hymnbook.gushimisha.description')}
          </ThemedText>
        </View>
        <View style={[styles.playlistItem, styles.playlistItemLast]}>
          <ThemedText type="defaultSemiBold">Agakiza</ThemedText>
          <ThemedText style={styles.playlistDescription}>
            {t('about.hymnbook.agakiza.description')}
          </ThemedText>
        </View>
      </InfoCard>

      {/* Call to Action */}
      <ThemedView style={styles.ctaSection}>
        <TouchableOpacity
          onPress={() => router.navigate('/(tabs)/(home)')}
          accessibilityLabel={t('about.ctaA11y')}
          accessibilityRole="button"
          activeOpacity={0.8}
          style={[styles.ctaButton, { backgroundColor: colors.tint }]}>
          <IconSymbol name="play.fill" size={20} color={colors.tintForeground} />
          <ThemedText style={[styles.ctaText, { color: colors.tintForeground }]}>{t('about.cta')}</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Footer Links */}
      <ThemedView style={styles.footerLinks}>
        <TouchableOpacity onPress={() => router.navigate('/support')} accessibilityRole="link" activeOpacity={0.7}>
          <ThemedText style={[styles.footerLink, { color: colors.tint }]}>{t('about.footer.support')}</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.footerDot}>•</ThemedText>
        <TouchableOpacity onPress={() => router.navigate('/privacy-policy')} accessibilityRole="link" activeOpacity={0.7}>
          <ThemedText style={[styles.footerLink, { color: colors.tint }]}>{t('about.footer.privacy')}</ThemedText>
        </TouchableOpacity>
        <ThemedText style={styles.footerDot}>•</ThemedText>
        <TouchableOpacity onPress={() => router.navigate('/terms-of-service')} accessibilityRole="link" activeOpacity={0.7}>
          <ThemedText style={[styles.footerLink, { color: colors.tint }]}>{t('about.footer.terms')}</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedText style={styles.version}>{t('about.version', { version: Constants.expoConfig?.version ?? '1.0.0' })}</ThemedText>
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
  descriptionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
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
