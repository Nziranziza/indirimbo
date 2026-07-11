import { APP_STORE_URL, PLAY_STORE_URL } from '@/constants/app-links';

export type MobileWebPlatform = 'ios' | 'android';

/**
 * Detects the mobile platform from the browser user agent. Returns null on
 * native, desktop web, or any non-mobile agent.
 */
export function getMobileWebPlatform(): MobileWebPlatform | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const userAgent = window.navigator.userAgent || '';
  if (/iphone|ipad|ipod/i.test(userAgent)) {
    return 'ios';
  }
  // iPadOS 13+ Safari reports a Macintosh user agent; distinguish a real iPad
  // from a Mac by its multi-touch support.
  if (/macintosh|mac os x/i.test(userAgent) && window.navigator.maxTouchPoints > 1) {
    return 'ios';
  }
  if (/android/i.test(userAgent)) {
    return 'android';
  }
  return null;
}

/**
 * True when the page is running as an installed PWA (standalone display mode),
 * where an install nudge would be redundant.
 */
export function isStandaloneWeb(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return Boolean(
    window.matchMedia?.('(display-mode: standalone)')?.matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone,
  );
}

/** Store listing URL for the given mobile platform, or null if unset. */
export function getStoreUrl(platform: MobileWebPlatform): string | null {
  return platform === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
}

const ANDROID_SCHEME = 'indirimbo';
const ANDROID_PACKAGE = 'com.indirimbo.app';

/** Current web location as an app-routable path (preserves route + query + hash). */
function getCurrentWebPath(): string {
  if (typeof window === 'undefined') {
    return '/';
  }
  const { pathname, search, hash } = window.location;
  const path = `${pathname || '/'}${search || ''}${hash || ''}`;
  return path.startsWith('/') ? path : `/${path}`;
}

/**
 * Routes the user to the app or the store, per platform:
 *  - Android: an `intent://` URL that opens the installed app at the current
 *    path, with `browser_fallback_url` sending them to the Play Store when it
 *    isn't installed. Android resolves this natively, so it's reliable.
 *  - iOS: always goes straight to the App Store. Safari can't tell us whether a
 *    custom-scheme deep link resolved, so rather than guess we skip it — the
 *    App Store listing already offers "Open" to users who have the app.
 */
export function openAppOrStore(platform: MobileWebPlatform, storeUrl: string | null): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (platform === 'android') {
    const currentPath = getCurrentWebPath();
    const fallback = storeUrl ? `S.browser_fallback_url=${encodeURIComponent(storeUrl)};` : '';
    // Escape any route hash so it doesn't collide with the `#Intent` marker —
    // otherwise Chrome reads it as the URI fragment and ignores the metadata.
    const intentPath = currentPath.replace(/#/g, '%23');
    const intentUrl = `intent:/${intentPath}#Intent;scheme=${ANDROID_SCHEME};package=${ANDROID_PACKAGE};${fallback}end`;
    window.location.href = intentUrl;
    return;
  }

  // iOS → App Store listing (which itself opens the app when already installed).
  if (storeUrl) {
    window.location.href = storeUrl;
  }
}
