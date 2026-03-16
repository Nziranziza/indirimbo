import { ThemedText } from '@/components/themed-text';
import { FONT_SIZE_OPTIONS, FONT_SIZES } from '@/constants/typography';
import { useColors } from '@/hooks/use-colors';
import type { FontSize } from '@/utils/storage';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { StyleSheet, View } from 'react-native';

interface TextSizeSettingProps {
  readonly fontSize: FontSize;
  readonly onFontSizeChange: (size: FontSize) => void;
  readonly colorScheme: 'light' | 'dark';
}

export function TextSizeSetting({ fontSize, onFontSizeChange, colorScheme }: TextSizeSettingProps) {
  const colors = useColors();
  const fontSizePreview = FONT_SIZES;

  return (
    <>
      <SegmentedControl
        values={FONT_SIZE_OPTIONS.map((o) => o.label)}
        selectedIndex={FONT_SIZE_OPTIONS.findIndex((o) => o.value === fontSize)}
        onChange={(event) => {
          const index = event.nativeEvent.selectedSegmentIndex;
          onFontSizeChange(FONT_SIZE_OPTIONS[index].value);
        }}
        appearance={colorScheme === 'dark' ? 'dark' : 'light'}
        style={styles.segmentedControl}
      />

      <View
        style={[
          styles.previewContainer,
          {
            backgroundColor: colors.icon + '08',
            borderColor: colors.icon + '15',
          },
        ]}
      >
        <ThemedText
          style={[styles.previewLabel, { color: colors.icon, opacity: 0.6 }]}
        >
          Preview
        </ThemedText>
        <ThemedText style={[styles.sizeDescription, { opacity: 0.5 }]}>
          {FONT_SIZE_OPTIONS.find((o) => o.value === fontSize)?.description}
        </ThemedText>
        <ThemedText
          style={{
            fontSize: fontSizePreview[fontSize].verse,
            lineHeight: fontSizePreview[fontSize].lineHeight,
          }}
        >
          Urukundo ruhebuje,{'\n'}gend&apos; urwogeze hose,{'\n'}Ni rwo rwatumye Imana
          {'\n'}itanga Umwana wayo.
        </ThemedText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  segmentedControl: {
    marginBottom: 20,
  },
  previewContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    height: 195,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    lineHeight: 12,
    marginBottom: 2,
  },
  sizeDescription: {
    fontSize: 10,
    lineHeight: 10,
    marginBottom: 5,
  },
});
