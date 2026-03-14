import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColors } from '@/hooks/use-colors';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Original header: paddingTop 20 + title(32) + marginBottom 8 + subtitle(24) + paddingBottom 20 = 104
const HEADER_EXPANDED_CONTENT = 104;
const HEADER_COLLAPSED_HEIGHT = 44;
const SCROLL_DISTANCE = HEADER_EXPANDED_CONTENT - HEADER_COLLAPSED_HEIGHT;

interface TabCollapsibleScrollViewProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  contentGap?: number;
  extraBottomPadding?: number;
}

export function TabCollapsibleScrollView({
  title,
  subtitle,
  children,
  contentGap = 12,
  extraBottomPadding = 0,
}: TabCollapsibleScrollViewProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const EXPANDED_HEIGHT = insets.top + HEADER_EXPANDED_CONTENT;
  const COLLAPSED_HEIGHT = insets.top + HEADER_COLLAPSED_HEIGHT;

  // Animate header height
  const headerAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const height = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [EXPANDED_HEIGHT, COLLAPSED_HEIGHT],
      Extrapolation.CLAMP
    );
    return { height };
  });

  // Fade out the large title + subtitle
  const largeTitleAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE * 0.6],
      [1, 0],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, SCROLL_DISTANCE],
      [0, -15],
      Extrapolation.CLAMP
    );
    return { opacity, transform: [{ translateY }] };
  });

  // Fade in the small collapsed title
  const smallTitleAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_DISTANCE * 0.5, SCROLL_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  // Fade in nav bar background + border
  const navBarBgAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_DISTANCE * 0.6, SCROLL_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const borderAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(
      scrollY.value,
      [SCROLL_DISTANCE * 0.85, SCROLL_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  return (
    <ThemedView style={styles.container}>
      {/* Collapsible header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        {/* Large title (original header look) */}
        <Animated.View
          style={[
            styles.largeTitleContainer,
            { paddingTop: insets.top + 20 },
            largeTitleAnimatedStyle,
          ]}>
          <ThemedText type="title" style={styles.title}>
            {title}
          </ThemedText>
          {subtitle && (
            <ThemedText style={styles.subtitle}>
              {subtitle}
            </ThemedText>
          )}
        </Animated.View>

        {/* Collapsed nav bar */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: colors.background },
            navBarBgAnimatedStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.navBarBorder,
            { backgroundColor: colors.icon + '20' },
            borderAnimatedStyle,
          ]}
        />
        <Animated.View
          style={[
            styles.smallTitleContainer,
            { paddingTop: insets.top },
            smallTitleAnimatedStyle,
          ]}>
          <Animated.Text
            style={[styles.smallTitle, { color: colors.text }]}
            numberOfLines={1}>
            {title}
          </Animated.Text>
        </Animated.View>
      </Animated.View>

      {/* Scrollable content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: EXPANDED_HEIGHT,
            paddingBottom: insets.bottom + 90 + extraBottomPadding,
            gap: contentGap,
          },
        ]}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled">
        {children}
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  largeTitleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
    fontSize: 16,
  },
  smallTitleContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 12,
  },
  smallTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  navBarBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
});
