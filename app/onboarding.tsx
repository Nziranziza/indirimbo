import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { useSongbookPreference } from '@/contexts/songbook-preference-context';
import { useColors } from '@/hooks/use-colors';
import { trackEvent } from '@/utils/analytics';
import type { SongbookPreference } from '@/utils/storage';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SONGBOOK_OPTIONS: readonly {
  readonly value: SongbookPreference;
  readonly label: string;
  readonly description: string;
  readonly icon: IconSymbolName;
}[] = [
  {
    value: 'kirundi',
    label: 'Cantiques Kirundi',
    description: 'Indirimbo zo Guhimbaza Imana',
    icon: 'book.fill',
  },
  {
    value: 'kinyarwanda',
    label: 'Cantiques Kinyarwanda',
    description: 'Gushimisha Imana & Agakiza',
    icon: 'music.note.list',
  },
  {
    value: 'all',
    label: 'Ibitabo vyose',
    description: 'Cantiques Kirundi, Gushimisha & Agakiza',
    icon: 'books.vertical.fill',
  },
];

export default function OnboardingScreen() {
  const [selected, setSelected] = useState<SongbookPreference>('kirundi');
  const { setSongbookAndCompleteOnboarding } = useSongbookPreference();
  const router = useRouter();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const hasTrackedStartRef = useRef(false);
  useEffect(() => {
    if (hasTrackedStartRef.current) return;
    hasTrackedStartRef.current = true;
    trackEvent('start_onboarding');
  }, []);

  const handleContinue = useCallback(async () => {
    try {
      await setSongbookAndCompleteOnboarding(selected);
      trackEvent('complete_onboarding', { songbook_preference: selected });
      router.replace('/(tabs)/(home)');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      trackEvent('onboarding_error', { songbook_preference: selected });
    }
  }, [selected, setSongbookAndCompleteOnboarding, router]);

  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.appIcon}
          accessibilityLabel="Indirimbo app icon"
        />
        <ThemedText type="title" style={styles.title}>
          Indirimbo
        </ThemedText>
        <ThemedText style={[styles.subtitle, { opacity: 0.6 }]}>
          {"Hitamwo igitabo c'indirimbo"}
        </ThemedText>
      </View>

      <View style={styles.optionsContainer}>
        {SONGBOOK_OPTIONS.map((option) => {
          const isSelected = selected === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => setSelected(option.value)}
              style={[
                styles.optionCard,
                {
                  borderColor: isSelected ? colors.tint : colors.icon + '20',
                  backgroundColor: isSelected ? colors.tint + '10' : 'transparent',
                },
              ]}
              accessibilityLabel={`${option.label}: ${option.description}`}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <View style={styles.optionHeaderLeft}>
                    <IconSymbol
                      name={option.icon}
                      size={22}
                      color={isSelected ? colors.tint : colors.icon}
                    />
                    <ThemedText
                      type="defaultSemiBold"
                      style={[
                        styles.optionLabel,
                        { color: isSelected ? colors.tint : colors.text },
                      ]}
                    >
                      {option.label}
                    </ThemedText>
                  </View>
                  {isSelected && (
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
          );
        })}
      </View>

      <View style={styles.footer}>
        <ThemedText style={[styles.footerHint, { opacity: 0.4 }]}>
          Ushobora guhindura mu Settings
        </ThemedText>
        <TouchableOpacity
          onPress={handleContinue}
          style={[styles.continueButton, { backgroundColor: colors.tint }]}
          accessibilityLabel="Continue"
          accessibilityRole="button"
          activeOpacity={0.8}
        >
          <ThemedText style={[styles.continueText, { color: colors.tintForeground }]}>
            Komeza
          </ThemedText>
          <IconSymbol name="arrow.right" size={20} color={colors.tintForeground} />
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 18,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 17,
    textAlign: 'center',
  },
  optionsContainer: {
    flex: 1,
    gap: 12,
  },
  optionCard: {
    padding: 18,
    borderRadius: 14,
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
    fontSize: 17,
  },
  selectedBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionDescription: {
    fontSize: 14,
    marginLeft: 34,
  },
  footer: {
    alignItems: 'center',
    gap: 16,
    paddingTop: 16,
  },
  footerHint: {
    fontSize: 13,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    width: '100%',
  },
  continueText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
