import { ThemedView } from '@/components/themed-view';
import { BackButton } from '@/components/ui/back-button';
import { useBottomPadding } from '@/hooks/use-bottom-padding';
import { useColors } from '@/hooks/use-colors';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { Href } from 'expo-router';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DEFAULT_HEADER_MAX_HEIGHT = 150;
const HEADER_MIN_HEIGHT = 52;

interface CollapsibleHeaderScrollViewProps {
  title: string;
  subtitle?: string;
  headerContent?: React.ReactNode;
  headerMaxHeight?: number;
  contentGap?: number;
  hasFab?: boolean;
  fallbackHref?: Href;
  children: React.ReactNode;
}

export function CollapsibleHeaderScrollView({
  title,
  subtitle,
  headerContent,
  headerMaxHeight = DEFAULT_HEADER_MAX_HEIGHT,
  contentGap = 12,
  hasFab = false,
  fallbackHref,
  children,
}: CollapsibleHeaderScrollViewProps) {
  const HEADER_SCROLL_DISTANCE = headerMaxHeight - HEADER_MIN_HEIGHT;
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const paddingBottom = useBottomPadding({ hasFab });
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const NAV_HEIGHT = insets.top + HEADER_MIN_HEIGHT;

  const headerAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const height = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [headerMaxHeight + insets.top, HEADER_MIN_HEIGHT + insets.top],
      Extrapolation.CLAMP
    );
    return { height };
  }, [insets.top, headerMaxHeight, HEADER_SCROLL_DISTANCE]);

  const largeTitleAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE - 50],
      [1, 0],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE],
      [0, -20],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [0, HEADER_SCROLL_DISTANCE - 50],
      [1, 0.5],
      Extrapolation.CLAMP
    );
    return { opacity, transform: [{ translateY }, { scale }] };
  }, []);

  const smallTitleAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(
      scrollY.value,
      [HEADER_SCROLL_DISTANCE - 80, HEADER_SCROLL_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  }, []);

  const navBarBgAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(
      scrollY.value,
      [HEADER_SCROLL_DISTANCE - 50, HEADER_SCROLL_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  }, []);

  const borderAnimatedStyle = useAnimatedStyle(() => {
    'worklet';
    const opacity = interpolate(
      scrollY.value,
      [HEADER_SCROLL_DISTANCE - 10, HEADER_SCROLL_DISTANCE],
      [0, 1],
      Extrapolation.CLAMP
    );
    return { opacity };
  }, []);

  return (
    <ThemedView style={styles.container}>
      {/* Collapsible header area */}
      <Animated.View pointerEvents="none" style={[styles.headerBackground, headerAnimatedStyle]}>
        <Animated.View
          style={[
            styles.largeTitleContainer,
            { paddingTop: NAV_HEIGHT },
            largeTitleAnimatedStyle,
          ]}>
          {headerContent ?? (
            <>
              <Animated.Text style={[styles.largeTitle, { color: colors.text }]}>
                {title}
              </Animated.Text>
              {subtitle && (
                <Animated.Text style={[styles.subtitle, { color: colors.text, opacity: 0.7 }]}>
                  {subtitle}
                </Animated.Text>
              )}
            </>
          )}
        </Animated.View>
      </Animated.View>

      {/* Fixed nav bar */}
      <View style={[styles.navBar, { height: NAV_HEIGHT, paddingTop: insets.top }]}>
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
        <BackButton style={styles.backButton} fallbackHref={fallbackHref} />
        <Animated.View style={[styles.smallTitleContainer, smallTitleAnimatedStyle]}>
          <Animated.Text
            style={[styles.smallTitle, { color: colors.text }]}
            numberOfLines={1}>
            {title}
          </Animated.Text>
        </Animated.View>
        <View style={styles.placeholder} />
      </View>

      {/* Scrollable content */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerMaxHeight + insets.top + 16,
            paddingBottom,
            gap: contentGap,
          },
        ]}
        showsVerticalScrollIndicator={false}
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
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  navBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  navBarBorder: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: StyleSheet.hairlineWidth,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  smallTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  largeTitleContainer: {
    paddingHorizontal: 20,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  largeTitle: {
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
});
