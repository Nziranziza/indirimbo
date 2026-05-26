import { SkeletonBlock } from "@/components/ui/skeleton-block";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";
import { StyleSheet, View } from "react-native";

const BADGE_SIZE = 48;

export function SongScreenSkeleton() {
  const colors = useColors();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <SkeletonBlock
          width={BADGE_SIZE}
          height={BADGE_SIZE}
          borderRadius={BADGE_SIZE / 2}
        />
        <View style={styles.headerCenter}>
          <SkeletonBlock width="40%" height={10} />
          <SkeletonBlock width="75%" height={16} />
        </View>
        <View style={[styles.headerActions, { borderColor: colors.icon + "30" }]}>
          <SkeletonBlock width={22} height={22} borderRadius={11} />
          <SkeletonBlock width={22} height={22} borderRadius={11} />
        </View>
      </View>

      <View style={styles.body}>
        <SkeletonVerseBlock widths={["88%", "94%", "70%", "82%"]} />
        <ThemedView style={[styles.chorusBlock, { backgroundColor: colors.tint + "08" }]}>
          <View style={[styles.chorusBar, { backgroundColor: colors.tint }]} />
          <SkeletonBlock width="20%" height={10} style={styles.chorusLabel} />
          <SkeletonVerseBlock widths={["76%", "90%", "68%"]} compact />
        </ThemedView>
        <SkeletonVerseBlock widths={["84%", "92%", "74%"]} />
      </View>
    </View>
  );
}

interface SkeletonVerseBlockProps {
  readonly widths: readonly string[];
  readonly compact?: boolean;
}

function SkeletonVerseBlock({ widths, compact = false }: SkeletonVerseBlockProps) {
  return (
    <View style={compact ? styles.verseCompact : styles.verseBlock}>
      {widths.map((w, i) => (
        <SkeletonBlock key={i} width={w as `${number}%`} height={14} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerCenter: {
    flex: 1,
    gap: 6,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 24,
  },
  verseBlock: {
    gap: 12,
  },
  verseCompact: {
    gap: 12,
  },
  chorusBlock: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
    position: "relative",
  },
  chorusBar: {
    position: "absolute",
    left: 1,
    top: 0,
    bottom: 0,
    width: 4,
  },
  chorusLabel: {
    marginBottom: 4,
  },
});
