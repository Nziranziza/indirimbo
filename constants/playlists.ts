import type { IconSymbolName } from '@/components/ui/icon-symbol';
import type { TranslationKey } from '@/constants/translations';

export const PLAYLISTS = {
  gushimisha: {
    id: 'gushimisha',
    name: 'Gushimisha Imana',
    descriptionKey: 'playlist.gushimisha.description',
    icon: 'music.mic',
  },
  agakiza: {
    id: 'agakiza',
    name: 'Agakiza',
    descriptionKey: 'playlist.agakiza.description',
    icon: 'music.note.list',
  },
  'cantiques-kirundi': {
    id: 'cantiques-kirundi',
    name: 'Cantiques Kirundi',
    descriptionKey: 'playlist.cantiquesKirundi.description',
    icon: 'book.fill',
  },
  // Hidden collection — never surfaced in search or on the home page. Songs are
  // only reachable via a direct link or deep link. See hooks/use-songbooks.ts.
  'sdah-kinyarwanda': {
    id: 'sdah-kinyarwanda',
    name: 'SDAH Kinyarwanda',
    descriptionKey: 'playlist.sdah.description',
    icon: 'book.fill',
  },
} as const satisfies Record<string, { id: string; name: string; descriptionKey: TranslationKey; icon: IconSymbolName }>;

export type PlaylistId = keyof typeof PLAYLISTS;

export function getPlaylistName(playlistId: string): string {
  return PLAYLISTS[playlistId as PlaylistId]?.name || playlistId;
}

export function getPlaylistDescriptionKey(playlistId: string): TranslationKey | null {
  return PLAYLISTS[playlistId as PlaylistId]?.descriptionKey ?? null;
}

// "mu Gakiza" (Kinyarwanda — "a-" prefix dropped after "mu") vs "muri Cantiques Kirundi" (Kirundi)
const SONG_LABEL_BY_PLAYLIST: Record<PlaylistId, { preposition: string; shortName: string }> = {
  gushimisha: { preposition: 'mu', shortName: 'Gushimisha Imana' },
  agakiza: { preposition: 'mu', shortName: 'Gakiza' },
  'cantiques-kirundi': { preposition: 'muri', shortName: 'Cantiques Kirundi' },
  'sdah-kinyarwanda': { preposition: 'mu', shortName: 'SDAH Kinyarwanda' },
};

export function getSongTitleLabel(playlistId: string, songNumber: number | string): string {
  const label = SONG_LABEL_BY_PLAYLIST[playlistId as PlaylistId] ?? {
    preposition: 'mu',
    shortName: getPlaylistName(playlistId),
  };
  return `Indirimbo ya ${songNumber} ${label.preposition} ${label.shortName}`;
}