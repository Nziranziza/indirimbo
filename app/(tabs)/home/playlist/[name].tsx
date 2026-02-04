import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SearchInput } from '@/components/ui/search-input';
import { SongNumberBadge } from '@/components/ui/song-number-badge';
import agakizaSongs from '@/constants/agakiza-songs';
import gushimishaSongs from '@/constants/gushimisha-songs';
import { getPlaylistName } from '@/constants/playlists';
import { useColors } from '@/hooks/use-colors';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Song {
  number: number | string; // Can be number (e.g., 18) or string with suffix (e.g., "18a", "18b")
  name: string;
  url: string;
  body: {
    type: 'verse' | 'chorus';
    number?: number;
    content: string;
  }[];
}

export default function PlaylistScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name: string | string[] }>();
  const pathname = usePathname();
  const isOs = Platform.OS === 'ios';

  // Get name from pathname or params
  const name = useMemo(() => {
    // First, try to extract from pathname (most reliable for dynamic routes)
    // e.g., "/playlist/agakiza" -> "agakiza"
    if (pathname) {
      const pathParts = pathname.split('/').filter(Boolean);
      const playlistIndex = pathParts.indexOf('playlist');
      if (playlistIndex !== -1 && pathParts[playlistIndex + 1]) {
        const playlistName = pathParts[playlistIndex + 1];
        // Make sure it's not the literal "[name]" string
        if (playlistName && playlistName !== '[name]' && !playlistName.startsWith('[')) {
          return playlistName;
        }
      }
    }

    // Fallback: try params
    const paramName = params.name;
    if (paramName) {
      if (typeof paramName === 'string' && paramName !== '[name]' && !paramName.startsWith('[')) {
        return paramName;
      }
      if (Array.isArray(paramName) && paramName.length > 0) {
        const firstParam = paramName[0];
        if (firstParam && firstParam !== '[name]' && !firstParam.startsWith('[')) {
          return firstParam;
        }
      }
    }

    // Default fallback
    return 'agakiza';
  }, [params.name, pathname]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const debounceTimerRef = useRef<number | null>(null);
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom;

  // Memoize songs array - only compute once per playlist
  const songs: Song[] = useMemo(() => {
    return name === 'agakiza'
      ? (agakizaSongs as Song[])
      : (gushimishaSongs as Song[]);
  }, [name]);

  const playlistTitle = useMemo(() => {
    return getPlaylistName(name);
  }, [name]);

  // Debounce search query to avoid filtering on every keystroke
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 200); // 200ms debounce for better performance

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  // Configure Fuse instance for fuzzy search
  const fuse = useMemo(() => new Fuse(songs, {
    keys: [
      { name: 'number', weight: 0.3 },
      { name: 'name', weight: 0.5 },
      { name: 'body.content', weight: 0.2 }
    ],
    threshold: 0.4,
    ignoreLocation: true,
  }), [songs]);

  // Memoize filtered songs using fuzzy search
  const filteredSongs = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return songs;
    return fuse.search(debouncedSearchQuery.trim()).map(r => r.item);
  }, [songs, debouncedSearchQuery, fuse]);

  const handleSongPress = useCallback((songNumber: number | string) => {
    router.push({
      pathname: '/song',
      params: { playlist: name, songNumber: String(songNumber) },
    });
  }, [router, name]);

  // Memoized song item renderer
  const renderSongItem = useCallback(({ item: song }: { item: Song }) => {
    return (
      <TouchableOpacity
        style={[styles.songCard, { borderColor: colors.icon + '20' }]}
        onPress={() => handleSongPress(song.number)}
        activeOpacity={0.7}>
        <SongNumberBadge number={song.number} />
        <ThemedView style={styles.songInfo}>
          <ThemedText type="defaultSemiBold" style={styles.songTitle} numberOfLines={2}>
            {song.name}
          </ThemedText>
        </ThemedView>
        <IconSymbol name="arrow.right" size={20} color={colors.icon} /> 
      </TouchableOpacity>
    );
  }, [colors, handleSongPress]);

  // Optimize FlatList item key extraction
  const getItemKey = useCallback((item: Song, index: number) => {
    return `${item.number}-${index}`;
  }, []);

  // Empty state component
  const renderEmptyState = useCallback(() => {
    if (filteredSongs.length === 0 && debouncedSearchQuery.trim()) {
      return (
        <ThemedView style={styles.emptyState}>
          <IconSymbol name="magnifyingglass" size={48} color={colors.icon} />
          <ThemedText style={styles.emptyText}>No songs found</ThemedText>
          <ThemedText style={[styles.emptySubtext, { opacity: 0.6 }]}>
            Try a different search term
          </ThemedText>
        </ThemedView>
      );
    }
    return null;
  }, [filteredSongs.length, debouncedSearchQuery, colors.icon]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}>
          <IconSymbol name="arrow.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>
          {playlistTitle}
        </ThemedText>
        <View style={{ width: 40 }} />
      </ThemedView>

      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by title, content, or number..."
        style={styles.searchInput}
      />

      <FlatList
        data={filteredSongs}
        renderItem={renderSongItem}
        keyExtractor={getItemKey}
        style={styles.scrollView}
        contentInsetAdjustmentBehavior={Platform.OS === 'ios' ? 'automatic' : undefined}
        contentContainerStyle={[styles.scrollContent, {
          paddingBottom: isOs ? 0 : bottomPadding + 90,
        }]}
        ListEmptyComponent={renderEmptyState}
        removeClippedSubviews={true}
        maxToRenderPerBatch={20}
        updateCellsBatchingPeriod={50}
        initialNumToRender={30}
        windowSize={10}
        getItemLayout={(data, index) => ({
          length: 80, // Approximate height of song card (padding + height)
          offset: 80 * index,
          index,
        })}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
  },
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 20,
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
  },
});
