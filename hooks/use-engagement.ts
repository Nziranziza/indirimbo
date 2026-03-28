import { APP_STORE_REVIEW_URL, APP_UNIVERSAL_LINK_URL, PLAY_STORE_REVIEW_URL } from '@/constants/app-links';
import { shareSong } from '@/utils/share';
import {
  getEngagementState,
  getFavorites,
  updateEngagementState,
  type EngagementState,
} from '@/utils/storage';
import * as Haptics from 'expo-haptics';
import * as StoreReview from 'expo-store-review';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Linking, Platform, Share } from 'react-native';

export type EngagementPromptType = 'rate' | 'share_app' | 'share_song';

interface EngagementPrompt {
  readonly type: EngagementPromptType;
  readonly songName?: string;
}

interface UseEngagementOptions {
  readonly currentSongName?: string;
  readonly currentSongPlaylist?: string;
  readonly currentSongNumber?: number | string;
  readonly didFavoriteThisSession: boolean;
}

interface UseEngagementReturn {
  readonly prompt: EngagementPrompt | null;
  readonly showPrompt: boolean;
  readonly handleAccept: () => Promise<void>;
  readonly handleDismiss: () => void;
}

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const FOURTEEN_DAYS = 14 * 24 * 60 * 60 * 1000;
const READING_DELAY = 30_000;
const FAVORITE_DELAY = 5_000;
const MAX_RATE_DISMISSALS = 3;
const MIN_SONGS_FOR_RATE = 10;
const MIN_FAVORITES_FOR_RATE = 2;
const MIN_DAYS_FOR_RATE = 3;
const MIN_SONGS_FOR_SHARE_APP = 20;
const MIN_FAVORITES_FOR_SHARE_APP = 5;
const MIN_DAYS_FOR_SHARE_APP = 5;

// Session-level flag: only one prompt per cold start
let promptShownThisSession = false;

function isOnCooldown(lastShownAt: number | null, cooldownMs: number): boolean {
  if (!lastShownAt) return false;
  return Date.now() - lastShownAt < cooldownMs;
}

function evaluatePrompt(
  state: EngagementState,
  favoritesCount: number,
  didFavoriteThisSession: boolean,
  isWeb: boolean,
): EngagementPromptType | null {
  // Share Song: user just favorited — always eligible, bypasses global cooldown
  if (didFavoriteThisSession) {
    return 'share_song';
  }
  const now = Date.now();

  // Global cooldown: 7 days since any prompt
  if (state.lastPromptShownAt && now - state.lastPromptShownAt < SEVEN_DAYS) {
    return null;
  }

  // Rate App: engaged user, not on web
  if (
    !isWeb &&
    !state.hasRated &&
    state.ratePromptDismissCount < MAX_RATE_DISMISSALS &&
    state.totalSongViews >= MIN_SONGS_FOR_RATE &&
    favoritesCount >= MIN_FAVORITES_FOR_RATE &&
    state.distinctDaysUsed.length >= MIN_DAYS_FOR_RATE &&
    !isOnCooldown(state.lastRatePromptAt, SEVEN_DAYS)
  ) {
    return 'rate';
  }

  // Share App: very engaged user
  if (
    (state.totalSongViews >= MIN_SONGS_FOR_SHARE_APP ||
      favoritesCount >= MIN_FAVORITES_FOR_SHARE_APP) &&
    state.distinctDaysUsed.length >= MIN_DAYS_FOR_SHARE_APP &&
    !isOnCooldown(state.lastShareAppPromptAt, FOURTEEN_DAYS)
  ) {
    return 'share_app';
  }

  return null;
}

export function useEngagement({
  currentSongName,
  currentSongPlaylist,
  currentSongNumber,
  didFavoriteThisSession,
}: UseEngagementOptions): UseEngagementReturn {
  const [prompt, setPrompt] = useState<EngagementPrompt | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const stateRef = useRef<EngagementState | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasEvaluatedRef = useRef(false);
  const hasShownShareSongRef = useRef(false);

  // Reset per-song refs when song changes
  useEffect(() => {
    hasEvaluatedRef.current = false;
    hasShownShareSongRef.current = false;
  }, [currentSongPlaylist, currentSongNumber]);

  // Load state and record song view on mount
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const state = await getEngagementState();
      if (cancelled) return;
      stateRef.current = state;

      // Increment unique songs viewed
      if (currentSongPlaylist && currentSongNumber) {
        const newCount = state.totalSongViews + 1;
        await updateEngagementState(() => ({ totalSongViews: newCount }));
        stateRef.current = { ...state, totalSongViews: newCount };
      }
    }

    init().catch(console.error);
    return () => { cancelled = true; };
  }, [currentSongPlaylist, currentSongNumber]);

  // Evaluate prompt after reading delay (or favorite delay)
  useEffect(() => {
    const isShareSongCandidate = didFavoriteThisSession;

    // For non-share-song prompts, respect session flag and evaluated flag
    if (!isShareSongCandidate && (promptShownThisSession || hasEvaluatedRef.current)) return;
    // Don't show share_song if already shown for this favorite or another prompt is visible
    if (isShareSongCandidate && (hasShownShareSongRef.current || showPrompt)) return;

    const delay = isShareSongCandidate ? FAVORITE_DELAY : READING_DELAY;

    timerRef.current = setTimeout(async () => {
      try {
        if (!isShareSongCandidate && promptShownThisSession) return;

        const state = stateRef.current ?? (await getEngagementState());
        const favorites = await getFavorites();
        const isWeb = Platform.OS === 'web';
        const promptType = evaluatePrompt(state, favorites.length, didFavoriteThisSession, isWeb);

        if (promptType) {
          if (promptType === 'share_song') {
            hasShownShareSongRef.current = true;
          } else {
            hasEvaluatedRef.current = true;
            promptShownThisSession = true;
          }

          const newPrompt: EngagementPrompt =
            promptType === 'share_song'
              ? { type: 'share_song', songName: currentSongName }
              : { type: promptType };

          setPrompt(newPrompt);
          setShowPrompt(true);

          if (promptType !== 'share_song') {
            await updateEngagementState(() => ({ lastPromptShownAt: Date.now() }));
          }

          if (process.env.EXPO_OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(console.error);
          }
        } else {
          hasEvaluatedRef.current = true;
        }
      } catch (error) {
        console.error('Error evaluating engagement prompt:', error);
      }
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [didFavoriteThisSession, currentSongName, showPrompt]);

  const handleAccept = useCallback(async () => {
    if (!prompt) return;

    if (process.env.EXPO_OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(console.error);
    }

    try {
      if (prompt.type === 'rate') {
        const isAvailable = await StoreReview.isAvailableAsync();
        if (isAvailable) {
          await StoreReview.requestReview();
        } else {
          const url = Platform.OS === 'ios' ? APP_STORE_REVIEW_URL : PLAY_STORE_REVIEW_URL;
          if (url) await Linking.openURL(url);
        }
        await updateEngagementState(() => ({
          hasRated: true,
          lastRatePromptAt: Date.now(),
        }));
      } else if (prompt.type === 'share_app') {
        const message = `Check out Indirimbo - Agakiza no Gushimisha Imana\n\n${APP_UNIVERSAL_LINK_URL}/download`;
        await Share.share(
          { message, title: 'Indirimbo - Rwandan Hymns & Worship Songs' },
          { dialogTitle: 'Share Indirimbo' },
        );
        await updateEngagementState(() => ({ lastShareAppPromptAt: Date.now() }));
      } else if (prompt.type === 'share_song' && currentSongName && currentSongPlaylist && currentSongNumber) {
        await shareSong({ songName: currentSongName, playlist: currentSongPlaylist, songNumber: currentSongNumber });
        await updateEngagementState(() => ({ lastShareSongPromptAt: Date.now() }));
      }
    } catch (error) {
      console.error('Error handling engagement action:', error);
    }

    setShowPrompt(false);
  }, [prompt, currentSongName, currentSongPlaylist, currentSongNumber]);

  const handleDismiss = useCallback(() => {
    if (!prompt) return;

    setShowPrompt(false);

    if (prompt.type === 'rate') {
      updateEngagementState((prev) => ({
        ratePromptDismissCount: prev.ratePromptDismissCount + 1,
        lastRatePromptAt: Date.now(),
      })).catch(console.error);
    } else if (prompt.type === 'share_app') {
      updateEngagementState(() => ({ lastShareAppPromptAt: Date.now() })).catch(console.error);
    } else if (prompt.type === 'share_song') {
      updateEngagementState(() => ({ lastShareSongPromptAt: Date.now() })).catch(console.error);
    }
  }, [prompt]);

  return { prompt, showPrompt, handleAccept, handleDismiss };
}
