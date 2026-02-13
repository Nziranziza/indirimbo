import { CollapsibleHeaderScrollView } from '@/components/collapsible-header-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import * as Clipboard from 'expo-clipboard';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function TermsOfServiceScreen() {
  const colors = useColors();
  const supportEmail = 'indirimboapp@gmail.com';
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
  const handleEmailCopy = async () => {
    await Clipboard.setStringAsync(supportEmail);
    Alert.alert('Copied', 'Email address copied to clipboard.');
  };

  return (
    <CollapsibleHeaderScrollView
      title="Terms of Service"
      subtitle="Guidelines for using the app">
      <ThemedText style={[styles.date, { opacity: 0.5 }]}>
        Last Updated: February 1, 2026
      </ThemedText>

      {/* Summary */}
      <ThemedView
        style={[
          styles.card,
          { borderColor: colors.tint + '30', backgroundColor: colors.tint + '08' },
        ]}>
        <View style={styles.cardHeader}>
          <IconSymbol name="sparkles" size={20} color={colors.tint} />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Summary
          </ThemedText>
        </View>
        <BulletItem>Use the app responsibly for personal, non-commercial use.</BulletItem>
        <BulletItem>Do not try to harm, copy, or disrupt the app.</BulletItem>
        <BulletItem>We may update features and fix issues over time.</BulletItem>
      </ThemedView>

      {/* Agreement */}
      <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
        <View style={styles.cardHeader}>
          <IconSymbol name="checkmark.seal" size={20} color={colors.tint} />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Agreement
          </ThemedText>
        </View>
        <ThemedText style={styles.paragraph}>
          By using Indirimbo, you agree to these terms. If you do not agree, please do not use the app.
        </ThemedText>
      </ThemedView>

      {/* Who Can Use This App */}
      <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
        <View style={styles.cardHeader}>
          <IconSymbol name="person.2" size={20} color={colors.tint} />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Who Can Use This App
          </ThemedText>
        </View>
        <ThemedText style={styles.paragraph}>
          The app is for everyone. Children should use it with parental supervision.
        </ThemedText>
      </ThemedView>

      {/* What You Can Do */}
      <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
        <View style={styles.cardHeader}>
          <IconSymbol name="hand.thumbsup" size={20} color={colors.tint} />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            What You Can Do
          </ThemedText>
        </View>
        <ThemedText style={styles.paragraph}>
          You may use the app for personal, non-commercial purposes.
        </ThemedText>
      </ThemedView>

      {/* What You Can't Do */}
      <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
        <View style={styles.cardHeader}>
          <IconSymbol name="hand.raised" size={20} color={colors.tint} />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            What You Can't Do
          </ThemedText>
        </View>
        <ThemedText style={styles.paragraph}>
          Please do not:
        </ThemedText>
        <BulletItem>Use the app for illegal purposes</BulletItem>
        <BulletItem>Attempt to hack or disrupt the app</BulletItem>
        <BulletItem>Copy, reverse engineer, or modify the app's code</BulletItem>
        <BulletItem>Do anything that could harm the app or other users</BulletItem>
      </ThemedView>

      {/* Content */}
      <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
        <View style={styles.cardHeader}>
          <IconSymbol name="doc.plaintext" size={20} color={colors.tint} />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Content
          </ThemedText>
        </View>
        <ThemedText style={styles.paragraph}>
          The app is provided "as is." We do not guarantee uninterrupted or error-free service, but we aim to fix issues promptly.
        </ThemedText>
      </ThemedView>

      {/* Updates */}
      <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
        <View style={styles.cardHeader}>
          <IconSymbol name="arrow.clockwise" size={20} color={colors.tint} />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Updates
          </ThemedText>
        </View>
        <ThemedText style={styles.paragraph}>
          We may update the app at any time to add features, improve performance, or fix bugs.
        </ThemedText>
      </ThemedView>

      {/* Contact */}
      <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
        <View style={styles.cardHeader}>
          <IconSymbol name="envelope" size={20} color={colors.tint} />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Contact
          </ThemedText>
        </View>
        <ThemedText style={styles.paragraph}>
          Questions or concerns? Email us at:{' '}
        </ThemedText>
        <TouchableOpacity
          onPress={handleEmailPress}
          onLongPress={handleEmailCopy}
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
    </CollapsibleHeaderScrollView>
  );
}

const styles = StyleSheet.create({
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
  contactLink: {
    marginTop: 6,
  },
  contactHint: {
    marginTop: 4,
    fontSize: 12,
    opacity: 0.6,
  },
});
