import {
  dismissFavoriteSuggestion,
  getFavoriteSuggestionState,
  incrementSongViewCount,
  isFavorite as checkIsFavorite,
  isFavoriteSuggestionDismissed,
  recordFavoriteSuggestionDismissed,
  recordFavoriteSuggestionShown,
} from '@/utils/storage';
import { useCallback, useEffect, useRef, useState } from 'react';

const VIEW_THRESHOLD = 3;
const SHOW_DELAY_MS = 2_000;
const AUTO_DISMISS_MS = 10_000;
const COOLDOWN_MS = 2 * 24 * 60 * 60 * 1000; // 2 days
const MAX_GLOBAL_DISMISSALS = 3;

interface UseFavoriteSuggestionOptions {
  readonly playlist?: string;
  readonly songNumber?: number | string;
  readonly isFavorite: boolean;
}

interface UseFavoriteSuggestionReturn {
  readonly showSuggestion: boolean;
  readonly handleDismissSuggestion: () => void;
}

export function useFavoriteSuggestion({
  playlist,
  songNumber,
  isFavorite,
}: UseFavoriteSuggestionOptions): UseFavoriteSuggestionReturn {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoDismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const incrementedRef = useRef(false);
  const songKeyRef = useRef('');

  const clearTimers = useCallback(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (autoDismissTimerRef.current) {
      clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = null;
    }
  }, []);

  // Reset on song change
  useEffect(() => {
    const key = playlist && songNumber !== undefined ? `${playlist}:${songNumber}` : '';
    if (key !== songKeyRef.current) {
      songKeyRef.current = key;
      incrementedRef.current = false;
      setShowSuggestion(false);
      clearTimers();
    }
  }, [playlist, songNumber, clearTimers]);

  // Increment view count and evaluate whether to show suggestion
  useEffect(() => {
    if (!playlist || songNumber === undefined || incrementedRef.current) return;
    incrementedRef.current = true;

    let cancelled = false;

    async function evaluate() {
      const viewCount = await incrementSongViewCount(playlist!, songNumber!);
      if (cancelled || viewCount < VIEW_THRESHOLD) return;

      const favStatus = await checkIsFavorite(playlist!, songNumber!);
      if (cancelled || favStatus) return;

      const dismissed = await isFavoriteSuggestionDismissed(playlist!, songNumber!);
      if (cancelled || dismissed) return;

      // Check global limits: max dismissals and cooldown
      const state = await getFavoriteSuggestionState();
      if (cancelled) return;
      if (state.globalDismissCount >= MAX_GLOBAL_DISMISSALS) return;
      if (state.lastShownAt && Date.now() - state.lastShownAt < COOLDOWN_MS) return;

      showTimerRef.current = setTimeout(() => {
        if (!cancelled) {
          setShowSuggestion(true);
          recordFavoriteSuggestionShown().catch(console.error);

          // Auto-dismiss after 10 seconds
          autoDismissTimerRef.current = setTimeout(() => {
            if (!cancelled) setShowSuggestion(false);
          }, AUTO_DISMISS_MS);
        }
      }, SHOW_DELAY_MS);
    }

    evaluate().catch(console.error);
    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [playlist, songNumber, clearTimers]);

  // Hide when user favorites the song
  useEffect(() => {
    if (isFavorite) {
      setShowSuggestion(false);
      clearTimers();
    }
  }, [isFavorite, clearTimers]);

  const handleDismissSuggestion = useCallback(() => {
    setShowSuggestion(false);
    clearTimers();
    if (playlist && songNumber !== undefined) {
      dismissFavoriteSuggestion(playlist, songNumber).catch(console.error);
      recordFavoriteSuggestionDismissed().catch(console.error);
    }
  }, [playlist, songNumber, clearTimers]);

  return { showSuggestion, handleDismissSuggestion };
}
