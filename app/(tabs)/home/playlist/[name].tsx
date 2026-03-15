import { SongListScreen } from '@/components/song-list-screen';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { getPlaylistName } from '@/constants/playlists';
import type { Song } from '@/constants/types';
import { useSongs } from '@/contexts/songs-context';
import { useLocalSearchParams, usePathname } from 'expo-router';
import Head from 'expo-router/head';
import { useMemo } from 'react';

export default function PlaylistScreen() {
  const params = useLocalSearchParams<{ name: string | string[] }>();
  const pathname = usePathname();

  const name = useMemo(() => {
    if (pathname) {
      const pathParts = pathname.split('/').filter(Boolean);
      const playlistIndex = pathParts.indexOf('playlist');
      if (playlistIndex !== -1 && pathParts[playlistIndex + 1]) {
        const playlistName = pathParts[playlistIndex + 1];
        if (playlistName && playlistName !== '[name]' && !playlistName.startsWith('[')) {
          return playlistName;
        }
      }
    }
    const paramName = params.name;
    if (paramName) {
      if (typeof paramName === 'string' && paramName !== '[name]' && !paramName.startsWith('[')) {
        return paramName;
      }
      if (Array.isArray(paramName) && paramName.length > 0) {
        const firstParam = paramName[0];
        if (firstParam && firstParam !== '[name]' && !firstParam.startsWith('[')) {
          return firstParam;
        }
      }
    }
    return 'agakiza';
  }, [params.name, pathname]);

  const { agakiza, gushimisha } = useSongs();
  const songs = useMemo(() => {
    return (name === 'agakiza' ? agakiza : gushimisha) as Song[];
  }, [name, agakiza, gushimisha]);

  const playlistTitle = getPlaylistName(name);
  const iconName: IconSymbolName = name === 'agakiza' ? 'music.note.list' : 'music.mic';

  return (
    <>
      <Head>
        <title>{`${playlistTitle} | Indirimbo`}</title>
        <meta name="description" content={`Browse all ${songs.length} songs in the ${playlistTitle} hymnbook. Rwandan church worship songs with full lyrics.`} />
        <meta property="og:title" content={`${playlistTitle} | Indirimbo`} />
        <meta property="og:description" content={`Browse all ${songs.length} songs in the ${playlistTitle} hymnbook. Rwandan church worship songs with full lyrics.`} />
        <meta property="og:image" content="https://indirimbo.rw/og-image.jpg" />
        <meta property="og:url" content={`https://indirimbo.rw/home/playlist/${name}`} />
        <meta name="keywords" content={`${playlistTitle}, indirimbo, ${name === 'agakiza' ? 'agakiza, indirimbo z\'agakiza' : 'gushimisha imana, indirimbo zo gushimisha imana'}, rwandan hymns, worship songs`} />
      </Head>
      <SongListScreen
        title={playlistTitle}
        iconName={iconName}
        songs={songs}
        playlist={name}
      />
    </>
  );
}
