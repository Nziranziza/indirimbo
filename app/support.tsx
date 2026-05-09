import { CollapsibleHeaderScrollView } from '@/components/collapsible-header-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { BulletItem } from '@/components/ui/bullet-item';
import { ContactSection } from '@/components/ui/contact-section';
import { FloatingShareButton } from '@/components/ui/floating-share-button';
import { InfoCard } from '@/components/ui/info-card';
import { useSongbookPreference } from '@/contexts/songbook-preference-context';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import { router } from 'expo-router';
import { PageHead } from '@/components/page-head';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function SupportScreen() {
  const colors = useColors();
  const { isBurundi } = useSongbookPreference();
  const { t } = useTranslation();

  return (
    <>
    <PageHead
      title={t('support.pageTitle')}
      description={isBurundi ? t('support.pageDescriptionKirundi') : t('support.pageDescriptionKinyarwanda')}
      canonicalPath="/support/"
    />
    <CollapsibleHeaderScrollView
      title={t('support.title')}
      subtitle={t('support.subtitle')}
      hasFab
      fallbackHref="/(tabs)/settings">
      {/* Getting Started */}
      <InfoCard icon="sparkles" title={t('support.gettingStarted.title')} isHighlighted>
        <ThemedText style={styles.paragraph}>
          {isBurundi ? t('support.gettingStarted.bodyKirundi') : t('support.gettingStarted.bodyKinyarwanda')}
        </ThemedText>
      </InfoCard>

      {/* How to Use */}
      <InfoCard icon="book" title={t('support.howToUse.title')}>
        <BulletItem>{isBurundi ? t('support.howToUse.browseKirundi') : t('support.howToUse.browseKinyarwanda')}</BulletItem>
        <BulletItem>{t('support.howToUse.searchBar')}</BulletItem>
        <BulletItem>{t('support.howToUse.heart')}</BulletItem>
        <BulletItem>{t('support.howToUse.share')}</BulletItem>
        <BulletItem>{t('support.howToUse.textSize')}</BulletItem>
      </InfoCard>

      {/* Frequently Asked Questions */}
      <InfoCard icon="questionmark.circle" title={t('support.faq.title')}>
        <ThemedText type="defaultSemiBold" style={styles.faqQuestion}>
          {t('support.faq.findSong.q')}
        </ThemedText>
        <ThemedText style={styles.faqAnswer}>
          {t('support.faq.findSong.a')}
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.faqQuestion}>
          {t('support.faq.offline.q')}
        </ThemedText>
        <ThemedText style={styles.faqAnswer}>
          {t('support.faq.offline.a')}
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.faqQuestion}>
          {t('support.faq.textSize.q')}
        </ThemedText>
        <ThemedText style={styles.faqAnswer}>
          {t('support.faq.textSize.a')}
        </ThemedText>
      </InfoCard>

      {/* Report an Issue */}
      <InfoCard icon="exclamationmark.triangle" title={t('support.report.title')}>
        <ThemedText style={styles.paragraph}>
          {t('support.report.body')}
        </ThemedText>
        <BulletItem>{t('support.report.songName')}</BulletItem>
        <BulletItem>{t('support.report.description')}</BulletItem>
        <BulletItem>{t('support.report.device')}</BulletItem>
      </InfoCard>

      {/* Contact Us */}
      <ContactSection preamble={t('support.contact.preamble')} />

      {/* Links */}
      <InfoCard icon="link" title={t('support.legal.title')}>
        <TouchableOpacity
          onPress={() => router.navigate('/privacy-policy')}
          activeOpacity={0.7}
          style={styles.linkItem}>
          <ThemedText style={{ color: colors.tint }}>{t('support.legal.privacy')}</ThemedText>
          <IconSymbol name="arrow.right" size={16} color={colors.tint} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.navigate('/terms-of-service')}
          activeOpacity={0.7}
          style={[styles.linkItem, styles.linkItemLast]}>
          <ThemedText style={{ color: colors.tint }}>{t('support.legal.terms')}</ThemedText>
          <IconSymbol name="arrow.right" size={16} color={colors.tint} />
        </TouchableOpacity>
      </InfoCard>
    </CollapsibleHeaderScrollView>
    <FloatingShareButton />
    </>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    marginBottom: 8,
    lineHeight: 22,
    opacity: 0.9,
  },
  faqQuestion: {
    marginTop: 8,
    marginBottom: 4,
  },
  faqAnswer: {
    marginBottom: 12,
    lineHeight: 22,
    opacity: 0.85,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  linkItemLast: {
    borderBottomWidth: 0,
  },
});
