import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SongNumberBadge } from '@/components/ui/song-number-badge';
import { getPlaylistName } from '@/constants/playlists';
import type { Song } from '@/constants/types';
import { useColors } from '@/hooks/use-colors';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import type { FavoriteSong } from '@/utils/storage';

interface FavoriteSongsRowProps {
  readonly favoriteSongs: FavoriteSong[];
  readonly allSongs: Record<string, Song[]>;
  readonly onSongPress: (playlist: string, songNumber: number | string) => void;
}

export function FavoriteSongsRow({ favoriteSongs, allSongs, onSongPress }: FavoriteSongsRowProps) {
  const router = useRouter();
  const colors = useColors();

  const handleViewAll = useCallback(() => {
    router.navigate('/(tabs)/favorites');
  }, [router]);

  return (
    <ThemedView>
      <View style={styles.sectionHeader}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Favorite Songs
        </ThemedText>
        <TouchableOpacity
          onPress={handleViewAll}
          accessibilityLabel="See all favorites"
          accessibilityRole="button"
          activeOpacity={0.7}
          style={[styles.viewMoreButton, { backgroundColor: colors.tint + '20' }]}>
          <ThemedText style={[styles.viewMoreText, { color: colors.tint }]}>
            See all
          </ThemedText>
          <IconSymbol name="arrow.right" size={14} color={colors.tint} />
        </TouchableOpacity>
      </View>
      <View style={styles.scrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}>
          {favoriteSongs.map((favorite, index) => {
            const playlistSongs = allSongs[favorite.playlist] || [];
            const song = playlistSongs.find(s => String(s.number) === String(favorite.songNumber));
            const playlistTitle = getPlaylistName(favorite.playlist);

            return (
              <TouchableOpacity
                key={`${favorite.playlist}-${favorite.songNumber}-${index}`}
                style={[styles.card, { borderColor: colors.icon + '20' }]}
                onPress={() => onSongPress(favorite.playlist, favorite.songNumber)}
                accessibilityLabel={`${song?.name || favorite.songName}, ${playlistTitle}`}
                accessibilityRole="button"
                activeOpacity={0.7}>
                <SongNumberBadge number={favorite.songNumber} style={{ alignSelf: 'flex-start' }} />
                <View style={styles.songInfo}>
                  <ThemedText style={[styles.playlistLabel, { color: colors.icon, opacity: 0.6 }]} numberOfLines={1}>
                    {playlistTitle}
                  </ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.songTitle} numberOfLines={2}>
                    {song?.name || favorite.songName}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
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
  scrollWrapper: {
    marginHorizontal: -20,
  },
  scroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  card: {
    width: 160,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  songInfo: {
    flex: 1,
  },
  playlistLabel: {
    fontSize: 11,
    lineHeight: 11,
    marginBottom: 4,
  },
  songTitle: {
    fontSize: 14,
    lineHeight: 18,
  },
});
