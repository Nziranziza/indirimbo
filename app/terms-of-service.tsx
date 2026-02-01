import { StyleSheet, TouchableOpacity } from 'react-native';
import { TabScrollView } from '@/components/tab-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TermsOfServiceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}>
          <IconSymbol name="arrow.left" size={24} color={colors.tint} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>
          Terms of Service
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Rules for using the app
        </ThemedText>
      </ThemedView>

      <TabScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={[styles.date, { opacity: 0.5 }]}>
          Last Updated: February 1, 2026
        </ThemedText>

        {/* Agreement */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
          <ThemedView style={styles.cardHeader}>
            <IconSymbol name="checkmark.seal" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              Agreement
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.paragraph}>
            By using the Indirimbo app, you agree to these terms. If you don't agree, please don't use the app.
          </ThemedText>
        </ThemedView>

        {/* Who Can Use This App */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
          <ThemedView style={styles.cardHeader}>
            <IconSymbol name="person.2" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              Who Can Use This App
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.paragraph}>
            This app is for everyone. Children should use it with parental supervision.
          </ThemedText>
        </ThemedView>

        {/* What You Can Do */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
          <ThemedView style={styles.cardHeader}>
            <IconSymbol name="hand.thumbsup" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              What You Can Do
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.paragraph}>
            You can use this app for personal, non-commercial purposes.
          </ThemedText>
        </ThemedView>

        {/* What You Can't Do */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
          <ThemedView style={styles.cardHeader}>
            <IconSymbol name="hand.raised" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              What You Can't Do
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.paragraph}>
            Don't:
          </ThemedText>
          <ThemedText style={styles.bulletPoint}>
            • Use the app for illegal purposes
          </ThemedText>
          <ThemedText style={styles.bulletPoint}>
            • Try to hack or break the app
          </ThemedText>
          <ThemedText style={styles.bulletPoint}>
            • Copy or modify the app's code
          </ThemedText>
          <ThemedText style={styles.bulletPoint}>
            • Do anything that could harm the app or other users
          </ThemedText>
        </ThemedView>

        {/* Content */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
          <ThemedView style={styles.cardHeader}>
            <IconSymbol name="doc.plaintext" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              Content
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.paragraph}>
            The app is provided "as is." We don't guarantee everything will work perfectly all the time, but we'll do our best to fix issues.
          </ThemedText>
        </ThemedView>

        {/* Updates */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
          <ThemedView style={styles.cardHeader}>
            <IconSymbol name="arrow.clockwise" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              Updates
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.paragraph}>
            We may update the app at any time to add features or fix bugs.
          </ThemedText>
        </ThemedView>

        {/* Contact */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
          <ThemedView style={styles.cardHeader}>
            <IconSymbol name="envelope" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              Contact
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.paragraph}>
            Questions? Email us at:{' '}
            <ThemedText type="defaultSemiBold" style={{ color: colors.tint }}>
              danielnziranziza@gmail.com
            </ThemedText>
          </ThemedText>
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
  date: {
    fontSize: 12,
    marginBottom: 8,
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
  paragraph: {
    marginBottom: 8,
    lineHeight: 22,
    opacity: 0.9,
  },
  bulletPoint: {
    marginBottom: 6,
    marginLeft: 10,
    lineHeight: 22,
    opacity: 0.8,
  },
});
