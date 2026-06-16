import { Tabs } from 'expo-router';
import { useCallback } from 'react';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { AdaptiveWebTabBar } from '@/components/web/adaptive-web-tab-bar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useIsWideScreen } from '@/hooks/use-is-wide-screen';

export default function TabLayout() {
  const colors = useColors();
  const isWide = useIsWideScreen();

  // On wide screens the left sidebar handles navigation, so drop the bottom tab
  // bar; on phone widths it slides away on scroll via AdaptiveWebTabBar.
  const renderTabBar = useCallback(
    (props: BottomTabBarProps) => (isWide ? null : <AdaptiveWebTabBar {...props} />),
    [isWide],
  );

  return (
    <Tabs
      tabBar={renderTabBar}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.bottomTabBackground,
          paddingBottom: 8,
          paddingTop: 6,
          height: 64,
        },
      }}>
      <Tabs.Screen
        name="(home)"
        options={{
          title: 'Playlists',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="music.note.list" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="magnifyingglass" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="gear" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
