import { TabScrollView } from '@/components/tab-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PlaylistCard } from '@/components/ui/playlist-card';
import { SearchInput } from '@/components/ui/search-input';
import { SongNumberBadge } from '@/components/ui/song-number-badge';
import agakizaSongs from '@/constants/agakiza-songs';
import gushimishaSongs from '@/constants/gushimisha-songs';
import { getPlaylistName } from '@/constants/playlists';
import { useColors } from '@/hooks/use-colors';
import { useHydrated } from '@/hooks/use-hydrated';
import { getFavorites, getRecentSongs, type FavoriteSong, type RecentSong } from '@/utils/storage';
import { useFocusEffect, useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import moment from 'moment';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
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

// Helper function to get short relative time format
const getShortTimeAgo = (timestamp: number): string => {
  const now = moment();
  const then = moment(timestamp);
  const diffMinutes = now.diff(then, 'minutes');
  const diffHours = now.diff(then, 'hours');
  const diffDays = now.diff(then, 'days');
  const diffMonths = now.diff(then, 'months');
  const diffYears = now.diff(then, 'years');

  if (diffMinutes < 1) return 'a few sec ago';
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} mo ago`;
  return `${diffYears} yr ago`;
};

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const hasHydrated = useHydrated();
  const [recentSongs, setRecentSongs] = useState<RecentSong[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<FavoriteSong[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const debounceTimerRef = useRef<number | null>(null);

  // Memoize all songs to avoid recreating on every render
  const allSongs = useMemo<Record<string, Song[]>>(() => ({
    agakiza: agakizaSongs as Song[],
    gushimisha: gushimishaSongs as Song[],
  }), []);

  // Reload recent songs and favorites when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadRecentSongs();
      loadFavoriteSongs();
    }, [])
  );

  // Debounce search query
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms debounce delay

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  const loadRecentSongs = async () => {
    const recent = await getRecentSongs();
    setRecentSongs(recent.slice(0, 10)); // Show last 10
  };

  const loadFavoriteSongs = async () => {
    const favorites = await getFavorites();
    setFavoriteSongs(favorites.slice(0, 10)); // Show first 10
  };

  // Create flat list of songs with playlist info for Fuse
  const allSongsFlat = useMemo(() => {
    return Object.entries(allSongs).flatMap(([playlist, songs]) =>
      songs.map(song => ({ ...song, playlist }))
    );
  }, [allSongs]);

  // Configure Fuse instance for fuzzy search
  const fuse = useMemo(() => new Fuse(allSongsFlat, {
    keys: [
      { name: 'number', weight: 0.3 },
      { name: 'name', weight: 0.5 },
      { name: 'body.content', weight: 0.2 }
    ],
    threshold: 0.4,
    ignoreLocation: true,
  }), [allSongsFlat]);

  // Memoize search results using fuzzy search
  const searchResults = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return [];
    }

    const results = fuse.search(debouncedSearchQuery.trim());
    return results.slice(0, 50).map(r => ({
      playlist: r.item.playlist,
      song: r.item
    }));
  }, [debouncedSearchQuery, fuse]);

  const handleSongPress = useCallback((playlist: string, songNumber: number | string) => {
    router.push({
      pathname: '/song',
      params: { playlist, songNumber: String(songNumber) },
    });
  }, [router]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <ThemedText type="title" style={styles.title}>
          Indirimbo
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Choose a playlist to browse songs
        </ThemedText>
      </ThemedView>
      <SearchInput
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search all songs..."
        style={styles.searchInput}
      />
      <TabScrollView
        contentContainerStyle={styles.scrollContent}>
        {debouncedSearchQuery.trim() ? (
          <ThemedView>
            <ThemedText type="subtitle" style={styles.sectionTitleStandalone}>
              Search Results ({searchResults.length})
            </ThemedText>
            {searchResults.length === 0 ? (
              <ThemedView style={styles.emptyState}>
                <ThemedText style={styles.emptyText}>No songs found</ThemedText>
              </ThemedView>
            ) : (
              searchResults.map((result, index) => {
                const playlistTitle = getPlaylistName(result.playlist);
                return (
                  <TouchableOpacity
                    key={`${result.playlist}-${result.song.number}-${index}`}
                    style={[styles.songCard, { borderColor: colors.icon + '20' }]}
                    onPress={() => handleSongPress(result.playlist, result.song.number)}
                    activeOpacity={0.7}>
                    <SongNumberBadge number={result.song.number} />
                    <View style={styles.songInfo}>
                      <ThemedText style={[styles.playlistLabel, { color: colors.icon, opacity: 0.7 }]}>
                        {playlistTitle}
                      </ThemedText>
                      <ThemedText type="defaultSemiBold" style={styles.songTitle} numberOfLines={2}>
                        {result.song.name}
                      </ThemedText>
                    </View>
                    <IconSymbol name="arrow.right" size={20} color={colors.icon} />
                  </TouchableOpacity>
                );
              })
            )}
          </ThemedView>
        ) : (
          <View style={styles.playlistSection}>
              <ThemedView style={styles.playlistContainer}>
                <PlaylistCard
                  playlistId="gushimisha"
                  iconName="music.mic"
                  onPress={() => {
                    router.push({
                      pathname: '/(tabs)/home/playlist/[name]',
                      params: { name: 'gushimisha' },
                    });
                  }}
                />

                <PlaylistCard
                  playlistId="agakiza"
                  iconName="music.note.list"
                  onPress={() => {
                    router.push({
                      pathname: '/(tabs)/home/playlist/[name]',
                      params: { name: 'agakiza' },
                    });
                  }}
                />
              </ThemedView>
            {hasHydrated && favoriteSongs.length > 0 && (
              <ThemedView>
                <View style={styles.sectionHeader}>
                  <ThemedText type="subtitle" style={styles.sectionTitle}>
                    Favorite Songs
                  </ThemedText>
                  <TouchableOpacity
                    onPress={() => router.push('/(tabs)/favorites')}
                    activeOpacity={0.7}
                    style={[styles.viewMoreButton, { backgroundColor: colors.tint + '20' }]}>
                    <ThemedText style={[styles.viewMoreText, { color: colors.tint }]}>
                      See all
                    </ThemedText>
                    <IconSymbol name="arrow.right" size={14} color={colors.tint} />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={styles.horizontalScroll}>
                  {favoriteSongs.map((favorite, index) => {
                    const playlistSongs = allSongs[favorite.playlist] || [];
                    const song = playlistSongs.find(s => String(s.number) === String(favorite.songNumber));
                    const playlistTitle = getPlaylistName(favorite.playlist);

                    return (
                      <TouchableOpacity
                        key={`${favorite.playlist}-${favorite.songNumber}-${index}`}
                        style={[styles.favoriteSongCard, { borderColor: colors.icon + '20' }]}
                        onPress={() => handleSongPress(favorite.playlist, favorite.songNumber)}
                        activeOpacity={0.7}>
                        <SongNumberBadge number={favorite.songNumber} style={{ alignSelf: 'flex-start' }} />
                        <View style={styles.recentSongInfo}>
                          <View style={styles.recentPlaylistRow}>
                            <ThemedText style={[styles.recentPlaylistLabel, { color: colors.icon, opacity: 0.6 }]} numberOfLines={1}>
                              {playlistTitle}
                            </ThemedText>
                          </View>
                          <ThemedText type="defaultSemiBold" style={styles.recentSongTitle} numberOfLines={2}>
                            {song?.name || favorite.songName}
                          </ThemedText>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </ThemedView>
            )}
            {hasHydrated && recentSongs.length > 0 && (
              <ThemedView>
                <ThemedText type="subtitle" style={styles.sectionTitleStandalone}>
                  Recent Songs
                </ThemedText>
                <View style={styles.verticalList}>
                  {recentSongs.map((recent, index) => {
                    const playlistSongs = allSongs[recent.playlist] || [];
                    const song = playlistSongs.find(s => String(s.number) === String(recent.songNumber));
                    const playlistTitle = getPlaylistName(recent.playlist);

                    return (
                      <TouchableOpacity
                        key={`${recent.playlist}-${recent.songNumber}-${index}`}
                        style={[styles.recentSongCard, { borderColor: colors.icon + '20' }]}
                        onPress={() => handleSongPress(recent.playlist, recent.songNumber)}
                        activeOpacity={0.7}>
                        <SongNumberBadge number={recent.songNumber} />
                        <View style={styles.recentSongInfo}>
                          <View style={styles.recentPlaylistRow}>
                            <ThemedText style={[styles.recentPlaylistLabel, { color: colors.icon, opacity: 0.6 }]} numberOfLines={1}>
                              {playlistTitle}
                            </ThemedText>
                            {hasHydrated && (
                              <ThemedText style={[styles.recentDate, { color: colors.icon, opacity: 0.4 }]} numberOfLines={1}>
                                • {getShortTimeAgo(recent.timestamp)}
                              </ThemedText>
                            )}
                          </View>
                          <ThemedText type="defaultSemiBold" style={styles.recentSongTitle} numberOfLines={2}>
                            {song?.name || recent.songName}
                          </ThemedText>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ThemedView>
            )}
          </View>
        )}
      </TabScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  title: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
    fontSize: 16,
  },
  playlistSection: {
    gap: 28,
  },
  playlistContainer: {
    gap: 16,
  },
  searchInput: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
  },
  sectionTitleStandalone: {
    fontSize: 18,
    marginBottom: 12,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  viewMoreText: {
    fontSize: 12,
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingRight: 20,
    gap: 12,
  },
  verticalList: {
    gap: 12,
  },
  recentSongCard: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  favoriteSongCard: {
    width: 160,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  recentSongInfo: {
    flex: 1,
  },
  recentPlaylistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
    maxWidth: '100%',
  },
  recentPlaylistLabel: {
    fontSize: 11,
    flexShrink: 0,
    lineHeight: 11,
  },
  recentDate: {
    fontSize: 10,
    flexShrink: 1,
  },
  recentSongTitle: {
    fontSize: 14,
    lineHeight: 18,
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
  playlistLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  songTitle: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.6,
  },
  emptyRecentState: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyRecentText: {
    fontSize: 14,
  },
});
