import { findSong } from "@/constants/song-collections";
import { matchBookAbbreviation, normalizeBookCodes } from "@/utils/book-codes";

// Book abbreviations whose songs are also hosted inside this app, mapped to the
// playlist that holds them. A reference code with one of these abbreviations can
// be turned into an in-app link — but only when the target song actually exists
// (see resolveReferenceLink), so a code pointing at a number we don't have stays
// plain text. Add a line here to make another book's references tappable.
//
// Note: "A." ("Indirimbo z'Itorero Adventiste") IS the in-app SDAH Kinyarwanda
// collection — its references use that collection's own 1–500 numbering, so they
// link directly. "SDAH." is deliberately absent: those codes point at the
// *English* "Seventh-day Adventist Hymnal (1985)" using English hymnal numbers,
// which this app does not host, so there is no valid target to link to.
export const IN_APP_REFERENCE_BOOKS: Record<string, string> = {
  "CK.": "cantiques-kirundi",
  "A.": "sdah-kinyarwanda",
  // "CR." ("Cantiques Kinyarwanda") is the Gushimisha collection — the direct
  // link back from a Cantiques Kirundi song to its Kinyarwanda counterpart.
  "CR.": "gushimisha",
};

export interface ReferenceLink {
  readonly playlist: string;
  readonly songNumber: string;
}

// Turn a raw reference code (e.g. "CK.345") into an in-app link when its book is
// hosted here AND the referenced song exists; otherwise null. Only a bare song
// number links — codes with sub-references like "G.B. 599(1)" are not linked.
export function resolveReferenceLink(codes: string | undefined): ReferenceLink | null {
  if (!codes) return null;
  const normalized = normalizeBookCodes(codes);
  const abbreviation = matchBookAbbreviation(normalized);
  if (!abbreviation) return null;

  const playlist = IN_APP_REFERENCE_BOOKS[abbreviation];
  if (!playlist) return null;

  const songNumber = normalized.slice(abbreviation.length).trim();
  // Only a bare number is a valid target — reject locators with sub-references
  // (e.g. "599(1)") or letters rather than silently linking their base number.
  if (!/^\d+$/.test(songNumber)) return null;
  if (!findSong(playlist, songNumber)) return null;

  return { playlist, songNumber };
}
