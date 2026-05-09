import type { Locale } from '@/constants/translations';
import { getLanguagePreference, setLanguagePreference } from '@/utils/storage';
import * as Localization from 'expo-localization';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';

interface LanguageContextType {
  language: Locale;
  setLanguage: (language: Locale) => Promise<void>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function detectDeviceLanguage(): Locale {
  try {
    const code = Localization.getLocales()[0]?.languageCode ?? 'en';
    return code.toLowerCase().startsWith('fr') ? 'fr' : 'en';
  } catch {
    return 'en';
  }
}

function applyHtmlLang(language: Locale) {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    document.documentElement.lang = language;
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Locale>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadPreference = async () => {
      try {
        const stored = await getLanguagePreference();
        if (!mounted) return;
        if (stored) {
          setLanguageState(stored);
          applyHtmlLang(stored);
        } else {
          const detected = detectDeviceLanguage();
          setLanguageState(detected);
          applyHtmlLang(detected);
          // Persist immediately so subsequent launches are deterministic.
          // Failure to persist shouldn't override the in-memory detected value.
          try {
            await setLanguagePreference(detected);
          } catch (persistError) {
            console.error('Error persisting detected language:', persistError);
          }
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
        if (mounted) {
          setLanguageState('en');
          applyHtmlLang('en');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadPreference();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && mounted) {
        loadPreference();
      }
    });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  const handleSetLanguage = async (next: Locale) => {
    await setLanguagePreference(next);
    setLanguageState(next);
    applyHtmlLang(next);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        isLoading,
      }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
