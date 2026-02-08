import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BackButton } from '@/components/ui/back-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SearchInput } from '@/components/ui/search-input';
import { SongNumberBadge } from '@/components/ui/song-number-badge';
import agakizaSongs from '@/constants/agakiza-songs';
import gushimishaSongs from '@/constants/gushimisha-songs';
import { getPlaylistName } from '@/constants/playlists';
import { useColors } from '@/hooks/use-colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import Fuse from 'fuse.js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

// Header configuration
const HEADER_MAX_HEIGHT = 280;
const HEADER_MIN_HEIGHT = 56;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function PlaylistScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name: string | string[] }>();
  const pathname = usePathname();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom;

  // Scroll tracking with Reanimated
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Get name from pathname or params
  const name = useMemo(() => {
    if (pathname) {
      const pathParts = pathname.split('/').filter(Boolean);
      const playlistIndex = pathParts.indexOf('playlist');
      if (playlistIndex !== -1 && pathParts[playlistIndex + 1]) {
        const playlistName = pathParts[playlistIndex + 1];
        if (playlistName && playlistName !== '[name]' && !playlistName.startsWith('[')) {
          return playlistName;
        }
      }
    }
    const paramName = params.name;
    if (paramName) {
      if (typeof paramName === 'string' && paramName !== '[name]' && !paramName.startsWith('[')) {
        return paramName;
      }
      if (Array.isArray(paramName) && paramName.length > 0) {
        const firstParam = paramName[0];
        if (firstParam && firstParam !== '[name]' && !firstParam.startsWith('[')) {
          return firstParam;
        }
      }
    }
    return 'agakiza';
  }, [params.name, pathname]);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const debounceTimerRef = useRef<number | null>(null);

  const songs: Song[] = useMemo(() => {
    return name === 'agakiza'
      ? (agakizaSongs as Song[])
      : (gushimishaSongs as Song[]);
  }, [name]);

  const playlistTitle = useMemo(() => {
    return getPlaylistName(name);
  }, [name]);

  // Debounce search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 200);
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  // Fuzzy search
  const fuse = useMemo(() => new Fuse(songs, {
    keys: [
      { name: 'number', weight: 0.3 },
      { name: 'name', weight: 0.5 },
      { name: 'body.content', weight: 0.2 }
    ],
    threshold: 0.4,
    ignoreLocation: true,
  }), [songs]);

  const filteredSongs = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return songs;
    return fuse.search(debouncedSearchQuery.trim()).map(r => r.item);
  }, [songs, debouncedSearchQuery, fuse]);

  const handleSongPress = useCallback((songNumber: number | string) => {
    router.push({
      pathname: '/song',
      params: { playlist: name, songNumber: String(songNumber) },
    });
  }, [router, name]);

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const height = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [HEADER_MAX_HEIGHT + insets.top, HEADER_MIN_HEIGHT + insets.top],
      Extrapolation.CLAMP
    );
    return { height };
  }, [insets.top]);

  const largeTitleAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE - 50],
      [1, 0],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [0, -20],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE - 50],
      [1, 0.5],
      Extrapolation.CLAMP
    );
    return { opacity, transform: [{ translateY }, { scale }] };
  }, []);

  const smallTitleAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(
      scrollY.value,
      [HEADER_SCROLL_DISTANCE - 80, HEADER_SCROLL_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  }, []);

  const navBarAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(
      scrollY.value,
      [HEADER_SCROLL_DISTANCE - 50, HEADER_SCROLL_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  }, []);

  // Song item renderer
  const renderSongItem = useCallback(({ item: song }: { item: Song }) => {
    return (
      <TouchableOpacity
        style={[styles.songCard, { borderColor: colors.icon + '20' }]}
        onPress={() => handleSongPress(song.number)}
        activeOpacity={0.7}>
        <SongNumberBadge number={song.number} />
        <ThemedView style={styles.songInfo}>
          <ThemedText type="defaultSemiBold" style={styles.songTitle} numberOfLines={2}>
            {song.name}
          </ThemedText>
        </ThemedView>
        <IconSymbol name="arrow.right" size={20} color={colors.icon} />
      </TouchableOpacity>
    );
  }, [colors, handleSongPress]);

  const getItemKey = useCallback((item: Song, index: number) => {
    return `${item.number}-${index}`;
  }, []);

  const renderEmptyState = useCallback(() => {
    if (filteredSongs.length === 0 && debouncedSearchQuery.trim()) {
      return (
        <ThemedView style={styles.emptyState}>
          <IconSymbol name="magnifyingglass" size={48} color={colors.icon} />
          <ThemedText style={styles.emptyText}>No songs found</ThemedText>
          <ThemedText style={[styles.emptySubtext, { opacity: 0.6 }]}>
            Try a different search term
          </ThemedText>
        </ThemedView>
      );
    }
    return null;
  }, [filteredSongs.length, debouncedSearchQuery, colors.icon]);


  // Calculate fixed nav height
  const NAV_HEIGHT = insets.top + 52;

  return (
    <ThemedView style={styles.container}>
      {/* Animated gradient background */}
      <Animated.View style={[styles.gradientWrapper, headerAnimatedStyle]}>
        {/* Vertical gradient - background to light tint */}
        <LinearGradient
          colors={['transparent', colors.tint]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Large title area - this collapses */}
        <Animated.View style={[styles.largeTitleContainer, { paddingTop: NAV_HEIGHT }, largeTitleAnimatedStyle]}>
          <View style={styles.heroIcon}>
            <IconSymbol name={name === 'agakiza' ? 'music.note.list' : 'music.mic'} size={56} color={colors.text} />
          </View>
          <Animated.Text style={[styles.largeTitle, { color: colors.text }]}>
            {playlistTitle}
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, { color: colors.text, opacity: 0.7 }]}>
            {songs.length} songs
          </Animated.Text>
        </Animated.View>
      </Animated.View>

      {/* Fixed navigation bar - always on top */}
      <View style={[styles.navBar, { height: NAV_HEIGHT, paddingTop: insets.top }]}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }, navBarAnimatedStyle]} />
        <BackButton color={colors.text} style={styles.backButton} />

        <Animated.View style={[styles.smallTitleContainer, smallTitleAnimatedStyle]}>
          <Animated.Text style={[styles.smallTitle, { color: colors.text }]}>
            {playlistTitle}
          </Animated.Text>
        </Animated.View>

        <View style={styles.placeholder} />
      </View>

      {/* Scrollable Content */}
      <Animated.FlatList
        data={filteredSongs}
        renderItem={renderSongItem}
        keyExtractor={getItemKey}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: HEADER_MAX_HEIGHT + insets.top + 16,
            paddingBottom: bottomPadding + 90,
          }
        ]}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <SearchInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by title, content, or number..."
            />
          </View>
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        maxToRenderPerBatch={20}
        initialNumToRender={30}
        windowSize={10}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  smallTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  largeTitleContainer: {
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroIcon: {
    alignItems: 'center',
    marginBottom: 16,
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    marginTop: 8,
    fontWeight: '400',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  listHeader: {
    marginBottom: 16,
  },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
  },
});
