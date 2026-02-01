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

This will create a `dist` folder with the static web build.

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
