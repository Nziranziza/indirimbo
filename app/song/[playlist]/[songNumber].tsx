import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BackButton } from "@/components/ui/back-button";
import { FavoriteSuggestionTooltip } from "@/components/ui/favorite-suggestion-tooltip";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { InAppAlert } from "@/components/ui/in-app-alert";
import { LyricsContextMenu, type LyricsMenuAnchor } from "@/components/ui/lyrics-context-menu";
import { SongHeader } from "@/components/song/song-header";
import { SongSection } from "@/components/song/song-section";
import { SongReferences } from "@/components/song/song-references";
import { SongEndCta } from "@/components/song-end-cta";
import { SongHeatmap } from "@/components/ui/song-heatmap";
import { SongNavigationBar } from "@/components/ui/song-navigation-bar";
import { SONGS_BY_PLAYLIST, countVerses, shouldShowVerseLabels } from "@/constants/song-collections";
import { getPlaylistOgImageUrl } from "@/constants/og-images";
import { getPlaylistName, getSongTitleLabel } from "@/constants/playlists";
import type { Song } from "@/constants/types";
import type { ReferenceLink } from "@/utils/reference-links";
import { useEngagement, useBottomChrome } from "@/contexts/engagement-context";
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
import { getSongAudioUrl, playsFullHymn } from "@/utils/song-audio";
import { APP_UNIVERSAL_LINK_URL } from "@/constants/app-links";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PageHead } from "@/components/page-head";
import { buildSongSeoDescription } from "@/utils/seo-description";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
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

// Prerender one static HTML page per song (all playlists) so Expo emits real
// content for every /song/<playlist>/<number> route rather than a single shell.
export function generateStaticParams(): { playlist: string; songNumber: string }[] {
  return Object.entries(SONGS_BY_PLAYLIST).flatMap(([playlist, songs]) =>
    songs.map((song) => ({ playlist, songNumber: String(song.number) })),
  );
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
  const { playlist, songNumber, source, direction, resume } = useLocalSearchParams<{
    playlist: string;
    songNumber: string;
    source?: string;
    direction?: string;
    resume?: string;
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

  const allSongs: Song[] = useMemo(
    () => SONGS_BY_PLAYLIST[playlist ?? ''] ?? [],
    [playlist],
  );

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

  const showVerseLabel = useMemo(() => shouldShowVerseLabels(currentSong), [currentSong]);

  const handleReferencePress = useCallback((link: ReferenceLink) => {
    router.push({
      pathname: '/song-preview',
      params: { playlist: link.playlist, songNumber: link.songNumber },
    });
  }, [router]);

  const handleBadgePress = useCallback(() => {
    const fallback = { pathname: '/(tabs)/(home)/playlist/[name]' as const, params: { name: playlist } };
    if (Platform.OS === 'web') {
      router.replace(fallback);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallback);
    }
  }, [router, playlist]);

  const measureFavoriteButton = useCallback(() => {
    const buttonView = favoriteButtonRef.current;
    const containerView = containerRef.current;
    if (!buttonView || !containerView) return;
    // Measure the heart's center against the container's right edge — not the
    // window's. On web the content column is inset from the viewport (sidebar +
    // right column), so window-relative math pushes the arrow far off target.
    buttonView.measureInWindow((x, _y, width) => {
      if (x <= 0) return;
      containerView.measureInWindow((containerX, _cy, containerWidth) => {
        const containerRightEdge = containerX + containerWidth;
        const buttonCenterFromRight = containerRightEdge - (x + width / 2);
        const cardRightMargin = 12;
        setArrowRightOffset(buttonCenterFromRight - cardRightMargin);
      });
    });
  }, []);

  // Playback rolls on through the collection: when a recording has played its
  // passes, the next song that has one takes over, screen and all. Songs without a
  // recording are skipped rather than ending the run, and it stops at the last one.
  const handleAudioCompleted = useCallback(() => {
    for (let index = currentIndex + 1; index < allSongs.length; index++) {
      const candidate = allSongs[index];
      if (!getSongAudioUrl(playlist, candidate.number)) continue;

      setSectionPositions([]);
      trackEvent('navigate_song', { direction: 'auto', playlist });
      router.replace({
        pathname: `/song/[playlist]/[songNumber]`,
        params: {
          playlist,
          songNumber: String(candidate.number),
          direction: 'forward',
          resume: '1',
        },
      });
      return;
    }
  }, [allSongs, currentIndex, playlist, router]);

  if (!currentSong || allSongs.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <BackButton color={colors.text}  />
        </ThemedView>
        <View style={styles.contentContainer}>
          <ThemedView style={styles.emptyState}>
            <ThemedText>{t('song.empty')}</ThemedText>
          </ThemedView>
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

  const audioUrl = getSongAudioUrl(playlist, currentSong.number);
  // A single verse of melody repeats until the verses are done; a recording of the
  // whole hymn already contains them, so it plays once.
  const audioRepeatCount = playsFullHymn(playlist, currentSong.number)
    ? 1
    : countVerses(currentSong);

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
      <SongHeader
        containerStyle={{ paddingTop: insets.top + 8 }}
        number={currentSong.number}
        playlistTitle={playlistTitle}
        title={currentSong.name}
        onBadgePress={handleBadgePress}
        left={
          <BackButton
            color={colors.text}
            style={styles.backButton}
            fallbackHref={{ pathname: '/(tabs)/(home)/playlist/[name]', params: { name: playlist } }}
          />
        }
        right={
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
              ref={favoriteButtonRef}
              onLayout={measureFavoriteButton}
              onPress={handleToggleFavorite}
              style={styles.headerActionButton}
              accessibilityLabel={isFav ? t('common.song.favoriteRemoveA11y') : t('common.song.favoriteAddA11y')}
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
        }
      />

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
              <SongSection item={item} fontSize={fontSize} showVerseLabel={showVerseLabel} />
            </SectionLongPressable>
          )) || []}
          <SongReferences
            songKey={currentSong.key}
            references={currentSong.references}
            onReferencePress={handleReferencePress}
          />
          <SongEndCta />
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
        audioUrl={audioUrl}
        audioRepeatCount={audioRepeatCount}
        audioTitle={`${currentSong.number}. ${currentSong.name}`}
        audioArtist={getPlaylistName(playlist)}
        audioArtworkUrl={getPlaylistOgImageUrl(playlist)}
        audioStartPlaying={resume === '1'}
        onAudioCompleted={handleAudioCompleted}
      />

      <LyricsContextMenu
        visible={contextMenu !== null}
        anchor={contextMenu?.anchor ?? null}
        onClose={() => setContextMenu(null)}
        bottomInset={NAV_BAR_HEIGHT + insets.bottom}
        previewPaddingVertical={contextMenu?.sectionType === 'verse' ? 6 : 0}
        previewContent={contextMenu && currentSong.body[contextMenu.sectionIndex]
          ? (
            <SongSection
              item={currentSong.body[contextMenu.sectionIndex]}
              fontSize={fontSize}
              showVerseLabel={showVerseLabel}
              forPreview
            />
          )
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
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 16,
  },
});
