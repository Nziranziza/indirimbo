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

if (normalizedBasePath) {
  // Replace absolute paths with paths relative to the base path
  html = html.replace(/href="\/_expo\//g, `href="${normalizedBasePath}/_expo/`);
  html = html.replace(/src="\/_expo\//g, `src="${normalizedBasePath}/_expo/`);
  html = html.replace(/href="\/favicon\.ico"/g, `href="${normalizedBasePath}/favicon.ico"`);
} else {
  console.log('ℹ️  No BASE_PATH set; leaving asset paths unchanged');
}

// Inject preload hint for the main entry JS bundle (speeds up resource discovery)
const entryScriptMatch = html.match(/src="([^"]*entry-[^"]*\.js)"/);
if (entryScriptMatch) {
  const entryScriptSrc = entryScriptMatch[1];
  const preloadTag = `<link rel="preload" href="${entryScriptSrc}" as="script" />`;
  if (!html.includes('rel="preload"')) {
    html = html.replace('</head>', `  ${preloadTag}\n</head>`);
  }
}

// Replace empty title with default SEO title
html = html.replace(
  /<title data-rh="true"><\/title>/,
  `<title data-rh="true">Indirimbo - z'Agakiza no Gushimisha Imana</title>`
);

// Inject SEO meta tags into <head>
const seoMetaTags = `
  <meta name="description" content="Browse and search Rwandan church hymns from Agakiza and Gushimisha Imana hymnbooks. Find lyrics, save favorites, and share worship songs." />
  <meta name="keywords" content="indirimbo, agakiza, gushimisha imana, indirimbo z'agakiza, indirimbo zo gushimisha imana, rwandan hymns, worship songs, church hymns, kinyarwanda, rwanda" />
  <meta name="theme-color" content="#0a7ea4" />
  <meta property="og:site_name" content="Indirimbo" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Indirimbo - z'Agakiza no Gushimisha Imana" />
  <meta property="og:description" content="Browse and search Rwandan church hymns from Agakiza and Gushimisha Imana hymnbooks. Find lyrics, save favorites, and share worship songs." />
  <meta property="og:image" content="${BASE_URL}/og-image.jpg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:url" content="${BASE_URL}/" />
  <meta property="og:locale" content="rw_RW" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Indirimbo - z'Agakiza no Gushimisha Imana" />
  <meta name="twitter:description" content="Browse and search Rwandan church hymns from Agakiza and Gushimisha Imana hymnbooks." />
  <meta name="twitter:image" content="${BASE_URL}/og-image.jpg" />
  <link rel="canonical" href="${BASE_URL}/" />
  <meta name="apple-itunes-app" content="app-id=6758376573" />
`;

if (!html.includes('og:title')) {
  html = html.replace('</head>', `${seoMetaTags}\n</head>`);
}

// Inject noscript block with crawlable homepage content
const homepageNoscript = `
<noscript><article>
<h1>Indirimbo - z'Agakiza no Gushimisha Imana</h1>
<p>Browse and search Rwandan church hymns from Agakiza and Gushimisha Imana hymnbooks. Find lyrics, save favorites, and share worship songs.</p>
<h2>Hymnbooks</h2>
<ul>
<li><a href="${BASE_URL}/playlist/agakiza">Agakiza</a> - Indirimbo z'Agakiza</li>
<li><a href="${BASE_URL}/playlist/gushimisha">Gushimisha Imana</a> - Indirimbo zo Gushimisha Imana</li>
</ul>
<nav>
<a href="${BASE_URL}/about">About</a> |
<a href="${BASE_URL}/privacy-policy">Privacy Policy</a> |
<a href="${BASE_URL}/terms-of-service">Terms of Service</a>
</nav>
</article></noscript>`;

html = html.replace(/<body>/, `<body>${homepageNoscript}`);

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
