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

if (normalizedBasePath) {
  // Replace absolute paths with paths relative to the base path
  html = html.replace(/href="\/_expo\//g, `href="${normalizedBasePath}/_expo/`);
  html = html.replace(/src="\/_expo\//g, `src="${normalizedBasePath}/_expo/`);
  html = html.replace(/href="\/favicon\.ico"/g, `href="${normalizedBasePath}/favicon.ico"`);
} else {
  console.log('ℹ️  No BASE_PATH set; leaving asset paths unchanged');
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

if (fs.existsSync(notFoundPath)) {
  let notFoundHtml = fs.readFileSync(notFoundPath, 'utf8');
  notFoundHtml = notFoundHtml.replace(/__BASE_PATH__/g, normalizedBasePath);
  fs.writeFileSync(notFoundPath, notFoundHtml);
}

console.log('✅ Fixed asset paths in index.html for base path deployment');
