import { CollapsibleHeaderScrollView } from '@/components/collapsible-header-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import * as Clipboard from 'expo-clipboard';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PrivacyPolicyScreen() {
  const colors = useColors();
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
  const handleEmailCopy = async () => {
    await Clipboard.setStringAsync(supportEmail);
    Alert.alert('Copied', 'Email address copied to clipboard.');
  };

  return (
    <CollapsibleHeaderScrollView
      title="Privacy Policy"
      subtitle="How we handle information in the app">
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
        <BulletItem>We collect limited technical data to improve the app.</BulletItem>
        <BulletItem>We do not sell or share your data.</BulletItem>
        <BulletItem>Contact us anytime with questions or concerns.</BulletItem>
      </ThemedView>

      {/* What We Collect */}
      <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
        <View style={styles.cardHeader}>
          <IconSymbol name="doc.text" size={20} color={colors.tint} />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            What We Collect
          </ThemedText>
        </View>
        <ThemedText style={styles.paragraph}>
          We collect limited technical information to improve the app:
        </ThemedText>
        <BulletItem>Anonymous usage data (feature usage, crashes)</BulletItem>
        <BulletItem>Device information (model and OS version)</BulletItem>
      </ThemedView>

      {/* What We Don't Collect */}
      <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
        <View style={styles.cardHeader}>
          <IconSymbol name="xmark.circle" size={20} color={colors.tint} />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            What We Do Not Collect
          </ThemedText>
        </View>
        <BulletItem>Personal information (name, email, phone)</BulletItem>
        <BulletItem>Location data</BulletItem>
        <BulletItem>Photos or contacts</BulletItem>
        <BulletItem>Payment information</BulletItem>
      </ThemedView>

      {/* How We Use Your Data */}
      <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
        <View style={styles.cardHeader}>
          <IconSymbol name="gearshape" size={20} color={colors.tint} />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            How We Use Your Data
          </ThemedText>
        </View>
        <ThemedText style={styles.paragraph}>
          We use this data only to:
        </ThemedText>
        <BulletItem>Fix bugs and improve stability</BulletItem>
        <BulletItem>Understand general usage patterns</BulletItem>
      </ThemedView>

      {/* Sharing */}
      <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
        <View style={styles.cardHeader}>
          <IconSymbol name="lock.shield" size={20} color={colors.tint} />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Sharing
          </ThemedText>
        </View>
        <ThemedText style={styles.paragraph}>
          We do not share, sell, or rent your data. The information we collect is used only for improving the app.
        </ThemedText>
      </ThemedView>

      {/* Children */}
      <ThemedView style={[styles.card, { borderColor: colors.icon + '20', backgroundColor: colors.background }]}>
        <View style={styles.cardHeader}>
          <IconSymbol name="figure.2.and.child.holdinghands" size={20} color={colors.tint} />
          <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
            Children
          </ThemedText>
        </View>
        <ThemedText style={styles.paragraph}>
          The app is intended for all ages. We do not knowingly collect personal information. Parents or guardians should supervise children using the app.
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
