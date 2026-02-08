import { Platform, ScrollView, ScrollViewProps, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TabScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
}

/**
 * A ScrollView component that automatically handles bottom padding for native tabs
 * Use this instead of regular ScrollView in tab screens to ensure content is not hidden behind the tab bar
 */
export function TabScrollView({ 
  children, 
  contentContainerStyle, 
  style,
  ...props 
}: TabScrollViewProps) {
  const isOs = Platform.OS === 'ios';
  const insets = useSafeAreaInsets();
  const bottomPadding = insets.bottom;
  return (
    <ScrollView
      style={[styles.scrollView, style]}
      contentContainerStyle={[contentContainerStyle, {
        paddingBottom: isOs ? 16 : bottomPadding + 90,
      }]}
      contentInsetAdjustmentBehavior={isOs ? 'automatic' : undefined}
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
