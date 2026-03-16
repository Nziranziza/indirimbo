import { TabCollapsibleScrollView } from '@/components/tab-collapsible-scroll-view';
import { ThemedView } from '@/components/themed-view';
import { AccentColorSetting } from '@/components/settings/accent-color-setting';
import { AppearanceSetting } from '@/components/settings/appearance-setting';
import { TextSizeSetting } from '@/components/settings/text-size-setting';
import { FloatingShareButton } from '@/components/ui/floating-share-button';
import { SettingsGroup } from '@/components/ui/settings-group';
import { SettingsLinkRow } from '@/components/ui/settings-link-row';
import {
  APP_STORE_URL,
  APP_UNIVERSAL_LINK_URL,
  PLAY_STORE_URL,
} from '@/constants/app-links';
import { useColorScheme, useTheme } from '@/contexts/theme-context';
import {
  getFontSize,
  setFontSize,
  type FontSize,
  type ThemePreference,
  type TintColorKey,
} from '@/utils/storage';
import * as Haptics from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import Head from 'expo-router/head';
import { useCallback, useState } from 'react';
import { Linking, Platform, Share, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const {
    themePreference,
    setThemePreference: setThemePreferenceContext,
    tintColor,
    setTintColor: setTintColorContext,
  } = useTheme();
  const colorScheme = useColorScheme();

  useFocusEffect(
    useCallback(() => {
      getFontSize().then(setFontSizeState);
    }, []),
  );

  const handleFontSizeChange = async (newSize: FontSize) => {
    await setFontSize(newSize);
    setFontSizeState(newSize);
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleThemeChange = async (newTheme: ThemePreference) => {
    await setThemePreferenceContext(newTheme);
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleTintColorChange = async (newColor: TintColorKey) => {
    await setTintColorContext(newColor);
    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleShareApp = async () => {
    const message = `Check out Indirimbo - Agakiza no Gushimisha Imana\n\n${APP_UNIVERSAL_LINK_URL}/download`;
    try {
      await Share.share(
        { message, title: 'Indirimbo - Rwandan Hymns & Worship Songs' },
        { dialogTitle: 'Share Indirimbo' },
      );
    } catch {}
  };

  const handleRateApp = async () => {
    const url = Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
    if (url) {
      await Linking.openURL(url);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Head>
        <title>Settings | Indirimbo</title>
        <meta
          name="description"
          content="Customize your Indirimbo reading experience. Adjust text size, theme, and accent color."
        />
        <link rel="canonical" href="https://indirimbo.rw/settings" />
      </Head>
      <TabCollapsibleScrollView
        title="Settings"
        subtitle="Customize your reading experience"
        contentGap={20}
        extraBottomPadding={80}
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
                onPress={() => router.push('/download')}
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
              onPress={() => router.push('/about')}
            />
            <SettingsLinkRow
              icon="questionmark.circle.fill"
              label="Help & Support"
              onPress={() => router.push('/support')}
            />
            <SettingsLinkRow
              icon="lock.shield.fill"
              label="Privacy Policy"
              onPress={() => router.push('/privacy-policy')}
            />
            <SettingsLinkRow
              icon="doc.text.fill"
              label="Terms of Service"
              onPress={() => router.push('/terms-of-service')}
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
