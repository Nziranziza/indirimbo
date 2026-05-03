export interface LyricsPart {
  type: 'text' | 'repeat';
  content: string;
  repeatCount?: number;
}

const DEFAULT_BOOK_REPEAT_COUNT = 2;

/**
 * Parse lyrics content to extract repeat sections.
 *
 * Two notations supported:
 * - Explicit count: |: text :|xN (e.g., |: Haleluya :|x3)
 * - Book convention: /: text :/ (always means repeat twice)
 */
export function parseLyrics(content: string): LyricsPart[] {
  const parts: LyricsPart[] = [];
  const regex = /\|:\s*([\s\S]*?)\s*:\|\s*x(\d+)|\/:\s*([\s\S]*?)\s*:\s?\//g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      const textBefore = content.slice(lastIndex, match.index);
      if (textBefore) {
        parts.push({ type: 'text', content: textBefore });
      }
    }

    const isExplicit = match[1] !== undefined;
    parts.push({
      type: 'repeat',
      content: (isExplicit ? match[1] : match[3]).trim(),
      repeatCount: isExplicit ? parseInt(match[2], 10) : DEFAULT_BOOK_REPEAT_COUNT,
    });

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text after last match
  if (lastIndex < content.length) {
    const remainingText = content.slice(lastIndex);
    if (remainingText) {
      parts.push({ type: 'text', content: remainingText });
    }
  }

  // If no matches found, return original content as single text part
  if (parts.length === 0) {
    parts.push({ type: 'text', content });
  }

  return parts;
}
