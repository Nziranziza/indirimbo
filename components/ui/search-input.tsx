import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { useTranslation } from '@/hooks/use-translation';
import { Pressable, StyleSheet, TextInput } from 'react-native';
import { forwardRef, useImperativeHandle, useRef } from 'react';

export interface SearchInputRef {
  focus: () => void;
}

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: any;
  autoFocus?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  ({ value, onChangeText, placeholder = 'Search...', style, autoFocus, onFocus, onBlur }, ref) => {
    const colors = useColors();
    const { t } = useTranslation();
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    return (
      <Pressable
        style={[
          styles.container,
          { backgroundColor: colors.icon + '1A' },
          style
        ]}
        accessibilityRole="search"
        onPress={() => inputRef.current?.focus()}>
        <IconSymbol name="magnifyingglass" size={30} color={colors.icon} style={styles.icon} weight="thin" />
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.icon + 'CC'}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          accessibilityLabel={t('common.search.inputA11y')}
          autoFocus={autoFocus}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        {value.length > 0 && (
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              onChangeText('');
            }}
            accessibilityLabel={t('common.search.clearA11y')}
            accessibilityRole="button"
            hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}>
            <IconSymbol name="xmark.circle.fill" size={20} color={colors.icon} />
          </Pressable>
        )}
      </Pressable>
    );
  }
);

SearchInput.displayName = 'SearchInput';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 999,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    width: 30,
    height: 30,
  },
});
