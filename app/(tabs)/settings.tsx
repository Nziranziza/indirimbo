import { TabScrollView } from '@/components/tab-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TintColorOptions } from '@/constants/theme';
import { useTheme } from '@/contexts/theme-context';
import { useColors } from '@/hooks/use-colors';
import { getFontSize, setFontSize, type FontSize, type ThemePreference, type TintColorKey } from '@/utils/storage';
import * as Haptics from 'expo-haptics';
import { router, useFocusEffect } from 'expo-router';
import Head from 'expo-router/head';
import { useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const [fontSize, setFontSizeState] = useState<FontSize>('medium');
  const { themePreference, setThemePreference: setThemePreferenceContext, tintColor, setTintColor: setTintColorContext } = useTheme();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const getColorOptionWidth = (screenWidth: number) => {
    const effectiveWidth = Platform.OS === 'web' ? Math.min(screenWidth, 428) : screenWidth;
    // scrollContent padding: 20px each side = 40px total
    // groupContainer padding: 20px each side = 40px total
    // Total horizontal padding: 80px
    const totalHorizontalPadding = 80; // 20*2 + 20*2
    const totalGaps = 0; // spacing handled by layout
    const wrapperBorder = 6; // borderWidth 3 on each side
    const totalBorders = wrapperBorder * 4;
    const availableWidth = effectiveWidth - totalHorizontalPadding - totalGaps - totalBorders;
    const itemWidth = Math.floor(availableWidth / 4);
    return Math.max(65, itemWidth);
  };

  const [colorOptionWidth, setColorOptionWidth] = useState(() => {
    if (Platform.OS === 'web') {
      return getColorOptionWidth(428);
    }
    return getColorOptionWidth(Dimensions.get('window').width);
  });

  useEffect(() => {
    const updateWidth = ({ window }: { window: { width: number } }) => {
      setColorOptionWidth(getColorOptionWidth(window.width));
    };

    const subscription = Dimensions.addEventListener('change', updateWidth);
    updateWidth({ window: Dimensions.get('window') });

    return () => {
      subscription.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadSettings();
    }, [])
  );

  const loadSettings = async () => {
    const size = await getFontSize();
    setFontSizeState(size);
  };

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

  const fontSizeOptions: { label: string; value: FontSize; description: string }[] = [
    { label: 'Small', value: 'small', description: 'Compact text for more content' },
    { label: 'Medium', value: 'medium', description: 'Balanced size (recommended)' },
    { label: 'Large', value: 'large', description: 'Larger text for easier reading' },
  ];

  const themeOptions: { label: string; value: ThemePreference; description: string; icon: string }[] = [
    { label: 'Light', value: 'light', description: 'Always use light theme', icon: 'sun.max' },
    { label: 'Dark', value: 'dark', description: 'Always use dark theme', icon: 'moon' },
    { label: 'Auto', value: 'auto', description: 'Follow system setting', icon: 'circle.lefthalf.filled' },
  ];

  return (
    <ThemedView style={styles.container}>
      <Head>
        <title>Settings | Indirimbo</title>
        <meta name="description" content="Customize your Indirimbo reading experience. Adjust text size, theme, and accent color." />
      </Head>
      <ThemedView style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <ThemedText type="title" style={styles.title}>
          Settings
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Customize your reading experience
        </ThemedText>
      </ThemedView>

      <TabScrollView 
        contentContainerStyle={styles.scrollContent}>
        {/* Text Size Group */}
        <ThemedView style={[styles.groupContainer, { backgroundColor: colors.background, borderColor: colors.icon + '15' }]}>
          <ThemedView style={[styles.groupHeader, { borderBottomColor: colors.icon + '10' }]}>
            <IconSymbol name="textformat.size" size={20} color={colors.tint} />
            <ThemedText type="subtitle" style={styles.groupTitle}>
              Text Size
            </ThemedText>
          </ThemedView>
          
          <ThemedText style={[styles.groupDescription, { opacity: 0.7 }]}>
            Adjust the font size for song lyrics
          </ThemedText>
          
          <ThemedView style={styles.optionsContainer}>
            {fontSizeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleFontSizeChange(option.value)}
                style={[
                  styles.optionCard,
                  { 
                    borderColor: fontSize === option.value ? colors.tint : colors.icon + '20',
                    backgroundColor: fontSize === option.value ? colors.tint + '10' : 'transparent',
                  }
                ]}
                activeOpacity={0.7}>
                <View style={styles.optionContent}>
                  <View style={styles.optionHeader}>
                    <ThemedText 
                      type="defaultSemiBold" 
                      style={[
                        styles.optionLabel,
                        { color: fontSize === option.value ? colors.tint : colors.text }
                      ]}>
                      {option.label}
                    </ThemedText>
                    {fontSize === option.value && (
                      <View style={[styles.selectedBadge, { backgroundColor: colors.tint }]}>
                        <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                  <ThemedText style={[styles.optionDescription, { opacity: 0.6 }]}>
                    {option.description}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Appearance Group */}
        <ThemedView style={[styles.groupContainer, { backgroundColor: colors.background, borderColor: colors.icon + '15' }]}>
          <ThemedView style={[styles.groupHeader, { borderBottomColor: colors.icon + '10' }]}>
            <IconSymbol name="paintbrush.fill" size={20} color={colors.tint} />
            <ThemedText type="subtitle" style={styles.groupTitle}>
              Appearance
            </ThemedText>
          </ThemedView>
          
          <ThemedText style={[styles.groupDescription, { opacity: 0.7 }]}>
            Choose your preferred theme
          </ThemedText>
          
          <ThemedView style={styles.optionsContainer}>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleThemeChange(option.value)}
                style={[
                  styles.optionCard,
                  { 
                    borderColor: themePreference === option.value ? colors.tint : colors.icon + '20',
                    backgroundColor: themePreference === option.value ? colors.tint + '10' : 'transparent',
                  }
                ]}
                activeOpacity={0.7}>
                <View style={styles.optionContent}>
                  <View style={styles.optionHeader}>
                    <View style={styles.optionHeaderLeft}>
                      <IconSymbol 
                        name={option.icon as any} 
                        size={20} 
                        color={themePreference === option.value ? colors.tint : colors.icon} 
                      />
                      <ThemedText 
                        type="defaultSemiBold" 
                        style={[
                          styles.optionLabel,
                          { color: themePreference === option.value ? colors.tint : colors.text }
                        ]}>
                        {option.label}
                      </ThemedText>
                    </View>
                    {themePreference === option.value && (
                      <View style={[styles.selectedBadge, { backgroundColor: colors.tint }]}>
                        <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                      </View>
                    )}
                  </View>
                  <ThemedText style={[styles.optionDescription, { opacity: 0.6 }]}>
                    {option.description}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Accent Color Group */}
        <ThemedView style={[
          styles.groupContainer,
          { backgroundColor: colors.background, borderColor: colors.icon + '15' }
        ]}>
          <ThemedView style={[styles.groupHeader, { borderBottomColor: colors.icon + '10' }]}>
            <IconSymbol name="paintpalette.fill" size={20} color={colors.tint} />
            <ThemedText type="subtitle" style={styles.groupTitle}>
              Accent Color
            </ThemedText>
          </ThemedView>
          
          <ThemedText style={[styles.groupDescription, { opacity: 0.7 }]}>
            Choose your preferred accent color
          </ThemedText>
          
          <ThemedView style={styles.colorGrid}>
            {(Object.keys(TintColorOptions) as TintColorKey[]).map((colorKey) => {
              const colorOption = TintColorOptions[colorKey];
              const isSelected = tintColor === colorKey;
              const currentColor = colors.tint;
              
              return (
                <View
                  key={colorKey}
                  style={[
                    styles.colorOptionWrapper,
                    {
                      borderColor: isSelected ? currentColor : colors.icon + '20',
                      width: colorOptionWidth,
                    }
                  ]}>
                  <TouchableOpacity
                    onPress={() => handleTintColorChange(colorKey)}
                    style={styles.colorOption}
                    activeOpacity={0.7}>
                    <View
                      style={[
                        styles.colorCircle,
                        {
                          backgroundColor: colorOption.light,
                        }
                      ]}
                    />
                    {isSelected && (
                      <View style={[styles.colorCheckmark, { backgroundColor: currentColor }]}>
                        <IconSymbol name="checkmark" size={14} color="#FFFFFF" />
                      </View>
                    )}
                    <ThemedText style={[styles.colorLabel, { opacity: isSelected ? 1 : 0.7 }]}>
                      {colorOption.name}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ThemedView>
        </ThemedView>

        {/* Legal & Info Group */}
        <ThemedView style={[
          styles.groupContainer,
          styles.lastGroupContainer,
          { backgroundColor: colors.background, borderColor: colors.icon + '15' }
        ]}>
          <ThemedView style={[styles.groupHeader, { borderBottomColor: colors.icon + '10' }]}>
            <IconSymbol name="info.circle.fill" size={20} color={colors.tint} />
            <ThemedText type="subtitle" style={styles.groupTitle}>
              Legal & Information
            </ThemedText>
          </ThemedView>

          <ThemedText style={[styles.groupDescription, { opacity: 0.7 }]}>
            About the app, support, and legal policies
          </ThemedText>

          <ThemedView style={styles.legalLinksContainer}>
            <TouchableOpacity
              onPress={() => router.push('/about')}
              style={[styles.legalLink, { borderBottomColor: colors.icon + '10' }]}
              activeOpacity={0.7}>
              <View style={styles.legalLinkContent}>
                <IconSymbol name="music.note.list" size={20} color={colors.icon} />
                <ThemedText type="defaultSemiBold" style={styles.legalLinkText}>
                  About Indirimbo
                </ThemedText>
              </View>
              <IconSymbol name="arrow.right" size={20} color={colors.icon} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/support')}
              style={[styles.legalLink, { borderBottomColor: colors.icon + '10' }]}
              activeOpacity={0.7}>
              <View style={styles.legalLinkContent}>
                <IconSymbol name="questionmark.circle.fill" size={20} color={colors.icon} />
                <ThemedText type="defaultSemiBold" style={styles.legalLinkText}>
                  Help & Support
                </ThemedText>
              </View>
              <IconSymbol name="arrow.right" size={20} color={colors.icon} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/privacy-policy')}
              style={[styles.legalLink, { borderBottomColor: colors.icon + '10' }]}
              activeOpacity={0.7}>
              <View style={styles.legalLinkContent}>
                <IconSymbol name="lock.shield.fill" size={20} color={colors.icon} />
                <ThemedText type="defaultSemiBold" style={styles.legalLinkText}>
                  Privacy Policy
                </ThemedText>
              </View>
              <IconSymbol name="arrow.right" size={20} color={colors.icon} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push('/terms-of-service')}
              style={[styles.legalLink, { borderBottomWidth: 0 }]}
              activeOpacity={0.7}>
              <View style={styles.legalLinkContent}>
                <IconSymbol name="doc.text.fill" size={20} color={colors.icon} />
                <ThemedText type="defaultSemiBold" style={styles.legalLinkText}>
                  Terms of Service
                </ThemedText>
              </View>
              <IconSymbol name="arrow.right" size={20} color={colors.icon} />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </TabScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 0,
    gap: 20,
  },
  groupContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 0,
  },
  lastGroupContainer: {
    // Ensure the last group has proper spacing
    marginBottom: 0,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  groupTitle: {
    fontSize: 18,
  },
  groupDescription: {
    fontSize: 14,
    marginBottom: 20,
    marginTop: 4,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
  },
  optionContent: {
    gap: 6,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionLabel: {
    fontSize: 16,
  },
  selectedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionDescription: {
    fontSize: 13,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  colorOptionWrapper: {
    // Width is calculated dynamically in component to ensure exactly 4 per row
    borderRadius: 12,
    borderWidth: 3,
    flexShrink: 0,
    flexGrow: 0,
    // vertical spacing between rows
    marginBottom: 12,
  },
  colorOption: {
    minHeight: 85,
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 9,
    padding: 8,
    paddingTop: 12,
    position: 'relative',
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 6,
  },
  colorCheckmark: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorLabel: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
  legalLinksContainer: {
    gap: 0,
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  legalLinkContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legalLinkText: {
    fontSize: 16,
  },
});

