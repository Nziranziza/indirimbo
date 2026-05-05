import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Dimensions, type LayoutChangeEvent, Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useColors } from '@/hooks/use-colors';

import { IconSymbol, type IconSymbolName } from './icon-symbol';

export interface LyricsMenuItem {
  readonly key: string;
  readonly label: string;
  readonly icon: IconSymbolName;
  readonly destructive?: boolean;
  readonly onPress: () => void;
}

export interface LyricsMenuAnchor {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

interface Props {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly anchor: LyricsMenuAnchor | null;
  readonly items: readonly LyricsMenuItem[];
  readonly previewContent?: ReactNode;
  readonly previewPaddingVertical?: number;
  /** Safe-area bottom inset (e.g. system nav bar on Android). Subtracted from window height when deciding to flip the menu above. */
  readonly bottomInset?: number;
}

const MENU_WIDTH = 240;
const ROW_HEIGHT = 52;
const MENU_VPAD = 8;
const ANCHOR_GAP = 8;
const SCREEN_EDGE_PAD = 8;
const BACKDROP_DIM = 'rgba(0,0,0,0.55)';
const DESTRUCTIVE_COLOR = '#FF3B30';

export function LyricsContextMenu({ visible, onClose, anchor, items, previewContent, previewPaddingVertical = 0, bottomInset = 0 }: Props) {
  const colors = useColors();
  const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
  const pendingActionRef = useRef<(() => void) | null>(null);
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!visible) setPreviewHeight(null);
  }, [visible]);

  const handleItemPress = useCallback((action: () => void) => {
    pendingActionRef.current = action;
    onClose();
    // On Android, Modal has no onDismiss callback; presenting a sibling
    // dialog/share sheet during the fade isn't problematic, so fire now.
    if (Platform.OS !== 'ios') {
      pendingActionRef.current = null;
      action();
    }
  }, [onClose]);

  const handleDismissed = useCallback(() => {
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    action?.();
  }, []);

  const handlePreviewLayout = useCallback((event: LayoutChangeEvent) => {
    const h = event.nativeEvent.layout.height;
    setPreviewHeight((prev) => (prev === h ? prev : h));
  }, []);

  // Use the actual rendered preview height once measured; fall back to the
  // captured anchor height for the first frame so nothing flashes empty.
  const effectiveHeight = previewHeight ?? anchor?.height ?? 0;
  const menuHeight = items.length * ROW_HEIGHT + MENU_VPAD * 2;

  // The card itself starts above the captured anchor by the top padding so
  // its content (verse/chorus) still lines up with the original section.
  const wrapperTop = anchor ? anchor.y - previewPaddingVertical : 0;

  // On Android, `Dimensions.get('window').height` can include the area
  // covered by the system navigation bar, where the modal can't actually
  // render. Subtract the bottom safe-area inset so the flip-above check
  // uses the truly visible vertical space.
  const usableBottom = windowHeight - bottomInset;

  let menuTop = 0;
  let menuLeft = 0;
  if (anchor) {
    const wantedTop = wrapperTop + effectiveHeight + ANCHOR_GAP;
    const flipsAbove = wantedTop + menuHeight + SCREEN_EDGE_PAD > usableBottom;
    menuTop = flipsAbove ? Math.max(SCREEN_EDGE_PAD, wrapperTop - menuHeight - ANCHOR_GAP) : wantedTop;

    const wantedLeft = anchor.x + ANCHOR_GAP;
    const maxLeft = windowWidth - MENU_WIDTH - SCREEN_EDGE_PAD;
    menuLeft = Math.min(Math.max(SCREEN_EDGE_PAD, wantedLeft), Math.max(SCREEN_EDGE_PAD, maxLeft));
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      onDismiss={handleDismissed}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        {anchor && previewContent && (
          <View
            pointerEvents="none"
            onLayout={handlePreviewLayout}
            style={[
              styles.preview,
              {
                top: wrapperTop,
                left: 0,
                right: 0,
                paddingVertical: previewPaddingVertical,
                backgroundColor: colors.background,
              },
            ]}
          >
            {previewContent}
          </View>
        )}
        {anchor && (!previewContent || previewHeight !== null) && (
          <Pressable
            onPress={(event) => event.stopPropagation()}
            style={[
              styles.menu,
              {
                top: menuTop,
                left: menuLeft,
                width: MENU_WIDTH,
                backgroundColor: colors.background,
              },
            ]}
          >
            {items.map((item, index) => (
              <Fragment key={item.key}>
                {index > 0 && <View style={[styles.separator, { backgroundColor: colors.icon + '20' }]} />}
                <Pressable
                  onPress={() => handleItemPress(item.onPress)}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && { backgroundColor: colors.icon + '15' },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <IconSymbol
                    name={item.icon}
                    size={22}
                    color={item.destructive ? DESTRUCTIVE_COLOR : colors.text}
                  />
                  <ThemedText
                    style={[styles.label, item.destructive ? { color: DESTRUCTIVE_COLOR } : null]}
                  >
                    {item.label}
                  </ThemedText>
                </Pressable>
              </Fragment>
            ))}
          </Pressable>
        )}
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: BACKDROP_DIM,
  },
  preview: {
    position: 'absolute',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
      },
      android: {
        elevation: 10,
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.3,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
      },
    }),
  },
  menu: {
    position: 'absolute',
    borderRadius: 14,
    paddingVertical: MENU_VPAD,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
      android: {
        elevation: 8,
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
      },
    }),
  },
  row: {
    height: ROW_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 14,
  },
  label: {
    fontSize: 16,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 12,
  },
});
