import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Icon, Label, NativeTabs, VectorIcon } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

import { useColors } from '@/hooks/use-colors';

export default function TabLayout() {
  const colors = useColors();

  return (
    <NativeTabs
      tintColor={colors.tint}
      backgroundColor={colors.bottomTabBackground}
      indicatorColor={`${colors.tint}20`}
      labelStyle={{
        default: { color: colors.tabIconDefault },
        selected: { color: colors.tint }
      }}
      blurEffect="regular"
      disableTransparentOnScrollEdge
      minimizeBehavior="onScrollDown"
      labelVisibilityMode='labeled'
      >
      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.TabBar
        />
        {Platform.OS === 'ios' ? (
          <Icon sf={{ default: 'music.note.list', selected: 'music.note.list' }} />
        ) : (
          <Icon src={<VectorIcon family={MaterialIcons} name="queue-music" />} />
        )}
        <Label>Playlists</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <NativeTabs.Trigger.TabBar
        />
        {Platform.OS === 'ios' ? (
          <Icon sf={{ default: 'heart', selected: 'heart.fill' }} />
        ) : (
          <Icon src={<VectorIcon family={MaterialIcons} name="favorite" />} />
        )}
        <Label>Favorites</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.TabBar
        />
        {Platform.OS === 'ios' ? (
          <Icon sf={{ default: 'magnifyingglass', selected: 'magnifyingglass' }} />
        ) : (
          <Icon src={<VectorIcon family={MaterialIcons} name="search" />} />
        )}
        <Label>Search</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.TabBar
        />
        {Platform.OS === 'ios' ? (
          <Icon sf="gear" />
        ) : (
          <Icon src={<VectorIcon family={MaterialIcons} name="settings" />} />
        )}
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
