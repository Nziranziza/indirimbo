import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";
import { StyleSheet } from "react-native";

interface SongNumberBadgeProps {
  number: number | string;
  size?: "small" | "large";
  style?: any;
}

export function SongNumberBadge({
  number,
  size = "small",
  style,
}: SongNumberBadgeProps) {
  const colors = useColors();
  const badgeSize = size === "large" ? 48 : 40;

  return (
    <ThemedView
      style={[
        styles.badge,
        {
          backgroundColor: colors.tint + "20",
          height: badgeSize,
          minWidth: badgeSize,
          borderRadius: badgeSize / 2,
        },
        style,
      ]}
    >
      <ThemedText
        style={[
          styles.text,
          {
            color: colors.tint,
            fontSize: size === "large" ? 16 : 16,
          },
        ]}
      >
        {number}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
    flexGrow: 0,
  },
  text: {
    fontWeight: "600",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});
