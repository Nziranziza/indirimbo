import { useRegion } from '@/hooks/use-region';
import { trackEvent } from '@/utils/analytics';
import {
  acceptKirundiPin as storageAcceptKirundiPin,
  getDistinctKirundiViewCount,
  getKirundiPinState,
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
  readonly hasUnlockedKirundi: boolean;
  readonly isLoading: boolean;
  readonly setSongbookAndCompleteOnboarding: (preference: SongbookPreference) => Promise<void>;
  readonly updateSongbookPreference: (preference: SongbookPreference) => Promise<void>;
  readonly acceptKirundiPin: () => Promise<void>;
}

const SongbookPreferenceContext = createContext<SongbookPreferenceContextValue | undefined>(
  undefined,
);

export function SongbookPreferenceProvider({ children }: { children: ReactNode }) {
  const { isBurundi } = useRegion();
  const [preference, setPreference] = useState<SongbookPreference>('kinyarwanda');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(!isBurundi);
  const [hasUnlockedKirundi, setHasUnlockedKirundi] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const kirundiState = await getKirundiPinState();
        if (!mounted) return;
        setHasUnlockedKirundi(kirundiState.acceptedAt !== null);

        if (isBurundi) {
          const [pref, completed] = await Promise.all([
            getSongbookPreference(),
            getOnboardingCompleted(),
          ]);
          if (!mounted) return;
          if (pref) setPreference(pref);
          setHasCompletedOnboarding(completed);
        } else {
          // Non-Burundi users: respect a previously-accepted Kirundi pin by reading
          // the persisted songbook preference; otherwise default to 'kinyarwanda'.
          if (kirundiState.acceptedAt !== null) {
            const pref = await getSongbookPreference();
            if (!mounted) return;
            if (pref) setPreference(pref);
          } else {
            setPreference('kinyarwanda');
          }
          setHasCompletedOnboarding(true);
        }
      } catch (error) {
        console.error('Error loading songbook preference:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();

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

  const handleAcceptKirundiPin = useCallback(async () => {
    try {
      await setSongbookPreference('all');
      await storageAcceptKirundiPin();
      setPreference('all');
      setHasUnlockedKirundi(true);
      const distinctKirundiViews = await getDistinctKirundiViewCount();
      trackEvent('kirundi_pin_accepted', { distinct_kirundi_views: distinctKirundiViews });
    } catch (error) {
      console.error('Error accepting kirundi pin:', error);
    }
  }, []);

  return (
    <SongbookPreferenceContext.Provider
      value={{
        isBurundi,
        songbookPreference: preference,
        hasCompletedOnboarding,
        hasUnlockedKirundi,
        isLoading,
        setSongbookAndCompleteOnboarding,
        updateSongbookPreference: handleUpdateSongbookPreference,
        acceptKirundiPin: handleAcceptKirundiPin,
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
