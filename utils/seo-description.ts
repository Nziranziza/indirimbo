import type { Song } from '@/constants/types';

const TARGET_MIN = 70;
const TARGET_MAX = 160;
const TRUNCATE_AT = 155;

function flatten(content: string): string {
  return content.replace(/\s*\n\s*/g, ' ').trim();
}

function truncateAtBoundary(text: string): string {
  if (text.length <= TARGET_MAX) return text;
  const head = text.slice(0, TRUNCATE_AT);
  const lastBoundary = Math.max(
    head.lastIndexOf(' '),
    head.lastIndexOf(','),
    head.lastIndexOf(';'),
  );
  const stem = lastBoundary > 80 ? head.slice(0, lastBoundary) : head;
  return `${stem.replace(/[,;:\s]+$/, '')}…`;
}

/**
 * Build an SEO description for a song that stays within Bing/Google's
 * 50–160 character window. Identical implementation used by the static
 * page generator and the runtime PageHead so react-helmet-async can
 * dedupe the tags via isEqualNode at hydration.
 */
export function buildSongSeoDescription(song: Song): string {
  let acc = '';
  for (const section of song.body) {
    const piece = flatten(section.content);
    if (!piece) continue;
    acc = acc ? `${acc} ${piece}` : piece;
    if (acc.length >= TARGET_MIN) break;
  }
  if (!acc) {
    return `${song.name} — Indirimbo ya ${song.number}`;
  }
  return truncateAtBoundary(acc);
}
