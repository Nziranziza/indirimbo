import { useSongbookPreference } from '@/contexts/songbook-preference-context';
import { trackEvent } from '@/utils/analytics';
import { successNotification } from '@/utils/haptics';
import {
  getDistinctKirundiViewCount,
  getKirundiPinState,
  recordKirundiPinDismissed,
  recordKirundiPinShown,
} from '@/utils/storage';
import { useCallback, useEffect, useRef, useState } from 'react';

const KIRUNDI_PLAYLIST = 'cantiques-kirundi';
const DISTINCT_KIRUNDI_THRESHOLD = 3;
const SHOW_DELAY_MS = 2_000;
const COOLDOWN_MS = 2 * 24 * 60 * 60 * 1000;
const MAX_GLOBAL_DISMISSALS = 3;

interface UseKirundiPinSuggestionOptions {
  readonly playlist?: string;
  readonly songNumber?: number | string;
}

interface UseKirundiPinSuggestionReturn {
  readonly showBanner: boolean;
  readonly handleAccept: () => void;
  readonly handleDismiss: () => void;
}

export function useKirundiPinSuggestion({
  playlist,
  songNumber,
}: UseKirundiPinSuggestionOptions): UseKirundiPinSuggestionReturn {
  const { isBurundi, songbookPreference, acceptKirundiPin } = useSongbookPreference();
  const [showBanner, setShowBanner] = useState(false);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const evaluatedRef = useRef(false);
  const acceptedRef = useRef(false);
  const songKeyRef = useRef('');

  const clearTimers = useCallback(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);

  // Reset on song change
  useEffect(() => {
    const key = playlist && songNumber !== undefined ? `${playlist}:${songNumber}` : '';
    if (key !== songKeyRef.current) {
      songKeyRef.current = key;
      evaluatedRef.current = false;
      acceptedRef.current = false;
      setShowBanner(false);
      clearTimers();
    }
  }, [playlist, songNumber, clearTimers]);

  useEffect(() => {
    if (evaluatedRef.current) return;
    if (!playlist || songNumber === undefined) return;
    if (isBurundi) return;
    if (playlist !== KIRUNDI_PLAYLIST) return;
    if (songbookPreference !== 'kinyarwanda') return;

    evaluatedRef.current = true;
    let cancelled = false;

    async function evaluate() {
      const state = await getKirundiPinState();
      if (cancelled) return;
      if (state.acceptedAt !== null) return;
      if (state.dismissCount >= MAX_GLOBAL_DISMISSALS) return;
      if (state.lastShownAt && Date.now() - state.lastShownAt < COOLDOWN_MS) return;

      const distinctViews = await getDistinctKirundiViewCount();
      if (cancelled || distinctViews < DISTINCT_KIRUNDI_THRESHOLD) return;

      showTimerRef.current = setTimeout(() => {
        if (cancelled) return;
        setShowBanner(true);
        recordKirundiPinShown().catch(console.error);
        trackEvent('kirundi_pin_shown', { distinct_kirundi_views: distinctViews });
      }, SHOW_DELAY_MS);
    }

    evaluate().catch(console.error);
    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [playlist, songNumber, isBurundi, songbookPreference, clearTimers]);

  const handleAccept = useCallback(() => {
    acceptedRef.current = true;
    successNotification();
    acceptKirundiPin().catch(console.error);
  }, [acceptKirundiPin]);

  const handleDismiss = useCallback(() => {
    setShowBanner(false);
    clearTimers();
    if (acceptedRef.current) return;
    recordKirundiPinDismissed()
      .then(async () => {
        const state = await getKirundiPinState();
        trackEvent('kirundi_pin_dismissed', { dismiss_count: state.dismissCount });
      })
      .catch(console.error);
  }, [clearTimers]);

  return { showBanner, handleAccept, handleDismiss };
}
