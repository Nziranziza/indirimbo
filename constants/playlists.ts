export const PLAYLISTS = {
  gushimisha: {
    id: 'gushimisha',
    name: 'Gushimisha Imana',
    description: 'Songs of praise',
  },
  agakiza: {
    id: 'agakiza',
    name: 'Agakiza',
    description: 'Songs of salvation',
  },
  'cantiques-kirundi': {
    id: 'cantiques-kirundi',
    name: 'Cantiques Kirundi',
    description: 'Indirimbo zo Guhimbaza Imana',
  },
} as const;

export type PlaylistId = keyof typeof PLAYLISTS;

export function getPlaylistName(playlistId: string): string {
  return PLAYLISTS[playlistId as PlaylistId]?.name || playlistId;
}

export function getPlaylistDescription(playlistId: string): string {
  return PLAYLISTS[playlistId as PlaylistId]?.description || '';
}

// "mu Gakiza" (Kinyarwanda — "a-" prefix dropped after "mu") vs "muri Cantiques Kirundi" (Kirundi)
const SONG_LABEL_BY_PLAYLIST: Record<PlaylistId, { preposition: string; shortName: string }> = {
  gushimisha: { preposition: 'mu', shortName: 'Gushimisha Imana' },
  agakiza: { preposition: 'mu', shortName: 'Gakiza' },
  'cantiques-kirundi': { preposition: 'muri', shortName: 'Cantiques Kirundi' },
};

export function getSongTitleLabel(playlistId: string, songNumber: number | string): string {
  const label = SONG_LABEL_BY_PLAYLIST[playlistId as PlaylistId] ?? {
    preposition: 'mu',
    shortName: getPlaylistName(playlistId),
  };
  return `Indirimbo ya ${songNumber} ${label.preposition} ${label.shortName}`;
}