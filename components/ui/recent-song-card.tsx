import { ThemedText } from '@/components/themed-text';
import { SongNumberBadge } from '@/components/ui/song-number-badge';
import { getPlaylistName } from '@/constants/playlists';
import type { Song } from '@/constants/types';
import { useColors } from '@/hooks/use-colors';
import { useHydrated } from '@/hooks/use-hydrated';
import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';

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
  if (days < 365) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
};

interface RecentSongCardProps {
  readonly playlist: string;
  readonly songNumber: number | string;
  readonly songName: string;
  readonly timestamp: number;
  readonly allSongs: Record<string, Song[]>;
  readonly onPress: (playlist: string, songNumber: number | string) => void;
  readonly style?: StyleProp<ViewStyle>;
}

export const RecentSongCard = React.memo(function RecentSongCard({
  playlist,
  songNumber,
  songName,
  timestamp,
  allSongs,
  onPress,
  style,
}: RecentSongCardProps) {
  const colors = useColors();
  const hasHydrated = useHydrated();

  const playlistSongs = allSongs[playlist] || [];
  const song = playlistSongs.find(s => String(s.number) === String(songNumber));
  const playlistTitle = getPlaylistName(playlist);
  const displayName = song?.name || songName;

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: colors.icon + '20' }, style]}
      onPress={() => onPress(playlist, songNumber)}
      accessibilityLabel={`${displayName}, ${playlistTitle}`}
      accessibilityRole="button"
      activeOpacity={0.7}>
      <SongNumberBadge number={songNumber} />
      <View style={styles.songInfo}>
        <View style={styles.playlistRow}>
          <ThemedText style={[styles.playlistLabel, { color: colors.icon, opacity: 0.8 }]} numberOfLines={1}>
            {playlistTitle}
          </ThemedText>
          {hasHydrated && (
            <ThemedText style={[styles.date, { color: colors.icon, opacity: 0.6 }]} numberOfLines={1}>
              • {getShortTimeAgo(timestamp)}
            </ThemedText>
          )}
        </View>
        <ThemedText type="defaultSemiBold" style={styles.songTitle} numberOfLines={2}>
          {displayName}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
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
    gap: 2
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
    lineHeight: 13,
  },
  date: {
    fontSize: 11,
    flexShrink: 1,
    lineHeight: 12,
    textTransform: 'capitalize',
  },
  songTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
});
