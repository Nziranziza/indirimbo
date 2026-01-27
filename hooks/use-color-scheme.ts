import { getThemePreference, type ThemePreference } from '@/utils/storage';
import { useEffect, useState } from 'react';
import { AppState, useColorScheme as useSystemColorScheme } from 'react-native';

export function useColorScheme(): 'light' | 'dark' | null {
  const systemColorScheme = useSystemColorScheme();
  const [userPreference, setUserPreference] = useState<ThemePreference | null>(null);
  const [effectiveScheme, setEffectiveScheme] = useState<'light' | 'dark' | null>(systemColorScheme ?? null);
  const [refreshKey, setRefreshKey] = useState(0);

  const loadPreference = async () => {
    const preference = await getThemePreference();
    setUserPreference(preference);
  };

  useEffect(() => {
    // Load user preference on mount
    loadPreference();

    // Reload preference when app comes to foreground (to pick up changes from settings)
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        loadPreference();
        setRefreshKey(prev => prev + 1);
      }
    });

    // Check periodically when app is active (for immediate updates when settings change)
    // This allows theme changes to take effect immediately without leaving the app
    const interval = setInterval(() => {
      if (AppState.currentState === 'active') {
        loadPreference();
      }
    }, 1000); // Check every second when active

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (userPreference === null) return; // Wait for preference to load

    if (userPreference === 'auto') {
      // Use system preference (handle undefined case)
      setEffectiveScheme(systemColorScheme ?? null);
    } else {
      // Use user's manual preference
      setEffectiveScheme(userPreference);
    }
  }, [userPreference, systemColorScheme, refreshKey]);

  return effectiveScheme;
}

// Export a function to get the current preference (for settings screen)
export async function getCurrentThemePreference(): Promise<ThemePreference> {
  return await getThemePreference();
}
