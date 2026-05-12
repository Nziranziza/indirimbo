import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

import { useBottomChrome } from '@/contexts/engagement-context';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';

// The engagement alert renders at the root (above the tab navigator), so its
// bottom offset must clear the native tab bar visible on tab screens. The
// safe-area inset is added separately by the provider.
// iOS UITabBar: ~49pt above the home-indicator inset.
// Android BottomNavigationView with labels: ~80dp, doesn't share the inset.
const TAB_BAR_CHROME = Platform.OS === 'android' ? 80 : 49;

export default function TabLayout() {
  const colors = useColors();
  const { t } = useTranslation();
  useBottomChrome(TAB_BAR_CHROME);

  return (
    <NativeTabs
      tintColor={colors.tint}
      backgroundColor={colors.bottomTabBackground}
      iconColor={{
        default: colors.tabIconDefault,
        selected: colors.tint,
      }}
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
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'music.note.list', selected: 'music.note.list' }}
          md="queue_music"
        />
        <NativeTabs.Trigger.Label>{t('tabs.playlists')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'heart', selected: 'heart.fill' }}
          md="favorite"
        />
        <NativeTabs.Trigger.Label>{t('tabs.favorites')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Icon
          sf="magnifyingglass"
          md="search"
        />
        <NativeTabs.Trigger.Label>{t('tabs.search')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'gear', selected: 'gear' }}
          md="settings"
        />
        <NativeTabs.Trigger.Label>{t('tabs.settings')}</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
