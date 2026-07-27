import agakizaSongs from "@/constants/agakiza-songs";
import gushimishaSongs from "@/constants/gushimisha-songs";
import cantiquesKirundiSongs from "@/constants/cantiques-kirundi-songs";
import sdahSongs from "@/constants/sdah-songs";
import type { Song } from "@/constants/types";

// Single source of truth for "playlist id → song list". Resolved synchronously
// (not via the async SongsProvider) so the song screen can prerender real lyrics
// and cross-reference links can verify a target song exists without waiting on
// hydration. Both the song screen, the playlist screen, and the reference-link
// resolver read from here.
export const SONGS_BY_PLAYLIST: Record<string, Song[]> = {
  agakiza: agakizaSongs,
  gushimisha: gushimishaSongs,
  "cantiques-kirundi": cantiquesKirundiSongs,
  "sdah-kinyarwanda": sdahSongs,
};

export function getSongsForPlaylist(playlist: string | undefined): Song[] {
  return SONGS_BY_PLAYLIST[playlist ?? ""] ?? [];
}

export function findSong(
  playlist: string | undefined,
  songNumber: number | string | undefined,
): Song | undefined {
  if (songNumber === undefined) return undefined;
  return getSongsForPlaylist(playlist).find(
    (s) => String(s.number) === String(songNumber),
  );
}

// Verse labels ("Verse 1", …) are only useful when a song has more than one
// verse/chorus section. Shared by the song screen and the preview modal.
export function shouldShowVerseLabels(song: Song | undefined): boolean {
  const sections = song?.body?.filter(
    (b) => b.type === "verse" || b.type === "chorus",
  );
  return (sections?.length ?? 0) > 1;
}
