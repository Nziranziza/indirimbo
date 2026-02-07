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

export enum playlistKeys {
  guhimbaza = 'guhimbaza',
  gusenga = 'gusenga',
  guhamagara = 'guhamagara',
  gucungurwa = 'gucungurwa',
  guhamya = 'guhamya',
  urukundo = 'urukundo rw\'Imana',
  "gushakaAbandi" = 'gushak\'Abandi',
  "muGitondo" = 'izo mu gitondo',
  "kugarukaKwayesu" = 'kugaruka kwa Yesu',
  "ubukwe" = "ubukwe",
  "kuvukaKwaYesu" = "kuvuka kwa yesu",
  "kwitanga" = "kwitanga",
  "ubugingoBushya" = "ubugingo bushya",
  ijuru = "ijuru",
  abana = "abana",
  impimbano = "izindi mpimbano"
}