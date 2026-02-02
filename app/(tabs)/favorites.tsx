import { TabScrollView } from '@/components/tab-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SongNumberBadge } from '@/components/ui/song-number-badge';
import agakizaSongs from '@/constants/agakiza-songs';
import gushimishaSongs from '@/constants/gushimisha-songs';
import { getPlaylistName } from '@/constants/playlists';
import { useColors } from '@/hooks/use-colors';
import { useHydrated } from '@/hooks/use-hydrated';
import { getFavorites, removeFavorite, type FavoriteSong } from '@/utils/storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
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

export default function FavoritesTabScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteSong[]>([]);
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const hasHydrated = useHydrated();

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const handleSongPress = (favorite: FavoriteSong) => {
    router.push({
      pathname: '/song',
      params: { 
        playlist: favorite.playlist, 
        songNumber: String(favorite.songNumber) 
      },
    });
  };

  const handleRemoveFavorite = async (playlist: string, songNumber: number | string) => {
    await removeFavorite(playlist, songNumber);
    loadFavorites();
  };

  const allSongs: Record<string, Song[]> = {
    agakiza: agakizaSongs as Song[],
    gushimisha: gushimishaSongs as Song[],
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'today';
    } else if (diffInDays === 1) {
      return 'yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <ThemedText type="title" style={styles.title}>
          Favorites
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Your favorite songs
        </ThemedText>
      </ThemedView>

      <TabScrollView 
        contentContainerStyle={styles.scrollContent}>
        {!hasHydrated || favorites.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <IconSymbol name="heart" size={64} color={colors.icon} />
            <ThemedText style={styles.emptyText}>No favorites yet</ThemedText>
            <ThemedText style={[styles.emptySubtext, { opacity: 0.6 }]}>
              Tap the heart icon on any song to add it to favorites
            </ThemedText>
          </ThemedView>
        ) : (
          favorites.map((favorite, index) => {
            const playlistSongs = allSongs[favorite.playlist] || [];
            const song = playlistSongs.find(s => String(s.number) === String(favorite.songNumber));
            const playlistTitle = getPlaylistName(favorite.playlist);
            
            return (
              <TouchableOpacity
                key={`${favorite.playlist}-${favorite.songNumber}-${index}`}
                style={[styles.songCard, { borderColor: colors.icon + '20' }]}
                onPress={() => handleSongPress(favorite)}
                activeOpacity={0.7}>
                <SongNumberBadge number={favorite.songNumber} />
                <View style={styles.songInfo}>
                  <View style={styles.playlistRow}>
                    <ThemedText style={[styles.playlistLabel, { color: colors.icon, opacity: 0.7 }]}>
                      {playlistTitle}
                    </ThemedText>
                    {favorite.likedAt && hasHydrated && (
                      <ThemedText style={[styles.likedDate, { color: colors.icon, opacity: 0.5 }]}>
                        • {formatDate(favorite.likedAt)}
                      </ThemedText>
                    )}
                  </View>
                  <ThemedText type="defaultSemiBold" style={styles.songTitle} numberOfLines={2}>
                    {song?.name || favorite.songName}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveFavorite(favorite.playlist, favorite.songNumber)}
                  style={styles.favoriteButton}
                  activeOpacity={0.7}>
                  <IconSymbol name="heart.fill" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        )}
      </TabScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  songInfo: {
    flex: 1,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  playlistLabel: {
    fontSize: 12,
  },
  songTitle: {
    fontSize: 16,
  },
  likedDate: {
    fontSize: 11,
  },
  favoriteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

