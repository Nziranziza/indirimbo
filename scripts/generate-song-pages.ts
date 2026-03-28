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
import { songs as gushimishaSongs, type NewSong } from '../constants/gushimisha-songs';
import { songs as agakizaSongs } from '../constants/agakiza-songs';
import { escapeHtml } from './utils';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://indirimbo.rw';
const OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const distDir = path.join(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

// Read the built & fixed index.html as our template
const templateHtml = fs.readFileSync(indexPath, 'utf8');

// --- helpers ----------------------------------------------------------------

function buildDescription(song: NewSong): string {
  const firstSection = song.body[0];
  if (firstSection) {
    return firstSection.content.replace(/\n/g, ' ');
  }
  return `${song.name} - hymn #${song.number}`;
}

function buildNoscriptContent(song: NewSong, playlist: string, playlistName: string): string {
  const playlistShort = playlist === 'agakiza' ? 'Gakiza' : 'Gushimisha Imana';
  let noscript = `<noscript><article>`;
  noscript += `<h1>${escapeHtml(song.name)}</h1>`;
  noscript += `<h2>Indirimbo ya ${escapeHtml(String(song.number))} mu ${escapeHtml(playlistShort)}</h2>`;

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

function generateSongHtml(song: NewSong, playlist: string, playlistName: string): string {
  const playlistShort = playlist === 'agakiza' ? 'Gakiza' : 'Gushimisha Imana';
  const title = escapeHtml(`${song.name} | Indirimbo ya ${song.number} mu ${playlistShort}`);
  const ogTitle = escapeHtml(`${song.name} | Indirimbo ya ${song.number} mu ${playlistShort}`);
  const description = escapeHtml(buildDescription(song));
  const canonicalUrl = `${BASE_URL}/song/${playlist}/${encodeURIComponent(song.number)}/`;

  // Song-specific meta tags to inject
  const songMeta = `
  <meta name="description" content="${description}" />
  <meta property="og:site_name" content="Indirimbo" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:locale" content="rw_RW" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${ogTitle}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
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
