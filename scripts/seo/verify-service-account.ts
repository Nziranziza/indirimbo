/**
 * Makes the service account a verified Owner of indirimbo.rw without using the
 * GSC UI (which currently rejects service-account emails on URL-prefix
 * properties). Uses the Site Verification API: the service account gets its
 * own google<hash>.html file, we host it on the site, and the service account
 * verifies itself.
 *
 * Prerequisite: in Google Cloud Console, enable the *Site Verification API*
 * for the same project (in addition to the *Web Search Indexing API*).
 *
 * Usage (two-step, with a deploy in between):
 *   npm run seo:verify-prepare   # writes public/google<hash>.html
 *   git add public/google*.html && git commit && deploy
 *   npm run seo:verify-confirm   # tells Google to fetch & verify
 *
 * After confirm succeeds, npm run seo:indexing-api will work.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { JWT } from 'google-auth-library';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const KEY_PATH = process.env.GOOGLE_INDEXING_KEY_PATH
  ?? path.join(__dirname, '../../secrets/google-indexing-key.json');
const SITE_IDENTIFIER = 'https://indirimbo.rw/';
const PUBLIC_DIR = path.join(__dirname, '../../public');
const TOKEN_RECORD_PATH = path.join(__dirname, 'state/site-verification.json');

const SCOPE = 'https://www.googleapis.com/auth/siteverification';

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
}

interface TokenRecord {
  filename: string;
  site: string;
  preparedAt: string;
}

function loadKey(): ServiceAccountKey {
  if (!fs.existsSync(KEY_PATH)) {
    console.error(`❌ Service account key not found at ${KEY_PATH}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(KEY_PATH, 'utf8');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error(`❌ Service account key at ${KEY_PATH} is not valid JSON: ${(err as Error).message}`);
    process.exit(1);
  }

  if (
    typeof parsed !== 'object' || parsed === null
    || typeof (parsed as Record<string, unknown>).client_email !== 'string'
    || typeof (parsed as Record<string, unknown>).private_key !== 'string'
  ) {
    console.error(`❌ Service account key at ${KEY_PATH} is missing client_email or private_key strings.`);
    console.error('   Re-download the JSON key from GCP IAM → Service Accounts → Keys.');
    process.exit(1);
  }

  return parsed as ServiceAccountKey;
}

async function getAccessToken(): Promise<string> {
  const key = loadKey();
  const jwt = new JWT({ email: key.client_email, key: key.private_key, scopes: [SCOPE] });
  const { token } = await jwt.getAccessToken();
  if (!token) {
    console.error('❌ Failed to obtain access token from service account.');
    process.exit(1);
  }
  return token;
}

async function prepare(): Promise<void> {
  const accessToken = await getAccessToken();

  const res = await fetch('https://www.googleapis.com/siteVerification/v1/token', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      verificationMethod: 'FILE',
      site: { type: 'SITE', identifier: SITE_IDENTIFIER },
    }),
  });

  if (!res.ok) {
    console.error(`❌ Failed to request verification token: ${res.status}`);
    console.error(await res.text());
    console.error('   Make sure the Site Verification API is enabled for this GCP project.');
    process.exit(1);
  }

  const { token } = (await res.json()) as { token: string; method: string };
  if (!token) {
    console.error('❌ Response did not include a token.');
    process.exit(1);
  }

  const filePath = path.join(PUBLIC_DIR, token);
  const content = `google-site-verification: ${token}\n`;
  fs.writeFileSync(filePath, content);

  fs.mkdirSync(path.dirname(TOKEN_RECORD_PATH), { recursive: true });
  const record: TokenRecord = {
    filename: token,
    site: SITE_IDENTIFIER,
    preparedAt: new Date().toISOString(),
  };
  fs.writeFileSync(TOKEN_RECORD_PATH, JSON.stringify(record, null, 2) + '\n');

  console.log(`✅ Wrote public/${token}`);
  console.log('');
  console.log('Next:');
  console.log(`  1. git add public/${token} && commit && deploy`);
  console.log(`  2. Verify reachable: curl https://indirimbo.rw/${token}`);
  console.log('  3. npm run seo:verify-confirm');
}

async function confirm(): Promise<void> {
  if (!fs.existsSync(TOKEN_RECORD_PATH)) {
    console.error('❌ No prepared token. Run "npm run seo:verify-prepare" first.');
    process.exit(1);
  }
  const { filename, site } = JSON.parse(fs.readFileSync(TOKEN_RECORD_PATH, 'utf8')) as TokenRecord;

  const probeUrl = `${site.replace(/\/$/, '')}/${filename}`;
  const probe = await fetch(probeUrl);
  if (!probe.ok) {
    console.error(`❌ Verification file not reachable at ${probeUrl} (HTTP ${probe.status}).`);
    console.error('   Deploy the file first, then re-run confirm.');
    process.exit(1);
  }

  const accessToken = await getAccessToken();

  const res = await fetch(
    'https://www.googleapis.com/siteVerification/v1/webResource?verificationMethod=FILE',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        site: { type: 'SITE', identifier: site },
      }),
    },
  );

  if (!res.ok) {
    console.error(`❌ Verification failed: ${res.status}`);
    console.error(await res.text());
    process.exit(1);
  }

  const data = (await res.json()) as { id?: string; owners?: string[] };
  console.log(`✅ Service account verified as Owner of ${site}`);
  if (data.owners && data.owners.length > 0) {
    console.log(`   Owners: ${data.owners.join(', ')}`);
  }
  console.log('');
  console.log('You can now run: npm run seo:indexing-api');
}

const cmd = process.argv[2];
if (cmd === 'prepare') {
  prepare().catch((err) => { console.error(err); process.exit(1); });
} else if (cmd === 'confirm') {
  confirm().catch((err) => { console.error(err); process.exit(1); });
} else {
  console.error('Usage: tsx scripts/seo/verify-service-account.ts [prepare|confirm]');
  process.exit(1);
}
