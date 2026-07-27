import { BOOK_CODE_LOOKUP } from "@/constants/book-names";

// Tidy the spacing/period style of a raw reference code so abbreviation matching
// is consistent, e.g. "G. B" → "G.B", "T.H" → "T.H." (but not "S.Sgt.").
export function normalizeBookCodes(codes: string): string {
  return codes
    .replace(/([A-Z])\.\s+([A-Z])/g, "$1.$2") // "G. B" → "G.B"
    .replace(/([A-Z])\.([A-Z])(?![A-Za-z.])/g, "$1.$2."); // "T.H" → "T.H.", "M.S" → "M.S."
}

// Match the longest book abbreviation the code begins with, anchored at the
// front, so distinct codes like "AH" and "SDAH" are never confused. Returns the
// abbreviation key (including trailing period) or "" when nothing matches.
export function matchBookAbbreviation(normalizedCodes: string): string {
  let key = "";
  for (const abbreviation of Object.keys(BOOK_CODE_LOOKUP)) {
    if (normalizedCodes.startsWith(abbreviation) && abbreviation.length > key.length) {
      key = abbreviation;
    }
  }
  return key;
}

// Expand an abbreviation into the full book name plus locator, e.g.
// "SDAH. 368" → "The Seventh-day Adventist Hymnal (1985) 368".
export function expandBookCodes(codes: string): string {
  const normalized = normalizeBookCodes(codes);
  const key = matchBookAbbreviation(normalized);
  if (!key) return normalized;
  const locator = normalized.slice(key.length).trimStart();
  const full = BOOK_CODE_LOOKUP[key].trimEnd();
  return locator ? `${full} ${locator}` : full;
}
