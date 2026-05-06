import { Fragment, useCallback, useEffect, useState, type ReactNode } from 'react';
import { BackHandler, Dimensions, type LayoutChangeEvent, Platform, Pressable, StyleSheet, View } from 'react-native';

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
  /** Safe-area bottom inset, used to keep the flip-above check inside the visible area on Android. */
  readonly bottomInset?: number;
}

const MENU_WIDTH = 240;
const ROW_HEIGHT = 52;
const MENU_VPAD = 8;
const ANCHOR_GAP = 8;
const SCREEN_EDGE_PAD = 8;
const BACKDROP_DIM = 'rgba(0,0,0,0.55)';
const DESTRUCTIVE_COLOR = '#FF3B30';

export function LyricsContextMenu({
  visible,
  onClose,
  anchor,
  items,
  previewContent,
  previewPaddingVertical = 0,
  bottomInset = 0,
}: Props) {
  const colors = useColors();
  const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
  const [previewHeight, setPreviewHeight] = useState<number | null>(null);

  useEffect(() => {
    if (!visible) setPreviewHeight(null);
  }, [visible]);

  // Android hardware back button dismisses the menu while it's open.
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);

  const handleItemPress = useCallback((action: () => void) => {
    onClose();
    action();
  }, [onClose]);

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

  if (!visible) return null;

  // The overlay sits in the same view tree as the screen content (not in a
  // Modal), so the captured `anchor` from `measureInWindow` and the overlay's
  // own coordinate system match exactly — no platform-specific compensation
  // for status bars or modal coordinate translation.
  return (
    <View style={[StyleSheet.absoluteFill, styles.overlay]} pointerEvents="box-none">
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
    </View>
  );
}

const styles = StyleSheet.create({
  // Sit above any in-screen siblings that set their own stacking (e.g. the
  // SongNavigationBar uses `zIndex: 10`). Android needs `elevation` since
  // it ignores `zIndex` for native draw order.
  overlay: {
    zIndex: 100,
    elevation: 100,
  },
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
