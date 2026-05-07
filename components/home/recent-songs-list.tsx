import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { RecentSongCard } from '@/components/ui/recent-song-card';
import type { Song } from '@/constants/types';
import { StyleSheet, View } from 'react-native';
import type { RecentSong } from '@/utils/storage';

interface RecentSongsListProps {
  readonly recentSongs: RecentSong[];
  readonly allSongs: Record<string, Song[]>;
  readonly onSongPress: (playlist: string, songNumber: number | string) => void;
}

export function RecentSongsList({ recentSongs, allSongs, onSongPress }: RecentSongsListProps) {
  return (
    <ThemedView>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Recent Songs
      </ThemedText>
      <View style={styles.list}>
        {recentSongs.map((recent, index) => (
          <RecentSongCard
            key={`${recent.playlist}-${recent.songNumber}-${index}`}
            playlist={recent.playlist}
            songNumber={recent.songNumber}
            songName={recent.songName}
            timestamp={recent.timestamp}
            allSongs={allSongs}
            onPress={onSongPress}
          />
        ))}
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
});
