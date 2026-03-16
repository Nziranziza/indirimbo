import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { StyleSheet, View } from 'react-native';

interface InfoCardProps {
  readonly icon: IconSymbolName;
  readonly title: string;
  readonly isHighlighted?: boolean;
  readonly children: React.ReactNode;
}

export function InfoCard({ icon, title, isHighlighted = false, children }: InfoCardProps) {
  const colors = useColors();

  return (
    <ThemedView
      style={[
        styles.card,
        isHighlighted
          ? { borderColor: colors.tint + '30', backgroundColor: colors.tint + '08' }
          : { borderColor: colors.icon + '20', backgroundColor: colors.background },
      ]}>
      <View style={styles.cardHeader}>
        <IconSymbol name={icon} size={20} color={colors.tint} />
        <ThemedText type="defaultSemiBold" style={styles.cardTitle}>
          {title}
        </ThemedText>
      </View>
      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
});
