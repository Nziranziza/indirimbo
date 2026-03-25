import { APP_UNIVERSAL_LINK_URL } from '@/constants/app-links';
import { getPlaylistName } from '@/constants/playlists';
import { Share } from 'react-native';

interface ShareSongOptions {
  readonly songName: string;
  readonly playlist: string;
  readonly songNumber: number | string;
}

export async function shareSong({ songName, playlist, songNumber }: ShareSongOptions): Promise<void> {
  const songUrl = `${APP_UNIVERSAL_LINK_URL}/song/${encodeURIComponent(playlist)}/${encodeURIComponent(String(songNumber))}`;
  const playlistTitle = getPlaylistName(playlist);
  const shareMessage = `${songName} • ${playlistTitle} #${songNumber}`;
  await Share.share(
    { message: `${shareMessage}\n${songUrl}`, title: shareMessage },
    { dialogTitle: 'Share song' },
  );
}
