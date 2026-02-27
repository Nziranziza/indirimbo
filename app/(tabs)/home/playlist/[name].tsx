import { SongListScreen } from '@/components/song-list-screen';
import { IconSymbol } from '@/components/ui/icon-symbol';
import agakizaSongs from '@/constants/agakiza-songs';
import gushimishaSongs from '@/constants/gushimisha-songs';
import { getPlaylistName } from '@/constants/playlists';
import { useLocalSearchParams, usePathname } from 'expo-router';
import Head from 'expo-router/head';
import { ComponentProps, useMemo } from 'react';

type IconSymbolName = ComponentProps<typeof IconSymbol>['name'];

interface Song {
  number: number | string;
  name: string;
  url: string;
  body: { type: 'verse' | 'chorus'; number?: number; content: string }[];
}

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

  const songs = useMemo(() => {
    return (name === 'agakiza' ? agakizaSongs : gushimishaSongs) as Song[];
  }, [name]);

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
        <meta property="og:url" content={`https://indirimbo.rw/playlist/${name}`} />
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
