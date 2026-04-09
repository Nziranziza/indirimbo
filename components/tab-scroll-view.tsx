import { useBottomPadding } from '@/hooks/use-bottom-padding';
import { ScrollView, ScrollViewProps, StyleSheet } from 'react-native';

interface TabScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  hasFab?: boolean;
}

export function TabScrollView({
  children,
  contentContainerStyle,
  hasFab = false,
  style,
  ...props
}: TabScrollViewProps) {
  const paddingBottom = useBottomPadding({ inTabs: true, hasFab });
  return (
    <ScrollView
      style={[styles.scrollView, style]}
      contentContainerStyle={[contentContainerStyle, { paddingBottom }]}
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
