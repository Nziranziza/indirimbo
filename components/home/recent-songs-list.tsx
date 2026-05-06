import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { SongNumberBadge } from '@/components/ui/song-number-badge';
import { getPlaylistName } from '@/constants/playlists';
import type { Song } from '@/constants/types';
import { useColors } from '@/hooks/use-colors';
import { useHydrated } from '@/hooks/use-hydrated';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import type { RecentSong } from '@/utils/storage';

const getShortTimeAgo = (timestamp: number): string => {
  const seconds = Math.round((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
};

interface RecentSongsListProps {
  readonly recentSongs: RecentSong[];
  readonly allSongs: Record<string, Song[]>;
  readonly onSongPress: (playlist: string, songNumber: number | string) => void;
}

export function RecentSongsList({ recentSongs, allSongs, onSongPress }: RecentSongsListProps) {
  const colors = useColors();
  const hasHydrated = useHydrated();

  return (
    <ThemedView>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Recent Songs
      </ThemedText>
      <View style={styles.list}>
        {recentSongs.map((recent, index) => {
          const playlistSongs = allSongs[recent.playlist] || [];
          const song = playlistSongs.find(s => String(s.number) === String(recent.songNumber));
          const playlistTitle = getPlaylistName(recent.playlist);

          return (
            <TouchableOpacity
              key={`${recent.playlist}-${recent.songNumber}-${index}`}
              style={[styles.card, { borderColor: colors.icon + '20' }]}
              onPress={() => onSongPress(recent.playlist, recent.songNumber)}
              accessibilityLabel={`${song?.name || recent.songName}, ${playlistTitle}`}
              accessibilityRole="button"
              activeOpacity={0.7}>
              <SongNumberBadge number={recent.songNumber} />
              <View style={styles.songInfo}>
                <View style={styles.playlistRow}>
                  <ThemedText style={[styles.playlistLabel, { color: colors.icon, opacity: 0.8 }]} numberOfLines={1}>
                    {playlistTitle}
                  </ThemedText>
                  {hasHydrated && (
                    <ThemedText style={[styles.date, { color: colors.icon, opacity: 0.6 }]} numberOfLines={1}>
                      • {getShortTimeAgo(recent.timestamp)}
                    </ThemedText>
                  )}
                </View>
                <ThemedText type="defaultSemiBold" style={styles.songTitle} numberOfLines={2}>
                  {song?.name || recent.songName}
                </ThemedText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    marginBottom: 12,
  },
  list: {
    gap: 12,
  },
  card: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  songInfo: {
    flex: 1,
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
    maxWidth: '100%',
  },
  playlistLabel: {
    fontSize: 12,
    flexShrink: 0,
    lineHeight: 11,
  },
  date: {
    fontSize: 11,
    flexShrink: 1,
  },
  songTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
});
