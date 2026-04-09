import { CollapsibleHeaderScrollView } from '@/components/collapsible-header-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { BulletItem } from '@/components/ui/bullet-item';
import { ContactSection } from '@/components/ui/contact-section';
import { FloatingShareButton } from '@/components/ui/floating-share-button';
import { InfoCard } from '@/components/ui/info-card';
import { PageHead } from '@/components/page-head';
import { StyleSheet } from 'react-native';

export default function TermsOfServiceScreen() {
  return (
    <>
    <PageHead
      title="Terms of Service | Indirimbo"
      description="Terms of service for the Indirimbo app. Guidelines for using the Rwandan hymnal app."
      canonicalPath="/terms-of-service/"
    />
    <CollapsibleHeaderScrollView
      title="Terms of Service"
      subtitle="Guidelines for using the app"
      hasFab
      fallbackHref="/(tabs)/settings">
      <ThemedText style={[styles.date, { opacity: 0.5 }]}>
        Last Updated: February 1, 2026
      </ThemedText>

      {/* Summary */}
      <InfoCard icon="sparkles" title="Summary" isHighlighted>
        <BulletItem>Use the app responsibly for personal, non-commercial use.</BulletItem>
        <BulletItem>Do not try to harm, copy, or disrupt the app.</BulletItem>
        <BulletItem>We may update features and fix issues over time.</BulletItem>
      </InfoCard>

      {/* Agreement */}
      <InfoCard icon="checkmark.seal" title="Agreement">
        <ThemedText style={styles.paragraph}>
          By using Indirimbo, you agree to these terms. If you do not agree, please do not use the app.
        </ThemedText>
      </InfoCard>

      {/* Who Can Use This App */}
      <InfoCard icon="person.2" title="Who Can Use This App">
        <ThemedText style={styles.paragraph}>
          The app is for everyone. Children should use it with parental supervision.
        </ThemedText>
      </InfoCard>

      {/* What You Can Do */}
      <InfoCard icon="hand.thumbsup" title="What You Can Do">
        <ThemedText style={styles.paragraph}>
          You may use the app for personal, non-commercial purposes.
        </ThemedText>
      </InfoCard>

      {/* What You Can't Do */}
      <InfoCard icon="hand.raised" title="What You Can't Do">
        <ThemedText style={styles.paragraph}>
          Please do not:
        </ThemedText>
        <BulletItem>Use the app for illegal purposes</BulletItem>
        <BulletItem>Attempt to hack or disrupt the app</BulletItem>
        <BulletItem>Copy, reverse engineer, or modify the app&apos;s code</BulletItem>
        <BulletItem>Do anything that could harm the app or other users</BulletItem>
      </InfoCard>

      {/* Content */}
      <InfoCard icon="doc.plaintext" title="Content">
        <ThemedText style={styles.paragraph}>
          The app is provided &quot;as is.&quot; We do not guarantee uninterrupted or error-free service, but we aim to fix issues promptly.
        </ThemedText>
      </InfoCard>

      {/* Updates */}
      <InfoCard icon="arrow.clockwise" title="Updates">
        <ThemedText style={styles.paragraph}>
          We may update the app at any time to add features, improve performance, or fix bugs.
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
