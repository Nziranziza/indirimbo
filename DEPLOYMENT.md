# Deployment to GitHub Pages

This app is configured to automatically deploy the web version to GitHub Pages when you push to the master branch.

## Setup (One-time)

1. Go to your GitHub repository settings
2. Navigate to Settings → Pages
3. Under "Build and deployment", select:
   - Source: **GitHub Actions**

## Automatic Deployment

Once configured, the app will automatically deploy when you:
- Push to the master branch
- Manually trigger the workflow from the Actions tab

## Manual Deployment

To manually build and test the web version locally:

```bash
npm run build:web
```

To build for GitHub Pages deployment (with correct paths):

```bash
npm run build:web:gh-pages
```

This will create a `dist` folder with the static web build and fix asset paths for subdirectory deployment.

## URLs

After deployment, your app will be available at:
- **Main app**: https://nziranziza.github.io/indirimbo
- **Privacy Policy**: https://nziranziza.github.io/indirimbo/privacy-policy
- **Terms of Service**: https://nziranziza.github.io/indirimbo/terms-of-service

These URLs are already configured in `app.json` for App Store and Play Store submissions.

## How It Works

The deployment uses:
1. **Expo's built-in web support** - converts React Native code to web
2. **GitHub Actions workflow** (`.github/workflows/deploy-web.yml`) - automates the build and deployment
3. **GitHub Pages** - hosts the static files

The web version uses the same codebase as the mobile app, including all screens like Privacy Policy and Terms of Service, ensuring consistency across platforms.

## Force-update Manifest (`public/version.json`)

Installed apps fetch this file from `https://indirimbo.rw/version.json` to decide whether to show an update prompt. It ships as part of the regular GitHub Pages deploy — no extra commands.

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
4. Push to `master` — the existing `deploy-web.yml` workflow publishes the manifest to gh-pages.

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
