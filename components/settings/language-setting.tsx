import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { Locale } from '@/constants/translations';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface LanguageSettingProps {
  readonly language: Locale;
  readonly onLanguageChange: (language: Locale) => void;
}

interface LanguageOption {
  readonly value: Locale;
  // Label and description are intentionally hardcoded in each option's own
  // language so users can recognize their language regardless of the current UI locale.
  readonly label: string;
  readonly description: string;
  readonly badge: string;
}

const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  {
    value: 'en',
    label: 'English',
    description: 'Use English throughout the app',
    badge: 'EN',
  },
  {
    value: 'fr',
    label: 'Français',
    description: "Utiliser le français dans l'application",
    badge: 'FR',
  },
];

export function LanguageSetting({ language, onLanguageChange }: LanguageSettingProps) {
  const colors = useColors();
  const { t } = useTranslation();

  return (
    <ThemedView style={styles.optionsContainer}>
      {LANGUAGE_OPTIONS.map((option) => {
        const isSelected = language === option.value;
        const { label, description, badge } = option;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => {
              if (option.value !== language) onLanguageChange(option.value);
            }}
            style={[
              styles.optionCard,
              {
                borderColor: isSelected ? colors.tint : colors.icon + '20',
                backgroundColor: isSelected ? colors.tint + '10' : 'transparent',
              },
            ]}
            accessibilityLabel={t('settings.language.optionA11y', { label, description })}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionHeader}>
                <View style={styles.optionHeaderLeft}>
                  <View
                    style={[
                      styles.languageBadge,
                      {
                        borderColor: isSelected ? colors.tint : colors.icon + '60',
                        backgroundColor: isSelected ? colors.tint + '15' : 'transparent',
                      },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.languageBadgeText,
                        { color: isSelected ? colors.tint : colors.icon },
                      ]}
                    >
                      {badge}
                    </ThemedText>
                  </View>
                  <ThemedText
                    type="defaultSemiBold"
                    style={[
                      styles.optionLabel,
                      { color: isSelected ? colors.tint : colors.text },
                    ]}
                  >
                    {label}
                  </ThemedText>
                </View>
                {isSelected && (
                  <View style={[styles.selectedBadge, { backgroundColor: colors.tint }]}>
                    <IconSymbol name="checkmark" size={16} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <ThemedText style={[styles.optionDescription, { opacity: 0.6 }]}>
                {description}
              </ThemedText>
            </View>
          </TouchableOpacity>
        );
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
  languageBadge: {
    minWidth: 32,
    height: 24,
    paddingHorizontal: 6,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    lineHeight: 12
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
});
