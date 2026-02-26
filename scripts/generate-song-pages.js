#!/usr/bin/env node

/**
 * Generates static HTML pages for each song at:
 *   dist/song/<playlist>/<number>/index.html
 *
 * Each page is a copy of the built index.html with:
 *   - Song-specific OG meta tags (for WhatsApp/social crawlers)
 *   - A history.replaceState call to silently rewrite the URL to the
 *     query-param format the SPA expects (no visible redirect)
 *
 * This script must run AFTER fix-web-paths.js (so index.html is fully ready).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://indirimbo.rw';
const OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const distDir = path.join(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

// Read the built & fixed index.html as our template
const templateHtml = fs.readFileSync(indexPath, 'utf8');

// --- helpers ----------------------------------------------------------------

function readSongs(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const songs = [];

  const songRegex = /\{\s*"?number"?\s*:\s*("[\w]+"|[\d]+)\s*,\s*"?name"?\s*:\s*"([^"]+)"/g;
  let match;
  while ((match = songRegex.exec(content)) !== null) {
    const number = match[1].replace(/^"|"$/g, '');
    const name = match[2];

    const afterMatch = content.slice(match.index);
    const verseMatch = afterMatch.match(/"type"\s*:\s*"verse"[\s\S]*?"content"\s*:\s*"([^"]+)"/);
    const firstVerse = verseMatch ? verseMatch[1].replace(/\\n/g, ' ') : '';

    songs.push({ number, name, firstVerse });
  }

  return songs;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildDescription(song, playlistName) {
  if (song.firstVerse) {
    const snippet = song.firstVerse.substring(0, 150);
    return `${song.name} - ${snippet}...`;
  }
  return `${song.name} - ${playlistName} hymn #${song.number}`;
}

function generateSongHtml(song, playlist, playlistName) {
  const title = escapeHtml(`${song.name} - ${playlistName} #${song.number} | Indirimbo`);
  const ogTitle = escapeHtml(`${song.name} | Indirimbo`);
  const description = escapeHtml(buildDescription(song, playlistName));
  const canonicalUrl = `${BASE_URL}/song/${playlist}/${encodeURIComponent(song.number)}`;
  const spaPath = `/song?playlist=${encodeURIComponent(playlist)}&songNumber=${encodeURIComponent(song.number)}`;

  // Song-specific meta tags to inject
  const songMeta = `
  <meta name="description" content="${description}" />
  <meta property="og:site_name" content="Indirimbo" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:image:width" content="1024" />
  <meta property="og:image:height" content="1024" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:locale" content="rw_RW" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${ogTitle}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  <link rel="canonical" href="${canonicalUrl}" />`;

  // Script that silently rewrites the URL before the SPA boots
  const rewriteScript = `<script>history.replaceState(null,'','${spaPath}');</script>`;

  let html = templateHtml;

  // Replace the title
  html = html.replace(/<title[^>]*>.*?<\/title>/, `<title>${title}</title>`);

  // Remove existing default OG/Twitter/description/canonical meta tags
  html = html.replace(/<meta\s+name="description"[^>]*>/g, '');
  html = html.replace(/<meta\s+property="og:[^"]*"[^>]*>/g, '');
  html = html.replace(/<meta\s+name="twitter:[^"]*"[^>]*>/g, '');
  html = html.replace(/<link\s+rel="canonical"[^>]*>/g, '');

  // Inject song-specific meta tags and the URL rewrite script right after <head>
  html = html.replace(/<head>/, `<head>${rewriteScript}${songMeta}`);

  return html;
}

// --- main -------------------------------------------------------------------

const playlists = [
  {
    id: 'gushimisha',
    name: 'Gushimisha Imana',
    file: path.join(__dirname, '../constants/gushimisha-songs.ts'),
  },
  {
    id: 'agakiza',
    name: 'Agakiza',
    file: path.join(__dirname, '../constants/agakiza-songs.ts'),
  },
];

let totalPages = 0;

for (const playlist of playlists) {
  const songs = readSongs(playlist.file);

  for (const song of songs) {
    const dir = path.join(distDir, 'song', playlist.id, String(song.number));
    fs.mkdirSync(dir, { recursive: true });

    const html = generateSongHtml(song, playlist.id, playlist.name);
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    totalPages++;
  }
}

console.log(`✅ Generated ${totalPages} static song pages with OG tags (using index.html template)`);
