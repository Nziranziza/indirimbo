import { BottomTabBar, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useEffect, useRef } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// Ignore tiny scroll jitter / bounce so the bar doesn't flicker.
const SCROLL_THRESHOLD = 10;
const ANIM_DURATION = 200;

// Web-only: wraps the stock bottom tab bar so it hides as the user scrolls down
// and reappears on scroll up. It collapses the bar's height (rather than just
// sliding it away) so the screen fills the freed space — no empty band is left
// behind. Scroll is observed via a capture-phase document listener, so no app
// screen needs to know about it; this stays entirely in the web nav layer.
export function AdaptiveWebTabBar(props: BottomTabBarProps) {
  const hidden = useSharedValue(0);
  const barHeight = useSharedValue(0);
  const lastScrollTop = useRef(0);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      // Scroll can fire on an inner element (HTMLElement) or at the document
      // level, where the target is the Document and the position lives on its
      // scrollingElement. Handle both so document-level scrolls aren't dropped.
      const { target } = event;
      let y: number;
      if (target instanceof HTMLElement) {
        y = target.scrollTop;
      } else if (target instanceof Document) {
        y = target.scrollingElement?.scrollTop ?? 0;
      } else {
        return;
      }
      const dy = y - lastScrollTop.current;
      if (y <= 0) {
        hidden.value = withTiming(0, { duration: ANIM_DURATION });
      } else if (dy > SCROLL_THRESHOLD) {
        hidden.value = withTiming(1, { duration: ANIM_DURATION });
      } else if (dy < -SCROLL_THRESHOLD) {
        hidden.value = withTiming(0, { duration: ANIM_DURATION });
      }
      lastScrollTop.current = y;
    };
    // Capture phase: scroll events don't bubble, but they do reach document
    // during capture, so this catches whichever inner list is scrolling.
    document.addEventListener('scroll', handleScroll, true);
    return () => document.removeEventListener('scroll', handleScroll, true);
  }, [hidden]);

  const animatedStyle = useAnimatedStyle(() => {
    // Keep natural height until measured, then collapse toward 0 as it hides.
    if (barHeight.value === 0) return {};
    return { height: (1 - hidden.value) * barHeight.value };
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const measured = event.nativeEvent.layout.height;
    if (measured > 0 && barHeight.value === 0) {
      barHeight.value = measured;
    }
  };

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <View onLayout={handleLayout}>
        <BottomTabBar {...props} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
});
