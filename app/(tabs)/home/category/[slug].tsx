import { PageHead } from '@/components/page-head';
import { SongListScreen } from '@/components/song-list-screen';
import type { IconSymbolName } from '@/components/ui/icon-symbol';
import { gushimishaCategories } from '@/constants/gushimisha-categories';
import type { Song } from '@/constants/types';
import { useSongs } from '@/contexts/songs-context';
import { useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';

export default function CategoryScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const category = gushimishaCategories.find((c) => c.slug === slug);

  const { gushimisha } = useSongs();
  const songs = useMemo(() => {
    if (!category) return [];
    const allSongs = gushimisha as Song[];
    const songNumberSet = new Set(category.songs);
    return allSongs
      .filter((song) => songNumberSet.has(Number(song.number)))
      .sort((a, b) => Number(a.number) - Number(b.number));
  }, [category, gushimisha]);

  const categoryName = category?.name || 'Category';
  const categoryIcon = (category?.icon || 'music.note.list') as IconSymbolName;

  return (
    <>
      <PageHead
        title={`${categoryName} - Gushimisha Imana | Indirimbo`}
        description={`Browse ${categoryName} hymns from Gushimisha Imana hymnbook. ${songs.length} worship songs with full lyrics.`}
        canonicalPath={`/home/category/${slug}/`}
        keywords={`${categoryName}, gushimisha imana, indirimbo, indirimbo zo gushimisha imana, rwandan hymns, worship songs`}
      />
      <SongListScreen
        title={categoryName}
        iconName={categoryIcon}
        songs={songs}
        playlist="gushimisha"
      />
    </>
  );
}
