import { lightImpact } from '@/utils/haptics';
import { BottomTabBarButtonProps } from 'expo-router/build/react-navigation/bottom-tabs';
import { PlatformPressable } from 'expo-router/build/react-navigation/elements';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        lightImpact();
        props.onPressIn?.(ev);
      }}
    />
  );
}
