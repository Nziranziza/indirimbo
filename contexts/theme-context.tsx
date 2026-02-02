import { getThemePreference, getTintColor, setThemePreference, setTintColor, type ThemePreference, type TintColorKey } from '@/utils/storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, AppState, Platform, useColorScheme as useSystemColorScheme } from 'react-native';


interface ThemeContextType {
  colorScheme: 'light' | 'dark' | null;
  themePreference: ThemePreference | null;
  tintColor: TintColorKey | null;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
  setTintColor: (color: TintColorKey) => Promise<void>;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useSystemColorScheme();
  const [userPreference, setUserPreference] = useState<ThemePreference | null>(null);
  const [tintColor, setTintColorState] = useState<TintColorKey | null>(null);
  const [effectiveScheme, setEffectiveScheme] = useState<'light' | 'dark' | null>(() => {
    // Ensure static export HTML matches the first client render on web.
    if (Platform.OS === 'web') {
      return 'light';
    }
    return systemColorScheme ?? null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web') {
      // On web, update document root color-scheme for proper scrollbar theming
      if (typeof document !== 'undefined' && effectiveScheme) {
        document.documentElement.style.colorScheme = effectiveScheme;
      }
    } else {
      // On native platforms, sync with system UI
      Appearance.setColorScheme(effectiveScheme === "dark" ? "dark" : "light");
    }
  }, [effectiveScheme]);

  // Load preferences immediately on mount
  useEffect(() => {
    let mounted = true;

    const loadPreferences = async () => {
      try {
        const [preference, tint] = await Promise.all([
          getThemePreference(),
          getTintColor(),
        ]);
        if (mounted) {
          setUserPreference(preference);
          setTintColorState(tint);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
        if (mounted) {
          setUserPreference('auto');
          setTintColorState('blue');
          setIsLoading(false);
        }
      }
    };

    loadPreferences();

    // Only listen to app state changes, no polling
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && mounted) {
        loadPreferences();
      }
    });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  // Update effective scheme when preference or system scheme changes
  useEffect(() => {
    if (userPreference === null) return; // Wait for preference to load

    if (userPreference === 'auto') {
      setEffectiveScheme(systemColorScheme ?? null);
    } else {
      setEffectiveScheme(userPreference);
    }
  }, [userPreference, systemColorScheme]);

  const handleSetThemePreference = async (preference: ThemePreference) => {
    await setThemePreference(preference);
    setUserPreference(preference);
    // Immediately update effective scheme
    if (preference === 'auto') {
      setEffectiveScheme(systemColorScheme ?? null);
    } else {
      setEffectiveScheme(preference);
    }
  };

  const handleSetTintColor = async (color: TintColorKey) => {
    await setTintColor(color);
    setTintColorState(color);
  };

  return (
    <ThemeContext.Provider
      value={{
        colorScheme: effectiveScheme,
        themePreference: userPreference,
        tintColor: tintColor ?? 'blue',
        setThemePreference: handleSetThemePreference,
        setTintColor: handleSetTintColor,
        isLoading,
      }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Backward compatibility hook
export function useColorScheme(): 'light' | 'dark' | null {
  const { colorScheme } = useTheme();
  return colorScheme;
}
