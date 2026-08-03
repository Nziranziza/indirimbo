import { Platform, TurboModuleRegistry, type TurboModule } from 'react-native';
import { AUDIO_BASE_URL, DEV_AUDIO_PATH } from '@/constants/audio';
import { FULL_HYMN_RECORDINGS, SONG_RECORDINGS } from '@/constants/audio-manifest';

// A recording is named after the collection it came from, not the playlist it
// plays for: songs that share a melody share one file. See
// tools/generate-audio-manifest.js.

// RN's own `SourceCode` module — the same one LogBox uses to find the packager.
// Read through TurboModuleRegistry because the legacy `NativeModules.SourceCode`
// proxy does not expose its constants under the New Architecture.
interface SourceCodeModule extends TurboModule {
  getConstants(): { scriptURL?: string };
}

/**
 * Where recordings are fetched from. In development that is the Expo dev server,
 * which serves `public/audio` off disk (see tools/link-local-audio.sh), so audio
 * works without a deploy. `EXPO_PUBLIC_AUDIO_BASE_URL` in .env.local overrides
 * both.
 */
function resolveAudioBaseUrl(): string {
  const override = process.env.EXPO_PUBLIC_AUDIO_BASE_URL;
  if (override) return override;
  if (!__DEV__) return AUDIO_BASE_URL;

  // Web is served by the dev server itself, so a root-relative path is enough.
  if (Platform.OS === 'web') return DEV_AUDIO_PATH;

  // Native runs on a device or simulator and needs the dev server's origin. Take
  // it from the running bundle's URL, which is by definition the machine serving
  // this app.
  const scriptUrl = TurboModuleRegistry.get<SourceCodeModule>('SourceCode')
    ?.getConstants()
    .scriptURL;
  const devServerOrigin = /^https?:\/\/[^/]+/.exec(scriptUrl ?? '')?.[0];
  return devServerOrigin ? `${devServerOrigin}${DEV_AUDIO_PATH}` : AUDIO_BASE_URL;
}

// Resolved on first use rather than at import time, so the native module lookup
// above never races module evaluation order.
let cachedBaseUrl: string | undefined;
function audioBaseUrl(): string {
  cachedBaseUrl ??= resolveAudioBaseUrl();
  return cachedBaseUrl;
}

const fullHymnRecordings = new Set(FULL_HYMN_RECORDINGS);

/**
 * Whether the song's recording carries the whole hymn, every verse included. Those
 * play once; a recording that is a single verse of melody repeats until the song's
 * verses are done.
 */
export function playsFullHymn(
  playlist: string | undefined,
  songNumber: number | string | undefined,
): boolean {
  if (playlist === undefined || songNumber === undefined) return false;

  const recording = SONG_RECORDINGS[playlist]?.[String(songNumber)];
  return recording !== undefined && fullHymnRecordings.has(recording);
}

export function getSongAudioUrl(
  playlist: string | undefined,
  songNumber: number | string | undefined,
): string | undefined {
  if (playlist === undefined || songNumber === undefined) return undefined;

  const recording = SONG_RECORDINGS[playlist]?.[String(songNumber)];
  if (recording === undefined) return undefined;

  return `${audioBaseUrl()}/${recording}.mp3`;
}
