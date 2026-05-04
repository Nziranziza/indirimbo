import { PageHead } from '@/components/page-head';
import { SongListScreen } from '@/components/song-list-screen';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { getPlaylistName } from '@/constants/playlists';
import type { Song } from '@/constants/types';
import { useSongs } from '@/contexts/songs-context';
import { useLocalSearchParams, usePathname } from 'expo-router';
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

  const { agakiza, gushimisha, cantiquesKirundi } = useSongs();
  const songs = useMemo(() => {
    const songsByPlaylist: Record<string, Song[]> = {
      agakiza,
      gushimisha,
      'cantiques-kirundi': cantiquesKirundi,
    };
    return songsByPlaylist[name] ?? [];
  }, [name, agakiza, gushimisha, cantiquesKirundi]);

  const playlistTitle = getPlaylistName(name);
  const PLAYLIST_ICONS: Record<string, IconSymbolName> = {
    agakiza: 'music.note.list',
    gushimisha: 'music.mic',
    'cantiques-kirundi': 'book.fill',
  };
  const iconName: IconSymbolName = PLAYLIST_ICONS[name] ?? 'music.note.list';

  return (
    <>
      <PageHead
        title={`${playlistTitle} | Indirimbo`}
        description={`Browse all ${songs.length} songs in the ${playlistTitle} hymnbook. ${name === 'cantiques-kirundi' ? 'Burundian' : 'Rwandan'} church worship songs with full lyrics.`}
        canonicalPath={`/playlist/${name}/`}
        keywords={`${playlistTitle}, indirimbo, ${name === 'agakiza' ? "agakiza, indirimbo z'agakiza" : name === 'cantiques-kirundi' ? "cantiques kirundi, indirimbo zo guhimbaza imana" : 'gushimisha imana, indirimbo zo gushimisha imana'}, ${name === 'cantiques-kirundi' ? 'burundian hymns' : 'rwandan hymns'}, worship songs`}
        playlist={name}
      />
      <SongListScreen
        title={playlistTitle}
        iconName={iconName}
        songs={songs}
        playlist={name}
        source="playlist"
      />
    </>
  );
}
