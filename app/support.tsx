import { CollapsibleHeaderScrollView } from '@/components/collapsible-header-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { BulletItem } from '@/components/ui/bullet-item';
import { ContactSection } from '@/components/ui/contact-section';
import { FloatingShareButton } from '@/components/ui/floating-share-button';
import { InfoCard } from '@/components/ui/info-card';
import { useColors } from '@/hooks/use-colors';
import { router } from 'expo-router';
import { PageHead } from '@/components/page-head';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function SupportScreen() {
  const colors = useColors();

  return (
    <>
    <PageHead
      title="Support | Indirimbo"
      description="Get help with using Indirimbo. Find FAQs, usage guide, and contact information for the Rwandan hymnal app."
      canonicalPath="/support/"
    />
    <CollapsibleHeaderScrollView
      title="Support"
      subtitle="Get help with using Indirimbo"
      extraBottomPadding={80}
      fallbackHref="/(tabs)/settings">
      {/* Getting Started */}
      <InfoCard icon="sparkles" title="Getting Started" isHighlighted>
        <ThemedText style={styles.paragraph}>
          Indirimbo is a hymns and worship songs app for Rwandan churches. Browse songs from popular hymnbooks, search by title or lyrics, and save your favorites.
        </ThemedText>
      </InfoCard>

      {/* How to Use */}
      <InfoCard icon="book" title="How to Use">
        <BulletItem>Browse songs by selecting a playlist (Gushimisha Imana or Agakiza)</BulletItem>
        <BulletItem>Use the search bar to find songs by title, number, or lyrics</BulletItem>
        <BulletItem>Tap the heart icon to save songs to your favorites</BulletItem>
        <BulletItem>Share songs with friends using the share button</BulletItem>
        <BulletItem>Adjust text size in Settings for comfortable reading</BulletItem>
      </InfoCard>

      {/* Frequently Asked Questions */}
      <InfoCard icon="questionmark.circle" title="Frequently Asked Questions">
        <ThemedText type="defaultSemiBold" style={styles.faqQuestion}>
          How do I find a specific song?
        </ThemedText>
        <ThemedText style={styles.faqAnswer}>
          Use the search bar on the home screen. You can search by song number, title, or even words from the lyrics.
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.faqQuestion}>
          Can I use the app offline?
        </ThemedText>
        <ThemedText style={styles.faqAnswer}>
          Yes! All songs are stored locally on your device. Once the app is installed, you can access all hymns without an internet connection.
        </ThemedText>

        <ThemedText type="defaultSemiBold" style={styles.faqQuestion}>
          How do I change the text size?
        </ThemedText>
        <ThemedText style={styles.faqAnswer}>
          Go to Settings and adjust the font size to small, medium, or large based on your preference.
        </ThemedText>
      </InfoCard>

      {/* Report an Issue */}
      <InfoCard icon="exclamationmark.triangle" title="Report an Issue">
        <ThemedText style={styles.paragraph}>
          Found a bug or incorrect lyrics? Please let us know and we&apos;ll fix it as soon as possible. Include:
        </ThemedText>
        <BulletItem>The song name and number</BulletItem>
        <BulletItem>Description of the issue</BulletItem>
        <BulletItem>Your device type and OS version</BulletItem>
      </InfoCard>

      {/* Contact Us */}
      <ContactSection preamble="Have questions, feedback, or need help? We'd love to hear from you:" />

      {/* Links */}
      <InfoCard icon="link" title="Legal">
        <TouchableOpacity
          onPress={() => router.push('/privacy-policy')}
          activeOpacity={0.7}
          style={styles.linkItem}>
          <ThemedText style={{ color: colors.tint }}>Privacy Policy</ThemedText>
          <IconSymbol name="arrow.right" size={16} color={colors.tint} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/terms-of-service')}
          activeOpacity={0.7}
          style={[styles.linkItem, styles.linkItemLast]}>
          <ThemedText style={{ color: colors.tint }}>Terms of Service</ThemedText>
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
