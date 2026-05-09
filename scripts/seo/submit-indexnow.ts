/**
 * Submits indirimbo.rw URLs to IndexNow (Bing, Yandex, Naver, Seznam, Mojeek).
 *
 * No auth, no quota. The endpoint verifies ownership by fetching
 *   https://indirimbo.rw/<INDEXNOW_KEY>.txt
 * and checking it contains the same key sent in the request body.
 *
 * Usage:
 *   npm run seo:indexnow                  # submit all URLs
 *   npm run seo:indexnow -- --filter ck   # submit only URLs matching "ck"
 */

import { buildAllUrls, filterUrls, BASE_URL } from './url-list';

const HOST = 'indirimbo.rw';
const ENDPOINT = 'https://api.indexnow.org/IndexNow';
const MAX_URLS_PER_REQUEST = 10_000;

const INDEXNOW_KEY = process.env.INDEXNOW_KEY ?? 'e6f3d13eb5fa1efd985590abfb2652508099fc312bd152048ed4a11afbfb8bf1';

function parseFilterArg(): string | undefined {
  const flagIdx = process.argv.indexOf('--filter');
  return flagIdx >= 0 ? process.argv[flagIdx + 1] : undefined;
}

function chunk<T>(items: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

async function submitBatch(urls: string[]): Promise<void> {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: INDEXNOW_KEY,
      keyLocation: `${BASE_URL}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });

  const body = await res.text();
  if (res.status === 200 || res.status === 202) {
    console.log(`✅ ${res.status} — submitted ${urls.length} URLs`);
    return;
  }

  console.error(`❌ ${res.status} — ${body}`);
  if (res.status === 403) {
    console.error('   Key file mismatch. Verify https://indirimbo.rw/' + INDEXNOW_KEY + '.txt is reachable and contains the key string.');
  }
  process.exit(1);
}

async function main(): Promise<void> {
  const filter = parseFilterArg();
  const all = buildAllUrls();
  const urls = filterUrls(all, filter);

  if (urls.length === 0) {
    console.log('No URLs match. Nothing to submit.');
    return;
  }

  console.log(`Submitting ${urls.length} URLs to IndexNow${filter ? ` (filter: "${filter}")` : ''}…`);

  for (const batch of chunk(urls, MAX_URLS_PER_REQUEST)) {
    await submitBatch(batch);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
