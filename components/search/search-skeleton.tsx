import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';

const SKELETON_COUNT = 8;
const PULSE_MIN = 0.4;
const PULSE_MAX = 0.9;
const PULSE_DURATION = 800;
// Static placeholder list — index keys are stable since it never reorders.
const PLACEHOLDERS = Array.from({ length: SKELETON_COUNT });

const SkeletonCard = React.memo(function SkeletonCard({ color }: { readonly color: string }) {
  return (
    <View style={[styles.card, { borderColor: color + '20' }]}>
      <View style={styles.top}>
        <View style={[styles.badge, { backgroundColor: color + '22' }]} />
        <View style={styles.info}>
          <View style={[styles.lineSmall, { backgroundColor: color + '22' }]} />
          <View style={[styles.lineLarge, { backgroundColor: color + '22' }]} />
        </View>
      </View>
      <View style={[styles.snippet, { backgroundColor: color + '14' }]} />
    </View>
  );
});

export function SearchSkeleton() {
  const colors = useColors();
  const { t } = useTranslation();
  // Starts at PULSE_MIN so the cards are visible immediately, animation or not.
  const opacity = useRef(new Animated.Value(PULSE_MIN)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: PULSE_MAX,
          duration: PULSE_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(opacity, {
          toValue: PULSE_MIN,
          duration: PULSE_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{ opacity }}
      accessibilityRole="progressbar"
      accessibilityLabel={t('search.searching')}
    >
      {PLACEHOLDERS.map((_, index) => (
        <SkeletonCard key={index} color={colors.icon} />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    gap: 10,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  info: {
    flex: 1,
    gap: 6,
  },
  lineSmall: {
    width: 70,
    height: 10,
    borderRadius: 4,
  },
  lineLarge: {
    width: '75%',
    height: 14,
    borderRadius: 4,
  },
  snippet: {
    height: 38,
    borderRadius: 8,
  },
});
