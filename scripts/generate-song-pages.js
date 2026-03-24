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

    // Extract the body array for this song (from current match to the next song or end)
    const afterMatch = content.slice(match.index);
    // Find the closing of this song's body array
    const bodyEnd = afterMatch.indexOf('],');
    const songBlock = bodyEnd !== -1 ? afterMatch.slice(0, bodyEnd) : afterMatch;

    // Extract all verse/chorus sections
    const sections = [];
    const sectionRegex = /"?type"?\s*:\s*"(verse|chorus)"(?:\s*,\s*"?number"?\s*:\s*(\d+))?\s*,\s*"?content"?\s*:\s*"([^"]+)"/g;
    let sectionMatch;
    while ((sectionMatch = sectionRegex.exec(songBlock)) !== null) {
      sections.push({
        type: sectionMatch[1],
        number: sectionMatch[2] ? Number(sectionMatch[2]) : undefined,
        content: sectionMatch[3].replace(/\\n/g, '\n'),
      });
    }

    const firstVerse = sections.length > 0 ? sections[0].content : '';

    songs.push({ number, name, firstVerse, sections });
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
    // Use the full first verse/chorus, replacing newlines with spaces
    return song.firstVerse.replace(/\n/g, ' ');
  }
  return `${song.name} - ${playlistName} hymn #${song.number}`;
}

function buildNoscriptContent(song, playlist, playlistName) {
  const playlistShort = playlist === 'agakiza' ? 'Gakiza' : 'Gushimisha Imana';
  let noscript = `<noscript><article>`;
  noscript += `<h1>${escapeHtml(song.name)}</h1>`;
  noscript += `<p>Indirimbo ya ${escapeHtml(String(song.number))} mu ${escapeHtml(playlistShort)}</p>`;

  for (const section of song.sections) {
    const label = section.type === 'chorus'
      ? 'Amasakramentu'
      : `${section.number || ''}`;
    if (section.type === 'chorus') {
      noscript += `<p><strong>Amasakramentu:</strong><br/>`;
    } else {
      noscript += `<p><strong>${escapeHtml(String(label))}.</strong> `;
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

function generateSongHtml(song, playlist, playlistName) {
  const playlistShort = playlist === 'agakiza' ? 'Gakiza' : 'Gushimisha Imana';
  const title = escapeHtml(`${song.name} | Indirimbo ya ${song.number} mu ${playlistShort}`);
  const ogTitle = escapeHtml(`${song.name} | Indirimbo ya ${song.number} mu ${playlistShort}`);
  const description = escapeHtml(buildDescription(song, playlistName));
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

  // Inject noscript block with full lyrics right after <body>
  const noscript = buildNoscriptContent(song, playlist, playlistName);
  html = html.replace(/<body>/, `<body>${noscript}`);

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
