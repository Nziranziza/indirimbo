import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { useRef } from 'react';

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: any;
}

export function SearchInput({ value, onChangeText, placeholder = 'Search...', style }: SearchInputProps) {
  const colors = useColors();
  const inputRef = useRef<TextInput>(null);

  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background, 
          borderColor: colors.icon + '20' 
        },
        style
      ]}
      onTouchEnd={() => inputRef.current?.focus()}>
      <IconSymbol name="magnifyingglass" size={20} color={colors.icon} />
      <TextInput
        ref={inputRef}
        style={[styles.input, { color: colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={colors.icon + '80'}
        value={value}
        onChangeText={onChangeText}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} activeOpacity={0.7}>
          <IconSymbol name="xmark.circle.fill" size={20} color={colors.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
}

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
