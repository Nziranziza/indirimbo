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
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SearchBarCommands } from 'react-native-screens';

// Module-level flag: survives component remounts (important on Android).
// Set in handleSongPress so useFocusEffect knows to skip auto-focus on return.
let _navigatedToSong = false;

export default function SearchScreen() {
  const router = useRouter();
  const colors = useColors();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
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

  // Load recent data on focus; auto-focus unless returning from a song
  useFocusEffect(
    useCallback(() => {
      getRecentSearches().then(setRecentSearches);
      getRecentSongs().then(songs => setRecentSongs(songs.slice(0, 10)));

      if (_navigatedToSong) {
        _navigatedToSong = false;
        return;
      }

      const timer = setTimeout(() => {
        if (isIOS) {
          searchBarRef.current?.focus();
        } else {
          searchInputRef.current?.focus();
        }
      }, 100);
      return () => clearTimeout(timer);
    }, [isIOS])
  );

  const handleSongPress = useCallback((playlist: string, songNumber: number | string) => {
    _navigatedToSong = true;
    if (debouncedSearchQuery.trim()) {
      addRecentSearch(debouncedSearchQuery.trim()).then(() =>
        getRecentSearches().then(setRecentSearches)
      );
    }
    router.navigate({
      pathname: '/song/[playlist]/[songNumber]',
      params: { playlist, songNumber: String(songNumber), source: 'search' },
    });
  }, [router, debouncedSearchQuery]);

  const lastTrackedQueryRef = useRef('');
  useEffect(() => {
    const trimmed = debouncedSearchQuery.trim();
    if (trimmed.length < 2 || trimmed === lastTrackedQueryRef.current) return;
    lastTrackedQueryRef.current = trimmed;
    trackEvent('search', { query: trimmed, result_count: searchResults.length });
  }, [debouncedSearchQuery, searchResults.length]);

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
        title="Search Songs | Indirimbo"
        description="Search Rwandan hymns and worship songs by title, number, or lyrics across Gushimisha Imana and Agakiza hymnbooks."
        canonicalPath="/search"
      />
      {isIOS && (
        <>
          <Stack.Screen options={{ title: "Search" }} />
          <Stack.SearchBar
            ref={searchBarRef as any}
            placeholder="Title, Number or Lyrics"
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
              <ThemedText type="title">Search</ThemedText>
            </ThemedView>
            <SearchInput
              ref={searchInputRef}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Title, Number or Lyrics"
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
                {Platform.OS === "ios" &&
                  parseInt(String(Platform.Version), 10) >= 26 &&
                  isInputFocused && (
                    <ThemedText type="title" style={{ marginBottom: 20 }}>
                      Search
                    </ThemedText>
                  )}
              </View>
            }
            ListEmptyComponent={
              debouncedSearchQuery.trim().length < 2 ? (
                <ThemedView style={styles.emptyState}>
                  <ThemedText style={[styles.emptyHint, { color: colors.icon }]}>
                    Keep typing to search...
                  </ThemedText>
                </ThemedView>
              ) : (
                <ThemedView style={styles.emptyState}>
                  <ThemedText style={styles.emptyEmoji}>{colorScheme === 'dark' ? '🤷🏼' : '🤷🏾'}</ThemedText>
                  <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
                    No songs found
                  </ThemedText>
                  <ThemedText style={[styles.emptySubtext, { color: colors.icon }]}>
                    Try a different title, number, or lyrics
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
