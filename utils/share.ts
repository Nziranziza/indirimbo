import { APP_UNIVERSAL_LINK_URL } from '@/constants/app-links';
import { getPlaylistName, getSongTitleLabel } from '@/constants/playlists';
import type { Song } from '@/constants/types';
import { formatSectionForSharing } from '@/utils/format-song-text';
import { Platform, Share } from 'react-native';

interface ShareLinkOptions {
  readonly text?: string;
  readonly url: string;
  readonly title: string;
  readonly dialogTitle: string;
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
    console.error('Share.share failed', { dialogTitle, title, url }, err);
    return false;
  }
}

interface ShareSongOptions {
  readonly songName: string;
  readonly playlist: string;
  readonly songNumber: number | string;
}

export async function shareSong({ songName, playlist, songNumber }: ShareSongOptions): Promise<boolean> {
  const url = `${APP_UNIVERSAL_LINK_URL}/song/${encodeURIComponent(playlist)}/${encodeURIComponent(String(songNumber))}`;
  const text = `${songName} | ${getSongTitleLabel(playlist, songNumber)}`;
  return shareLink({ text, url, title: text, dialogTitle: 'Share song' });
}

interface ShareSongSectionOptions {
  readonly song: Song;
  readonly playlist: string;
  readonly sectionIndex: number;
}

export async function shareSongSection({ song, playlist, sectionIndex }: ShareSongSectionOptions): Promise<boolean> {
  const section = song.body?.[sectionIndex];
  if (!section) return false;
  const text = formatSectionForSharing({ song, sectionIndex });
  if (!text) return false;
  const url = `${APP_UNIVERSAL_LINK_URL}/song/${encodeURIComponent(playlist)}/${encodeURIComponent(String(song.number))}`;
  const title = `${song.name} | ${getSongTitleLabel(playlist, song.number)}`;
  const dialogTitle = section.type === 'chorus' ? 'Share chorus' : 'Share verse';
  return shareLink({ text: `${text}\n\n`, url, title, dialogTitle });
}

interface SharePlaylistOptions {
  readonly playlistId: string;
}

export async function sharePlaylist({ playlistId }: SharePlaylistOptions): Promise<boolean> {
  const playlistName = getPlaylistName(playlistId);
  const url = `${APP_UNIVERSAL_LINK_URL}/playlist/${encodeURIComponent(playlistId)}/`;
  return shareLink({ url, title: playlistName, dialogTitle: 'Share playlist' });
}

interface ShareCategoryOptions {
  readonly categoryName: string;
  readonly slug: string;
}

export async function shareCategory({ categoryName, slug }: ShareCategoryOptions): Promise<boolean> {
  const url = `${APP_UNIVERSAL_LINK_URL}/category/${encodeURIComponent(slug)}/`;
  return shareLink({ url, title: categoryName, dialogTitle: 'Share category' });
}

interface ShareAppOptions {
  readonly isBurundi?: boolean;
}

export async function shareApp({ isBurundi = false }: ShareAppOptions = {}): Promise<void> {
  await shareLink({
    text: isBurundi
      ? 'Check out Indirimbo - Cantiques Kirundi, Gushimisha Imana & Agakiza.'
      : 'Check out Indirimbo - Agakiza no Gushimisha Imana.',
    url: `${APP_UNIVERSAL_LINK_URL}/${isBurundi ? 'download-kirundi' : 'download'}`,
    title: isBurundi
      ? 'Indirimbo - Cantiques Kirundi & Kinyarwanda'
      : 'Indirimbo - Rwandan Hymns & Worship Songs',
    dialogTitle: 'Share Indirimbo',
  });
}
