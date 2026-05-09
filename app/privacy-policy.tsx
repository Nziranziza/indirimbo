import { CollapsibleHeaderScrollView } from '@/components/collapsible-header-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { BulletItem } from '@/components/ui/bullet-item';
import { ContactSection } from '@/components/ui/contact-section';
import { FloatingShareButton } from '@/components/ui/floating-share-button';
import { InfoCard } from '@/components/ui/info-card';
import { PageHead } from '@/components/page-head';
import { useTranslation } from '@/hooks/use-translation';
import { StyleSheet } from 'react-native';

export default function PrivacyPolicyScreen() {
  const { t } = useTranslation();

  return (
    <>
    <PageHead
      title={t('privacy.pageTitle')}
      description={t('privacy.pageDescription')}
      canonicalPath="/privacy-policy/"
    />
    <CollapsibleHeaderScrollView
      title={t('privacy.title')}
      subtitle={t('privacy.subtitle')}
      hasFab
      fallbackHref="/(tabs)/settings">
      <ThemedText style={[styles.date, { opacity: 0.5 }]}>
        {t('common.lastUpdated', { date: t('common.lastUpdatedDate') })}
      </ThemedText>

      {/* Summary */}
      <InfoCard icon="sparkles" title={t('common.summary')} isHighlighted>
        <BulletItem>{t('privacy.summary.collect')}</BulletItem>
        <BulletItem>{t('privacy.summary.noShare')}</BulletItem>
        <BulletItem>{t('privacy.summary.contact')}</BulletItem>
      </InfoCard>

      {/* What We Collect */}
      <InfoCard icon="doc.text" title={t('privacy.collect.title')}>
        <ThemedText style={styles.paragraph}>
          {t('privacy.collect.body')}
        </ThemedText>
        <BulletItem>{t('privacy.collect.usage')}</BulletItem>
        <BulletItem>{t('privacy.collect.device')}</BulletItem>
      </InfoCard>

      {/* What We Don't Collect */}
      <InfoCard icon="xmark.circle" title={t('privacy.notCollect.title')}>
        <BulletItem>{t('privacy.notCollect.personal')}</BulletItem>
        <BulletItem>{t('privacy.notCollect.location')}</BulletItem>
        <BulletItem>{t('privacy.notCollect.photos')}</BulletItem>
        <BulletItem>{t('privacy.notCollect.payment')}</BulletItem>
      </InfoCard>

      {/* How We Use Your Data */}
      <InfoCard icon="gearshape" title={t('privacy.use.title')}>
        <ThemedText style={styles.paragraph}>
          {t('privacy.use.body')}
        </ThemedText>
        <BulletItem>{t('privacy.use.fixBugs')}</BulletItem>
        <BulletItem>{t('privacy.use.patterns')}</BulletItem>
      </InfoCard>

      {/* Sharing */}
      <InfoCard icon="lock.shield" title={t('privacy.sharing.title')}>
        <ThemedText style={styles.paragraph}>
          {t('privacy.sharing.body')}
        </ThemedText>
      </InfoCard>

      {/* Children */}
      <InfoCard icon="figure.2.and.child.holdinghands" title={t('privacy.children.title')}>
        <ThemedText style={styles.paragraph}>
          {t('privacy.children.body')}
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
