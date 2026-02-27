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
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const category = gushimishaCategories.find((c) => c.slug === slug);

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
        <title>{`${categoryName} - Gushimisha Imana | Indirimbo`}</title>
        <meta name="description" content={`Browse ${categoryName} hymns from Gushimisha Imana hymnbook. ${songs.length} worship songs with full lyrics.`} />
        <meta property="og:title" content={`${categoryName} - Gushimisha Imana | Indirimbo`} />
        <meta property="og:description" content={`Browse ${categoryName} hymns from Gushimisha Imana hymnbook. ${songs.length} worship songs with full lyrics.`} />
        <meta property="og:image" content="https://indirimbo.rw/og-image.jpg" />
        <meta property="og:url" content={`https://indirimbo.rw/home/category/${slug}`} />
        <meta name="keywords" content={`${categoryName}, gushimisha imana, indirimbo, indirimbo zo gushimisha imana, rwandan hymns, worship songs`} />
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
