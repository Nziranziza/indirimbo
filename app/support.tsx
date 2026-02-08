import { TabScrollView } from '@/components/tab-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BackButton } from '@/components/ui/back-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SupportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const supportEmail = 'danielnziranziza@gmail.com';

  const BulletItem = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.bulletRow}>
      <View style={[styles.bulletDot, { backgroundColor: colors.icon }]} />
      <ThemedText style={styles.bulletText}>{children}</ThemedText>
    </View>
  );

  const handleEmailPress = async () => {
    await Clipboard.setStringAsync(supportEmail);
    Alert.alert('Email copied', 'The address is copied to your clipboard.');
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <BackButton style={styles.backButton} />
        <ThemedText type="title" style={styles.title}>
          Support
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Get help with using Indirimbo
        </ThemedText>
      </ThemedView>

      <TabScrollView contentContainerStyle={styles.scrollContent}>
        {/* Getting Started */}
        <ThemedView
          style={[
            styles.card,
            styles.summaryCard,
            { borderColor: colors.tint + '30', backgroundColor: colors.tint + '08' },
          ]}>
          <View style={styles.cardHeader}>
            <IconSymbol name="sparkles" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              Getting Started
            </ThemedText>
          </View>
          <ThemedText style={styles.paragraph}>
            Indirimbo is a hymns and worship songs app for Rwandan churches. Browse songs from popular hymnbooks, search by title or lyrics, and save your favorites.
          </ThemedText>
        </ThemedView>

        {/* How to Use */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
          <View style={styles.cardHeader}>
            <IconSymbol name="book" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              How to Use
            </ThemedText>
          </View>
          <BulletItem>Browse songs by selecting a playlist (Gushimisha Imana or Agakiza)</BulletItem>
          <BulletItem>Use the search bar to find songs by title, number, or lyrics</BulletItem>
          <BulletItem>Tap the heart icon to save songs to your favorites</BulletItem>
          <BulletItem>Share songs with friends using the share button</BulletItem>
          <BulletItem>Adjust text size in Settings for comfortable reading</BulletItem>
        </ThemedView>

        {/* Frequently Asked Questions */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
          <View style={styles.cardHeader}>
            <IconSymbol name="questionmark.circle" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              Frequently Asked Questions
            </ThemedText>
          </View>
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
        </ThemedView>

        {/* Report an Issue */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
          <View style={styles.cardHeader}>
            <IconSymbol name="exclamationmark.triangle" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              Report an Issue
            </ThemedText>
          </View>
          <ThemedText style={styles.paragraph}>
            Found a bug or incorrect lyrics? Please let us know and we'll fix it as soon as possible. Include:
          </ThemedText>
          <BulletItem>The song name and number</BulletItem>
          <BulletItem>Description of the issue</BulletItem>
          <BulletItem>Your device type and iOS version</BulletItem>
        </ThemedView>

        {/* Contact Us */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
          <View style={styles.cardHeader}>
            <IconSymbol name="envelope" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              Contact Us
            </ThemedText>
          </View>
          <ThemedText style={styles.paragraph}>
            Have questions, feedback, or need help? We'd love to hear from you:
          </ThemedText>
          <TouchableOpacity
            onPress={handleEmailPress}
            activeOpacity={0.7}
            style={styles.contactLink}>
            <ThemedText type="defaultSemiBold" style={{ color: colors.tint }}>
              {supportEmail}
            </ThemedText>
            <ThemedText style={styles.contactHint}>
              Tap to copy
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Links */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
          <View style={styles.cardHeader}>
            <IconSymbol name="link" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              Legal
            </ThemedText>
          </View>
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
        </ThemedView>
      </TabScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginLeft: -8,
    marginBottom: 8,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
    fontSize: 16,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  summaryCard: {
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
  paragraph: {
    marginBottom: 8,
    lineHeight: 22,
    opacity: 0.9,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 6,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
  },
  bulletText: {
    flex: 1,
    lineHeight: 22,
    opacity: 0.85,
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
  contactLink: {
    marginTop: 6,
  },
  contactHint: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.6,
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
