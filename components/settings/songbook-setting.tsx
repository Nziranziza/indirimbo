import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import type { SongbookPreference } from '@/utils/storage';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface SongbookSettingProps {
  readonly songbookPreference: SongbookPreference;
  readonly onSongbookChange: (preference: SongbookPreference) => void;
}

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

export function SongbookSetting({ songbookPreference, onSongbookChange }: SongbookSettingProps) {
  const colors = useColors();
  const { t } = useTranslation();

  return (
    <ThemedView style={styles.optionsContainer}>
      {SONGBOOK_OPTIONS.map((option) => {
        const isSelected = songbookPreference === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            onPress={() => onSongbookChange(option.value)}
            style={[
              styles.optionCard,
              {
                borderColor: isSelected ? colors.tint : colors.icon + '20',
                backgroundColor: isSelected ? colors.tint + '10' : 'transparent',
              },
            ]}
            accessibilityLabel={t('settings.songbook.optionA11y', {
              label: option.label,
              description: option.description,
            })}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected }}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionHeader}>
                <View style={styles.optionHeaderLeft}>
                  <IconSymbol
                    name={option.icon}
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
