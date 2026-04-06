// Song categories for "Cantiques Kirundi" playlist
// Extracted from the PDF section headers

import type { SongCategory } from '@/constants/gushimisha-categories';

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export const cantiquesKirundiCategories: SongCategory[] = [
  { name: "Guhimbaza", slug: "ck-guhimbaza", icon: "hands.clap.fill", songs: range(1, 28) },
  { name: "Gusenga", slug: "ck-gusenga", icon: "figure.mind.and.body", songs: range(29, 50) },
  { name: "Guhamagara", slug: "ck-guhamagara", icon: "megaphone.fill", songs: range(51, 81) },
  { name: "Incungu", slug: "ck-incungu", icon: "lock.open.fill", songs: range(82, 92) },
  { name: "Gushinga Intahe", slug: "ck-gushinga-intahe", icon: "checkmark.seal", songs: range(93, 125) },
  { name: "Kwishikana", slug: "ck-kwishikana", icon: "person.2.fill", songs: range(126, 145) },
  { name: "Urukundo", slug: "ck-urukundo", icon: "heart.fill", songs: range(146, 165) },
  { name: "Ubugingo Bushasha", slug: "ck-ubugingo-bushasha", icon: "leaf.fill", songs: range(166, 198) },
  { name: "Iz'Intambara", slug: "ck-iz-intambara", icon: "shield.fill", songs: range(199, 222) },
  { name: "Kuvuka kwa Yesu", slug: "ck-kuvuka-kwa-yesu", icon: "moon.stars.fill", songs: range(223, 239) },
  { name: "Umusaraba", slug: "ck-umusaraba", icon: "plus", songs: range(240, 251) },
  { name: "Ukuzuka", slug: "ck-ukuzuka", icon: "sunrise.fill", songs: range(252, 258) },
  { name: "Mpwemu Yera", slug: "ck-mpwemu-yera", icon: "wind", songs: range(259, 264) },
  { name: "Kugaruka kwa Yesu", slug: "ck-kugaruka-kwa-yesu", icon: "clock.arrow.circlepath", songs: range(265, 272) },
  { name: "Iz'Igitondo", slug: "ck-iz-igitondo", icon: "sun.max", songs: range(273, 275) },
  { name: "Iz'Umugoroba", slug: "ck-iz-umugoroba", icon: "moon", songs: range(276, 279) },
  { name: "Kurondera Abandi", slug: "ck-kurondera-abandi", icon: "person.2", songs: range(280, 293) },
  { name: "Abana", slug: "ck-abana", icon: "figure.2.and.child.holdinghands", songs: range(294, 305) },
  { name: "Iziririmbwa Rimwe Rimwe", slug: "ck-iziririmbwa-rimwe-rimwe", icon: "music.note.list", songs: range(306, 309) },
  { name: "Ingaburo Yeara", slug: "ck-ingaburo-yeara", icon: "cup.and.saucer.fill", songs: range(310, 312) },
  { name: "Gusezerana", slug: "ck-gusezerana", icon: "hand.wave", songs: range(313, 315) },
  { name: "Kwimbura", slug: "ck-kwimbura", icon: "leaf", songs: [316] },
  { name: "Umubatiza", slug: "ck-umubatiza", icon: "drop.fill", songs: range(317, 319) },
  { name: "Guhezagira Abana", slug: "ck-guhezagira-abana", icon: "sparkles", songs: [320] },
  { name: "Ubukwe", slug: "ck-ubukwe", icon: "link", songs: range(321, 322) },
  { name: "Guhamba", slug: "ck-guhamba", icon: "flame.fill", songs: [323] },
  { name: "Iziririmbwa n'Abahinga", slug: "ck-iziririmbwa-n-abahinga", icon: "music.quarternote.3", songs: range(324, 333) },
  { name: "Izongewe", slug: "ck-izongewe", icon: "plus.circle", songs: range(334, 354) },
];
