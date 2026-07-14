import { SearchSkeleton } from '@/components/search/search-skeleton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/contexts/theme-context';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import { StyleSheet } from 'react-native';

interface SearchEmptyStateProps {
  // Search is running and no results are ready yet — show the loader.
  readonly isLoading: boolean;
  // The (settled) query is still below the minimum searchable length.
  readonly isShortQuery: boolean;
}

export function SearchEmptyState({ isLoading, isShortQuery }: SearchEmptyStateProps) {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  if (isLoading) {
    return <SearchSkeleton />;
  }

  if (isShortQuery) {
    return (
      <ThemedView style={styles.emptyState}>
        <ThemedText style={[styles.emptyHint, { color: colors.icon }]}>
          {t('search.keepTyping')}
        </ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.emptyState}>
      <ThemedText style={styles.emptyEmoji}>
        {colorScheme === 'dark' ? '🤷🏼' : '🤷🏾'}
      </ThemedText>
      <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
        {t('search.noResults')}
      </ThemedText>
      <ThemedText style={[styles.emptySubtext, { color: colors.icon }]}>
        {t('search.noResultsHint')}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyHint: {
    fontSize: 15,
  },
  emptyEmoji: {
    fontSize: 48,
    lineHeight: 58,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
  },
});
