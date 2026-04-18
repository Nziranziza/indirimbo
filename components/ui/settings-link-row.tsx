import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface SettingsLinkRowProps {
  readonly icon: IconSymbolName;
  readonly label: string;
  readonly onPress: () => void;
  readonly isLast?: boolean;
  readonly trailingIcon?: IconSymbolName;
  readonly badge?: string;
}

export function SettingsLinkRow({
  icon,
  label,
  onPress,
  isLast = false,
  trailingIcon = 'arrow.right',
  badge,
}: SettingsLinkRowProps) {
  const colors = useColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.linkRow,
        isLast
          ? { borderBottomWidth: 0 }
          : { borderBottomColor: colors.icon + '10' },
      ]}
      accessibilityLabel={label}
      accessibilityRole="button"
      activeOpacity={0.7}>
      <View style={styles.linkContent}>
        <IconSymbol name={icon} size={20} color={colors.icon} />
        <ThemedText type="defaultSemiBold" style={styles.linkText}>
          {label}
        </ThemedText>
        {badge && (
          <View style={[styles.badge, { backgroundColor: colors.tint }]}>
            <ThemedText style={[styles.badgeText, { color: colors.tintForeground }]}>
              {badge}
            </ThemedText>
          </View>
        )}
      </View>
      <IconSymbol name={trailingIcon} size={20} color={colors.icon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  linkText: {
    fontSize: 16,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    lineHeight: 13,
  },
});
