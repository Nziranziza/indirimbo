import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BackButton } from "@/components/ui/back-button";
import { EngagementPrompt } from "@/components/ui/engagement-prompt";
import { FavoriteSuggestionTooltip } from "@/components/ui/favorite-suggestion-tooltip";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { LyricsContent } from "@/components/ui/lyrics-content";
import { SongHeatmap } from "@/components/ui/song-heatmap";
import { SongNavigationBar } from "@/components/ui/song-navigation-bar";
import { SongNumberBadge } from "@/components/ui/song-number-badge";
import { BOOK_CODE_LOOKUP } from "@/constants/book-names";
import { getPlaylistName } from "@/constants/playlists";
import type { Song } from "@/constants/types";
import { FONT_SIZES } from "@/constants/typography";
import { useSongs } from "@/contexts/songs-context";
import { useColors } from "@/hooks/use-colors";
import { useEngagement } from "@/hooks/use-engagement";
import { useFavoriteSuggestion } from "@/hooks/use-favorite-suggestion";
import { useKeepAwake } from "@/hooks/use-keep-awake";
import {
  addFavorite,
  addRecentSong,
  getFontSize,
  isFavorite,
  removeFavorite,
  type FontSize,
} from "@/utils/storage";
import { shareSong } from "@/utils/share";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PageHead } from "@/components/page-head";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  LayoutChangeEvent,
  Platform,
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

function normalizeBookCodes(codes: string): string {
  return codes
    .replace(/([A-Z])\.\s+([A-Z])/g, "$1.$2")  // "G. B" → "G.B"
    .replace(/([A-Z])\.([A-Z])(?!\.)/g, "$1.$2.");  // "T.H" → "T.H.", "M.S" → "M.S."
}

function expandBookCodes(codes: string): string {
  // Expand "r NUMBER" cross-references (Kirundi songs referencing Cantiques Kinyarwanda)
  const crossRef = codes.match(/^r\s+(\d+)$/);
  if (crossRef) {
    return `Cantiques Kinyarwanda ${crossRef[1]}`;
  }
  let result = normalizeBookCodes(codes);
  for (const [abbr, full] of Object.entries(BOOK_CODE_LOOKUP)) {
    result = result.replaceAll(abbr, full);
  }
  return result;
}

export default function SongScreen() {
  const router = useRouter();
  const { playlist, songNumber } = useLocalSearchParams<{
    playlist: string;
    songNumber: string;
  }>();
  const [isFav, setIsFav] = useState(false);
  const [didFavoriteThisSession, setDidFavoriteThisSession] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [sectionPositions, setSectionPositions] = useState<
    { y: number; height: number; type: "verse" | "chorus"; index: number }[]
  >([]);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  // Default: paddingRight(20) + border(1) + buttonPadding(8) + halfIcon(11) - cardMargin(12) = 28
  const [arrowRightOffset, setArrowRightOffset] = useState(28);
  const animatedScrollY = useSharedValue(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const sectionRefs = useRef<(View | null)[]>([]);
  const favoriteButtonRef = useRef<View>(null);
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const { agakiza, gushimisha, cantiquesKirundi } = useSongs();
  const songsByPlaylist: Record<string, Song[]> = useMemo(() => ({
    agakiza,
    gushimisha,
    'cantiques-kirundi': cantiquesKirundi,
  }), [agakiza, gushimisha, cantiquesKirundi]);
  const allSongs: Song[] = songsByPlaylist[playlist ?? ''] ?? [];

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

  const { prompt, showPrompt, handleAccept, handleDismiss } = useEngagement({
    currentSongName: currentSong?.name,
    currentSongPlaylist: playlist,
    currentSongNumber: currentSong?.number,
    didFavoriteThisSession,
  });

  const { showSuggestion, handleDismissSuggestion } = useFavoriteSuggestion({
    playlist,
    songNumber: currentSong?.number,
    isFavorite: isFav,
  });

  useEffect(() => {
    if (currentSong && playlist) {
      isFavorite(playlist, currentSong.number).then(setIsFav);
      getFontSize().then(setFontSize);
      setDidFavoriteThisSession(false);
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
        setDidFavoriteThisSession(true);
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
    try {
      await shareSong({ songName: currentSong.name, playlist, songNumber: currentSong.number });
    } catch (error) {
      console.error("Error sharing song:", error);
    }
  };

  const fontSizeStyles = useMemo(() => FONT_SIZES[fontSize], [fontSize]);

  const measureFavoriteButton = useCallback(() => {
    favoriteButtonRef.current?.measureInWindow((x, _y, width) => {
      if (x > 0) {
        const screenWidth = Dimensions.get('window').width;
        const buttonCenterFromRight = screenWidth - (x + width / 2);
        const cardRightMargin = 12;
        setArrowRightOffset(buttonCenterFromRight - cardRightMargin);
      }
    });
  }, []);

  if (!currentSong || allSongs.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <BackButton color={colors.text}  />
        </ThemedView>
        <View style={styles.contentContainer}>
          <Animated.ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <ThemedView style={styles.emptyState}>
              <ThemedText>No songs available</ThemedText>
            </ThemedView>
          </Animated.ScrollView>
        </View>
      </ThemedView>
    );
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevSong = allSongs[currentIndex - 1];
      setSectionPositions([]);
      router.replace({
        pathname: `/song/[playlist]/[songNumber]`,
        params: { playlist, songNumber: String(prevSong.number), direction: "back" },
      });
    }
  };

  const handleNext = () => {
    if (currentIndex < allSongs.length - 1) {
      const nextSong = allSongs[currentIndex + 1];
      setSectionPositions([]);
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

  const hasFooterContent = Boolean(
    currentSong.key || (currentSong.references && currentSong.references.length > 0),
  );

  const headerHeight = insets.top + 8 + 40 + 8;

  return (
    <ThemedView style={styles.container}>
      <PageHead
        title={`${currentSong.name} | Indirimbo ya ${currentSong.number} ${playlist === 'cantiques-kirundi' ? 'muri' : 'mu'} ${playlistTitle}`}
        description={seoDescription}
        canonicalPath={`/song/${playlist}/${currentSong.number}`}
        keywords={`${currentSong.name}, indirimbo ya ${currentSong.number}, ${playlistTitle}, ${playlist === 'cantiques-kirundi' ? 'cantiques kirundi, indirimbo zo guhimbaza imana, burundian hymns' : "indirimbo, indirimbo zo mugitabo, rwandan hymns"}, worship songs`}
        playlist={playlist}
      />
      <ThemedView style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <BackButton
          color={colors.text}
          style={styles.backButton}
          fallbackHref={{ pathname: '/(tabs)/(home)/playlist/[name]', params: { name: playlist } }}
        />
        <TouchableOpacity
          onPress={() => {
            const fallback = { pathname: '/(tabs)/(home)/playlist/[name]' as const, params: { name: playlist } };
            if (Platform.OS === 'web') {
              router.replace(fallback);
            } else {
              if (router.canGoBack()) { router.back(); } else { router.replace(fallback); }
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
            ref={favoriteButtonRef as React.RefObject<View>}
            onLayout={measureFavoriteButton}
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
          contentContainerStyle={[styles.scrollContent, !hasFooterContent && styles.scrollContentNoFooter]}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={(_w, h) => setContentHeight(h)}
          onLayout={(e) => setScrollViewHeight(e.nativeEvent.layout.height)}
          showsVerticalScrollIndicator={false}
          bounces={true}
          alwaysBounceVertical={true}
          onScrollBeginDrag={resetKeepAwake}
        >
          <View style={{ height: 8 }}/>
          {currentSong.body?.filter((item) => item && item.type).map((item, index) => (
            <View
              key={`${playlist}-${currentSongNumber}-${item.type}-${item.number ?? index}`}
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
          {hasFooterContent && (
            <View style={styles.referencesContainer}>
              {currentSong.key && (
                <ThemedText style={styles.referenceEntry}>
                  Tonalité : {currentSong.key}
                </ThemedText>
              )}
              {currentSong.references?.map((ref, i) => (
                <ThemedText key={i} style={styles.referenceEntry}>
                  {ref.title ? `${ref.title} ` : ''}{ref.codes ? (ref.title ? ref.codes : expandBookCodes(ref.codes)) : ''}
                </ThemedText>
              ))}
            </View>
          )}
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

      {showPrompt && prompt ? (
        <EngagementPrompt
          type={prompt.type}
          songName={prompt.songName}
          bottomInset={insets.bottom}
          onAccept={handleAccept}
          onDismiss={handleDismiss}
        />
      ) : showSuggestion && arrowRightOffset > 0 && (
        <FavoriteSuggestionTooltip
          headerHeight={headerHeight}
          arrowRightOffset={arrowRightOffset}
          onDismiss={handleDismissSuggestion}
          onAddToFavorites={handleToggleFavorite}
        />
      )}

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
    paddingLeft: 12,
    paddingRight: 20,
    paddingBottom: 8,
  },
  backButton: {
    marginLeft: -4
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
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 14,
    marginBottom: 2,
    opacity: 0.7,
  },
  titleRow: {
    flexDirection: "row",
  },
  songTitle: {
    fontSize: 17,
    lineHeight: 20,
    flex: 1,
  },
  referencesContainer: {
    marginTop: "auto",
    paddingTop: 40,
  },
  referenceEntry: {
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.5,
  },
  contentContainer: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 0,
    paddingBottom: 20,
  },
  scrollContentNoFooter: {
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
