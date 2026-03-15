import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { THEME_OPTIONS } from '@/constants/theme';
import { useColors } from '@/hooks/use-colors';
import type { ThemePreference } from '@/utils/storage';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface AppearanceSettingProps {
  readonly themePreference: ThemePreference;
  readonly onThemeChange: (theme: ThemePreference) => void;
}

export function AppearanceSetting({ themePreference, onThemeChange }: AppearanceSettingProps) {
  const colors = useColors();

  return (
    <ThemedView style={styles.optionsContainer}>
      {THEME_OPTIONS.map((option) => {
        const isSelected = themePreference === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onThemeChange(option.value)}
            style={[
              styles.optionCard,
              {
                borderColor: isSelected ? colors.tint : colors.icon + '20',
                backgroundColor: isSelected ? colors.tint + '10' : 'transparent',
              },
            ]}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionHeader}>
                <View style={styles.optionHeaderLeft}>
                  <IconSymbol
                    name={option.icon as IconSymbolName}
                    size={20}
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
