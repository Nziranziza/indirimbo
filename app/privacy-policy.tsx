import { StyleSheet, TouchableOpacity } from 'react-native';
import { TabScrollView } from '@/components/tab-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen() {
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
          Privacy Policy
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          How we handle your information
        </ThemedText>
      </ThemedView>

      <TabScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedText style={[styles.date, { opacity: 0.5 }]}>
          Last Updated: February 1, 2026
        </ThemedText>

        {/* What We Collect */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
          <ThemedView style={styles.cardHeader}>
            <IconSymbol name="doc.text" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              What We Collect
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.paragraph}>
            We collect basic technical information to improve the app:
          </ThemedText>
          <ThemedText style={styles.bulletPoint}>
            • Anonymous usage data (which features you use, app crashes)
          </ThemedText>
          <ThemedText style={styles.bulletPoint}>
            • Device information (device model, operating system version)
          </ThemedText>
        </ThemedView>

        {/* What We Don't Collect */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
          <ThemedView style={styles.cardHeader}>
            <IconSymbol name="xmark.circle" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              What We Don't Collect
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.bulletPoint}>
            • Personal information (name, email, phone)
          </ThemedText>
          <ThemedText style={styles.bulletPoint}>
            • Location data
          </ThemedText>
          <ThemedText style={styles.bulletPoint}>
            • Photos or contacts
          </ThemedText>
          <ThemedText style={styles.bulletPoint}>
            • Payment information
          </ThemedText>
        </ThemedView>

        {/* How We Use Your Data */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
          <ThemedView style={styles.cardHeader}>
            <IconSymbol name="gearshape" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              How We Use Your Data
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.paragraph}>
            We use this data only to:
          </ThemedText>
          <ThemedText style={styles.bulletPoint}>
            • Fix bugs and improve the app
          </ThemedText>
          <ThemedText style={styles.bulletPoint}>
            • Understand how people use the app
          </ThemedText>
        </ThemedView>

        {/* Sharing */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
          <ThemedView style={styles.cardHeader}>
            <IconSymbol name="lock.shield" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              Sharing
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.paragraph}>
            We don't share, sell, or rent your data to anyone. All data stays with us.
          </ThemedText>
        </ThemedView>

        {/* Children */}
        <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
          <ThemedView style={styles.cardHeader}>
            <IconSymbol name="figure.2.and.child.holdinghands" size={20} color={colors.tint} />
            <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
              Children
            </ThemedText>
          </ThemedView>
          <ThemedText style={styles.paragraph}>
            This app is safe for all ages. We don't collect personal information from anyone. Parents should supervise their children's app usage.
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
