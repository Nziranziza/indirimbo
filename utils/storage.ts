import { TintColorKey } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@indirimbo:favorites';
const RECENT_SONGS_KEY = '@indirimbo:recent_songs';
const FONT_SIZE_KEY = '@indirimbo:font_size';
const THEME_PREFERENCE_KEY = '@indirimbo:theme_preference';
const TINT_COLOR_KEY = '@indirimbo:tint_color';
const RECENT_SEARCHES_KEY = '@indirimbo:recent_searches';
const ENGAGEMENT_KEY = '@indirimbo:engagement';
const SONG_VIEW_COUNTS_KEY = '@indirimbo:song_view_counts';
const FAVORITE_SUGGESTIONS_DISMISSED_KEY = '@indirimbo:favorite_suggestions_dismissed';
const FAVORITE_SUGGESTION_STATE_KEY = '@indirimbo:favorite_suggestion_state';
const UPDATE_SKIP_ACKNOWLEDGED_KEY = '@indirimbo:update_skip_acknowledged';
const MAX_RECENT_SONGS = 20;
const MAX_RECENT_SEARCHES = 5;

export interface FavoriteSong {
  playlist: string;
  songNumber: number | string;
  songName: string;
  likedAt?: number; // Timestamp when the song was liked
}

export interface RecentSong {
  playlist: string;
  songNumber: number | string; // Can be number or string (e.g., "18a", "18b")
  songName: string;
  timestamp: number;
}

export interface RecentSearch {
  query: string;
  timestamp: number;
}

export interface EngagementState {
  readonly totalSongViews: number;
  readonly appOpenCount: number;
  readonly distinctDaysUsed: readonly string[];
  readonly lastPromptShownAt: number | null;
  readonly ratePromptDismissCount: number;
  readonly hasRated: boolean;
  readonly lastRatePromptAt: number | null;
  readonly lastShareAppPromptAt: number | null;
  readonly lastShareSongPromptAt: number | null;
}

const DEFAULT_ENGAGEMENT_STATE: EngagementState = {
  totalSongViews: 0,
  appOpenCount: 0,
  distinctDaysUsed: [],
  lastPromptShownAt: null,
  ratePromptDismissCount: 0,
  hasRated: false,
  lastRatePromptAt: null,
  lastShareAppPromptAt: null,
  lastShareSongPromptAt: null,
};

export type FontSize = 'small' | 'medium' | 'large';
export type ThemePreference = 'light' | 'dark' | 'auto';
export type { TintColorKey } from '@/constants/theme';

// Favorites
export async function getFavorites(): Promise<FavoriteSong[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
}

export async function addFavorite(song: Omit<FavoriteSong, 'likedAt'>): Promise<void> {
  try {
    const favorites = await getFavorites();
    const exists = favorites.some(
      (f) => f.playlist === song.playlist && String(f.songNumber) === String(song.songNumber)
    );
    if (!exists) {
      favorites.push({
        ...song,
        likedAt: Date.now(),
      });
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  } catch (error) {
    console.error('Error adding favorite:', error);
  }
}

export async function removeFavorite(playlist: string, songNumber: number | string): Promise<void> {
  try {
    const favorites = await getFavorites();
    const filtered = favorites.filter(
      (f) => !(f.playlist === playlist && String(f.songNumber) === String(songNumber))
    );
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
}

export async function isFavorite(playlist: string, songNumber: number | string): Promise<boolean> {
  try {
    const favorites = await getFavorites();
    return favorites.some(
      (f) => f.playlist === playlist && String(f.songNumber) === String(songNumber)
    );
  } catch (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
}

// Recent Songs
export async function getRecentSongs(): Promise<RecentSong[]> {
  try {
    const data = await AsyncStorage.getItem(RECENT_SONGS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting recent songs:', error);
    return [];
  }
}

export async function addRecentSong(song: Omit<RecentSong, 'timestamp'>): Promise<void> {
  try {
    const recent = await getRecentSongs();
    // Remove if already exists
    const filtered = recent.filter(
      (r) => !(r.playlist === song.playlist && String(r.songNumber) === String(song.songNumber))
    );
    // Add to beginning
    filtered.unshift({
      ...song,
      timestamp: Date.now(),
    });
    // Keep only last MAX_RECENT_SONGS
    const limited = filtered.slice(0, MAX_RECENT_SONGS);
    await AsyncStorage.setItem(RECENT_SONGS_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error adding recent song:', error);
  }
}

// Font Size
export async function getFontSize(): Promise<FontSize> {
  try {
    const size = await AsyncStorage.getItem(FONT_SIZE_KEY);
    return (size as FontSize) || 'medium';
  } catch (error) {
    console.error('Error getting font size:', error);
    return 'medium';
  }
}

export async function setFontSize(size: FontSize): Promise<void> {
  try {
    await AsyncStorage.setItem(FONT_SIZE_KEY, size);
  } catch (error) {
    console.error('Error setting font size:', error);
  }
}

// Theme Preference
export async function getThemePreference(): Promise<ThemePreference> {
  try {
    const preference = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
    return (preference as ThemePreference) || 'auto';
  } catch (error) {
    console.error('Error getting theme preference:', error);
    return 'auto';
  }
}

export async function setThemePreference(preference: ThemePreference): Promise<void> {
  try {
    await AsyncStorage.setItem(THEME_PREFERENCE_KEY, preference);
  } catch (error) {
    console.error('Error setting theme preference:', error);
  }
}

// Tint Color Preference
export async function getTintColor(): Promise<TintColorKey> {
  try {
    const color = await AsyncStorage.getItem(TINT_COLOR_KEY);
    return (color as TintColorKey) || 'blue';
  } catch (error) {
    console.error('Error getting tint color:', error);
    return 'blue';
  }
}

export async function setTintColor(color: TintColorKey): Promise<void> {
  try {
    await AsyncStorage.setItem(TINT_COLOR_KEY, color);
  } catch (error) {
    console.error('Error setting tint color:', error);
  }
}

// Recent Searches
export async function getRecentSearches(): Promise<RecentSearch[]> {
  try {
    const data = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting recent searches:', error);
    return [];
  }
}

export async function addRecentSearch(query: string): Promise<void> {
  try {
    const trimmed = query.trim();
    if (!trimmed) return;
    const searches = await getRecentSearches();
    const filtered = searches.filter(s => s.query.toLowerCase() !== trimmed.toLowerCase());
    filtered.unshift({ query: trimmed, timestamp: Date.now() });
    const limited = filtered.slice(0, MAX_RECENT_SEARCHES);
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error adding recent search:', error);
  }
}

export async function removeRecentSearch(query: string): Promise<void> {
  try {
    const searches = await getRecentSearches();
    const filtered = searches.filter(s => s.query.toLowerCase() !== query.toLowerCase());
    await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing recent search:', error);
  }
}

export async function clearRecentSearches(): Promise<void> {
  try {
    await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (error) {
    console.error('Error clearing recent searches:', error);
  }
}

// Engagement State
export async function getEngagementState(): Promise<EngagementState> {
  try {
    const data = await AsyncStorage.getItem(ENGAGEMENT_KEY);
    return data ? { ...DEFAULT_ENGAGEMENT_STATE, ...JSON.parse(data) } : DEFAULT_ENGAGEMENT_STATE;
  } catch (error) {
    console.error('Error getting engagement state:', error);
    return DEFAULT_ENGAGEMENT_STATE;
  }
}

// Serializes concurrent updaters so a read→merge→write can't lose updates from
// a parallel writer. Each call queues onto the previous one's tail.
let engagementUpdateQueue: Promise<unknown> = Promise.resolve();

export function updateEngagementState(
  updater: (prev: EngagementState) => Partial<EngagementState>,
): Promise<EngagementState> {
  const next = engagementUpdateQueue.then(async () => {
    const current = await getEngagementState();
    const updates = updater(current);
    const merged = { ...current, ...updates };
    try {
      await AsyncStorage.setItem(ENGAGEMENT_KEY, JSON.stringify(merged));
    } catch (error) {
      console.error('Error updating engagement state:', error);
      throw error;
    }
    return merged;
  });
  // Keep the chain alive even if this update rejects.
  engagementUpdateQueue = next.catch(() => undefined);
  return next;
}

export async function recordAppOpen(): Promise<void> {
  await updateEngagementState((prev) => {
    const today = new Date().toISOString().split('T')[0];
    const distinctDaysUsed = prev.distinctDaysUsed.includes(today)
      ? prev.distinctDaysUsed
      : [...prev.distinctDaysUsed, today];
    return {
      appOpenCount: prev.appOpenCount + 1,
      distinctDaysUsed,
    };
  });
}

// Songbook Preference (Burundi onboarding)
export type SongbookPreference = 'kirundi' | 'kinyarwanda' | 'all';

const SONGBOOK_PREFERENCE_KEY = '@indirimbo:songbook_preference';
const ONBOARDING_COMPLETED_KEY = '@indirimbo:onboarding_completed';

export async function getSongbookPreference(): Promise<SongbookPreference | null> {
  try {
    const preference = await AsyncStorage.getItem(SONGBOOK_PREFERENCE_KEY);
    return (preference as SongbookPreference) ?? null;
  } catch (error) {
    console.error('Error getting songbook preference:', error);
    return null;
  }
}

export async function setSongbookPreference(preference: SongbookPreference): Promise<void> {
  try {
    await AsyncStorage.setItem(SONGBOOK_PREFERENCE_KEY, preference);
  } catch (error) {
    console.error('Error setting songbook preference:', error);
  }
}

export async function getOnboardingCompleted(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
    return value === 'true';
  } catch (error) {
    console.error('Error getting onboarding status:', error);
    return false;
  }
}

export async function setOnboardingCompleted(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
  } catch (error) {
    console.error('Error setting onboarding status:', error);
  }
}

const LAST_SEEN_APP_VERSION_KEY = '@indirimbo:last_seen_app_version';

export async function getLastSeenAppVersion(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(LAST_SEEN_APP_VERSION_KEY);
  } catch (error) {
    console.error('Error getting last-seen app version:', error);
    return null;
  }
}

export async function setLastSeenAppVersion(version: string): Promise<void> {
  try {
    await AsyncStorage.setItem(LAST_SEEN_APP_VERSION_KEY, version);
  } catch (error) {
    console.error('Error setting last-seen app version:', error);
  }
}

// Song View Counts (for favorite suggestions)
function songKey(playlist: string, songNumber: number | string): string {
  return `${playlist}:${songNumber}`;
}

export async function incrementSongViewCount(
  playlist: string,
  songNumber: number | string,
): Promise<number> {
  try {
    const key = songKey(playlist, songNumber);
    const data = await AsyncStorage.getItem(SONG_VIEW_COUNTS_KEY);
    const counts: Record<string, number> = data ? JSON.parse(data) : {};
    counts[key] = (counts[key] ?? 0) + 1;
    await AsyncStorage.setItem(SONG_VIEW_COUNTS_KEY, JSON.stringify(counts));
    return counts[key];
  } catch (error) {
    console.error('Error incrementing song view count:', error);
    return 0;
  }
}

export async function isFavoriteSuggestionDismissed(
  playlist: string,
  songNumber: number | string,
): Promise<boolean> {
  try {
    const key = songKey(playlist, songNumber);
    const data = await AsyncStorage.getItem(FAVORITE_SUGGESTIONS_DISMISSED_KEY);
    const dismissed: readonly string[] = data ? JSON.parse(data) : [];
    return dismissed.includes(key);
  } catch (error) {
    console.error('Error checking favorite suggestion dismissal:', error);
    return false;
  }
}

export async function dismissFavoriteSuggestion(
  playlist: string,
  songNumber: number | string,
): Promise<void> {
  try {
    const key = songKey(playlist, songNumber);
    const data = await AsyncStorage.getItem(FAVORITE_SUGGESTIONS_DISMISSED_KEY);
    const dismissed: string[] = data ? JSON.parse(data) : [];
    if (!dismissed.includes(key)) {
      dismissed.push(key);
      await AsyncStorage.setItem(FAVORITE_SUGGESTIONS_DISMISSED_KEY, JSON.stringify(dismissed));
    }
  } catch (error) {
    console.error('Error dismissing favorite suggestion:', error);
  }
}

// Favorite Suggestion Global State (cooldown + max dismissals)
interface FavoriteSuggestionState {
  readonly globalDismissCount: number;
  readonly lastShownAt: number | null;
}

const DEFAULT_FAVORITE_SUGGESTION_STATE: FavoriteSuggestionState = {
  globalDismissCount: 0,
  lastShownAt: null,
};

export async function getFavoriteSuggestionState(): Promise<FavoriteSuggestionState> {
  try {
    const data = await AsyncStorage.getItem(FAVORITE_SUGGESTION_STATE_KEY);
    return data ? { ...DEFAULT_FAVORITE_SUGGESTION_STATE, ...JSON.parse(data) } : DEFAULT_FAVORITE_SUGGESTION_STATE;
  } catch (error) {
    console.error('Error getting favorite suggestion state:', error);
    return DEFAULT_FAVORITE_SUGGESTION_STATE;
  }
}

export async function recordFavoriteSuggestionShown(): Promise<void> {
  try {
    const state = await getFavoriteSuggestionState();
    await AsyncStorage.setItem(
      FAVORITE_SUGGESTION_STATE_KEY,
      JSON.stringify({ ...state, lastShownAt: Date.now() }),
    );
  } catch (error) {
    console.error('Error recording favorite suggestion shown:', error);
  }
}

export async function recordFavoriteSuggestionDismissed(): Promise<void> {
  try {
    const state = await getFavoriteSuggestionState();
    await AsyncStorage.setItem(
      FAVORITE_SUGGESTION_STATE_KEY,
      JSON.stringify({ ...state, globalDismissCount: state.globalDismissCount + 1 }),
    );
  } catch (error) {
    console.error('Error recording favorite suggestion dismissed:', error);
  }
}

// Update skip acknowledgment — value is the latestVersion the user opted to skip,
// so a newly published latestVersion automatically re-shows the prompt.
export async function getUpdateSkipAcknowledged(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(UPDATE_SKIP_ACKNOWLEDGED_KEY);
  } catch (error) {
    console.error('Error getting update skip acknowledgment:', error);
    return null;
  }
}

export async function setUpdateSkipAcknowledged(version: string): Promise<void> {
  try {
    await AsyncStorage.setItem(UPDATE_SKIP_ACKNOWLEDGED_KEY, version);
  } catch (error) {
    console.error('Error setting update skip acknowledgment:', error);
  }
}
