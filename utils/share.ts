import { APP_UNIVERSAL_LINK_URL } from '@/constants/app-links';
import { getPlaylistName, getSongTitleLabel } from '@/constants/playlists';
import type { TranslationKey } from '@/constants/translations';
import type { Song } from '@/constants/types';
import { formatSectionForSharing } from '@/utils/format-song-text';
import { Platform, Share } from 'react-native';

type Translator = (key: TranslationKey, params?: Record<string, string | number>) => string;

interface ShareLinkOptions {
  readonly text?: string;
  readonly url: string;
  readonly title: string;
  readonly dialogTitle: string;
}

// The web Share API (navigator.share) rejects with an AbortError when the user
// dismisses the share sheet. That's a normal cancellation, not a failure, so we
// swallow it without logging.
function isShareCancellation(err: unknown): boolean {
  return typeof err === 'object' && err !== null && 'name' in err && err.name === 'AbortError';
}

// iOS uses `url` for the rich link preview; Android ignores it, so we embed
// the URL in the message text there. Omit `text` for a URL-only share.
// Returns whether the share completed (sharedAction); Android's Share API
// doesn't differentiate cancel and is treated as completed.
async function shareLink({ text, url, title, dialogTitle }: ShareLinkOptions): Promise<boolean> {
  try {
    const message = Platform.OS === 'ios' ? text ?? '' : text ? `${text} ${url}` : url;
    const result = await Share.share(
      { title, message, url },
      { dialogTitle },
    );
    return Platform.OS !== 'ios' || result.action === 'sharedAction';
  } catch (err) {
    if (isShareCancellation(err)) return false;
    console.error('Share.share failed', { dialogTitle, title, url }, err);
    return false;
  }
}

interface ShareSongOptions {
  readonly songName: string;
  readonly playlist: string;
  readonly songNumber: number | string;
  readonly t: Translator;
}

export async function shareSong({ songName, playlist, songNumber, t }: ShareSongOptions): Promise<boolean> {
  const url = `${APP_UNIVERSAL_LINK_URL}/song/${encodeURIComponent(playlist)}/${encodeURIComponent(String(songNumber))}`;
  const text = `${songName} | ${getSongTitleLabel(playlist, songNumber)}`;
  return shareLink({ text, url, title: text, dialogTitle: t('share.dialog.song') });
}

interface ShareSongSectionOptions {
  readonly song: Song;
  readonly playlist: string;
  readonly sectionIndex: number;
  readonly t: Translator;
}

export async function shareSongSection({ song, playlist, sectionIndex, t }: ShareSongSectionOptions): Promise<boolean> {
  const section = song.body?.[sectionIndex];
  if (!section) return false;
  const text = formatSectionForSharing({ song, sectionIndex });
  if (!text) return false;
  const url = `${APP_UNIVERSAL_LINK_URL}/song/${encodeURIComponent(playlist)}/${encodeURIComponent(String(song.number))}`;
  const title = `${song.name} | ${getSongTitleLabel(playlist, song.number)}`;
  const dialogTitle = section.type === 'chorus' ? t('share.dialog.chorus') : t('share.dialog.verse');
  return shareLink({ text: `${text}\n\n`, url, title, dialogTitle });
}

interface SharePlaylistOptions {
  readonly playlistId: string;
  readonly t: Translator;
}

export async function sharePlaylist({ playlistId, t }: SharePlaylistOptions): Promise<boolean> {
  const playlistName = getPlaylistName(playlistId);
  const url = `${APP_UNIVERSAL_LINK_URL}/playlist/${encodeURIComponent(playlistId)}/`;
  return shareLink({ url, title: playlistName, dialogTitle: t('share.dialog.playlist') });
}

interface ShareCategoryOptions {
  readonly categoryName: string;
  readonly slug: string;
  readonly t: Translator;
}

export async function shareCategory({ categoryName, slug, t }: ShareCategoryOptions): Promise<boolean> {
  const url = `${APP_UNIVERSAL_LINK_URL}/category/${encodeURIComponent(slug)}/`;
  return shareLink({ url, title: categoryName, dialogTitle: t('share.dialog.category') });
}

interface ShareAppOptions {
  readonly isBurundi?: boolean;
  readonly t: Translator;
}

export async function shareApp({ isBurundi = false, t }: ShareAppOptions): Promise<boolean> {
  return shareLink({
    text: t(isBurundi ? 'share.app.messageKirundi' : 'share.app.messageKinyarwanda'),
    url: `${APP_UNIVERSAL_LINK_URL}/${isBurundi ? 'download-kirundi' : 'download'}`,
    title: t(isBurundi ? 'share.app.titleKirundi' : 'share.app.titleKinyarwanda'),
    dialogTitle: t('share.dialog.app'),
  });
}
