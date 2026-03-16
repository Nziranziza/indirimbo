import { CollapsibleHeaderScrollView } from '@/components/collapsible-header-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { BulletItem } from '@/components/ui/bullet-item';
import { ContactSection } from '@/components/ui/contact-section';
import { FloatingShareButton } from '@/components/ui/floating-share-button';
import { InfoCard } from '@/components/ui/info-card';
import Head from 'expo-router/head';
import { StyleSheet } from 'react-native';

export default function PrivacyPolicyScreen() {
  return (
    <>
    <Head>
      <title>Privacy Policy | Indirimbo</title>
      <meta name="description" content="Privacy policy for the Indirimbo app. Learn how we handle your information." />
      <link rel="canonical" href="https://indirimbo.rw/privacy-policy" />
    </Head>
    <CollapsibleHeaderScrollView
      title="Privacy Policy"
      subtitle="How we handle information in the app"
      extraBottomPadding={80}
      fallbackHref="/(tabs)/settings">
      <ThemedText style={[styles.date, { opacity: 0.5 }]}>
        Last Updated: February 1, 2026
      </ThemedText>

      {/* Summary */}
      <InfoCard icon="sparkles" title="Summary" isHighlighted>
        <BulletItem>We collect limited technical data to improve the app.</BulletItem>
        <BulletItem>We do not sell or share your data.</BulletItem>
        <BulletItem>Contact us anytime with questions or concerns.</BulletItem>
      </InfoCard>

      {/* What We Collect */}
      <InfoCard icon="doc.text" title="What We Collect">
        <ThemedText style={styles.paragraph}>
          We collect limited technical information to improve the app:
        </ThemedText>
        <BulletItem>Anonymous usage data (feature usage, crashes)</BulletItem>
        <BulletItem>Device information (model and OS version)</BulletItem>
      </InfoCard>

      {/* What We Don't Collect */}
      <InfoCard icon="xmark.circle" title="What We Do Not Collect">
        <BulletItem>Personal information (name, email, phone)</BulletItem>
        <BulletItem>Location data</BulletItem>
        <BulletItem>Photos or contacts</BulletItem>
        <BulletItem>Payment information</BulletItem>
      </InfoCard>

      {/* How We Use Your Data */}
      <InfoCard icon="gearshape" title="How We Use Your Data">
        <ThemedText style={styles.paragraph}>
          We use this data only to:
        </ThemedText>
        <BulletItem>Fix bugs and improve stability</BulletItem>
        <BulletItem>Understand general usage patterns</BulletItem>
      </InfoCard>

      {/* Sharing */}
      <InfoCard icon="lock.shield" title="Sharing">
        <ThemedText style={styles.paragraph}>
          We do not share, sell, or rent your data. The information we collect is used only for improving the app.
        </ThemedText>
      </InfoCard>

      {/* Children */}
      <InfoCard icon="figure.2.and.child.holdinghands" title="Children">
        <ThemedText style={styles.paragraph}>
          The app is intended for all ages. We do not knowingly collect personal information. Parents or guardians should supervise children using the app.
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
