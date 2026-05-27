/**
 * Generates static HTML pages for each song at:
 *   dist/song/<playlist>/<number>/index.html
 *
 * Each page is a copy of the built index.html with:
 *   - Song-specific OG meta tags (for WhatsApp/social crawlers)
 *   - A noscript block with full lyrics for search engine crawlers
 *
 * This script must run AFTER fix-web-paths.ts (so index.html is fully ready).
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
const indexPath = path.join(distDir, 'index.html');

// Read the built & fixed index.html as our template
const templateHtml = fs.readFileSync(indexPath, 'utf8');

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

function generateSongHtml(song: Song, playlist: string, playlistName: string, interSongLinks: string): string {
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

  let html = templateHtml;

  // Replace the title
  html = html.replace(/<title[^>]*>.*?<\/title>/, `<title>${title}</title>`);

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

  // Remove the homepage noscript block injected by fix-web-paths.ts
  html = html.replace(/<noscript><article>[\s\S]*?<\/article><\/noscript>/, '');

  // Inject noscript block with full lyrics right after <body>
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

for (const playlist of playlists) {
  const nameByNumber = new Map<string, string>(
    playlist.songs.map((s): [string, string] => [String(s.number), s.name]),
  );
  for (const song of playlist.songs) {
    const dir = path.join(distDir, 'song', playlist.id, String(song.number));
    fs.mkdirSync(dir, { recursive: true });

    const interSongLinks = buildInterSongLinks(song, playlist.id, playlist.songs, nameByNumber);
    const html = generateSongHtml(song, playlist.id, playlist.name, interSongLinks);
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    totalPages++;
  }
}

console.log(`✅ Generated ${totalPages} static song pages with OG tags (using index.html template)`);
