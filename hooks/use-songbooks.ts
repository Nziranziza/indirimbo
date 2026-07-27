import type { PlaylistId } from '@/constants/playlists';
import type { Song } from '@/constants/types';
import { useSongbookPreference } from '@/contexts/songbook-preference-context';
import { useSongs } from '@/contexts/songs-context';
import { useMemo } from 'react';

interface SongbookResult {
  readonly visibleSongs: Record<string, Song[]>;
  readonly allSongsForFavorites: Record<string, Song[]>;
  readonly showCategoryChips: boolean;
  readonly visiblePlaylistIds: readonly PlaylistId[];
}

export function useSongbooks(): SongbookResult {
  const { agakiza, gushimisha, cantiquesKirundi, sdah } = useSongs();
  const { songbookPreference } = useSongbookPreference();

  return useMemo(() => {
    // `sdah` is a hidden collection: it is intentionally absent from every
    // `visibleSongs`/`visiblePlaylistIds` branch below, so it never appears in
    // search, on the home page, or in category chips under any preference. It is
    // included here only so favorited/recent SDAH songs still resolve and render.
    // Its songs remain reachable via direct link / deep link (resolved from the
    // SONGS_BY_PLAYLIST maps in the song and playlist route files).
    const allSongsForFavorites: Record<string, Song[]> = {
      agakiza,
      gushimisha,
      'cantiques-kirundi': cantiquesKirundi,
      'sdah-kinyarwanda': sdah,
    };

    // Every collection except the hidden `sdah` — the most any preference may
    // surface to search/home. `allSongsForFavorites` is deliberately NOT reused
    // for visibility, so `sdah` can never leak through the `all` branch.
    const visibleCollections: Record<string, Song[]> = {
      agakiza,
      gushimisha,
      'cantiques-kirundi': cantiquesKirundi,
    };

    let visibleSongs: Record<string, Song[]>;
    let showCategoryChips: boolean;
    let visiblePlaylistIds: readonly PlaylistId[];

    switch (songbookPreference) {
      case 'kirundi':
        visibleSongs = { 'cantiques-kirundi': cantiquesKirundi };
        showCategoryChips = true;
        visiblePlaylistIds = ['cantiques-kirundi'];
        break;
      case 'all':
        visibleSongs = visibleCollections;
        showCategoryChips = true;
        visiblePlaylistIds = ['gushimisha', 'agakiza', 'cantiques-kirundi'];
        break;
      case 'kinyarwanda':
      default:
        visibleSongs = {
          agakiza,
          gushimisha,
        };
        showCategoryChips = true;
        visiblePlaylistIds = ['gushimisha', 'agakiza'];
        break;
    }

    return { visibleSongs, allSongsForFavorites, showCategoryChips, visiblePlaylistIds };
  }, [agakiza, gushimisha, cantiquesKirundi, sdah, songbookPreference]);
}
