/**
 * Generates static HTML pages for SPA-only routes at:
 *   dist/<path>/index.html
 *
 * Each page is a copy of the built index.html with:
 *   - Page-specific title, description, and canonical URL
 *   - Stripped default OG/meta tags replaced with page-specific ones
 *   - Noscript block with page content for search engine crawlers
 *
 * This ensures crawlers and Lighthouse see the correct canonical URL
 * and meaningful content for every route.
 *
 * This script must run AFTER fix-web-paths.ts (so index.html is fully ready).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeHtml, buildJsonLdTag, stripJsonLd } from './utils';
import { BOOKS } from '../constants/book-names';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://indirimbo.rw';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;
const DEFAULT_OG_LOCALE = 'rw_RW';
const distDir = path.join(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

// Read the built & fixed index.html as our template
const templateHtml = fs.readFileSync(indexPath, 'utf8');

// --- helpers ----------------------------------------------------------------

interface PageOptions {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords: string;
  noscriptHtml: string;
  jsonLdTags?: string;
  ogImage?: string;
  ogLocale?: string;
  noindex?: boolean;
}

function generatePage({
  title,
  description,
  canonicalUrl,
  keywords,
  noscriptHtml,
  jsonLdTags,
  ogImage = DEFAULT_OG_IMAGE,
  ogLocale = DEFAULT_OG_LOCALE,
  noindex,
}: PageOptions): string {
  const escapedTitle = escapeHtml(title);
  const escapedDescription = escapeHtml(description);
  const escapedKeywords = escapeHtml(keywords);

  // Tags re-rendered by <PageHead> at runtime get data-rh="true" so react-helmet-async
  // replaces them in place instead of appending duplicates after hydration.
  const metaTags = `
  <meta data-rh="true" name="description" content="${escapedDescription}" />
  <meta data-rh="true" name="keywords" content="${escapedKeywords}" />
  <meta property="og:site_name" content="Indirimbo" />
  <meta property="og:type" content="website" />
  <meta data-rh="true" property="og:title" content="${escapedTitle}" />
  <meta data-rh="true" property="og:description" content="${escapedDescription}" />
  <meta data-rh="true" property="og:image" content="${ogImage}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta data-rh="true" property="og:url" content="${canonicalUrl}" />
  <meta data-rh="true" property="og:locale" content="${ogLocale}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta data-rh="true" name="twitter:title" content="${escapedTitle}" />
  <meta data-rh="true" name="twitter:description" content="${escapedDescription}" />
  <meta data-rh="true" name="twitter:image" content="${ogImage}" />
  <link data-rh="true" rel="canonical" href="${canonicalUrl}" />
  <meta name="apple-itunes-app" content="app-id=6758376573" />${noindex ? '\n  <meta name="robots" content="noindex,follow" />' : ''}`;

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

  // Inject page-specific noscript block
  html = html.replace(/<body>/, `<body>${noscriptHtml}`);

  return html;
}

// --- SPA routes to generate -------------------------------------------------

const bookReferenceItems = BOOKS.map(
  (book) => `<li><strong>${escapeHtml(book.abbreviation)}</strong> — ${escapeHtml(book.name)}</li>`
).join('');

const bookReferencesNoscript = `<noscript><article>
<h1>Song Book References</h1>
<p>Many songs in the Indirimbo hymnbooks were adapted or translated from other collections. The reference codes at the bottom of each song indicate the original hymn book and number. Here is what each abbreviation stands for.</p>
<h2>Reference codes</h2>
<ul>${bookReferenceItems}</ul>
<nav><a href="${BASE_URL}/about">About</a> | <a href="${BASE_URL}">Home</a></nav>
</article></noscript>`;

const spaPages: Array<{
  path: string;
  title: string;
  description: string;
  keywords: string;
  noscriptHtml: string;
  extraJsonLd?: object;
  ogImage?: string;
  ogLocale?: string;
  noindex?: boolean;
}> = [
  {
    path: 'book-references',
    title: 'Song Book References — Hymnal Abbreviation Codes | Indirimbo',
    description: 'Learn what the abbreviation codes in Indirimbo song references mean — each code identifies the original hymn book a song was adapted or translated from.',
    keywords: 'song book references, hymn book abbreviations, indirimbo references, hymnal sources, keswick hymn book, golden bells',
    noscriptHtml: bookReferencesNoscript,
  },
  {
    path: 'about',
    title: 'About Indirimbo — The Rwandan & Burundian Hymnal App',
    description: 'Indirimbo brings Rwandan and Burundian church hymns to your fingertips — browse the Gushimisha Imana, Agakiza, and Cantiques Kirundi hymnbooks with full lyrics.',
    keywords: 'about indirimbo, rwandan hymns app, gushimisha imana, agakiza',
    noscriptHtml: `<noscript><article>
<h1>About Indirimbo</h1>
<p>Indirimbo brings the beloved hymns and worship songs of Rwandan churches to your fingertips. Whether you're leading worship, singing along at church, or practicing at home, Indirimbo is your perfect companion.</p>
<h2>Features</h2>
<ul>
<li><strong>Complete Hymnbooks</strong> — Access songs from Gushimisha Imana and Agakiza hymnbooks, with all verses and choruses.</li>
<li><strong>Powerful Search</strong> — Find any song instantly by number, title, or even words from the lyrics.</li>
<li><strong>Favorites</strong> — Save your most-used songs for quick access during worship or practice.</li>
<li><strong>Recent Songs</strong> — Quickly return to songs you've recently viewed.</li>
<li><strong>Adjustable Text</strong> — Customize the font size for comfortable reading on any device.</li>
<li><strong>Song Navigation</strong> — Visual heatmap shows all verses and choruses. Tap any section to jump directly to it.</li>
<li><strong>Easy Sharing</strong> — Share songs with friends, family, or your worship team.</li>
<li><strong>Works Offline</strong> — All songs are stored on your device. No internet needed after installation.</li>
<li><strong>Dark Mode</strong> — Easy on the eyes with automatic dark mode support.</li>
</ul>
<h2>Available Hymnbooks</h2>
<ul>
<li><strong>Gushimisha Imana</strong> — A collection of praise and worship songs widely used in Rwandan churches.</li>
<li><strong>Agakiza</strong> — Traditional hymns focused on salvation and spiritual themes.</li>
</ul>
<nav><a href="${BASE_URL}/playlist/gushimisha">Gushimisha Imana</a> | <a href="${BASE_URL}/playlist/agakiza">Agakiza</a> | <a href="${BASE_URL}">Home</a></nav>
</article></noscript>`,
  },
  {
    path: 'support',
    title: 'Support & Help — Indirimbo Hymnal App FAQ & Contact',
    description: 'Get help using Indirimbo, the Rwandan and Burundian hymnal app — find FAQs, a usage guide, and contact details for search, favorites, and offline access.',
    keywords: 'indirimbo support, help, FAQ, contact',
    extraJsonLd: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How do I find a specific song?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Use the search bar on the home screen. You can search by song number, title, or even words from the lyrics.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I use the app offline?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes! All songs are stored locally on your device. Once the app is installed, you can access all hymns without an internet connection.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do I change the text size?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Go to Settings and adjust the font size to small, medium, or large based on your preference.',
          },
        },
      ],
    },
    noscriptHtml: `<noscript><article>
<h1>Support</h1>
<h2>Getting Started</h2>
<p>Indirimbo is a hymns and worship songs app for Rwandan churches. Browse songs from popular hymnbooks, search by title or lyrics, and save your favorites.</p>
<h2>How to Use</h2>
<ul>
<li>Browse songs by selecting a playlist (Gushimisha Imana or Agakiza)</li>
<li>Use the search bar to find songs by title, number, or lyrics</li>
<li>Tap the heart icon to save songs to your favorites</li>
<li>Share songs with friends using the share button</li>
<li>Adjust text size in Settings for comfortable reading</li>
</ul>
<h2>Frequently Asked Questions</h2>
<h3>How do I find a specific song?</h3>
<p>Use the search bar on the home screen. You can search by song number, title, or even words from the lyrics.</p>
<h3>Can I use the app offline?</h3>
<p>Yes! All songs are stored locally on your device. Once the app is installed, you can access all hymns without an internet connection.</p>
<h3>How do I change the text size?</h3>
<p>Go to Settings and adjust the font size to small, medium, or large based on your preference.</p>
<h2>Report an Issue</h2>
<p>Found a bug or incorrect lyrics? Please let us know. Include the song name and number, a description of the issue, and your device type and OS version.</p>
<nav><a href="${BASE_URL}/privacy-policy">Privacy Policy</a> | <a href="${BASE_URL}/terms-of-service">Terms of Service</a> | <a href="${BASE_URL}">Home</a></nav>
</article></noscript>`,
  },
  {
    path: 'terms-of-service',
    title: 'Terms of Service — Indirimbo Hymnal App',
    description: 'Terms of service for Indirimbo, the Rwandan and Burundian hymnal app — guidelines for fair, personal, non-commercial use of the worship song collection.',
    keywords: 'indirimbo terms of service, terms, legal',
    noscriptHtml: `<noscript><article>
<h1>Terms of Service</h1>
<p><em>Last Updated: February 1, 2026</em></p>
<h2>Summary</h2>
<ul>
<li>Use the app responsibly for personal, non-commercial use.</li>
<li>Do not try to harm, copy, or disrupt the app.</li>
<li>We may update features and fix issues over time.</li>
</ul>
<h2>Agreement</h2>
<p>By using Indirimbo, you agree to these terms. If you do not agree, please do not use the app.</p>
<h2>Who Can Use This App</h2>
<p>The app is for everyone. Children should use it with parental supervision.</p>
<h2>What You Can Do</h2>
<p>You may use the app for personal, non-commercial purposes.</p>
<h2>What You Can't Do</h2>
<ul>
<li>Use the app for illegal purposes</li>
<li>Attempt to hack or disrupt the app</li>
<li>Copy, reverse engineer, or modify the app's code</li>
<li>Do anything that could harm the app or other users</li>
</ul>
<h2>Content</h2>
<p>The app is provided "as is." We do not guarantee uninterrupted or error-free service, but we aim to fix issues promptly.</p>
<h2>Updates</h2>
<p>We may update the app at any time to add features, improve performance, or fix bugs.</p>
<nav><a href="${BASE_URL}/privacy-policy">Privacy Policy</a> | <a href="${BASE_URL}">Home</a></nav>
</article></noscript>`,
  },
  {
    path: 'privacy-policy',
    title: 'Privacy Policy — Indirimbo Hymnal App',
    description: 'Privacy policy for Indirimbo, the Rwandan and Burundian hymnal app — learn what limited data we collect, how it is used, and what we never collect or share.',
    keywords: 'indirimbo privacy policy, privacy, data',
    noscriptHtml: `<noscript><article>
<h1>Privacy Policy</h1>
<p><em>Last Updated: February 1, 2026</em></p>
<h2>Summary</h2>
<ul>
<li>We collect limited technical data to improve the app.</li>
<li>We do not sell or share your data.</li>
<li>Contact us anytime with questions or concerns.</li>
</ul>
<h2>What We Collect</h2>
<p>We collect limited technical information to improve the app:</p>
<ul>
<li>Anonymous usage data (feature usage, crashes)</li>
<li>Device information (model and OS version)</li>
</ul>
<h2>What We Do Not Collect</h2>
<ul>
<li>Personal information (name, email, phone)</li>
<li>Location data</li>
<li>Photos or contacts</li>
<li>Payment information</li>
</ul>
<h2>How We Use Your Data</h2>
<p>We use this data only to:</p>
<ul>
<li>Fix bugs and improve stability</li>
<li>Understand general usage patterns</li>
</ul>
<h2>Sharing</h2>
<p>We do not share, sell, or rent your data. The information we collect is used only for improving the app.</p>
<h2>Children</h2>
<p>The app is intended for all ages. We do not knowingly collect personal information. Parents or guardians should supervise children using the app.</p>
<nav><a href="${BASE_URL}/terms-of-service">Terms of Service</a> | <a href="${BASE_URL}">Home</a></nav>
</article></noscript>`,
  },
  {
    path: 'download',
    title: 'Download Indirimbo - Rwandan Hymns App',
    description: 'Download Indirimbo for iOS and Android. Browse Rwandan church hymns from Agakiza and Gushimisha Imana hymnbooks. Free on the App Store and Google Play.',
    keywords: 'indirimbo download, indirimbo app, rwandan hymns app, agakiza app, gushimisha app',
    noscriptHtml: `<noscript><article>
<h1>Download Indirimbo</h1>
<p>Get the Indirimbo app for the best experience. Browse hymns offline, save favorites, customize your reading experience, and more.</p>
<h2>Why download the app?</h2>
<ul>
<li>Works completely offline</li>
<li>Save your favorite hymns</li>
<li>Search by title, number, or lyrics</li>
<li>Adjustable text size</li>
<li>Dark mode support</li>
<li>Share songs with friends</li>
</ul>
<p>You can also browse songs directly on the web at <a href="${BASE_URL}">indirimbo.rw</a></p>
<nav><a href="${BASE_URL}/playlist/gushimisha">Gushimisha Imana</a> | <a href="${BASE_URL}/playlist/agakiza">Agakiza</a> | <a href="${BASE_URL}">Home</a></nav>
</article></noscript>`,
  },
  {
    path: 'download-kirundi',
    title: 'Download Indirimbo - Cantiques Kirundi & Rwandan Hymns App',
    description: 'Download Indirimbo for iOS and Android. Browse Cantiques Kirundi alongside Gushimisha Imana and Agakiza hymnbooks. Free on the App Store and Google Play.',
    keywords: 'indirimbo download, cantiques kirundi app, burundian hymns app, indirimbo zo guhimbaza imana, kirundi worship songs',
    ogImage: `${BASE_URL}/og-image-kirundi.jpg`,
    ogLocale: 'rn_BI',
    noscriptHtml: `<noscript><article>
<h1>Download Indirimbo</h1>
<p>Get the Indirimbo app for the best experience. Browse Cantiques Kirundi, Gushimisha Imana, and Agakiza hymnbooks offline, save favorites, and more.</p>
<h2>Why download the app?</h2>
<ul>
<li>Works completely offline</li>
<li>Cantiques Kirundi, Gushimisha Imana, and Agakiza in one app</li>
<li>Save your favorite hymns</li>
<li>Search by title, number, or lyrics</li>
<li>Adjustable text size</li>
<li>Dark mode support</li>
<li>Share songs with friends</li>
</ul>
<p>You can also browse songs directly on the web at <a href="${BASE_URL}">indirimbo.rw</a></p>
<nav><a href="${BASE_URL}/playlist/cantiques-kirundi">Cantiques Kirundi</a> | <a href="${BASE_URL}/playlist/gushimisha">Gushimisha Imana</a> | <a href="${BASE_URL}/playlist/agakiza">Agakiza</a> | <a href="${BASE_URL}">Home</a></nav>
</article></noscript>`,
  },
  {
    path: 'search',
    noindex: true,
    title: 'Search Songs | Indirimbo',
    description: 'Search Rwandan hymns and worship songs by title, number, or lyrics across Gushimisha Imana and Agakiza hymnbooks.',
    keywords: 'search indirimbo, search hymns, search worship songs, kinyarwanda songs',
    noscriptHtml: `<noscript><article>
<h1>Search Songs</h1>
<p>Search Rwandan hymns and worship songs by title, number, or lyrics across Gushimisha Imana and Agakiza hymnbooks.</p>
<nav><a href="${BASE_URL}/playlist/gushimisha">Gushimisha Imana</a> | <a href="${BASE_URL}/playlist/agakiza">Agakiza</a> | <a href="${BASE_URL}">Home</a></nav>
</article></noscript>`,
  },
  {
    path: 'favorites',
    noindex: true,
    title: 'Favorites | Indirimbo',
    description: 'Your favorite Rwandan hymns and worship songs from Gushimisha Imana and Agakiza hymnbooks.',
    keywords: 'favorite hymns, saved songs, indirimbo favorites',
    noscriptHtml: `<noscript><article>
<h1>Favorites</h1>
<p>Your favorite Rwandan hymns and worship songs from Gushimisha Imana and Agakiza hymnbooks. Save songs for quick access during worship or practice.</p>
<nav><a href="${BASE_URL}/playlist/gushimisha">Gushimisha Imana</a> | <a href="${BASE_URL}/playlist/agakiza">Agakiza</a> | <a href="${BASE_URL}">Home</a></nav>
</article></noscript>`,
  },
  {
    path: 'settings',
    noindex: true,
    title: 'Settings | Indirimbo',
    description: 'Customize your Indirimbo reading experience. Adjust text size, theme, and accent color.',
    keywords: 'indirimbo settings, text size, theme, dark mode, accent color',
    noscriptHtml: `<noscript><article>
<h1>Settings</h1>
<p>Customize your Indirimbo reading experience. Adjust text size, theme, and accent color.</p>
<nav><a href="${BASE_URL}/about">About</a> | <a href="${BASE_URL}/support">Support</a> | <a href="${BASE_URL}">Home</a></nav>
</article></noscript>`,
  },
];

// --- main -------------------------------------------------------------------

let totalPages = 0;

for (const page of spaPages) {
  const canonicalUrl = `${BASE_URL}/${page.path}/`;

  const breadcrumbJsonLd = buildJsonLdTag({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Indirimbo', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: page.title.split(' | ')[0].split(' — ')[0].split(' - ')[0], item: canonicalUrl },
    ],
  });

  let jsonLdTags = breadcrumbJsonLd;
  if (page.extraJsonLd) {
    jsonLdTags += `\n${buildJsonLdTag(page.extraJsonLd)}`;
  }

  const html = generatePage({
    title: page.title,
    description: page.description,
    canonicalUrl,
    keywords: page.keywords,
    noscriptHtml: page.noscriptHtml,
    jsonLdTags,
    ogImage: page.ogImage,
    ogLocale: page.ogLocale,
    noindex: page.noindex,
  });

  // Fix the flat .html file that expo export generated (e.g. dist/about.html)
  // with page-specific meta tags (expo leaves them with empty/generic tags).
  const flatFile = path.join(distDir, `${page.path}.html`);
  if (fs.existsSync(flatFile)) {
    fs.writeFileSync(flatFile, html);
  }

  // Also create a directory-based index.html (e.g. dist/about/index.html)
  // so both /about and /about/ serve correct meta tags.
  const dir = path.join(distDir, page.path);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);

  totalPages++;
}

console.log(`✅ Generated ${totalPages} static SPA pages with canonical URLs and noscript content`);
