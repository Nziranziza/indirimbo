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
import { gushimishaCategories } from '../constants/gushimisha-categories';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = process.env.SITE_URL || 'https://indirimbo.rw';
const today = new Date().toISOString().split('T')[0];

// Static pages
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/about/', priority: '0.6', changefreq: 'monthly' },
  { url: '/support/', priority: '0.4', changefreq: 'monthly' },
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
const playlistIds = ['agakiza', 'gushimisha'];
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
for (const category of gushimishaCategories) {
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
];

for (const { slug, songs } of songPlaylists) {
  for (const song of songs) {
    xml += `  <url>
    <loc>${BASE_URL}/song/${slug}/${encodeURIComponent(song.number)}/</loc>
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

console.log(`✅ Generated sitemap.xml with ${staticPages.length} static pages, ${playlistIds.length} playlists, ${gushimishaCategories.length} categories, ${gushimishaSongs.length} gushimisha songs, and ${agakizaSongs.length} agakiza songs`);
