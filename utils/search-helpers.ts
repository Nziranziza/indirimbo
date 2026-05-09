import type { Song } from '@/constants/types';

const APOSTROPHE_AND_TRAILING_SPACES = /[’'][ \t]*/g;

/**
 * Collapse Kinyarwanda contractions: strip apostrophes (U+2019 or ASCII)
 * along with any spaces that follow, so `Nubw' ab' is' ar' abatunzi` becomes
 * `Nubwabisarabatunzi`. Users mentally expand contractions when searching
 * (typing "nubwo abisi ari abatunzi"); matching the collapsed source is far
 * closer to that mental model than the apostrophe-broken original.
 */
export function collapseContractions(text: string): string {
  return text.replace(APOSTROPHE_AND_TRAILING_SPACES, '');
}

function levenshteinUpTo(a: string, b: string, maxDist: number): number {
  if (Math.abs(a.length - b.length) > maxDist) return maxDist + 1;
  const m = a.length;
  const n = b.length;
  let prev = new Array<number>(n + 1);
  let curr = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const v = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      curr[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > maxDist) return maxDist + 1;
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/**
 * Sliding-window fuzzy substring match. Returns true if `word` appears in
 * `haystack` within `maxDist` character edits. Used to count how many query
 * words have any near-match in the song body, which compensates for vowels
 * elided by Kinyarwanda contractions (`Nubw'` → user types `nubwo`).
 */
function wordMatchesFuzzy(word: string, haystack: string, maxDist: number): boolean {
  if (haystack.includes(word)) return true;
  if (word.length < 3 || maxDist === 0) return false;
  const targetLen = word.length;
  const minLen = Math.max(2, targetLen - maxDist);
  const maxLen = targetLen + maxDist;
  for (let i = 0; i <= haystack.length - minLen; i++) {
    for (let len = minLen; len <= maxLen && i + len <= haystack.length; len++) {
      if (levenshteinUpTo(word, haystack.substring(i, i + len), maxDist) <= maxDist) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Count how many query words have a near-match in the haystack. Used as the
 * primary tiebreaker so a song that fuzzy-matches all four words ranks above
 * a song that exact-matches only one.
 */
export function countWordCoverage(words: string[], haystack: string): number {
  let count = 0;
  for (const w of words) {
    if (w.length < 2) continue;
    // 1-edit fuzzy for words >= 3 chars covers Kinyarwanda contractions
    // where the user types the elided vowel (e.g. `ari` → source `ar`).
    const maxDist = w.length >= 3 ? 1 : 0;
    if (wordMatchesFuzzy(w, haystack, maxDist)) count++;
  }
  return count;
}

function wordMatchesLineFuzzy(w: string, lowerLine: string, collapsedLine: string): boolean {
  // Same fuzzy threshold as countWordCoverage so a song that ranks for fuzzy
  // matches (e.g. user types `nubwo`, source has `Nubw'`) still gets a snippet.
  const maxDist = w.length >= 3 ? 1 : 0;
  return wordMatchesFuzzy(w, lowerLine, maxDist) || wordMatchesFuzzy(w, collapsedLine, maxDist);
}

function findMatchingLine(lines: string[], words: string[], fuzzy: boolean): number {
  for (let i = 0; i < lines.length; i++) {
    const lowerLine = lines[i].toLowerCase();
    const collapsedLine = collapseContractions(lowerLine);
    for (const w of words) {
      if (lowerLine.includes(w) || collapsedLine.includes(w)) return i;
      if (fuzzy && wordMatchesLineFuzzy(w, lowerLine, collapsedLine)) return i;
    }
  }
  return -1;
}

function buildSectionSnippet(section: Song['body'][number], matchLine: number): { label: string; snippet: string } {
  const label = section.type === 'chorus'
    ? 'Chorus'
    : `Verse ${section.number ?? ''}`;
  const lines = section.content.split('\n');
  const start = Math.max(0, matchLine - 1);
  const end = Math.min(lines.length, matchLine + 2);
  const contextLines = lines.slice(start, end);
  const snippet = (start > 0 ? '...' : '') +
    contextLines.join('\n') +
    (end < lines.length ? '...' : '');
  return { label, snippet };
}

function findSnippetInBody(song: Song, words: string[], fuzzy: boolean) {
  for (const section of song.body) {
    const lines = section.content.split('\n');
    const matchLine = findMatchingLine(lines, words, fuzzy);
    if (matchLine !== -1) return buildSectionSnippet(section, matchLine);
  }
  return null;
}

/**
 * Pick the verse/chorus snippet to render under a search result. Two passes
 * over the body so a literal hit in a later section beats a fuzzy hit in an
 * earlier one — otherwise short words like `ari` would stick on `kri` in
 * "Krisito" before reaching the line the user actually searched for.
 */
export function getMatchSnippet(song: Song, words: string[]): { label: string; snippet: string } | null {
  if (words.length === 0) return null;

  const literal = findSnippetInBody(song, words, false);
  if (literal) return literal;

  const fuzzy = findSnippetInBody(song, words, true);
  if (fuzzy) return fuzzy;

  const lowerName = song.name.toLowerCase();
  const collapsedName = collapseContractions(lowerName);
  for (const w of words) {
    if (
      lowerName.includes(w) ||
      collapsedName.includes(w) ||
      wordMatchesLineFuzzy(w, lowerName, collapsedName)
    ) {
      return { label: 'Title', snippet: song.name };
    }
  }

  return null;
}
