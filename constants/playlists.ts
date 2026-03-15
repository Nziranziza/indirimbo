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
} as const;

export type PlaylistId = keyof typeof PLAYLISTS;

export function getPlaylistName(playlistId: string): string {
  return PLAYLISTS[playlistId as PlaylistId]?.name || playlistId;
}

export function getPlaylistDescription(playlistId: string): string {
  return PLAYLISTS[playlistId as PlaylistId]?.description || '';
}