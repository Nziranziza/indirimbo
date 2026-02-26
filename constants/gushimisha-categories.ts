// Song categories for "Gushimisha Imana" playlist
// Extracted from the printed category index

// Helper to generate a range of song numbers
function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export interface SongCategory {
  name: string;
  icon: string;
  songs: number[];
  notes?: string;
}

export const gushimishaCategories: SongCategory[] = [
  {
    name: "Guhimbaza",
    icon: "hands.clap.fill",
    songs: [...range(1, 28), ...range(328, 335), 92, 96, 97, 98, 111, 137, 165, 186, 355, 377, 416],
    notes: "reba no mu zo Guhamya",
  },
  {
    name: "Gusenga",
    icon: "figure.mind.and.body",
    songs: [...range(29, 50), ...range(336, 342), 75, 166, 174, 187, 262, 263, 434],
    notes: "reba no mu zo Kwitanga",
  },
  {
    name: "Guhamagara",
    icon: "megaphone.fill",
    songs: [...range(51, 81), ...range(343, 351), 86, 87, 159, 172, 378, 427, 432, 433],
  },
  {
    name: "Gucungurwa",
    icon: "lock.open.fill",
    songs: [...range(82, 92), ...range(352, 356), 25, 376, 379],
    notes: "reba no mu z'Umusaraba no mu z'Urukundo rw'Imana",
  },
  {
    name: "Guhamya",
    icon: "checkmark.seal",
    songs: [...range(93, 125), ...range(357, 364), 89, 90, 92, 134, 167, 216, 297, 417, 424, 430, 431, 436],
    notes: "reba no mu zo Guhimbaza",
  },
  {
    name: "Kwitaba Yesu",
    icon: "phone.arrow.down.left",
    songs: [...range(126, 132), 36, 38, 40, 367, 370, 428],
  },
  {
    name: "Kwitanga",
    icon: "arrow.up.heart",
    songs: [...range(133, 145), ...range(365, 373), 23, 27, 41, 42, 45, 88, 116, 146, 336, 338, 388],
  },
  {
    name: "Urukundo rw'Imana",
    icon: "heart.fill",
    songs: [...range(146, 165), ...range(374, 381), 16, 20, 26, 60, 99, 100, 226, 284, 403],
  },
  {
    name: "Ubugingo Bushya",
    icon: "leaf.fill",
    songs: [...range(166, 198), ...range(382, 389), 139, 264, 341, 342, 423, 425, 426, 435],
  },
  {
    name: "Intambara",
    icon: "shield.fill",
    songs: [...range(199, 210), ...range(390, 394)],
  },
  {
    name: "Inzira Ijya mw Ijuru",
    icon: "figure.walk",
    songs: [46, 181, 182, 183, 184, 185, 189, 190, 192, 207],
  },
  {
    name: "Ijuru",
    icon: "cloud.fill",
    songs: [...range(211, 222), ...range(395, 400), 7, 181, 271, 304, 393],
  },
  {
    name: "Kuvuka kwa Yesu",
    icon: "moon.stars.fill",
    songs: [...range(223, 239), ...range(401, 403), 164, 305, 419],
  },
  {
    name: "Kuba mw Isi k'Umwami Yesu",
    icon: "globe",
    songs: [163, 227, 305, 374, 375, 381],
  },
  {
    name: "Umusaraba",
    icon: "plus",
    songs: [...range(240, 251), 352, 356],
    notes: "reba no mu zo Gucungurwa no mu z'Urukundo",
  },
  {
    name: "Kuzuka kwa Yesu",
    icon: "sunrise.fill",
    songs: [...range(252, 259), 12],
  },
  {
    name: "Kuzamuka kwa Yesu",
    icon: "arrow.up",
    songs: [13, 120, 254],
    notes: "n'ukw ari mw ijuru kubwacu",
  },
  {
    name: "Guhamba",
    icon: "flame.fill",
    songs: [...range(260, 261), 218, 219, 222, 267, 393, 398],
  },
  {
    name: "Umwuka Wera",
    icon: "wind",
    songs: [...range(262, 265)],
  },
  {
    name: "Kugaruka kwa Yesu",
    icon: "clock.arrow.circlepath",
    songs: [...range(266, 272), ...range(404, 405), 43, 287, 385],
  },
  {
    name: "Izo mu Gitondo",
    icon: "sun.max",
    songs: [...range(273, 274)],
  },
  {
    name: "Iza n'Imugoroba",
    icon: "moon",
    songs: [...range(275, 279), 302],
  },
  {
    name: "Gushak' Abandi",
    icon: "person.2",
    songs: [...range(280, 288), ...range(406, 414), 429],
  },
  {
    name: "Igitabo cy'Imana",
    icon: "book",
    songs: [...range(289, 290)],
  },
  {
    name: "Abana",
    icon: "figure.2.and.child.holdinghands",
    songs: [...range(291, 305), ...range(415, 420), 112, 175, 206, 221, 223, 225, 227, 228, 236, 271, 389],
  },
  {
    name: "Icyumweru",
    icon: "calendar",
    songs: [...range(306, 309)],
  },
  {
    name: "Gusezeranaho",
    icon: "hand.wave",
    songs: [...range(310, 315)],
  },
  {
    name: "Amasarura",
    icon: "leaf",
    songs: [316],
  },
  {
    name: "Itorero",
    icon: "building.columns.fill",
    songs: [...range(317, 320), 29, 185, 198, 314, 327],
  },
  {
    name: "Ubukwe",
    icon: "link",
    songs: [...range(321, 323)],
  },
  {
    name: "Kubatizwa",
    icon: "drop.fill",
    songs: [...range(324, 325)],
  },
  {
    name: "Igaburo Ryera",
    icon: "cup.and.saucer.fill",
    songs: [...range(326, 327), 50, 267],
  },
  {
    name: "Uwa Mbere w'Umwaka",
    icon: "gift.fill",
    songs: [421, 77, 192, 193, 280],
  },
  {
    name: "Izindi Mpimbano",
    icon: "music.note.list",
    songs: [...range(422, 437)],
  },
];
