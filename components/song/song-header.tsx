import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SongNumberBadge } from "@/components/ui/song-number-badge";

interface SongHeaderProps {
  readonly number: number | string;
  readonly playlistTitle: string;
  readonly title: string;
  // Optional tap on the number badge (e.g. go back on the song screen).
  readonly onBadgePress?: () => void;
  // Slots either side of the identity block — back button, actions, close, etc.
  readonly left?: React.ReactNode;
  readonly right?: React.ReactNode;
  readonly titleNumberOfLines?: number;
  readonly containerStyle?: StyleProp<ViewStyle>;
}

// Shared song header: number badge + playlist label + title, with optional
// left/right slots. Used by the full song screen and the song-preview modal so
// both present the same identity block.
export function SongHeader({
  number,
  playlistTitle,
  title,
  onBadgePress,
  left,
  right,
  titleNumberOfLines = 1,
  containerStyle,
}: SongHeaderProps) {
  const badge = (
    <SongNumberBadge number={number} size="large" style={styles.badge} />
  );

  return (
    <ThemedView style={[styles.header, containerStyle]}>
      {left}
      {onBadgePress ? (
        <TouchableOpacity onPress={onBadgePress} activeOpacity={0.7}>
          {badge}
        </TouchableOpacity>
      ) : (
        badge
      )}
      <ThemedView style={styles.center}>
        <ThemedText type="subtitle" style={styles.playlistLabel}>
          {playlistTitle}
        </ThemedText>
        <View style={styles.titleRow}>
          <ThemedText
            type="title"
            style={styles.title}
            numberOfLines={titleNumberOfLines}
            accessibilityRole="header"
          >
            {title}
          </ThemedText>
        </View>
      </ThemedView>
      {right}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 12,
    paddingRight: 20,
    paddingBottom: 8,
  },
  badge: {
    marginRight: 10,
  },
  center: {
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
  title: {
    fontSize: 17,
    lineHeight: 20,
    flex: 1,
  },
});
