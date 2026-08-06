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
 * Whether a query word can contribute to coverage at all. One-character words
 * are skipped: they near-match almost any haystack, so counting them would make
 * coverage meaningless. Callers deriving a coverage threshold must filter with
 * this too, or they ask for a score the count can never reach (a query like
 * `1 chorus` raises the bar by a word that is never counted).
 */
export function isCoverageWord(word: string): boolean {
  return word.length >= 2;
}

/**
 * Count how many query words have a near-match in the haystack. Used as the
 * primary tiebreaker so a song that fuzzy-matches all four words ranks above
 * a song that exact-matches only one.
 */
export function countWordCoverage(words: string[], haystack: string): number {
  let count = 0;
  for (const w of words) {
    if (!isCoverageWord(w)) continue;
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

export interface SnippetSection {
  readonly label: string;
  readonly lines: readonly string[];
  readonly lowerLines: readonly string[];
  readonly collapsedLines: readonly string[];
}

/**
 * Input to getMatchSnippet. The name variants and snippet sections are
 * precomputed once at index build time (see buildSnippetSections) so the
 * per-keystroke path never re-lowercases or re-collapses text — but they are
 * optional: a plain Song works too, with the fields derived from `body`/`name`.
 */
export interface SnippetSong {
  readonly name: string;
  readonly body: Song['body'];
  readonly lowerName?: string;
  readonly nameCollapsed?: string;
  readonly snippetSections?: readonly SnippetSection[];
}

/**
 * Precompute per-section labels plus lowercased and contraction-collapsed
 * lines once at index build time. Snippet matching runs on every keystroke
 * for the top results, so caching these strings here keeps the hot path from
 * re-splitting, re-lowercasing, and re-collapsing every line per result.
 */
export function buildSnippetSections(body: Song['body']): SnippetSection[] {
  return body.map(section => {
    const label = section.type === 'chorus'
      ? 'Chorus'
      : `Verse ${section.number ?? ''}`;
    const lines = section.content.split('\n');
    const lowerLines = lines.map(line => line.toLowerCase());
    const collapsedLines = lowerLines.map(line => collapseContractions(line));
    return { label, lines, lowerLines, collapsedLines };
  });
}

function countLiteralMatches(lowerLine: string, collapsedLine: string, words: string[]): number {
  let count = 0;
  for (const w of words) {
    if (lowerLine.includes(w) || collapsedLine.includes(w)) count++;
  }
  return count;
}

/**
 * Pick the line carrying the most query words, earliest winning a tie. Scoring
 * every line instead of stopping at the first hit keeps the verse on screen
 * consistent with the coverage tiebreaker that decided the result's rank —
 * otherwise a multi-word query shows whichever verse happens to contain its
 * most common word rather than the one that earned the match.
 */
function findBestLiteralLine(
  sections: readonly SnippetSection[],
  words: string[]
): { section: SnippetSection; line: number } | null {
  let best: { section: SnippetSection; line: number } | null = null;
  let bestCount = 0;
  for (const section of sections) {
    const { lowerLines, collapsedLines } = section;
    for (let i = 0; i < lowerLines.length; i++) {
      const count = countLiteralMatches(lowerLines[i], collapsedLines[i], words);
      // Strictly greater, so the earliest line wins any tie — which makes
      // single-word queries behave exactly as a first-match scan would.
      if (count > bestCount) {
        bestCount = count;
        best = { section, line: i };
      }
    }
  }
  return best;
}

function findFuzzyLine(section: SnippetSection, words: string[]): number {
  const { lowerLines, collapsedLines } = section;
  for (let i = 0; i < lowerLines.length; i++) {
    for (const w of words) {
      if (wordMatchesLineFuzzy(w, lowerLines[i], collapsedLines[i])) return i;
    }
  }
  return -1;
}

function buildSectionSnippet(section: SnippetSection, matchLine: number): { label: string; snippet: string } {
  const { label, lines } = section;
  const start = Math.max(0, matchLine - 1);
  const end = Math.min(lines.length, matchLine + 2);
  const contextLines = lines.slice(start, end);
  const snippet = (start > 0 ? '...' : '') +
    contextLines.join('\n') +
    (end < lines.length ? '...' : '');
  return { label, snippet };
}

/**
 * Fuzzy fallback keeps its first-match early exit: it is only reached when no
 * line matched literally anywhere, and wordMatchesFuzzy is the expensive
 * sliding-window pass, so scoring every line here would multiply that cost.
 */
function findFuzzySnippet(
  sections: readonly SnippetSection[],
  words: string[]
): { label: string; snippet: string } | null {
  for (const section of sections) {
    const matchLine = findFuzzyLine(section, words);
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
export function getMatchSnippet(song: SnippetSong, words: string[]): { label: string; snippet: string } | null {
  if (words.length === 0) return null;

  // Use precomputed fields when present (the useSearch hot path); otherwise
  // derive them so a plain Song works instead of crashing.
  const sections = song.snippetSections ?? buildSnippetSections(song.body);
  const lowerName = song.lowerName ?? song.name.toLowerCase();
  const nameCollapsed = song.nameCollapsed ?? collapseContractions(lowerName);

  const literal = findBestLiteralLine(sections, words);
  if (literal) return buildSectionSnippet(literal.section, literal.line);

  const fuzzy = findFuzzySnippet(sections, words);
  if (fuzzy) return fuzzy;

  for (const w of words) {
    if (
      lowerName.includes(w) ||
      nameCollapsed.includes(w) ||
      wordMatchesLineFuzzy(w, lowerName, nameCollapsed)
    ) {
      return { label: 'Title', snippet: song.name };
    }
  }

  return null;
}
