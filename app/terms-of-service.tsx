import { CollapsibleHeaderScrollView } from '@/components/collapsible-header-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { BulletItem } from '@/components/ui/bullet-item';
import { ContactSection } from '@/components/ui/contact-section';
import { FloatingShareButton } from '@/components/ui/floating-share-button';
import { InfoCard } from '@/components/ui/info-card';
import { PageHead } from '@/components/page-head';
import { useTranslation } from '@/hooks/use-translation';
import { StyleSheet } from 'react-native';

export default function TermsOfServiceScreen() {
  const { t } = useTranslation();

  return (
    <>
    <PageHead
      title={t('terms.pageTitle')}
      description={t('terms.pageDescription')}
      canonicalPath="/terms-of-service/"
    />
    <CollapsibleHeaderScrollView
      title={t('terms.title')}
      subtitle={t('terms.subtitle')}
      hasFab
      fallbackHref="/(tabs)/settings">
      <ThemedText style={[styles.date, { opacity: 0.5 }]}>
        {t('common.lastUpdated', { date: t('common.lastUpdatedDate') })}
      </ThemedText>

      {/* Summary */}
      <InfoCard icon="sparkles" title={t('common.summary')} isHighlighted>
        <BulletItem>{t('terms.summary.useResponsibly')}</BulletItem>
        <BulletItem>{t('terms.summary.doNotHarm')}</BulletItem>
        <BulletItem>{t('terms.summary.updates')}</BulletItem>
      </InfoCard>

      {/* Agreement */}
      <InfoCard icon="checkmark.seal" title={t('terms.agreement.title')}>
        <ThemedText style={styles.paragraph}>
          {t('terms.agreement.body')}
        </ThemedText>
      </InfoCard>

      {/* Who Can Use This App */}
      <InfoCard icon="person.2" title={t('terms.who.title')}>
        <ThemedText style={styles.paragraph}>
          {t('terms.who.body')}
        </ThemedText>
      </InfoCard>

      {/* What You Can Do */}
      <InfoCard icon="hand.thumbsup" title={t('terms.whatYouCanDo.title')}>
        <ThemedText style={styles.paragraph}>
          {t('terms.whatYouCanDo.body')}
        </ThemedText>
      </InfoCard>

      {/* What You Can't Do */}
      <InfoCard icon="hand.raised" title={t('terms.whatYouCannotDo.title')}>
        <ThemedText style={styles.paragraph}>
          {t('terms.whatYouCannotDo.body')}
        </ThemedText>
        <BulletItem>{t('terms.whatYouCannotDo.illegal')}</BulletItem>
        <BulletItem>{t('terms.whatYouCannotDo.hack')}</BulletItem>
        <BulletItem>{t('terms.whatYouCannotDo.copy')}</BulletItem>
        <BulletItem>{t('terms.whatYouCannotDo.harm')}</BulletItem>
      </InfoCard>

      {/* Content */}
      <InfoCard icon="doc.plaintext" title={t('terms.content.title')}>
        <ThemedText style={styles.paragraph}>
          {t('terms.content.body')}
        </ThemedText>
      </InfoCard>

      {/* Updates */}
      <InfoCard icon="arrow.clockwise" title={t('terms.updates.title')}>
        <ThemedText style={styles.paragraph}>
          {t('terms.updates.body')}
        </ThemedText>
      </InfoCard>

      {/* Contact */}
      <ContactSection />
    </CollapsibleHeaderScrollView>
    <FloatingShareButton />
    </>
  );
}

const styles = StyleSheet.create({
  date: {
    fontSize: 12,
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 8,
    lineHeight: 22,
    opacity: 0.9,
  },
});
