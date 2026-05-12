import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BackButton } from "@/components/ui/back-button";
import { FavoriteSuggestionTooltip } from "@/components/ui/favorite-suggestion-tooltip";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { InAppAlert } from "@/components/ui/in-app-alert";
import { LyricsContextMenu, type LyricsMenuAnchor } from "@/components/ui/lyrics-context-menu";
import { LyricsContent } from "@/components/ui/lyrics-content";
import { SongHeatmap } from "@/components/ui/song-heatmap";
import { SongNavigationBar } from "@/components/ui/song-navigation-bar";
import { SongNumberBadge } from "@/components/ui/song-number-badge";
import { BOOK_CODE_LOOKUP } from "@/constants/book-names";
import { getPlaylistName, getSongTitleLabel } from "@/constants/playlists";
import type { Song } from "@/constants/types";
import { FONT_SIZES } from "@/constants/typography";
import { useEngagement, useBottomChrome } from "@/contexts/engagement-context";
import { useSongs } from "@/contexts/songs-context";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/hooks/use-translation";
import { useFavoriteSuggestion } from "@/hooks/use-favorite-suggestion";
import { useKirundiPinSuggestion } from "@/hooks/use-kirundi-pin-suggestion";
import { useKeepAwake } from "@/hooks/use-keep-awake";
import {
  addFavorite,
  addRecentSong,
  getFontSize,
  isFavorite,
  removeFavorite,
  type FontSize,
} from "@/utils/storage";
import { trackEvent } from "@/utils/analytics";
import { formatSectionForSharing } from "@/utils/format-song-text";
import { heavyImpact, lightImpact } from "@/utils/haptics";
import { shareSong, shareSongSection } from "@/utils/share";
import { APP_UNIVERSAL_LINK_URL } from "@/constants/app-links";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PageHead } from "@/components/page-head";
import { buildSongSeoDescription } from "@/utils/seo-description";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  LayoutChangeEvent,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Matches the SongNavigationBar height: paddingTop(16) + button(48) + paddingBottom(safe area + 16) + border(1).
// Used to position floating overlays (alerts, prompts) above the nav bar.
const NAV_BAR_HEIGHT = 16 + 48 + 16 + 1;

function normalizeBookCodes(codes: string): string {
  return codes
    .replace(/([A-Z])\.\s+([A-Z])/g, "$1.$2")  // "G. B" → "G.B"
    .replace(/([A-Z])\.([A-Z])(?![A-Za-z.])/g, "$1.$2.");  // "T.H" → "T.H.", "M.S" → "M.S." (but not "S.Sgt.")
}

function expandBookCodes(codes: string): string {
  let result = normalizeBookCodes(codes);
  for (const [abbr, full] of Object.entries(BOOK_CODE_LOOKUP)) {
    result = result.replaceAll(abbr, full);
  }
  return result;
}

interface SectionLongPressableProps {
  readonly children: React.ReactNode;
  readonly sectionIndex: number;
  readonly sectionType: "verse" | "chorus";
  readonly onLongPress: (sectionIndex: number, sectionType: "verse" | "chorus") => void;
  readonly viewRef: (ref: View | null) => void;
  readonly onLayout: (event: LayoutChangeEvent) => void;
}

// Native long-press recognizer with movement tolerance — Pressable's JS-based
// detector loses the press to the ScrollView's pan on the slightest finger
// movement, which makes long-press fire unreliably on real devices.
//
// On web we skip the long-press menu entirely: users already have native
// browser text selection, and any pointer-event listeners we attach inside
// the ScrollView would interfere with the browser's native touch-scroll.
function SectionLongPressable({
  children,
  sectionIndex,
  sectionType,
  onLongPress,
  viewRef,
  onLayout,
}: SectionLongPressableProps) {
  const longPress = useMemo(
    () =>
      Gesture.LongPress()
        .minDuration(350)
        .maxDistance(15)
        .onStart(() => {
          runOnJS(onLongPress)(sectionIndex, sectionType);
        }),
    [onLongPress, sectionIndex, sectionType],
  );

  if (Platform.OS === 'web') {
    return (
      <View ref={viewRef} onLayout={onLayout}>
        {children}
      </View>
    );
  }

  return (
    <GestureDetector gesture={longPress}>
      <View
        ref={viewRef}
        onLayout={onLayout}
        accessible={true}
        accessibilityActions={[{ name: 'longpress', label: 'Open section menu' }]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'longpress') {
            onLongPress(sectionIndex, sectionType);
          }
        }}
      >
        {children}
      </View>
    </GestureDetector>
  );
}

export default function SongScreen() {
  const router = useRouter();
  const { playlist, songNumber, source, direction } = useLocalSearchParams<{
    playlist: string;
    songNumber: string;
    source?: string;
    direction?: string;
  }>();
  const [isFav, setIsFav] = useState(false);
  const [fontSize, setFontSize] = useState<FontSize>("medium");
  const [sectionPositions, setSectionPositions] = useState<
    { y: number; height: number; type: "verse" | "chorus"; index: number }[]
  >([]);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contextMenu, setContextMenu] = useState<{
    sectionIndex: number;
    sectionType: "verse" | "chorus";
    anchor: LyricsMenuAnchor;
  } | null>(null);
  const [alertState, setAlertState] = useState<{ icon: "doc.text"; message: string; nonce: number } | null>(null);
  // Default: paddingRight(20) + border(1) + buttonPadding(8) + halfIcon(11) - cardMargin(12) = 28
  const [arrowRightOffset, setArrowRightOffset] = useState(28);
  const animatedScrollY = useSharedValue(0);
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const sectionRefs = useRef<(View | null)[]>([]);
  const favoriteButtonRef = useRef<View>(null);
  const containerRef = useRef<View>(null);
  const colors = useColors();
  const { t } = useTranslation();
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

  const { recordSongView, clearSongContext, notifyFavorited, notifyShareSuccess } = useEngagement();
  useBottomChrome(NAV_BAR_HEIGHT);

  const { showSuggestion, handleDismissSuggestion } = useFavoriteSuggestion({
    playlist,
    songNumber: currentSong?.number,
    isFavorite: isFav,
  });

  const {
    showBanner: showKirundiBanner,
    handleAccept: handleAcceptKirundiPin,
    handleDismiss: handleDismissKirundiPin,
  } = useKirundiPinSuggestion({
    playlist,
    songNumber: currentSong?.number,
  });

  useEffect(() => {
    if (currentSong && playlist) {
      isFavorite(playlist, currentSong.number).then(setIsFav);
      getFontSize().then(setFontSize);
      recordSongView({
        playlist,
        number: currentSong.number,
        name: currentSong.name,
      });
    }
    return () => {
      clearSongContext();
    };
  }, [currentSong, playlist, recordSongView, clearSongContext]);

  useEffect(() => {
    if (currentSong && playlist) {
      addRecentSong({
        playlist,
        songNumber: currentSong.number,
        songName: currentSong.name,
      });
      trackEvent('open_song', {
        playlist,
        song_number: String(currentSong.number),
        song: `${playlist}/${currentSong.number}`,
        song_name: currentSong.name,
        source: direction ? 'prev_next' : (source ?? 'deeplink'),
      });
    }
  }, [currentSong, playlist, source, direction]);

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

  const handleDismissAlert = useCallback(() => setAlertState(null), []);

  const handleToggleFavorite = async () => {
    if (!currentSong || !playlist) return;
    try {
      if (isFav) {
        await removeFavorite(playlist, currentSong.number);
        setIsFav(false);
        trackEvent('toggle_favorite', {
          playlist,
          song_number: String(currentSong.number),
          song: `${playlist}/${currentSong.number}`,
          song_name: currentSong.name,
          action: 'remove',
        });
      } else {
        await addFavorite({
          playlist,
          songNumber: currentSong.number,
          songName: currentSong.name,
        });
        setIsFav(true);
        notifyFavorited();
        trackEvent('toggle_favorite', {
          playlist,
          song_number: String(currentSong.number),
          song: `${playlist}/${currentSong.number}`,
          song_name: currentSong.name,
          action: 'add',
        });
      }
      lightImpact();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const playlistTitle = getPlaylistName(playlist);

  const handleShare = async () => {
    if (!currentSong || !playlist) return;
    try {
      trackEvent('share_song', {
        playlist,
        song_number: String(currentSong.number),
        song: `${playlist}/${currentSong.number}`,
        song_name: currentSong.name,
      });
      const completed = await shareSong({ songName: currentSong.name, playlist, songNumber: currentSong.number, t });
      if (completed) notifyShareSuccess();
    } catch (error) {
      console.error("Error sharing song:", error);
    }
  };

  const handleShareSection = useCallback(
    async (sectionIndex: number, sectionType: "verse" | "chorus") => {
      if (!currentSong || !playlist) return;
      try {
        trackEvent('share_lyrics', {
          playlist,
          song_number: String(currentSong.number),
          song: `${playlist}/${currentSong.number}`,
          song_name: currentSong.name,
          scope: 'section',
          section_type: sectionType,
          section_index: String(sectionIndex),
        });
        const completed = await shareSongSection({ song: currentSong, playlist, sectionIndex, t });
        if (completed) notifyShareSuccess();
      } catch (error) {
        console.error("Error sharing section:", error);
      }
    },
    [currentSong, playlist, notifyShareSuccess, t],
  );

  const triggerSectionLongPress = useCallback(
    (sectionIndex: number, sectionType: "verse" | "chorus") => {
      if (!currentSong) return;
      const sectionView = sectionRefs.current[sectionIndex];
      const containerView = containerRef.current;
      if (!sectionView || !containerView) return;
      // Measure both the section and the overlay's parent (container) in the
      // same coordinate space, then take the difference. This gives an anchor
      // expressed in the overlay's local coordinates regardless of any
      // status-bar / system-bar offsets the platform applies to the React
      // root view — no platform branches needed.
      sectionView.measureInWindow((sectionX, sectionY, width, height) => {
        containerView.measureInWindow((containerX, containerY) => {
          heavyImpact();
          setContextMenu({
            sectionIndex,
            sectionType,
            anchor: {
              x: sectionX - containerX,
              y: sectionY - containerY,
              width,
              height,
            },
          });
          trackEvent('open_lyrics_menu', {
            playlist,
            song_number: String(currentSong.number),
            song: `${playlist}/${currentSong.number}`,
            song_name: currentSong.name,
            section_type: sectionType,
            section_index: String(sectionIndex),
          });
        });
      });
    },
    [currentSong, playlist],
  );

  const handleCopySection = useCallback(
    async (sectionIndex: number, sectionType: "verse" | "chorus") => {
      if (!currentSong || !playlist) return;
      try {
        const body = formatSectionForSharing({ song: currentSong, sectionIndex });
        if (!body) return;
        const url = `${APP_UNIVERSAL_LINK_URL}/song/${encodeURIComponent(playlist)}/${encodeURIComponent(String(currentSong.number))}`;
        await Clipboard.setStringAsync(`${body}\n\n${url}`);
        trackEvent('copy_lyrics', {
          playlist,
          song_number: String(currentSong.number),
          song: `${playlist}/${currentSong.number}`,
          song_name: currentSong.name,
          scope: 'section',
          section_type: sectionType,
          section_index: String(sectionIndex),
        });
        trackEvent('in_app_alert_shown', {
          alert: 'copy_lyrics',
          section_type: sectionType,
          playlist,
          song_number: String(currentSong.number),
        });
        setAlertState({
          icon: 'doc.text',
          message: sectionType === 'chorus'
            ? t('song.copied.chorus')
            : t('song.copied.verse'),
          nonce: Date.now(),
        });
      } catch (error) {
        console.error("Error copying section:", error);
      }
    },
    [currentSong, playlist, t],
  );

  const fontSizeStyles = useMemo(() => FONT_SIZES[fontSize], [fontSize]);

  const renderSectionContent = useCallback((item: Song['body'][number], forPreview = false) => {
    const sections = currentSong?.body?.filter((b) => b.type === 'verse' || b.type === 'chorus') ?? [];
    const showVerseLabel = sections.length > 1;
    return (
      <ThemedView
        style={[
          item.type === "verse" ? styles.verseContainer : styles.chorusContainer,
          item.type === "chorus" && { backgroundColor: colors.tint + "08" },
          forPreview && styles.previewSectionOverride,
          forPreview && item.type === "verse" && styles.previewVersePadding,
        ]}
      >
        {item.type === "chorus" && (
          <View style={[styles.chorusBar, { backgroundColor: colors.tint }]} />
        )}
        {item.type === "verse" && item.number && showVerseLabel && (
          <ThemedView style={styles.verseHeader}>
            <ThemedText style={[styles.verseLabel, { color: colors.icon }]} accessibilityRole="header" aria-level={2}>
              {t('song.verseLabel', { number: item.number })}
            </ThemedText>
          </ThemedView>
        )}
        {item.type === "chorus" && (
          <View style={styles.chorusHeader}>
            <ThemedText style={[styles.chorusLabel, { color: colors.tint }]} accessibilityRole="header" aria-level={2}>
              {t('song.chorusLabel')}
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
    );
  }, [currentSong, colors, fontSizeStyles, t]);

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
              <ThemedText>{t('song.empty')}</ThemedText>
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
      trackEvent('navigate_song', { direction: 'prev', playlist });
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
      trackEvent('navigate_song', { direction: 'next', playlist });
      router.replace({
        pathname: `/song/[playlist]/[songNumber]`,
        params: { playlist, songNumber: String(nextSong.number), direction: "forward" },
      });
    }
  };

  const seoDescription = buildSongSeoDescription(currentSong);

  const hasFooterContent = Boolean(
    currentSong.key || (currentSong.references && currentSong.references.length > 0),
  );

  const headerHeight = insets.top + 8 + 40 + 8;

  return (
    <ThemedView ref={containerRef} style={styles.container}>
      <PageHead
        title={`${currentSong.name} | ${getSongTitleLabel(playlist, currentSong.number)}`}
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
            <ThemedText type="title" style={styles.songTitle} numberOfLines={1} accessibilityRole="header">
              {currentSong.name}
            </ThemedText>
          </View>
        </ThemedView>
        <View style={[styles.headerActions, { borderColor: colors.icon + "30" }]}>
          <TouchableOpacity
            onPress={handleShare}
            style={[styles.headerActionButton, { borderColor: colors.icon + "30" }]}
            accessibilityLabel={t('common.song.shareA11y')}
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
            <SectionLongPressable
              key={`${playlist}-${currentSongNumber}-${item.type}-${item.number ?? index}`}
              sectionIndex={index}
              sectionType={item.type}
              onLongPress={triggerSectionLongPress}
              viewRef={(ref) => { sectionRefs.current[index] = ref; }}
              onLayout={(event) => measureSection(index, event)}
            >
              {renderSectionContent(item)}
            </SectionLongPressable>
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

      {showSuggestion && arrowRightOffset > 0 && (
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

      <LyricsContextMenu
        visible={contextMenu !== null}
        anchor={contextMenu?.anchor ?? null}
        onClose={() => setContextMenu(null)}
        bottomInset={NAV_BAR_HEIGHT + insets.bottom}
        previewPaddingVertical={contextMenu?.sectionType === 'verse' ? 6 : 0}
        previewContent={contextMenu && currentSong.body[contextMenu.sectionIndex]
          ? renderSectionContent(currentSong.body[contextMenu.sectionIndex], true)
          : null}
        items={contextMenu ? [
          {
            key: 'copy',
            label: contextMenu.sectionType === 'chorus' ? t('song.menu.copyChorus') : t('song.menu.copyVerse'),
            icon: 'doc.text',
            onPress: () => { void handleCopySection(contextMenu.sectionIndex, contextMenu.sectionType); },
          },
          {
            key: 'share',
            label: contextMenu.sectionType === 'chorus' ? t('song.menu.shareChorus') : t('song.menu.shareVerse'),
            icon: 'square.and.arrow.up',
            onPress: () => { void handleShareSection(contextMenu.sectionIndex, contextMenu.sectionType); },
          },
        ] : []}
      />

      <InAppAlert
        visible={alertState !== null}
        icon={alertState?.icon ?? 'doc.text'}
        title={alertState?.message ?? ''}
        onDismiss={handleDismissAlert}
        bottomOffset={NAV_BAR_HEIGHT + insets.bottom + 8}
      />

      <InAppAlert
        visible={showKirundiBanner}
        icon="book.fill"
        title={t('common.kirundiPinSuggestion.title')}
        message={t('common.kirundiPinSuggestion.description')}
        onDismiss={handleDismissKirundiPin}
        bottomOffset={NAV_BAR_HEIGHT + insets.bottom + 8}
        duration={0}
        action={{
          label: t('common.kirundiPinSuggestion.acceptCta'),
          onPress: handleAcceptKirundiPin,
        }}
        dismissible
        dismissA11y={t('common.kirundiPinSuggestion.dismissA11y')}
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
  previewSectionOverride: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  previewVersePadding: {
    paddingHorizontal: 20,
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
