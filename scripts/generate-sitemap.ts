/**
 * Generates sitemap.xml for search engine indexing.
 * Includes static pages, playlists, categories, and all song pages.
 *
 * Writes to both public/ (source) and dist/ (deployed output).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { songs as gushimishaSongs } from '../constants/gushimisha-songs';
import { songs as agakizaSongs } from '../constants/agakiza-songs';
import { songs as kirundiSongs } from '../constants/cantiques-kirundi-songs';
import { gushimishaCategories } from '../constants/gushimisha-categories';
import { cantiquesKirundiCategories } from '../constants/cantiques-kirundi-categories';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = process.env.SITE_URL || 'https://indirimbo.rw';
const today = new Date().toISOString().split('T')[0];

// Static pages
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/about/', priority: '0.6', changefreq: 'monthly' },
  { url: '/download/', priority: '0.5', changefreq: 'monthly' },
  { url: '/download-kirundi/', priority: '0.5', changefreq: 'monthly' },
  { url: '/support/', priority: '0.4', changefreq: 'monthly' },
  { url: '/book-references/', priority: '0.4', changefreq: 'yearly' },
  { url: '/privacy-policy/', priority: '0.3', changefreq: 'yearly' },
  { url: '/terms-of-service/', priority: '0.3', changefreq: 'yearly' },
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
const playlistIds = ['agakiza', 'gushimisha', 'cantiques-kirundi'];
for (const id of playlistIds) {
  xml += `  <url>
    <loc>${BASE_URL}/playlist/${id}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
}

// Add category pages
const allCategories = [...gushimishaCategories, ...cantiquesKirundiCategories];
for (const category of allCategories) {
  xml += `  <url>
    <loc>${BASE_URL}/category/${category.slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`;
}

// Add song pages
const songPlaylists = [
  { slug: 'gushimisha', songs: gushimishaSongs },
  { slug: 'agakiza', songs: agakizaSongs },
  { slug: 'cantiques-kirundi', songs: kirundiSongs },
];

for (const { slug, songs } of songPlaylists) {
  for (const song of songs) {
    xml += `  <url>
    <loc>${BASE_URL}/song/${slug}/${encodeURIComponent(song.number)}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
  }
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

console.log(`✅ Generated sitemap.xml with ${staticPages.length} static pages, ${playlistIds.length} playlists, ${allCategories.length} categories, ${gushimishaSongs.length} gushimisha songs, ${agakizaSongs.length} agakiza songs, and ${kirundiSongs.length} kirundi songs`);
