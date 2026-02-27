import { TabScrollView } from '@/components/tab-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { PlaylistCard } from '@/components/ui/playlist-card';
import { SongNumberBadge } from '@/components/ui/song-number-badge';
import agakizaSongs from '@/constants/agakiza-songs';
import gushimishaSongs from '@/constants/gushimisha-songs';
import { gushimishaCategories } from '@/constants/gushimisha-categories';
import { getPlaylistName } from '@/constants/playlists';
import { useColorScheme } from '@/contexts/theme-context';
import { useColors } from '@/hooks/use-colors';
import { useHydrated } from '@/hooks/use-hydrated';
import { getFavorites, getRecentSongs, type FavoriteSong, type RecentSong } from '@/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import Head from 'expo-router/head';
import moment from 'moment';
import { ComponentProps, useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type IconSymbolName = ComponentProps<typeof IconSymbol>['name'];

interface Song {
  number: number | string;
  name: string;
  url: string;
  body: {
    type: 'verse' | 'chorus';
    number?: number;
    content: string;
  }[];
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

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
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const hasHydrated = useHydrated();
  const [recentSongs, setRecentSongs] = useState<RecentSong[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<FavoriteSong[]>([]);

  const allSongs = useMemo<Record<string, Song[]>>(() => ({
    agakiza: agakizaSongs as Song[],
    gushimisha: gushimishaSongs as Song[],
  }), []);

  useFocusEffect(
    useCallback(() => {
      loadRecentSongs();
      loadFavoriteSongs();
    }, [])
  );

  const loadRecentSongs = async () => {
    const recent = await getRecentSongs();
    setRecentSongs(recent.slice(0, 10));
  };

  const loadFavoriteSongs = async () => {
    const favorites = await getFavorites();
    setFavoriteSongs(favorites.slice(0, 10));
  };

  const handleSongPress = useCallback((playlist: string, songNumber: number | string) => {
    router.push(`/song/${playlist}/${songNumber}`);
  }, [router]);

  return (
    <ThemedView style={styles.container}>
      <Head>
        <title>Indirimbo - z'Agakiza no Gushimisha Imana</title>
        <meta name="description" content="Browse hymns from Agakiza and Gushimisha Imana hymnbooks. Find Rwandan church worship songs with full lyrics." />
      </Head>
      {/* Ambient tint glow behind the header */}
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
        <ThemedText type="title" style={styles.title}>
          Indirimbo
        </ThemedText>
      </View>

      <TabScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}>
            {gushimishaCategories.map((category, index) => (
              <TouchableOpacity
                key={category.name}
                style={[styles.categoryChip, { borderColor: colors.tint + '40' }]}
                activeOpacity={0.7}
                onPress={() => {
                  router.push({
                    pathname: '/(tabs)/home/category/[slug]',
                    params: { slug: category.slug },
                  });
                }}>
                <IconSymbol name={category.icon as IconSymbolName} size={14} color={colors.tint} />
                <ThemedText style={[styles.categoryChipText, { color: colors.tint }]}>
                  {category.name}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

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
              <View style={styles.horizontalScrollWrapper}>
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
              </View>
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
      </TabScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Ambient glow
  ambientGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: 0,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 1,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  title: {
    marginBottom: 0,
  },

  // Category chips
  categoryContainer: {
    marginHorizontal: -20,
    paddingBottom: 16,
  },
  categoryScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Content
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

  // Section headers
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

  // Favorites
  horizontalScrollWrapper: {
    marginHorizontal: -20,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  favoriteSongCard: {
    width: 160,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },

  // Recent
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
    justifyContent: 'center',
  },

  // Shared song info
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
});
