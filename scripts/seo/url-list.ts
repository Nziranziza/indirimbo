/**
 * Single source of truth for all canonical, indexable URLs on indirimbo.rw.
 * Both submit-indexnow.ts and submit-indexing-api.ts use this; keep it
 * aligned with scripts/generate-sitemap.ts.
 */

import { songs as gushimishaSongs } from '../../constants/gushimisha-songs';
import { songs as agakizaSongs } from '../../constants/agakiza-songs';
import { songs as kirundiSongs } from '../../constants/cantiques-kirundi-songs';
import { gushimishaCategories } from '../../constants/gushimisha-categories';
import { cantiquesKirundiCategories } from '../../constants/cantiques-kirundi-categories';

export const BASE_URL = 'https://indirimbo.rw';

const STATIC_PATHS: readonly string[] = [
  '/',
  '/about/',
  '/download/',
  '/download-kirundi/',
  '/support/',
  '/privacy-policy/',
  '/terms-of-service/',
];

const PLAYLIST_IDS = ['agakiza', 'gushimisha', 'cantiques-kirundi'] as const;

export interface UrlGroups {
  readonly static: readonly string[];
  readonly playlists: readonly string[];
  readonly categories: readonly string[];
  readonly songs: readonly string[];
}

export function buildUrlGroups(): UrlGroups {
  const staticUrls = STATIC_PATHS.map((p) => `${BASE_URL}${p}`);

  const playlistUrls = PLAYLIST_IDS.map((id) => `${BASE_URL}/playlist/${id}/`);

  const categoryUrls = [...gushimishaCategories, ...cantiquesKirundiCategories]
    .map((c) => `${BASE_URL}/category/${c.slug}/`);

  const songUrls = [
    ...gushimishaSongs.map((s) => `${BASE_URL}/song/gushimisha/${encodeURIComponent(s.number)}/`),
    ...agakizaSongs.map((s) => `${BASE_URL}/song/agakiza/${encodeURIComponent(s.number)}/`),
    ...kirundiSongs.map((s) => `${BASE_URL}/song/cantiques-kirundi/${encodeURIComponent(s.number)}/`),
  ];

  return { static: staticUrls, playlists: playlistUrls, categories: categoryUrls, songs: songUrls };
}

export function buildAllUrls(): string[] {
  const g = buildUrlGroups();
  return [...g.static, ...g.playlists, ...g.categories, ...g.songs];
}

export function filterUrls(urls: readonly string[], pattern?: string): string[] {
  if (!pattern) return [...urls];
  return urls.filter((u) => u.includes(pattern));
}
