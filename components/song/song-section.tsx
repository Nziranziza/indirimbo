import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { LyricsContent } from "@/components/ui/lyrics-content";
import type { Song } from "@/constants/types";
import { FONT_SIZES } from "@/constants/typography";
import { useColors } from "@/hooks/use-colors";
import { useTranslation } from "@/hooks/use-translation";
import type { FontSize } from "@/utils/storage";

type Section = Song["body"][number];

interface SongSectionProps {
  readonly item: Section;
  readonly fontSize: FontSize;
  // Whether to show the "Verse N" label — hidden when a song has a single verse.
  readonly showVerseLabel: boolean;
  // Compact styling for the long-press context-menu preview.
  readonly forPreview?: boolean;
}

// Renders one verse or chorus block. Shared by the full song screen and the
// song-preview modal so lyric styling stays in one place.
export function SongSection({
  item,
  fontSize,
  showVerseLabel,
  forPreview = false,
}: SongSectionProps) {
  const colors = useColors();
  const { t } = useTranslation();
  const fontSizeStyles = FONT_SIZES[fontSize];

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
          <ThemedText
            style={[styles.verseLabel, { color: colors.icon }]}
            accessibilityRole="header"
            aria-level={2}
          >
            {t("song.verseLabel", { number: item.number })}
          </ThemedText>
        </ThemedView>
      )}
      {item.type === "chorus" && (
        <View style={styles.chorusHeader}>
          <ThemedText
            style={[styles.chorusLabel, { color: colors.tint }]}
            accessibilityRole="header"
            aria-level={2}
          >
            {t("song.chorusLabel")}
          </ThemedText>
        </View>
      )}
      <LyricsContent
        content={item.content}
        style={[
          item.type === "verse" ? styles.verseContent : styles.chorusContent,
          {
            fontSize:
              item.type === "verse" ? fontSizeStyles.verse : fontSizeStyles.chorus,
            lineHeight: fontSizeStyles.lineHeight,
          },
        ]}
        tintColor={colors.tint}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
  previewSectionOverride: {
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  },
  previewVersePadding: {
    paddingHorizontal: 20,
  },
});
