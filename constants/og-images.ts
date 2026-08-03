import { APP_UNIVERSAL_LINK_URL } from '@/constants/app-links';
import type { PlaylistId } from '@/constants/playlists';

// The site's social preview images. Wide (1200x630) and branded per collection, so
// they double as the Android lock screen artwork — that card uses artwork as a
// full-bleed background, which suits a banner rather than a square icon.
const OG_IMAGE_BY_PLAYLIST: Partial<Record<PlaylistId, string>> = {
  'cantiques-kirundi': `${APP_UNIVERSAL_LINK_URL}/og-image-kirundi.jpg`,
  'sdah-kinyarwanda': `${APP_UNIVERSAL_LINK_URL}/og-image-sdah-rw.jpg`,
};

const DEFAULT_OG_IMAGE = `${APP_UNIVERSAL_LINK_URL}/og-image.jpg`;

/** Social preview image for a playlist, falling back to the app-wide one. */
export function getPlaylistOgImageUrl(playlist: string | undefined): string {
  return OG_IMAGE_BY_PLAYLIST[playlist as PlaylistId] ?? DEFAULT_OG_IMAGE;
}
