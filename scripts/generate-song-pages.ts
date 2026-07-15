/**
 * Finalizes the static HTML page for each song at:
 *   dist/song/<playlist>/<number>/index.html
 *
 * Expo's static export now prerenders each song route to real, visible HTML
 * (title + lyrics in #root) at dist/song/<playlist>/<number>.html — that
 * server-rendered content is what gives song pages a fast LCP. This script takes
 * each of those prerendered pages and augments it with:
 *   - Song-specific title + OG/Twitter meta tags (for WhatsApp/social crawlers)
 *   - MusicComposition + BreadcrumbList JSON-LD
 *   - A noscript block with full lyrics + internal links (no-JS / crawler fallback)
 * then rewrites it to <number>/index.html (matching the canonical trailing-slash
 * URLs) and removes the flat <number>.html. The prerendered #root is preserved.
 *
 * This script must run AFTER fix-web-paths.ts.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { songs as gushimishaSongs } from '../constants/gushimisha-songs';
import { songs as agakizaSongs } from '../constants/agakiza-songs';
import { songs as kirundiSongs } from '../constants/cantiques-kirundi-songs';
import { gushimishaCategories, type SongCategory } from '../constants/gushimisha-categories';
import { cantiquesKirundiCategories } from '../constants/cantiques-kirundi-categories';
import { getSongTitleLabel } from '../constants/playlists';
import type { Song } from '../constants/types';
import { buildSongSeoDescription } from '../utils/seo-description';
import { escapeHtml, buildJsonLdTag, stripJsonLd } from './utils';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://indirimbo.rw';
const OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const OG_IMAGE_KIRUNDI = `${BASE_URL}/og-image-kirundi.jpg`;
const distDir = path.join(__dirname, '../dist');

const SONG_CATEGORIES: Record<string, SongCategory[]> = {
  gushimisha: gushimishaCategories,
  'cantiques-kirundi': cantiquesKirundiCategories,
};
const MAX_INTER_SONG_LINKS = 8;

// --- helpers ----------------------------------------------------------------

function songLinkItem(playlist: string, number: number | string, name: string): string {
  const url = `${BASE_URL}/song/${playlist}/${encodeURIComponent(number)}/`;
  return `<li><a href="${url}">${escapeHtml(String(number))}. ${escapeHtml(name)}</a></li>`;
}

/**
 * Builds a crawlable list of links to adjacent (prev/next) and same-category
 * songs, with keyword-rich "{number}. {name}" anchor text. Lives in the
 * noscript block so it strengthens the internal link graph for crawlers
 * without affecting the rendered app.
 */
function buildInterSongLinks(
  song: Song,
  playlist: string,
  songs: readonly Song[],
  nameByNumber: Map<string, string>,
): string {
  const current = String(song.number);
  const seen = new Set<string>([current]);
  const items: string[] = [];

  const pushSong = (s: Song | undefined): void => {
    if (!s) return;
    const key = String(s.number);
    if (seen.has(key)) return;
    seen.add(key);
    items.push(songLinkItem(playlist, s.number, s.name));
  };

  const idx = songs.findIndex((s) => String(s.number) === current);
  if (idx > 0) pushSong(songs[idx - 1]);
  if (idx >= 0 && idx < songs.length - 1) pushSong(songs[idx + 1]);

  for (const category of SONG_CATEGORIES[playlist] ?? []) {
    if (!category.songs.some((n) => String(n) === current)) continue;
    for (const n of category.songs) {
      const key = String(n);
      const name = nameByNumber.get(key);
      if (!name || seen.has(key)) continue;
      seen.add(key);
      items.push(songLinkItem(playlist, n, name));
      if (items.length >= MAX_INTER_SONG_LINKS) break;
    }
    if (items.length >= MAX_INTER_SONG_LINKS) break;
  }

  if (items.length === 0) return '';
  return `<h2>Izindi ndirimbo</h2><ul>${items.join('')}</ul>`;
}

function buildNoscriptContent(song: Song, playlist: string, playlistName: string, interSongLinks: string): string {
  let noscript = `<noscript><article>`;
  noscript += `<h1>${escapeHtml(String(song.number))}. ${escapeHtml(song.name)}</h1>`;
  noscript += `<h2>${escapeHtml(getSongTitleLabel(playlist, song.number))}</h2>`;

  for (const section of song.body) {
    if (section.type === 'chorus') {
      noscript += `<p><strong>Amasakramentu:</strong><br/>`;
    } else {
      noscript += `<p><strong>${escapeHtml(String(section.number || ''))}.</strong> `;
    }
    noscript += escapeHtml(section.content).replace(/\n/g, '<br/>');
    noscript += `</p>`;
  }

  noscript += interSongLinks;

  noscript += `<nav>`;
  noscript += `<a href="${BASE_URL}/playlist/${playlist}">${escapeHtml(playlistName)}</a>`;
  noscript += ` | <a href="${BASE_URL}">Indirimbo</a>`;
  noscript += `</nav>`;
  noscript += `</article></noscript>`;
  return noscript;
}

function augmentSongHtml(baseHtml: string, song: Song, playlist: string, playlistName: string, interSongLinks: string): string {
  const titleText = `${song.name} | ${getSongTitleLabel(playlist, song.number)}`;
  const title = escapeHtml(titleText);
  const ogTitle = title;
  const description = escapeHtml(buildSongSeoDescription(song, playlist));
  const canonicalUrl = `${BASE_URL}/song/${playlist}/${encodeURIComponent(song.number)}/`;
  const ogImage = playlist === 'cantiques-kirundi' ? OG_IMAGE_KIRUNDI : OG_IMAGE;

  // Song-specific meta tags to inject.
  // Tags re-rendered by <PageHead> at runtime get data-rh="true" so react-helmet-async
  // replaces them in place instead of appending duplicates after hydration.
  const songMeta = `
  <meta data-rh="true" name="description" content="${description}" />
  <meta property="og:site_name" content="Indirimbo" />
  <meta property="og:type" content="music.song" />
  <meta data-rh="true" property="og:title" content="${ogTitle}" />
  <meta data-rh="true" property="og:description" content="${description}" />
  <meta data-rh="true" property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta data-rh="true" property="og:url" content="${canonicalUrl}" />
  <meta data-rh="true" property="og:locale" content="${playlist === 'cantiques-kirundi' ? 'rn_BI' : 'rw_RW'}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta data-rh="true" name="twitter:title" content="${ogTitle}" />
  <meta data-rh="true" name="twitter:description" content="${description}" />
  <meta data-rh="true" name="twitter:image" content="${ogImage}" />
  <link data-rh="true" rel="canonical" href="${canonicalUrl}" />
  <meta name="apple-itunes-app" content="app-id=6758376573" />`;

  let html = baseHtml;

  // Fill in the (empty) prerendered title. Keep data-rh so react-helmet-async
  // updates it in place on hydration instead of leaving a stale/duplicate.
  html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/, `<title data-rh="true">${title}</title>`);

  // Remove existing default OG/Twitter/description/canonical/keywords/smart-banner meta tags
  // (attributes may appear in any order, including the leading data-rh marker).
  html = html.replace(/<meta\b[^>]*\bname="description"[^>]*>/g, '');
  html = html.replace(/<meta\b[^>]*\bname="keywords"[^>]*>/g, '');
  html = html.replace(/<meta\b[^>]*\bproperty="og:[^"]*"[^>]*>/g, '');
  html = html.replace(/<meta\b[^>]*\bname="twitter:[^"]*"[^>]*>/g, '');
  html = html.replace(/<link\b[^>]*\brel="canonical"[^>]*>/g, '');
  html = html.replace(/<meta\b[^>]*\bname="apple-itunes-app"[^>]*>/g, '');

  // Inject song-specific meta tags right after <head>
  html = html.replace(/<head>/, `<head>${songMeta}`);

  // Strip inherited JSON-LD from homepage template
  html = stripJsonLd(html);

  // Inject song-specific JSON-LD
  const lyricsText = song.body.map((s) => s.content).join('\n\n');
  const inLanguage = playlist === 'cantiques-kirundi' ? 'rn' : 'rw';
  const musicCompositionJsonLd = buildJsonLdTag({
    '@context': 'https://schema.org',
    '@type': 'MusicComposition',
    name: song.name,
    alternativeHeadline: getSongTitleLabel(playlist, song.number),
    musicCompositionForm: 'Hymn',
    inLanguage,
    url: canonicalUrl,
    lyrics: {
      '@type': 'CreativeWork',
      text: lyricsText,
      inLanguage,
    },
    isPartOf: {
      '@type': 'MusicAlbum',
      name: playlistName,
      url: `${BASE_URL}/playlist/${playlist}/`,
    },
  });

  const breadcrumbJsonLd = buildJsonLdTag({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Indirimbo', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: playlistName, item: `${BASE_URL}/playlist/${playlist}/` },
      { '@type': 'ListItem', position: 3, name: song.name, item: canonicalUrl },
    ],
  });

  html = html.replace('</head>', `${musicCompositionJsonLd}\n${breadcrumbJsonLd}\n</head>`);

  // Defensive: drop any inherited <noscript><article> block before injecting ours
  html = html.replace(/<noscript><article>[\s\S]*?<\/article><\/noscript>/, '');

  // Inject noscript block with full lyrics right after <body>. The visible lyrics
  // already live in #root (prerendered) for JS users; this is the no-JS / crawler
  // fallback and carries the internal link graph.
  const noscript = buildNoscriptContent(song, playlist, playlistName, interSongLinks);
  html = html.replace(/<body>/, `<body>${noscript}`);

  return html;
}

// --- main -------------------------------------------------------------------

const playlists = [
  { id: 'gushimisha', name: 'Gushimisha Imana', songs: gushimishaSongs },
  { id: 'agakiza', name: 'Agakiza', songs: agakizaSongs },
  { id: 'cantiques-kirundi', name: 'Cantiques Kirundi', songs: kirundiSongs },
];

let totalPages = 0;
let missingPages = 0;

for (const playlist of playlists) {
  const nameByNumber = new Map<string, string>(
    playlist.songs.map((s): [string, string] => [String(s.number), s.name]),
  );
  for (const song of playlist.songs) {
    const num = String(song.number);
    // Expo prerenders the song route to a flat <number>.html with real content.
    const prerenderedPath = path.join(distDir, 'song', playlist.id, `${num}.html`);
    if (!fs.existsSync(prerenderedPath)) {
      console.warn(`⚠️  No prerendered page for ${playlist.id}/${num} — skipping`);
      missingPages++;
      continue;
    }

    const baseHtml = fs.readFileSync(prerenderedPath, 'utf8');
    const interSongLinks = buildInterSongLinks(song, playlist.id, playlist.songs, nameByNumber);
    const html = augmentSongHtml(baseHtml, song, playlist.id, playlist.name, interSongLinks);

    // Rewrite to <number>/index.html (canonical trailing-slash URL) and drop the
    // flat file so there's a single source of truth per song.
    const dir = path.join(distDir, 'song', playlist.id, num);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    fs.rmSync(prerenderedPath);
    totalPages++;
  }
}

// A broken export (routes not matched by generateStaticParams, or a changed
// output-path convention) would silently skip pages and still exit 0. Fail hard
// when nothing was generated or an unexpected fraction is missing, so CI catches
// a structurally broken build instead of shipping blank song pages.
const expectedPages = totalPages + missingPages;
const MAX_MISSING_RATIO = 0.05;
if (expectedPages === 0 || missingPages / expectedPages > MAX_MISSING_RATIO) {
  throw new Error(
    `Song page generation aborted: ${missingPages}/${expectedPages} prerendered pages missing — the static export looks broken.`,
  );
}

const missingSuffix = missingPages > 0 ? ` (${missingPages} missing prerenders skipped)` : '';
console.log(`✅ Finalized ${totalPages} prerendered song pages with SEO meta + noscript${missingSuffix}`);
