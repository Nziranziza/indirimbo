/**
 * Generates static HTML pages for playlists and categories at:
 *   dist/playlist/<name>/index.html
 *   dist/category/<slug>/index.html
 *
 * Each page is a copy of the built index.html with:
 *   - Playlist/category-specific OG meta tags (for WhatsApp/social crawlers)
 *
 * This script must run AFTER fix-web-paths.ts (so index.html is fully ready).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { songs as gushimishaSongs } from '../constants/gushimisha-songs';
import { songs as agakizaSongs } from '../constants/agakiza-songs';
import { gushimishaCategories } from '../constants/gushimisha-categories';
import { escapeHtml } from './utils';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://indirimbo.rw';
const OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const distDir = path.join(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

// Read the built & fixed index.html as our template
const templateHtml = fs.readFileSync(indexPath, 'utf8');

// --- helpers ----------------------------------------------------------------

interface PageOptions {
  title: string;
  ogTitle: string;
  description: string;
  canonicalUrl: string;
  keywords: string;
  noscriptHtml?: string;
}

function generatePage({ title, ogTitle, description, canonicalUrl, keywords, noscriptHtml }: PageOptions): string {
  const escapedTitle = escapeHtml(title);
  const escapedOgTitle = escapeHtml(ogTitle);
  const escapedDescription = escapeHtml(description);
  const escapedKeywords = escapeHtml(keywords);

  const metaTags = `
  <meta name="description" content="${escapedDescription}" />
  <meta name="keywords" content="${escapedKeywords}" />
  <meta property="og:site_name" content="Indirimbo" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapedOgTitle}" />
  <meta property="og:description" content="${escapedDescription}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:locale" content="rw_RW" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapedOgTitle}" />
  <meta name="twitter:description" content="${escapedDescription}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="apple-itunes-app" content="app-id=6758376573" />`;

  let html = templateHtml;

  // Replace the title
  html = html.replace(/<title[^>]*>.*?<\/title>/, `<title>${escapedTitle}</title>`);

  // Remove existing default OG/Twitter/description/canonical/keywords/smart-banner meta tags
  html = html.replace(/<meta\s+name="description"[^>]*>/g, '');
  html = html.replace(/<meta\s+name="keywords"[^>]*>/g, '');
  html = html.replace(/<meta\s+property="og:[^"]*"[^>]*>/g, '');
  html = html.replace(/<meta\s+name="twitter:[^"]*"[^>]*>/g, '');
  html = html.replace(/<link\s+rel="canonical"[^>]*>/g, '');
  html = html.replace(/<meta\s+name="apple-itunes-app"[^>]*>/g, '');

  // Inject specific meta tags right after <head>
  html = html.replace(/<head>/, `<head>${metaTags}`);

  // Remove the homepage noscript block injected by fix-web-paths.ts
  html = html.replace(/<noscript><article>[\s\S]*?<\/article><\/noscript>/, '');

  // Inject noscript block with crawlable content right after <body>
  if (noscriptHtml) {
    html = html.replace(/<body>/, `<body>${noscriptHtml}`);
  }

  return html;
}

// --- main -------------------------------------------------------------------

let totalPages = 0;

// Generate playlist pages
const playlists = [
  {
    id: 'gushimisha',
    name: 'Gushimisha Imana',
    songs: gushimishaSongs,
    keywords: 'gushimisha imana, indirimbo zo gushimisha imana, rwandan hymns, worship songs, kinyarwanda',
  },
  {
    id: 'agakiza',
    name: 'Agakiza',
    songs: agakizaSongs,
    keywords: "agakiza, indirimbo z'agakiza, rwandan hymns, worship songs, kinyarwanda",
  },
];

for (const playlist of playlists) {
  const description = `Browse all ${playlist.songs.length} songs in the ${playlist.name} hymnbook. Rwandan church worship songs with full lyrics.`;
  const canonicalUrl = `${BASE_URL}/playlist/${playlist.id}/`;

  // Build noscript with song list for crawlers
  let noscript = `<noscript><article>`;
  noscript += `<h1>${escapeHtml(playlist.name)}</h1>`;
  noscript += `<p>${escapeHtml(description)}</p><ol>`;
  for (const song of playlist.songs) {
    const songUrl = `${BASE_URL}/song/${playlist.id}/${encodeURIComponent(song.number)}`;
    noscript += `<li><a href="${songUrl}">${escapeHtml(String(song.number))}. ${escapeHtml(song.name)}</a></li>`;
  }
  noscript += `</ol>`;
  noscript += `<nav><a href="${BASE_URL}">Indirimbo</a></nav>`;
  noscript += `</article></noscript>`;

  const dir = path.join(distDir, 'playlist', playlist.id);
  fs.mkdirSync(dir, { recursive: true });

  const html = generatePage({
    title: `${playlist.name} | Indirimbo`,
    ogTitle: `${playlist.name} | Indirimbo`,
    description,
    canonicalUrl,
    keywords: playlist.keywords,
    noscriptHtml: noscript,
  });

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  totalPages++;
}

// Generate category pages
const gushimishaSongMap = new Map(gushimishaSongs.map((s) => [String(s.number), s.name]));

for (const category of gushimishaCategories) {
  const description = `Browse ${category.name} hymns from Gushimisha Imana hymnbook. ${category.songs.length} worship songs with full lyrics.`;
  const canonicalUrl = `${BASE_URL}/category/${category.slug}/`;
  const keywords = `${category.name}, gushimisha imana, indirimbo, indirimbo zo gushimisha imana, rwandan hymns, worship songs`;

  // Build noscript with song list for crawlers
  let noscript = `<noscript><article>`;
  noscript += `<h1>${escapeHtml(category.name)} - Gushimisha Imana</h1>`;
  noscript += `<p>${escapeHtml(description)}</p><ol>`;
  for (const songNum of category.songs) {
    const songName = gushimishaSongMap.get(String(songNum)) || `Indirimbo ${songNum}`;
    const songUrl = `${BASE_URL}/song/gushimisha/${encodeURIComponent(songNum)}`;
    noscript += `<li><a href="${songUrl}">${escapeHtml(String(songNum))}. ${escapeHtml(songName)}</a></li>`;
  }
  noscript += `</ol>`;
  noscript += `<nav><a href="${BASE_URL}/playlist/gushimisha">Gushimisha Imana</a> | <a href="${BASE_URL}">Indirimbo</a></nav>`;
  noscript += `</article></noscript>`;

  const dir = path.join(distDir, 'category', category.slug);
  fs.mkdirSync(dir, { recursive: true });

  const html = generatePage({
    title: `${category.name} - Gushimisha Imana | Indirimbo`,
    ogTitle: `${category.name} - Gushimisha Imana | Indirimbo`,
    description,
    canonicalUrl,
    keywords,
    noscriptHtml: noscript,
  });

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  totalPages++;
}

console.log(`✅ Generated ${totalPages} static pages (${playlists.length} playlists + ${gushimishaCategories.length} categories) with OG tags`);
