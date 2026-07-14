import { PageHead } from '@/components/page-head';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SearchResultItem } from '@/components/ui/search-result-item';
import { SearchInput, type SearchInputRef } from '@/components/ui/search-input';
import { RecentItemsList } from '@/components/search/recent-items-list';
import { SearchEmptyState } from '@/components/search/search-empty-state';
import { REFRESH_BAR_HEIGHT, SearchRefreshBar } from '@/components/search/search-refresh-bar';
import { useColors } from '@/hooks/use-colors';
import { useSearch } from '@/hooks/use-search';
import { useTrailingHold } from '@/hooks/use-trailing-hold';
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
// How long the loading indicator lingers after the query settles, so it stays
// visible until the results have finished refreshing (and is perceptible on a
// fast search) instead of cutting off the moment typing stops.
const SEARCH_LOADER_HOLD_MS = 400;

type SearchSession = { query: string; resultCount: number };
type SearchOutcome = 'opened' | 'no_result' | 'abandoned';

export default function SearchScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  // committedQuery is the query the visible results are for. It trails
  // searchQuery: the input updates instantly, then the blocking Fuse search is
  // deferred to a later frame (see effect below) so the loading UI paints first.
  const [committedQuery, setCommittedQuery] = useState('');
  const searchBarRef = useRef<SearchBarCommands>(null);
  const searchInputRef = useRef<SearchInputRef>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [recentSongs, setRecentSongs] = useState<RecentSong[]>([]);

  const isIOS = Platform.OS === 'ios';
  // iOS 26+ renders its own large inline "Search" title in the list header when
  // focused; the refresh bar sits below it and needs to be centered in that gap.
  const showInlineTitle = isIOS && parseInt(String(Platform.Version), 10) >= 26 && isInputFocused;

  const { visibleSongs } = useSongbooks();

  const { results: searchResults, isReady } = useSearch(visibleSongs, committedQuery);

  // Loading whenever the committed query trails the input, or the index isn't
  // built yet. Because the search below is deferred, this state is painted
  // (skeleton or top bar) before the blocking ranking work runs.
  const isSearching =
    searchQuery.trim().length >= MIN_TRACKED_QUERY_LENGTH &&
    (searchQuery !== committedQuery || !isReady);
  // Keep the indicator up through the refresh settling (and a beat after), so
  // it doesn't cut off before the new results have rendered.
  const showLoading = useTrailingHold(isSearching, SEARCH_LOADER_HOLD_MS);

  // Defer the blocking Fuse search to a later frame so the loading UI shows
  // first, and coalesce rapid keystrokes. Two frames guarantees the pending
  // frame is on screen before the synchronous ranking/snippet work runs.
  useEffect(() => {
    if (searchQuery === committedQuery) return;
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => setCommittedQuery(searchQuery));
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      if (secondFrame) cancelAnimationFrame(secondFrame);
    };
  }, [searchQuery, committedQuery]);

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
    const trimmed = committedQuery.trim();
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
  }, [router, committedQuery, searchResults.length, fireSearchEvent]);

  // Track the active search session and schedule a 'no_result' event after
  // the query has been stable with zero results for SEARCH_NO_RESULT_DELAY_MS.
  // 'abandoned' fires when the query is shortened below the threshold.
  useEffect(() => {
    const trimmed = committedQuery.trim();

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
  }, [committedQuery, searchResults.length, fireSearchEvent]);

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
        {searchQuery.trim() ? (
          <View style={styles.results}>
            <FlatList
              style={styles.list}
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
              removeClippedSubviews={false}
              ListHeaderComponent={
                <View>
                  {showInlineTitle && (
                    <ThemedText type="title">{t('search.title')}</ThemedText>
                  )}
                  <View style={[styles.refreshBarSlot, showInlineTitle && styles.refreshBarSlotWithTitle]}>
                    {showLoading && searchResults.length > 0 && <SearchRefreshBar />}
                  </View>
                </View>
              }
              ListEmptyComponent={
                <SearchEmptyState
                  isLoading={showLoading}
                  isShortQuery={committedQuery.trim().length < MIN_TRACKED_QUERY_LENGTH}
                />
              }
              renderItem={({ item: result }) => (
                <SearchResultItem
                  playlist={result.playlist}
                  song={result.song}
                  snippet={result.snippet}
                  query={committedQuery}
                  onPress={handleSongPress}
                  colors={colors}
                />
              )}
            />
          </View>
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
  results: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  // Always reserved (just the bar's height) so toggling the refresh bar never
  // shifts the list. marginBottom matches the space above the bar (see
  // scrollContent.paddingTop + the SearchInput margin on web) so it sits
  // vertically centered in the gap between the search field and the results.
  refreshBarSlot: {
    height: REFRESH_BAR_HEIGHT,
    marginBottom: 6,
  },
  // iOS 26+ has a large inline title directly above; expand the slot and center
  // the bar in it so it sits midway between that title and the first result.
  refreshBarSlotWithTitle: {
    height: 28,
    marginBottom: 0,
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    // On web the SearchInput's marginBottom already supplies the space above
    // the bar; on iOS (native search bar) the list padding must supply it.
    paddingTop: Platform.OS === 'ios' ? 6 : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 6,
  },
});
