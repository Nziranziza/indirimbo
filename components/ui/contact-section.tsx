import { ThemedText } from '@/components/themed-text';
import { InfoCard } from '@/components/ui/info-card';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import * as Clipboard from 'expo-clipboard';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

const SUPPORT_EMAIL = 'indirimboapp@gmail.com';

interface ContactSectionProps {
  readonly preamble?: string;
}

export function ContactSection({ preamble }: ContactSectionProps) {
  const colors = useColors();
  const { t } = useTranslation();
  const preambleText = preamble ?? t('common.contact.defaultPreamble');

  const handleEmailPress = async () => {
    try {
      await Clipboard.setStringAsync(SUPPORT_EMAIL);
      Alert.alert(t('common.contact.emailCopiedTitle'), t('common.contact.emailCopiedBody'));
    } catch (error) {
      console.error('Failed to copy support email', error);
    }
  };

  return (
    <InfoCard icon="envelope" title={t('common.contact')}>
      <ThemedText style={styles.paragraph}>
        {preambleText}{' '}
      </ThemedText>
      <TouchableOpacity
        onPress={handleEmailPress}
        activeOpacity={0.7}
        style={styles.contactLink}>
        <ThemedText type="defaultSemiBold" style={{ color: colors.tint }}>
          {SUPPORT_EMAIL}
        </ThemedText>
        <ThemedText style={styles.contactHint}>
          {t('common.contact.tapToCopy')}
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
