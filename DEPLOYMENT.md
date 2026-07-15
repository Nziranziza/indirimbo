# Deployment to Cloudflare Pages

The web version deploys to **Cloudflare Pages** via its GitHub (Git) integration: Cloudflare builds
straight from the repository. A push to `master` publishes production; any other branch or pull
request gets its own `*.pages.dev` preview build.

## Setup (One-time)

In the Cloudflare dashboard, create a Pages project connected to the `Nziranziza/indirimbo` repo:

- **Production branch:** `master`
- **Framework preset:** None
- **Build command:** `npm run build:web:deploy`
- **Build output directory:** `dist`
- **Environment variable:** `NODE_VERSION = 20`

No other build-time secrets are required. (The Aptabase analytics key is hardcoded, and the Sentry
DSN lives only in the gitignored `.env.local`, so it is not part of the web build — set
`EXPO_PUBLIC_SENTRY_DSN` in the project's env vars only if web crash reporting is wanted.)

## Automatic Deployment

Once connected, the app deploys automatically when you:
- Push to `master` → production build served on the Pages custom domain.
- Push any other branch / open a PR → a preview build on a branch-specific `*.pages.dev` URL.

## Manual / local build

```bash
npm run build:web          # plain Expo web export
npm run build:web:deploy   # full deploy build: export + SEO pages + sitemap + branded 404
```

`build:web:deploy` writes the full static site to `dist/` — the same command Cloudflare runs.

## URLs

Production runs on the custom domain:
- **Main app**: https://indirimbo.rw
- **Privacy Policy**: https://indirimbo.rw/privacy-policy
- **Terms of Service**: https://indirimbo.rw/terms-of-service

These URLs are configured in `app.json` for App Store and Play Store submissions.

## How It Works

1. **Expo static web export** — every route is prerendered to `<route>/index.html`; the `scripts/`
   generators add SEO song/playlist pages, structured data, and the sitemap.
2. **Cloudflare Pages** — serves `dist/` from Cloudflare's global CDN. A root `404.html` is served
   for unmatched paths, and `public/_headers` sets the JSON content-type for the Apple deep-link file
   plus long-lived caching for hashed `/_expo/static/*` assets.
3. **Custom domain** — `indirimbo.rw` is attached to the Pages project; the zone's nameservers are on
   Cloudflare, so DNS and TLS are managed there.

The web version shares the mobile codebase, including screens like Privacy Policy and Terms of
Service, keeping platforms consistent.

## Force-update Manifest (`public/version.json`)

Installed apps fetch this file from `https://indirimbo.rw/version.json` to decide whether to show an update prompt. It ships as part of the regular Cloudflare Pages deploy — no extra commands.

### Schema

```json
{
  "ios":     { "minRequiredVersion": "1.3.0", "latestVersion": "1.3.0" },
  "android": { "minRequiredVersion": "1.3.0", "latestVersion": "1.3.0" }
}
```

The app evaluates two per-platform floors against the installed version:

- `installed < minRequiredVersion` → blocking **Update Required** modal, no skip.
- `minRequiredVersion ≤ installed < latestVersion` → dismissible **Update Available** modal; banner on home if skipped.
- `installed ≥ latestVersion` → nothing.

The only invariant is `minRequiredVersion ≤ latestVersion`. They can match or differ.

Common configurations (assuming a 1.4.0 build is live in the store, prior version 1.3.0):

| Goal                                | `minRequiredVersion` | `latestVersion` | Behavior                                              |
| ----------------------------------- | -------------------- | --------------- | ----------------------------------------------------- |
| Do nothing                          | 1.3.0                | 1.3.0           | Quiet                                                 |
| Suggest 1.4.0 (dismissible)         | 1.3.0                | 1.4.0           | 1.3.0 users get the soft modal/banner                 |
| Force 1.4.0, no soft tier           | 1.4.0                | 1.4.0           | < 1.4.0 users get the blocking modal                  |
| Force 1.4.0, suggest 1.5.0          | 1.4.0                | 1.5.0           | < 1.4.0 forced; 1.4.0 users get the soft modal        |

`minRequiredVersion` and `latestVersion` are independent per platform — bump them on different days as iOS and Android approvals land.

### Workflow when shipping a new native version

1. Bump `app.json` `version`, build via EAS, submit to both stores.
2. Wait for approval. **Verify the new version is downloadable in both the App Store and Google Play.**
3. Edit `public/version.json` to set the new floors (table above).
4. Push to `master` — the Cloudflare Pages build publishes the manifest with the rest of the site.

### Discipline rules

- **Never bump `minRequiredVersion` before the new build is live in the store.** Users tap "Update Now", land on a store page that still shows the old version, and are stuck with no way forward.
- **iOS and Android approve at different times.** Bump each platform's floor independently as approvals land — don't lump them.
- **Soft floor first, hard floor later.** Common pattern: bump `latestVersion` immediately on store approval (suggests the update), then bump `minRequiredVersion` a few days later once the rollout has settled (forces stragglers).

### Propagation

- Cold-start: app fetches the manifest on every launch.
- Foreground: re-fetched on app resume, throttled to **once per hour per session**.
- Active users may take up to an hour to see new manifest values; users who relaunch see them immediately.

### Skip persistence

When a user taps "Maybe later" on the soft modal, the skipped `latestVersion` is stored locally. Bumping `latestVersion` to a higher value automatically voids prior skips — the modal re-prompts on the next check.
