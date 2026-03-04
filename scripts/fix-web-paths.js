#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');
const notFoundPath = path.join(distDir, '404.html');

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
  <meta property="og:image:width" content="1024" />
  <meta property="og:image:height" content="1024" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:url" content="${BASE_URL}" />
  <meta property="og:locale" content="rw_RW" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Indirimbo - z'Agakiza no Gushimisha Imana" />
  <meta name="twitter:description" content="Browse and search Rwandan church hymns from Agakiza and Gushimisha Imana hymnbooks." />
  <meta name="twitter:image" content="${BASE_URL}/og-image.jpg" />
  <link rel="canonical" href="${BASE_URL}" />
  <meta name="apple-itunes-app" content="app-id=6758376573, app-argument=${BASE_URL}" />
`;

if (!html.includes('og:title')) {
  html = html.replace('</head>', `${seoMetaTags}\n</head>`);
}

const spaRedirectScript = `
  <script>
    (function () {
      var params = new URLSearchParams(window.location.search);
      var redirect = params.get('spa-redirect');
      if (!redirect) {
        return;
      }
      params.delete('spa-redirect');
      var remaining = params.toString();
      var newUrl = redirect + (remaining ? (redirect.indexOf('?') === -1 ? '?' : '&') + remaining : '');
      window.history.replaceState(null, '', newUrl);
    })();
  </script>
`;

if (!html.includes('spa-redirect')) {
  html = html.replace('</head>', `${spaRedirectScript}\n</head>`);
}

// Write the fixed HTML back
fs.writeFileSync(indexPath, html);

// Also fix all other HTML pages in dist/
const fixHtmlFile = (filePath) => {
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

  // Add SPA redirect script
  if (!pageHtml.includes('spa-redirect')) {
    pageHtml = pageHtml.replace('</head>', `${spaRedirectScript}\n</head>`);
  }

  fs.writeFileSync(filePath, pageHtml);
};

// Recursively find all HTML files in dist
const walkDir = (dir) => {
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

if (fs.existsSync(notFoundPath)) {
  let notFoundHtml = fs.readFileSync(notFoundPath, 'utf8');
  notFoundHtml = notFoundHtml.replace(/__BASE_PATH__/g, normalizedBasePath);
  fs.writeFileSync(notFoundPath, notFoundHtml);
}

console.log('✅ Fixed asset paths and injected SEO meta tags in all HTML files');
