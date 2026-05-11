import { PageHead } from '@/components/page-head';
import { TabCollapsibleScrollView } from '@/components/tab-collapsible-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SongNumberBadge } from '@/components/ui/song-number-badge';
import { getPlaylistName } from '@/constants/playlists';
import { useColors } from '@/hooks/use-colors';
import { useHydrated } from '@/hooks/use-hydrated';
import { useSongbooks } from '@/hooks/use-songbooks';
import { useTranslation } from '@/hooks/use-translation';
import { formatLongTimeAgo } from '@/utils/format-date';
import { getFavorites, removeFavorite, type FavoriteSong } from '@/utils/storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export default function FavoritesTabScreen() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteSong[]>([]);
  const colors = useColors();
  const hasHydrated = useHydrated();
  const { t, language } = useTranslation();

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
    router.navigate({
      pathname: '/song/[playlist]/[songNumber]',
      params: {
        playlist: favorite.playlist,
        songNumber: String(favorite.songNumber),
        source: 'favorites',
      },
    });
  };

  const handleRemoveFavorite = async (playlist: string, songNumber: number | string) => {
    await removeFavorite(playlist, songNumber);
    loadFavorites();
  };

  const { allSongsForFavorites: allSongs } = useSongbooks();

  const formatDate = (timestamp: number): string => formatLongTimeAgo(timestamp, t, language);

  return (
    <ThemedView style={styles.container}>
      <PageHead
        title={t('favorites.pageTitle')}
        description={t('favorites.pageDescription')}
        canonicalPath="/favorites"
      />
      <TabCollapsibleScrollView
        title={t('favorites.title')}
        subtitle={t('favorites.subtitle')}
      >
        {!hasHydrated || favorites.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <IconSymbol name="heart" size={64} color={colors.icon} />
            <ThemedText style={styles.emptyText}>{t('favorites.empty.title')}</ThemedText>
            <ThemedText style={[styles.emptySubtext, { opacity: 0.6 }]}>
              {t('favorites.empty.subtitle')}
            </ThemedText>
            <TouchableOpacity
              onPress={() => router.navigate('/(tabs)/(home)')}
              accessibilityLabel={t('favorites.empty.ctaA11y')}
              accessibilityRole="button"
              activeOpacity={0.8}
              style={[styles.ctaButton, { backgroundColor: colors.tint }]}>
              <IconSymbol name="play.fill" size={20} color={colors.tintForeground} />
              <ThemedText style={[styles.ctaText, { color: colors.tintForeground }]}>{t('favorites.empty.cta')}</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          favorites.map((favorite, index) => {
            const playlistSongs = allSongs[favorite.playlist] || [];
            const song = playlistSongs.find(s => String(s.number) === String(favorite.songNumber));
            const playlistTitle = getPlaylistName(favorite.playlist);
            const songName = song?.name || favorite.songName;

            return (
              <TouchableOpacity
                key={`${favorite.playlist}-${favorite.songNumber}-${index}`}
                style={[styles.songCard, { borderColor: colors.icon + '20' }]}
                onPress={() => handleSongPress(favorite)}
                accessibilityLabel={t('favorites.songCardA11y', { songName, playlistTitle })}
                accessibilityRole="button"
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
                    {songName}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  onPress={() => handleRemoveFavorite(favorite.playlist, favorite.songNumber)}
                  style={styles.favoriteButton}
                  accessibilityLabel={t('favorites.removeA11y')}
                  accessibilityRole="button"
                  activeOpacity={0.7}>
                  <IconSymbol name="heart.fill" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        )}
      </TabCollapsibleScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    lineHeight: 13,
  },
  songTitle: {
    fontSize: 16,
  },
  likedDate: {
    fontSize: 11,
    lineHeight: 12,
  },
  favoriteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 8,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 8,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '700',
    maxWidth: 200,
    textAlign: 'center'
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

