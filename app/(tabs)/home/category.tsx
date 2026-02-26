import { SongListScreen } from '@/components/song-list-screen';
import { IconSymbol } from '@/components/ui/icon-symbol';
import gushimishaSongs from '@/constants/gushimisha-songs';
import { gushimishaCategories } from '@/constants/gushimisha-categories';
import { useLocalSearchParams } from 'expo-router';
import Head from 'expo-router/head';
import { ComponentProps, useMemo } from 'react';

type IconSymbolName = ComponentProps<typeof IconSymbol>['name'];

interface Song {
  number: number | string;
  name: string;
  url: string;
  body: { type: 'verse' | 'chorus'; number?: number; content: string }[];
}

export default function CategoryScreen() {
  const params = useLocalSearchParams<{ index: string }>();

  const categoryIndex = Number(params.index) || 0;
  const category = gushimishaCategories[categoryIndex];

  const songs = useMemo(() => {
    if (!category) return [];
    const allSongs = gushimishaSongs as Song[];
    const songNumberSet = new Set(category.songs);
    return allSongs
      .filter((song) => songNumberSet.has(Number(song.number)))
      .sort((a, b) => Number(a.number) - Number(b.number));
  }, [category]);

  const categoryName = category?.name || 'Category';
  const categoryIcon = (category?.icon || 'music.note.list') as IconSymbolName;

  return (
    <>
      <Head>
        <title>{`${categoryName} | Indirimbo`}</title>
        <meta name="description" content={`Browse ${categoryName} hymns from Gushimisha Imana hymnbook. ${songs.length} worship songs.`} />
      </Head>
      <SongListScreen
        title={categoryName}
        iconName={categoryIcon}
        songs={songs}
        playlist="gushimisha"
      />
    </>
  );
}
