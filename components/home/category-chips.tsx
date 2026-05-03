import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { cantiquesKirundiCategories } from '@/constants/cantiques-kirundi-categories';
import { gushimishaCategories } from '@/constants/gushimisha-categories';
import type { SongCategory } from '@/constants/gushimisha-categories';
import { useSongbookPreference } from '@/contexts/songbook-preference-context';
import { useColors } from '@/hooks/use-colors';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface CategoryChip {
  readonly category: SongCategory;
  readonly playlist: string;
}

export function CategoryChips() {
  const router = useRouter();
  const colors = useColors();
  const { songbookPreference } = useSongbookPreference();

  const chips: readonly CategoryChip[] = useMemo(() => {
    const toChips = (categories: SongCategory[], playlist: string): CategoryChip[] =>
      categories.map((category) => ({ category, playlist }));

    switch (songbookPreference) {
      case 'kirundi':
        return toChips(cantiquesKirundiCategories, 'cantiques-kirundi');
      case 'all':
        return [
          ...toChips(gushimishaCategories, 'gushimisha'),
          ...toChips(cantiquesKirundiCategories, 'cantiques-kirundi'),
        ];
      case 'kinyarwanda':
      default:
        return toChips(gushimishaCategories, 'gushimisha');
    }
  }, [songbookPreference]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}>
        {chips.map(({ category, playlist }) => (
          <TouchableOpacity
            key={`${playlist}-${category.slug}`}
            style={[styles.chip, { borderColor: colors.tint + '40' }]}
            accessibilityLabel={category.name}
            accessibilityRole="button"
            activeOpacity={0.7}
            onPress={() => {
              router.navigate({
                pathname: '/(tabs)/(home)/category/[slug]',
                params: { slug: category.slug, playlist },
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
