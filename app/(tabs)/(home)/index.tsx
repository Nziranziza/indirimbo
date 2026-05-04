import { CategoryChips } from '@/components/home/category-chips';
import { FavoriteSongsRow } from '@/components/home/favorite-songs-row';
import { PageHead } from '@/components/page-head';
import { RecentSongsList } from '@/components/home/recent-songs-list';
import { TabScrollView } from '@/components/tab-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { PlaylistCard } from '@/components/ui/playlist-card';
import { UpdateAvailableBanner } from '@/components/ui/update-available-banner';
import type { PlaylistId } from '@/constants/playlists';
import { useSongbookPreference } from '@/contexts/songbook-preference-context';
import { useColorScheme } from '@/contexts/theme-context';
import { useUpdateCheck } from '@/contexts/update-check-context';
import { useColors } from '@/hooks/use-colors';
import { useHydrated } from '@/hooks/use-hydrated';
import { useSongbooks } from '@/hooks/use-songbooks';
import { trackEvent } from '@/utils/analytics';
import { mediumImpact } from '@/utils/haptics';
import { shareApp } from '@/utils/share';
import { getFavorites, getRecentSongs, type FavoriteSong, type RecentSong } from '@/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SHARE_LABEL_WIDTH = 75;
const SHARE_LABEL_GAP = 6;
const SHARE_COLLAPSE_DELAY = 3000;
const SHARE_HEIGHT_EXPANDED = 32;
const SHARE_HEIGHT_COLLAPSED = 44;

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

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
  const { isBurundi } = useSongbookPreference();
  const { mode: updateMode } = useUpdateCheck();
  const [recentSongs, setRecentSongs] = useState<RecentSong[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<FavoriteSong[]>([]);
  const shareExpanded = useSharedValue(1);

  useFocusEffect(
    useCallback(() => {
      getRecentSongs().then(recent => setRecentSongs(recent.slice(0, 10)));
      getFavorites().then(favorites => setFavoriteSongs(favorites.slice(0, 10)));
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      shareExpanded.value = withTiming(1, { duration: 200 });
      const timeout = setTimeout(() => {
        shareExpanded.value = withTiming(0, { duration: 300 });
      }, SHARE_COLLAPSE_DELAY);
      return () => clearTimeout(timeout);
    }, [shareExpanded])
  );

  const shareLabelStyle = useAnimatedStyle(() => ({
    opacity: shareExpanded.value,
    width: shareExpanded.value * SHARE_LABEL_WIDTH,
    marginLeft: shareExpanded.value * SHARE_LABEL_GAP,
  }));

  const shareButtonStyle = useAnimatedStyle(() => ({
    height:
      SHARE_HEIGHT_EXPANDED +
      (1 - shareExpanded.value) * (SHARE_HEIGHT_COLLAPSED - SHARE_HEIGHT_EXPANDED),
  }));

  const shareIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + (1 - shareExpanded.value) * 0.3 }],
  }));

  const handleFavoriteSongPress = useCallback((playlist: string, songNumber: number | string) => {
    router.navigate({
      pathname: '/song/[playlist]/[songNumber]',
      params: { playlist, songNumber: String(songNumber), source: 'home_favorite' },
    });
  }, [router]);

  const handleRecentSongPress = useCallback((playlist: string, songNumber: number | string) => {
    router.navigate({
      pathname: '/song/[playlist]/[songNumber]',
      params: { playlist, songNumber: String(songNumber), source: 'home_recent' },
    });
  }, [router]);

  const handlePlaylistPress = useCallback((id: PlaylistId) => {
    trackEvent('view_playlist', { playlist: id });
    router.navigate({
      pathname: '/(tabs)/(home)/playlist/[name]',
      params: { name: id },
    });
  }, [router]);

  const handleShareApp = useCallback(async () => {
    mediumImpact();
    trackEvent('share_app', { songbook: isBurundi ? 'kirundi' : 'kinyarwanda' });
    await shareApp({ isBurundi });
  }, [isBurundi]);

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
        <View style={styles.headerContent}>
        <View style={styles.headerText}>
          <ThemedText style={[styles.greeting, { color: colors.tint }]}>
            {getGreeting()}
          </ThemedText>
          <ThemedText type="title">
            Indirimbo
          </ThemedText>
        </View>
        <AnimatedTouchableOpacity
          onPress={handleShareApp}
          activeOpacity={0.7}
          accessibilityLabel="Share app"
          accessibilityRole="button"
          style={[styles.shareButton, { backgroundColor: colors.tint + '20', borderColor: colors.tint + '40' }, shareButtonStyle]}>
          <Animated.View style={[styles.shareIconWrapper, shareIconStyle]}>
            <IconSymbol name="square.and.arrow.up" size={20} color={colors.tint} weight="semibold" />
          </Animated.View>
          <Animated.Text
            numberOfLines={1}
            style={[styles.shareButtonLabel, { color: colors.tint }, shareLabelStyle]}>
            Share app
          </Animated.Text>
        </AnimatedTouchableOpacity>
        </View>
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
                onPress={() => handlePlaylistPress(id as PlaylistId)}
              />
            ))}
          </ThemedView>

          {hasHydrated && favoriteSongs.length > 0 && (
            <FavoriteSongsRow
              favoriteSongs={favoriteSongs}
              allSongs={allSongsForFavorites}
              onSongPress={handleFavoriteSongPress}
            />
          )}

          {hasHydrated && recentSongs.length > 0 && (
            <RecentSongsList
              recentSongs={recentSongs}
              allSongs={allSongsForFavorites}
              onSongPress={handleRecentSongPress}
            />
          )}
        </View>
      </TabScrollView>
      {updateMode === 'banner-available' && <UpdateAvailableBanner inTabs />}
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
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 1,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 22,
    borderWidth: 1,
    marginLeft: 12,
  },
  shareButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
    overflow: 'hidden',
  },
  shareIconWrapper: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
