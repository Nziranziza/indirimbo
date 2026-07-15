/**
 * Post-build fix for Cloudflare Pages.
 *
 * Cloudflare Pages refuses to upload any directory named `node_modules` from the
 * build output. Expo's static export emits shared assets (the @expo/vector-icons
 * icon fonts, plus @react-navigation and expo-router images) under
 * dist/assets/node_modules/**, so on Cloudflare those files 404 and icons render
 * as tofu boxes. (GitHub Pages uploaded them, so this never surfaced there.)
 *
 * This renames dist/assets/node_modules → dist/assets/vendor and rewrites the
 * matching `assets/node_modules/` asset URLs baked into the JS bundles. It must
 * run AFTER `expo export`; running it last in the build chain is safe.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');

const FROM_DIR = path.join(distDir, 'assets/node_modules');
const TO_DIR = path.join(distDir, 'assets/vendor');
// Anchored on the `assets/` prefix so we only touch emitted asset URLs, never a
// bare `node_modules/` path (e.g. original source paths inside source maps).
const FROM_REF = 'assets/node_modules/';
const TO_REF = 'assets/vendor/';

const REWRITE_EXTENSIONS = new Set(['.js', '.html', '.css', '.json', '.txt', '.xml', '.map']);

const rewriteReferences = (dir: string): number => {
  let rewritten = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      rewritten += rewriteReferences(fullPath);
    } else if (REWRITE_EXTENSIONS.has(path.extname(entry.name))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(FROM_REF)) {
        fs.writeFileSync(fullPath, content.split(FROM_REF).join(TO_REF));
        rewritten += 1;
      }
    }
  }
  return rewritten;
};

const main = (): void => {
  if (!fs.existsSync(FROM_DIR)) {
    console.log('ℹ️  No dist/assets/node_modules directory — nothing to relocate.');
    return;
  }

  fs.renameSync(FROM_DIR, TO_DIR);
  const rewrittenFiles = rewriteReferences(distDir);

  console.log(
    `✅ Relocated assets/node_modules → assets/vendor and rewrote ${rewrittenFiles} file(s) for Cloudflare Pages`
  );
};

main();
