import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SearchResultItem } from '@/components/ui/search-result-item';
import { SearchInput, type SearchInputRef } from '@/components/ui/search-input';
import { RecentItemsList } from '@/components/search/recent-items-list';
import type { Song } from '@/constants/types';
import { useSongs } from '@/contexts/songs-context';
import { useColors } from '@/hooks/use-colors';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearch } from '@/hooks/use-search';
import {
  addRecentSearch,
  clearRecentSearches,
  getRecentSearches,
  getRecentSongs,
  removeRecentSearch,
  type RecentSearch,
  type RecentSong,
} from '@/utils/storage';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import Head from 'expo-router/head';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FlatList, Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SearchBarCommands } from 'react-native-screens';

// Module-level flag: survives component remounts (important on Android).
// Set in handleSongPress so useFocusEffect knows to skip auto-focus on return.
let _navigatedToSong = false;

export default function SearchScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const searchBarRef = useRef<SearchBarCommands>(null);
  const searchInputRef = useRef<SearchInputRef>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [recentSongs, setRecentSongs] = useState<RecentSong[]>([]);

  const isIOS = Platform.OS === 'ios';

  const { agakiza, gushimisha } = useSongs();
  const allSongs = useMemo<Record<string, Song[]>>(() => ({
    agakiza: agakiza as Song[],
    gushimisha: gushimisha as Song[],
  }), [agakiza, gushimisha]);

  const searchResults = useSearch(allSongs, debouncedSearchQuery);

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
    router.push(`/song/${playlist}/${songNumber}`);
  }, [router, debouncedSearchQuery]);

  const handleRecentSearchTap = useCallback((query: string) => {
    setSearchQuery(query);
    if (isIOS) {
      searchBarRef.current?.setText(query);
    }
  }, [isIOS]);

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
      <Head>
        <title>Search Songs | Indirimbo</title>
        <meta
          name="description"
          content="Search Rwandan hymns and worship songs by title, number, or lyrics across Gushimisha Imana and Agakiza hymnbooks."
        />
        <link rel="canonical" href="https://indirimbo.rw/search" />
      </Head>
      {isIOS && (
        <>
          <Stack.Screen options={{ title: "Search" }} />
          <Stack.SearchBar
            ref={searchBarRef as any}
            placeholder="Search by title, number, or lyrics..."
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
              placeholder="Search by title, number, or lyrics..."
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
              { paddingBottom: insets.bottom + 90 },
            ]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            initialNumToRender={8}
            maxToRenderPerBatch={5}
            windowSize={3}
            removeClippedSubviews={true}
            ListEmptyComponent={
              <ThemedView style={styles.emptyState}>
                <IconSymbol
                  name="magnifyingglass"
                  size={48}
                  color={colors.icon + '40'}
                />
                <ThemedText style={styles.emptyText}>No songs found</ThemedText>
              </ThemedView>
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
            allSongs={allSongs}
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
    paddingBottom: 12,
  },
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
