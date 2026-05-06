import { forwardRef } from 'react';
import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export const ThemedView = forwardRef<View, ThemedViewProps>(
  ({ style, lightColor, darkColor, ...otherProps }, ref) => {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    return <View ref={ref} style={[{ backgroundColor }, style]} {...otherProps} />;
  },
);

ThemedView.displayName = 'ThemedView';
