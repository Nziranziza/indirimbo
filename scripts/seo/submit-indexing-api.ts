/**
 * Submits indirimbo.rw URLs to the Google Indexing API.
 *
 * Setup (one-time):
 *   1. Google Cloud Console → create project → enable "Web Search Indexing API"
 *   2. Create a service account, download the JSON key
 *   3. Save it as ./secrets/google-indexing-key.json (gitignored)
 *   4. Search Console → Settings → Users and permissions → add the service
 *      account email as an Owner of the indirimbo.rw property
 *
 * Quota: 200 URL submissions per day per project. This script tracks every
 * submission in scripts/seo/state/indexing-api-submissions.json so re-runs
 * don't waste quota re-submitting the same URLs.
 *
 * Usage:
 *   npm run seo:indexing-api                    # submit up to daily quota, oldest first
 *   npm run seo:indexing-api -- --filter ck     # only URLs matching "ck"
 *   npm run seo:indexing-api -- --max 50        # cap submissions this run
 *   npm run seo:indexing-api -- --force         # ignore prior-submission cooldown
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JWT } from 'google-auth-library';
import { buildAllUrls, filterUrls } from './url-list';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const KEY_PATH = process.env.GOOGLE_INDEXING_KEY_PATH
  ?? path.join(__dirname, '../../secrets/google-indexing-key.json');
const STATE_PATH = path.join(__dirname, 'state/indexing-api-submissions.json');

const ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';
const SCOPE = 'https://www.googleapis.com/auth/indexing';

const DAILY_QUOTA = 200;
// Don't re-submit a URL that we already submitted within this window.
const RESUBMIT_COOLDOWN_DAYS = 30;

interface State {
  lastSubmittedAt: Record<string, string>;
}

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
}

function loadState(): State {
  if (!fs.existsSync(STATE_PATH)) {
    return { lastSubmittedAt: {} };
  }
  return JSON.parse(fs.readFileSync(STATE_PATH, 'utf8')) as State;
}

function saveState(state: State): void {
  fs.mkdirSync(path.dirname(STATE_PATH), { recursive: true });
  fs.writeFileSync(STATE_PATH, JSON.stringify(state, null, 2) + '\n');
}

function loadServiceAccountKey(): ServiceAccountKey {
  if (!fs.existsSync(KEY_PATH)) {
    console.error(`❌ Service account key not found at ${KEY_PATH}`);
    console.error('   Set GOOGLE_INDEXING_KEY_PATH or place the key at the default path.');
    console.error('   See the comment block at the top of this file for setup steps.');
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(KEY_PATH, 'utf8')) as ServiceAccountKey;
}

interface CliArgs {
  filter?: string;
  max: number;
  force: boolean;
}

function parseMaxArg(argv: readonly string[], maxIdx: number): number {
  if (maxIdx < 0) return DAILY_QUOTA;
  const raw = argv[maxIdx + 1];
  if (raw === undefined) {
    console.error('❌ --max requires a value (a non-negative integer).');
    process.exit(1);
  }
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 0) {
    console.error(`❌ --max must be a non-negative integer; got "${raw}".`);
    process.exit(1);
  }
  return parsed;
}

function parseArgs(): CliArgs {
  const argv = process.argv;
  const filterIdx = argv.indexOf('--filter');
  const maxIdx = argv.indexOf('--max');
  return {
    filter: filterIdx >= 0 ? argv[filterIdx + 1] : undefined,
    max: parseMaxArg(argv, maxIdx),
    force: argv.includes('--force'),
  };
}

function countSubmissionsInLastDay(state: State): number {
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  return Object.values(state.lastSubmittedAt).filter((iso) => Date.parse(iso) > cutoff).length;
}

function pickUrlsToSubmit(allUrls: readonly string[], state: State, args: CliArgs): string[] {
  const cooldownCutoff = Date.now() - RESUBMIT_COOLDOWN_DAYS * 24 * 60 * 60 * 1000;

  const candidates = allUrls.filter((url) => {
    if (args.force) return true;
    const last = state.lastSubmittedAt[url];
    if (!last) return true;
    return Date.parse(last) <= cooldownCutoff;
  });

  // Never-submitted URLs first; otherwise oldest submission first.
  candidates.sort((a, b) => {
    const aSubmitted = state.lastSubmittedAt[a];
    const bSubmitted = state.lastSubmittedAt[b];
    if (!aSubmitted && bSubmitted) return -1;
    if (aSubmitted && !bSubmitted) return 1;
    if (!aSubmitted && !bSubmitted) return 0;
    return Date.parse(aSubmitted) - Date.parse(bSubmitted);
  });

  const used = countSubmissionsInLastDay(state);
  const remainingQuota = Math.max(0, DAILY_QUOTA - used);
  const cap = Math.min(args.max, remainingQuota);

  return candidates.slice(0, cap);
}

async function publish(jwt: JWT, url: string): Promise<{ ok: boolean; status: number; body: string }> {
  const token = await jwt.getAccessToken();
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url, type: 'URL_UPDATED' }),
  });
  const body = await res.text();
  return { ok: res.ok, status: res.status, body };
}

async function main(): Promise<void> {
  const args = parseArgs();
  const key = loadServiceAccountKey();
  const state = loadState();

  const allUrls = filterUrls(buildAllUrls(), args.filter);
  const toSubmit = pickUrlsToSubmit(allUrls, state, args);

  if (toSubmit.length === 0) {
    const used = countSubmissionsInLastDay(state);
    console.log(`Nothing to submit. Daily quota used: ${used}/${DAILY_QUOTA}.`);
    return;
  }

  console.log(`Submitting ${toSubmit.length} URLs to Google Indexing API…`);
  console.log(`   (filter: ${args.filter ?? 'none'}, daily quota used so far: ${countSubmissionsInLastDay(state)}/${DAILY_QUOTA})`);

  const jwt = new JWT({
    email: key.client_email,
    key: key.private_key,
    scopes: [SCOPE],
  });

  let okCount = 0;
  let failCount = 0;

  const handleExit = (): void => {
    saveState(state);
    console.log(`\nState saved. Submitted ${okCount} succeeded, ${failCount} failed.`);
  };
  process.on('SIGINT', () => { handleExit(); process.exit(130); });

  try {
    for (const url of toSubmit) {
      const { ok, status, body } = await publish(jwt, url);
      if (ok) {
        state.lastSubmittedAt[url] = new Date().toISOString();
        okCount++;
        console.log(`  ✓ ${url}`);
      } else {
        failCount++;
        console.error(`  ✗ ${status} ${url} — ${body}`);
        if (status === 429 || status === 403) {
          console.error('  Stopping early; check quota or service account permissions in GSC.');
          break;
        }
      }
    }
  } finally {
    saveState(state);
  }

  console.log(`\nDone. ${okCount} submitted, ${failCount} failed. Daily quota now: ${countSubmissionsInLastDay(state)}/${DAILY_QUOTA}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
