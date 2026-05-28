import { PageHead } from '@/components/page-head';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchResultItem } from '@/components/ui/search-result-item';
import { SearchInput, type SearchInputRef } from '@/components/ui/search-input';
import { RecentItemsList } from '@/components/search/recent-items-list';
import { useColors } from '@/hooks/use-colors';
import { useColorScheme } from '@/contexts/theme-context';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearch } from '@/hooks/use-search';
import { useSongbooks } from '@/hooks/use-songbooks';
import { useTranslation } from '@/hooks/use-translation';
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  getRecentSongs,
  removeRecentSearch,
  type RecentSearch,
  type RecentSong,
} from '@/utils/storage';
import { trackEvent } from '@/utils/analytics';
import { IS_IOS_26_OR_HIGHER } from '@/utils/platform';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SearchBarCommands } from 'react-native-screens';

// Module-level flag: survives component remounts (important on Android).
// Set in handleSongPress so useFocusEffect knows to skip auto-focus on return.
let _navigatedToSong = false;

const SEARCH_NO_RESULT_DELAY_MS = 3000;
const MIN_TRACKED_QUERY_LENGTH = 2;

type SearchSession = { query: string; resultCount: number };
type SearchOutcome = 'opened' | 'no_result' | 'abandoned';

export default function SearchScreen() {
  const router = useRouter();
  const colors = useColors();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, flushSearch] = useDebounce(searchQuery, 150);
  const searchBarRef = useRef<SearchBarCommands>(null);
  const searchInputRef = useRef<SearchInputRef>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [recentSongs, setRecentSongs] = useState<RecentSong[]>([]);

  const isIOS = Platform.OS === 'ios';

  const { visibleSongs } = useSongbooks();

  const searchResults = useSearch(visibleSongs, debouncedSearchQuery);

  const pendingSessionRef = useRef<SearchSession | null>(null);
  const noResultTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fireSearchEvent = useCallback((outcome: SearchOutcome) => {
    if (noResultTimerRef.current) {
      clearTimeout(noResultTimerRef.current);
      noResultTimerRef.current = null;
    }
    const session = pendingSessionRef.current;
    if (!session) return;
    pendingSessionRef.current = null;
    trackEvent('search', {
      query: session.query,
      result_count: session.resultCount,
      outcome,
    });
  }, []);

  // Load recent data on focus; auto-focus unless returning from a song.
  // On blur, fire 'abandoned' if a search session is still active.
  useFocusEffect(
    useCallback(() => {
      getRecentSearches().then(setRecentSearches);
      getRecentSongs().then(songs => setRecentSongs(songs.slice(0, 10)));

      if (_navigatedToSong) {
        _navigatedToSong = false;
        return () => {
          if (pendingSessionRef.current) fireSearchEvent('abandoned');
        };
      }

      const timer = setTimeout(() => {
        if (isIOS) {
          searchBarRef.current?.focus();
        } else {
          searchInputRef.current?.focus();
        }
      }, 100);
      return () => {
        clearTimeout(timer);
        if (pendingSessionRef.current) fireSearchEvent('abandoned');
      };
    }, [isIOS, fireSearchEvent])
  );

  const handleSongPress = useCallback((playlist: string, songNumber: number | string) => {
    _navigatedToSong = true;
    const trimmed = debouncedSearchQuery.trim();
    if (trimmed.length >= MIN_TRACKED_QUERY_LENGTH) {
      if (!pendingSessionRef.current) {
        pendingSessionRef.current = { query: trimmed, resultCount: searchResults.length };
      }
      fireSearchEvent('opened');
    }
    if (trimmed) {
      addRecentSearch(trimmed).then(() =>
        getRecentSearches().then(setRecentSearches)
      );
    }
    router.navigate({
      pathname: '/song/[playlist]/[songNumber]',
      params: { playlist, songNumber: String(songNumber), source: 'search' },
    });
  }, [router, debouncedSearchQuery, searchResults.length, fireSearchEvent]);

  // Track the active search session and schedule a 'no_result' event after
  // the query has been stable with zero results for SEARCH_NO_RESULT_DELAY_MS.
  // 'abandoned' fires when the query is shortened below the threshold.
  useEffect(() => {
    const trimmed = debouncedSearchQuery.trim();

    if (noResultTimerRef.current) {
      clearTimeout(noResultTimerRef.current);
      noResultTimerRef.current = null;
    }

    if (trimmed.length < MIN_TRACKED_QUERY_LENGTH) {
      if (pendingSessionRef.current) fireSearchEvent('abandoned');
      return;
    }

    pendingSessionRef.current = { query: trimmed, resultCount: searchResults.length };

    if (searchResults.length === 0) {
      noResultTimerRef.current = setTimeout(() => {
        fireSearchEvent('no_result');
      }, SEARCH_NO_RESULT_DELAY_MS);
    }
  }, [debouncedSearchQuery, searchResults.length, fireSearchEvent]);

  const handleRecentSearchTap = useCallback((query: string) => {
    setSearchQuery(query);
    if (isIOS) {
      searchBarRef.current?.setText(query);
    }
    flushSearch(query);
  }, [isIOS, flushSearch]);

  const handleRemoveRecentSearch = useCallback((query: string) => {
    removeRecentSearch(query).then(() =>
      getRecentSearches().then(setRecentSearches)
    );
  }, []);

  const handleClearRecentSearches = useCallback(() => {
    clearRecentSearches().then(() => setRecentSearches([]));
  }, []);

  return (
    <>
      <PageHead
        title={t('search.pageTitle')}
        description={t('search.pageDescription')}
        canonicalPath="/search"
      />
      {isIOS && (
        <>
          <Stack.Screen options={{ title: t('search.title') }} />
          <Stack.SearchBar
            ref={searchBarRef as any}
            placeholder={t('search.placeholder')}
            onChangeText={(e: { nativeEvent: { text: string } }) =>
              setSearchQuery(e.nativeEvent.text)
            }
            autoCapitalize="none"
            hideWhenScrolling={false}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            onCancelButtonPress={() => setIsInputFocused(false)}
          />
        </>
      )}
      <ThemedView style={styles.container}>
        {!isIOS && (
          <>
            <ThemedView
              style={[styles.header, { paddingTop: insets.top + 20 }]}
            >
              <ThemedText type="title">{t('search.title')}</ThemedText>
            </ThemedView>
            <SearchInput
              ref={searchInputRef}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder={t('search.placeholder')}
              style={styles.searchInput}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
            />
          </>
        )}
        {debouncedSearchQuery.trim() ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) =>
              `${item.playlist}-${item.song.number}-${index}`
            }
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: 0 },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            initialNumToRender={8}
            maxToRenderPerBatch={5}
            windowSize={3}
            removeClippedSubviews={true}
            ListHeaderComponent={
              <View>
                {IS_IOS_26_OR_HIGHER && isInputFocused && (
                  <ThemedText type="title" style={{ marginBottom: 20 }}>
                    {t('search.title')}
                  </ThemedText>
                )}
              </View>
            }
            ListEmptyComponent={
              debouncedSearchQuery.trim().length < 2 ? (
                <ThemedView style={styles.emptyState}>
                  <ThemedText style={[styles.emptyHint, { color: colors.icon }]}>
                    {t('search.keepTyping')}
                  </ThemedText>
                </ThemedView>
              ) : (
                <ThemedView style={styles.emptyState}>
                  <ThemedText style={styles.emptyEmoji}>{colorScheme === 'dark' ? '🤷🏼' : '🤷🏾'}</ThemedText>
                  <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
                    {t('search.noResults')}
                  </ThemedText>
                  <ThemedText style={[styles.emptySubtext, { color: colors.icon }]}>
                    {t('search.noResultsHint')}
                  </ThemedText>
                </ThemedView>
              )
            }
            renderItem={({ item: result }) => (
              <SearchResultItem
                playlist={result.playlist}
                song={result.song}
                snippet={result.snippet}
                query={debouncedSearchQuery}
                onPress={handleSongPress}
                colors={colors}
              />
            )}
          />
        ) : (
          <RecentItemsList
            recentSearches={recentSearches}
            recentSongs={recentSongs}
            allSongs={visibleSongs}
            colors={colors}
            isInputFocused={isInputFocused}
            bottomInset={insets.bottom}
            onSearchTap={handleRecentSearchTap}
            onRemoveSearch={handleRemoveRecentSearch}
            onClearSearches={handleClearRecentSearches}
            onSongPress={handleSongPress}
          />
        )}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
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
