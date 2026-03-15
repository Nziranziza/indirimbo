import type { Song } from '@/constants/types';

/** Find a matching snippet in the song body — uses direct indexOf (fast) */
export function getMatchSnippet(song: Song, words: string[]): { label: string; snippet: string } | null {
  if (words.length === 0) return null;

  for (const section of song.body) {
    const lowerContent = section.content.toLowerCase();
    // Find the first word that appears in this section
    let matchIndex = -1;
    for (const w of words) {
      matchIndex = lowerContent.indexOf(w);
      if (matchIndex !== -1) break;
    }
    if (matchIndex === -1) continue;

    const label = section.type === 'chorus'
      ? 'Chorus'
      : `Verse ${section.number ?? ''}`;

    // Get the matching line and surrounding lines for context
    const lines = section.content.split('\n');
    let charCount = 0;
    for (let i = 0; i < lines.length; i++) {
      const lineEnd = charCount + lines[i].length;
      if (matchIndex >= charCount && matchIndex < lineEnd) {
        const start = Math.max(0, i - 1);
        const end = Math.min(lines.length, i + 2);
        const contextLines = lines.slice(start, end);
        const snippet = (start > 0 ? '...' : '') +
          contextLines.join('\n') +
          (end < lines.length ? '...' : '');
        return { label, snippet };
      }
      charCount = lineEnd + 1;
    }

    return { label, snippet: section.content };
  }

  // Check song name
  const lowerName = song.name.toLowerCase();
  for (const w of words) {
    if (lowerName.includes(w)) {
      return { label: 'Title', snippet: song.name };
    }
  }

  return null;
}
