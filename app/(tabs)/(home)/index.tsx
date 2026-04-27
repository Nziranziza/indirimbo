import { CategoryChips } from '@/components/home/category-chips';
import { FavoriteSongsRow } from '@/components/home/favorite-songs-row';
import { PageHead } from '@/components/page-head';
import { RecentSongsList } from '@/components/home/recent-songs-list';
import { TabScrollView } from '@/components/tab-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PlaylistCard } from '@/components/ui/playlist-card';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import type { PlaylistId } from '@/constants/playlists';
import { useColorScheme } from '@/contexts/theme-context';
import { useColors } from '@/hooks/use-colors';
import { useHydrated } from '@/hooks/use-hydrated';
import { useSongbooks } from '@/hooks/use-songbooks';
import { getFavorites, getRecentSongs, type FavoriteSong, type RecentSong } from '@/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const PLAYLIST_ICONS: Record<string, IconSymbolName> = {
  gushimisha: 'music.mic',
  agakiza: 'music.note.list',
  'cantiques-kirundi': 'book.fill',
};

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const hasHydrated = useHydrated();
  const { visiblePlaylistIds, showCategoryChips, allSongsForFavorites } = useSongbooks();
  const [recentSongs, setRecentSongs] = useState<RecentSong[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<FavoriteSong[]>([]);

  useFocusEffect(
    useCallback(() => {
      getRecentSongs().then(recent => setRecentSongs(recent.slice(0, 10)));
      getFavorites().then(favorites => setFavoriteSongs(favorites.slice(0, 10)));
    }, [])
  );

  const handleSongPress = useCallback((playlist: string, songNumber: number | string) => {
    router.navigate(`/song/${playlist}/${songNumber}`);
  }, [router]);

  return (
    <ThemedView style={styles.container}>
      <PageHead
        title="Indirimbo - z'Agakiza no Gushimisha Imana"
        description="Shakisha indirimbo z'agakiza n'izo gushimisha Imana. Igitabo cy'indirimbo zo mu matorero, amagambo yose y'indirimbo z'abarokore. Find Rwandan worship songs with full lyrics."
        canonicalPath=""
        keywords="indirimbo, indirimbo zo mugitabo, indirimbo z'agakiza, indirimbo zo gushimisha imana, igitabo cy'indirimbo, indirimbo z'abarokore, indirimbo zo guhimbaza imana, rwandan hymns, worship songs"
      />

      <LinearGradient
        colors={
          isDark
            ? [colors.tint + '18', colors.tint + '0A', 'transparent']
            : [colors.tint + '30', colors.tint + '18', 'transparent']
        }
        style={styles.ambientGlow}
      />

      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <ThemedText style={[styles.greeting, { color: colors.tint }]}>
          {getGreeting()}
        </ThemedText>
        <ThemedText type="title">
          Indirimbo
        </ThemedText>
      </View>

      <TabScrollView contentContainerStyle={styles.scrollContent}>
        {showCategoryChips && <CategoryChips />}

        <View style={styles.playlistSection}>
          <ThemedView style={styles.playlistContainer}>
            {visiblePlaylistIds.map((id) => (
              <PlaylistCard
                key={id}
                playlistId={id as PlaylistId}
                iconName={PLAYLIST_ICONS[id] ?? 'music.note.list'}
                onPress={() => {
                  router.navigate({
                    pathname: '/(tabs)/(home)/playlist/[name]',
                    params: { name: id },
                  });
                }}
              />
            ))}
          </ThemedView>

          {hasHydrated && favoriteSongs.length > 0 && (
            <FavoriteSongsRow
              favoriteSongs={favoriteSongs}
              allSongs={allSongsForFavorites}
              onSongPress={handleSongPress}
            />
          )}

          {hasHydrated && recentSongs.length > 0 && (
            <RecentSongsList
              recentSongs={recentSongs}
              allSongs={allSongsForFavorites}
              onSongPress={handleSongPress}
            />
          )}
        </View>
      </TabScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ambientGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 1,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  playlistSection: {
    gap: 28,
  },
  playlistContainer: {
    gap: 16,
  },
});
