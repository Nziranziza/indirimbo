import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { gushimishaCategories } from '@/constants/gushimisha-categories';
import { useColors } from '@/hooks/use-colors';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export function CategoryChips() {
  const router = useRouter();
  const colors = useColors();

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {gushimishaCategories.map((category) => (
          <TouchableOpacity
            key={category.name}
            style={[styles.chip, { borderColor: colors.tint + '40' }]}
            accessibilityLabel={category.name}
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={() => {
              router.push({
                pathname: '/(tabs)/(home)/category/[slug]',
                params: { slug: category.slug },
              });
            }}>
            <IconSymbol name={category.icon as IconSymbolName} size={14} color={colors.tint} />
            <ThemedText style={[styles.chipText, { color: colors.tint }]}>
              {category.name}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: -20,
    paddingBottom: 16,
  },
  scroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
