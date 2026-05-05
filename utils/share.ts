import { APP_UNIVERSAL_LINK_URL } from '@/constants/app-links';
import { getSongTitleLabel } from '@/constants/playlists';
import type { Song } from '@/constants/types';
import { formatSectionForSharing } from '@/utils/format-song-text';
import { Platform, Share } from 'react-native';

interface ShareLinkOptions {
  readonly text: string;
  readonly url: string;
  readonly title: string;
  readonly dialogTitle: string;
}

// iOS uses `url` for the rich link preview; Android ignores it, so we embed
// the URL in the message text there.
async function shareLink({ text, url, title, dialogTitle }: ShareLinkOptions): Promise<void> {
  try {
    await Share.share(
      {
        title,
        message: Platform.OS === 'ios' ? text : `${text} ${url}`,
        url,
      },
      { dialogTitle },
    );
  } catch {}
}

interface ShareSongOptions {
  readonly songName: string;
  readonly playlist: string;
  readonly songNumber: number | string;
}

export async function shareSong({ songName, playlist, songNumber }: ShareSongOptions): Promise<void> {
  const url = `${APP_UNIVERSAL_LINK_URL}/song/${encodeURIComponent(playlist)}/${encodeURIComponent(String(songNumber))}`;
  const text = `${songName} | ${getSongTitleLabel(playlist, songNumber)}`;
  await shareLink({ text, url, title: text, dialogTitle: 'Share song' });
}

interface ShareSongSectionOptions {
  readonly song: Song;
  readonly playlist: string;
  readonly sectionIndex: number;
}

export async function shareSongSection({ song, playlist, sectionIndex }: ShareSongSectionOptions): Promise<void> {
  const section = song.body?.[sectionIndex];
  if (!section) return;
  const text = formatSectionForSharing({ song, sectionIndex });
  if (!text) return;
  const url = `${APP_UNIVERSAL_LINK_URL}/song/${encodeURIComponent(playlist)}/${encodeURIComponent(String(song.number))}`;
  const title = `${song.name} | ${getSongTitleLabel(playlist, song.number)}`;
  const dialogTitle = section.type === 'chorus' ? 'Share chorus' : 'Share verse';
  await shareLink({ text: `${text}\n\n`, url, title, dialogTitle });
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
