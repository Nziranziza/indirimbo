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
  const { agakiza, gushimisha, cantiquesKirundi } = useSongs();
  const { songbookPreference } = useSongbookPreference();

  return useMemo(() => {
    const allSongsForFavorites: Record<string, Song[]> = {
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
        visibleSongs = allSongsForFavorites;
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
  }, [agakiza, gushimisha, cantiquesKirundi, songbookPreference]);
}
