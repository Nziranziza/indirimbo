export interface LyricsPart {
  type: 'text' | 'repeat';
  content: string;
  repeatCount?: number;
}

/**
 * Parse lyrics content to extract repeat sections.
 *
 * Repeat notation: |: text to repeat :|x2
 *
 * Examples:
 * - Inline: "Haleluya |: haleluya :|x3 amen"
 * - Single line: "|: Tumushime tumushime :|x3"
 * - Multi-line: "|:\nLine 1\nLine 2\n:|x2"
 */
export function parseLyrics(content: string): LyricsPart[] {
  const parts: LyricsPart[] = [];
  const regex = /\|:\s*([\s\S]*?)\s*:\|\s*x(\d+)/g;

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

    // Add the repeat section
    parts.push({
      type: 'repeat',
      content: match[1].trim(),
      repeatCount: parseInt(match[2], 10),
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
