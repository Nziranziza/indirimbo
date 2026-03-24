import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BackButton } from "@/components/ui/back-button";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LyricsContent } from "@/components/ui/lyrics-content";
import { SongHeatmap } from "@/components/ui/song-heatmap";
import { SongNavigationBar } from "@/components/ui/song-navigation-bar";
import { SongNumberBadge } from "@/components/ui/song-number-badge";
import { APP_UNIVERSAL_LINK_URL } from "@/constants/app-links";
import { getPlaylistName } from "@/constants/playlists";
import type { Song } from "@/constants/types";
import { FONT_SIZES } from "@/constants/typography";
import { useSongs } from "@/contexts/songs-context";
import { useColors } from "@/hooks/use-colors";
import { useKeepAwake } from "@/hooks/use-keep-awake";
import {
  addFavorite,
  addRecentSong,
  getFontSize,
  isFavorite,
  removeFavorite,
  type FontSize,
} from "@/utils/storage";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PageHead } from "@/components/page-head";
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
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SongScreen() {
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

  const { agakiza, gushimisha } = useSongs();
  const allSongs: Song[] =
    playlist === "agakiza"
      ? (agakiza as Song[])
      : (gushimisha as Song[]);

  const currentSongNumber = songNumber || "1";
  let currentSong = allSongs.find((s) => String(s.number) === String(currentSongNumber));
  let currentIndex = allSongs.findIndex((s) => String(s.number) === String(currentSongNumber));

  if (!currentSong && allSongs.length > 0) {
    currentSong = allSongs[0];
    currentIndex = 0;
  }

  const lineCount = useMemo(() => {
    if (!currentSong?.body) return 0;
    return currentSong.body.reduce(
      (sum, section) => sum + section.content.split("\n").length,
      0,
    );
  }, [currentSong]);

  const { resetKeepAwake } = useKeepAwake(lineCount);

  useEffect(() => {
    if (currentSong && playlist) {
      isFavorite(playlist, currentSong.number).then(setIsFav);
      getFontSize().then(setFontSize);
    }
  }, [currentSong, playlist]);

  useEffect(() => {
    if (currentSong && playlist) {
      addRecentSong({
        playlist,
        songNumber: currentSong.number,
        songName: currentSong.name,
      });
    }
  }, [currentSong, playlist]);

  const measureSection = (index: number, event: LayoutChangeEvent) => {
    if (currentSong && currentSong.body && currentSong.body[index]) {
      const { height } = event.nativeEvent.layout;
      setSectionPositions((prev) => {
        const newPositions = [...prev];
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

  const handleSectionPress = useCallback((index: number) => {
    resetKeepAwake();
    const position = sectionPositions[index];
    if (position && scrollViewRef.current && contentHeight > 0 && scrollViewHeight > 0) {
      const maxScrollY = Math.max(0, contentHeight - scrollViewHeight);
      const targetY = Math.min(maxScrollY, Math.max(0, position.y - 20));
      animatedScrollY.value = withTiming(targetY, { duration: 400 });
      scrollViewRef.current.scrollTo({ y: targetY, animated: true });
    }
  }, [resetKeepAwake, sectionPositions, contentHeight, scrollViewHeight, animatedScrollY]);

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

  const playlistTitle = getPlaylistName(playlist);

  const handleShare = async () => {
    if (!currentSong || !playlist) return;
    const songUrl = `${APP_UNIVERSAL_LINK_URL}/song/${encodeURIComponent(playlist)}/${encodeURIComponent(String(currentSong.number))}`;
    const shareMessage = `${currentSong.name} • ${playlistTitle} #${currentSong.number}`;
    try {
      await Share.share(
        { message: `${shareMessage}\n${songUrl}`, title: shareMessage },
        { dialogTitle: "Share song" },
      );
    } catch (error) {
      console.error("Error sharing song:", error);
    }
  };

  const fontSizeStyles = useMemo(() => FONT_SIZES[fontSize], [fontSize]);

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
        pathname: `/song/[playlist]/[songNumber]`,
        params: { playlist, songNumber: String(prevSong.number), direction: "back" },
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < allSongs.length - 1) {
      const nextSong = allSongs[currentIndex + 1];
      router.replace({
        pathname: `/song/[playlist]/[songNumber]`,
        params: { playlist, songNumber: String(nextSong.number), direction: "forward" },
      });
    }
  };

  const firstSection = currentSong.body?.find((s) => s.type === "verse" || s.type === "chorus");
  const seoDescription = firstSection
    ? firstSection.content.replace(/\n/g, " ")
    : `${currentSong.name} - ${playlistTitle} hymn #${currentSong.number}`;

  const headerHeight = insets.top + 16 + 48 + 16;

  return (
    <ThemedView style={styles.container}>
      <PageHead
        title={`${currentSong.name} | Indirimbo ya ${currentSong.number} mu ${playlist === "agakiza" ? "Gakiza" : "Gushimisha Imana"}`}
        description={seoDescription}
        canonicalPath={`/song/${playlist}/${currentSong.number}`}
        keywords={`${currentSong.name}, indirimbo ya ${currentSong.number}, ${playlistTitle}, indirimbo, indirimbo zo mugitabo, ${playlist === "agakiza" ? "indirimbo z'agakiza, indirimbo z'abarokore" : "indirimbo zo gushimisha imana"}`}
      />
      <ThemedView style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <BackButton
          color={colors.text}
          style={styles.backButton}
          fallbackHref={{ pathname: '/(tabs)/(home)/playlist/[name]', params: { name: playlist } }}
        />
        <TouchableOpacity
          onPress={() => {
            const fallback = { pathname: '/(tabs)/(home)/playlist/[name]' as const, params: { name: playlist } };
            if (Platform.OS === "web") {
              typeof window !== "undefined" && window.history.length > 1
                ? window.history.back()
                : router.replace(fallback);
            } else {
              router.canGoBack()
                ? router.back()
                : router.replace(fallback);
            }
          }}
          activeOpacity={0.7}
        >
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
            style={[styles.headerActionButton, { borderColor: colors.icon + "30" }]}
            accessibilityLabel="Share song"
            accessibilityRole="button"
            activeOpacity={0.7}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IconSymbol name="square.and.arrow.up" size={22} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={styles.headerActionButton}
            accessibilityLabel={isFav ? "Remove from favorites" : "Add to favorites"}
            accessibilityRole="button"
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
          onContentSizeChange={(_w, h) => setContentHeight(h)}
          onLayout={(e) => setScrollViewHeight(e.nativeEvent.layout.height)}
          showsVerticalScrollIndicator={false}
          bounces={true}
          alwaysBounceVertical={true}
          onScrollBeginDrag={resetKeepAwake}
        >
          {currentSong.body?.filter((item) => item && item.type).map((item, index) => (
            <View
              key={index}
              ref={(ref: View | null) => { sectionRefs.current[index] = ref; }}
              onLayout={(event) => measureSection(index, event)}
            >
              <ThemedView
                style={[
                  item.type === "verse" ? styles.verseContainer : styles.chorusContainer,
                  item.type === "chorus" && { backgroundColor: colors.tint + "08" },
                ]}
              >
                {item.type === "chorus" && (
                  <View style={[styles.chorusBar, { backgroundColor: colors.tint }]} />
                )}
                {item.type === "verse" && item.number && currentSong.body.filter((b) => b.type === "verse" || b.type === "chorus").length > 1 && (
                  <ThemedView style={styles.verseHeader}>
                    <ThemedText style={[styles.verseLabel, { color: colors.icon }]} accessibilityRole="header">
                      Verse {item.number}
                    </ThemedText>
                  </ThemedView>
                )}
                {item.type === "chorus" && (
                  <View style={styles.chorusHeader}>
                    <ThemedText style={[styles.chorusLabel, { color: colors.tint }]} accessibilityRole="header">
                      Chorus
                    </ThemedText>
                  </View>
                )}
                <LyricsContent
                  content={item.content}
                  style={[
                    item.type === "verse" ? styles.verseContent : styles.chorusContent,
                    {
                      fontSize: item.type === "verse" ? fontSizeStyles.verse : fontSizeStyles.chorus,
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

      <SongHeatmap
        sectionPositions={sectionPositions}
        contentHeight={contentHeight}
        scrollViewHeight={scrollViewHeight}
        animatedScrollY={animatedScrollY}
        headerHeight={headerHeight}
        songBody={currentSong.body}
        onSectionPress={handleSectionPress}
      />

      <SongNavigationBar
        currentIndex={currentIndex}
        totalSongs={allSongs.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        bottomInset={insets.bottom}
      />
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
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
    overflow: "visible",
    position: "relative",
  },
  chorusBar: {
    position: "absolute",
    left: 1,
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
    paddingRight: 5,
  },
  chorusContent: {
    fontSize: 18,
    lineHeight: 32,
    textAlign: "left",
    fontWeight: "400",
    letterSpacing: 0.15,
    paddingRight: 5,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
});
