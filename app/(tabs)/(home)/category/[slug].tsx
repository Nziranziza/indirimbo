import { PageHead } from '@/components/page-head';
import { SongListScreen } from '@/components/song-list-screen';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { cantiquesKirundiCategories } from '@/constants/cantiques-kirundi-categories';
import { gushimishaCategories } from '@/constants/gushimisha-categories';
import type { SongCategory } from '@/constants/gushimisha-categories';
import { getPlaylistName } from '@/constants/playlists';
import type { Song } from '@/constants/types';
import { useEngagement } from '@/contexts/engagement-context';
import { useSongs } from '@/contexts/songs-context';
import { trackEvent } from '@/utils/analytics';
import { shareCategory } from '@/utils/share';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo } from 'react';

function findCategory(slug: string, playlist?: string): { category: SongCategory | undefined; resolvedPlaylist: string } {
  if (playlist === 'cantiques-kirundi') {
    return {
      category: cantiquesKirundiCategories.find((c) => c.slug === slug),
      resolvedPlaylist: 'cantiques-kirundi',
    };
  }
  if (playlist === 'gushimisha') {
    return {
      category: gushimishaCategories.find((c) => c.slug === slug),
      resolvedPlaylist: 'gushimisha',
    };
  }
  // No explicit playlist (e.g. direct URL hit, SEO crawler): resolve from the slug.
  const kirundiMatch = cantiquesKirundiCategories.find((c) => c.slug === slug);
  if (kirundiMatch) {
    return { category: kirundiMatch, resolvedPlaylist: 'cantiques-kirundi' };
  }
  return {
    category: gushimishaCategories.find((c) => c.slug === slug),
    resolvedPlaylist: 'gushimisha',
  };
}

export default function CategoryScreen() {
  const { slug, playlist } = useLocalSearchParams<{ slug: string; playlist?: string }>();

  const { category, resolvedPlaylist } = findCategory(slug, playlist);

  const { gushimisha, cantiquesKirundi } = useSongs();
  const { notifyShareSuccess } = useEngagement();
  const songs = useMemo(() => {
    if (!category) return [];
    const allSongs = resolvedPlaylist === 'cantiques-kirundi'
      ? (cantiquesKirundi as Song[])
      : (gushimisha as Song[]);
    const songNumberSet = new Set(category.songs);
    return allSongs
      .filter((song) => songNumberSet.has(Number(song.number)))
      .sort((a, b) => Number(a.number) - Number(b.number));
  }, [category, resolvedPlaylist, gushimisha, cantiquesKirundi]);

  const categoryName = category?.name || 'Category';
  const categoryIcon = (category?.icon || 'music.note.list') as IconSymbolName;
  const playlistDisplayName = getPlaylistName(resolvedPlaylist);

  const handleShare = useCallback(async () => {
    if (!category) return;
    trackEvent('share_category', {
      playlist: resolvedPlaylist,
      slug: category.slug,
      category_name: category.name,
    });
    const completed = await shareCategory({
      categoryName: category.name,
      slug: category.slug,
    });
    if (completed) notifyShareSuccess();
  }, [category, resolvedPlaylist, notifyShareSuccess]);

  return (
    <>
      <PageHead
        title={`${categoryName} - ${playlistDisplayName} | Indirimbo`}
        description={`Browse ${categoryName} hymns from ${playlistDisplayName} hymnbook. ${songs.length} worship songs with full lyrics.`}
        canonicalPath={`/category/${slug}/`}
        keywords={`${categoryName}, ${playlistDisplayName}, indirimbo, hymns, worship songs`}
        playlist={resolvedPlaylist}
      />
      <SongListScreen
        title={categoryName}
        iconName={categoryIcon}
        songs={songs}
        playlist={resolvedPlaylist}
        source="category"
        onShare={category ? handleShare : undefined}
        shareAccessibilityLabel="Share category"
      />
    </>
  );
}
