import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BackButton } from '@/components/ui/back-button';
import { BackToTopButton } from '@/components/ui/back-to-top-button';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { SongNumberBadge } from '@/components/ui/song-number-badge';
import { useBottomPadding } from '@/hooks/use-bottom-padding';
import { useColors } from '@/hooks/use-colors';
import { useColorScheme } from '@/contexts/theme-context';
import { useTranslation } from '@/hooks/use-translation';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { Song } from '@/constants/types';
import type { IconSymbolName } from '@/components/ui/icon-symbol';

const HEADER_MAX_HEIGHT = 280;
const HEADER_MIN_HEIGHT = 56;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

interface SongListScreenProps {
  title: string;
  iconName: IconSymbolName;
  songs: Song[];
  playlist: string;
  source: 'playlist' | 'category';
  onShare?: () => void | Promise<void>;
  shareAccessibilityLabel?: string;
  // Custom hero icon override (e.g. a bespoke SVG). Falls back to iconName.
  renderIcon?: (size: number, color: string) => React.ReactNode;
}

export function SongListScreen({ title, iconName, songs, playlist, source, onShare, shareAccessibilityLabel, renderIcon }: SongListScreenProps) {
  const router = useRouter();
  const colors = useColors();
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const isDark = colorScheme === 'dark';
  const gradientBase = isDark ? 'transparent' : colors.tint + '00';
  const insets = useSafeAreaInsets();
  const paddingBottom = useBottomPadding({ inTabs: true, hasFab: true });

  const scrollY = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<Song>>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const containerHeight = useRef(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleSongPress = useCallback(
    (songNumber: number | string) => {
      router.navigate({
        pathname: '/song/[playlist]/[songNumber]',
        params: { playlist, songNumber: String(songNumber), source },
      });
    },
    [router, playlist, source]
  );

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

  const handleBackToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const renderSongItem = useCallback(
    ({ item: song }: { item: Song }) => {
      return (
        <TouchableOpacity
          style={[styles.songCard, { borderColor: colors.icon + '20' }]}
          onPress={() => handleSongPress(song.number)}
          accessibilityLabel={t('songList.songCardA11y', { name: song.name, number: song.number })}
          accessibilityRole="button"
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
    },
    [colors, handleSongPress, t]
  );

  const getItemKey = useCallback((item: Song, index: number) => {
    return `${item.number}-${index}`;
  }, []);

  const NAV_HEIGHT = insets.top + 52;

  return (
    <ThemedView style={styles.container}>
      {/* Animated gradient background */}
      <Animated.View pointerEvents="none" style={[styles.gradientWrapper, headerAnimatedStyle]}>
        <LinearGradient
          colors={[gradientBase, colors.tint]}
          start={{ x: 0, y: 1 }}
          end={{ x: 0, y: 0 }}
          style={StyleSheet.absoluteFill}
        />

        <Animated.View
          style={[styles.largeTitleContainer, { paddingTop: NAV_HEIGHT }, largeTitleAnimatedStyle]}>
          <View style={styles.heroIcon}>
            {renderIcon
              ? renderIcon(56, colors.text)
              : <IconSymbol name={iconName} size={56} color={colors.text} />}
          </View>
          <Animated.Text style={[styles.largeTitle, { color: colors.text }]}>
            {title}
          </Animated.Text>
          <Animated.Text style={[styles.subtitle, { color: colors.text, opacity: 0.7 }]}>
            {t('songList.count', { count: songs.length })}
          </Animated.Text>
        </Animated.View>
      </Animated.View>

      {/* Fixed navigation bar */}
      <View style={[styles.navBar, { height: NAV_HEIGHT, paddingTop: insets.top }]}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }, navBarAnimatedStyle]}
        />
        <BackButton color={colors.text} style={styles.backButton} />

        <Animated.View style={[styles.smallTitleContainer, smallTitleAnimatedStyle]}>
          <Animated.Text style={[styles.smallTitle, { color: colors.text }]}>
            {title}
          </Animated.Text>
        </Animated.View>

        {onShare ? (
          <View style={[styles.headerActions, { borderColor: colors.icon + '30' }]}>
            <TouchableOpacity
              onPress={() => { void onShare(); }}
              style={styles.headerActionButton}
              accessibilityLabel={shareAccessibilityLabel ?? 'Share'}
              accessibilityRole="button"
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <IconSymbol name="square.and.arrow.up" size={22} color={colors.text} />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>

      {/* Scrollable Content */}
      <Animated.FlatList
        ref={flatListRef}
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={getItemKey}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.listContent,
          {
            paddingTop: HEADER_MAX_HEIGHT + insets.top + 16,
            paddingBottom,
            gap: 12,
          },
        ]}
        onLayout={(e) => { containerHeight.current = e.nativeEvent.layout.height; }}
        onContentSizeChange={(_, contentHeight) => {
          setIsScrollable(contentHeight - containerHeight.current > 500);
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={false}
        maxToRenderPerBatch={20}
        initialNumToRender={30}
        windowSize={10}
      />

      {isScrollable && <BackToTopButton scrollY={scrollY} onPress={handleBackToTop} />}
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
    overflow: 'hidden',
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  headerActionButton: {
    padding: 8,
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
  songTitle: {
    fontSize: 16,
  },
});
