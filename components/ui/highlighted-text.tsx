import React from 'react';
import { Text } from 'react-native';

interface HighlightedTextProps {
  readonly text: string;
  readonly query: string;
  readonly highlightColor: string;
  readonly textColor: string;
}

/** Render text with highlighted matches — single regex pass (fast) */
export const HighlightedText = React.memo(function HighlightedText({
  text,
  query,
  highlightColor,
  textColor,
}: HighlightedTextProps) {
  if (!query.trim()) {
    return <Text style={{ color: textColor }}>{text}</Text>;
  }

  const words = query.toLowerCase().split(/\s+/).filter(w => w.length >= 2 || /^\d+$/.test(w));
  if (words.length === 0) {
    return <Text style={{ color: textColor }}>{text}</Text>;
  }

  // For each query word, find all substrings (min length 2) that appear in the text
  const lowerText = text.toLowerCase();
  const patterns = new Set<string>();
  for (const word of words) {
    const minLen = /^\d+$/.test(word) ? 1 : 2;
    for (let len = word.length; len >= minLen; len--) {
      for (let start = 0; start <= word.length - len; start++) {
        const sub = word.slice(start, start + len);
        if (lowerText.includes(sub)) {
          patterns.add(sub.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        }
      }
    }
  }

  if (patterns.size === 0) {
    return <Text style={{ color: textColor }}>{text}</Text>;
  }

  // Sort longest first so full matches take priority over partial
  const sorted = [...patterns].sort((a, b) => b.length - a.length);
  const regex = new RegExp(sorted.join('|'), 'gi');

  // Build segments from matches
  const segments: { text: string; highlight: boolean }[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(regex)) {
    const start = match.index;
    if (start > lastIndex) {
      segments.push({ text: text.slice(lastIndex, start), highlight: false });
    }
    segments.push({ text: match[0], highlight: true });
    lastIndex = start + match[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), highlight: false });
  }

  if (segments.length <= 1 && !segments[0]?.highlight) {
    return <Text style={{ color: textColor }}>{text}</Text>;
  }

  return (
    <Text>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <Text key={i} style={{ color: highlightColor, fontWeight: '700' }}>{seg.text}</Text>
        ) : (
          <Text key={i} style={{ color: textColor }}>{seg.text}</Text>
        )
      )}
    </Text>
  );
});
