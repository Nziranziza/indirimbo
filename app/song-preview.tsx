import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SongHeader } from "@/components/song/song-header";
import { SongReferences } from "@/components/song/song-references";
import { SongSection } from "@/components/song/song-section";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { getPlaylistName } from "@/constants/playlists";
import { LinearGradient } from "expo-linear-gradient";
import { findSong, shouldShowVerseLabels } from "@/constants/song-collections";
import { useColors } from "@/hooks/use-colors";
import { pauseSongAudio } from "@/hooks/use-song-audio";
import { useTranslation } from "@/hooks/use-translation";
import type { ReferenceLink } from "@/utils/reference-links";
import { getFontSize, type FontSize } from "@/utils/storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Read-only song viewer presented as a native modal sheet (see the
// `song-preview` Stack.Screen in app/_layout.tsx). Reached by tapping a
// cross-reference tag in a song's footer; it lets you peek at the referenced
// song without leaving the one you're reading.
export default function SongPreviewScreen() {
  const router = useRouter();
  const { playlist, songNumber } = useLocalSearchParams<{
    playlist: string;
    songNumber: string;
  }>();
  const colors = useColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [fontSize, setFontSize] = useState<FontSize>("medium");

  useEffect(() => {
    getFontSize().then(setFontSize);
  }, []);

  const song = findSong(playlist, songNumber);
  const playlistTitle = getPlaylistName(playlist);

  const showVerseLabel = useMemo(() => shouldShowVerseLabels(song), [song]);

  const handleClose = useCallback(() => {
    // Fall back to home when opened directly (deep link / URL) with no history.
    if (router.canGoBack()) router.back();
    else router.replace("/");
  }, [router]);

  // Top offset for the header/close button: Android presents the modal
  // full-screen, so clear the status bar; iOS presents it below the status bar
  // and just needs a little breathing room.
  const topInset = Platform.OS === "android" ? (StatusBar.currentHeight ?? 0) + 12 : 24;

  // Swap this modal for the referenced song rather than stacking modals.
  const handleReferencePress = useCallback(
    (link: ReferenceLink) => {
      router.replace({
        pathname: "/song-preview",
        params: { playlist: link.playlist, songNumber: link.songNumber },
      });
    },
    [router],
  );

  // Replace the modal with the full song screen underneath the previous song. That
  // previous screen stays mounted, so its recording has to be stopped here — the
  // reader is leaving that song, unlike when this modal merely opened over it.
  const handleOpenFull = useCallback(() => {
    if (!song || !playlist) return;
    pauseSongAudio();
    router.replace({
      pathname: "/song/[playlist]/[songNumber]",
      params: { playlist, songNumber: String(song.number), source: "reference" },
    });
  }, [router, song, playlist]);

  return (
    <ThemedView style={styles.container}>
      <View style={{ paddingTop: topInset }} />
      <TouchableOpacity
        onPress={handleClose}
        style={[
          styles.closeButton,
          { top: topInset, backgroundColor: colors.icon + "33" },
        ]}
        accessibilityRole="button"
        accessibilityLabel={t("songPreview.closeA11y")}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <IconSymbol name="xmark" size={20} color={colors.icon} />
      </TouchableOpacity>

      {!song ? (
        <View style={styles.emptyState}>
          <ThemedText>{t("song.empty")}</ThemedText>
        </View>
      ) : (
        <>
          <SongHeader
            number={song.number}
            playlistTitle={playlistTitle}
            title={song.name}
            right={<View style={styles.headerRightSpacer} />}
          />

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {song.body
              ?.filter((item) => item && item.type)
              .map((item, index) => (
                <SongSection
                  key={`${item.type}-${item.number ?? index}`}
                  item={item}
                  fontSize={fontSize}
                  showVerseLabel={showVerseLabel}
                />
              ))}
            <SongReferences
              songKey={song.key}
              references={song.references}
              onReferencePress={handleReferencePress}
            />
          </ScrollView>

          <LinearGradient
            colors={[colors.background + "00", colors.background]}
            style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}
            pointerEvents="box-none"
          >
            <TouchableOpacity
              onPress={handleOpenFull}
              activeOpacity={0.7}
              style={[styles.openButton, { backgroundColor: colors.background }]}
              accessibilityRole="button"
            >
              {/* Opaque base (bg) + subtle tint overlay so body text never
                  shows through the pill, while staying theme-adaptive. */}
              <View
                style={[styles.openButtonTint, { backgroundColor: colors.icon + "26" }]}
                pointerEvents="none"
              />
              <IconSymbol name="arrow.up.forward" size={15} color={colors.text} />
              <ThemedText style={styles.openButtonLabel}>
                {t("songPreview.openFull")}
              </ThemedText>
            </TouchableOpacity>
          </LinearGradient>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  // Reserves room on the right of the header so the title doesn't run under the
  // floating close button.
  headerRightSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 88,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 48,
  },
  openButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    overflow: "hidden",
  },
  openButtonTint: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  openButtonLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
});
