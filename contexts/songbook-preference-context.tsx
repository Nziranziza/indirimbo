import { useRegion } from '@/hooks/use-region';
import {
  getOnboardingCompleted,
  getSongbookPreference,
  setOnboardingCompleted,
  setSongbookPreference,
  type SongbookPreference,
} from '@/utils/storage';
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';

interface SongbookPreferenceContextValue {
  readonly isBurundi: boolean;
  readonly songbookPreference: SongbookPreference;
  readonly hasCompletedOnboarding: boolean;
  readonly isLoading: boolean;
  readonly setSongbookAndCompleteOnboarding: (preference: SongbookPreference) => Promise<void>;
  readonly updateSongbookPreference: (preference: SongbookPreference) => Promise<void>;
}

const SongbookPreferenceContext = createContext<SongbookPreferenceContextValue | undefined>(
  undefined,
);

export function SongbookPreferenceProvider({ children }: { children: ReactNode }) {
  const { isBurundi } = useRegion();
  const [preference, setPreference] = useState<SongbookPreference>('kinyarwanda');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(!isBurundi);
  const [isLoading, setIsLoading] = useState(isBurundi);

  useEffect(() => {
    if (!isBurundi) {
      setPreference('kinyarwanda');
      setHasCompletedOnboarding(true);
      setIsLoading(false);
      return;
    }

    let mounted = true;
    Promise.all([getSongbookPreference(), getOnboardingCompleted()])
      .then(([pref, completed]) => {
        if (!mounted) return;
        if (pref) setPreference(pref);
        setHasCompletedOnboarding(completed);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error loading songbook preference:', error);
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isBurundi]);

  const setSongbookAndCompleteOnboarding = useCallback(
    async (newPreference: SongbookPreference) => {
      try {
        await setSongbookPreference(newPreference);
        await setOnboardingCompleted();
        setPreference(newPreference);
        setHasCompletedOnboarding(true);
      } catch (error) {
        console.error('Error saving songbook preference during onboarding:', error);
      }
    },
    [],
  );

  const handleUpdateSongbookPreference = useCallback(
    async (newPreference: SongbookPreference) => {
      try {
        await setSongbookPreference(newPreference);
        setPreference(newPreference);
      } catch (error) {
        console.error('Error updating songbook preference:', error);
      }
    },
    [],
  );

  return (
    <SongbookPreferenceContext.Provider
      value={{
        isBurundi,
        songbookPreference: preference,
        hasCompletedOnboarding,
        isLoading,
        setSongbookAndCompleteOnboarding,
        updateSongbookPreference: handleUpdateSongbookPreference,
      }}>
      {children}
    </SongbookPreferenceContext.Provider>
  );
}

export function useSongbookPreference(): SongbookPreferenceContextValue {
  const context = useContext(SongbookPreferenceContext);
  if (context === undefined) {
    throw new Error('useSongbookPreference must be used within a SongbookPreferenceProvider');
  }
  return context;
}
