#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

// Read the index.html file
let html = fs.readFileSync(indexPath, 'utf8');

const basePath = (process.env.BASE_PATH || '').trim();

if (!basePath) {
  console.log('ℹ️  No BASE_PATH set; leaving asset paths unchanged');
  process.exit(0);
}

const normalizedBasePath = basePath.startsWith('/') ? basePath : `/${basePath}`;

// Replace absolute paths with paths relative to the base path
html = html.replace(/href="\/_expo\//g, `href="${normalizedBasePath}/_expo/`);
html = html.replace(/src="\/_expo\//g, `src="${normalizedBasePath}/_expo/`);
html = html.replace(/href="\/favicon\.ico"/g, `href="${normalizedBasePath}/favicon.ico"`);

// Write the fixed HTML back
fs.writeFileSync(indexPath, html);

console.log('✅ Fixed asset paths in index.html for base path deployment');
