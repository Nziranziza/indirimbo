import type { Song } from '@/constants/types';
import { parseLyrics } from '@/utils/parse-lyrics';

interface FormatSectionArgs {
  readonly song: Song;
  readonly sectionIndex: number;
}

function expandLyrics(content: string): string {
  return parseLyrics(content)
    .map((part) => {
      if (part.type === 'repeat') {
        const count = part.repeatCount ?? 2;
        return Array(count).fill(part.content).join('\n');
      }
      return part.content;
    })
    .join('')
    .trim();
}

export function formatSectionForSharing({ song, sectionIndex }: FormatSectionArgs): string {
  const section = song.body?.[sectionIndex];
  if (!section) return '';

  const sections = song.body.filter((s) => s.type === 'verse' || s.type === 'chorus');
  const showVerseLabel = sections.length > 1;

  let header = '';
  if (section.type === 'chorus') {
    header = 'Chorus';
  } else if (showVerseLabel && section.number) {
    header = `Verse ${section.number}`;
  }

  const lyrics = expandLyrics(section.content);

  return header ? `${header}\n\n${lyrics}` : lyrics;
}
