import { ThemedText } from '@/components/themed-text';
import { useColors } from '@/hooks/use-colors';
import { StyleSheet, View } from 'react-native';

interface BulletItemProps {
  readonly children: React.ReactNode;
}

export function BulletItem({ children }: BulletItemProps) {
  const colors = useColors();

  return (
    <View style={styles.bulletRow}>
      <View style={[styles.bulletDot, { backgroundColor: colors.icon }]} />
      <ThemedText style={styles.bulletText}>{children}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
