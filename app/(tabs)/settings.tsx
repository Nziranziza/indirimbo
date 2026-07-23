import { PageHead } from '@/components/page-head';
import { TabCollapsibleScrollView } from '@/components/tab-collapsible-scroll-view';
import { ThemedView } from '@/components/themed-view';
import { AccentColorSetting } from '@/components/settings/accent-color-setting';
import { AppearanceSetting } from '@/components/settings/appearance-setting';
import { LanguageSetting } from '@/components/settings/language-setting';
import { SongbookSetting } from '@/components/settings/songbook-setting';
import { TextSizeSetting } from '@/components/settings/text-size-setting';
import { FloatingShareButton } from '@/components/ui/floating-share-button';
import { SettingsGroup } from '@/components/ui/settings-group';
import { SettingsLinkRow } from '@/components/ui/settings-link-row';
import type { Locale } from '@/constants/translations';
import { useEngagement } from '@/contexts/engagement-context';
import { useLanguage } from '@/contexts/language-context';
import { useSongbookPreference } from '@/contexts/songbook-preference-context';
import { useColorScheme, useTheme } from '@/contexts/theme-context';
import { useTranslation } from '@/hooks/use-translation';
import { trackEvent } from '@/utils/analytics';
import { lightImpact } from '@/utils/haptics';
import { shareApp } from '@/utils/share';
import { requestAppReview } from '@/utils/store';
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
import { Platform, StyleSheet } from 'react-native';

export default function SettingsScreen() {
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const {
    themePreference,
    setThemePreference: setThemePreferenceContext,
    tintColor,
    setTintColor: setTintColorContext,
  } = useTheme();
  const colorScheme = useColorScheme();
  const { isBurundi, hasUnlockedKirundi, songbookPreference, updateSongbookPreference } = useSongbookPreference();
  const { language, setLanguage } = useLanguage();
  const { notifyShareSuccess, markAsRated } = useEngagement();
  const { t } = useTranslation();

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

  const handleLanguageChange = async (newLanguage: Locale) => {
    await setLanguage(newLanguage);
    trackEvent('change_language', { language: newLanguage });
    lightImpact();
  };

  const handleShareApp = async () => {
    trackEvent('share_app', { songbook: isBurundi ? 'kirundi' : 'kinyarwanda' });
    const completed = await shareApp({ isBurundi, t });
    if (completed) notifyShareSuccess();
  };

  const handleRateApp = async () => {
    try {
      trackEvent('rate_app', { platform: Platform.OS });
      await requestAppReview();
      await markAsRated();
    } catch (error) {
      console.error('handleRateApp error', error);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <PageHead
        title={t('settings.pageTitle')}
        description={t('settings.pageDescription')}
        canonicalPath="/settings"
      />
      <TabCollapsibleScrollView
        title={t('settings.title')}
        subtitle={t('settings.subtitle')}
        contentGap={20}
        hasFab
      >
        <SettingsGroup
          icon="textformat.size"
          title={t('settings.textSize.title')}
          description={t('settings.textSize.description')}
        >
          <TextSizeSetting
            fontSize={fontSize}
            onFontSizeChange={handleFontSizeChange}
            colorScheme={colorScheme === 'dark' ? 'dark' : 'light'}
          />
        </SettingsGroup>

        {(isBurundi || hasUnlockedKirundi) && (
          <SettingsGroup
            icon="books.vertical.fill"
            title={t('settings.songbook.title')}
            description={t('settings.songbook.description')}
          >
            <SongbookSetting
              songbookPreference={songbookPreference}
              onSongbookChange={handleSongbookChange}
            />
          </SettingsGroup>
        )}

        <SettingsGroup
          icon="globe"
          title={t('settings.language.title')}
          description={t('settings.language.description')}
        >
          <LanguageSetting
            language={language}
            onLanguageChange={handleLanguageChange}
          />
        </SettingsGroup>

        <SettingsGroup
          icon="paintbrush.fill"
          title={t('settings.appearance.title')}
          description={t('settings.appearance.description')}
        >
          <AppearanceSetting
            themePreference={themePreference ?? 'auto'}
            onThemeChange={handleThemeChange}
          />
        </SettingsGroup>

        <SettingsGroup
          icon="paintpalette.fill"
          title={t('settings.accentColor.title')}
          description={t('settings.accentColor.description')}
        >
          <AccentColorSetting
            tintColor={tintColor ?? 'blue'}
            onTintColorChange={handleTintColorChange}
          />
        </SettingsGroup>

        <SettingsGroup
          icon="square.and.arrow.up"
          title={Platform.OS === 'web' ? t('settings.share.titleWeb') : t('settings.share.titleMobile')}
          description={t('settings.share.description')}
        >
          <ThemedView style={styles.linksContainer}>
            <SettingsLinkRow
              icon="person.2.fill"
              label={t('settings.share.shareWithFriends')}
              onPress={handleShareApp}
              isLast={Platform.OS === 'web'}
              trailingIcon="arrow.up.forward"
            />
            {Platform.OS !== 'web' && (
              <SettingsLinkRow
                icon="star.fill"
                label={
                  Platform.OS === 'ios'
                    ? t('settings.share.rateAppStore')
                    : t('settings.share.ratePlayStore')
                }
                onPress={handleRateApp}
                isLast
                trailingIcon="arrow.up.forward"
              />
            )}
            {Platform.OS === 'web' && (
              <SettingsLinkRow
                icon="arrow.down.circle.fill"
                label={t('settings.share.downloadApp')}
                onPress={() => router.navigate('/download')}
                isLast
              />
            )}
          </ThemedView>
        </SettingsGroup>

        <SettingsGroup
          icon="info.circle.fill"
          title={t('settings.legal.title')}
          description={t('settings.legal.description')}
        >
          <ThemedView style={styles.linksContainer}>
            <SettingsLinkRow
              icon="music.note.list"
              label={t('settings.legal.about')}
              onPress={() => router.navigate('/about')}
            />
            <SettingsLinkRow
              icon="book.fill"
              label={t('settings.legal.bookReferences')}
              onPress={() => router.navigate('/book-references')}
            />
            <SettingsLinkRow
              icon="questionmark.circle.fill"
              label={t('settings.legal.help')}
              onPress={() => router.navigate('/support')}
            />
            <SettingsLinkRow
              icon="lock.shield.fill"
              label={t('settings.legal.privacy')}
              onPress={() => router.navigate('/privacy-policy')}
            />
            <SettingsLinkRow
              icon="doc.text.fill"
              label={t('settings.legal.terms')}
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
