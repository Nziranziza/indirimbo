#!/usr/bin/env node

/**
 * Generates static HTML pages for SPA-only routes at:
 *   dist/<path>/index.html
 *
 * Each page is a copy of the built index.html with:
 *   - Page-specific title, description, and canonical URL
 *   - Stripped default OG/meta tags replaced with page-specific ones
 *
 * This ensures crawlers and Lighthouse see the correct canonical URL
 * for every route, not just the homepage default.
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

function generatePage({ title, description, canonicalUrl, keywords }) {
  const escapedTitle = escapeHtml(title);
  const escapedDescription = escapeHtml(description);
  const escapedKeywords = escapeHtml(keywords);

  const metaTags = `
  <meta name="description" content="${escapedDescription}" />
  <meta name="keywords" content="${escapedKeywords}" />
  <meta property="og:site_name" content="Indirimbo" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapedTitle}" />
  <meta property="og:description" content="${escapedDescription}" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:image:width" content="1024" />
  <meta property="og:image:height" content="1024" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:locale" content="rw_RW" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapedTitle}" />
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

  // Remove the homepage noscript block (not relevant for these pages)
  html = html.replace(/<noscript><article>[\s\S]*?<\/article><\/noscript>/, '');

  // Inject specific meta tags right after <head>
  html = html.replace(/<head>/, `<head>${metaTags}`);

  return html;
}

// --- SPA routes to generate -------------------------------------------------

const spaPages = [
  {
    path: 'settings',
    title: 'Settings | Indirimbo',
    description: 'Customize your Indirimbo reading experience. Adjust text size, theme, and accent color.',
    keywords: 'indirimbo settings, text size, theme, dark mode, accent color',
  },
  {
    path: 'search',
    title: 'Search Songs | Indirimbo',
    description: 'Search Rwandan hymns and worship songs by title, number, or lyrics across Gushimisha Imana and Agakiza hymnbooks.',
    keywords: 'search indirimbo, search hymns, search worship songs, kinyarwanda songs',
  },
  {
    path: 'favorites',
    title: 'Favorites | Indirimbo',
    description: 'Your favorite Rwandan hymns and worship songs from Gushimisha Imana and Agakiza hymnbooks.',
    keywords: 'favorite hymns, saved songs, indirimbo favorites',
  },
  {
    path: 'about',
    title: 'About | Indirimbo',
    description: 'Indirimbo brings Rwandan hymns and worship songs to your fingertips. Browse Gushimisha Imana and Agakiza hymnbooks.',
    keywords: 'about indirimbo, rwandan hymns app, gushimisha imana, agakiza',
  },
  {
    path: 'support',
    title: 'Support | Indirimbo',
    description: 'Get help with using Indirimbo. Find FAQs, usage guide, and contact information for the Rwandan hymnal app.',
    keywords: 'indirimbo support, help, FAQ, contact',
  },
  {
    path: 'terms-of-service',
    title: 'Terms of Service | Indirimbo',
    description: 'Terms of service for the Indirimbo app. Guidelines for using the Rwandan hymnal app.',
    keywords: 'indirimbo terms of service, terms, legal',
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy | Indirimbo',
    description: 'Privacy policy for the Indirimbo app. Learn how we handle your information.',
    keywords: 'indirimbo privacy policy, privacy, data',
  },
  {
    path: 'download',
    title: 'Download Indirimbo - Rwandan Hymns App',
    description: 'Download Indirimbo for iOS and Android. Browse Rwandan church hymns from Agakiza and Gushimisha Imana hymnbooks. Free on the App Store and Google Play.',
    keywords: 'indirimbo download, indirimbo app, rwandan hymns app, agakiza app, gushimisha app',
  },
];

// --- main -------------------------------------------------------------------

let totalPages = 0;

for (const page of spaPages) {
  const canonicalUrl = `${BASE_URL}/${page.path}`;
  const dir = path.join(distDir, page.path);
  fs.mkdirSync(dir, { recursive: true });

  const html = generatePage({
    title: page.title,
    description: page.description,
    canonicalUrl,
    keywords: page.keywords,
  });

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  totalPages++;
}

console.log(`✅ Generated ${totalPages} static SPA pages with canonical URLs`);
