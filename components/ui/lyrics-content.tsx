import { ThemedText } from '@/components/themed-text';
import { parseLyrics, type LyricsPart } from '@/utils/parse-lyrics';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View } from 'react-native';

interface LyricsContentProps {
  content: string;
  style?: StyleProp<TextStyle>;
  tintColor: string;
}

// Calculate relative luminance of a color to determine if text should be light or dark
function getContrastTextColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');

  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // Calculate relative luminance (WCAG formula)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Return white for dark backgrounds, dark for light backgrounds
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// Check if a repeat is inline (part of a line) vs block (full line/lines)
function isInlineRepeat(parts: LyricsPart[], index: number): boolean {
  const part = parts[index];
  if (part.type !== 'repeat') return false;

  // If repeat content contains newlines, it's a block repeat (multi-line)
  if (part.content.includes('\n')) return false;

  // Single-line repeats are always treated as inline
  return true;
}

// Render inline content for a single line
function InlineContent({
  parts,
  style,
  tintColor
}: {
  parts: LyricsPart[];
  style?: StyleProp<TextStyle>;
  tintColor: string;
}) {
  // If this line has no repeat parts, render as a single ThemedText
  const hasRepeat = parts.some(p => p.type === 'repeat');
  if (!hasRepeat) {
    const text = parts.map(p => p.content).join('');
    return <ThemedText style={style}>{text}</ThemedText>;
  }

  // Line has a repeat badge - use flex row layout
  return (
    <View style={styles.inlineContainer}>
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <ThemedText key={index} style={style}>{part.content}</ThemedText>;
        }
        return (
          <View key={index} style={styles.inlineRepeatWrapper}>
            <LinearGradient
              colors={['transparent', tintColor + '20']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
            <ThemedText style={style}>{part.content}</ThemedText>
            <View style={[styles.inlineRepeatBadge, { backgroundColor: tintColor }]}>
              <Text style={[styles.inlineBadgeText, { color: getContrastTextColor(tintColor) }]}>
                ×{part.repeatCount}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export function LyricsContent({ content, style, tintColor }: LyricsContentProps) {
  const parts = parseLyrics(content);

  // If no repeat sections, render as plain text for performance
  const hasRepeats = parts.some(p => p.type === 'repeat');
  if (!hasRepeats) {
    return <ThemedText style={style}>{content}</ThemedText>;
  }

  // Check if ANY repeat is a block repeat (multi-line or standalone line)
  const hasBlockRepeat = parts.some((p, i) => p.type === 'repeat' && !isInlineRepeat(parts, i));

  if (hasBlockRepeat) {
    // Has block repeats - use original View-based rendering
    return (
      <View>
        {parts.map((part, index) => {
          if (part.type === 'repeat') {
            return (
              <View key={index} style={styles.repeatContainer}>
                <LinearGradient
                  colors={['transparent', tintColor + '20']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientBackground}
                />
                <ThemedText style={style}>{part.content}</ThemedText>
                <View style={[styles.badge, { backgroundColor: tintColor }]}>
                  <Text style={[styles.badgeText, { color: getContrastTextColor(tintColor) }]}>×{part.repeatCount}</Text>
                </View>
              </View>
            );
          }
          // Trim leading/trailing newlines but preserve internal structure
          const trimmedContent = part.content.replace(/^\n+|\n+$/g, '');
          if (!trimmedContent) return null;
          return <ThemedText key={index} style={style}>{trimmedContent}</ThemedText>;
        })}
      </View>
    );
  }

  // All repeats are inline - process line by line
  // Split content into lines, preserving which parts belong to which line
  const lines: LyricsPart[][] = [];
  let currentLine: LyricsPart[] = [];

  for (const part of parts) {
    if (part.type === 'text') {
      // Split text by newlines
      const textLines = part.content.split('\n');
      textLines.forEach((text, i) => {
        if (text) {
          currentLine.push({ type: 'text', content: text });
        }
        // If not the last segment, this newline ends the current line
        if (i < textLines.length - 1) {
          if (currentLine.length > 0) {
            lines.push(currentLine);
          }
          currentLine = [];
        }
      });
    } else {
      // Repeat part - add to current line
      currentLine.push(part);
    }
  }
  // Don't forget the last line
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return (
    <View>
      {lines.map((lineParts, lineIndex) => (
        <InlineContent key={lineIndex} parts={lineParts} style={style} tintColor={tintColor} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  repeatContainer: {
    marginRight: -20,
    paddingRight: 60,
    position: 'relative',
    justifyContent: 'center',
    overflow: 'visible',
    marginVertical: 0,
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  badge: {
    position: 'absolute',
    right: 24,
    top: '50%',
    transform: [{ translateY: '-50%' }],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  inlineContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginVertical: 0,
  },
  inlineRepeatWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopRightRadius: 9999,
    borderBottomRightRadius: 9999,
    overflow: 'hidden',
  },
  inlineRepeatBadge: {
    marginLeft: 4,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  inlineBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
