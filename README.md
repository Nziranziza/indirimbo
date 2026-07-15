# Indirimbo

A Kinyarwanda church hymnal app for browsing and searching songs from the **Agakiza** and **Gushimisha Imana** hymnbooks. Available on iOS, Android, and the web.

[![App Store](https://img.shields.io/badge/App_Store-0D96F6?style=for-the-badge&logo=app-store&logoColor=white)](https://apps.apple.com/us/app/indirimbo/id6758376573) [![Google Play](https://img.shields.io/badge/Google_Play-414141?style=for-the-badge&logo=google-play&logoColor=white)](https://play.google.com/store/apps/details?id=com.indirimbo.app) [![Web](https://img.shields.io/badge/Web-indirimbo.rw-0ea5e9?style=for-the-badge&logo=safari&logoColor=white)](https://indirimbo.rw)

## Features

- **Two hymnbooks** — Agakiza and Gushimisha Imana, with full lyrics
- **Fuzzy search** — find songs by title, number, or lyrics (powered by Fuse.js)
- **Favorites** — save songs and access them from a dedicated tab
- **Recent songs** — quickly return to songs you've been reading
- **Categories** — browse songs grouped by topic
- **Song navigation** — swipe between songs with prev/next controls and a section heatmap for quick scrolling
- **Customizable reading** — adjustable text size, light/dark/auto theme, and accent color
- **Sharing** — share songs or the app with friends via deep links
- **Offline** — all lyrics are bundled in the app, no internet required
- **OTA updates** — new content and fixes delivered via Expo Updates
- **Cross-platform** — runs on iOS, Android, and web with a single codebase

## Tech Stack

- Expo 55 + React Native 0.83 + TypeScript (strict)
- Expo Router (file-based routing)
- React Native Web for web export
- Fuse.js for fuzzy search
- AsyncStorage for local persistence (favorites, settings, recent songs)
- react-native-reanimated for animations

## Getting Started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the dev server

   ```bash
   npm start
   ```

3. Open the app on a device or simulator — Expo will show options for iOS Simulator, Android Emulator, and Expo Go.

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run web` | Start web dev server |
| `npm run build:web:deploy` | Full web build with SEO pages and sitemap (Cloudflare Pages) |
| `npm run lint` | Run ESLint |
| `npm run release` | Build release binaries for iOS and Android via EAS |
| `npm run update` | Push an OTA update to the production channel |

## Project Structure

```text
app/                 Screens and layouts (Expo Router file-based routing)
  (tabs)/            Bottom tab navigation (home, search, favorites, settings)
  song/              Song detail screen with lyrics viewer
components/          Reusable UI components
constants/           Song data, theme, typography, playlists, types
contexts/            React contexts (songs, theme)
hooks/               Custom hooks (colors, theme, hydration, engagement)
utils/               Helpers (lyrics parsing, storage, sharing)
scripts/             Web build scripts (sitemap, SEO song pages, SPA fallback)
tools/               Song data extraction pipeline
```