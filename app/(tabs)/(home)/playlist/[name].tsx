import { PageHead } from '@/components/page-head';
import { SongListScreen } from '@/components/song-list-screen';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import agakizaSongs from '@/constants/agakiza-songs';
import gushimishaSongs from '@/constants/gushimisha-songs';
import cantiquesKirundiSongs from '@/constants/cantiques-kirundi-songs';
import sdahSongs from '@/constants/sdah-songs';
import { PLAYLISTS, getPlaylistName, type PlaylistId } from '@/constants/playlists';
import type { Song } from '@/constants/types';
import { useEngagement } from '@/contexts/engagement-context';
import { useTranslation } from '@/hooks/use-translation';
import { trackEvent } from '@/utils/analytics';
import { sharePlaylist } from '@/utils/share';
import { useLocalSearchParams, usePathname } from 'expo-router';
import { useCallback, useMemo } from 'react';

// Resolve song data synchronously so the screen renders the real song list during
// the static prerender (and on first client render) instead of waiting on the async
// SongsProvider — that's what puts the list into the served HTML for a fast LCP and
// keeps client hydration matching the prerendered output.
const SONGS_BY_PLAYLIST: Record<string, Song[]> = {
  agakiza: agakizaSongs,
  gushimisha: gushimishaSongs,
  'cantiques-kirundi': cantiquesKirundiSongs,
  'sdah-kinyarwanda': sdahSongs,
};

// Prerender one static HTML page per playlist so Expo emits real content for every
// /playlist/<name> route rather than a single shell.
export function generateStaticParams(): { name: string }[] {
  return Object.keys(SONGS_BY_PLAYLIST).map((name) => ({ name }));
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

  const { notifyShareSuccess } = useEngagement();
  const { t } = useTranslation();
  const songs = useMemo(() => SONGS_BY_PLAYLIST[name] ?? [], [name]);

  const playlistTitle = getPlaylistName(name);
  const iconName: IconSymbolName = PLAYLISTS[name as PlaylistId]?.icon ?? 'music.note.list';

  const handleShare = useCallback(async () => {
    trackEvent('share_playlist', {
      playlist: name,
    });
    const completed = await sharePlaylist({ playlistId: name, t });
    if (completed) notifyShareSuccess();
  }, [name, notifyShareSuccess, t]);

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
        onShare={handleShare}
        shareAccessibilityLabel={t('songList.sharePlaylistA11y')}
      />
    </>
  );
}
