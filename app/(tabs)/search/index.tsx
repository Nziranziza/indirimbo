import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SongNumberBadge } from '@/components/ui/song-number-badge';
import agakizaSongs from '@/constants/agakiza-songs';
import gushimishaSongs from '@/constants/gushimisha-songs';
import { getPlaylistName } from '@/constants/playlists';
import { useColors } from '@/hooks/use-colors';
import { Stack, useFocusEffect, useRouter } from 'expo-router';
import Head from 'expo-router/head';
import Fuse from 'fuse.js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Platform, SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SearchInput, type SearchInputRef } from '@/components/ui/search-input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { SearchBarCommands } from 'react-native-screens';
import { addRecentSearch, clearRecentSearches, getRecentSearches, getRecentSongs, removeRecentSearch, type RecentSearch, type RecentSong } from '@/utils/storage';

type RecentSearchItem = { type: 'search'; query: string };
type RecentSongItem = { type: 'song'; playlist: string; songNumber: number | string; songName: string };
type RecentItem = RecentSearchItem | RecentSongItem;

interface Song {
  number: number | string;
  name: string;
  url: string;
  body: {
    type: 'verse' | 'chorus';
    number?: number;
    content: string;
  }[];
}

// Find a matching snippet in the song body — uses direct indexOf (fast)
function getMatchSnippet(song: Song, words: string[]): { label: string; snippet: string } | null {
  if (words.length === 0) return null;

  for (const section of song.body) {
    const lowerContent = section.content.toLowerCase();
    // Find the first word that appears in this section
    let matchIndex = -1;
    for (const w of words) {
      matchIndex = lowerContent.indexOf(w);
      if (matchIndex !== -1) break;
    }
    if (matchIndex === -1) continue;

    const label = section.type === 'chorus'
      ? 'Chorus'
      : `Verse ${section.number ?? ''}`;

    // Get the matching line and surrounding lines for context
    const lines = section.content.split('\n');
    let charCount = 0;
    for (let i = 0; i < lines.length; i++) {
      const lineEnd = charCount + lines[i].length;
      if (matchIndex >= charCount && matchIndex < lineEnd) {
        const start = Math.max(0, i - 1);
        const end = Math.min(lines.length, i + 2);
        const contextLines = lines.slice(start, end);
        const snippet = (start > 0 ? '...' : '') +
          contextLines.join('\n') +
          (end < lines.length ? '...' : '');
        return { label, snippet };
      }
      charCount = lineEnd + 1;
    }

    return { label, snippet: section.content };
  }

  // Check song name
  const lowerName = song.name.toLowerCase();
  for (const w of words) {
    if (lowerName.includes(w)) {
      return { label: 'Title', snippet: song.name };
    }
  }

  return null;
}

// Render text with highlighted matches — single regex pass (fast)
const HighlightedText = React.memo(function HighlightedText({ text, query, highlightColor, textColor }: {
  text: string;
  query: string;
  highlightColor: string;
  textColor: string;
}) {
  if (!query.trim()) {
    return <Text style={{ color: textColor }}>{text}</Text>;
  }

  const words = query.toLowerCase().split(/\s+/).filter(w => w.length >= 2 || /^\d+$/.test(w));
  if (words.length === 0) {
    return <Text style={{ color: textColor }}>{text}</Text>;
  }

  // Build one regex for all words, split text in a single pass
  const escaped = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  if (parts.length === 1) {
    return <Text style={{ color: textColor }}>{text}</Text>;
  }

  return (
    <Text>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <Text key={i} style={{ color: highlightColor, fontWeight: '700' }}>{part}</Text>
        ) : part ? (
          <Text key={i} style={{ color: textColor }}>{part}</Text>
        ) : null
      )}
    </Text>
  );
});

interface SearchResultItemProps {
  playlist: string;
  song: Song;
  snippet: { label: string; snippet: string } | null;
  query: string;
  onPress: (playlist: string, songNumber: number | string) => void;
  colors: { icon: string; tint: string; text: string };
}

const SearchResultItem = React.memo(function SearchResultItem({ playlist, song, snippet, query, onPress, colors }: SearchResultItemProps) {
  const playlistTitle = getPlaylistName(playlist);
  return (
    <TouchableOpacity
      style={[styles.songCard, { borderColor: colors.icon + '20' }]}
      onPress={() => onPress(playlist, song.number)}
      activeOpacity={0.7}>
      <View style={styles.songCardContent}>
        <View style={styles.songCardTop}>
          <SongNumberBadge number={song.number} />
          <View style={styles.songInfo}>
            <ThemedText style={[styles.playlistLabel, { color: colors.icon, opacity: 0.7 }]}>
              {playlistTitle}
            </ThemedText>
            <HighlightedText
              text={song.name}
              query={query}
              highlightColor={colors.tint}
              textColor={colors.text}
            />
          </View>
        </View>
        {snippet && (
          <View style={[styles.snippetContainer, { backgroundColor: colors.icon + '08' }]}>
            <ThemedText style={[styles.snippetLabel, { color: colors.tint }]}>
              {snippet.label}
            </ThemedText>
            <Text style={styles.snippetText} numberOfLines={3}>
              <HighlightedText
                text={snippet.snippet}
                query={query}
                highlightColor={colors.tint}
                textColor={colors.icon}
              />
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
});

// Module-level flag: survives component remounts (important on Android).
// Set in handleSongPress so useFocusEffect knows to skip auto-focus on return.
let _navigatedToSong = false;

export default function SearchScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchBarRef = useRef<SearchBarCommands>(null);
  const searchInputRef = useRef<SearchInputRef>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [recentSongs, setRecentSongs] = useState<RecentSong[]>([]);

  const isIOS = Platform.OS === 'ios';

  const allSongs = useMemo<Record<string, Song[]>>(() => ({
    agakiza: agakizaSongs as Song[],
    gushimisha: gushimishaSongs as Song[],
  }), []);

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

  // Debounce search query
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  // Create flat list of songs with playlist info and pre-computed search fields
  const allSongsFlat = useMemo(() => {
    return Object.entries(allSongs).flatMap(([playlist, songs]) =>
      songs.map(song => {
        const lowerName = song.name.toLowerCase();
        const searchText = song.body.map(s => s.content).join('\n');
        const lowerSearchText = searchText.toLowerCase();
        return {
          ...song,
          playlist,
          lowerName,
          searchText,
          lowerSearchText,
          numberStr: String(song.number),
        };
      })
    );
  }, [allSongs]);

  // Pre-build Fuse index and configure for fuzzy search
  const fuseIndex = useMemo(
    () => Fuse.createIndex(
      [
        { name: 'numberStr', weight: 0.3 },
        { name: 'name', weight: 0.5 },
        { name: 'searchText', weight: 0.2 }
      ],
      allSongsFlat
    ),
    [allSongsFlat]
  );

  const fuse = useMemo(() => new Fuse(allSongsFlat, {
    keys: [
      { name: 'numberStr', weight: 0.3 },
      { name: 'name', weight: 0.5 },
      { name: 'searchText', weight: 0.2 }
    ],
    threshold: 0.35,
    ignoreLocation: true,
    useExtendedSearch: true,
  }, fuseIndex), [allSongsFlat, fuseIndex]);

  // Memoize search results with Fuse extended search (tokenizes multi-word queries)
  const searchResults = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return [];
    }

    const query = debouncedSearchQuery.trim();
    const lowerQuery = query.toLowerCase();
    const words = lowerQuery.split(/\s+/).filter(w => w.length >= 2 || /^\d+$/.test(w));

    if (words.length === 0) return [];

    const results = fuse.search(query, { limit: 30 });

    const ranked = results.map(r => {
      const item = r.item;
      let rank = 3;
      if (item.numberStr === lowerQuery) rank = 0;
      else if (item.lowerName.includes(lowerQuery)) rank = 1;
      else if (item.lowerSearchText.includes(lowerQuery)) rank = 2;

      return {
        playlist: item.playlist,
        song: item,
        rank,
        score: r.score ?? 1,
        snippet: getMatchSnippet(item, words),
      };
    });

    ranked.sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      return a.score - b.score;
    });

    return ranked;
  }, [debouncedSearchQuery, fuse]);

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
    setDebouncedSearchQuery(query);
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

  const recentSections = useMemo(() => {
    const sections: { key: string; title: string; data: RecentItem[] }[] = [];
    if (recentSearches.length > 0) {
      sections.push({
        key: 'searches',
        title: '',
        data: recentSearches.map(s => ({ type: 'search' as const, query: s.query })),
      });
    }
    if (recentSongs.length > 0) {
      sections.push({
        key: 'songs',
        title: '',
        data: recentSongs.map(s => ({ type: 'song' as const, playlist: s.playlist, songNumber: s.songNumber, songName: s.songName })),
      });
    }
    return sections;
  }, [recentSearches, recentSongs]);

  return (
    <>
      <Head>
        <title>Search Songs | Indirimbo</title>
        <meta name="description" content="Search Rwandan hymns and worship songs by title, number, or lyrics across Gushimisha Imana and Agakiza hymnbooks." />
      </Head>
      {isIOS && (
        <>
          <Stack.Screen options={{ title: 'Search' }} />
          <Stack.SearchBar
            ref={searchBarRef as any}
            placeholder="Search by title, number, or lyrics..."
            onChangeText={(e: { nativeEvent: { text: string } }) =>
              setSearchQuery(e.nativeEvent.text)}
            autoCapitalize="none"
            hideWhenScrolling={false}
          />
        </>
      )}
      <ThemedView style={styles.container}>
        {!isIOS && (
          <>
            <ThemedView style={[styles.header, { paddingTop: insets.top + 20 }]}>
              <ThemedText type="title">Search</ThemedText>
            </ThemedView>
            <SearchInput
              ref={searchInputRef}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by title, number, or lyrics..."
              style={styles.searchInput}
            />
          </>
        )}
        {debouncedSearchQuery.trim() ? (
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => `${item.playlist}-${item.song.number}-${index}`}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            initialNumToRender={8}
            maxToRenderPerBatch={5}
            windowSize={3}
            removeClippedSubviews={true}
            ListEmptyComponent={
              <ThemedView style={styles.emptyState}>
                <IconSymbol name="magnifyingglass" size={48} color={colors.icon + '40'} />
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
          <SectionList
            sections={recentSections}
            keyExtractor={(item, index) => `${item.type}-${item.type === 'search' ? item.query : `${item.playlist}-${item.songNumber}`}-${index}`}
            contentInsetAdjustmentBehavior="automatic"
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 90 }]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            renderSectionHeader={() => null}
            SectionSeparatorComponent={({ trailingItem, trailingSection }) => (!trailingItem && trailingSection) ? <View style={{ height: 16 }} /> : null}
            ListHeaderComponent={
              <View style={styles.recentHeader}>
                <ThemedText type="defaultSemiBold" style={styles.recentTitle}>Recent</ThemedText>
                {recentSearches.length > 0 && (
                  <TouchableOpacity onPress={handleClearRecentSearches} activeOpacity={0.7}>
                    <ThemedText style={[styles.clearAllText, { color: colors.tint }]}>Clear all</ThemedText>
                  </TouchableOpacity>
                )}
              </View>
            }
            renderItem={({ item, index, section }) => {
              if (item.type === 'search') {
                const isLast = index === section.data.length - 1;
                return (
                  <TouchableOpacity
                    style={[styles.recentItem, !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.icon + '20' }]}
                    onPress={() => handleRecentSearchTap(item.query)}
                    activeOpacity={0.7}>
                    <IconSymbol name="clock.arrow.circlepath" size={18} color={colors.icon} />
                    <ThemedText style={styles.recentQuery} numberOfLines={1}>{item.query}</ThemedText>
                    <TouchableOpacity
                      onPress={() => handleRemoveRecentSearch(item.query)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                      <IconSymbol name="xmark" size={14} color={colors.icon + '60'} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              }
              const playlistSongs = allSongs[item.playlist] || [];
              const song = playlistSongs.find(s => String(s.number) === String(item.songNumber));
              return (
                <TouchableOpacity
                  style={[styles.recentSongCard, { borderColor: colors.icon + '20' }]}
                  onPress={() => handleSongPress(item.playlist, item.songNumber)}
                  activeOpacity={0.7}>
                  <SongNumberBadge number={item.songNumber} />
                  <View style={styles.recentSongInfo}>
                    <ThemedText style={[styles.playlistLabel, { color: colors.icon, opacity: 0.7 }]}>
                      {getPlaylistName(item.playlist)}
                    </ThemedText>
                    <ThemedText type="defaultSemiBold" style={styles.recentSongName} numberOfLines={2}>
                      {song?.name || item.songName}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <ThemedView style={styles.emptyState}>
                <IconSymbol name="magnifyingglass" size={48} color={colors.icon + '40'} />
                <ThemedText style={styles.emptyTitle}>Search Songs</ThemedText>
                <ThemedText style={styles.emptyText}>
                  Search across all playlists by song name, number, or lyrics
                </ThemedText>
              </ThemedView>
            }
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
  songCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  songCardContent: {
    gap: 10,
  },
  songCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  songInfo: {
    flex: 1,
  },
  playlistLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  snippetContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  snippetLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  snippetText: {
    fontSize: 13,
    lineHeight: 18,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  recentTitle: {
    fontSize: 16,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '500',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  recentQuery: {
    flex: 1,
    fontSize: 15,
  },
  recentSongCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
  },
  recentSongInfo: {
    flex: 1,
  },
  recentSongName: {
    fontSize: 14,
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    opacity: 0.8,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
