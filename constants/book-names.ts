export interface BookDefinition {
  readonly id: string;
  readonly name: string;
  readonly abbreviation: string;
}

export const BOOKS: readonly BookDefinition[] = [
  { id: 'alexanders-hymns', name: "Alexander's Hymns", abbreviation: 'AH.' },
  { id: 'billy-graham', name: 'Billy Graham Song Book', abbreviation: 'BG.' },
  {
    id: 'cantiques-ecoles-dimanche-france',
    name: 'Cantiques des écoles du dimanche de France',
    abbreviation: 'DF.',
  },
  {
    id: 'cantiques-kinyarwanda',
    name: 'Cantiques Kinyarwanda',
    abbreviation: 'CR.',
  },
  {
    id: 'cantiques-kirundi',
    name: 'Cantiques Kirundi',
    abbreviation: 'CK.',
  },
  {
    id: 'chants-ligue-bible',
    name: 'Chants de la Ligue pour la lecture de la Bible',
    abbreviation: 'CL.',
  },
  { id: 'chants-de-victoire', name: 'Chants de Victoire', abbreviation: 'V.' },
  { id: 'chorus-book', name: 'Chorus Book', abbreviation: 'CSSM.' },
  {
    id: 'christian-service-songs',
    name: 'Christian Service Songs',
    abbreviation: 'C.',
  },
  {
    id: 'enyimba-katonda',
    name: 'Enyimba eyokutendereza Katonda',
    abbreviation: 'U.',
  },
  { id: 'golden-bells', name: 'Golden Bells', abbreviation: 'G.B.' },
  { id: 'hymnal-companion', name: 'Hymnal Companion', abbreviation: 'H.' },
  {
    id: 'hymns-ancient-modern',
    name: 'Hymns Ancient and Modern (1924)',
    abbreviation: 'AM.',
  },
  {
    id: 'indirimbo-adventiste',
    name: "Indirimbo z'Itorero Adventiste",
    abbreviation: 'A.',
  },
  { id: 'keswick', name: 'Keswick Hymn Book', abbreviation: 'K.' },
  { id: 'louange-priere', name: 'Louange et Prière', abbreviation: 'L.' },
  { id: 'manuscript', name: 'Manuscript', abbreviation: 'M.S.' },
  { id: 'maran-ata', name: 'Maran Ata', abbreviation: 'M.A.' },
  { id: 'nyimbo-za-wokovu', name: 'Nyimbo za Wokovu', abbreviation: 'Ny.' },
  { id: 'oxford-carols', name: 'Oxford Book of Carols', abbreviation: 'OC.' },
  {
    id: 'recueil-protestantes-belges',
    name: 'Recueil de Cantiques (Eglises protestantes belges)',
    abbreviation: 'E.',
  },
  { id: 'redemption-hymns', name: 'Redemption Hymns', abbreviation: 'R.H.' },
  { id: 'redemption-songs', name: 'Redemption Songs', abbreviation: 'R.S.' },
  { id: 'reichs-liederbuch', name: 'Reichs-Liederbuch', abbreviation: 'R.' },
  {
    id: 'sacred-song-solos',
    name: 'Sacred Song and Solos',
    abbreviation: 'S.',
  },
  { id: 'segertoner', name: 'Segertoner', abbreviation: 'Sgt.' },
  { id: 'songs-of-praise', name: 'Songs of Praise', abbreviation: 'SP.' },
  {
    id: 'sur-les-ailes-de-la-foi',
    name: 'Sur les Ailes de la Foi',
    abbreviation: 'F.',
  },
  { id: 'tabernacle-hymns', name: 'Tabernacle Hymns', abbreviation: 'T.H.' },
];

// Abbreviation-to-name lookup for code expansion via prefix replacement.
//
// Order: more specific prefixes first, single-letter codes last. Otherwise
// `S.` would mangle `M.S.`, `H.` would mangle `R.H.`, etc.
//
// Trailing space in values: required when the source code has no space before
// the number (e.g. `V.17` → `Chants de Victoire 17`). Codes that already have
// a space in the data (e.g. `Sgt. 120`) use plain values.
export const BOOK_CODE_LOOKUP: Record<string, string> = {
  // Notation variants for Segertoner
  'S.Sgt.': 'Segertoner',
  'T.t. Sgt.': 'Segertoner',
  'Mel. Sgt.': 'Segertoner',

  // Multi-character abbreviations
  'Sgt.': 'Segertoner',
  'Ny.': 'Nyimbo za Wokovu',
  'M.A.': 'Maran Ata',
  'M.S.': 'Manuscript',
  'R.S.': 'Redemption Songs',
  'R.H.': 'Redemption Hymns',
  'G.B.': 'Golden Bells',
  'T.H.': 'Tabernacle Hymns',
  'AH.': "Alexander's Hymns ",
  'AM.': 'Hymns Ancient and Modern (1924) ',
  'BG.': 'Billy Graham Song Book ',
  'CK.': 'Cantiques Kirundi',
  'CL.': 'Chants de la Ligue pour la lecture de la Bible ',
  'CR.': 'Cantiques Kinyarwanda',
  'CSSM.': 'Chorus Book ',
  'DF.': 'Cantiques des écoles du dimanche de France ',
  'OC.': 'Oxford Book of Carols ',
  'SP.': 'Songs of Praise ',

  // Single-letter abbreviations (must come last — substrings of the above)
  'A.': "Indirimbo z'Itorero Adventiste ",
  'C.': 'Christian Service Songs ',
  'E.': 'Recueil de Cantiques (Eglises protestantes belges) ',
  'F.': 'Sur les Ailes de la Foi ',
  'H.': 'Hymnal Companion ',
  'K.': 'Keswick Hymn Book ',
  'L.': 'Louange et Prière ',
  'R.': 'Reichs-Liederbuch ',
  'S.': 'Sacred Song and Solos ',
  'U.': 'Enyimba eyokutendereza Katonda ',
  'V.': 'Chants de Victoire ',
};
