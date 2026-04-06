import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  extraBottomPadding?: number;
}

/**
 * A ScrollView component that automatically handles bottom padding for native tabs
 * Use this instead of regular ScrollView in tab screens to ensure content is not hidden behind the tab bar
 */
export function TabScrollView({
  children,
  contentContainerStyle,
  extraBottomPadding = 0,
  style,
  ...props
}: TabScrollViewProps) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={[styles.scrollView, style]}
      contentContainerStyle={[contentContainerStyle, {
        paddingBottom: insets.bottom + 90 + extraBottomPadding,
      }]}
      showsVerticalScrollIndicator={true}
      scrollEnabled={true}
      keyboardShouldPersistTaps="handled"
      {...props}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});
