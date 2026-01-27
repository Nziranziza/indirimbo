import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SongNumberBadge } from '@/components/ui/song-number-badge';
import agakizaSongs from '@/constants/agakiza-songs';
import gushimishaSongs from '@/constants/gushimisha-songs';
import { getPlaylistName } from '@/constants/playlists';
import { useColors } from '@/hooks/use-colors';
import { getFavorites, removeFavorite, type FavoriteSong } from '@/utils/storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
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

export default function FavoritesScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteSong[]>([]);
  const colors = useColors();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadFavorites();
  }, []);

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
          Favorites
        </ThemedText>
        <View style={{ width: 40 }} />
      </ThemedView>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        {favorites.length === 0 ? (
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
                  <ThemedText style={[styles.playlistLabel, { color: colors.icon, opacity: 0.7 }]}>
                    {playlistTitle}
                  </ThemedText>
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
      </ScrollView>
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
  playlistLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  songTitle: {
    fontSize: 16,
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

