// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'arrow.left': 'arrow-back',
  'arrow.right': 'arrow-forward',
  'music.note.list': 'queue-music',
  'music.mic': 'mic',
  'magnifyingglass': 'search',
  'xmark.circle.fill': 'cancel',
  'heart': 'favorite-border',
  'heart.fill': 'favorite',
  'textformat.size': 'format-size',
  'minus': 'remove',
  'plus': 'add',
  'checkmark': 'check',
  'gear': 'settings',
  'sun.max': 'wb-sunny',
  'moon': 'dark-mode',
  'circle.lefthalf.filled': 'brightness-6',
  'paintbrush.fill': 'format-paint',
  'paintpalette.fill': 'palette',
} as IconMapping;

// Fallback icon for unmapped icons
const FALLBACK_ICON: ComponentProps<typeof MaterialIcons>['name'] = 'help-outline';

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name] || FALLBACK_ICON;
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
