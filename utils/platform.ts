import { Platform } from 'react-native';

// True when running on iOS 26 or higher (Liquid Glass available).
// Use to gate features that depend on iOS 26 native APIs.
export const IS_IOS_26_OR_HIGHER =
  Platform.OS === 'ios' && parseInt(String(Platform.Version), 10) >= 26;
