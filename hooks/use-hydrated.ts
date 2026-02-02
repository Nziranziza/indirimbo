import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export function useHydrated() {
  const [hydrated, setHydrated] = useState(Platform.OS !== 'web');

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
