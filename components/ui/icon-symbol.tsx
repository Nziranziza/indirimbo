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
  'arrow.up': 'ios-share',
  'magnifyingglass': 'search',
  'xmark.circle.fill': 'cancel',
  'xmark.circle': 'cancel',
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
  'info.circle.fill': 'info',
  'lock.shield.fill': 'verified-user',
  'lock.shield': 'security',
  'doc.text.fill': 'description',
  'doc.text': 'description',
  'doc.plaintext': 'article',
  'envelope': 'mail-outline',
  'gearshape': 'settings',
  'checkmark.seal': 'verified',
  'person.2': 'people',
  'hand.thumbsup': 'thumb-up',
  'hand.raised': 'pan-tool',
  'arrow.clockwise': 'refresh',
  'figure.2.and.child.holdinghands': 'family-restroom',
  'sparkles': 'auto-awesome',
  'square.and.arrow.up': 'ios-share',
  'icloud.slash': 'cloud-off',
  'book': 'menu-book',
  'questionmark.circle': 'help-outline',
  'questionmark.circle.fill': 'help',
  'exclamationmark.triangle': 'warning-amber',
  'link': 'link',
  'play.fill': 'play-arrow',
  'chart.bar.fill': 'bar-chart',
  'clock': 'schedule',
  'clock.arrow.circlepath': 'history',
  'xmark': 'close',
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
