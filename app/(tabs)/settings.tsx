import { PageHead } from '@/components/page-head';
import { TabCollapsibleScrollView } from '@/components/tab-collapsible-scroll-view';
import { ThemedView } from '@/components/themed-view';
import { AccentColorSetting } from '@/components/settings/accent-color-setting';
import { AppearanceSetting } from '@/components/settings/appearance-setting';
import { SongbookSetting } from '@/components/settings/songbook-setting';
import { TextSizeSetting } from '@/components/settings/text-size-setting';
import { FloatingShareButton } from '@/components/ui/floating-share-button';
import { SettingsGroup } from '@/components/ui/settings-group';
import { SettingsLinkRow } from '@/components/ui/settings-link-row';
import { APP_STORE_REVIEW_URL, PLAY_STORE_REVIEW_URL } from '@/constants/app-links';
import { useEngagement } from '@/contexts/engagement-context';
import { useSongbookPreference } from '@/contexts/songbook-preference-context';
import { useColorScheme, useTheme } from '@/contexts/theme-context';
import { trackEvent } from '@/utils/analytics';
import { lightImpact } from '@/utils/haptics';
import { shareApp } from '@/utils/share';
import {
  getFontSize,
  setFontSize,
  type FontSize,
  type SongbookPreference,
  type ThemePreference,
  type TintColorKey,
} from '@/utils/storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Linking, Platform, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const {
    themePreference,
    setThemePreference: setThemePreferenceContext,
    tintColor,
    setTintColor: setTintColorContext,
  } = useTheme();
  const colorScheme = useColorScheme();
  const { isBurundi, songbookPreference, updateSongbookPreference } = useSongbookPreference();
  const { notifyShareSuccess, markAsRated } = useEngagement();

  useFocusEffect(
    useCallback(() => {
      getFontSize().then(setFontSizeState);
    }, []),
  );

  const handleFontSizeChange = async (newSize: FontSize) => {
    await setFontSize(newSize);
    setFontSizeState(newSize);
    trackEvent('change_font_size', { font_size: newSize });
    lightImpact();
  };

  const handleThemeChange = async (newTheme: ThemePreference) => {
    await setThemePreferenceContext(newTheme);
    trackEvent('change_theme', { theme: newTheme });
    lightImpact();
  };

  const handleTintColorChange = async (newColor: TintColorKey) => {
    await setTintColorContext(newColor);
    lightImpact();
  };

  const handleSongbookChange = async (newPreference: SongbookPreference) => {
    await updateSongbookPreference(newPreference);
    trackEvent('change_songbook_preference', { preference: newPreference });
    lightImpact();
  };

  const handleShareApp = async () => {
    trackEvent('share_app', { songbook: isBurundi ? 'kirundi' : 'kinyarwanda' });
    await shareApp({ isBurundi });
    notifyShareSuccess();
  };

  const handleRateApp = async () => {
    const url = Platform.OS === 'ios' ? APP_STORE_REVIEW_URL : PLAY_STORE_REVIEW_URL;
    if (!url) return;
    try {
      trackEvent('rate_app', { platform: Platform.OS });
      await Linking.openURL(url);
      await markAsRated();
    } catch (error) {
      console.error('Failed to open review URL:', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <PageHead
        title="Settings | Indirimbo"
        description="Customize your Indirimbo reading experience. Adjust text size, theme, and accent color."
        canonicalPath="/settings"
      />
      <TabCollapsibleScrollView
        title="Settings"
        subtitle="Customize your reading experience"
        contentGap={20}
        hasFab
      >
        <SettingsGroup
          icon="textformat.size"
          title="Text Size"
          description="Adjust the font size for song lyrics"
        >
          <TextSizeSetting
            fontSize={fontSize}
            onFontSizeChange={handleFontSizeChange}
            colorScheme={colorScheme === 'dark' ? 'dark' : 'light'}
          />
        </SettingsGroup>

        {isBurundi && (
          <SettingsGroup
            icon="books.vertical.fill"
            title="Songbook"
            description="Choose which songbooks to display"
          >
            <SongbookSetting
              songbookPreference={songbookPreference}
              onSongbookChange={handleSongbookChange}
            />
          </SettingsGroup>
        )}

        <SettingsGroup
          icon="paintbrush.fill"
          title="Appearance"
          description="Choose your preferred theme"
        >
          <AppearanceSetting
            themePreference={themePreference ?? 'auto'}
            onThemeChange={handleThemeChange}
          />
        </SettingsGroup>

        <SettingsGroup
          icon="paintpalette.fill"
          title="Accent Color"
          description="Choose your preferred accent color"
        >
          <AccentColorSetting
            tintColor={tintColor ?? 'blue'}
            onTintColorChange={handleTintColorChange}
          />
        </SettingsGroup>

        <SettingsGroup
          icon="square.and.arrow.up"
          title={Platform.OS === 'web' ? 'Share & Download' : 'Share & Rate'}
          description="Spread the word and help others discover Indirimbo"
        >
          <ThemedView style={styles.linksContainer}>
            <SettingsLinkRow
              icon="person.2.fill"
              label="Share with Friends"
              onPress={handleShareApp}
              isLast={Platform.OS === 'web'}
              trailingIcon="arrow.up.forward"
            />
            {Platform.OS !== 'web' && (
              <SettingsLinkRow
                icon="star.fill"
                label={
                  Platform.OS === 'ios'
                    ? 'Rate on App Store'
                    : 'Rate on Play Store'
                }
                onPress={handleRateApp}
                isLast
                trailingIcon="arrow.up.forward"
              />
            )}
            {Platform.OS === 'web' && (
              <SettingsLinkRow
                icon="arrow.down.circle.fill"
                label="Download the App"
                onPress={() => router.navigate('/download')}
                isLast
              />
            )}
          </ThemedView>
        </SettingsGroup>

        <SettingsGroup
          icon="info.circle.fill"
          title="Legal & Information"
          description="About the app, support, and legal policies"
        >
          <ThemedView style={styles.linksContainer}>
            <SettingsLinkRow
              icon="music.note.list"
              label="About Indirimbo"
              onPress={() => router.navigate('/about')}
            />
            <SettingsLinkRow
              icon="book.fill"
              label="Song Book References"
              onPress={() => router.navigate('/book-references')}
              badge="New"
            />
            <SettingsLinkRow
              icon="questionmark.circle.fill"
              label="Help & Support"
              onPress={() => router.navigate('/support')}
            />
            <SettingsLinkRow
              icon="lock.shield.fill"
              label="Privacy Policy"
              onPress={() => router.navigate('/privacy-policy')}
            />
            <SettingsLinkRow
              icon="doc.text.fill"
              label="Terms of Service"
              onPress={() => router.navigate('/terms-of-service')}
              isLast
            />
          </ThemedView>
        </SettingsGroup>
      </TabCollapsibleScrollView>
      <FloatingShareButton inTabs />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  linksContainer: {
    gap: 0,
  },
});
