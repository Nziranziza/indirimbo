import { router, usePathname } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol, type IconSymbolName } from '@/components/ui/icon-symbol';
import { SIDEBAR_WIDTH } from '@/constants/layout';
import type { TranslationKey } from '@/constants/translations';
import { useTheme } from '@/contexts/theme-context';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import { trackEvent } from '@/utils/analytics';
import { lightImpact } from '@/utils/haptics';
import type { ThemePreference } from '@/utils/storage';

interface NavItem {
  /** Group-qualified target passed to router.navigate */
  readonly href: '/(tabs)/(home)' | '/(tabs)/search' | '/(tabs)/favorites' | '/(tabs)/settings';
  /** Stripped pathname prefix used for active-state matching */
  readonly match: '/' | '/search' | '/favorites' | '/settings';
  readonly icon: IconSymbolName;
  /** Filled variant shown when the item is active (falls back to `icon`) */
  readonly activeIcon?: IconSymbolName;
  readonly labelKey: TranslationKey;
}

const NAV_ITEMS: readonly NavItem[] = [
  { href: '/(tabs)/(home)', match: '/', icon: 'music.note.list', labelKey: 'tabs.playlists' },
  { href: '/(tabs)/search', match: '/search', icon: 'magnifyingglass', labelKey: 'tabs.search' },
  { href: '/(tabs)/favorites', match: '/favorites', icon: 'heart', activeIcon: 'heart.fill', labelKey: 'tabs.favorites' },
  { href: '/(tabs)/settings', match: '/settings', icon: 'gear', labelKey: 'tabs.settings' },
];

const THEME_CYCLE: Record<ThemePreference, ThemePreference> = {
  light: 'dark',
  dark: 'auto',
  auto: 'light',
};

const THEME_ICON: Record<ThemePreference, IconSymbolName> = {
  light: 'sun.max',
  dark: 'moon',
  auto: 'circle.lefthalf.filled',
};

const THEME_LABEL_KEY: Record<ThemePreference, TranslationKey> = {
  light: 'settings.theme.lightLabel',
  dark: 'settings.theme.darkLabel',
  auto: 'settings.theme.autoLabel',
};

const ICON_SIZE = 30;
const BUTTON_SIZE = 52;
const HOVER_SCALE = 1.12;
const HOVER_DURATION = 160;

/** Shared hover-scale animation for sidebar pressables (web hover only). */
function useHoverScale() {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const onHoverIn = useCallback(() => {
    scale.value = withTiming(HOVER_SCALE, { duration: HOVER_DURATION });
  }, [scale]);
  const onHoverOut = useCallback(() => {
    scale.value = withTiming(1, { duration: HOVER_DURATION });
  }, [scale]);
  return { animatedStyle, onHoverIn, onHoverOut };
}

interface SidebarButtonProps {
  readonly icon: IconSymbolName;
  readonly active: boolean;
  readonly accessibilityLabel: string;
  readonly onPress: () => void;
}

const SidebarButton = React.memo(function SidebarButton({
  icon,
  active,
  accessibilityLabel,
  onPress,
}: SidebarButtonProps) {
  const colors = useColors();
  const [hovered, setHovered] = useState(false);
  const { animatedStyle, onHoverIn, onHoverOut } = useHoverScale();

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => {
        setHovered(true);
        onHoverIn();
      }}
      onHoverOut={() => {
        setHovered(false);
        onHoverOut();
      }}
      accessibilityRole="link"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.button,
        (active || hovered) && { backgroundColor: colors.background },
        pressed && styles.buttonPressed,
      ]}>
      <Animated.View style={animatedStyle}>
        <IconSymbol
          name={icon}
          size={ICON_SIZE}
          color={active ? colors.tint : colors.tabIconDefault}
        />
      </Animated.View>
      {hovered && (
        <View style={styles.tooltipAnchor} pointerEvents="none">
          <View style={styles.tooltipBubble}>
            <ThemedText numberOfLines={1} style={styles.tooltipText}>
              {accessibilityLabel}
            </ThemedText>
          </View>
        </View>
      )}
    </Pressable>
  );
});

const LogoLink = React.memo(function LogoLink({ onPress }: { readonly onPress: () => void }) {
  const { animatedStyle, onHoverIn, onHoverOut } = useHoverScale();

  return (
    <Pressable
      onPress={onPress}
      onHoverIn={onHoverIn}
      onHoverOut={onHoverOut}
      accessibilityRole="link"
      accessibilityLabel="Indirimbo"
      style={styles.logo}>
      <Animated.View style={animatedStyle}>
        <Image source={require('@/assets/images/app-logo.webp')} style={styles.logoIcon} />
      </Animated.View>
    </Pressable>
  );
});

export function WebSidebar() {
  const colors = useColors();
  const pathname = usePathname();
  const { themePreference, setThemePreference } = useTheme();
  const { t } = useTranslation();

  const isActive = useCallback(
    (match: NavItem['match']) => (match === '/' ? pathname === '/' : pathname.startsWith(match)),
    [pathname],
  );

  const handleNavigate = useCallback((href: NavItem['href']) => {
    lightImpact();
    router.navigate(href);
  }, []);

  const handleLogoPress = useCallback(() => handleNavigate('/(tabs)/(home)'), [handleNavigate]);

  const currentTheme: ThemePreference = themePreference ?? 'auto';

  const handleToggleTheme = useCallback(async () => {
    const next = THEME_CYCLE[currentTheme];
    lightImpact();
    await setThemePreference(next);
    trackEvent('change_theme', { theme: next });
  }, [currentTheme, setThemePreference]);

  return (
    <View
      style={[styles.container, { backgroundColor: colors.sidebarBackground }]}>
      <LogoLink onPress={handleLogoPress} />

      <View style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.match);
          return (
            <SidebarButton
              key={item.href}
              icon={active && item.activeIcon ? item.activeIcon : item.icon}
              active={active}
              accessibilityLabel={t(item.labelKey)}
              onPress={() => handleNavigate(item.href)}
            />
          );
        })}
      </View>

      <View style={styles.footer}>
        <SidebarButton
          icon={THEME_ICON[currentTheme]}
          active={false}
          accessibilityLabel={t('webShell.toggleThemeA11y')}
          onPress={handleToggleTheme}
        />
        <ThemedText style={[styles.themeLabel, { color: colors.tabIconDefault }]}>
          {t(THEME_LABEL_KEY[currentTheme])}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: SIDEBAR_WIDTH,
    height: '100%',
    alignItems: 'center',
    paddingVertical: 16,
  },
  logo: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 11,
  },
  nav: {
    flex: 1,
    gap: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    gap: 2,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  buttonPressed: {
    opacity: 0.6,
  },
  tooltipAnchor: {
    position: 'absolute',
    left: BUTTON_SIZE + 10,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 10,
  },
  tooltipBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#2A2A2E',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  tooltipText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 17,
  },
  themeLabel: {
    fontSize: 10,
  },
});
