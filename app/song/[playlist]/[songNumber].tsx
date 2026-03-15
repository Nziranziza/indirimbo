import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BackButton } from "@/components/ui/back-button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LyricsContent } from "@/components/ui/lyrics-content";
import { SongNumberBadge } from "@/components/ui/song-number-badge";
import agakizaSongs from "@/constants/agakiza-songs";
import { APP_UNIVERSAL_LINK_URL } from "@/constants/app-links";
import gushimishaSongs from "@/constants/gushimisha-songs";
import { getPlaylistName } from "@/constants/playlists";
import { FONT_SIZES } from "@/constants/typography";
import { useColors } from "@/hooks/use-colors";
import {
  addFavorite,
  addRecentSong,
  getFontSize,
  isFavorite,
  removeFavorite,
  type FontSize,
} from "@/utils/storage";
import * as Haptics from "expo-haptics";
import {
  activateKeepAwakeAsync,
  deactivateKeepAwake,
} from "expo-keep-awake";
import { useLocalSearchParams, useRouter } from "expo-router";
import Head from "expo-router/head";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  Platform,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Song {
  number: number | string; // Can be number (e.g., 18) or string with suffix (e.g., "18a", "18b")
  name: string;
  url: string;
  body: {
    type: "verse" | "chorus";
    number?: number;
    content: string;
  }[];
}

// Animated heatmap bar component
function AnimatedHeatmapBar({
  position,
  contentHeight,
  scrollViewHeight,
  animatedScrollY,
  label,
  colors,
  onPress,
  isFirst,
  isLast,
}: {
  position: {
    y: number;
    height: number;
    type: "verse" | "chorus";
    index: number;
  };
  contentHeight: number;
  scrollViewHeight: number;
  animatedScrollY: SharedValue<number>;
  label: string;
  colors: any;
  onPress: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  // Calculate gap between bars (1px as percentage of contentHeight)
  const gapPercent = contentHeight > 0 ? (1 / contentHeight) * 100 : 0;
  
  const relativeY = (position.y / contentHeight) * 100;
  const relativeHeight = (position.height / contentHeight) * 100;
  
  // Adjust position and height to add gaps between middle bars
  const adjustedTop = !isFirst ? relativeY + gapPercent : relativeY;
  const adjustedHeight = !isFirst && !isLast 
    ? relativeHeight - gapPercent 
    : !isFirst 
    ? relativeHeight - gapPercent / 2
    : !isLast
    ? relativeHeight - gapPercent / 2
    : relativeHeight;

  // Calculate smooth viewport progress based on visibility percentage
  const viewportProgress = useDerivedValue(() => {
    const currentScrollY = animatedScrollY.value;
    const viewportTop = currentScrollY;
    const viewportBottom = currentScrollY + scrollViewHeight;
    const sectionTop = position.y;
    const sectionBottom = position.y + position.height;

    // Calculate how much of the section is visible
    const visibleTop = Math.max(sectionTop, viewportTop);
    const visibleBottom = Math.min(sectionBottom, viewportBottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    // Calculate progress (0 = not visible, 1 = fully visible)
    // Use a percentage of visibility for smoother transitions
    const visibilityRatio = visibleHeight / position.height;

    // Add smooth transition zones - start fading before fully entering viewport
    const sectionCenter = sectionTop + position.height / 2;
    const viewportCenter = viewportTop + scrollViewHeight / 2;
    const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);
    const maxDistance = scrollViewHeight / 2;
    const normalizedDistance = Math.min(1, distanceFromCenter / maxDistance);

    // Combine visibility ratio with distance-based smoothness
    // This creates a smooth fade-in/fade-out effect
    const smoothProgress = Math.max(
      0,
      Math.min(1, visibilityRatio * (1 - normalizedDistance * 0.3))
    );

    return smoothProgress;
  }, [scrollViewHeight, position]);

  const animatedBarStyle = useAnimatedStyle(() => {
    const baseColor = position.type === "chorus" ? colors.tint : colors.icon;
    const activeColor = baseColor + "FF"; // Full opacity when active
    const inactiveColor = baseColor + "80"; // Reduced opacity when inactive

    // Use smooth interpolation with extended range for gradual transitions
    return {
      backgroundColor: interpolateColor(
        viewportProgress.value,
        [0, 0.3, 0.7, 1], // Multiple stops for smoother transition
        [inactiveColor, baseColor + "A0", baseColor + "D0", activeColor]
      ),
    };
  }, [colors, position]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.heatmapBar,
        {
          top: `${adjustedTop}%`,
          height: `${Math.max(adjustedHeight, 3)}%`,
          paddingVertical: 2,
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
      activeOpacity={0.5}
      hitSlop={{ top: 4, bottom: 4, left: 20, right: 4 }}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          animatedBarStyle,
          {
            borderRadius: 0,
            borderTopLeftRadius: isFirst ? 10 : 0,
            borderTopRightRadius: isFirst ? 10 : 0,
            borderBottomLeftRadius: isLast ? 10 : 0,
            borderBottomRightRadius: isLast ? 10 : 0,
          },
        ]}
      />
      {label && relativeHeight > 5 && (
        <ThemedText
          style={[
            styles.heatmapLabel,
            {
              color: position.type === "chorus" ? "#FFFFFF" : colors.background,
              fontSize: 9,
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

// Animated viewport indicator component
function AnimatedViewportIndicator({
  contentHeight,
  scrollViewHeight,
  viewportHeight,
  animatedScrollY,
  colors,
}: {
  contentHeight: number;
  scrollViewHeight: number;
  viewportHeight: number;
  animatedScrollY: SharedValue<number>;
  colors: any;
}) {
  const animatedViewportStyle = useAnimatedStyle(() => {
    const currentScrollY = animatedScrollY.value;
    const viewportTopPercent =
      contentHeight > 0 ? (currentScrollY / contentHeight) * 100 : 0;
    
    // Add small gap at the top when scroll is at the very top (move outside/upward)
    const topOffset = currentScrollY <= 0 ? -2 : 0;

    return {
      top: `${viewportTopPercent}%`,
      marginTop: topOffset,
    };
  }, [contentHeight]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.viewportIndicator,
        {
          height: `${viewportHeight}%`,
          borderColor: colors.tint,
        },
        animatedViewportStyle,
      ]}
    />
  );
}

export default function SongScreen() {
  const keepAwakeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const router = useRouter();
  const { playlist, songNumber } = useLocalSearchParams<{
    playlist: string;
    songNumber: string;
  }>();
  const [isFav, setIsFav] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [sectionPositions, setSectionPositions] = useState<
    { y: number; height: number; type: "verse" | "chorus"; index: number }[]
  >([]);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const animatedScrollY = useSharedValue(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const sectionRefs = useRef<(View | null)[]>([]);
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const allSongs: Song[] =
    playlist === "agakiza"
      ? (agakizaSongs as Song[])
      : (gushimishaSongs as Song[]);

  // Handle both number and string song numbers (e.g., "18a", "18b")
  // Keep as string to preserve suffixes like "18a", "18b"
  const currentSongNumber = songNumber || "1";
  let currentSong = allSongs.find((s) => String(s.number) === String(currentSongNumber));
  let currentIndex = allSongs.findIndex((s) => String(s.number) === String(currentSongNumber));

  // If song not found, use first song
  if (!currentSong && allSongs.length > 0) {
    currentSong = allSongs[0];
    currentIndex = 0;
  }

  // Load favorite status and font size
  useEffect(() => {
    if (currentSong && playlist) {
      isFavorite(playlist, currentSong.number).then(setIsFav);
      getFontSize().then(setFontSize);
    }
  }, [currentSong, playlist]);

  // Track recent song
  useEffect(() => {
    if (currentSong && playlist) {
      addRecentSong({
        playlist,
        songNumber: currentSong.number,
        songName: currentSong.name,
      });
    }
  }, [currentSong, playlist]);

  // Keep screen awake for estimated song duration, reset on interaction
  const estimatedDuration = useMemo(() => {
    if (!currentSong?.body) return 4 * 60_000;
    const lineCount = currentSong.body.reduce(
      (sum, section) => sum + section.content.split("\n").length,
      0
    );
    // ~3.5s per line + 60s buffer, clamped between 2-5 minutes
    const ms = lineCount * 3500 + 60_000;
    return Math.min(Math.max(ms, 2 * 60_000), 5 * 60_000);
  }, [currentSong]);

  const resetKeepAwake = useCallback(() => {
    if (keepAwakeTimer.current) clearTimeout(keepAwakeTimer.current);
    activateKeepAwakeAsync("song-screen");
    keepAwakeTimer.current = setTimeout(() => {
      deactivateKeepAwake("song-screen");
    }, estimatedDuration);
  }, [estimatedDuration]);

  useEffect(() => {
    resetKeepAwake();
    return () => {
      if (keepAwakeTimer.current) clearTimeout(keepAwakeTimer.current);
      deactivateKeepAwake("song-screen");
    };
  }, [resetKeepAwake]);

  // Track section measurements - calculate cumulative Y positions
  const measureSection = (index: number, event: LayoutChangeEvent) => {
    if (currentSong && currentSong.body && currentSong.body[index]) {
      const { height } = event.nativeEvent.layout;
      setSectionPositions((prev) => {
        const newPositions = [...prev];
        // Calculate Y as sum of all previous section heights
        let y = 0;
        for (let i = 0; i < index; i++) {
          if (newPositions[i]) {
            y += newPositions[i].height;
          }
        }
        newPositions[index] = {
          y,
          height,
          type: currentSong.body[index].type,
          index,
        };
        return newPositions;
      });
    }
  };

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      animatedScrollY.value = event.contentOffset.y;
    },
  });

  const handleContentSizeChange = (width: number, height: number) => {
    setContentHeight(height);
  };

  const handleScrollViewLayout = (event: LayoutChangeEvent) => {
    setScrollViewHeight(event.nativeEvent.layout.height);
  };

  const handleSectionPress = (index: number) => {
    resetKeepAwake();
    const position = sectionPositions[index];
    if (position && scrollViewRef.current && contentHeight > 0 && scrollViewHeight > 0) {
      // Calculate maximum scrollable position (content height - scroll view height)
      const maxScrollY = Math.max(0, contentHeight - scrollViewHeight);
      // Calculate target position with offset, but don't exceed the maximum
      const targetY = Math.min(maxScrollY, Math.max(0, position.y - 20));
      // Smoothly animate the scroll position
      animatedScrollY.value = withTiming(targetY, {
        duration: 400,
      });
      // Scroll to the position with smooth animation
      scrollViewRef.current.scrollTo({
        y: targetY,
        animated: true,
      });
    }
  };

  // Move useMemo before early return to satisfy Rules of Hooks

  const handleToggleFavorite = async () => {
    if (!currentSong || !playlist) return;

    try {
      if (isFav) {
        await removeFavorite(playlist, currentSong.number);
        setIsFav(false);
      } else {
        await addFavorite({
          playlist,
          songNumber: currentSong.number,
          songName: currentSong.name,
        });
        setIsFav(true);
      }
      if (process.env.EXPO_OS === "ios") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleShare = async () => {
    if (!currentSong || !playlist) return;

    const songUrl = `${APP_UNIVERSAL_LINK_URL}/song/${encodeURIComponent(
      playlist
    )}/${encodeURIComponent(String(currentSong.number))}`;
    const shareMessage = `${currentSong.name} • ${playlistTitle} #${currentSong.number}`;

    try {
      const shareContent = {
        message: `${shareMessage}\n${songUrl}`,
        title: shareMessage,
      };

      await Share.share(shareContent, {
        dialogTitle: "Share song",
      });
    } catch (error) {
      console.error("Error sharing song:", error);
    }
  };

  const fontSizeStyles = useMemo(() => {
    return FONT_SIZES[fontSize];
  }, [fontSize]);

  if (!currentSong || allSongs.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <BackButton color={colors.text} style={styles.backButton} />
        </ThemedView>
        <ThemedView style={styles.emptyState}>
          <ThemedText>No songs available</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevSong = allSongs[currentIndex - 1];
      router.replace({
        pathname: `/song/${playlist}/${prevSong.number}`,
        params: { direction: 'back' },
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < allSongs.length - 1) {
      const nextSong = allSongs[currentIndex + 1];
      router.replace({
        pathname: `/song/${playlist}/${nextSong.number}`,
        params: { direction: 'forward' },
      });
    }
  };

  const playlistTitle = getPlaylistName(playlist);

  const shareIconName = "square.and.arrow.up";

  const firstSection = currentSong.body?.find(s => s.type === 'verse' || s.type === 'chorus');
  const seoDescription = firstSection
    ? firstSection.content.replace(/\n/g, ' ')
    : `${currentSong.name} - ${playlistTitle} hymn #${currentSong.number}`;

  return (
    <ThemedView style={styles.container}>
      <Head>
        <title>{`${currentSong.name} | Indirimbo ya ${currentSong.number} mu ${playlist === 'agakiza' ? 'Gakiza' : 'Gushimisha Imana'}`}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={`${currentSong.name} | Indirimbo ya ${currentSong.number} mu ${playlist === 'agakiza' ? 'Gakiza' : 'Gushimisha Imana'}`} />
        <meta property="og:description" content={seoDescription} />
        <meta name="keywords" content={`${currentSong.name}, indirimbo ya ${currentSong.number}, ${playlistTitle}, indirimbo, indirimbo zo mugitabo, ${playlist === 'agakiza' ? "indirimbo z'agakiza, indirimbo z'abarokore" : 'indirimbo zo gushimisha imana'}`} />
      </Head>
      <ThemedView style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <BackButton
          color={colors.text}
          style={styles.backButton}
          fallbackHref={`/(tabs)/home/playlist/${playlist}` as any}
        />
        <TouchableOpacity onPress={() => Platform.OS === 'web' ? (window.history.length > 1 ? window.history.back() : router.replace(`/(tabs)/home/playlist/${playlist}` as any)) : router.canGoBack() ? router.back() : router.replace(`/(tabs)/home/playlist/${playlist}` as any)} activeOpacity={0.7}>
          <SongNumberBadge number={currentSong.number} size="large" style={styles.songNumberBadge} />
        </TouchableOpacity>
        <ThemedView style={styles.headerCenter}>
          <ThemedText type="subtitle" style={styles.playlistLabel}>
            {playlistTitle}
          </ThemedText>
          <View style={styles.titleRow}>
            <ThemedText type="title" style={styles.songTitle} numberOfLines={1}>
              {currentSong.name}
            </ThemedText>
          </View>
        </ThemedView>
        <View style={[styles.headerActions, { borderColor: colors.icon + "30" }]}>
          <TouchableOpacity
            onPress={handleShare}
            style={[
              styles.headerActionButton,
              { borderColor: colors.icon + "30" },
            ]}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol name={shareIconName} size={22} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={[
              styles.headerActionButton,
            ]}
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol
              name={isFav ? "heart.fill" : "heart"}
              size={22}
              color={isFav ? "#FF3B30" : colors.icon}
            />
          </TouchableOpacity>
        </View>
      </ThemedView>

      <View style={styles.contentContainer}>
        <Animated.ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={handleContentSizeChange}
          onLayout={handleScrollViewLayout}
          showsVerticalScrollIndicator={false}
          bounces={true}
          alwaysBounceVertical={true}
          onScrollBeginDrag={resetKeepAwake}
        >
          {currentSong.body?.filter(item => item && item.type).map((item, index) => (
            <View
              key={index}
              ref={(ref: View | null) => {
                sectionRefs.current[index] = ref;
              }}
              onLayout={(event) => measureSection(index, event)}
            >
              <ThemedView
                style={[
                  item.type === "verse"
                    ? styles.verseContainer
                    : styles.chorusContainer,
                  item.type === "chorus" && {
                    backgroundColor: colors.tint + "08",
                  },
                ]}
              >
                {item.type === "chorus" && (
                  <View
                    style={[
                      styles.chorusBar,
                      { backgroundColor: colors.tint },
                    ]}
                  />
                )}
                {item.type === "verse" && item.number && currentSong.body.filter(b => b.type === "verse" || b.type === "chorus").length > 1 && (
                  <ThemedView style={styles.verseHeader}>
                    <ThemedText
                      style={[styles.verseLabel, { color: colors.icon }]}
                    >
                      Verse {item.number}
                    </ThemedText>
                  </ThemedView>
                )}
                {item.type === "chorus" && (
                  <View style={styles.chorusHeader}>
                    <ThemedText
                      style={[styles.chorusLabel, { color: colors.tint }]}
                    >
                      Chorus
                    </ThemedText>
                  </View>
                )}
                <LyricsContent
                  content={item.content}
                  style={[
                    item.type === "verse"
                      ? styles.verseContent
                      : styles.chorusContent,
                    {
                      fontSize:
                        item.type === "verse"
                          ? fontSizeStyles.verse
                          : fontSizeStyles.chorus,
                      lineHeight: fontSizeStyles.lineHeight,
                    },
                  ]}
                  tintColor={colors.tint}
                />
              </ThemedView>
            </View>
          )) || []}
        </Animated.ScrollView>
      </View>

      {sectionPositions.length > 0 &&
        contentHeight > 0 &&
        scrollViewHeight > 0 &&
        contentHeight > scrollViewHeight &&
        (() => {
          const viewportHeight = (scrollViewHeight / contentHeight) * 100;

          // Calculate header height: paddingTop + content + paddingBottom
          const headerHeight = insets.top + 16 + 48 + 16;

          // Calculate heatmap height to match exactly the scrollview visible area
          const heatmapHeight = scrollViewHeight;
          
          // Get filtered body to determine last index
          const filteredBodyForHeatmap = currentSong.body?.filter(item => item && item.type) || [];
          const lastIndex = filteredBodyForHeatmap.length - 1;

          return (
            <View
              pointerEvents="box-none"
              style={[
                styles.heatmap,
                {
                  backgroundColor: colors.background + "F0",
                  top: headerHeight, // Start after header
                  height: heatmapHeight, // Match scrollview height exactly
                },
              ]}
            >
              {sectionPositions
                .map((position, index) => {
                  const section = currentSong.body?.[index];
                  if (!section || !position) return null;

                  const label =
                    section.type === "chorus"
                      ? "C"
                      : section.number
                      ? section.number.toString()
                      : "";

                  return (
                  <AnimatedHeatmapBar
                    key={index}
                    position={position}
                    contentHeight={contentHeight}
                    scrollViewHeight={scrollViewHeight}
                    animatedScrollY={animatedScrollY}
                    label={label}
                    colors={colors}
                    onPress={() => handleSectionPress(index)}
                    isFirst={index === 0}
                    isLast={index === lastIndex}
                  />
                );
                })
                .filter(Boolean)}
              {viewportHeight > 0 && viewportHeight < 100 && (
                <AnimatedViewportIndicator
                  contentHeight={contentHeight}
                  scrollViewHeight={scrollViewHeight}
                  viewportHeight={viewportHeight}
                  animatedScrollY={animatedScrollY}
                  colors={colors}
                />
              )}
            </View>
          );
        })()}

      <ThemedView
        style={[
          styles.navigationBar,
          {
            borderTopColor: colors.icon + "20",
            paddingBottom: insets.bottom + 16,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === 0 && styles.navButtonDisabled,
            { backgroundColor: colors.tint + "20" },
          ]}
          onPress={handlePrevious}
          disabled={currentIndex === 0}
          activeOpacity={0.7}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <IconSymbol
            name="arrow.left"
            size={24}
            color={currentIndex === 0 ? colors.icon : colors.tint}
          />
        </TouchableOpacity>

        <ThemedView style={styles.songCounter}>
          <ThemedText style={[styles.counterText, { color: colors.icon }]}>
            {currentIndex + 1} / {allSongs.length}
          </ThemedText>
        </ThemedView>

        <TouchableOpacity
          style={[
            styles.navButton,
            currentIndex === allSongs.length - 1 && styles.navButtonDisabled,
            { backgroundColor: colors.tint + "20" },
          ]}
          onPress={handleNext}
          disabled={currentIndex === allSongs.length - 1}
          activeOpacity={0.7}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <IconSymbol
            name="arrow.right"
            size={24}
            color={
              currentIndex === allSongs.length - 1 ? colors.icon : colors.tint
            }
          />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerActionButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  headerCenter: {
    flex: 1,
  },
  playlistLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  titleRow: {
    flexDirection: "row",
  },
  songTitle: {
    fontSize: 20,
    flex: 1,
    // textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 100,
  },
  heatmap: {
    position: "absolute",
    right: 8,
    top: 0,
    width: 12,
    borderRadius: 6,
    overflow: "visible",
    zIndex: 0,
    opacity: 0.7,
  },
  heatmapBar: {
    position: "absolute",
    left: 0,
    right: 0,
    borderRadius: 3,
    opacity: 0.9,
    minHeight: 8, // Ensure minimum touch target
  },
  heatmapLabel: {
    fontWeight: "700",
    textAlign: "center",
  },
  viewportIndicator: {
    position: "absolute",
    left: -2,
    right: -2,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "transparent",
  },
  songNumberBadge: {
    marginRight: 10,
  },
  verseContainer: {
    marginBottom: 24,
    overflow: "visible",
  },
  chorusContainer: {
    marginTop: -4,
    marginBottom: 20,
    marginLeft: -20,
    marginRight: -20,
    paddingLeft: 20, // Text aligns with verses at 20px from screen edge (bar is at 2px, separate from text)
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
    overflow: "visible",
    position: "relative",
  },
  chorusBar: {
    position: "absolute",
    left: 1, // 1px from screen edge (container starts at -20 relative to scroll, which is 0px from screen, so 1px from container = 1px from screen)
    top: 0,
    bottom: 0,
    width: 4,
  },
  verseHeader: {
    marginBottom: 10,
  },
  chorusHeader: {
    marginBottom: 8,
  },
  verseLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    opacity: 0.5,
  },
  chorusLabel: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  verseContent: {
    fontSize: 17,
    lineHeight: 30,
    textAlign: "left",
    letterSpacing: 0.1,
    paddingRight: 5
  },
  chorusContent: {
    fontSize: 18,
    lineHeight: 32,
    textAlign: "left",
    fontWeight: "400",
    letterSpacing: 0.15,
    paddingRight: 5
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
  },
  emptySubtext: {
    fontSize: 14,
  },
  navigationBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 12,
    zIndex: 10,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  songCounter: {
    paddingHorizontal: 16,
    alignItems: "center",
  },
  counterText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
