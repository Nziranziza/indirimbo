import type { Song } from '@/constants/types';
import { getSongTitleLabel } from '@/constants/playlists';

const TARGET_MIN = 140;
const TARGET_MAX = 160;
const TRUNCATE_AT = 155;
// Minimum index a word/clause boundary must reach before we trim to it;
// below this we keep the full head slice rather than over-truncating.
const MIN_BOUNDARY_THRESHOLD = 80;

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
  const stem = lastBoundary > MIN_BOUNDARY_THRESHOLD ? head.slice(0, lastBoundary) : head;
  return `${stem.replace(/[,;:\s]+$/, '')}…`;
}

/**
 * Build an SEO description for a song that stays within Bing/Google's
 * 50–160 character window.
 *
 * When `playlistId` is provided (static page generator), the description
 * leads with the natural search phrase "Indirimbo ya {N} mu {book} — {name}"
 * before the lyrics, to target number+book queries (e.g. "262 gushimisha").
 * Called without it (runtime PageHead), it returns the lyrics-only form.
 */
export function buildSongSeoDescription(song: Song, playlistId?: string): string {
  let acc = '';
  for (const section of song.body) {
    const piece = flatten(section.content);
    if (!piece) continue;
    acc = acc ? `${acc} ${piece}` : piece;
    if (acc.length >= TARGET_MIN) break;
  }

  if (playlistId) {
    const lead = `${getSongTitleLabel(playlistId, song.number)} — ${song.name}.`;
    return truncateAtBoundary(acc ? `${lead} ${acc}` : lead);
  }

  if (!acc) {
    return `${song.name} — Indirimbo ya ${song.number}`;
  }
  return truncateAtBoundary(acc);
}
