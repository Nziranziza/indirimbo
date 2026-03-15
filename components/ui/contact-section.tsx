import { ThemedText } from '@/components/themed-text';
import { InfoCard } from '@/components/ui/info-card';
import { useColors } from '@/hooks/use-colors';
import * as Clipboard from 'expo-clipboard';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

const SUPPORT_EMAIL = 'indirimboapp@gmail.com';

interface ContactSectionProps {
  readonly preamble?: string;
}

export function ContactSection({ preamble = 'Questions or concerns? Email us at:' }: ContactSectionProps) {
  const colors = useColors();

  const handleEmailPress = async () => {
    await Clipboard.setStringAsync(SUPPORT_EMAIL);
    Alert.alert('Email copied', 'The address is copied to your clipboard.');
  };

  return (
    <InfoCard icon="envelope" title="Contact">
      <ThemedText style={styles.paragraph}>
        {preamble}{' '}
      </ThemedText>
      <TouchableOpacity
        onPress={handleEmailPress}
        activeOpacity={0.7}
        style={styles.contactLink}>
        <ThemedText type="defaultSemiBold" style={{ color: colors.tint }}>
          {SUPPORT_EMAIL}
        </ThemedText>
        <ThemedText style={styles.contactHint}>
          Tap to copy
        </ThemedText>
      </TouchableOpacity>
    </InfoCard>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    marginBottom: 8,
    lineHeight: 22,
    opacity: 0.9,
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
