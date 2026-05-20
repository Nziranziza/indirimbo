import { PlaylistCard } from '@/components/ui/playlist-card';
import type { PlaylistId } from '@/constants/playlists';
import { useSongbookPreference } from '@/contexts/songbook-preference-context';
import { useSongbooks } from '@/hooks/use-songbooks';
import { trackEvent } from '@/utils/analytics';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

export function PlaylistSection() {
  const router = useRouter();
  const { visiblePlaylistIds, allSongsForFavorites } = useSongbooks();
  const { isBurundi } = useSongbookPreference();

  const handlePress = useCallback((id: PlaylistId) => {
    trackEvent('view_playlist', { playlist: id });
    router.navigate({
      pathname: '/(tabs)/(home)/playlist/[name]',
      params: { name: id },
    });
  }, [router]);

  if (visiblePlaylistIds.length === 2) {
    return (
      <View style={styles.stack}>
        {visiblePlaylistIds.map((id) => (
          <PlaylistCard
            key={id}
            playlistId={id}
            onPress={() => handlePress(id)}
          />
        ))}
      </View>
    );
  }

  const defaultBookId: PlaylistId = isBurundi ? 'cantiques-kirundi' : 'gushimisha';
  const featuredId = visiblePlaylistIds.includes(defaultBookId)
    ? defaultBookId
    : visiblePlaylistIds[0];
  const otherIds = visiblePlaylistIds.filter((id) => id !== featuredId);

  return (
    <View style={styles.featuredStack}>
      <PlaylistCard
        playlistId={featuredId}
        onPress={() => handlePress(featuredId)}
        variant="featured"
        songCount={allSongsForFavorites[featuredId]?.length}
      />
      {otherIds.length > 0 && (
        <View style={styles.compactRow}>
          {otherIds.map((id) => (
            <PlaylistCard
              key={id}
              playlistId={id}
              onPress={() => handlePress(id)}
              variant="compact"
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: 16,
  },
  featuredStack: {
    gap: 12,
  },
  compactRow: {
    flexDirection: 'row',
    gap: 12,
  },
});
