import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { TintColorOptions } from '@/constants/theme';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import type { TintColorKey } from '@/utils/storage';
import { useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

const getColorOptionWidth = (screenWidth: number) => {
  const effectiveWidth =
    Platform.OS === 'web' ? Math.min(screenWidth, 428) : screenWidth;
  const totalHorizontalPadding = 80;
  const wrapperBorder = 6;
  const totalBorders = wrapperBorder * 4;
  const availableWidth = effectiveWidth - totalHorizontalPadding - totalBorders;
  const itemWidth = Math.floor(availableWidth / 4);
  return Math.max(65, itemWidth);
};

interface AccentColorSettingProps {
  readonly tintColor: TintColorKey;
  readonly onTintColorChange: (color: TintColorKey) => void;
}

export function AccentColorSetting({ tintColor, onTintColorChange }: AccentColorSettingProps) {
  const colors = useColors();
  const { t } = useTranslation();

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

  return (
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
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => onTintColorChange(colorKey)}
              style={styles.colorOption}
              activeOpacity={0.7}
            >
              <View
                style={[styles.colorCircle, { backgroundColor: colorOption.light }]}
              />
              {isSelected && (
                <View
                  style={[styles.colorCheckmark, { backgroundColor: currentColor }]}
                >
                  <IconSymbol name="checkmark" size={14} color="#FFFFFF" />
                </View>
              )}
              <ThemedText
                style={[styles.colorLabel, { opacity: isSelected ? 1 : 0.7 }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.7}
              >
                {t(colorOption.nameKey)}
              </ThemedText>
            </TouchableOpacity>
          </View>
        );
      })}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  colorOptionWrapper: {
    borderRadius: 12,
    borderWidth: 3,
    flexShrink: 0,
    flexGrow: 0,
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
});
