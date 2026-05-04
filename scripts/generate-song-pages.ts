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
import { getSongTitleLabel } from '../constants/playlists';
import type { Song } from '../constants/types';
import { escapeHtml, buildJsonLdTag, stripJsonLd } from './utils';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://indirimbo.rw';
const OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const OG_IMAGE_KIRUNDI = `${BASE_URL}/og-image-kirundi.jpg`;
const distDir = path.join(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

// Read the built & fixed index.html as our template
const templateHtml = fs.readFileSync(indexPath, 'utf8');

// --- helpers ----------------------------------------------------------------

function buildDescription(song: Song): string {
  const firstSection = song.body[0];
  if (firstSection) {
    return firstSection.content.replace(/\n/g, ' ');
  }
  return `${song.name} - hymn #${song.number}`;
}

function buildNoscriptContent(song: Song, playlist: string, playlistName: string): string {
  let noscript = `<noscript><article>`;
  noscript += `<h1>${escapeHtml(song.name)}</h1>`;
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

  noscript += `<nav>`;
  noscript += `<a href="${BASE_URL}/playlist/${playlist}">${escapeHtml(playlistName)}</a>`;
  noscript += ` | <a href="${BASE_URL}">Indirimbo</a>`;
  noscript += `</nav>`;
  noscript += `</article></noscript>`;
  return noscript;
}

function generateSongHtml(song: Song, playlist: string, playlistName: string): string {
  const titleText = `${song.name} | ${getSongTitleLabel(playlist, song.number)}`;
  const title = escapeHtml(titleText);
  const ogTitle = title;
  const description = escapeHtml(buildDescription(song));
  const canonicalUrl = `${BASE_URL}/song/${playlist}/${encodeURIComponent(song.number)}/`;
  const ogImage = playlist === 'cantiques-kirundi' ? OG_IMAGE_KIRUNDI : OG_IMAGE;

  // Song-specific meta tags to inject
  const songMeta = `
  <meta name="description" content="${description}" />
  <meta property="og:site_name" content="Indirimbo" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:locale" content="rw_RW" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${ogTitle}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImage}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="apple-itunes-app" content="app-id=6758376573" />`;

  let html = templateHtml;

  // Replace the title
  html = html.replace(/<title[^>]*>.*?<\/title>/, `<title>${title}</title>`);

  // Remove existing default OG/Twitter/description/canonical/smart-banner meta tags
  html = html.replace(/<meta\s+name="description"[^>]*>/g, '');
  html = html.replace(/<meta\s+property="og:[^"]*"[^>]*>/g, '');
  html = html.replace(/<meta\s+name="twitter:[^"]*"[^>]*>/g, '');
  html = html.replace(/<link\s+rel="canonical"[^>]*>/g, '');
  html = html.replace(/<meta\s+name="apple-itunes-app"[^>]*>/g, '');

  // Inject song-specific meta tags right after <head>
  html = html.replace(/<head>/, `<head>${songMeta}`);

  // Strip inherited JSON-LD from homepage template
  html = stripJsonLd(html);

  // Inject song-specific JSON-LD
  const lyricsText = song.body.map((s) => s.content).join('\n\n');
  const creativeWorkJsonLd = buildJsonLdTag({
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: song.name,
    text: lyricsText,
    inLanguage: playlist === 'cantiques-kirundi' ? 'rn' : 'rw',
    url: canonicalUrl,
    isPartOf: {
      '@type': 'CreativeWork',
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

  html = html.replace('</head>', `${creativeWorkJsonLd}\n${breadcrumbJsonLd}\n</head>`);

  // Remove the homepage noscript block injected by fix-web-paths.ts
  html = html.replace(/<noscript><article>[\s\S]*?<\/article><\/noscript>/, '');

  // Inject noscript block with full lyrics right after <body>
  const noscript = buildNoscriptContent(song, playlist, playlistName);
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
  for (const song of playlist.songs) {
    const dir = path.join(distDir, 'song', playlist.id, String(song.number));
    fs.mkdirSync(dir, { recursive: true });

    const html = generateSongHtml(song, playlist.id, playlist.name);
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    totalPages++;
  }
}

console.log(`✅ Generated ${totalPages} static song pages with OG tags (using index.html template)`);
