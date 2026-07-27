/**
 * Finalizes the static HTML page for each playlist and category at:
 *   dist/playlist/<name>/index.html
 *   dist/category/<slug>/index.html
 *
 * Expo's static export now prerenders each playlist/category route to real,
 * visible HTML (the song list in #root) at dist/playlist/<name>.html and
 * dist/category/<slug>.html — that server-rendered content is what gives these
 * pages a fast LCP. This script takes each prerendered page and augments it with:
 *   - Playlist/category-specific title + OG/Twitter meta tags (social crawlers)
 *   - CollectionPage + BreadcrumbList JSON-LD
 *   - A noscript block with the song list (no-JS / crawler fallback)
 * then rewrites it to <name>/index.html (matching the canonical trailing-slash
 * URLs) and removes the flat <name>.html. The prerendered #root is preserved.
 *
 * This script must run AFTER fix-web-paths.ts.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { songs as gushimishaSongs } from '../constants/gushimisha-songs';
import { songs as agakizaSongs } from '../constants/agakiza-songs';
import { songs as kirundiSongs } from '../constants/cantiques-kirundi-songs';
import type { Song } from '../constants/types';
import { gushimishaCategories } from '../constants/gushimisha-categories';
import { cantiquesKirundiCategories } from '../constants/cantiques-kirundi-categories';
import { escapeHtml, buildJsonLdTag, stripJsonLd } from './utils';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://indirimbo.rw';
const OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const OG_IMAGE_KIRUNDI = `${BASE_URL}/og-image-kirundi.jpg`;
const distDir = path.join(__dirname, '../dist');
const MAX_MISSING_RATIO = 0.05;

// --- helpers ----------------------------------------------------------------

interface PageOptions {
  baseHtml: string;
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

function generatePage({ baseHtml, title, ogTitle, description, canonicalUrl, keywords, ogImage, ogLocale, noscriptHtml, jsonLdTags }: PageOptions): string {
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

  let html = baseHtml;

  // Fill in the (empty) prerendered title. Keep data-rh so react-helmet-async
  // updates it in place on hydration instead of leaving a stale/duplicate. If the
  // prerender has no <title> at all, inject one rather than silently shipping a
  // title-less page.
  const titleTag = `<title data-rh="true">${escapedTitle}</title>`;
  const titleRegex = /<title[^>]*>[\s\S]*?<\/title>/;
  html = titleRegex.test(html)
    ? html.replace(titleRegex, titleTag)
    : html.replace(/<head>/, `<head>${titleTag}`);

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

interface Playlist {
  id: string;
  name: string;
  seoTitle: string;
  songs: Song[];
  keywords: string;
}

function getRegion(playlistId: string): 'Burundian' | 'Rwandan' {
  return playlistId === 'cantiques-kirundi' ? 'Burundian' : 'Rwandan';
}

// --- main -------------------------------------------------------------------

let totalPages = 0;
let missingPages = 0;

// Generate playlist pages
const playlists: Playlist[] = [
  {
    id: 'gushimisha',
    name: 'Gushimisha Imana',
    seoTitle: 'Gushimisha Imana — Rwandan Worship Songs & Lyrics | Indirimbo',
    songs: gushimishaSongs,
    keywords: 'gushimisha imana, indirimbo zo gushimisha imana, rwandan hymns, worship songs, kinyarwanda',
  },
  {
    id: 'agakiza',
    name: 'Agakiza',
    seoTitle: 'Agakiza — Rwandan Church Hymns with Full Lyrics | Indirimbo',
    songs: agakizaSongs,
    keywords: "agakiza, indirimbo z'agakiza, rwandan hymns, worship songs, kinyarwanda",
  },
  {
    id: 'cantiques-kirundi',
    name: 'Cantiques Kirundi',
    seoTitle: 'Cantiques Kirundi — Burundian Worship Songs | Indirimbo',
    songs: kirundiSongs,
    keywords: 'cantiques kirundi, indirimbo zo guhimbaza imana, burundian hymns, worship songs, kirundi',
  },
];

for (const playlist of playlists) {
  const region = getRegion(playlist.id);
  const description = `Browse all ${playlist.songs.length} hymns in the ${playlist.name} hymnbook — ${region} church worship songs with full lyrics, verses, and choruses. Search by number, title, or lyrics.`;
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

  // Expo prerenders the playlist route to a flat <id>.html with real content.
  const prerenderedPath = path.join(distDir, 'playlist', `${playlist.id}.html`);
  if (!fs.existsSync(prerenderedPath)) {
    console.warn(`⚠️  No prerendered page for playlist/${playlist.id} — skipping`);
    missingPages++;
    continue;
  }
  const baseHtml = fs.readFileSync(prerenderedPath, 'utf8');

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
    baseHtml,
    title: playlist.seoTitle,
    ogTitle: playlist.seoTitle,
    description,
    canonicalUrl,
    keywords: playlist.keywords,
    ogImage: playlist.id === 'cantiques-kirundi' ? OG_IMAGE_KIRUNDI : undefined,
    ogLocale: playlist.id === 'cantiques-kirundi' ? 'rn_BI' : undefined,
    noscriptHtml: noscript,
    jsonLdTags: `${collectionJsonLd}\n${breadcrumbJsonLd}`,
  });

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  fs.rmSync(prerenderedPath);
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
    const region = getRegion(playlistId);
    const description = `Browse ${category.songs.length} ${category.name} hymns from the ${playlistName} hymnbook — ${region} church worship songs with full lyrics, verses, and choruses for worship and personal devotion.`;
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

    // Expo prerenders the category route to a flat <slug>.html with real content.
    const prerenderedPath = path.join(distDir, 'category', `${category.slug}.html`);
    if (!fs.existsSync(prerenderedPath)) {
      console.warn(`⚠️  No prerendered page for category/${category.slug} — skipping`);
      missingPages++;
      continue;
    }
    const baseHtml = fs.readFileSync(prerenderedPath, 'utf8');

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
      baseHtml,
      title: `${category.name} Hymns — ${playlistName} | Indirimbo`,
      ogTitle: `${category.name} Hymns — ${playlistName} | Indirimbo`,
      description,
      canonicalUrl,
      keywords,
      ogImage: playlistId === 'cantiques-kirundi' ? OG_IMAGE_KIRUNDI : undefined,
      ogLocale: playlistId === 'cantiques-kirundi' ? 'rn_BI' : undefined,
      noscriptHtml: noscript,
      jsonLdTags: `${collectionJsonLd}\n${breadcrumbJsonLd}`,
    });

    fs.writeFileSync(path.join(dir, 'index.html'), html);
    fs.rmSync(prerenderedPath);
    totalPages++;
  }
}

// A broken export (routes not matched by generateStaticParams, or a changed
// output-path convention) would silently skip pages and still exit 0. Fail hard
// when nothing was generated or an unexpected fraction is missing, so CI catches
// a structurally broken build instead of shipping blank playlist/category pages.
const expectedPages = totalPages + missingPages;
if (expectedPages === 0 || missingPages / expectedPages > MAX_MISSING_RATIO) {
  throw new Error(
    `Playlist/category page generation aborted: ${missingPages}/${expectedPages} prerendered pages missing — the static export looks broken.`,
  );
}

const totalCategories = categoryPlaylists.reduce((sum, p) => sum + p.categories.length, 0);
const missingSuffix = missingPages > 0 ? ` (${missingPages} missing prerenders skipped)` : '';
console.log(`✅ Finalized ${totalPages} prerendered pages (${playlists.length} playlists + ${totalCategories} categories) with SEO meta + noscript${missingSuffix}`);
