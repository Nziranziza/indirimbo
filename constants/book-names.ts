export interface BookDefinition {
  readonly abbreviation: string;
  readonly name: string;
}

export const AGAKIZA_BOOKS: readonly BookDefinition[] = [
  { abbreviation: 'Sgt.', name: 'Segertoner' },
  { abbreviation: 'Ny.', name: 'Nyimbo za Wokovu' },
  { abbreviation: 'M.A.', name: 'Maran Ata' },
  { abbreviation: 'R.S.', name: 'Redemption Songs' },
  { abbreviation: 'R.H.', name: 'Redemption Hymns' },
  { abbreviation: 'G.B.', name: 'Golden Bells' },
  { abbreviation: 'T.H.', name: 'Tabernacle Hymns' },
  { abbreviation: 'M.S.', name: 'Manuscript' },
];

export const GUSHIMISHA_BOOKS: readonly BookDefinition[] = [
  { abbreviation: 'V.', name: 'Chants de Victoire' },
  { abbreviation: 'F.', name: 'Sur les Ailes de la Foi' },
  { abbreviation: 'L.', name: 'Louange et Prière' },
  { abbreviation: 'E.', name: 'Recueil de Cantiques (Eglises protestantes belges)' },
  { abbreviation: 'A.', name: "Indirimbo z'Itorero Adventiste" },
  { abbreviation: 'U.', name: 'Enyimba eyokutendereza Katonda' },
  { abbreviation: 'G.', name: 'Golden Bells' },
  { abbreviation: 'T.', name: 'Tabernacle Hymns' },
  { abbreviation: 'C.', name: 'Christian Service Songs' },
  { abbreviation: 'K.', name: 'Keswick Hymn Book' },
  { abbreviation: 'S.', name: 'Sacred Song and Solos' },
  { abbreviation: 'H.', name: 'Hymnal Companion' },
  { abbreviation: 'R.', name: 'Reichs-Liederbuch' },
  { abbreviation: 'CSSM', name: 'Chorus Book' },
  { abbreviation: 'CL.', name: 'Chants de la Ligue pour la lecture de la Bible' },
  { abbreviation: 'DF.', name: 'Cantiques des écoles du dimanche de France' },
  { abbreviation: 'RS.', name: 'Redemption Songs' },
  { abbreviation: 'AH.', name: "Alexander's Hymns" },
  { abbreviation: 'BG.', name: 'Billy Graham Song Book' },
  { abbreviation: 'AM.', name: 'Hymns Ancient and Modern (1924)' },
  { abbreviation: 'SP.', name: 'Songs of Praise' },
  { abbreviation: 'OC.', name: 'Oxford Book of Carols' },
  { abbreviation: 'SG.', name: 'Segerioner' },
];

export const PLAYLIST_BOOKS: Record<string, readonly BookDefinition[]> = {
  agakiza: AGAKIZA_BOOKS,
  gushimisha: GUSHIMISHA_BOOKS,
  'cantiques-kirundi': AGAKIZA_BOOKS,
};

// Abbreviation-to-name lookup for code expansion
// Order matters: longer/more specific prefixes must come first to avoid partial matches
// Gushimisha codes use trailing space because their format has no space before numbers (e.g. "U.95")
export const BOOK_CODE_LOOKUP: Record<string, string> = {
  // Agakiza references (including notation variants)
  'S.Sgt.': 'Segertoner',
  'T.t. Sgt.': 'Segertoner',
  'Mel. Sgt.': 'Segertoner',
  'Sgt.': 'Segertoner',
  'Ny.': 'Nyimbo za Wokovu',
  'M.A.': 'Maran Ata',
  'R.S.': 'Redemption Songs',
  'R.H.': 'Redemption Hymns',
  'G.B.': 'Golden Bells',
  'T.H.': 'Tabernacle Hymns',
  'M.S.': 'Manuscript',
  // Gushimisha references (longer prefixes first)
  'CSSM ': 'Chorus Book ',
  'CL.': 'Chants de la Ligue pour la lecture de la Bible ',
  'DF.': 'Cantiques des écoles du dimanche de France ',
  'RS.': 'Redemption Songs ',
  'AH.': "Alexander's Hymns ",
  'BG.': 'Billy Graham Song Book ',
  'AM.': 'Hymns Ancient and Modern (1924) ',
  'SP.': 'Songs of Praise ',
  'OC.': 'Oxford Book of Carols ',
  'SG.': 'Segerioner ',
  'V.': 'Chants de Victoire ',
  'F.': 'Sur les Ailes de la Foi ',
  'L.': 'Louange et Prière ',
  'E.': 'Recueil de Cantiques (Eglises protestantes belges) ',
  'A.': "Indirimbo z'Itorero Adventiste ",
  'U.': 'Enyimba eyokutendereza Katonda ',
  'G.': 'Golden Bells ',
  'T.': 'Tabernacle Hymns ',
  'C.': 'Christian Service Songs ',
  'K.': 'Keswick Hymn Book ',
  'S.': 'Sacred Song and Solos ',
  'H.': 'Hymnal Companion ',
  'R.': 'Reichs-Liederbuch ',
};
