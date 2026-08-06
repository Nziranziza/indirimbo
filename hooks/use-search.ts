import type { Song } from '@/constants/types';
import type { SnippetSection } from '@/utils/search-helpers';
import { buildSnippetSections, collapseContractions, countWordCoverage, getMatchSnippet, isCoverageWord } from '@/utils/search-helpers';
import type FuseType from 'fuse.js';
import { useEffect, useMemo, useState } from 'react';

// Fuse scores the whole corpus either way, so a wider pool buys no better
// matches — it only feeds more fuzzy candidates into the coverage tiebreaker,
// which is where the re-rank cost is.
const SEARCH_CANDIDATE_LIMIT = 50;
// How many ranked results we actually render.
const SEARCH_RESULT_LIMIT = 10;
// Fraction of the query's words a title must carry before it counts as a title
// match for tiebreaking. Below this, a title sharing one common word with the
// query would outrank the song that actually contains the searched lyric.
const TITLE_MATCH_COVERAGE_RATIO = 0.75;

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
  readonly titleCoverage: number;
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

    const results = fuseInstance.search(trimmedQuery, { limit: SEARCH_CANDIDATE_LIMIT });
    const collapsedWords = words.map(w => collapseContractions(w));
    // Counted against the words coverage can actually score, not every word in
    // the query: single-character words (`1` in `1 chorus`, kept above because a
    // bare number is a valid song lookup) are never counted, so including them
    // here would set a threshold no title could reach.
    const countableWords = collapsedWords.filter(isCoverageWord).length;
    const titleMatchThreshold = Math.ceil(countableWords * TITLE_MATCH_COVERAGE_RATIO);

    const ranked = results.map((r: { item: FlatSong; score?: number }) => {
      const item = r.item;
      let rank = 3;
      if (item.numberStr === lowerQuery) rank = 0;
      else if (item.lowerName.includes(lowerQuery) || item.nameCollapsed.includes(collapsedQuery)) rank = 1;
      else if (item.lowerSearchText.includes(lowerQuery) || item.searchTextCollapsed.includes(collapsedQuery)) rank = 2;

      const coverageHaystack = `${item.searchTextCollapsed} ${item.nameCollapsed}`;
      const coverage = countWordCoverage(collapsedWords, coverageHaystack);
      // Title coverage catches the match the rank buckets above cannot see: a
      // title that carries the query words but not as one substring, because
      // the book contracts what the user expanded (`Tugiy' i wacu` for
      // `tugiye iwacu`). Collapsing can't bridge that — it removes the
      // apostrophe without restoring the elided vowel.
      const titleWordsMatched = countWordCoverage(collapsedWords, item.nameCollapsed);
      const titleCoverage = titleWordsMatched >= titleMatchThreshold ? titleWordsMatched : 0;

      return {
        playlist: item.playlist,
        song: item,
        rank,
        score: r.score ?? 1,
        coverage,
        titleCoverage,
      };
    });

    ranked.sort((a, b) => {
      if (a.rank !== b.rank) return a.rank - b.rank;
      if (a.coverage !== b.coverage) return b.coverage - a.coverage;
      // Body coverage saturates on short common words (`mu` matches inside
      // `Zizamuke`), so it often ties across unrelated songs. Break those ties
      // on the title before falling through to the Fuse score, which barely
      // discriminates between full-corpus fuzzy matches.
      if (a.titleCoverage !== b.titleCoverage) return b.titleCoverage - a.titleCoverage;
      return a.score - b.score;
    });

    // Snippets are only needed for the rows that render, so build them after
    // ranking has picked the top ones rather than for every candidate.
    return ranked.slice(0, SEARCH_RESULT_LIMIT).map(result => ({
      ...result,
      snippet: getMatchSnippet(result.song, words),
    }));
  }, [query, fuseInstance]);

  return { results, isReady: fuseInstance !== null };
}
