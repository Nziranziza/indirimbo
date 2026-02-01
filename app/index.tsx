import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export default function IndexRedirect() {
  const [redirectPath, setRedirectPath] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      setRedirectPath(null);
      return;
    }

    const storedPath = window.sessionStorage.getItem('spa-redirect');
    if (storedPath) {
      window.sessionStorage.removeItem('spa-redirect');
      setRedirectPath(storedPath);
      return;
    }

    setRedirectPath(null);
  }, []);

  if (redirectPath === undefined) {
    return null;
  }

  if (redirectPath) {
    return <Redirect href={redirectPath === '/' ? '/(tabs)/home' : redirectPath} />;
  }

  return <Redirect href="/(tabs)/home" />;
}
