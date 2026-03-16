import { ThemedText } from '@/components/themed-text';
import { useColors } from '@/hooks/use-colors';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';

type Colors = ReturnType<typeof useColors>;

interface SectionPosition {
  readonly y: number;
  readonly height: number;
  readonly type: 'verse' | 'chorus';
  readonly index: number;
}

// Animated heatmap bar component
function AnimatedHeatmapBar({
  position,
  contentHeight,
  scrollViewHeight,
  animatedScrollY,
  label,
  colors,
  onPress,
  isFirst,
  isLast,
}: {
  position: SectionPosition;
  contentHeight: number;
  scrollViewHeight: number;
  animatedScrollY: SharedValue<number>;
  label: string;
  colors: Colors;
  onPress: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const gapPercent = contentHeight > 0 ? (1 / contentHeight) * 100 : 0;

  const relativeY = (position.y / contentHeight) * 100;
  const relativeHeight = (position.height / contentHeight) * 100;

  const adjustedTop = !isFirst ? relativeY + gapPercent : relativeY;
  const adjustedHeight = !isFirst && !isLast
    ? relativeHeight - gapPercent
    : !isFirst
    ? relativeHeight - gapPercent / 2
    : !isLast
    ? relativeHeight - gapPercent / 2
    : relativeHeight;

  const viewportProgress = useDerivedValue(() => {
    const currentScrollY = animatedScrollY.value;
    const viewportTop = currentScrollY;
    const viewportBottom = currentScrollY + scrollViewHeight;
    const sectionTop = position.y;
    const sectionBottom = position.y + position.height;

    const visibleTop = Math.max(sectionTop, viewportTop);
    const visibleBottom = Math.min(sectionBottom, viewportBottom);
    const visibleHeight = Math.max(0, visibleBottom - visibleTop);

    const visibilityRatio = visibleHeight / position.height;

    const sectionCenter = sectionTop + position.height / 2;
    const viewportCenter = viewportTop + scrollViewHeight / 2;
    const distanceFromCenter = Math.abs(sectionCenter - viewportCenter);
    const maxDistance = scrollViewHeight / 2;
    const normalizedDistance = Math.min(1, distanceFromCenter / maxDistance);

    const smoothProgress = Math.max(
      0,
      Math.min(1, visibilityRatio * (1 - normalizedDistance * 0.3)),
    );

    return smoothProgress;
  }, [scrollViewHeight, position]);

  const animatedBarStyle = useAnimatedStyle(() => {
    const baseColor = position.type === 'chorus' ? colors.tint : colors.icon;
    const activeColor = baseColor + 'FF';
    const inactiveColor = baseColor + '80';

    return {
      backgroundColor: interpolateColor(
        viewportProgress.value,
        [0, 0.3, 0.7, 1],
        [inactiveColor, baseColor + 'A0', baseColor + 'D0', activeColor],
      ),
    };
  }, [colors, position]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.heatmapBar,
        {
          top: `${adjustedTop}%`,
          height: `${Math.max(adjustedHeight, 3)}%`,
          paddingVertical: 2,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
      activeOpacity={0.5}
      hitSlop={{ top: 4, bottom: 4, left: 20, right: 4 }}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          animatedBarStyle,
          {
            borderRadius: 0,
            borderTopLeftRadius: isFirst ? 10 : 0,
            borderTopRightRadius: isFirst ? 10 : 0,
            borderBottomLeftRadius: isLast ? 10 : 0,
            borderBottomRightRadius: isLast ? 10 : 0,
          },
        ]}
      />
      {label && relativeHeight > 5 && (
        <ThemedText
          style={[
            styles.heatmapLabel,
            {
              color: position.type === 'chorus' ? '#FFFFFF' : colors.background,
              fontSize: 9,
            },
          ]}
          numberOfLines={1}
        >
          {label}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

// Animated viewport indicator component
function AnimatedViewportIndicator({
  contentHeight,
  scrollViewHeight,
  viewportHeight,
  animatedScrollY,
  colors,
}: {
  contentHeight: number;
  scrollViewHeight: number;
  viewportHeight: number;
  animatedScrollY: SharedValue<number>;
  colors: Colors;
}) {
  const animatedViewportStyle = useAnimatedStyle(() => {
    const currentScrollY = animatedScrollY.value;
    const viewportTopPercent =
      contentHeight > 0 ? (currentScrollY / contentHeight) * 100 : 0;

    const topOffset = currentScrollY <= 0 ? -2 : 0;

    return {
      top: `${viewportTopPercent}%`,
      marginTop: topOffset,
    };
  }, [contentHeight]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.viewportIndicator,
        {
          height: `${viewportHeight}%`,
          borderColor: colors.tint,
        },
        animatedViewportStyle,
      ]}
    />
  );
}

interface SongHeatmapProps {
  readonly sectionPositions: readonly SectionPosition[];
  readonly contentHeight: number;
  readonly scrollViewHeight: number;
  readonly animatedScrollY: SharedValue<number>;
  readonly headerHeight: number;
  readonly songBody: readonly { type: 'verse' | 'chorus'; number?: number; content: string }[];
  readonly onSectionPress: (index: number) => void;
}

export function SongHeatmap({
  sectionPositions,
  contentHeight,
  scrollViewHeight,
  animatedScrollY,
  headerHeight,
  songBody,
  onSectionPress,
}: SongHeatmapProps) {
  const colors = useColors();

  if (
    sectionPositions.length === 0 ||
    contentHeight <= 0 ||
    scrollViewHeight <= 0 ||
    contentHeight <= scrollViewHeight
  ) {
    return null;
  }

  const viewportHeight = (scrollViewHeight / contentHeight) * 100;
  const heatmapHeight = scrollViewHeight;
  const lastIndex = songBody.length - 1;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.heatmap,
        {
          backgroundColor: colors.background + 'F0',
          top: headerHeight,
          height: heatmapHeight,
        },
      ]}
    >
      {sectionPositions
        .map((position, index) => {
          const section = songBody[index];
          if (!section || !position) return null;

          const label =
            section.type === 'chorus'
              ? 'C'
              : section.number
              ? section.number.toString()
              : '';

          return (
            <AnimatedHeatmapBar
              key={index}
              position={position}
              contentHeight={contentHeight}
              scrollViewHeight={scrollViewHeight}
              animatedScrollY={animatedScrollY}
              label={label}
              colors={colors}
              onPress={() => onSectionPress(index)}
              isFirst={index === 0}
              isLast={index === lastIndex}
            />
          );
        })
        .filter(Boolean)}
      {viewportHeight > 0 && viewportHeight < 100 && (
        <AnimatedViewportIndicator
          contentHeight={contentHeight}
          scrollViewHeight={scrollViewHeight}
          viewportHeight={viewportHeight}
          animatedScrollY={animatedScrollY}
          colors={colors}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heatmap: {
    position: 'absolute',
    right: 8,
    top: 0,
    width: 12,
    borderRadius: 6,
    overflow: 'visible',
    zIndex: 0,
    opacity: 0.7,
  },
  heatmapBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderRadius: 3,
    opacity: 0.9,
    minHeight: 8,
  },
  heatmapLabel: {
    fontWeight: '700',
    textAlign: 'center',
  },
  viewportIndicator: {
    position: 'absolute',
    left: -2,
    right: -2,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
});
