# SEO submission scripts

Push indirimbo.rw URLs to search engines for faster crawl/index.

| Engine(s) | Script | Quota | Setup |
|---|---|---|---|
| Bing, Yandex, Naver, Seznam, Mojeek | `seo:indexnow` | none | none past initial deploy |
| Google | `seo:indexing-api` | 200/day | service account + ownership |

## Files

- `url-list.ts` — single source of truth for all canonical URLs (kept aligned with `scripts/generate-sitemap.ts`)
- `submit-indexnow.ts` — bulk submit to IndexNow
- `verify-service-account.ts` — claim ownership of indirimbo.rw for the service account, two-step
- `submit-indexing-api.ts` — daily-quota-aware submit to Google
- `state/` — local state (submission ledger, verification token record); gitignored, regenerated as you run the scripts

## IndexNow

The key file at `public/<key>.txt` proves host ownership. Already deployed.

```sh
npm run seo:indexnow                            # all URLs
npm run seo:indexnow -- --filter /category/ck-  # subset
```

## Google Indexing API

### One-time setup

1. Google Cloud Console → enable both APIs:
   - **Web Search Indexing API**
   - **Site Verification API**
2. Create a service account, download its JSON key
3. Save the key at `secrets/google-indexing-key.json` (gitignored)
4. Make the service account a verified Owner of indirimbo.rw:
   ```sh
   npm run seo:verify-prepare      # writes public/google<hash>.html
   # commit the new file and deploy
   npm run seo:verify-confirm      # Google fetches the file and grants ownership
   ```

### Daily use

```sh
npm run seo:indexing-api                        # up to remaining quota, oldest first
npm run seo:indexing-api -- --filter /song/     # subset
npm run seo:indexing-api -- --max 5             # smoke test
npm run seo:indexing-api -- --force             # bypass 30-day cooldown
```

State at `state/indexing-api-submissions.json` records every successful submission, so
re-runs prefer never-submitted URLs and stay within the 200/day cap automatically.
A full sweep of ~1000 URLs takes ~5 daily runs.

## Troubleshooting

- **`403 SiteVerificationNotCompleted` on first IndexNow run** — Bing verifies the key file asynchronously; retry in 10–30 min.
- **`email not found` when adding the service account in GSC UI** — expected; use `seo:verify-prepare` / `seo:verify-confirm` instead.
- **`Daily quota used: 200/200`** — wait for Pacific midnight, then re-run.
