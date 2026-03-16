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

  // Build one regex for all words, split text in a single pass
  const escaped = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  if (parts.length === 1) {
    return <Text style={{ color: textColor }}>{text}</Text>;
  }

  return (
    <Text>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <Text key={i} style={{ color: highlightColor, fontWeight: '700' }}>{part}</Text>
        ) : part ? (
          <Text key={i} style={{ color: textColor }}>{part}</Text>
        ) : null
      )}
    </Text>
  );
});
