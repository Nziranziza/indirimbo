// Official recordings are served from their own Cloudflare Pages site, deployed
// from the separate `indirimbo-audio` repo (see tools/prepare-audio-repo.sh).
// Keeping the ~93MB of MP3s out of this repo keeps clones and app-site builds
// small, and lets new recordings ship without redeploying the app.
// Files are laid out as `<base>/<playlist>/<zero-padded song number>.mp3`,
// e.g. https://audio.indirimbo.rw/sdah-kinyarwanda/001.mp3
export const AUDIO_BASE_URL = 'https://audio.indirimbo.rw';

// Path the recordings are served from, relative to the site root. In development
// that root is the Expo dev server, which serves `public/` (range requests
// included), so audio works against local files without a deploy.
export const DEV_AUDIO_PATH = '/audio';
