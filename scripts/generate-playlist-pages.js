#!/usr/bin/env node

/**
 * Generates static HTML pages for playlists and categories at:
 *   dist/playlist/<name>/index.html
 *   dist/category/<index>/index.html
 *
 * Each page is a copy of the built index.html with:
 *   - Playlist/category-specific OG meta tags (for WhatsApp/social crawlers)
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

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function generatePage({ title, ogTitle, description, canonicalUrl, keywords }) {
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
  <meta property="og:image:width" content="1024" />
  <meta property="og:image:height" content="1024" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:locale" content="rw_RW" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapedOgTitle}" />
  <meta name="twitter:description" content="${escapedDescription}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="apple-itunes-app" content="app-id=6758376573, app-argument=${canonicalUrl}" />`;

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

  return html;
}

// --- Read category data -----------------------------------------------------

function readCategories() {
  const filePath = path.join(__dirname, '../constants/gushimisha-categories.ts');
  const content = fs.readFileSync(filePath, 'utf8');
  const categories = [];

  // Parse each category object: { name: "...", slug: "...", icon: "...", songs: [...] }
  const categoryRegex = /\{\s*\n\s*name:\s*"([^"]+)",\s*\n\s*slug:\s*"([^"]+)",\s*\n\s*icon:\s*"([^"]+)",\s*\n\s*songs:\s*\[([^\]]*)\]/g;
  let match;
  while ((match = categoryRegex.exec(content)) !== null) {
    const name = match[1];
    const slug = match[2];
    // Count songs by extracting numbers from the songs array
    const songsStr = match[4];
    // Count range calls and individual numbers
    const rangeMatches = [...songsStr.matchAll(/range\((\d+),\s*(\d+)\)/g)];
    let songCount = 0;
    for (const r of rangeMatches) {
      songCount += Number(r[2]) - Number(r[1]) + 1;
    }
    // Count individual numbers (not inside range())
    const withoutRanges = songsStr.replace(/\.\.\.range\(\d+,\s*\d+\)/g, '');
    const individualNums = withoutRanges.match(/\b\d+\b/g);
    if (individualNums) {
      songCount += individualNums.length;
    }

    categories.push({ name, slug, songCount });
  }

  return categories;
}

// --- Count songs per playlist -----------------------------------------------

function countSongs(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.match(/\{\s*"?number"?\s*:\s*("[\w]+"|[\d]+)\s*,\s*"?name"?\s*:/g);
  return matches ? matches.length : 0;
}

// --- main -------------------------------------------------------------------

let totalPages = 0;

// Generate playlist pages
const playlists = [
  {
    id: 'gushimisha',
    name: 'Gushimisha Imana',
    file: path.join(__dirname, '../constants/gushimisha-songs.ts'),
    keywords: 'gushimisha imana, indirimbo zo gushimisha imana, rwandan hymns, worship songs, kinyarwanda',
  },
  {
    id: 'agakiza',
    name: 'Agakiza',
    file: path.join(__dirname, '../constants/agakiza-songs.ts'),
    keywords: 'agakiza, indirimbo z\'agakiza, rwandan hymns, worship songs, kinyarwanda',
  },
];

for (const playlist of playlists) {
  const songCount = countSongs(playlist.file);
  const description = `Browse all ${songCount} songs in the ${playlist.name} hymnbook. Rwandan church worship songs with full lyrics.`;
  const canonicalUrl = `${BASE_URL}/home/playlist/${playlist.id}`;

  const dir = path.join(distDir, 'home', 'playlist', playlist.id);
  fs.mkdirSync(dir, { recursive: true });

  const html = generatePage({
    title: `${playlist.name} | Indirimbo`,
    ogTitle: `${playlist.name} | Indirimbo`,
    description,
    canonicalUrl,
    keywords: playlist.keywords,
  });

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  totalPages++;
}

// Generate category pages
const categories = readCategories();

for (const category of categories) {
  const description = `Browse ${category.name} hymns from Gushimisha Imana hymnbook. ${category.songCount} worship songs with full lyrics.`;
  const canonicalUrl = `${BASE_URL}/home/category/${category.slug}`;
  const keywords = `${category.name}, gushimisha imana, indirimbo, indirimbo zo gushimisha imana, rwandan hymns, worship songs`;

  const dir = path.join(distDir, 'home', 'category', category.slug);
  fs.mkdirSync(dir, { recursive: true });

  const html = generatePage({
    title: `${category.name} - Gushimisha Imana | Indirimbo`,
    ogTitle: `${category.name} - Gushimisha Imana | Indirimbo`,
    description,
    canonicalUrl,
    keywords,
  });

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  totalPages++;
}

console.log(`✅ Generated ${totalPages} static pages (${playlists.length} playlists + ${categories.length} categories) with OG tags`);
