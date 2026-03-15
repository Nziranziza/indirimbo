import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { StyleSheet } from 'react-native';

interface SettingsGroupProps {
  readonly icon: IconSymbolName;
  readonly title: string;
  readonly description: string;
  readonly isLast?: boolean;
  readonly children: React.ReactNode;
}

export function SettingsGroup({ icon, title, description, isLast = false, children }: SettingsGroupProps) {
  const colors = useColors();

  return (
    <ThemedView
      style={[
        styles.groupContainer,
        isLast && styles.lastGroupContainer,
        {
          backgroundColor: colors.background,
          borderColor: colors.icon + '15',
        },
      ]}>
      <ThemedView
        style={[
          styles.groupHeader,
          { borderBottomColor: colors.icon + '10' },
        ]}>
        <IconSymbol name={icon} size={20} color={colors.tint} />
        <ThemedText type="subtitle" style={styles.groupTitle}>
          {title}
        </ThemedText>
      </ThemedView>

      <ThemedText style={[styles.groupDescription, { opacity: 0.7 }]}>
        {description}
      </ThemedText>

      {children}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 0,
  },
  lastGroupContainer: {
    marginBottom: 0,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  groupTitle: {
    fontSize: 18,
  },
  groupDescription: {
    fontSize: 14,
    marginBottom: 20,
  },
});
