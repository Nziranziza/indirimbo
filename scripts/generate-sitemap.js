#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = process.env.SITE_URL || 'https://indirimbo.rw';
const today = new Date().toISOString().split('T')[0];

// Read the song data files to extract song numbers
const gushimishaSongsPath = path.join(__dirname, '../constants/gushimisha-songs.ts');
const agakizaSongsPath = path.join(__dirname, '../constants/agakiza-songs.ts');

function extractSongNumbers(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const numbers = [];
  // Match song-level "number" fields: preceded by { on a previous line and followed by "name"
  // Song objects start with { then "number": value, "name": ...
  // Verse objects have "type": before "number":
  // So we match "number" followed by "name" (song) vs "number" followed by "content" (verse)
  const regex = /{\s*"?number"?\s*:\s*("[\w]+"|[\d]+)\s*,\s*"?name"?\s*:/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    let num = match[1];
    num = num.replace(/^"|"$/g, '');
    numbers.push(num);
  }
  return numbers;
}

const gushimishaNumbers = extractSongNumbers(gushimishaSongsPath);
const agakizaNumbers = extractSongNumbers(agakizaSongsPath);

// Read category slugs for sitemap
const categoriesPath = path.join(__dirname, '../constants/gushimisha-categories.ts');
function extractCategorySlugs(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = [...content.matchAll(/slug:\s*"([^"]+)"/g)];
  return matches.map((m) => m[1]);
}
const categorySlugs = extractCategorySlugs(categoriesPath);

// Static pages
const staticPages = [
  { url: '', priority: '1.0', changefreq: 'weekly' },
  { url: '/about', priority: '0.6', changefreq: 'monthly' },
  { url: '/support', priority: '0.4', changefreq: 'monthly' },
  { url: '/privacy-policy', priority: '0.3', changefreq: 'yearly' },
  { url: '/terms-of-service', priority: '0.3', changefreq: 'yearly' },
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

// Add static pages
for (const page of staticPages) {
  xml += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
}

// Add playlist pages
const playlistIds = ['agakiza', 'gushimisha'];
for (const id of playlistIds) {
  xml += `  <url>
    <loc>${BASE_URL}/home/playlist/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

// Add category pages
for (const slug of categorySlugs) {
  xml += `  <url>
    <loc>${BASE_URL}/home/category/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
}

// Add song pages
for (const num of gushimishaNumbers) {
  xml += `  <url>
    <loc>${BASE_URL}/song/gushimisha/${encodeURIComponent(num)}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
}

for (const num of agakizaNumbers) {
  xml += `  <url>
    <loc>${BASE_URL}/song/agakiza/${encodeURIComponent(num)}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
}

xml += `</urlset>
`;

// Write to both public/ (source) and dist/ (deployed output)
const publicPath = path.join(__dirname, '../public/sitemap.xml');
const distPath = path.join(__dirname, '../dist/sitemap.xml');
fs.writeFileSync(publicPath, xml);
if (fs.existsSync(path.join(__dirname, '../dist'))) {
  fs.writeFileSync(distPath, xml);
}

console.log(`✅ Generated sitemap.xml with ${staticPages.length} static pages, ${playlistIds.length} playlists, ${categorySlugs.length} categories, ${gushimishaNumbers.length} gushimisha songs, and ${agakizaNumbers.length} agakiza songs`);
