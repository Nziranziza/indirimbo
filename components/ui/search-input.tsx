import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
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
    const inputRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    return (
      <Pressable
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            borderColor: colors.icon + '20'
          },
          style
        ]}
        accessibilityRole="search"
        onPress={() => inputRef.current?.focus()}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.icon + '80'}
          value={value}
          onChangeText={onChangeText}
          returnKeyType="search"
          accessibilityLabel="Search songs"
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
            accessibilityLabel="Clear search"
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
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
