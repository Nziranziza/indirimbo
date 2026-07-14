import type { Song } from '@/constants/types';
import type { SnippetSection } from '@/utils/search-helpers';
import { buildSnippetSections, collapseContractions, countWordCoverage, getMatchSnippet } from '@/utils/search-helpers';
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
  readonly snippetSections: SnippetSection[];
}

export interface SearchResult {
  readonly playlist: string;
  readonly song: FlatSong;
  readonly rank: number;
  readonly score: number;
  readonly coverage: number;
  readonly snippet: { label: string; snippet: string } | null;
}

export interface UseSearchResult {
  readonly results: SearchResult[];
  // False until Fuse.js has loaded and the index is built, so the screen can
  // show a loading state instead of a premature "no results" on cold start.
  readonly isReady: boolean;
}

export function useSearch(allSongs: Record<string, Song[]>, query: string): UseSearchResult {
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
          snippetSections: buildSnippetSections(song.body),
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
  const results = useMemo(() => {
    if (!query.trim() || !fuseInstance) {
      return [];
    }

    const trimmedQuery = query.trim();
    const lowerQuery = trimmedQuery.toLowerCase();
    const collapsedQuery = collapseContractions(lowerQuery);
    const words = lowerQuery.split(/\s+/).filter(w => w.length >= 2 || /^\d+$/.test(w));

    if (words.length === 0) return [];

    const results = fuseInstance.search(trimmedQuery, { limit: 50 });
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
      };
    });

    ranked.sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      if (a.coverage !== b.coverage) return b.coverage - a.coverage;
      return a.score - b.score;
    });

    // Snippet generation is the heaviest per-result step, so run it only for
    // the results we actually render — after ranking has picked the top 30.
    return ranked.slice(0, 30).map(result => ({
      ...result,
      snippet: getMatchSnippet(result.song, words),
    }));
  }, [query, fuseInstance]);

  return { results, isReady: fuseInstance !== null };
}
