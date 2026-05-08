import { APP_STORE_REVIEW_URL, APP_UNIVERSAL_LINK_URL, PLAY_STORE_REVIEW_URL } from '@/constants/app-links';
import { EngagementPrompt, type EngagementPromptType } from '@/components/ui/engagement-prompt';
import { mediumImpact, successNotification } from '@/utils/haptics';
import { shareSong } from '@/utils/share';
import {
  getEngagementState,
  getFavorites,
  updateEngagementState,
  type EngagementState,
} from '@/utils/storage';
import { useFocusEffect } from 'expo-router';
import * as StoreReview from 'expo-store-review';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Linking, Platform, Share } from 'react-native';
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
const FOURTEEN_DAYS = 14 * 24 * 60 * 60 * 1000;
const READING_DELAY = 30_000;
const FAVORITE_DELAY = 2_000;
const POST_SHARE_DELAY = 1_500;
const PROMPT_BOTTOM_GAP = 8;

const MAX_RATE_DISMISSALS = 3;
const MIN_SONGS_FOR_RATE = 5;
const MIN_FAVORITES_FOR_RATE = 1;
const MIN_DAYS_FOR_RATE = 2;
const MIN_FAVORITES_FOR_RATE_AFTER_SHARE = 1;
const MIN_DAYS_FOR_RATE_AFTER_SHARE = 2;
const MIN_SONGS_FOR_SHARE_APP = 20;
const MIN_FAVORITES_FOR_SHARE_APP = 5;
const MIN_DAYS_FOR_SHARE_APP = 5;

interface CurrentSong {
  readonly playlist: string;
  readonly number: number | string;
  readonly name: string;
}

interface ActivePrompt {
  readonly type: EngagementPromptType;
  readonly songName?: string;
  // Carried for share_song so the share survives the song screen unmounting.
  readonly song?: CurrentSong;
}

interface EngagementContextValue {
  readonly recordSongView: (song: CurrentSong) => void;
  readonly clearSongContext: () => void;
  readonly notifyFavorited: () => void;
  readonly notifyShareSuccess: () => void;
  readonly markAsRated: () => Promise<void>;
  readonly pushBottomChrome: (offset: number) => () => void;
  // 0 → 1 factor that the prompt is visible. FABs use this with useFabLift
  // to animate their lift smoothly above the prompt.
  readonly promptOpen: SharedValue<number>;
}

const EngagementContext = createContext<EngagementContextValue | null>(null);

function isOnCooldown(lastShownAt: number | null, cooldownMs: number): boolean {
  if (!lastShownAt) return false;
  return Date.now() - lastShownAt < cooldownMs;
}

function isEligibleForRateStrict(
  state: EngagementState,
  favoritesCount: number,
  isWeb: boolean,
): boolean {
  return (
    !isWeb &&
    !state.hasRated &&
    state.ratePromptDismissCount < MAX_RATE_DISMISSALS &&
    state.totalSongViews >= MIN_SONGS_FOR_RATE &&
    favoritesCount >= MIN_FAVORITES_FOR_RATE &&
    state.distinctDaysUsed.length >= MIN_DAYS_FOR_RATE &&
    !isOnCooldown(state.lastRatePromptAt, SEVEN_DAYS)
  );
}

function isEligibleForRateAfterShare(
  state: EngagementState,
  favoritesCount: number,
  isWeb: boolean,
): boolean {
  return (
    !isWeb &&
    !state.hasRated &&
    state.ratePromptDismissCount < MAX_RATE_DISMISSALS &&
    favoritesCount >= MIN_FAVORITES_FOR_RATE_AFTER_SHARE &&
    state.distinctDaysUsed.length >= MIN_DAYS_FOR_RATE_AFTER_SHARE &&
    !isOnCooldown(state.lastRatePromptAt, SEVEN_DAYS)
  );
}

function isEligibleForShareApp(
  state: EngagementState,
  favoritesCount: number,
): boolean {
  return (
    (state.totalSongViews >= MIN_SONGS_FOR_SHARE_APP ||
      favoritesCount >= MIN_FAVORITES_FOR_SHARE_APP) &&
    state.distinctDaysUsed.length >= MIN_DAYS_FOR_SHARE_APP &&
    !isOnCooldown(state.lastShareAppPromptAt, FOURTEEN_DAYS)
  );
}

export function EngagementProvider({ children }: { readonly children: ReactNode }) {
  const insets = useSafeAreaInsets();

  const [activePrompt, setActivePrompt] = useState<ActivePrompt | null>(null);
  const [bottomChrome, setBottomChrome] = useState(0);
  const promptOpen = useSharedValue(0);

  const stateRef = useRef<EngagementState | null>(null);
  const currentSongRef = useRef<CurrentSong | null>(null);
  const evaluationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const favoriteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shareTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionPromptShownRef = useRef(false);
  const chromeRegistrationsRef = useRef<Map<symbol, number>>(new Map());
  // Mirror of activePrompt for use inside delayed callbacks — reading state
  // directly there closes over a stale snapshot.
  const activePromptRef = useRef<ActivePrompt | null>(null);
  useEffect(() => {
    activePromptRef.current = activePrompt;
  }, [activePrompt]);

  // Load engagement state once on mount.
  useEffect(() => {
    let cancelled = false;
    getEngagementState()
      .then((s) => {
        if (!cancelled) stateRef.current = s;
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, []);

  // Drive a 0 → 1 visibility factor that FABs scale their target lift by,
  // so they glide above the prompt when it appears and settle back when it
  // dismisses. The actual lift in pixels is computed per-FAB by useFabLift.
  useEffect(() => {
    promptOpen.value = withTiming(activePrompt ? 1 : 0, { duration: 250 });
  }, [activePrompt, promptOpen]);

  const writeState = useCallback(
    async (updater: (prev: EngagementState) => Partial<EngagementState>) => {
      const next = await updateEngagementState(updater);
      stateRef.current = next;
      return next;
    },
    [],
  );

  const showPromptInternal = useCallback(
    (prompt: ActivePrompt) => {
      successNotification();
      activePromptRef.current = prompt;
      setActivePrompt(prompt);
      if (prompt.type !== 'share_song') {
        sessionPromptShownRef.current = true;
        writeState(() => ({ lastPromptShownAt: Date.now() })).catch(console.error);
      }
    },
    [writeState],
  );

  const recordSongView = useCallback(
    (song: CurrentSong) => {
      currentSongRef.current = song;

      writeState((prev) => ({ totalSongViews: prev.totalSongViews + 1 })).catch(console.error);

      if (evaluationTimerRef.current) clearTimeout(evaluationTimerRef.current);
      evaluationTimerRef.current = setTimeout(async () => {
        try {
          if (sessionPromptShownRef.current) return;
          if (activePromptRef.current) return;

          const state = stateRef.current ?? (await getEngagementState());
          const favorites = await getFavorites();
          const isWeb = Platform.OS === 'web';

          if (isOnCooldown(state.lastPromptShownAt, SEVEN_DAYS)) return;

          if (isEligibleForRateStrict(state, favorites.length, isWeb)) {
            showPromptInternal({ type: 'rate' });
          } else if (isEligibleForShareApp(state, favorites.length)) {
            showPromptInternal({ type: 'share_app' });
          }
        } catch (error) {
          console.error('Error evaluating engagement prompt:', error);
        }
      }, READING_DELAY);
    },
    [showPromptInternal, writeState],
  );

  const clearSongContext = useCallback(() => {
    currentSongRef.current = null;
    if (evaluationTimerRef.current) {
      clearTimeout(evaluationTimerRef.current);
      evaluationTimerRef.current = null;
    }
    if (favoriteTimerRef.current) {
      clearTimeout(favoriteTimerRef.current);
      favoriteTimerRef.current = null;
    }
  }, []);

  const notifyFavorited = useCallback(() => {
    const song = currentSongRef.current;
    if (!song) return;
    if (activePromptRef.current) return;

    if (favoriteTimerRef.current) clearTimeout(favoriteTimerRef.current);
    favoriteTimerRef.current = setTimeout(() => {
      if (activePromptRef.current) return;
      showPromptInternal({ type: 'share_song', songName: song.name, song });
    }, FAVORITE_DELAY);
  }, [showPromptInternal]);

  const notifyShareSuccess = useCallback(() => {
    if (shareTimerRef.current) clearTimeout(shareTimerRef.current);
    shareTimerRef.current = setTimeout(async () => {
      try {
        const state = stateRef.current ?? (await getEngagementState());
        const favorites = await getFavorites();
        const isWeb = Platform.OS === 'web';
        if (!isEligibleForRateAfterShare(state, favorites.length, isWeb)) return;
        showPromptInternal({ type: 'rate' });
      } catch (error) {
        console.error('Error evaluating post-share rate prompt:', error);
      }
    }, POST_SHARE_DELAY);
  }, [showPromptInternal]);

  const markAsRated = useCallback(async () => {
    await writeState(() => ({
      hasRated: true,
      lastRatePromptAt: Date.now(),
    }));
  }, [writeState]);

  const pushBottomChrome = useCallback((offset: number) => {
    const id = Symbol('bottomChrome');
    chromeRegistrationsRef.current.set(id, offset);
    const sum = Array.from(chromeRegistrationsRef.current.values()).reduce(
      (acc, v) => acc + v,
      0,
    );
    setBottomChrome(sum);
    return () => {
      chromeRegistrationsRef.current.delete(id);
      const next = Array.from(chromeRegistrationsRef.current.values()).reduce(
        (acc, v) => acc + v,
        0,
      );
      setBottomChrome(next);
    };
  }, []);

  const handleAccept = useCallback(async () => {
    const prompt = activePrompt;
    if (!prompt) return;

    setActivePrompt(null);
    mediumImpact();

    try {
      if (prompt.type === 'rate') {
        const isAvailable = await StoreReview.isAvailableAsync();
        if (isAvailable) {
          await StoreReview.requestReview();
        } else {
          const url = Platform.OS === 'ios' ? APP_STORE_REVIEW_URL : PLAY_STORE_REVIEW_URL;
          if (url) await Linking.openURL(url);
        }
        await writeState(() => ({
          hasRated: true,
          lastRatePromptAt: Date.now(),
        }));
      } else if (prompt.type === 'share_app') {
        await writeState(() => ({ lastShareAppPromptAt: Date.now() }));
        const message = `Check out Indirimbo - Agakiza no Gushimisha Imana\n\n${APP_UNIVERSAL_LINK_URL}/download`;
        const result = await Share.share(
          { message, title: 'Indirimbo - Rwandan Hymns & Worship Songs' },
          { dialogTitle: 'Share Indirimbo' },
        );
        if (Platform.OS !== 'ios' || result.action === 'sharedAction') {
          notifyShareSuccess();
        }
      } else if (prompt.type === 'share_song' && prompt.song) {
        await writeState(() => ({ lastShareSongPromptAt: Date.now() }));
        const completed = await shareSong({
          songName: prompt.song.name,
          playlist: prompt.song.playlist,
          songNumber: prompt.song.number,
        });
        if (completed) notifyShareSuccess();
      }
    } catch (error) {
      console.error('Error handling engagement action:', error);
    }
  }, [activePrompt, notifyShareSuccess, writeState]);

  const handleDismiss = useCallback(() => {
    const prompt = activePrompt;
    if (!prompt) return;

    setActivePrompt(null);

    if (prompt.type === 'rate') {
      writeState((prev) => ({
        ratePromptDismissCount: prev.ratePromptDismissCount + 1,
        lastRatePromptAt: Date.now(),
      })).catch(console.error);
    } else if (prompt.type === 'share_app') {
      writeState(() => ({ lastShareAppPromptAt: Date.now() })).catch(console.error);
    } else if (prompt.type === 'share_song') {
      writeState(() => ({ lastShareSongPromptAt: Date.now() })).catch(console.error);
    }
  }, [activePrompt, writeState]);

  const value = useMemo<EngagementContextValue>(
    () => ({
      recordSongView,
      clearSongContext,
      notifyFavorited,
      notifyShareSuccess,
      markAsRated,
      pushBottomChrome,
      promptOpen,
    }),
    [
      recordSongView,
      clearSongContext,
      notifyFavorited,
      notifyShareSuccess,
      markAsRated,
      pushBottomChrome,
      promptOpen,
    ],
  );

  const promptBottom = insets.bottom + bottomChrome + PROMPT_BOTTOM_GAP;

  return (
    <EngagementContext.Provider value={value}>
      {children}
      {activePrompt ? (
        <EngagementPrompt
          type={activePrompt.type}
          songName={activePrompt.songName}
          bottom={promptBottom}
          onAccept={handleAccept}
          onDismiss={handleDismiss}
        />
      ) : null}
    </EngagementContext.Provider>
  );
}

export function useEngagement(): EngagementContextValue {
  const ctx = useContext(EngagementContext);
  if (!ctx) {
    throw new Error('useEngagement must be used within an EngagementProvider');
  }
  return ctx;
}

export function useBottomChrome(offset: number): void {
  const { pushBottomChrome } = useEngagement();
  useFocusEffect(
    useCallback(() => {
      if (offset <= 0) return;
      const release = pushBottomChrome(offset);
      return release;
    }, [pushBottomChrome, offset]),
  );
}

const PROMPT_HEIGHT = 52;
const PROMPT_GAP = 8;
const FAB_NATURAL_PAD = 16;

// Pixel lift a FAB applies when the prompt is visible, so it sits above the
// prompt with consistent spacing. Scales with promptOpen (0 → 1) for smooth
// animation.
export function useFabLift(inTabs: boolean): SharedValue<number> {
  const { promptOpen } = useEngagement();
  const insets = useSafeAreaInsets();

  const target = useMemo(() => {
    if (inTabs) {
      return PROMPT_HEIGHT;
    }
    // Non-tab screen: FAB is root-mounted with bottom = max(insets.bottom, 16) + 16.
    const fabNormal = Math.max(insets.bottom, FAB_NATURAL_PAD) + FAB_NATURAL_PAD;
    const promptTopRoot = insets.bottom + PROMPT_GAP + PROMPT_HEIGHT;
    return Math.max(0, promptTopRoot + PROMPT_GAP - fabNormal);
  }, [inTabs, insets.bottom]);

  return useDerivedValue(() => promptOpen.value * target);
}
