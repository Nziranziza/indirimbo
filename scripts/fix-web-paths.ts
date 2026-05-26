/**
 * Post-build script that prepares the base index.html template:
 *   - Fixes asset paths for custom BASE_PATH deployments
 *   - Injects preload hint for the main entry JS bundle
 *   - Sets default SEO meta tags for the homepage
 *   - Adds a noscript block with crawlable homepage content
 *   - Generates robots.txt
 *
 * This script must run BEFORE generate-song-pages.ts and other page generators.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildJsonLdTag } from './utils';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const distDir = path.join(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

// Read the index.html file
let html = fs.readFileSync(indexPath, 'utf8');

const basePath = (process.env.BASE_PATH || '').trim();
const normalizedBasePath = basePath
  ? basePath.startsWith('/') ? basePath : `/${basePath}`
  : '';

const BASE_URL = 'https://indirimbo.rw';

const FAVICON_SIZES = ['16x16', '32x32', '96x96', '128x128', '196x196'] as const;

const buildFaviconLinks = (prefix: string): string => {
  const iconLinks = FAVICON_SIZES.map(
    (size) =>
      `  <link rel="icon" type="image/png" sizes="${size}" href="${prefix}/favicon-${size}.png" />`
  ).join('\n');
  const appleTouch = `  <link rel="apple-touch-icon" sizes="196x196" href="${prefix}/favicon-196x196.png" />`;
  return `${iconLinks}\n${appleTouch}`;
};

const faviconLinks = buildFaviconLinks(normalizedBasePath);

const injectFaviconLinks = (pageHtml: string): string => {
  if (pageHtml.includes('favicon-96x96.png')) return pageHtml;
  return pageHtml.replace('</head>', `${faviconLinks}\n</head>`);
};

if (normalizedBasePath) {
  // Replace absolute paths with paths relative to the base path
  html = html.replace(/href="\/_expo\//g, `href="${normalizedBasePath}/_expo/`);
  html = html.replace(/src="\/_expo\//g, `src="${normalizedBasePath}/_expo/`);
  html = html.replace(/href="\/favicon\.ico"/g, `href="${normalizedBasePath}/favicon.ico"`);
} else {
  console.log('ℹ️  No BASE_PATH set; leaving asset paths unchanged');
}

html = injectFaviconLinks(html);

// Inject preload hint for the main entry JS bundle (speeds up resource discovery)
const entryScriptMatch = html.match(/src="([^"]*entry-[^"]*\.js)"/);
if (entryScriptMatch) {
  const entryScriptSrc = entryScriptMatch[1];
  const preloadTag = `<link rel="preload" href="${entryScriptSrc}" as="script" />`;
  if (!html.includes('rel="preload"')) {
    html = html.replace('</head>', `  ${preloadTag}\n</head>`);
  }
}

const HOMEPAGE_TITLE = "Indirimbo - z'Agakiza, Gushimisha Imana, na Cantiques Kirundi";
const HOMEPAGE_DESCRIPTION = 'Browse and search Rwandan and Burundian church hymns from Agakiza, Gushimisha Imana, and Cantiques Kirundi hymnbooks. Find lyrics, save favorites, and share worship songs.';
const HOMEPAGE_TWITTER_DESCRIPTION = 'Browse and search church hymns from Agakiza, Gushimisha Imana, and Cantiques Kirundi hymnbooks.';
const HOMEPAGE_KEYWORDS = "indirimbo, agakiza, gushimisha imana, cantiques kirundi, indirimbo z'agakiza, indirimbo zo gushimisha imana, indirimbo zo guhimbaza imana, rwandan hymns, burundian hymns, worship songs, church hymns, kinyarwanda, kirundi, rwanda, burundi";

// Replace empty title with default SEO title
html = html.replace(
  /<title data-rh="true"><\/title>/,
  `<title data-rh="true">${HOMEPAGE_TITLE}</title>`
);

// Inject SEO meta tags into <head>.
// Tags re-rendered by <PageHead> at runtime get data-rh="true" so react-helmet-async
// replaces them in place instead of appending duplicates after hydration.
const seoMetaTags = `
  <meta data-rh="true" name="description" content="${HOMEPAGE_DESCRIPTION}" />
  <meta data-rh="true" name="keywords" content="${HOMEPAGE_KEYWORDS}" />
  <meta name="theme-color" content="#0a7ea4" />
  <meta property="og:site_name" content="Indirimbo" />
  <meta property="og:type" content="website" />
  <meta data-rh="true" property="og:title" content="${HOMEPAGE_TITLE}" />
  <meta data-rh="true" property="og:description" content="${HOMEPAGE_DESCRIPTION}" />
  <meta data-rh="true" property="og:image" content="${BASE_URL}/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta data-rh="true" property="og:url" content="${BASE_URL}/" />
  <meta data-rh="true" property="og:locale" content="rw_RW" />
  <meta property="og:locale:alternate" content="rn_BI" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta data-rh="true" name="twitter:title" content="${HOMEPAGE_TITLE}" />
  <meta data-rh="true" name="twitter:description" content="${HOMEPAGE_TWITTER_DESCRIPTION}" />
  <meta data-rh="true" name="twitter:image" content="${BASE_URL}/og-image.jpg" />
  <link data-rh="true" rel="canonical" href="${BASE_URL}/" />
  <meta name="apple-itunes-app" content="app-id=6758376573" />
`;

if (!html.includes('og:title')) {
  html = html.replace('</head>', `${seoMetaTags}\n</head>`);
}

// Inject noscript block with crawlable homepage content
const homepageNoscript = `
<noscript><article>
<h1>${HOMEPAGE_TITLE}</h1>
<p>${HOMEPAGE_DESCRIPTION}</p>
<h2>Hymnbooks</h2>
<ul>
<li><a href="${BASE_URL}/playlist/agakiza">Agakiza</a> - Indirimbo z'Agakiza</li>
<li><a href="${BASE_URL}/playlist/gushimisha">Gushimisha Imana</a> - Indirimbo zo Gushimisha Imana</li>
<li><a href="${BASE_URL}/playlist/cantiques-kirundi">Cantiques Kirundi</a> - Indirimbo zo Guhimbaza Imana</li>
</ul>
<nav>
<a href="${BASE_URL}/about">About</a> |
<a href="${BASE_URL}/privacy-policy">Privacy Policy</a> |
<a href="${BASE_URL}/terms-of-service">Terms of Service</a>
</nav>
</article></noscript>`;

html = html.replace(/<body>/, `<body>${homepageNoscript}`);

// Inject JSON-LD structured data for homepage
const websiteJsonLd = buildJsonLdTag({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Indirimbo',
  url: `${BASE_URL}/`,
  description: HOMEPAGE_DESCRIPTION,
  inLanguage: ['rw', 'rn'],
  potentialAction: {
    '@type': 'SearchAction',
    target: `${BASE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
});

const organizationJsonLd = buildJsonLdTag({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Indirimbo',
  url: `${BASE_URL}/`,
  logo: `${BASE_URL}/og-image.jpg`,
});

html = html.replace('</head>', `${websiteJsonLd}\n${organizationJsonLd}\n</head>`);

// Write the fixed HTML back
fs.writeFileSync(indexPath, html);

// Also fix all other HTML pages in dist/
const fixHtmlFile = (filePath: string): void => {
  if (filePath === indexPath) return; // Already handled
  if (!filePath.endsWith('.html')) return;

  let pageHtml = fs.readFileSync(filePath, 'utf8');

  // Replace empty title
  pageHtml = pageHtml.replace(
    /<title data-rh="true"><\/title>/,
    `<title data-rh="true">Indirimbo - z'Agakiza no Gushimisha Imana</title>`
  );

  // Inject SEO meta tags
  if (!pageHtml.includes('og:title')) {
    pageHtml = pageHtml.replace('</head>', `${seoMetaTags}\n</head>`);
  }

  // Fix base paths
  if (normalizedBasePath) {
    pageHtml = pageHtml.replace(/href="\/_expo\//g, `href="${normalizedBasePath}/_expo/`);
    pageHtml = pageHtml.replace(/src="\/_expo\//g, `src="${normalizedBasePath}/_expo/`);
    pageHtml = pageHtml.replace(/href="\/favicon\.ico"/g, `href="${normalizedBasePath}/favicon.ico"`);
  }

  pageHtml = injectFaviconLinks(pageHtml);

  fs.writeFileSync(filePath, pageHtml);
};

// Recursively find all HTML files in dist
const walkDir = (dir: string): void => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (entry.name.endsWith('.html')) {
      fixHtmlFile(fullPath);
    }
  }
};

walkDir(distDir);

// Ensure dist/robots.txt has the correct production domain
const robotsTxtPath = path.join(distDir, 'robots.txt');
const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${BASE_URL}/sitemap.xml\n`;
fs.writeFileSync(robotsTxtPath, robotsTxt);

console.log('✅ Fixed asset paths, injected SEO meta tags, and updated robots.txt');
