import type { Song } from '@/constants/types';
import { collapseContractions, countWordCoverage, getMatchSnippet } from '@/utils/search-helpers';
import type FuseType from 'fuse.js';
import { useEffect, useMemo, useState } from 'react';

interface FlatSong extends Song {
  readonly playlist: string;
  readonly lowerName: string;
  readonly searchText: string;
  readonly lowerSearchText: string;
  readonly numberStr: string;
  readonly nameCollapsed: string;
  readonly searchTextCollapsed: string;
}

export interface SearchResult {
  readonly playlist: string;
  readonly song: FlatSong;
  readonly rank: number;
  readonly score: number;
  readonly coverage: number;
  readonly snippet: { label: string; snippet: string } | null;
}

export function useSearch(allSongs: Record<string, Song[]>, debouncedQuery: string): SearchResult[] {
  // Create flat list with pre-computed search fields
  const allSongsFlat = useMemo(() => {
    return Object.entries(allSongs).flatMap(([playlist, songs]) =>
      songs.map(song => {
        const lowerName = song.name.toLowerCase();
        const searchText = song.body.map(s => s.content).join('\n');
        const lowerSearchText = searchText.toLowerCase();
        return {
          ...song,
          playlist,
          lowerName,
          searchText,
          lowerSearchText,
          numberStr: String(song.number),
          nameCollapsed: collapseContractions(lowerName),
          searchTextCollapsed: collapseContractions(lowerSearchText),
        };
      })
    );
  }, [allSongs]);

  // Lazy-load Fuse.js and build index
  const [fuseInstance, setFuseInstance] = useState<FuseType<FlatSong> | null>(null);

  useEffect(() => {
    if (allSongsFlat.length === 0) return;
    let cancelled = false;
    import('fuse.js').then(({ default: Fuse }) => {
      if (cancelled) return;
      const keys = [
        { name: 'numberStr' as const, weight: 0.3 },
        { name: 'name' as const, weight: 0.25 },
        { name: 'nameCollapsed' as const, weight: 0.25 },
        { name: 'searchText' as const, weight: 0.1 },
        { name: 'searchTextCollapsed' as const, weight: 0.1 },
      ];
      const index = Fuse.createIndex(keys, allSongsFlat);
      const instance = new Fuse(allSongsFlat, {
        keys,
        threshold: 0.35,
        ignoreLocation: true,
        useExtendedSearch: true,
        includeScore: true,
      }, index);
      setFuseInstance(instance);
    });
    return () => { cancelled = true; };
  }, [allSongsFlat]);

  // Compute ranked search results
  return useMemo(() => {
    if (!debouncedQuery.trim() || !fuseInstance) {
      return [];
    }

    const query = debouncedQuery.trim();
    const lowerQuery = query.toLowerCase();
    const collapsedQuery = collapseContractions(lowerQuery);
    const words = lowerQuery.split(/\s+/).filter(w => w.length >= 2 || /^\d+$/.test(w));

    if (words.length === 0) return [];

    const results = fuseInstance.search(query, { limit: 50 });
    const collapsedWords = words.map(w => collapseContractions(w));

    const ranked = results.map((r: { item: FlatSong; score?: number }) => {
      const item = r.item;
      let rank = 3;
      if (item.numberStr === lowerQuery) rank = 0;
      else if (item.lowerName.includes(lowerQuery) || item.nameCollapsed.includes(collapsedQuery)) rank = 1;
      else if (item.lowerSearchText.includes(lowerQuery) || item.searchTextCollapsed.includes(collapsedQuery)) rank = 2;

      const coverageHaystack = `${item.searchTextCollapsed} ${item.nameCollapsed}`;
      const coverage = countWordCoverage(collapsedWords, coverageHaystack);

      return {
        playlist: item.playlist,
        song: item,
        rank,
        score: r.score ?? 1,
        coverage,
        snippet: getMatchSnippet(item, words),
      };
    });

    ranked.sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      if (a.coverage !== b.coverage) return b.coverage - a.coverage;
      return a.score - b.score;
    });

    return ranked.slice(0, 30);
  }, [debouncedQuery, fuseInstance]);
}
