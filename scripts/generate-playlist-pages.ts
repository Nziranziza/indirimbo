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
import { songs as kirundiSongs } from '../constants/cantiques-kirundi-songs';
import { gushimishaCategories } from '../constants/gushimisha-categories';
import { cantiquesKirundiCategories } from '../constants/cantiques-kirundi-categories';
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

interface PageOptions {
  title: string;
  ogTitle: string;
  description: string;
  canonicalUrl: string;
  keywords: string;
  ogImage?: string;
  ogLocale?: string;
  noscriptHtml?: string;
  jsonLdTags?: string;
}

function generatePage({ title, ogTitle, description, canonicalUrl, keywords, ogImage, ogLocale, noscriptHtml, jsonLdTags }: PageOptions): string {
  const escapedTitle = escapeHtml(title);
  const escapedOgTitle = escapeHtml(ogTitle);
  const escapedDescription = escapeHtml(description);
  const escapedKeywords = escapeHtml(keywords);
  const image = ogImage ?? OG_IMAGE;
  const locale = ogLocale ?? 'rw_RW';

  // Tags re-rendered by <PageHead> at runtime get data-rh="true" so react-helmet-async
  // replaces them in place instead of appending duplicates after hydration.
  const metaTags = `
  <meta data-rh="true" name="description" content="${escapedDescription}" />
  <meta data-rh="true" name="keywords" content="${escapedKeywords}" />
  <meta property="og:site_name" content="Indirimbo" />
  <meta property="og:type" content="website" />
  <meta data-rh="true" property="og:title" content="${escapedOgTitle}" />
  <meta data-rh="true" property="og:description" content="${escapedDescription}" />
  <meta data-rh="true" property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta data-rh="true" property="og:url" content="${canonicalUrl}" />
  <meta data-rh="true" property="og:locale" content="${locale}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta data-rh="true" name="twitter:title" content="${escapedOgTitle}" />
  <meta data-rh="true" name="twitter:description" content="${escapedDescription}" />
  <meta data-rh="true" name="twitter:image" content="${image}" />
  <link data-rh="true" rel="canonical" href="${canonicalUrl}" />
  <meta name="apple-itunes-app" content="app-id=6758376573" />`;

  let html = templateHtml;

  // Replace the title
  html = html.replace(/<title[^>]*>.*?<\/title>/, `<title>${escapedTitle}</title>`);

  // Remove existing default OG/Twitter/description/canonical/keywords/smart-banner meta tags
  // (attributes may appear in any order, including the leading data-rh marker).
  html = html.replace(/<meta\b[^>]*\bname="description"[^>]*>/g, '');
  html = html.replace(/<meta\b[^>]*\bname="keywords"[^>]*>/g, '');
  html = html.replace(/<meta\b[^>]*\bproperty="og:[^"]*"[^>]*>/g, '');
  html = html.replace(/<meta\b[^>]*\bname="twitter:[^"]*"[^>]*>/g, '');
  html = html.replace(/<link\b[^>]*\brel="canonical"[^>]*>/g, '');
  html = html.replace(/<meta\b[^>]*\bname="apple-itunes-app"[^>]*>/g, '');

  // Inject specific meta tags right after <head>
  html = html.replace(/<head>/, `<head>${metaTags}`);

  // Strip inherited JSON-LD from homepage template
  html = stripJsonLd(html);

  // Inject page-specific JSON-LD
  if (jsonLdTags) {
    html = html.replace('</head>', `${jsonLdTags}\n</head>`);
  }

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
  {
    id: 'cantiques-kirundi',
    name: 'Cantiques Kirundi',
    songs: kirundiSongs,
    keywords: 'cantiques kirundi, indirimbo zo guhimbaza imana, burundian hymns, worship songs, kirundi',
  },
];

for (const playlist of playlists) {
  const description = `Browse all ${playlist.songs.length} songs in the ${playlist.name} hymnbook. ${playlist.id === 'cantiques-kirundi' ? 'Burundian' : 'Rwandan'} church worship songs with full lyrics.`;
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

  const collectionJsonLd = buildJsonLdTag({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: playlist.name,
    description,
    url: canonicalUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: playlist.songs.length,
      itemListElement: playlist.songs.map((song, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: song.name,
        url: `${BASE_URL}/song/${playlist.id}/${encodeURIComponent(song.number)}/`,
      })),
    },
  });

  const breadcrumbJsonLd = buildJsonLdTag({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Indirimbo', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: playlist.name, item: canonicalUrl },
    ],
  });

  const html = generatePage({
    title: `${playlist.name} | Indirimbo`,
    ogTitle: `${playlist.name} | Indirimbo`,
    description,
    canonicalUrl,
    keywords: playlist.keywords,
    ogImage: playlist.id === 'cantiques-kirundi' ? OG_IMAGE_KIRUNDI : undefined,
    ogLocale: playlist.id === 'cantiques-kirundi' ? 'rn_BI' : undefined,
    noscriptHtml: noscript,
    jsonLdTags: `${collectionJsonLd}\n${breadcrumbJsonLd}`,
  });

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  totalPages++;
}

// Generate category pages
const categoryPlaylists = [
  {
    playlistId: 'gushimisha',
    playlistName: 'Gushimisha Imana',
    categories: gushimishaCategories,
    songMap: new Map(gushimishaSongs.map((s) => [String(s.number), s.name])),
  },
  {
    playlistId: 'cantiques-kirundi',
    playlistName: 'Cantiques Kirundi',
    categories: cantiquesKirundiCategories,
    songMap: new Map(kirundiSongs.map((s) => [String(s.number), s.name])),
  },
];

for (const { playlistId, playlistName, categories, songMap } of categoryPlaylists) {
  for (const category of categories) {
    const description = `Browse ${category.name} hymns from ${playlistName} hymnbook. ${category.songs.length} worship songs with full lyrics.`;
    const canonicalUrl = `${BASE_URL}/category/${category.slug}/`;
    const keywords = `${category.name}, ${playlistName.toLowerCase()}, indirimbo, ${playlistId === 'cantiques-kirundi' ? 'burundian hymns' : 'rwandan hymns'}, worship songs`;

    // Build noscript with song list for crawlers
    let noscript = `<noscript><article>`;
    noscript += `<h1>${escapeHtml(category.name)} - ${escapeHtml(playlistName)}</h1>`;
    noscript += `<p>${escapeHtml(description)}</p><ol>`;
    for (const songNum of category.songs) {
      const songName = songMap.get(String(songNum)) || `Indirimbo ${songNum}`;
      const songUrl = `${BASE_URL}/song/${playlistId}/${encodeURIComponent(songNum)}`;
      noscript += `<li><a href="${songUrl}">${escapeHtml(String(songNum))}. ${escapeHtml(songName)}</a></li>`;
    }
    noscript += `</ol>`;
    noscript += `<nav><a href="${BASE_URL}/playlist/${playlistId}">${escapeHtml(playlistName)}</a> | <a href="${BASE_URL}">Indirimbo</a></nav>`;
    noscript += `</article></noscript>`;

    const dir = path.join(distDir, 'category', category.slug);
    fs.mkdirSync(dir, { recursive: true });

    const collectionJsonLd = buildJsonLdTag({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${category.name} - ${playlistName}`,
      description,
      url: canonicalUrl,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: category.songs.length,
        itemListElement: category.songs.map((songNum, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: songMap.get(String(songNum)) || `Indirimbo ${songNum}`,
          url: `${BASE_URL}/song/${playlistId}/${encodeURIComponent(songNum)}/`,
        })),
      },
    });

    const breadcrumbJsonLd = buildJsonLdTag({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Indirimbo', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: `${category.name} - ${playlistName}`, item: canonicalUrl },
      ],
    });

    const html = generatePage({
      title: `${category.name} - ${playlistName} | Indirimbo`,
      ogTitle: `${category.name} - ${playlistName} | Indirimbo`,
      description,
      canonicalUrl,
      keywords,
      ogImage: playlistId === 'cantiques-kirundi' ? OG_IMAGE_KIRUNDI : undefined,
      ogLocale: playlistId === 'cantiques-kirundi' ? 'rn_BI' : undefined,
      noscriptHtml: noscript,
      jsonLdTags: `${collectionJsonLd}\n${breadcrumbJsonLd}`,
    });

    fs.writeFileSync(path.join(dir, 'index.html'), html);
    totalPages++;
  }
}

const totalCategories = categoryPlaylists.reduce((sum, p) => sum + p.categories.length, 0);
console.log(`✅ Generated ${totalPages} static pages (${playlists.length} playlists + ${totalCategories} categories) with OG tags`);
