import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useColors } from '@/hooks/use-colors';

export default function TabLayout() {
  const colors = useColors();

  return (
    <NativeTabs
      tintColor={colors.tint}
      backgroundColor={colors.bottomTabBackground}
      indicatorColor={`${colors.tint}20`}
      rippleColor={`${colors.tint}20`}
      labelStyle={{
        default: { color: colors.tabIconDefault },
        selected: { color: colors.tint }
      }}
      disableTransparentOnScrollEdge
      minimizeBehavior="onScrollDown"
      labelVisibilityMode="labeled"
      >
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'music.note.list', selected: 'music.note.list' }}
          md="queue_music"
        />
        <NativeTabs.Trigger.Label>Playlists</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'heart', selected: 'heart.fill' }}
          md="favorite"
        />
        <NativeTabs.Trigger.Label>Favorites</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Icon
          sf="magnifyingglass"
          md="search"
        />
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'gear', selected: 'gear' }}
          md="settings"
        />
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
