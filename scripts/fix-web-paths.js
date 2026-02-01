#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');

// Read the index.html file
let html = fs.readFileSync(indexPath, 'utf8');

// Replace absolute paths with paths relative to /indirimbo/
html = html.replace(/href="\/_expo\//g, 'href="/indirimbo/_expo/');
html = html.replace(/src="\/_expo\//g, 'src="/indirimbo/_expo/');
html = html.replace(/href="\/favicon\.ico"/g, 'href="/indirimbo/favicon.ico"');

// Write the fixed HTML back
fs.writeFileSync(indexPath, html);

console.log('✅ Fixed asset paths in index.html for GitHub Pages subdirectory deployment');
