// Reanimated's `sharedValue.value = ...` is the documented mutation API; React Compiler's
// static analysis flags it because it can't see Reanimated's escape hatch.
/* eslint-disable react-hooks/immutability */
import { useEngagement, useFabLift } from '@/contexts/engagement-context';
import { useSongbookPreference } from '@/contexts/songbook-preference-context';
import { useColors } from '@/hooks/use-colors';
import { useFabBottom } from '@/hooks/use-fab-bottom';
import { useTranslation } from '@/hooks/use-translation';
import { mediumImpact } from '@/utils/haptics';
import { shareApp } from '@/utils/share';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { IconSymbol } from './icon-symbol';

const ICON_SIZE = 56;
const EXPANDED_EXTRA = 100;
const COLLAPSE_DELAY = 3000;

export function FloatingShareButton({ inTabs = false }: { inTabs?: boolean }) {
  const colors = useColors();
  const bottom = useFabBottom(inTabs);
  const { isBurundi } = useSongbookPreference();
  const { notifyShareSuccess } = useEngagement();
  const lift = useFabLift(inTabs);
  const expanded = useSharedValue(1);
  const { t } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      expanded.value = withTiming(1, { duration: 200 });
      const timeout = setTimeout(() => {
        expanded.value = withTiming(0, { duration: 300 });
      }, COLLAPSE_DELAY);
      return () => clearTimeout(timeout);
    }, [expanded])
  );

  const containerStyle = useAnimatedStyle(() => ({
    width: ICON_SIZE + expanded.value * EXPANDED_EXTRA,
    bottom: bottom + lift.value,
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: expanded.value,
    width: expanded.value * EXPANDED_EXTRA,
  }));

  const handlePress = async () => {
    mediumImpact();
    await shareApp({ isBurundi, t });
    notifyShareSuccess();
  };

  return (
    <Animated.View
      style={[
        styles.fab,
        {
          backgroundColor: colors.tint,
        },
        containerStyle,
      ]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        accessibilityLabel={t('common.shareAppA11y')}
        accessibilityRole="button"
        style={styles.touchable}>
        <View style={styles.iconContainer}>
          <IconSymbol name="square.and.arrow.up" size={24} color={colors.tintForeground} weight="semibold" />
        </View>
        <Animated.Text
          numberOfLines={1}
          style={[styles.label, { color: colors.tintForeground }, labelStyle]}>
          {t('common.shareAppLabel')}
        </Animated.Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
  },
  touchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 38,
    height: ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 9,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    overflow: 'hidden',
  },
});
