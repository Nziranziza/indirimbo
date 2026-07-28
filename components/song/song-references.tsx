import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { SdaFlameIcon } from "@/components/ui/sda-flame-icon";
import type { SongReference } from "@/constants/types";
import { useColors } from "@/hooks/use-colors";
import { expandBookCodes } from "@/utils/book-codes";
import { lightImpact } from "@/utils/haptics";
import { resolveReferenceLink, type ReferenceLink } from "@/utils/reference-links";

interface ReferenceTagProps {
  readonly label: string;
  readonly link: ReferenceLink;
  readonly onPress: (link: ReferenceLink) => void;
}

const ReferenceTag = React.memo(function ReferenceTag({
  label,
  link,
  onPress,
}: ReferenceTagProps) {
  const colors = useColors();
  return (
    <TouchableOpacity
      onPress={() => {
        lightImpact();
        onPress(link);
      }}
      activeOpacity={0.7}
      accessibilityRole="link"
      style={[
        styles.tag,
        { backgroundColor: colors.tint + "14", borderColor: colors.tint + "33" },
      ]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {link.playlist === "sdah-kinyarwanda" ? (
        <SdaFlameIcon size={14} color={colors.tint} />
      ) : (
        <IconSymbol name="book.fill" size={11} color={colors.tint} />
      )}
      <ThemedText style={[styles.tagLabel, { color: colors.tint }]} numberOfLines={1}>
        {label}
      </ThemedText>
      <IconSymbol name="arrow.up.forward" size={11} color={colors.tint} />
    </TouchableOpacity>
  );
});

interface SongReferencesProps {
  readonly songKey?: string;
  readonly references?: readonly SongReference[];
  readonly onReferencePress: (link: ReferenceLink) => void;
}

// Footer at the bottom of a song: its tonalité (key) plus book references.
// References whose book is hosted in-app and whose target song exists render as
// tappable tags (e.g. a Cantiques Kirundi song's "Cantiques Kinyarwanda" ref
// links straight to the Gushimisha song); everything else stays plain text.
export const SongReferences = React.memo(function SongReferences({
  songKey,
  references,
  onReferencePress,
}: SongReferencesProps) {
  const hasContent = Boolean(songKey || (references && references.length > 0));
  if (!hasContent) return null;

  return (
    <View style={styles.container}>
      {songKey && (
        <ThemedText style={styles.entry}>Tonalité : {songKey}</ThemedText>
      )}
      {references?.map((ref, i) => {
        const link = resolveReferenceLink(ref.codes);
        if (link && ref.codes) {
          const label = ref.title
            ? `${ref.title} ${expandBookCodes(ref.codes)}`
            : expandBookCodes(ref.codes);
          return (
            <ReferenceTag
              key={i}
              label={label}
              link={link}
              onPress={onReferencePress}
            />
          );
        }
        return (
          <ThemedText key={i} style={styles.entry}>
            {ref.title ? `${ref.title} ` : ""}
            {ref.codes ? (ref.title ? ref.codes : expandBookCodes(ref.codes)) : ""}
          </ThemedText>
        );
      })}
    </View>
  );
});

// Kept in sync with the footer used by the song screen: pushed to the bottom of
// the scroll content with a comfortable gap above.
const styles = StyleSheet.create({
  container: {
    marginTop: "auto",
    paddingTop: 40,
    alignItems: "flex-start",
  },
  entry: {
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.5,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 2,
    paddingLeft: 6,
    paddingRight: 4,
    borderRadius: 8,
    borderWidth: 1,
    maxWidth: "100%",
  },
  tagLabel: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
    flexShrink: 1,
  },
});
