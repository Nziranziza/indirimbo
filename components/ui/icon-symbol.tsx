// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
export type IconSymbolName = keyof typeof MAPPING;

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
  'chevron.up': 'keyboard-arrow-up',
  'arrow.left': 'arrow-back',
  'arrow.right': 'arrow-forward',
  'arrow.up.forward': 'open-in-new',
  'arrow.down.circle.fill': 'file-download',
  'music.note.list': 'queue-music',
  'music.mic': 'mic',
  'arrow.up': 'arrow-upward',
  'square.and.arrow.up': 'ios-share',
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
  'sun.max.fill': 'wb-sunny',
  'moon': 'dark-mode',
  'moon.fill': 'dark-mode',
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
  'person.2': 'people-outline',
  'person.2.fill': 'people',
  'hand.thumbsup': 'thumb-up',
  'hand.raised': 'pan-tool',
  'arrow.clockwise': 'refresh',
  'figure.2.and.child.holdinghands': 'family-restroom',
  'sparkles': 'auto-awesome',
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
  'phone.fill': 'call',
  'shield.fill': 'shield',
  'cloud.fill': 'cloud',
  'star.fill': 'star',
  'apple.logo': 'apple',
  'globe': 'public',
  'sunrise.fill': 'wb-twilight',
  'leaf.fill': 'eco',
  'flame.fill': 'local-fire-department',
  'calendar': 'church',
  'hand.wave': 'front-hand',
  'building.columns.fill': 'account-balance',
  'drop.fill': 'opacity',
  'cup.and.saucer.fill': 'local-cafe',
  'gift.fill': 'card-giftcard',
  'wind': 'air',
  'megaphone.fill': 'campaign',
  'hands.clap.fill': 'celebration',
  'figure.mind.and.body': 'self-improvement',
  'lock.open.fill': 'lock-open',
  'quote.bubble.fill': 'format-quote',
  'phone.arrow.down.left': 'phone-callback',
  'arrow.up.heart': 'volunteer-activism',
  'figure.walk': 'directions-walk',
  'crown': 'workspace-premium',
  'moon.stars.fill': 'nights-stay',
  'sunset.fill': 'brightness-3',
  'bell.fill': 'notifications',
  'building.fill': 'church',
  'leaf': 'grass',
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
