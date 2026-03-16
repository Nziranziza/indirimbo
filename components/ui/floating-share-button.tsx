import { APP_UNIVERSAL_LINK_URL } from '@/constants/app-links';
import { useColors } from '@/hooks/use-colors';
import * as Haptics from 'expo-haptics';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { Platform, Share, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { IconSymbol } from './icon-symbol';

const ICON_SIZE = 56;
const EXPANDED_EXTRA = 100;
const COLLAPSE_DELAY = 3000;

export function FloatingShareButton({ inTabs = false }: { inTabs?: boolean }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const expanded = useSharedValue(1);

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
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: expanded.value,
    width: expanded.value * EXPANDED_EXTRA,
  }));

  const handlePress = async () => {
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    const message = `Check out Indirimbo - Agakiza no Gushimisha Imana\n\n${APP_UNIVERSAL_LINK_URL}/download`;
    try {
      await Share.share(
        { message, title: 'Indirimbo - Rwandan Hymns & Worship Songs' },
        { dialogTitle: 'Share Indirimbo' },
      );
    } catch {}
  };

  const bottom = inTabs
    ? (Platform.OS === 'ios' ? insets.bottom + 16 : 16)
    : Math.max(insets.bottom, 16) + 16;

  return (
    <Animated.View
      style={[
        styles.fab,
        {
          backgroundColor: colors.tint,
          bottom,
        },
        containerStyle,
      ]}>
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.85}
        accessibilityLabel="Share app"
        accessibilityRole="button"
        style={styles.touchable}>
        <View style={styles.iconContainer}>
          <IconSymbol name="square.and.arrow.up" size={24} color={colors.tintForeground} weight="semibold" />
        </View>
        <Animated.Text
          numberOfLines={1}
          style={[styles.label, { color: colors.tintForeground }, labelStyle]}>
          Share App
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
