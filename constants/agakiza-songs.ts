export interface NewSong {
  number: number | string;
  name: string;
  url: string;
  references?: { title?: string; codes?: string }[];
  body: { type: "verse" | "chorus"; number?: number; content: string }[];
}

export const songs: NewSong[] = [
  {
    number: 1,
    name: "Urukundo ruhebuje, gend’ urwogeze hose",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Underbar kärlek så stor...","codes":"Sgt. 120"},{"codes":"Ny. 115"},{"title":"Wonderful story of love..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Urukundo ruhebuje, gend’ urwogeze hose.\nUrukundo ruhebuje, n’ indirimbo ya mbere.\nYaririmbwe na marayika, yumvikana mu bashumba.\nTwishimiye kumenya ko haj’ urukundo rw’ Imana.",
      },
      {
        type: "chorus",
        content: "Urukundo! Urukundo! Urukundo!\nNgurw’ urukundo rw’ Imana.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Urukundo ruhebuje, rushak’ uwazimiye\nUrukundo ruhebuje rurakubabarira.\nJya kuri ya soko nziza, ituruk’ i Gologota.\nUzaboner’ ubugingo mu rukundo ruhebuje.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Urukundo ruhebuje, rutugeza mw ijuru.\nUrukundo ruhebuje, tuzanezerwa cyane.\nMw ijuru nta ndwar’ ibayo, nta rupfu ruzagerayo,\nTwakijijwe n’ urukundo rwinshi rw’ Iman’ ihoraho.",
      },
    ],
  },
  {
    number: 2,
    name: "Nari naramenyerey’ ibyaha",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Många år jag gick på syndens stig...","codes":"Sgt. 139"},{"title":"Years I spent...","codes":"R.S. 773"},{"codes":"M.A. 180"},{"codes":"Ny. 41"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Nari naramenyerey’ ibyaha.\nSinari nz’ ijambo ry’ Umukiza.\nSinari nz’ inkoni yakubiswe\nKubera jyewe.",
      },
      {
        type: "chorus",
        content:
          "Yes’ Umwami yarambabariye.\nYankuyehw ibyaha byanjye byose.\nNon’ ubu ndamushimira cyane\nUmusaraba.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ubwo numvag’ ijambo rye ryiza,\nNararize mu mutima wanjye.\nMperako meny’ imibabaro ye,\nYatewe nanjye.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Yes’ Umwami n’ Umukiza wanjye,\nNi we zuba ndetse n’ ubugingo.\nNdushaho kujya muhimbariza\nWa musaraba.",
      },
    ],
  },
  {
    number: 3,
    name: "Nari narazimiriye kure, nibagiwe Yesu",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Jag var borta ifrån Herren...","codes":"Sgt. 2"},{"codes":"Ny. 38"},{"codes":"M.A. 265"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Nari narazimiriye kure, nibagiwe Yesu,\nNyuma Yes’ ambwiz’ ijwi rye, rinzanir’ umunezero.",
      },
      {
        type: "chorus",
        content:
          "Non’ ubu ndanezerewe, Kuko Yesu yantaruye.\nAherakw anyoz’ ibyaha. Niyemeje kumukunda.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Sinajyaga niyibutsa ko nzajy’ imbere y’ Imana.\nUbw’ izaducir’ imanza, zihwanye n’ ibyo twakoze.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Nari narushye mu byaha, nza kugarukira Yesu.\nNukw ambwir’ ijambo ryiza, mperako mbon’ amahoro.",
      },
    ],
  },
  {
    number: 4,
    name: "Niboney’ urukundo rw’ Umukiza",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Nimeliona pendo la Mwokozi..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Niboney’ urukundo rw’ Umukiza.\nUrwo rukundo ni rwo runezeza.\nAfit’ izina ryiz’ uwo wankunze.\nN’ Imana Data n’ Umwana we Yesu.\n/: Nashimishijwe n’ urukundo rwawe,\nYewe Mana nawe Yesu Kristo. :/",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Jye nd’ imbere yawe nd’ umwana muto.\nIcyo nkwiriye n’ ugufashwa rwose.\nMu bintu byose mu kubaho kwanjye.\nMu gihe ngeragezwa mur’ iyi si.\n/: Nkomeza Mwami singende jyenyine\nUmbe hafi mu rugendo rwanjye. :/",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Iyo ngusabye Yesu kujy’ iwanjye,\nUbwo mba nshaka ko wamar’ ubwoba.\nJye munyabyaha umfat’ unkomeze,\nKuko nshidikanya sinkor’ ibyiza.\n/: Singikor’ ibyajyaga binezeza.\nUbu nkora ibyo ntikoresha. :/",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Niboney’ urukundo rw’ Umukiza,\nAri we wanshunguj’ amaraso ye.\nAyo maraso s’ ayo mu bitungwa,\nN’ amaraso y’ Umwami Yesu Kristo.\n/: Yar’ ukiranuka mu b’ isi bose,\nAgezahw atang’ ubugingo bwe. :/",
      },
    ],
  },
  {
    number: 5,
    name: "Sinzibagirw’ igihe nakizwaga",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Aldrig den härliga dag jag kan glömma..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Sinzibagirw’ igihe nakizwaga,\nUbwo Yesu yinjiraga muri jye.\nNone mu mutima wanjye huzuye\nIshimwe nshimir’ Umukiza wanjye.",
      },
      {
        type: "chorus",
        content:
          "N’ igitangaza, n’ igitangaza,\nKuko nahaw’ agakiza ku buntu.\nN’ igitangaza, n’ igitangaza,\nJye mu nyabyaha nahaw’ agakiza.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Mu magana menshi y’ abanyabyaha,\nYantoranijemo ngo mb’ inshuti ye.\nNarabohowe ndamuririmbira,\nZaburi nyinshi mu mutima wanjye.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Koko yamfiriye ku musaraba,\nNg’ umutima n’ umubiri bikizwe.\nN’ urukundo n’ ubuntu butangaje,\nByatumye yitangir’ umunyabyaha.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Namanukiwe n’ Umwuka w’ Imana,\nAnyuzuzamw urukundo rukwiye.\nNuzuy’ impundu mu mutima wanjye,\nAbatirish’ imbaraga z’ ijuru.",
      },
    ],
  },
  {
    number: 6,
    name: "Mu gihe cya Noheli, Turebye mu muvure",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Når juldagsmorgon...","codes":"Sgt. 307"},{"codes":"Ny. 105"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Mu gihe cya Noheli, Turebye mu muvure,\n/: Dusanga Yes’ aryamye mu buryo bwa gikene. :/",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Mukiza wanjye mwiza, wazanywe n’ urukundo.\n/: Wambabariy’ ibyaha, wangize kub’ uwawe. :/",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Yesu ni wowe nshaka, ur’ inshuti y’ abana.\n/: Mukiza sinzongera gutegekwa n’ ibyaha. :/",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Nzahora nshima Yesu mu bihe byanjye byose.\n/: Yazanywe mur’ iyi si, kuducungura twese. :/",
      },
    ],
  },
  {
    number: 7,
    name: "Nimuze mwese turirimbe",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Var hälsad, sköna...","codes":"Sgt. 104"},{"codes":"Ny. 106"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Nimuze mwese turirimbe,\nKubw’ uyu munsi wahanuwe\nN’ abahanuzi kera.\nN’ umunsi mwiza ukomeye,\nNi h’ urukundo rukomeye\nRwaturutse ku Mana.\nMuze mwese tunezerwe\nTuririmbe dushimira\nYesu waje kudukiza.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Yes’ afit’ ishusho y’ Imana,\nAriko yihinduy’ umuntu\nNgo twese tumumenye.\nYatuzaniye amahoro,\nYaje gushak’ abazimiye.\nYazanywe no gukiza.\nMuze mwese dufatanye\nN’ Umukiza, kand’ aduhe\nUrukundo n’ ubugingo.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Azameny’ uko tubabara,\nAzameny’ amagorwa yacu,\nAzadufasha rwose.\nAzatwigish’ Imana Data,\nAzatumenyesh’ urukundo\nMu rupf’ azadupfira.\nMuze mwese adukize,\nAtuzure mu mitima\nAtwugururir’ ijuru.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Ni we zuba ryacu ry’ ukuri,\nRyatuzaniy’ agakiza,\nRiratuvira twese.\nN’ Umwungeri Mwiz’ uturinda,\nAshaka ko twamugumaho,\nTukamukurikira.\nMuze mwese uko mwaje,\nTumusange, tumurebe.\nMuze mwese tumwigane.",
      },
    ],
  },
  {
    number: 8,
    name: "Umucyo wabonekeye bose bari mu mwijima",
    url: "https://indirimbo.rw/song/agakiza/1",
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Umucyo wabonekeye bose bari mu mwijima.\nUbw’ abungeri bumvaga indirimb’ iva mw ijuru.",
      },
      {
        type: "chorus",
        content:
          "Icyubahiro mw ijuru, Kib' icy' Iman' Ihoraho.\nNahw amahor’ abe mw isi. Tuyishime duhimbaza.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Mu murwa wa Betlehemu, none havuts’ uruhinja.\nN’ umunezer’ i Yudaya, kukw Iman’ ibacunguye.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Mariya yambits’ Umwana utwambaro tw’ uruhinja.\nKandi mu muvure w’ inka ni ho yamuryamishije.",
      },
    ],
  },
  {
    number: 9,
    name: "Mfit’ Umukiza mwiza cyane",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Vilken underbar Frälsare...","codes":"Sgt. 397"},{"codes":"Ny. 118"},{"title":"What a wonderful...","codes":"R.H. 164"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Mfit’ Umukiza mwiza cyane,\nKuko yazanywe no kunkiza.\nYatanz’ ubugingo bwe bwose,\nNgw apfir’ abari mw isi bose.",
      },
      {
        type: "chorus",
        content:
          "Yabambiwe ku musaraba,\nYabambiwe ku musaraba.\nYabambiwe kubw’ ibyaha nakoze,\nYabambiwe ku musaraba.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Yasiz’ ubwiza bwe mw ijuru,\nAza mur’ iyi si turimo.\nYababajwe kubera jyewe,\nKand’ anyugururir’ ijuru.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Yateranij’ ibyaha byanjye,\nNdetse n’ imibabaro yanjye.\nByose ni ko ya byikoreye,\nNgw ankize kand’ amp’ amahoro.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Yesu yasubiye mw ijuru,\nKuko yar’ aneshej’ urupfu.\nArikw azagaruka vuba,\nGutwar’ abamwizeye bose.",
      },
    ],
  },
  {
    number: 10,
    name: "Yesu wonger’ unyigishe iby’ umusaraba",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Jesus, hall mig vid ditt...","codes":"Sgt. 378"},{"codes":"Ny. 109"},{"title":"Jesus, keep me near the cross...","codes":"R.S. 390"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Yesu wonger’ unyigishe iby’ umusaraba.\nNi wo soko nziza cyane, ni yo yoz’ ibyaha.",
      },
      {
        type: "chorus",
        content:
          "Umusaraba wa Yesu, Ni wo nsingiz’ ubu.\nYes’ undindire muri wo Mbone kukumenya.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ni ho naboney’ ubuntu bwawe butangaje.\nNo mur’ uwo musaraba, havuyemw umucyo.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ndindira muri wo, Yesu kand’ unamenyeshe.\nUko wanyikorerey’ ibyaha byanje byose.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Munsi y’ uwo musaraba handindir’ iteka.\nNgukunde kuv’ uyu munsi ngez’ iteka ryose.",
      },
    ],
  },
  {
    number: 11,
    name: "Ku musarab’ Umukiza wanjye",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"På Golgata min Jesus tog...","codes":"Sgt. 410"},{"codes":"Ny. 113"},{"title":"On Calvary's brown...","codes":"R.S. 153"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Ku musarab’ Umukiza wanjye,\nNi ho yanyitangiriye kera.\nAmaraso ye yaramviriye,\nKugira ngo mb’ ubohowe na yo.",
      },
      {
        type: "chorus",
        content:
          "I Gologota, i Gologota,\nYesu niho yababarijwe.\nI Gologota, i Gologota,\nNi ho naherew’ amahoro.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Mu gihe Yesu yadupfiraga,\nAremerewe n’ ibyaha byacu.\nHabayeh’ umushyits’ icyo gihe.\nHabayeho n’ ubwira-kabiri.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Na rwa rusika rwasadutsemo,\nIjambo rye riragaragara.\nNoneho mbony’ inzira y’ ijuru;\nN’ ukwezwa n’ amaraso ya Yesu.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Yesu, ntangajwe n’ urwo urukundo,\nRwatumy’ utang’ ubugingo bwawe.\nWarababaye kubera jyewe,\nUmubabaro w’ umusaraba.",
      },
    ],
  },
  {
    number: 12,
    name: "Waratubambiwe Mukiza ku giti",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Min blodige Konung...","codes":"Sgt. 103"},{"codes":"Ny. 229"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Waratubambiwe Mukiza ku giti:\nNi wowe Pasika yac’ idukwiriye\nWarababajw’ ubwo wavag’ amaraso,\nWashakaga gukor’ iby’ Iman’ ishaka\nKandi wababariye n’ i Getsemane,\nArik’ uhozwa n’ ijambo ry’ Ihoraho\nMu gusenga kwawe wahaw’ imbaraga\nHanyuma urapf’ uduhesh’ agakiza",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Mwami warakomerekejwe kubwanjye.\nWapfuye kugira ngo mbon’ ubugingo.\nWariyibagiw’ ub’ ari jye wibuka,\nNdetse wasengey’ abakwish’ urwo rupfu,\nWatuberey’ igitambo gikwiriye,\nUbwo wemeraga kutubabarizwa.\nWemeye gupfir’ abantu bose mw isi.\nKandi byose ni kubw’ urukundo rwawe.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Noneho kumvikana n’ Imana n’ iki?\nN’ ukubabarirw’ umuvumo w’ ibyaha.\nKweger’ Imana byo bitwungur’ iki se?\nBiduha guhinduk’inshuti z’ Imana.\nNoneho tebuk’ uve mu byaha byawe.\nUbigaragarize byose mu mucyo.\nUmukiza mwiz’ arakubabarira,\nArakubohora kand’ aragufasha.",
      },
    ],
  },
  {
    number: 13,
    name: "Mwana w’ Imana, Yesu, wadupfiriye twese",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Guds rena Lamm oskyldigt...","codes":"Sgt. 24"},{"codes":"Ny. 108"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Mwana w’ Imana, Yesu, wadupfiriye twese,\nKuri wa musaraba, bagushinyagurira.\nWadukuyehw ibyaha, kand’ utsinda n’ urupfu,\nDuh’ amahoro, Yesu.",
      },
    ],
  },
  {
    number: 14,
    name: "Isezerano ry’ Umwami Mana",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Guds ord och löften...","codes":"Sgt. 345"},{"codes":"Ny. 160"},{"codes":"M.A. 668"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Isezerano ry’ Umwami Mana\nNtirihinduka habe na gato.\nNahw imisozi yose yavaho,\nRyo ntirivaho na gato.",
      },
      {
        type: "chorus",
        content:
          "Isezerano ry’ Imana yacu,\nNtirihinduka habe na gato.\nNahw inyenyeri zo zakwijima,\nIsezerano rihoraho.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Isezerano rye rihoraho,\nHaba mu byago no mu mwijima,\nNaho nananirwa mu ntambara,\nRyo ntirivaho na gato.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Isezerano rye rihoraho,\nHaba mu ndwara, haba mu rupfu.\nImana Data ihor’ impoza,\nKubw’ isezerano, ryayo.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Isezerano ryayo ribaho,\nIzankangura kuva mu rupfu.\nKwa Data ni ho nzambikw’ ikamba,\nBitewe n’ isezerano.",
      },
    ],
  },
  {
    number: 15,
    name: "Amasezerano yose ukw’ Iman’ iyatanga",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Löftena kunna ej svika...","codes":"Sgt. 70"},{"codes":"Ny. 163"},{"codes":"M.A. 14"},{"title":"Firm are the promises standing..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Amasezerano yose ukw’ Iman’ iyatanga,\nYakomejwe n’ amaraso y’ Umwami wacu Yesu.",
      },
      {
        type: "chorus",
        content:
          "Isi nib’ izavaho, Ijuru rikavaho.\nUwizer’ azabona Ayo masezerano.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Jy’ ukora nka Aburahamu, wubur’ amaso yawe.\nBar’ inyenyeri wizere amasezerano ye.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Mu mwijima wo mu nzira, twizer’ Imana yacu.\nHasigay’ umwanya muto, izuba rikarasa.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Nubwo turushywa n’ abantu, twizer’ Imana yacu.\nYesu ni w’ uzadufasha mu bitugerageza.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Mu gihe tubuz’ inshuti, tuguman’ ukwizera.\nYesu niwe nshuti nziza izahorana natwe.",
      },
      {
        type: "verse",
        number: 6,
        content:
          "No ku byo tubona mw’ isi, tuguman’ ukwizera.\nMw’ ijuru tuzahabona ibyo twizeye byose.",
      },
    ],
  },
  {
    number: 16,
    name: "Za mbaraga zamanukiye abigishwa ba Yesu mu murwa Yerusalemu",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Den kraft, som föll på...","codes":"Sgt. 62"},{"codes":"Ny. 148"},{"title":"The pow'r that fell...","codes":"R.H. 219"},{"codes":"M.A. 202"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Za mbaraga zamanukiye abigishwa ba Yesu mu murwa Yerusalemu;\nIyo ni Pentekote.\nIzo mbaraga z’ Umukiza, Ziriho n’ ubu!\nMushim’ Imana.",
      },
      {
        type: "chorus",
        content:
          "Impano, impano, izo mpano z’ Imana,\nNa non’ ubu ziriho, na non’ ubu ziriho.\nImpano impano, izo mpano z’ Imana,\nNa non’ ubu ziriho.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Yesu yabasezeranije kuzahabw’ imbaraga.\nBashimy’ Imana, kuk’ Umwuka yabamanukiye.\nAbari bafit’ intege nke,\nBigishije n’ imbaraga nyinshi.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Uwo Mwuka iy’ atujemo, atwuzuz’ imbaraga.\nDuhabwa kwizera gushyitse, tukanesh’ umubi.\nTugir’ umuriro w’ Imana,\nTuzan’ abandi k’ Umucunguzi",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Yes’ ujye mu mitima yacu, ucane mw umuriro.\nIminsi yose tugumane kwera mu mitima.\nMwuka Wera, ngwino nka mbere,\nKuri wa munsi wa Pentekote.",
      },
    ],
  },
  {
    number: 17,
    name: "Umuriro wawe Mukiza",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"O Gud, du klara, rena låga...","codes":"Sgt. 336"},{"codes":"Ny. 151"},{"title":"Thou Christ of burning...","codes":"R.H. 252"},{"codes":"M.A. 661"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Umuriro wawe Mukiza,\nTwese turashak’ uwo muriro wawe.\nDor’ uko tugusaba: Mana,\nCan’ uwo muriro mu mitima yacu,\nTwes’ ubu tur’ imbere yawe,\nUduh’ Umwuka wawe Mana,\nDuhabwe Pentekote yacu\nTwes’ ubu dutegerej’ uwo muriro.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Mana, twiteho kand’ utwumve,\nTwese turasab’ uwo muriro wawe.\nTurakwinginga dukomeje,\nCan’ uwo muriro mu mitima yacu.\nDukwiriy’ imbaraga zawe\nMu bitugerageza byose.\nNi zo’ zizaduha kunesha,\nTwes’ ubu dutegerej’ uwo muriro.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Dor’ imitima yos’ ikonje,\nIrashaka ko wayih’uwo muriro.\nIbyo dukennye mu mitima,\nByakizwa n’ uko waduh’ uwo muriro.\nJy’ ubwanjye nta cyo nashobora\nCyampesha gutsinda Satani.\nAriko nseng’ Imana mvuga:\nCan’ uwo muriro mu mutima wanjye.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Ndagusab’ umuriro Mwami,\nNgo nshobore kubwiriza mu rukundo.\nNdashak’ uwo muriro wawe,\nKugira ngo ngir’ umwete n’ ubutwari\nNshyiz’ umutima wanjye wose\nKu ruhimbi rw’ Imana yanjye.\nNone Man’ iryo turo ntuye,\nRyemerer’ urih’ uwo muriro wawe.",
      },
    ],
  },
  {
    number: 18,
    name: "Utwohererez’ Umwuka Wera",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Låt Anden falla..."},{"title":"Turne Roho kwa sisi sote..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Utwohererez’ Umwuka Wera,\nTurakwiringiye mu gusenga.\nYuk’ ubishaka kudushoboza\nKunesha byose, tugakundana.",
      },
    ],
  },
  {
    number: 19,
    name: "Mana, turategereje",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Herre, se, vi vänta alla...","codes":"Sgt. 46"},{"codes":"Ny. 19"},{"title":"Courage, brother...","codes":"M.A. 430"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Mana, turategereje\nKwakir’ uwo Mwuka wawe.\nTumugusabye twizeye;\nMutwoherereze, Mana.",
      },
      {
        type: "chorus",
        content:
          "Mana yacu, Mana yacu,\nWoherez’ Umwuka wawe.\nMu mitima yacu twese,\nTwuzuriz’ isezerano.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Wonger’ ucan’ umuriro,\nMu mitima yacu twese.\nIbitagushimishije,\nUbitwikish’ umuriro.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Duh’ imitim’ iboneye,\nTuve mu gasuzuguro,\nUtuber’ Umwami twese,\nUtegek’ abantu bawe.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Utwuzuz’ iminsi yose,\nUrukundo rwawe Mana.\nTub’ inzu y’ Umwuka Wera,\nAhore muri tw’ iteka.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Kand’ impano z’uwo Mwuka,\nUzitugabire Mwami.\nNdets’ ukize n’ abarwayi,\nNa bo bakumenye Mana.",
      },
    ],
  },
  {
    number: 20,
    name: "Mana, nyohererez’ umuriro wawe",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Eld från himlen...","codes":"Sgt. 84"},{"codes":"Ny. 15"},{"codes":"M.A. 392"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Mana, nyohererez’ umuriro wawe,\nUbu ni wo ntegereje.\nMp’ ubugingo bwiza, umpe n’ urukundo.\nUnyuzuz’ ibyiza byawe Yesu.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ibitagushimishije, ubitwike.\nUnyogeshe ya maraso.\nUndinde kub’ umunyagasuzuguro.\nYes’ unyeze mbone gutungana.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Yes’ undinde, sinkakugomer’ ukundi.\nKand’ umar’ umubabaro.\nNyoboz’ ukuboko kwawe Mwami Yesu,\nKuko kenshi nd’ umunyatege nke.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Mw ijuru tuzanezerwa bihebuje.\nUmubabar’ uzashira.\nHazabamw indirimbo zo gushimira,\nZo guhimbaza Yesu Mucunguzi.",
      },
    ],
  },
  {
    number: 21,
    name: "Nimuze tureb’ imbere, Dutegerez’ igitondo",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Skåda framåt, se...","codes":"Sgt. 294"},{"codes":"Ny. 181"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Nimuze tureb’ imbere, Dutegerez’ igitondo.\nTwiringir’ Imana yacu, Niy’ izakor’ imirimo.\nIzirukana Satani, Izategek’ isi yose.\nTuzanesha ni dusaba, Kukw Iman’ ijy’ itwumvira.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Dor’ impanda ziravuze, Muze twese dukanguke,\nKukw Imana yac’ ishaka Yuko twese tub’ abera.\nBuri muntu mw Itorero, Ab’ uwejejwe muri ryo.\nNshuti, reka kwiganyira, Urahabw’ imbaraga nshya.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Muririmbir’ Ihoraho, Yes’ ari hamwe natw’ ubu.\nTunesh’ ibigerageza Kubw’ imbaraga za Yesu.\nNimuze tumukorere, Tumuh’ ubutunzi bwacu.\nNdets’ ubwenge n’ umutima Bikorer’ Umwami Yesu!",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Kand’ abantu benshi cyane Ntibaz’ inzira y’ ijuru.\nBabohewe mu maboko Ya wa mugome Satani.\nMuze twese tubashake, Tubasangish’ Umukiza.\nNtiducogore gusenga Kugez’ ubwo Yes’ azaza!",
      },
    ],
  },
  {
    number: 22,
    name: "Yesu Mwami ni w’ utubaz’ ati: Ni nde ntumye mu murima wanjye",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Skördens Herre höres...","codes":"T.t. Sgt. 17"},{"codes":"Ny. 180"},{"title":"Hear the Lord of harvest...","codes":"R.H. 559"},{"codes":"M.A. 646"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Yesu Mwami ni w’ utubaz’ ati: Ni nde ntumye mu murima wanjye.\nDore hari benshi bazimiye, Gend’ ubamenyesh’ ubuntu bwanjye.",
      },
      {
        type: "chorus",
        content:
          "Mana yanjye, ntegek’ ubu. Unkozehw ikara ry’umuriro.\nMana yanjye, ntegek’ ubu. Ntuma Mwam’ ubu nd’ imbere yawe.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Umuntu w’ Imana yaravuze Ati: Jye nta cyo nishoboreye.\nArikw ashyuhijwe n’ umuriro, Ati: Mana, noneh’ uz’ untume.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Har’ abantu benshi bazimira, Batameny’ Umwami Yesu Kristo.\nMuze, tujye kubabwir’ inkuru Y’ agakiza k’ ijambo rya Yesu.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Igihe cy’ isarura gishize, Abakozi bose bazataha.\nKand’ Umwami wab’ azabakira, Ababwir’ ati: Mwakoze neza.",
      },
    ],
  },
  {
    number: 23,
    name: "Umurima w’ Iman’ ureze",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Gyllne fält för vinden vaja...","codes":"Sgt. 390"},{"codes":"Ny. 175"},{"title":"Far and near the fields...","codes":"R.S. 638"},{"codes":"R.H. 566"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Umurima w’ Iman’ ureze,\nN’ igihe cyo kuwusarura.\nMwa basaruzi muze vuba,\nGusarur’ ibisarurwa bye.",
      },
      {
        type: "chorus",
        content:
          "Yes’ ubu turakwinginga:\nWoherez’ abakozi bawe.\nBaterany’ ibyo bisarurwa,\nBabigushyikirize Mwami!",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ubazindure kare cyane,\nKand’ abandi mu gica-munsi.\nNo mu gihe cy’ umugoroba,\nYes’ ubahamagare bose.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Urahamagawe Mukristo,\nGenda vuba udakererwa.\nKandi wubur’ amaso yawe,\nKuk’ Umwami Yes’ aza vuba.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Muze mwese duhaguruke,\nDukorer’ uwaducunguye.\nHasigaye umwanya muto,\nAkaza kutugororera.",
      },
    ],
  },
  {
    number: 24,
    name: "Yes’ aduhamagaye mu rukundo",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Ljuvligt och kärleksfullt...","codes":"Sgt. 138"},{"codes":"Ny. 205"},{"title":"Softly and tenderly...","codes":"R.S. 95"},{"codes":"R.H. 356"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Yes’ aduhamagaye mu rukundo,\nJye na we, ndetse n’ abandi.\nKand’ ubu yiteguye kukwakira.\nReka gutinda mu byaha!",
      },
      {
        type: "chorus",
        content:
          "Garuka, garuka.\nUgarukir’ Umukiza.\nReka gutind’ aragutegereje.\nNon’ ugarukire Yesu.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ntutinde, dor’ araguhamagara.\nAtegereje ko waza.\nHafi ya Yesu haracyar’ umwanya,\nNdets’ uhagije n’ abandi.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ibihe byacu bihita ningoga.\nNtibizagaruk’ ukundi.\nSanga Yesu vub’ ubon’ amahoro.\nBikor’ ukiri muzima.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Witegerez’ urukundo rwa Yesu.\nNi rwo rukwiriye bose.\nKand’ atwibuka kubw’ imbabazi ze.\nJye na we ndetse n’ abandi.",
      },
    ],
  },
  {
    number: 25,
    name: "Yew’ ubabazwa n’ ibyaha",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Kom som du är...","codes":"Sgt. 83"},{"codes":"Ny. 202"},{"codes":"M.A. 422"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Yew’ ubabazwa n’ ibyaha,\nSang’ Umukiza ningoga.\nYa maraso ye yavuye,\nNiy’ agukurahw ibyaha.",
      },
      {
        type: "chorus",
        content:
          "Sang’ Umukiza ningoga.\nAshaka kugukiz’ ubu.\nMw isi har’ umubabaro,\nArikw iwe n’ amahoro.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Kuki s’ utinze mu byaha?\nKuki wabur’ ubugingo?\nNgwino ningoga kwa Yesu,\nAraguh’ amahoro ye.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ibihe bihita vuba,\nKandi nta bwo bigaruka.\nN’ igihe git’ ukitaba,\nKand’ukajyanw’ ikuzimu.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Yes’ azagaruka vuba.\nAzajyan’ umugeni we,\nTuzahora turirimba.\nDushim’ Umwana w’ Intama.",
      },
      {
        type: "chorus",
        content: "Mw ijuru, hafi ya Yesu\nDutandukanye n’ ibyaha.\nN’ ukuri nzaba mpiriwe.\nNzahora nezerw’ iteka."
      }
    ],
  },
  {
    number: 26,
    name: "Ndashakashak’ umwana wanjye",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Var är mitt vilsna barn...","codes":"Sgt. 432"},{"codes":"Ny. 214"},{"title":"Oh, where is my wandering boy...","codes":"M.A. 557"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Ndashakashak’ umwana wanjye,\nUri he se, mwana wanjye?\nMbere wajyag’ unezeza rwose,\nNa none ndacyakwibuka.",
      },
      {
        type: "chorus",
        content:
          "Uri he se mwana wanjye?\nUri he se mwana wanjye?\nGaruka ningoga!\nMwana wanjye nkunda,\nNi wowe nshak’ uyu munsi.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Mbere wari wejejwe rwose,\nUkimberey’ umwana.\nNon’ ubu wanduriye mu byaha,\nN’ inzira mbi wahisemo.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "None ndifuza kukubona,\nKo wagend’ utunganye.\nNkongera kukumv’ useng’ Imana\nUshimir’ Umwami Yesu.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Nshakashakir’ iyi nzimizi,\nUyishakish’ urukundo.\nNdamukiriz’ uwo mwana wanjye,\nMubwire yuko murinze.",
      },
    ],
  },
  {
    number: 27,
    name: "N’ inkuru nziza kur’ uyu munsi",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Härligt nu skallar frälsningens bud...","codes":"Sgt. 35"},{"codes":"M.A. 428"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "N’ inkuru nziza kur’ uyu munsi,\nIbayobora gusang’ Imana.\n/: Abari hafi n’ abari kure,\nMwese nimuze mukizwe nayo.: /",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Munyabyaha we, ngwino ningoga!\nYesu ni w’ ushaka kugukiza.\n/: Reka gutinda cyane mu byaha,\nUyu n’ umunsi wakirizwamo. :/",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Kuki wahunze Yesu Mukiza,\nKandi yagucunguj’ amaraso.\n/: Jy’ ureka kumuhungira kure\nWigir’ inama yo kugaruka. :/",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Mur’ ibyo byaha,\nNta munezero ugukwiriye uzahabona,\n/: Keretse Yesu ni w’ ushobora\nKunezez’ uwo mutima wawe. :/",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Birashoboka ko twanezerwa,\nMu bihe byose no mu makuba.\n/: Ni k’ umukristo w’ ukur’ ameze,\nAzanezerwa iteka ryose. :/",
      },
    ],
  },
  {
    number: 28,
    name: "Twarabatuwe rwose rwose",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Vi är ett folk, ett frigjort...","codes":"Sgt. 547"},{"codes":"Ny. 44"},{"codes":"M.A. 422"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Twarabatuwe rwose rwose\nMu Mwami Yesu Kristo.\nTwigish’ ijambo rye rizima\nMu mbaraga z’ Umwuka.\nCyo dukomeze tujye imbere,\nDutsind’ ibigerageza!\nTurwan’ intambara twizeye,\nTwihanganire byose.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Tur’ abasirikare benshi,\nTwogejwe mu maraso.\nUmwami wacu Yesu Kristo,\nNi nawe muyobozi,\nKubw’ imbaraga ze dufite,\nTuzabaho no mu rupfu.\nDukomeze dushyire mbere,\nDushimir’ Ihoraho.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Kwa Yesu dufit’ ubutwari,\nDufit’ ubushobozi,\nIyo twizey’ amagambo ye,\nUko yayatubwiye.\nKu musaraba haturuka\nIriba rimar’ inyota.\nTwahanywerey’ amazi meza,\nAmazi y’ ubugingo.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Mw ijuru n’ igihugu cyacu,\nCyuzuyemw amahoro\nMu gihe tuzakigeramo,\nTuzahimbaza Yesu.\nUmukiz’ azahanagura\nAmarira yacu yose.\nTuzanezererw’ igihugu,\nYadusezeranije.",
      },
    ],
  },
  {
    number: 29,
    name: "Yesu ni w’ ufit’ izina ryiza",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Jesus er det beste Naun au alle...","codes":"M.A. 37"},{"codes":"Ny. 92"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Yesu ni w’ ufit’ izina ryiza,\nMu mazina yose mur’ iyi si.\nIryo zina Yesu, Yesu,\nN’ umubavu mwiza cyane rwose.",
      },
      {
        type: "chorus",
        content:
          "Iryo zina rirakomeye,\nRirashobora gukurahw ibyaha.\nIryo zina Yesu, Yesu,\nNi ryo rinezeza mu mutima.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Nta n’ irindi zina mur’ iyi si\nRifit’ imbaraga n’ ubugingo.\nIryo zina Yesu, Yesu,\nRyaririmbwe n’abamarayika.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ni ryo zina rihebuj’ ayandi,\nNdetse ni ryo ryahanits’ ijuru.\nIryo zina Yesu, Yesu,\nRirimbwa mur’ iyi si yose.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Sinshobora kwibagirwa Yesu,\nIryo zina n’ agakiza kanjye.\nYesu, Yesu nzamubona\nTuri mw ijuru tunezerewe.",
      },
    ],
  },
  {
    number: 30,
    name: "Ubugingo bwacu ni bugufi cyane",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Vårt liv är en seglares färd...","codes":"Ny. 79"},{"title":"When out on the ocean of life..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Ubugingo bwacu ni bugufi cyane,\nTwabugeranya n’ ubwato mu mazi.\nTunyura mu nyanja irimw amakuba,\nArik’ Umukiza ni w’ utuyobora.",
      },
      {
        type: "chorus",
        content:
          "Ubwo tuyoborwa n’ Umukiza wacu,\nDufit’ amahoro mur’ urwo rugendo.\nKand’ azatugeza mw ijur’ amahoro,\nNtabwo tuzongera kwibuk’ urugendo.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Tunyura mu mbeho mu muyaga mwinshi,\nIjambo ry’ Imana rituber’ umucyo.\nUbwoba n’ amakuba mur’ ubwo bwato\nBizibagirana mw ijuru kwa Yesu.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Nubw’ uwo muyaga ufit’ imbaraga,\nNatwe twegereye ku nkombe y’ uruzi\nNta muyag’ uhari, nta murab’ uhari.\nN’ ukuri tuzasohora mu mahoro",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Ubwo tuzagera kwa Data mw ijuru,\nRwose tuzashimir’ Umukiza Yesu.\nNta yandi makuba tuzagir’ ukundi,\nTubanye na Yesu mu bwami mw ijuru.",
      },
    ],
  },
  {
    number: 31,
    name: "Musamariyakazi, Yesu yaramubwiye",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Låt mig dricka ur krukan..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Musamariyakazi, Yesu yaramubwiye:\nAti: Mp’ utuzi nyweho, naw’ aramusubiza:\nByashoboka bite se, ngo mbe naguh’ amazi?\n/: Kandi k’ ur’ Umuyuda nkab’ Umusamariya?\nNguk’ uko yatangaye.: /",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Umuntu wes’ uzanywa ayo mazi nzamuha,\nNta bw’ azagir’ inyota. kugez’ iteka ryose.\nKukw ayo maz’ ariyo yamanutse mw ijuru.\n/: Azamuhindukira isokw idudubiza,\nMuri w’ iteka ryose. :/",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Umpe kur’ayo mazi y’ ubugingo bw’ iteka,\nAmar’ inyota mfite, sinzongere kuvoma.\nYesu yumva ningoga uwo Musamariya.\n/: Ngwino kukw iyo mpano ituruka mw ijuru.\nWayihabw’ uyu munsi. :/",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Iy’ usobanukirwa igikorwa cy’ Imana,\nUkameny’ ugusabye ayo mazi yo kunywa,\nNaw’ uba wamusabye, akaguh’ ayo mazi.\n/: Amazi y’ ubugingo ntabw’ aba mur’ iyi si\nAbantu batuyemo. :/",
      },
    ],
  },
  {
    number: 32,
    name: "Sioni sanganir’ Umukwe",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Gå, Sion, din Konung att...","codes":"Sgt. 122"},{"codes":"Ny. 102"},{"title":"Be glad in the Lord and rejoice..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Sioni sanganir’ Umukwe,\nGend’ umwerek’ umunezero.\nWibonez’ imbere y’ Umukwe.\nGir’ umwete wo kwitegura.",
      },
      {
        type: "chorus",
        content:
          "Nezerwa, nezerwa,\nUmukw’ agushakahw impundu.\nNezerwa, nezerwa,\nNgwin’ upfukamir’ Ihoraho.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Umukiza wacu yavuye\nKu ntebe y’ ubwami mw ijuru.\nYagaragaye mu ruhinja.\nRwaryamishijwe mu muvure.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Yabay’ igitambo gikwiye.\nYababarijw’ i Gologota.\nYapfiriye bose bo mw isi.\nDuhabw’ agakiza k’ Imana.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Yaneshej’ umwanzi Satani,\nNdetse n’ urupfu rwaratsinzwe.\nYaduhishuriy’ ubugingo.\nTwahawe kuzabahw iteka.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Agenderer’ abababaye,\nAbah’ amahoro y’ ukuri.\nAzahora ku ngom’ iteka,\nKukw ar’ Umwam’ ukiranuka.",
      },
    ],
  },
  {
    number: 33,
    name: "Yesu Mukiza yasezeranye",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"På himlens skyr skall...","codes":"Sgt. 374"},{"codes":"Ny. 96"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Yesu Mukiza yasezeranye\nYuk’ umuns’ umw’ azaza kudutwara\nAzatujyana iwe mw ijuru,\nAzaza vuba nta bw’ azatinda.",
      },
      {
        type: "chorus",
        content:
          "Sinshidikanya, mfit’ ukwizera,\nKubw’ Umukiza n’ amaraso ye.\nUmwuka Wera ni we nahawe.\nNi w’ uzangeza ku byo narazwe.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Intumwa nyinshi z’ Umwam’ Imana,\nUbu zatumwe mur’ iyi si yose.\nZiramamaz’ ubutumwa bwiza, bwa\nYesu Kristo n’ urukundo rwe.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Abantu benshi bizer’ Imana,\nBitab’ umuhamagaro w’ Imana.\nDuhuz’ umutima mu rugendo,\nKandi tuzabon’ ingororano.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Igihe cy’ Umwami Yesu Kristo\nCyo kugaruka kwe, kiregereje.\nTugir’ umwete, tumwitegure,\nAz’ atujyane iwe mw ijuru.",
      },
    ],
  },
  {
    number: 34,
    name: "Nyoborwa mu nzira yose",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Hela vägen går Han med...","codes":"Sgt. 331"},{"codes":"Ny. 49"},{"title":"All the way my Saviour leads me...","codes":"R.S. 445"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Nyoborwa mu nzira yose\nN’ ukuboko k’ Umukiza.\nIyo mbony’ inez’ agira,\nNta bwo mba ngishidikanya.\nNdetse ngir’ umunezero,\nN’ amahor’ asendereye.\n/: Angirir’ ubuntu bwinshi,\nButagir’ uko bungana. :/",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Nyoborwa mu nzira yose,\nNiringiy’ Umwami Yesu.\nAntsindiran’ ibishuko,\nAnyongeramw’ imbaraga.\nMu gihe nishwe n’ inyota\nNaniriwe mu rugendo.\n/: Rwa rutare rwasadutse,\nRuradudubiz’ amazi. :/",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Nyoborwa mu nzira yose,\nKubw’ urukundo rwe rwinshi.\nNo mw ijur’ imbere ya Se,\nNzanezerwa bihebuje.\nYesu ku birenge byawe,\nNiho mpfukamye nkuramya.\n/: Kuko wanyoboye neza\nMur’ iyi si ngituyemo. :/",
      },
    ],
  },
  {
    number: 35,
    name: "Ni Yesu wangize kub’ umuvandimwe we",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Jesus har kallat mig till broderskap..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Ni Yesu wangize kub’ umuvandimwe we.\nIman’ ishimwe cyane.\nKand’ ibyo mfite byose ni we wabimpaye.\nIman’ ishimwe cyane.\nKandi yarambabariy’ angir’ imbohore\nYamviriy’ amaraso yo mu mutima we\nNdanezerewe cyane kuko yanshunguye\nIman’ ishimwe cyane.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ibyiza yakoze mbifitemw umufasha.\nIman’ ishimwe cyane.\nNi w’ umfasha mu bintu byose bikomeye.\nIman’ ishimwe cyane.\nImibabaro yanjye yose ni kw ayizi.\nAhindur’ iyo mibabaro ngw anezeze.\nIman’ ishimwe kuko yumv’ amasengesho.\nIman’ ishimwe cyane.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ku Mana mw ijuru mfitey’ umugabane.\nIman’ ishimwe cyane.\nMu mwanya muto tuzabon umunezero.\nIman’ ishimwe cyane.\nMw ijur’ abera bazamurika nk’ izuba\nYes’ ubw’ azatwambik’ ikamba ry’ ubugingo\nTumwitegure kukw azagaruka vuba.\nIman’ ishimwe cyane.",
      },
    ],
  },
  {
    number: 36,
    name: "Ubugingo dufite mw isi",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"En sådd är vårt liv här i tiden...","codes":"Ny. 173"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Ubugingo dufite mw isi,\nBusa n’ ibiba n’ isarura.\nUbibira mu mubiri we,\nNi w’ uzasarura kubora.\nUbwo dukorer’ Umukiza,\nAzatugororera mw ijuru.\nTugume mw ijambo ry’ Imana,\nKugeza mu gihe cyo gupfa.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Kubw’ ubuntu bwinshi busaga,\nTwemewe n’ Iman’ Ihoraho.\nKubw’ ubuntu bwinshi busaga,\nTwahawe gukorer’ Imana.\nTwibesherejweho na Yesu,\nMuri byose tubonera mw isi.\nIyo twamamaj’ ubutumwa,\nNi yo nyungu yacu y’ ukuri.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ubw’ Abakristo bazinjira\nMw ijuru gushim’ Umukiza.\nNdifuza kuzajyana na bo,\nDufatanye kumuhimbaza,\nTuzaririmbir’ Umukiza\nKuko yatuguz’ amaraso ye.\nAbakoranag’ urukundo,\nBazahora bamuhimbaza.",
      },
    ],
  },
  {
    number: 37,
    name: "Nibw’ ugeze mu magorwa, wizere, wizere",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"When opposing forces meet you..."},{"title":"Om du möter många hinder..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Nibw’ ugeze mu magorwa, wizere, wizere.\nIman’ izabitunganya nib’ uyizeye.",
      },
      {
        type: "chorus",
        content:
          "Niba wizey’ Ihoraho, Izabigufashamo.\nIzakor’ ibitangaza, Niba wizeye.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Nib’ ufit’ umubabaro, wizere, wizere.\nUzahozwa n’ Ihoraho, Niba wizeye.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "N’ ubon’ ibigerageza, wizere, wizere.\nWemere yuk’ ubinesha, Niba wizeye.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Nib’ uzi k’ uri wenyine, wizere, wizere.\nYes’ azab’ akuri hafi, niba wizeye.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Nib’ urushye mu rugendo, wizere, wizere.\nNiy’ izatungany’ inzira, nib’ uyizeye.",
      },
    ],
  },
  {
    number: 38,
    name: "Nowa kuki wubak’ iyo nkuge",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Varför bygger du Noa en båt..."},{"title":"Mbona Nuhu wajenga safina..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Nowa kuki wubak’ iyo nkuge?\nUrakor’ iby’ umupfapfa rwose.\nDor’ utuy’ imusozi,\nKandi nta maz’ ahari.\nIby’ ukora biratuyobeye.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Uwiteka ni we wabivuze,\nYukw abagizi ba nabi bose.\nAbujuj’ is’ ibyaha\nBazamarwa n’ amazi.\nAyo maz’ azabar’ umwuzure.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Bagir’ inama yo kubazanya.\nNone Nowa yab’ avug’ ukuri.\nBati: Habe na gato,\nNtidukwiye kwemera,\nTwikomeze mu byo kwinezeza.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Igihe na cyo gihita vuba,\nNowa yubakan’ umwete rwose.\nBose bamurebaga\nNi ko bamusekaga\nBati: Noneho Noa yasaze.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Nowa yumvir’ Iman’ Ihoraho.\nYinjira muri ya nkuge vuba.\nYinjirana n’ abandi\nBagiriw’ imbabazi.\nUbw’ Iman’ ibakingir’ urugi.",
      },
      {
        type: "verse",
        number: 6,
        content:
          "Nukw abantu baraseka cyane.\nBakomanga ku rugi bavuga\nBati: Nowa, sohoka.\nIyi mvur’ irahita.\nWitubeshya ng’ uri mu rugendo.",
      },
      {
        type: "verse",
        number: 7,
        content:
          "Ijuru risa n’ iritobotse.\nUbwo hagw’ imvur’ itey’ ubwoba.\nBati: Turarimbutse\nNk’ uko Nowa yavuze.\nDor’ urupfu ruratuzengutse.",
      },
      {
        type: "verse",
        number: 8,
        content:
          "Umv’ ukw Imana yabashubije:\nNowa yajyag’ abigisha rwose.\nMubigir’ ibikino,\nMwanga kwumvir’ intumwa.\nNi ryo teka muciriwe none.",
      },
      {
        type: "verse",
        number: 9,
        content:
          "Nukw amaz’ aterura ya nkuge\nIreremba kuri wa mwuzure.\nAbicaye mu nkuge\nBafitemw amahoro,\nKugez’ ubwo bazasohokamo.",
      },
      {
        type: "verse",
        number: 10,
        content:
          "None natwe dufit’ iyo nkuge:\nN’ agakiza twahawe na Yesu.\nNib’ ushak’ amahoro,\nNgwino wihitiremo,\nAgakiz’ ureke kurimbuka.",
      },
    ],
  },
  {
    number: 39,
    name: "Kur’ uyu munsi turashobora",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Mäktiga ting det sker i vår tid...","codes":"Sgt. 562"},{"title":"Ishara za Mungu"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Kur’ uyu munsi turashobora\nKubon’ ibimenyetso by’ Imana.\nAbanyabyaha barakanguka,\nBakemer’ Ihoraho.",
      },
      {
        type: "chorus",
        content:
          "Impumyi zose n’ ibipfamatwi\nN’ abaremaye n’abanyunyutse.\nBose babasha kuba bazima,\nKubw’ izina rya Yesu.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Na n’ ub’ Iman’ifit’ ububasha,\nIbyuts’ abarway’ ikibakiza.\nIman’ ifash’ abanyantege nke,\nNo kubakiza rwose.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Dufit’ Umwuka Wera w’ Imana.\nNi w’ utuyobora buri munsi.\nNon’ Abakristo bariteguye,\nGusanganira Yesu.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Wa munyabyaha we, sanga Yesu,\nAragushak’ aguhamagara.\nWiyeze mu maraso ya Yesu,\nN’ Umucunguzi wawe.",
      },
    ],
  },
  {
    number: 40,
    name: "iyo ndebeshej’ ukwizera",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"När jag i tron min Jesus ser...","codes":"Sgt. 355"},{"codes":"Ny. 165"},{"codes":"M.A. 107"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Iyo ndebeshej’ ukwizera,\nNezererw’ Umukiza wanjye,\nMbon’ ubutunzi bwinshi cyane,\nBufitwe na Dat’ Uhoraho.\nHaleluya, ndanezerewe,\nKukw anyobor’ iminsi yose,\nIyo mfit’ intege nke cyane,\nAmbumbatiz’amaboko ye.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Noneho nta bwo nkir’ indushyi,\nKuko nujujw’ umunezero.\nUrukundo rwe n’imbabazi,\nBitum’ anyumv’ iyo musabye.\nHaleluya, kukw ambeshaho.\nNon’ ubu nguwe neza rwose.\nNiba naw’ ushak’ amahoro,\nUmwugururir’ umutima.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ubwo nari nkiri mu byaha,\nNari nuzuy’ umubabaro.\nNon’ ubu nta gushidikanya,\nNta teka nzacirwah’ ukundi.\nHaleluya, amp’ imbaraga\nZo gutsind’ ibigerageza.\nNdanezerewe mu mutima,\nNdindwa n’ Iman’ iminsi yose.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Umubabaro no gusekwa,\nByose ni ko byabay’ ubusa.\nKuko njya mpozwa n’ Umukiza,\nKandi mbumbatirwa na Data.\nHaleluya, Mukiza wanjye\nNi wow’ untunga kubw’ ubuntu.\nNaho nab’ umunyantege nke,\nNizeye k’ uzamp’ imbaraga.",
      },
    ],
  },
  {
    number: 41,
    name: "Ndahiriwe kuk’ Umucunguzi wanjye",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Ljuvliga förvissning...","codes":"Ny. 251"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Ndahiriwe kuk’ Umucunguzi wanjye,\nYankuyehw’ ibyaha byose.\nNone mvuz’ impundu kubw’ umunezero.\nAnezez’ iminsi yose.",
      },
      {
        type: "chorus",
        content:
          "Anezez’ iminsi yose!\nAnezez’ iminsi yose!\nNdahiriwe kuk’ Umucunguzi wanjye,\nYankuyehw’ ibyaha byose.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ndahiriwe kuko Yesu yampfiriye,\nNone akab’ ari muzima.\nN’ inshuti y’ ukuri kand’ itubohora,\nMu ngoyi za wa mugome.",
      },
       {
        type: "chorus",
        content:
          "Anezez' iminsi yose!\nAnezez' iminsi yose!\nNdahiriwe kuko Yesu yampfiriye,\nNon' akab' uri muzima.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ndahiriwe kuko nyoborwa na Yesu.\nNca mu nzira yaciyemo.\nCyane cyan' iyo numviy' amagambo ye,\nSi mba nkizimiy' ukundi.",
      },
      {
        type: "chorus",
        content:
          "Anezez' iminsi yose!\nAnezez' iminsi yose!\nNdahiriwe kuko nyoborwa na Yesu,\nNtabwo nzaba nkizimiye.",
      },
    ],
  },
  {
    number: 42,
    name: "Mfit’ amahor’ i Gologota",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"O, sköna och ljuvliga vila...","codes":"Ny. 51"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Mfit’ amahor’ i Gologota,\nNi ho Yesu yanyitangiye.\n/: Ni naho mfit’ ubuhungiro,\nKwa Yesu wabanje kunkunda. :/",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Simparanir’ ubwiza bw’ isi,\nKukw isi yuzuyemw ibyaha.\n/: Ahubwo mfitiy’ agakiza,\nMu nkovu za Yesu Mukiza.:/",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ni we wadutuy’ imitwaro,\nYaciy’ imigozi y’ ibyaha.\n/: Nejejwe n’ agakiza mfite,\nKavuye mw ijambo ry’ Imana.:/",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Ijambo ry’ Iman’ Ihoraho,\nRituber’ ibyo kurya byera.\n/: Ni ryo mbaraga yo gufasha,\nUmukristo mu rugendo.:/",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Nabay’ urusengero rwera,\nNtuwemo n’ Umwuka w’ Imana.\n/: Nsigaye nyoborwa na Yesu,\nMu nzira y’ isezerano rye.:/",
      },
      {
        type: "verse",
        number: 6,
        content:
          "Nawe munyabyaha, tebuka\nKwa Yesu Mukiza wa bose.\n/: Akuramburiy’ amaboko\nY’ Urukundo, yo ku gufasha.:/",
      },
    ],
  },
  {
    number: 43,
    name: "Ngwin’ unyigishe ya nkuru nziza",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Ett jag dock vet...","codes":"T.t. Sgt. 18"},{"codes":"Ny. 189"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Ngwin’ unyigishe ya nkuru nziza,\nYa nkuru y’ agakiza,\nNubwo ntabasha kumenya neza\nUbuntu bwe bwinshi.\nNzi yuk’ ubwo nari mu mwijima,\nYesu Mukiza yarahansanze.\nAherakw amp’ agakiza,\nAmpa n’ ibyiringiro.",
      },
      {
        type: "chorus",
        content:
          "Nar’ impumyi, non’ ubu ndabona.\nKuko yumvise gusenga kwanjye.\nKandi ntazanyibagirwa,\nKuko nzi yukw ankunda.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Kand’ iy’ abumbuy’ ibiganza bye,\nTubonamw agakiza.\nNib’ unaniriwe mu mutima,\nNgwin’ usange Yesu.\nWaruhijwe n’ ibyo byaha byawe,\nTumbir’ Umukiza wawe Yesu.\nKand’ araguhe agakiza,\nNgwino kukw agukunda.",
      },
    ],
  },
  {
    number: 44,
    name: "Izina rya Yesu Kristo, Rihorahw iminsi yose",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Jesu-namnet blekner aldri...","codes":"M.A. 656"},{"codes":"Ny. 280"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Izina rya Yesu Kristo, Rihorahw iminsi yose.\nIryo zina n’ iry’ iteka, Kandi nta bwo rihinduka.\nRikwiriy’ abantu bose, Abasaza n’ abasore.\nRishobora kuyobor’ umuntu wes’ ushak’ Imana.",
      },
      {
        type: "chorus",
        content:
          "Iryo zina ndarikunda.\nRinezeza mu mutima.\nNo kubw’ iryo zina ryiza,\nNanjye nahawe agakiza.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Iryo zina ryamamaye mu mpande zose z’ iyi si.\nRizanir’ abantu bose Ibyiringiro bizima.\nIryo zina rishobora Kudukurah’ ubugome.\nRigatuma, mu mutima Hategekwa n’ Umukiza.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Iryo zina rishobora Kumurika mu mwijima.\nRishobora kuyobora Inzira nshya y’ ubugingo.\nNahw izuba ryakwijima, Iryo zina, ryo riraka.\nRihimbazw’ iteka ryose Mw isi ndetse no mw ijuru.",
      },
    ],
  },
  {
    number: 45,
    name: "Iby’ Iman’ ikora biradutangaza",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Hur underlig är du i allt...","codes":"Sgt. 167"},{"codes":"Ny. 276"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Iby’ Iman’ ikora biradutangaza,\nNta n’ uwabimeny’ uko biri.\nArikw icyo nzi nukw iby’ Iman’ ishaka,\nAri byo nkwiriye gukora.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Mu rugendo nta bwo nabimenya byose,\nAriko nzi ko nzabimenya.\nNi kuki turizwa n’ ibyago biriho,\nKand’ ari byo mu gihe gito.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Yesu nzi k’ ufit’ amagar’ ibihumbi,\nHarimo n’ iryo wangeneye.\nIcyo wampitiyemo n’ ukugira ngo\nNzagere mw ijur’ amahoro.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Kandi nk’ ukw Eliya yajyanywe ningoga,\nNanjy’ uko ni ko nzava mw isi.\nUbw’ ibyago byose bizaba bishize,\nHariho guhimbaz’ Imana.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Tuzab’ ibihumbi turamy’ Umukiza.\nTuzamuririmbira twese:\nUr’ Iman’ ikiranuka muri byose\nKu buntu n’ inam’ utugira.",
      },
      {
        type: "verse",
        number: 6,
        content:
          "Ubu ntegereje kandi nihanganye\nKuzasobanukirwa byose.\nMfit’ ibyiringiro bifit’ ubugingo,\nMfit’ umugabane mw ijuru.",
      },
    ],
  },
  {
    number: 46,
    name: "Yes’ ubu tukuragij’ uyu mwana",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Vi legger nu vårt barn...","codes":"M.A. 348"},{"title":"Mel. Giv mig den frid...","codes":"Sgt. 245"},{"codes":"Ny. 58 och 287"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Yes’ ubu tukuragij’ uyu mwana.\nTurakwinginze umuturerere.\nNo kubw’ ubuntu bawe, buri munsi\nUmuduher’ umugisha, Yesu.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Mw isi huzuyemw ibigusha byinshi.\nHarimw ibyago byinshi bidutega.\nUb’ umwungeri w’ uyu mwana, Yesu.\nUmuyobore, umuber’ inshuti.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Yesu, kubw’ urukund’ umukomeze.\nMufashe ntananirirwe mu nzira,\nKand’ umurinde kubw’ ubuntu bwawe.\nAhore mu maboko yawe Yesu.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Umwohererez’ umucyo w’ ubuntu.\nUmuh’ amazi yawe y’ ubugingo.\nTurakwinginga cyane Mwami Yesu:\nRindir’ umwana wacu mu mahoro.",
      },
    ],
  },
  {
    number: 47,
    name: "N’ igihe git’ intambar’ igashira",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"En liten tid och striden...","codes":"Mel. Sgt. 171"},{"codes":"M.A. 73"},{"codes":"Ny. 262"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "N’ igihe git’ intambar’ igashira.\nN’ igihe git’ umurab’ ugacyahwa.\nNoneho nkarambik’ umutwe wanjye\nMuri rwa rubavu rwa Yes’ unkunda.\n/: Mw ijuru ntihazageramw ibyaha,\nNi cyo gituma huzuy’ amahoro. :/",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Umubabaro n’ uw’ igihe gito.\nIjoro, na ryo n’ iry’ igihe gito.\nNdirira kenshi mur’ iyi si ndimo,\nAriko nuko ntarabona Yesu.\n/: Hazabahw igitondo gihoraho,\nNi bwo ntazongera kurir’ ukundi. :/",
      },
      {
        type: "verse",
        number: 3,
        content:
          "N’ igihe gito ngifit’ umuruho.\nN’ igihe gito nkazabona Yesu.\nNi bwo nzaba ntandukanye n’ ibyago.\nNzaba mbumbatiwe mu maboko ye.\n/: Nzi ko mw ijuru hatab’ umwijima.\nHabah’ umucyo uhorahw iteka. :/",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Noneho nta cy’ umubabar’ untwaye,\nKuko nzawibagirirwa kwa Yesu.\nNubwo ngifite kubabazwa mw isi:\nMw ijuru nta mubabaro n’ urupfu.\n/: Iman’ izahanagur’ amarira,\nIzavanah’ umubabaro wose. :/",
      },
    ],
  },
  {
    number: 48,
    name: "Nahaw’ ubugingo buhoraho rwose",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Ett liv jag nu äger...","codes":"Sgt. 418"},{"codes":"M.A. 536"},{"codes":"Ny. 149"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Nahaw’ ubugingo buhoraho rwose.\nKand’ ubwo bugingo ni Yesu.\nN’ ukuri yinjiye mu mutima wanjye.\nKandi yanshyizemw ubutwari.",
      },
      {
        type: "chorus",
        content:
          "Nejejwe n’ Imana mu mutima wanjye\nN’ umuriro w’ ijur’ urimo\nNsigaye ngendera mu mucyo w’ ukuri.\nYesu Mukiza ni we mucyo",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Imigisha yo mu gakiza k’ Imana\nKubw’ ubuntu narayihawe\nNayihawe mu gihe nihanny’ ibyaha\nImbere y’ Umukiza Yesu",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Umukiza ni we wankuye mu ishyamba\nNsigaye mba mu murima we.\nNo kubw’ imvura n’ izuba byo mw ijuru\nNshobora kwer’ imbut’ ashaka.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Ubugingo bwiza nahisemo n’ ubu:\nGukorer’ Umukiza Yesu.\nKubaho ni Kristo no gupfa n’ inyungu\nKu Mukristo wese w’ ukuri.",
      },
    ],
  },
  {
    number: 49,
    name: "Tuzanezerwa cyane mw ijuru",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Vilken sällhet oss väntar...","codes":"Sgt. 289"},{"codes":"M.A. 682"},{"codes":"Ny. 86"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Tuzanezerwa cyane mw ijuru,\nHar’ ibyicaro by’ abahiriwe.\nTuzasingiz’ Umukiza wacu.\nKandi tuzabana n’ Imana.",
      },
      {
        type: "chorus",
        content:
          "Tuzanezerwa, Turamy’ Umukiza\nImbere y’ Imana mw ijuru.\nTuzanezerwa, turamy’ Umukiza\nMu gihe tuzagerayo.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Mur’ iyi s’ umunezero waho\nKensh’ uhinduka kub’ amaganya.\nAriko mw ijuru nta maganya,\nNta mubabar’ uzahagera.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Iyo gushidikanya n’ ibyago\nBigiye kudindiz’ urugendo.\nTuzuburir’ amaso mw ijuru.\nNi ho dufit’ umunezero.",
      },
    ],
  },
  {
    number: 50,
    name: "Ririmb’ inkuru nziza: Iman’ ikunda bose",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Sjung om Guds rika kärlek...","codes":"Sgt. 445"},{"codes":"Ny. 114"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Ririmb’ inkuru nziza: Iman’ ikunda bose.\nWigishe ya maraso yatwejej’ imitima.\nUvug’ iby’ iyo mpano, yuko twahaw’ Umwana.\nGend’ uvug’ iyo nkuru ku bantu bose.",
      },
      {
        type: "chorus",
        content:
          "Yesu ku musaraba yadupfiriye twese.\nYatwujuje n’ Imana, ni yo Data wa twese.\nWa mwenda war’ ahera, nziko watabutsemo.\nJye nawe, none twugururiw’ inzira.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Abababaye bose, gend’ ubaririmbire\nN’ abari mu ntambara cyan’ abageragezwa\nRirimba mu misozi, vug’ iyi nkuru nziza,\nYuko Yes’ abashaka kubw’ urukundo",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Mu mwijim’ uririmbe, naho hatav’ izuba\nBos’ ubaririmbire, bos’ uko bamerewe.\nMu gitond’ uririmbe, no ku manywa y’ ihangu\nShim’ Umukiza nubw’ ijoro riguye",
      },
    ],
  },
  {
    number: 51,
    name: "Yemwe bantu mwese, mushimir’ Imana",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Lova Herren, du Hans egen köpta skara...","codes":"Sgt. 5"},{"codes":"Ny. 135"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Yemwe bantu mwese, mushimir’ Imana,\nKu mbabaz’ ihor’ itugirira.\nYesu Kristo, aturind’ iminsi yose,\nKand’ atuyobor’ inzira.",
      },
      {
        type: "chorus",
        content:
          "Shim’ Imana! Shim’ Imana!\nKukw ari yo iturinda twebwe twese.\nShim’ Imana! Shim’ Imana!\nKukw irind’ abayo neza.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Yesu yakubabariy’ ibyaha byose.\nAragukiz’ intege nke zawe.\nAraguhanagur’ amarira yawe,\nUrahazwa n’ ubuntu bwe.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Yes’ ashobora kuguh’ imbaraga nshya,\nNo kuguh’ intwaro yo kunesha.\nUyoborwa neza mu nzira ya Yesu,\nAkurinda mu mahoro.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Hor’ ushikamye mu Mwami Yesu Kristo.\nNi ko gukiranuka gushyitse.\nNi nako gakiza, ndetse ni bwo bwenge.\nTuronkera mu Mukiza.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Umuns’ umw’ Umwami Yes’ azagaruka,\nAje kutujyan’ iwe mw ijuru.\nUwo Mwami wacu, tuzamuhimbaza,\nKukw ari we Mucunguzi.",
      },
    ],
  },
  {
    number: 52,
    name: "Mu bimenyetso byose tubona",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Jag länge väntat på bud om våren..."},{"title":"Ishara zote..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Mu bimenyetso byose tubona\nYuk’ Umukiza wac’ aza vuba\nNk’ uk’ umuraby’ uhita ningoga,\nNo kugaruka kwe ni ko kuri.\nTuzamusanganira mu bicu.\nHazabah’ umunezero mwinshi.\nAzab’ ahamagay’ abe bose,\nAbasohoze mw ijuru kwa se.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Kur’ uwo muns’ abantu babiri\nBazaba bari mu kiganiro.\nUmwe muri bo azazamurwa,\nArik’ und’ asigare wenyine.\nHazabahw abagore babiri\nBazaba basya ku rusyo rumwe,\nUmwe muri bo, azazamurwa,\nArik’ und’ asigare wenyine.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Mur’ iryo jor’ abantu babiri\nBazaba baryamye ku buriri.\nUmwe muri bo azazamurwa,\nArik’ und’ asigare wenyine.\nIyo nyir’ inzu ameny’ umunsi\nN’ igih’ umujur’ azaza kwiba,\nYabaye maso kurind’ inzu ye,\nUwo mujura nta cyo yatwara.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Na ba bakobwa ukw ar’ icumi,\nBagiye gusanganir’ umukwe.\nBari bafit’ amatara yabo,\nBategereje yuk’ umukw’ aza.\nAbanyabwenge bari batanu,\nNi bo bajyany’ amavuta menshi.\nUmukw’ asohoye barinjira,\nUrugi ruherako rukingwa.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Abandi batanu bar’ abapfu,\nBo nta mavuta bari bafite.\nBarakomanze barasubizwa\nYuko bat’ azwi habe na gato.\nInama Yes’ abagira n’ iyi:\nNimube maso kuko mutazi\nIgih’ Umwam’ azagarukira.\nBiradukwiye ko twitegura.",
      },
    ],
  },
  {
    number: 53,
    name: "Umuns’ umwe tuzabona",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Snart vil himlens hvælv...","codes":"M.A. 326"},{"codes":"Ny. 98"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Umuns’ umwe tuzabona\nUbwiza bw’ Umwami Yesu.\nAtab’ aje mu mucyo we\nUmeze nk’ uw’ umurabyo.",
      },
      {
        type: "chorus",
        content:
          "Vug’ ubutumwa bw’ Imana\nUbuvug’ ufit’ umwete\nIgihe kiregereje,\nCyo kugaruka kwa Yesu",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Uwo munsi umez’ utyo,\nTwawutegereje kenshi\nUbw’ imbaraga z’ urupfu\nZizaba zirangiy’ ubwo",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Uwo munsi w’ Abakristo\nWo gusanganira Yesu\nBazambikw’ imyenda yera\nMw ijuru ku Mucunguzi",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Uvug’ iyo nkuru nziza,\nNdets’ ukize n’ abarwayi\nUgarur’ abazimiye\nGir’ umwet’ udakererwa",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Mu bimenyetso tubona\nYuko Yesu ari hafi\nUwo Mwam’ azagaruka\nKutujyan’ iwe mw ijuru.",
      },
    ],
  },
  {
    number: 54,
    name: "Harih’ umuns’ izuba rizarasa",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Snart gryr en morgon...","codes":"Sgt. 288"},{"codes":"Ny. 97"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Harih’ umuns’ izuba rizarasa,\nWa munsi tuzageraho mw ijuru.\nNi ho tuzaba dutay’ umuruho.\nTuzaba dufit’ umunezer’ udashira.",
      },
      {
        type: "chorus",
        content:
          "Tuzamusanganira Yesu Kristo.\nKukw ari we wadukirije mur’ iyi si.\nTuzamwitegerereza mw ijuru.\nTuzamushimir’ urukundo yadukunze.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Harih’ umunsi tuzabona byose\nIman’ ibihinduye kuba bishya.\nKur’ uwo munsi Umukiza wacu\nAzatwugururir’ urugi rwo mw ijuru.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Tugeragezwa kenshi mu rugendo.\nTuzanezerwa tugeze mw ijuru.\nKand’ umwijima nta bw’ uzahagera.\nTuzarushaho guhimbaz’ Umucunguzi.",
      },
    ],
  },
  {
    number: 55,
    name: "Nifuza cyane kuzagera",
    url: "https://indirimbo.rw/song/agakiza/1",
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Nifuza cyane kuzagera\nMuri wa murwa wo mw ijuru.\nMbasezeyeho bantu mwese\nMushaka gukorer’ iyi si.",
      },
      {
        type: "chorus",
        content:
          "Muri wa murwa w’ ubugingo\nDuteraniyeyo n’ abera;\nTuzaboneray’ Umukiza\nTuzanezererway’ iteka",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ntihazageray’ amarira\nMuri wa murwa wo mw ijuru\nUrupfu ntiruzahagera\nMu murwa w’ amahor’ iteka",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ibyago ntibizahagera\nMuri wa murwa wo mw ijuru\nAgahinda n’ imibabaro\nNta bwo biba mur’ uwo murwa",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Tuzasangay’ inshuti zacu,\nZatubanzirije mw ijuru\nUbwo turamuts’ Umukiza,\nTuvuz’ impundu turirimba",
      },
    ],
  },
  {
    number: 56,
    name: "Twese uko tur’aha turanezerewe",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Så den adla säden Re'n i...","codes":"Sgt. 170"},{"codes":"Ny. 183"},{"title":"Sowing in the morning...","codes":"R.S. 463 (Mel.)"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Twese uko tur’aha turanezerewe.\nTugusanganiye, duhuj’ umutima.\nTwabisaby’ Imana ngw ikurinde neza\nMu rugendo rwawe no kukugarura.",
      },
      {
        type: "chorus",
        content:
          "/: Ko twishimye dutya!\nKo twishimye dutya!\nBizagenda bite\nUbwo Yes’ azaza?: /",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ntitwakwibagiwe, ubwo twasengaga,\nKand’ Imana yacu yaratunejeje.\nIduh’ ukwizera, kukw izakurinda\nNon’ ishimwe rwose, turanezerewe.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "None, mwene Data, twongere, twishime,\nKukw Imana yacu ikiranuka.\nIby’ ivuga byose, irabisohoza\nNgaho tuyishime dufatanije.",
      },
    ],
  },
  {
    number: 57,
    name: "Umukiza wac’ ashobora Kutunezeza mw isi",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"O, sällhet stor, som...","codes":"Sgt. 436"},{"codes":"Ny. 141"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Umukiza wac’ ashobora Kutunezeza mw isi.\nAtuyobora kubw’ ubuntu, Ni w’ uduhaz’ ibyiza.\nTwizey’ ubuntu bwe, kuko na we Yemeye kutuyobora twese\nHaleluya, haleluya, Haleluya, ashimwe",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ni byiza gukund’ iyo Mana, Kuko yaducunguye\nKandi ni byiza ko mb’ uwayo, Bindinda kuzimira\nTuzahoran’ umunezero no Mu bihe byose bizahinduka\nHaleluya, haleluya, Haleluya, ashimwe",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Iyo tugeragejwe kenshi Mu mwijima w’ iyi si,\nTumenya kw ibyo byose mw isi Ar’ iby’ igihe gito\nMw ijuru nta mubabar’ uhari, Nta n’ amarira azahagera\nHaleluya, haleluya, Haleluya, ashimwe!",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Tureke kwiganyira kenshi, Kubw’ inzu n’ ibyo kurya,\nKukw ibyo byose tubihabwa Kubw’ ubuntu bw’ Imana\nAtuyobora mu nzira yose, Kand’ atwikorerer’ imitwaro\nHaleluya, haleluya, Haleluya, ashimwe",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Ubw’ ari byiza mur’ iyi si Kwizer’ Umwami Yesu.\nBizamera bite mw ijuru Tubony’ uburanga bwe.\nN’ ukuri tuzanezerwa cyane Tubony’ ubwiza bwe budashira.\nHaleluya, haleluya, Haleluya, ashimwe!",
      },
    ],
  },
  {
    number: 58,
    name: "Turi mu gihe cyiza cy’ umunsi w’ agakiza",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Nu är försoningsdagen...","codes":"Sgt. 379"},{"codes":"Ny. 138"},{"title":"Speak to my soul, Lord Jesus...","codes":"R.S. 567"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Turi mu gihe cyiza cy’ umunsi w’ agakiza.\nYesu yarangirije byose ku musaraba,\nAbantu benshi cyane basang’ uwo Mukiza.\nBahabw’ umunezero, bakizwa mu mutima.",
      },
      {
        type: "chorus",
        content:
          "Yesu, Mwana w’ intama, twese turagushima\nWadutunganirij’ ubugingo buhoraho\nKandi\nWaduhinduye kub’ intumwa z’ Imana\nNo mu mazina yose nta rihwanye n’ iryawe",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Waducunguye twese, utuvir’ amaraso\nUbuntu bwawe butumurikira nk’ izuba\nTumaze kumeny’ urukundo rw’ Imana yacu\nAmaraso ya tumenyeshej’ isezerano",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ngwino nawe mugenzi, naw’ ugishidikanya,\nIman’ irakuzuza ubuntu bwayo bwinshi\nNo mu mutima wawe harab’ umunezero\nIbyiringiro byinshi n’ urukundo rukwiye",
      },
    ],
  },
  {
    number: 59,
    name: "Dor’ urukundo rw’ Imana Rumurik’ iminsi yose",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Faderns mildhet härligt...","codes":"Sgt. 414"},{"codes":"Ny. 174"},{"title":"Brightly beams our Father's...","codes":"R.S. 455"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Dor’ urukundo rw’ Imana Rumurik’ iminsi yose.\nIcy’ ishaka nuko natwe Twab’ umucyo mur’ iyi si.",
      },
      {
        type: "chorus",
        content:
          "Umucyo wac’ umurike, imbere ya bene wacu.\nKugira ng’ umunt’ umw’ umwe\nAbon’ inzir’ itunganye.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Kandi harih’ umwijima Mw isi, wazanywe n’ ibyaha.\nHariho n’ abantu benshi bashaka kubon’ umucyo.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ube maso mwene Data, Tungany’ Itabaza ryawe.\nKiza bamwe bazimiye, Bakirish’ umucyo wawe.",
      },
    ],
  },
  {
    number: 60,
    name: "Birakomeye gusobanukirwa",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Guds underbara nåd mot mig...","codes":"Sgt. 273"},{"codes":"Ny. 48"},{"title":"I know not why...","codes":"R.S. 617"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Birakomeye gusobanukirwa\nUbuntu bw’ Iman’ Ihoraho.\nNari nuzuy’ ibyaha byinshi\nCyane ariko yarambabariye.",
      },
      {
        type: "chorus",
        content:
          "None nsigaye nz’ Imana\nNiy’ indindir’ umunani wanjye\nNzawubon’ umuns’ umwe,\nUbwo Yes’ azugaruka",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Birakomeye gusobanukirwa\nUbwinshi bw’ urukund’ agira\nNizeye gus’ ijambo rye rizima\nKandi ryampay’ umunezero",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Birakomeye gusobanukirwa\nIby’ imirimo y’ Umwuka we\nKukw ashobora kumenyesh’ umuntu\nKwizer’ Umwami Yesu Kristo",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Ntabwo nz’ iminsi yanjye nsigaranye,\nYo kuba mur’ iyi si ndimo\nHar’ ubwo nkigiriramw’ amakuba,\nNdetse n’ umubabaro mwinshi",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Urupfu niba ruzansanga mw isi,\nCyangwa se Yes’ akagaruka,\nAje guhindur’ abamwiringiye\nAzaba ahagaze mu bicu",
      },
    ],
  },
  {
    number: 61,
    name: "Kubw’ urukundo rwinshi rwa tumy’ aza kunshaka",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Han kärleksfullt mig sökte...","codes":"Sgt. 34"},{"codes":"Ny. 34"},{"title":"In tenderness He sought...","codes":"R.S. 141"},{"codes":"M.A. 71"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Kubw’ urukundo rwinshi\nRwa tumy’ aza kunshaka,\nAnshyira ku bitugu\nAnjyana mu rugo rwe.\nHaririmbw’ indirimbo nziza\nZiririmbwa na marayika.",
      },
      {
        type: "chorus",
        content:
          "Yaj’ aje kunshaka kugira ngw ankize.\nYamvanye mu musayo w’ urupfu.\nYanshyize mu rugo rwe rw’ intama.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Yesu, Mwungeri mwiza,\nYanzuye mu mutima.\nAherakw ambwir’ ati,\nMwana Wanjye nakunze.\nUko ni kw iryo jwi rye ryiza\nRyahojej’ umutima wanjye.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Nta bwo nakwibagirwa\nKo yavuy’ amaraso.\nUbwo bamwambikaga\nNa rya kamba ry’ amahwa.\nKandi ku musaraba ni ho\nNshimir’ Umwami Yesu Kristo.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Ubu nsigaye ngendera\nMu mucyo w’ ukuri.\nMfit’ amasezerano\nMur’ iyo nzira ncamo,\nNzahora nshim’ Umwami\nYesu iteka ryose nezerewe.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Ibihe birihuta\nNdindiriy’ igitondo,\nUbw’ uzampamagara\nUnyinjiza mw ijuru\nNzahagarar’ imbere yawe\nNezerewe kandi ndirimba",
      },
    ],
  },
  {
    number: 62,
    name: "Mu gihe cyo gusenga, amasengesho yacu",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Långt bortom rymden vida...","codes":"Sgt. 302"},{"codes":"Ny. 21"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Mu gihe cyo gusenga, amasengesho yacu\nAgera kure cyane, atambuka n’ inyenyeri.\nUmutima w’ umuntu ujy’ imbere y’ Imana,\nUgakomang’ urugi, Ushaka kureb’ Imana.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Nta mahoro yuzuye twabona mur’ iyi si,\nKwa Data ni ho gusa hasenderey’ amahoro.\nUmutim’ uzatuza, N’ umucy’ uzaba mwinshi,\nNiba dukurikiye inzira y’ amasengesho.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ndetse n’ umwana muto uzi guseng’ Imana,\nNta bw’ azagir’ ubwoba, azafashwa no gusenga.\nKandi ntitwibagirwe yukw' aho tujya hose,\nYuko gusenga kwacu kugera ku Mana Data!",
      },
    ],
  },
  {
    number: 63,
    name: "Mwami Yesu uranyobore, Mur’ iyi nyanj’ ariyo si",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Jesus kär, min farkost...","codes":"Sgt. 252"},{"codes":"Ny. 20"},{"title":"Jesus, Saviour, pilot me...","codes":"R.S. 330"},{"codes":"M.A. 184"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Mwami Yesu uranyobore, Mur’ iyi nyanj’ ariyo si.\nMur’ uyu muraba mwinshi Kubw’ umuyaga w’ inkubi.\nMwami Yesu Uranyobore, Ni wowe niringira.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Mwami Yesu uranyobore, Uhoz’ umutima wanjye.\nIy’ uvuz’ ijambo rimwe inyanj’ iherakw ituza.\nMwami Yesu uranyobore mpore ntsind’ ibyo bishuko.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Mwami Yesu uranyobore, Ntsindir’ ibingerageza.\nByinshi bishaka kunshuka Ndetse no kumpumy’ amaso.\nMwami Yesu uranyobore, Mpozwe n’ amahoro yawe.",
      },
    ],
  },
  {
    number: 64,
    name: "Uyu munsi mwiza w’ urwibutso",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Julen med sin glada sång...","codes":"Sgt. 306"},{"codes":"Ny. 103"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Uyu munsi mwiza w’ urwibutso\nRwo kuvuka kw’ Umukiza,\nNimwumv’ iri jambo n’ iry’ ukuri.\nYesu yaje mur’ iyi si.",
      },
      {
        type: "chorus",
        content:
          "Yemwe bantu mwese muririmbe,\nMuririmbe byumvikane!\nMut’ icyubahiro n’ icy’ Imana\nN’ amahoro mw isi.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Nta bwo mfit’ ifeza n’ izahabu\nByo kukuzanira Mwami.\nNguhay’ umutima wanjye, Yesu,\nUwutegek’ uk’ ushaka.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Muze twese, duhimbaz’ Imana\nKo yatwerets’ urukundo.\nYatwohererej’ Umucunguzi\nUmwana we Yesu Kristo.",
      },
    ],
  },
  {
    number: 65,
    name: "Yesu n’ ibyishimo byanjye",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"All min fröjd jag...","codes":"Sgt. 64"},{"codes":"Ny. 121"},{"codes":"M.A. 490"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Yesu n’ ibyishimo byanjye\nKuko yuzuy’ urukundo.\nAshobora gukomeza\nUmunyantege nke wese.\nAmp’ ubushizi bw’ amanga\nAmp’ imbaraga zikwiye.\nNaho nanyura mu rupfu,\nYesu n’ Umwungeri wanjye.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Umugozi w’ urukundo\nNi wo Yes’ ambohesheje.\nNtabwo n’ urupfu rwabasha\nKuntandukanya na Yesu,\nNemeye yukw antegeka\nNzamwumvira muri byose.\nYankijije kubw’ ubuntu\nNazinutsw’ ibyaha byose!",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Mbumbatiwe n’ Umukiza\nMu maboko y’ urukundo.\nUrwo rukundo rw’ ankunda\nSimfit’ uko naruvuga.\nNi we wampay’ imbaraga,\nZifash’ umutima wanjye.\nYes’ ubu ni w’ unyobora\nMu rugendo rwanjye rwose.",
      },
    ],
  },
  {
    number: 66,
    name: "Nageze ku Mwami Yesu",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Jag till Sions...","codes":"Sgt. 440"},{"codes":"Ny. 35"},{"codes":"M.A. 552"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Nageze ku Mwami Yesu\nNone mu mutima wanjye\nHarimw izuba ry’ ubuntu\nRimurik’ iminsi yose.",
      },
      {
        type: "chorus",
        content:
          "Umutim’ uraririmba\nYuko nabohowe rwose.\nNegerey’ Umwami Yesu\nNdirimban’ umunezero.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Umuriri w’ ubuntu bwe\nUri mu mutima wanjye.\nAgakiza ke muri jye\nNi nk’ umuraba mu mazi.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Non’ Umwami Yesu Kristo\nNamuberey’ ubuturo!\nNdetse nahaw’ Umufasha\nUmwuka w’ isezerano.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Ubw’ Umwuk’ azabazaho\nMuzaherako mumenya,\nYuko nicaranye namwe\nByavuzwe n’ Umwami Yesu.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "N’ ukuri yatugezemo\nAsigay’ aba na na twe\nNgwino wih’ Imana Yera\nYoz’ uwo mutima wawe.",
      },
      {
        type: "verse",
        number: 6,
        content:
          "Ubwo Yes’ azagaruka,\nAje mu bwiza bw’ ijuru.\nNzahindurwa nse na Yesu\nNdusheho gushim’ Imana!",
      },
    ],
  },
  {
    number: 67,
    name: "Ba bakobwa cumi biteguye Kujya gusanganira wa mukwe",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Mel. Säll är den som hoppas...","codes":"Sgt. 174"},{"codes":"Ny. 273"},{"codes":"M.A. 260"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Ba bakobwa cumi biteguye Kujya gusanganira wa mukwe\nBari bajyany’ amatara yabo, Ngw abamurikire mu mwijima.\nAbatanu bar’ abanyabwenge, Bujuj’ amavuta mu mperezo,\nNahw abandi batanu b’ abapfu mu mperezo zabo hari humye.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Hanyuma yah’ umukw’ aratinda Nuko bose barahunikira.\nBigeze mu gihe cy’ igicuku, Habah’ urusaku bat’ araje!\nBumv’ irindi jwi rivuga riti: Mwihute kumusanganira.\nBa bakobwa bose bitegura Gutunganya ya matara yabo.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ba bapfu batangira kuvuga bati Kw amatara yac’ ataka!\nBati: Nyamuneka, nshuti zacu, Nimuduhe ku mavuta yanyu.\nNa bo bati: Ntabwo yadukwira, Nimugende mujye kwigurira.\nBafat’ inzir’ ubwo baragenda Bajya gushak’ aho bagurira.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Uwo mwanya bamaze kuv’ aho, Umukw’ aherakw arasohora.\nBa bakobwa bar’ abanyabwenge Binjirana n’ umukwe mu bukwe.\nBa bapfu baza bavuga bati: Data-buja we, dukingurire.\nArabasubiz’ ati: Simbazi. aherakw arabakingirana.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Nta bwo tuz’ umunsi cyangw’ igihe, Tube maso n’ amatara yacu.\nYes' ashobora kutwuzuriza. Amavuta mu mitima yacu.\nMwene Data, wumv’ izi nyigisho Zituruka k’ Umukiza wacu.\nUkwiriye kwitegura kumusanganir’ ubw’ agaruka.",
      },
    ],
  },
  {
    number: 68,
    name: "Nta bwo nkwiye kujya niganyira",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Blott en dag...","codes":"Sgt. 350"},{"codes":"Ny. 46"},{"codes":"M.A. 90"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Nta bwo nkwiye kujya niganyira,\nNibaz’ ukw ejo nzaba merewe.\nNzajya nibuka yukw Ihoraho\nImeny’ ibyo byos’ uko bingana.\nIfit’ umutima w’ urukundo\nKukw ijy’ intungish’ ibinkwiriye.\nUmunezero n’ umubabaro\nByos’ abi nzaniramw amahoro.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Amba hafi ndetse buri munsi,\nKand’ angerer’ ubuntu bukwiye.\nAjy’ anyikorerer’ imitwaro\nNi we Data kandi ni we Mana!\nNguk’ ukw ajy’ antunga buri munsi,\nAjy’ andamira mur’ ibyo byose.\nBuri muns’ azajy’ amp’ imbaraga\nIryo n’ isezerano yampaye.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Mana yanjye, komez’ ujy’ umfasba\nNgutaramire ntez’ icy’ umbwira\nMpore nizey’ ijambo wambwiye\nSinkabure ku mbaraga zawe.\nNo mu bikomeye birih’ ubu\nUndamburir’ amaboko yawe\nUmp’imbaraga ku buntu bwawe\nKugez’ igih’ uzaza kunjyana",
      },
    ],
  },
  {
    number: 69,
    name: "Igihugu cyiza kiradutegereje mw ijuru",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Oss ett härligt rike...","codes":"Sgt. 53"},{"codes":"Ny. 95"},{"codes":"M.A. 185"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Igihugu cyiza kiradutegereje mw ijuru,\nKizicarwamo n’ abatowe na Yesu.\nKand’ iminsi turimo nayo nikw ihita ningoga\nUwihangany’ azaragw’ icyo gihugu.",
      },
      {
        type: "chorus",
        content:
          "Dor’ ubwami bw’ Imana buregereje!\nDor’ ubwami bw’ Imana buregereje!\nMutima wanjye ba maso,\nUtungan’ iminsi yose,\nDor’ ubwami bw’ Imana buregereje!",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Twizeye rwose kuzabon’ icyo gihug’ uko kiri,\nDutegereje gus’ uwaducunguye.\nIbimenyetso bitwereka kw agiye kugaruka,\nBitwereka ko wa munsi wegereje.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Kand’ ibyanditswe na byo bivuga ko Yes’ aza vuba.\nKand’ ubw’ azagaragarira mu bicu.\nHaleluya, haleluya.\nAzaboha wa mugome.\nUmwe wagerageje kuturimbura.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Kand’ abantu benshi barananiwe kutegereza,\nUbakanguze vuba bya bimenyetso.\nKukw ijambo ry’ Imana\nRishaka gusohora vuba.\nN’ ukuri tubona ko Yes’ aza vuba.",
      },
    ],
  },
  {
    number: 70,
    name: "Reka gutiny’ ibizakubaho Iman’ izakurinda",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Var ej bekymrad...","codes":"Sgt. 277"},{"codes":"Ny. 54"},{"codes":"M.A. 670"},{"title":"Be not dismayed...","codes":"R.H. 458"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Reka gutiny’ ibizakubaho Iman’ izakurinda! Reb’ ubushake bw’ Imana gusa Iman’ irakurinda.",
      },
      {
        type: "chorus",
        content:
          "Iman’ irakurinda Iminsi yose mu nzir' ucamo. Iraguhaz' amahoro, Iman' irakurinda.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Nubw’ uwo mutwar’ uremereye, Iman' irakurinda. N' ibyago biri mu nzir' ucamo, Iman' irakurinda.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Iman’ imeny’ ubukene bwawe, Iman’ irakurinda Uyimenyesh’ ibikubabaje, Iman’ irakurinda.",
      },
       {
        type: "verse",
        number: 4,
        content:
          "Kand' ubw' uzaca mu bikomeye, Iman' izakurinda. Komez' ubane n' Imana gusa, Iman'irakurinda.",
      },
    ],
  },
  {
    number: 71,
    name: "Muri Betesida marayik’ agezemo",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Betesda är öppet..."},{"title":"Bethesda ni wazi..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Muri Betesida marayik’ agezemo\nUmukiza na w’ arahari.\nNiwinjire mu mazi yihinduriza,\nBetesid’ iri hano none!",
      },
      {
        type: "chorus",
        content:
          "Agakiza kacu, agakiza kacu.\nKateguwe na Yesu Kristo.\nNiwinjire mu mazi yihinduriza.\nBetesid’ iri hano none.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Niwumv’ ijwi rya marayik’ ugezemo,\nRisab’ unyunyutse kwizera!\nUrakizwa na Yesu Mukiza mwiza,\nUrakira ndetse no kwezwa.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ubw’ udashoboye gukora ku nshunda\nUmukiza ntakuyobewe.\nIjambo ry’ Imana ni ryo rigukiza,\nHaguruk’ ubashe kugenda.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Betesida ni nk’ amaraso ya Yesu,\nMarayika n’ Ijambo n’ Umwuka.\nInjira mu ruzi ruv’ i Gologota,\nUhabw’ agakiza k’ Imana.",
      },
    ],
  },
  {
    number: 72,
    name: "Iman’ iri hamwe natwe",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Gud är här för att välsigna...","codes":"Sgt. 328"},{"codes":"Ny. 18"},{"title":"God is here and that...","codes":"R.S. 6"},{"codes":"M.A. 250"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Iman’ iri hamwe natwe\nKugira ngw idukomeze.\nIjuru rifit’ ibihu\nByo kutuzanir’ imvura.",
      },
      {
        type: "chorus",
        content:
          "Utwumvire, Mana yacu,\nDuh’ umugish’ uyu munsi.\nTuragutegerej’ ubu\nTuvubir’ imvura yawe.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Iman’ iri hamwe natwe\nHano hahinduts’ ahera.\nTwese turategereje\nKuzuzwi imbaraga zawe.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Iman’ iri hamwe natwe\nTurasaban’ ukwizera.\nMana can’ uwo muriro\nMu mitima yacu twese.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Ugurur’ ijuru, Mana,\nUduh’ imbaraga zawe.\nDuh’ umugish’ uyu mwanya\nKubw’ ubuntu bwawe, Mana.",
      },
    ],
  },
  {
    number: 73,
    name: "Nshut’ iby’ ushidikanyamo",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Alla tvivel bär till Jesus...","codes":"Sgt. 78"},{"codes":"Ny. 154"},{"title":"All my doubts I give to Jesus...","codes":"R.S. 282"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Nshut’ iby’ ushidikanyamo\nUbishyir’ Umwami Yesu.\nUwizer’ Umwami Yesu\nNta bw’ azakorwa n’ isoni.",
      },
      {
        type: "chorus",
        content:
          "Ndakwizeye, ndakwizeye,\nNdakwizeye, Mwami Yesu.\nNdakwizeye, ndakwizeye,\nNizey’ iryo jambo ryawe.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Wihan’ ibyo byaha byawe,\nWezwe no mu maraso ye.\nKand’ arakwambik’ ukuri\nKugez’ ubw’ azakujyana.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Imiruho yawe yose,\nUyerek’ Umwami Yesu.\nNaho waca mu gicucu\nNta bwo Yesu yakureka.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Kand’ umunezero wawe\nUmenyekane kwa Yesu.\nNi we Mwami muri byose\nNiw’ uzaguh’ umugisha.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Wiyegurir’ Umukiza,\nMuh’ ubwenge n’ umutima,\nKukw ashaka gutunganya\nUbugingo bwawe bwose.",
      },
    ],
  },
  {
    number: 74,
    name: "Harihw igihugu cyiza cyane",
    url: "https://indirimbo.rw/song/agakiza/1",
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Harihw igihugu cyiza cyane\nGituwemo n’ abanezerewe,\nNta bwo batinya bomb’ atomike.\nBaririmb’ indirimbo z’ ishimwe.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ibyaho byose ni byiza cyane.\nHar’ uburuhukiro bw’ ukuri\nNta magamb’ atey’ ison’ abayo,\nNta n’ imfubyi zihakubitirwa.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Icyo gihugu si nk’ icyo mw isi\nKukw ibyaho byose bitunganye.\nBene Dat’ icyo nifuza n’ iki:\nKuzababonayo muririmba.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Mbese ni kiguzi kidutanga\nKwinjira mur’ uwo murwa mwiza.\nNta kiguzi na kimwe twatanga,\nYesu yishyuriy’ i Gologota.",
      },
    ],
  },
  {
    number: 75,
    name: "Umv’ iri jambo n’ iryo kwizerwa",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Det är ett fast ord...","codes":"Sgt. 27"},{"codes":"Ny. 193"},{"codes":"M.A. 193"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Umv’ iri jambo n’ iryo kwizerwa\nN’ iryo kwemerwa n’ abantu bose.\nYuko twahaw’ Umukiza Yesu.\nYaje gukiza abanyabyaha.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Nar’ uwa mbere mu banyabyaha,\nAriko nsigaye nezerewe.\nUmukiza wanjye, Yesu Kristo,\nYanyogesheje ya maraso ye.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Yesu Mukiz’ ari hamwe natwe,\nAkor’ imirimo nk’ ukw ashaka.\nAcan’ umuriro we muri twe.\nNi nde wabasha kumuzitira?",
      },
      {
        type: "verse",
        number: 4,
        content:
          "N’ ibipfamatwi bibasha kumva,\nNdetse n’ ibimuga bikagenda\nN’ abanyabibembe barakizwa.\nUbutumwa bwe buramamazwa.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Mwami Yesu, duh’ Umwuka Wera\nUmuduhuhireh’ uyu munsi,\nSayur’ abarohamye mu byaha,\nUbamurikire bagaruke.",
      },
      {
        type: "verse",
        number: 6,
        content:
          "Ugurur’ ijur’ ugush’ imvura,\nAhumagaye nko mu butayu.\nUhahindure kub’ ahatoshye\nHavuz’ impundu z’ umunezero.",
      },
      {
        type: "verse",
        number: 7,
        content:
          "N’ abapagani bakunamire\nBagupfukamire bakuramye,\nUkwiy’ ishimwe ku bantu bose\nN’ icyubahiro, Haleluya!",
      },
    ],
  },
  {
    number: 76,
    name: "Yemwe mwa bushyo bw’ Imana",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Mel: Där en fälnad ros skall...","codes":"Ny. 263"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Yemwe mwa bushyo bw’ Imana\nMwihangan’ ibihe bito.\nMuri wa murw’ uhoraho\nMuzabonay’ Ibyishimo.\n/: Hasigay’ igihe gito,\nIntambar’ ikazashira. :/",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ntukarogwe mur’ iyi si\nNtukarek’ Imana yawe.\nMu makuba no mu byago\nKurikir’ Umwami Yesu.\n/: Buri munsi, buri munsi\nAguha kunesha byose. :/",
      },
      {
        type: "verse",
        number: 3,
        content:
          "N’ unanirwa mu rugendo\nInzir’ imaze kuramba.\nNo mu makuba y’ iyi si\nIman’ izakuruhura.\n/: Hazabah’ umunezero\nWo kunezez’ umugenzi. :/",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Ni twizera tuzabona\nCya gihugu cyo mw ijuru.\nKand’ iyo n’ inkuru nziza\nNta bizatugerageza.\n/: Turi hafi, turi hafi\nYo guhurira mw ijuru. :/",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Ni dutumirwa n’ urupfu\nTuzimukan’ ibyishimo.\nIbyo twiringiye byose\nTuzabibona mw ijuru.\n/: Hazab’ amahoro menshi\nN’ umunezer’ uhoraho. :/",
      },
    ],
  },
  {
    number: 77,
    name: "Murebe urukundo rukomeye cyane",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Fahamuni ni pendo la namna gani..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Murebe urukundo rukomeye cyane\nTwahawe n’Imana ihoraho,\nTwahinduw’abana b’Iman’ Ihoraho.\nDukwiye kubana amahoro.",
      },
      {
        type: "chorus",
        content:
          "Tuzanezerwa cyane mw’ijuru\nTuzaririmbana n’abera.\nTuzambikw’ikuzo\nMur’urwo rukundo.\nNta marir’azaba mw’ijuru.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Utugirir’ubuntu\nMan’Ihoraho\nMu rugendo rwacu dufite.\nUtwoherereze umugisha Mukiza,\nTubashe kukumenya Mana.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Sinshaka gukorera abami babiri,\nNiko gukund’isi n’ijuru.\nHarih’abakunda ubutunzi bwo mw’isi\nBakaburutisha ubw’ijuru.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Harihw’abahamya b’urupfu rwa Yesu,\nNibo barungurutse mu mva Yesu\nUbwo yamaraga kuzuka mu mva\nHanyuma yagiye mw’ijuru",
      },
      {
        type: "verse",
        number: 5,
        content:
          "No mu gihe tugendera mur’iyi si,\nTuyibonamo ibidushuka.\nAriko dukwiye kunesha ibyo byose\nKuko arikw’Imana ibishaka!",
      },
    ],
  },
  {
    number: 78,
    name: "Uhamagarwa na Yesu kenshi",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Ännu en gång Jesus går fram..."},{"title":"Mara kwa mara Yesu aita..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Uhamagarwa na Yesu kenshi,\nUmwitab’ uyu munsi.\nHar’ ubw’ iri jwi wumv’ uyu munsi.\nRyab’ ari ryo rya nyuma.",
      },
      {
        type: "chorus",
        content:
          "Yew’ ugendera mu byaha\nYesu aragushaka!\nNgw akubabarir’ ibyaha.\nNgwin’ umusange vuba!",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Umudendezo wo mur’ iyi si\nNta bw’ uguh’ amahoro,\nKand’ ibikorwa by’ abanyabyaha\nByose biragushuka.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Mu gih’ utazi nih’ umwijima\nW’ urupf’ ukugeraho.\nMugenzi wanjye nkugir’ inama\nNgwino witabe Yesu.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Yes’ azi yuko ufit’ imvune\nY’ ibyaha mu mutima.\nUk’ uri kose arakwakira,\nNdetse no kugukiza.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Uhor’ uhamagarwa na Yesu,\nKuki s’ utamwitaba?\nNib’ ukomeje kumwim’ amatwi\nUzarimbuka rwose.",
      },
    ],
  },
  {
    number: 79,
    name: "Kubw’ Umwami Yesu",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Kwa sifa ya Yesu..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Kubw’ Umwami Yesu,\nTuranezerewe.\nKubw’ ubuntu bw’ Umwuremyi\nDuhaw’ uyu munsi.",
      },
      {
        type: "chorus",
        content:
          "Mwami Yesu shimwa!\nMwami Yesu shimwa!\nMwami turagushimira\nWuzuy’ urukundo.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Wavuye mw ijuru,\nUza mur’ iyi si.\nWaratuvukiye Mwami\nMu nda ya Mariya.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Wahinduts’ umuntu,\nArik’ ur’ Imana.\nWavukiye mu nzu y’ inka\nN’ igitangaza pe!",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Na ba marayika\nBaranezerewe\nKuk’ Umwan’ atuvukiye\nAje mu mbaraga.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Na ba banyabwenge\nBabony’ inyenyeri,\nNi yo yabamenyesheje\nYuk’ Umwam’ avutse.",
      },
      {
        type: "verse",
        number: 6,
        content:
          "Herode yashatse\nKwic’ Umwana Yesu.\nArikw Iman’ ihoraho\nYarinz’ uwo Mwana.",
      },
      {
        type: "verse",
        number: 7,
        content:
          "Mwami wacu, Yesu,\nUfit’ ububasha,\nKuko watsinze n’ urupfu\nUrw’ ari rwo rwose.",
      },
      {
        type: "verse",
        number: 8,
        content:
          "Mwami wacu, Yesu,\nNatw’ uraturinde.\nNi wowe rukundo koko\nUtwifashirize.",
      },
      {
        type: "verse",
        number: 9,
        content:
          "Shimwa Yesu Kristo,\nKo waje muri twe.\nWatubabariy’ ibyaha\nUtumar’ ubwoba.",
      },
      {
        type: "verse",
        number: 10,
        content:
          "Shimwa Mana yacu,\nWohereje Yesu.\nKuvukira mur’ iyi si\nAdukiz’ ibyaha.",
      },
    ],
  },
  {
    number: 80,
    name: "Nifuza kuzagera muri wa murwa, Wo mw ijuru mwiza cyane",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Natamani kufika kwa mji wa jul..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Nifuza kuzagera muri wa murwa, Wo mw ijuru mwiza cyane\nAriko se ko ntaz’ inzir’ ingezayo, Ni nd’ ubasha kuyinyereka.\n/: Ngwino vuba, ngwino vuba! Umukiz’ arakwerek’ inzira. :/",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ubwo najyaga ngendagend’ uko nshaka Nih’ umucyo wantunguye.\nUwo mucyo waramurikaga cyane Uturuka ku musaraba.\n/: Natunguwe n’ uwo mucyo, Uwo mucyo wangezemo rwose.: /",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Kand’ ijwi ryaturutse mur’ uwo mucyo, Riti: Niwambur’ inkweto\nKuko han’ ugeze hahinduts’ ahera Kand’ Imana nay’ ar’ iyera\n/: None nsigaye nyoborwa Neza rwose n’ iyo Mana yera.: /",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Habab’ umunezero mwinshi mw ijuru Umunyabyaha yihannye\nNone Yesu naw’ aragutegereje Kugira ngo wezwe mw iriba\n/: Ngwino wezwe, ngwino wezwe, Amaraso y’ arakweza rwose.: /",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Kandi mumenye ko azagaruka vuba. Azab’ aje nk’ umujura\nNyir’ inz’ iy’ ameny’ igih’ umujur’ aza Yaba maso kugez’ ubw’ atibwa\n/: Mube maso, mube maso, Kuko mutaz’ umunsi n’ igihe.: /",
      },
      {
        type: "verse",
        number: 6,
        content:
          "Kandi mumenye ko ngiye kuza vuba\nNzaba nzanywe no guhemba Ibikwiranye n’ umurimo w’ umuntu\n/: Nimukomez’ icyo mwahawe. Kor’ ibyiza, kugira ngo Uzahembw’ ibikwiranye na byo.: /",
      },
      {
        type: "verse",
        number: 7,
        content:
          "Najyanywe no kubategurir’ ahanyu, Kugira ngo muzabeho.\nHariy’ ibyicaro byinshi kandi byiza Mukwiriye kuzabyicaramo.\n/: Nimusenge cyane cyane Kugira ngo mutazaburayo.: /",
      },
    ],
  },
  {
    number: 81,
    name: "Nkunda kumv’ amakuru y’ umurwa",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Jag har hört om en stad ovan molnen..."},{"title":"Nasikia habari ya mji..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Nkunda kumv’ amakuru y’ umurwa\nUri kur’ ahateger’ ibyago,\nKand’ umucyo n’ Umwana w’ intama\nUmuns’ umwe nzawinjiramo.\nHaleluya, ni ko mvuz’ impundu!\nHaleluya, nzinjira mu murwa!\nHaleluya, ndi hafi kujyamo.\nUmuns’ umwe nzawinjiramo.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Nta marir’ aba mur’ uwo murwa,\nNta muruh’ ubayo n’ intambara.\nNta n’ indwar’ ishobora kubayo.\nUmuns’ umwe nzawinjiramo.\nHaleluya, nuzuy’ ibyishimo.\nHaleluya, nzinjira mu murwa.\nHaleluya, ndi hafi kujyayo.\nUmuns’ umwe nzawinjiramo.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Abazajya mur’ icyo gihugu\nBazaba bambay’ imyenda yera.\nBabikiw’ ikamba ry’ izahabu.\nUmuns’ umwe nzakigeramo.\nHaleluya, nta gushidikanya.\nMw ijuru hariy’ umunezero.\nNta bw’ umubabar’ uba mw ijuru.\nNiringiye kuzinjiramo!",
      },
    ],
  },
  {
    number: 82,
    name: "Tuzajyanwa kuri wa munsi",
    url: "https://indirimbo.rw/song/agakiza/1",
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Tuzajyanwa kuri wa munsi\nUbw’ impand’ izab’ ivuze.\nTuzateranir’ imbere ye,\nDushimir’ Umwami Yesu.\nHazamanuka ba marayika\nBazaza kurimbur’ abantu,\nAbanze kwakir’ Umukiza,\nBakamurutish’ iby’ iyi si.",
      },
      {
        type: "chorus",
        content:
          "Hazabaho kurira gusa\nNdetse no guhekeny’ amenyo.\nIgihe cyo kwizera Yesu\nKizaba gishize rwose!",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Abafit’ abagore benshi\nIcyo gihe bazahanwa,\nAbarozi n’ abashikisha\nNdetse n’ abapfumu bose,\nBazakorwa n’ isoni rwose\nImbere y’ Umukiza Yesu.\nBazashak’ aho bahungira\nNyamara ntibazahabona.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Abatunz’ iby’ iyi si gusa\nBazashyirwa mu rubanza.\nUbutunzi bwabo bw’ iyi si\nBuzahinduk’ umurama.\nNta cyo bazabasha kubona\nCyabakiz’ ibyaha bakoze.\nBazafatwa kur’ uwo munsi\nBatabwe muri wa muriro.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Natwe Bakristo ba Mesia\nNta teka tuzacirwaho\nTuzaba tujyanywe mw ijuru,\nTuzasangira na Yesu\nAzatwambik’ imyenda yera\nN’ ingofero nziza cyane\nInkota z’ abamarayika\nZizirukan’ abanyabyaha",
      },
    ],
  },
  {
    number: 83,
    name: "Amaraso yawe, Mukiza",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Jesus, du som blodet har gjutit...","codes":"Sgt. 447"},{"title":"Whiter than the snow...","codes":"R.H. 366"},{"codes":"M.A. 75"},{"codes":"Ny. 10"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Amaraso yawe, Mukiza,\nNi yo yoz’ ibyaha twakoze.\nYaviriye ku musaraba\nUbwo wapfaga Mwami Yesu,\nNar’ uwo gucirwahw iteka\nKuko ntari mbashije kwizera.\nMwami nyogesh’ ayo maraso,\nKugira ngo ntunganir’ Imana.",
      },
      {
        type: "chorus",
        content:
          "Nye. . . za nk’ urubura.\nNye. . . za nk’ urubura.\nNyogesh’ amaraso wavuye\nKugira ngo ntunganir’ Imana.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Yes’ ubwo wambikwag’ amahwa,\nBakujyana ku musaraba.\nWihanganiy’ imibabaro\nUbwo wakubitwag’ inguma.\nIryo riba ni ryo nkeneye,\nNi ryo gusa ribasha kunyeza.\nMwami nyogesh’ ayo maraso\nKugira ngo ntunganir’ Imana.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Nta bwo ngutunganiye, Mwami,\nMfit’ intege nke mu mutima.\nNdakubona nt’ ese Mukiza\nNanjye ngo mbabarirw’ ibyaha?\nKu musaraba wawe Yesu,\nNizeye kw ari ho na kirira,\nMwami nyogesh’ ayo maraso\nKugira ngo ntunganir’ Imana.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Mwami, ndaje mbe hafi yawe\nKugira ng’ ujy’ uhor’ undinda.\nUmbohore buri mugozi,\nUntunganiriz’ umutima.\nNeger’ umusaraba wawe,\nMpore muri wo kugeza gupfa\nMwami nyogesh’ ayo maraso\nKugira ngo ntunganir’ Imana.",
      },
    ],
  },
  {
    number: 84,
    name: "Mbes’ aho wamenye rya zina ryiza",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Säg, känner du det...","codes":"Sgt. 90"},{"codes":"Ny. 299"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Mbes’ aho wamenye rya zina ryiza\nRy’ Umukiza wacu Yesu?\nRiraririmbwa mur’ iyi si yose,\nRivugwa mu bantu bose.",
      },
      {
        type: "chorus",
        content:
          "Yesu ni we zina rihebuje,\nRirut’ ayandi yose mw isi.\nRifit’ imbaraga zo kudufasha,\nRidukiz’ ibyaha byose.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ni ryo rihoz’ umutim’ ubabaye\nRiratunezeza rwose.\nMu mubabaro no mu byago byinshi\nRibasha no kuturinda.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ndetse no mu mwijima mur’ iyi si\nRimurika nk’ inyenyeri.\nRimp’ amahoro, rimpa n’ ubutwari\nNdetse no kugeza gupfa.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Amazina yos’ aribagirana\nKerets’ izina rya Yesu.\nRizahora rimurika mw ijuru.\nYesu ni we zina ryiza.",
      },
    ],
  },
  {
    number: 85,
    name: "Urukundo rw’ Umukiza",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Som en härlig gudomskälla...","codes":"Sgt. 423"},{"codes":"Ny. 144"},{"codes":"M.A. 558"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Urukundo rw’ Umukiza\nNi nk’ amazi menshi cyane.\nAmeze nk’ isoko nziza\nIdudubiza muri we.",
      },
      {
        type: "chorus",
        content:
          "Yesu ni we wuguruye\nRwa rurembo rwo mw ijuru,\nKugira ngo ndwinjiremo\nKubw’ ubuntu bwinsh’ agira.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Nababay’ iminsi myinshi,\nNasaga n’ inyon’ ihigwa.\nNatakiy’ Umwami Yesu\nNa we ntiyanyirukanye.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Mwiyumvir’ igitangaza,\nYanyogej’ ibyaha byose,\nKuber’ ubwo bunt’ agira\nNdirimban’ umunezero.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Mu gitondo cy’ agakiza\nNzagera mur’ iryo rembo.\nKuber’ urukund’ afite\nNzinjira mur’ uwo murwa.",
      },
    ],
  },
  {
    number: 86,
    name: "Uduh’ Umwuka wawe, Mana Yera",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Låt Anden falle over oss som...","codes":"M.A. 239"},{"codes":"Ny. 294"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Uduh’ Umwuka wawe, Mana Yera,\nNk’ uko wawohererej’ abakera\n/: Ucan’ umuriro wawe muri twe\nNtidukomeze kub’ abazuyazi.: /",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Uduh’ Umwuka wawe, Mana Yera,\nNk’ uko wabigenje kuri wa munsi\n/: Intumwa Peter’ ubwo yigishaga,\nYigishiriza mu nzu ya Kornelio. :/",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Uduh’ Umwuka wawe, Mana Yera,\nUduhe Pentekote yacu none!\n/: Abanyabyah’ ibihumbi bakizwe\nIjambo ryawe ribashe kogera. :/",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Uduh’ Umwuka wawe, Mana Yera,\nUturamburir’ amaboko yawe.\n/: Ukor’ ibitangaza byawe, Mana,\nNdets’ abarwayinabo ubakize. :/",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Abasinziriy’ urabakangure\nCyane cyan’ abarushye mu rugendo.\n/: Mwami, dusange nko kuri wa munsi\nUbwo wuzuzag’ abigishwa bawe. :/",
      },
    ],
  },
  {
    number: 87,
    name: "Umugisha w’ Imana ni wo nkeneye rwose",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Jag törstar och jag längtar...","codes":"Sgt. 186"},{"codes":"Ny. 150"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Umugisha w’ Imana ni wo nkeneye rwose\nNdashaka kubatizwa muri wa Mwuka Wera.\nNejejwe mu mutima n’ amasezerano ye\nYaransezeranije kump’ uwo Mwuka Wera.",
      },
      {
        type: "chorus",
        content:
          "Umugish’ atanga, umugish’ atanga,\nUva mu buntu bwe ni nk’ amazi menshi.\nArawunyuzuz’ ubu, abasha no kunkiza,\nNiyubahwe rwose n’ Umukiza wanjye.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Itorero ry’ Imana n’ iryo guhabw’ imvura,\nIsoko y’ umugisha dor’ iradudubiza.\nTwishimir’ ubugingo\nTwahawe n’ Ihoraho\nHaleluya, dushime, dushimir’ Umukiza!",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ibicu by’ agakiza bitugezeho rwose.\nUtwuzurize Man’ imitima yacu twese.\nAbera bawe bose bahore bezwa nawe.\nHaleluya, dushime, dushimir’ Umukiza!",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Ibicu by’ agakiza bitugezeho rwose\nTuragusaba, Mana, ubyohereze mw isi.\nIbihumbi by’ abantu bihabw’ ako gakiza.\nHaleluya, dushime, dushimir’ Umukiza!",
      },
    ],
  },
  {
    number: 88,
    name: "Hazabahw igihe cy’ imperuka",
    url: "https://indirimbo.rw/song/agakiza/1",
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Hazabahw igihe cy’ imperuka\nUrubanza rucibwe na Yesu.\nAzarucir’ abaremwe bose\nKuko bazaba bar’ imbere ye.\nNibw’ azaherakw abarobanura\nNk’ umwungeri mu ntama n’ ihene:\nIntama niz’ azashyir’ iburyo bwe,\nIbumos’ azaha shyir’ ihene.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Maze Yes’ azabwir’ ab’ iburyo ati:\nNimuz' mwahaw' umugisha.\nDor’ ubwami mwahamagariwe.\nUhereye ku kuremwa kw’ isi.\nUwo muns’ azabashimira cyane.\nBazarabagirana nk’ izuba.\nAzabamurikir’ Imana Data.\nHazabah’ umunezero mwinshi.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Azabwira abo b’ ibury’ ati:\nNari nshonje muramfungurira.\nMwaranshumbikiye nd’ umushyitsi.\nMwaranyambitse nambay’ ubusa.\nNa bo bati: Ryari war’ umushyitsi,\nCyangwa ryari twakubony’ ushonje,\nRyari twakubonye wambay’ ubusa.\nTugukorer’ ibyo byos’ uvuze?",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Azabwira ab’ ibumoso bwe ati:\nMuv’ aho ndi mwabivume,\nNimugende mujye mu muriro\nWa Satani hamwe n’ ingabo ze.\nNtimwamfunguriy’ ubwo nari nshonje.\nMfit’ inyota ntimwampay’ amazi.\nNar’ umushyitsi ntimwanshumbikira\nNtimwansuye ubwo nari ndwaye.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Nuko bazabwir’ Umwami Yesu bati:\nRyari twakubony’ ushonje?\nRyari twakubony’ ufit’ inyota?\nRyari twakubony’ ur’ umushyitsi?\nRyari twakubony’ urwaye, Mukiza?\nRyari twakubonyehw ibyo byose?\nIbyo byos’ uvuze ntitwabibonye\nNgo tubure kukwerek’ ineza.",
      },
      {
        type: "verse",
        number: 6,
        content:
          "Nuko Yes’ azabwir’ ab’ iburyo,\nNdets’ abwire n’ ab’ ibumoso bwe ati:\nByose mwakorey’ abato\nBurya nijye mwabikoreraga.\nBose bazibuka ibyo bakoraga.\nHazarira abo b’ ibumoso.\nAb’ iburyo bazajyanwa mw ijuru\nBazahora banezerw’ iteka.",
      },
    ],
  },
  {
    number: 89,
    name: "Icyubahiro n’ icyawe, Yesu",
    url: "https://indirimbo.rw/song/agakiza/1",
    body: [
      {
        type: "verse",
        number: 1,
        content: "/: Icyubahiro n’ icyawe, Yesu,\nNi ko ndirimbir’ Imana. :/",
      },
      {
        type: "chorus",
        content: "/: Shimwa. . . ur’ uwo gushimwa,\nYesu. :/",
      },
      {
        type: "verse",
        number: 2,
        content: "/: Gusenga kwanjye kukugereho,\nMan’ ur’ amahoro yanjye. :/",
      },
      {
        type: "verse",
        number: 3,
        content: "/: Sinsaba mvugavuga nk’ inyoni,\nIsakuriza mw ishyamba. :/",
      },
      {
        type: "verse",
        number: 4,
        content: "/: Umutima wanjy’ urakangutse\nKuririmbir’ Ihoraho. :/",
      },
      {
        type: "verse",
        number: 5,
        content: "/: Abagir’ umwete wo gusenga,\nNi bo banesha Satani. :/",
      },
      {
        type: "verse",
        number: 6,
        content: "/: Abera bose muhaguruke,\nTuririmbir’ Umukiza. :/",
      },
      {
        type: "verse",
        number: 7,
        content:
          "/: Tubabajwe n’ ababyeyi bacu\nBagikorera Satani.: /\nYesu. . . washobora kubakiza.: /",
      },
    ],
  },
  {
    number: 90,
    name: "Ai Mana y’ ukuri",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Mel. Det bästa är för barnen...","codes":"S.Sgt. 178"},{"codes":"Ny. 275"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Ai Mana y’ ukuri,\nKomeza kunyobora,\nUranshishe mu nzira yo gukor’ iby’ ushaka.\nMwami kubaho ntagufite\nBinter’ ubwoba n’ amaganya\nNdetse byabasha kungeza no mu rupfu vuba.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ibyiza mbona n’ ibi:\nKwizer’ Umwami Yesu.\nNo guhora ngendera mu nzira ye ntunganye.\nNawe yemeye kujy’ andinda,\nNdetse no ku nyobora neza.\nAmpesha no kwinjira vuba mu mahoro ye.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ub’ urugendo mfite\nN’ urwo kujya mw’ ijuru.\nUmukiza niy’ ari nanjye nkwiye kujyayo.\nKand’ umunsi nzaba ngezeyo\nNzamuhimbazany’ ibyishimo\nNzanezezwa nuko ari we wanguz’ amaraso.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Mur’ iyi si huzuy’ umuruho n’ amahane\nIcyo nkeneye cyose simperako nkibona.\nAriko ku munsi mukuru\nUbwo nzabon’ Umucunguzi\nNiringiye kuzabon’ ingororano yanjye.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Mw’ ijuru sinzabona\nAbanzi banjy’ ukundi,\nNta n’ icyo nzahabura mw ‘ ijuru ry’ amahoro.\nNzashim’ Imana mvuz’ impundu\nNti: Haleluya, haleluya!\nNzarambur’ amaboko mpimbaz’ Umwami Yesu.",
      },
    ],
  },
  {
    number: 91,
    name: "Namaze kumeny’ ibyiza byinshi",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Jag har hört om Herren Jesus...","codes":"Sgt. 82"},{"title":"Have you ever heard...","codes":"R.S. 442"},{"codes":"Ny. 283"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Namaze kumeny’ ibyiza byinshi\nYesu yakoraga mu gihe yagenderaga mur’ iyi si.\nAho yageraga hose ni ko yajyag’ abafasha\nNejejwe no kuririmba Yuko Yes’ adahinduka.",
      },
      {
        type: "chorus",
        content:
          "Yesu Krist’ uko yar’ ari ni kw ahor’ iminsi yose.\nArashak’ abazimiye ndets’ akiza n ‘ abagome\nUwo Mukiza ntahinduka.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Kandi hariho n’ impumyi Yitwa ga Barutimayo.\nImaze kumenya ko Yes’ ari hafi\nYinginga Yesu yizeye, nukw ikizwa kubw’ ubuntu.\nNejejwe no kuririmba yuko Yes’ adahinduka.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Yes’ ahamagar’ abanyabyaha ndetse n’ abarwayi\nBos’ abahamagarira kubakiza\nNaw’ ukore ku nshunda ze Urahabw’ imbaraga nshya.\nUgire nka wa mugore Kuko Yes’ adahinduka.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Namaze kumenya yuko Yasabirag’ abanzi be.\nCyane cyan’ ubwo yari ku musaraba\nN’ ukuri yarababajwe Ubwo yambikwag’ amahwa.\nNejejwe no kuririmba yuko Yes’ adahinduka.",
      },
    ],
  },
  {
    number: 92,
    name: "Mw ijuru ni heza cyane Kuko hatabamo ibyaha",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Mel. Få vi alla en gång...","codes":"Sgt. 603"},{"codes":"Ny. 69"},{"title":"Shall we meet beyond...","codes":"M.A. 666"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Mw ijuru ni heza cyane Kuko hatabamo ibyaha,\nN’ ukuri ni heza cyane Ni Yesu wahateguye.",
      },
      {
        type: "chorus",
        content:
          "Dushimire Yesu Kristo, Kuko yaduteguriye\nIbyicaro byiza cyane Mw ijuru ku Mana Data.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Mw ijuru ni heza cyane Nta musinz’ uzahagera.\nN’ ukuri ni heza cyane Nta mujur’ uzahagera.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Mw ijuru ni heza cyane Nta muroz’ uzahagera.\nN’ ukuri ni heza cyane Nta mwicany’ uzahagera.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Mw ijuru ni heza cyane Ntihazajy’ abahehesi.\nN’ ukuri ni heza cyane, Nta mugom’ uzahagera.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Mw ijuru ni heza cyane. Hagenew' abakijijwe.\nN’ ukuri ni heza cyane Kandi hazicar’ abera.",
      },
    ],
  },
  {
    number: 93,
    name: "Yesu Mukiza, ni we wanshunguye kera, Yanyitangiriye ku giti",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Det är en som har dött...","codes":"Sgt. 127"},{"codes":"Ny. 291"},{"title":"There was one who was...","codes":"R.S. 737"},{"codes":"M.A. 31"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Yesu Mukiza, ni we wanshunguye kera, Yanyitangiriye ku giti.\nYikorey’ ibyaha byanjye ndetse n’ ibyawe,\nAtwoz’ atyo mu maraso ye.",
      },
      {
        type: "chorus",
        content:
          "Nzi kw ibyaha byabambwe Ku musaraba,\nYes’ ubwo yitangago kera Yanzwe n’ abantu benshi.\nArasuzugurwa Ni ko yatwujuje n’ Imana.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Yes’ afit’ urukundo rutangaje rwose\nRwatumy’ anyeza mu mutima.\nYesu Mukiza ni we wambatuye rwose\nUbwo yabambwaga ku giti.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Niyemeje kugundir’ Umukiza wanjye\nkuko yemeye kumpfir’ atyo.\nNdagushimira Yesu kuko wankunz’ utyo,\nNzahora ngushima, Mukiza.",
      },
    ],
  },
  {
    number: 94,
    name: "Nezerwa, mutima wanjye, Kuko warons’ agakiza",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Jubla nu, mitt sälla hjärta...","codes":"Sgt. 188"},{"codes":"Ny. 133"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Nezerwa, mutima wanjye, Kuko warons’ agakiza.\n/: Namaze kubabarirwa Nd’ uwa Yesu na we n’ uwanjye. :/",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Yankijije mu mutima N’ umuganga mwiza cyane.\n/: Kandi mu Mwuka we Wera Nihw abatiriz’ abantu be. :/",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Nzi ko nanditswe mw ijuru Kubw’ Umwami wanjye Yesu.\n/: Nd’ ubutunzi bw’ Umukiza, Nzahora nd’ uw’ iteka ryose. :/",
      },
      {
        type: "verse",
        number: 4,
        content:
          "None mu mutima wanjye Ndaririmb’ Imana Data.\n/: Buri munsi ni we nshuti Yo kunezeza muri byose. :/",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Yankuyehw ibyaha byose Nanjye sinzabisubira.\n/: Kandi Yes’ aracyakiza Abamusanga buri gihe. :/",
      },
      {
        type: "verse",
        number: 6,
        content:
          "Indirimbo zimushima Zikwiriye kuba nyinshi.\n/: Mu mutima wanjye naho Hati: hashimw’ Iman’ iteka!: /",
      },
    ],
  },
  {
    number: 95,
    name: "Ndashaka kuririmbira Yesu",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Jag vill sjunga om min...","codes":"Sgt. 134"},{"codes":"Ny. 130"},{"title":"I will sing of my Redeemer...","codes":"R.S. 17"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Ndashaka kuririmbira Yesu,\nYaj’ ar’ Umwami w’ igikundiro.\nYarababajwe ndetse no gupfa,\nKugira ngw ambature mu byaha.",
      },
      {
        type: "chorus",
        content:
          "Nzahora ndirimbira\nYesu Kubw’ urukundo yangiriye,\nYanyishyuriy’ imyenda yose,\nYarambohoye muri byose.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Nd’ uwo guhamy’ iby’ urwo rukundo\nRwabonetse mu Mukiza wanjye,\nCyane cyan’ uko yaj’ akankiza\nKandi nar’ uwo kurimbuka.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ndashimir’ uwo Mukiza wanjye,\nKubw’ ububasha bwe butangaje.\nKandi niw’ unshyiramw imbaraga\nZo kunesh’ umwanzi Satani.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Ndashaka rwose kuririmbira\nUwo Mwami wanjye, Yesu Kristo.\nKoko n’ ukuri yarankijije.\nNzahora mpirw’ iminsi yose.",
      },
    ],
  },
  {
    number: 96,
    name: "Mukiza wanjye wagiye mw ijuru",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Du tog din plats på Faderns...","codes":"Sgt. 171"},{"codes":"Ny. 14"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Mukiza wanjye wagiye mw ijuru\nKwicar’ iburyo bw’ Iman’ Ihoraho.\nUzagaruka kutureba twese,\nUtujyane mu bwami bwo mw ijuru.\nHar’ ibyicaro waduteguriye\nNon’ ub’ uradutegereje rwose",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Yesu ni wow’ uhor’ udusabira\nImbere y’ Imana Dat’ ihoraho.\nUhor’ urinda twebw’ ubushyo bwawe\nNo kudufasha mu bigerageza.\nUhor’ udusabira buri munsi\nNi cyo gituma tunesha Satani.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ubwo wazamukag’ ujya mw ijuru\nWaramburiy’ abawe bya biganza\nKandi no mu gihe cyo kugaruka\nAbakwizey’ uzabah’ umugisha.\nUko wagiye ni k’ uzagaruka\nNkwiye gusenga ndetse nkaba maso.",
      },
    ],
  },
  {
    number: 97,
    name: "Ifeza n’ izahabu nta bwo zibasha",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Ej silver, ej guld...","codes":"Sgt. 207"},{"codes":"Ny. 5"},{"codes":"M.A. 344"},{"title":"Nor silver, nor gold...","codes":"R.S. 321"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Ifeza n’ izahabu nta bwo zibasha\nGukiz’ umutim’ ubabajwe n’ ibyaha,\nNyamar’ amaraso ya Yesu Mukiza\nYashoboye kunkura mu byaha byose.",
      },
      {
        type: "chorus",
        content:
          "Narakijijwe, si kubw’ imari,\nKubw’ ubuntu narakijijwe.\nYanyishyuriye ya myenda yose\nYamviriy’ amaraso ye.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ifeza n’ izahabu nta bwo zibasha\nKundihirir’ imyenda yanjye y’ ibyaha,\nNyamar’ amaraso ya Yesu Mukiza\nYanyogej’ ibyaha mbon’ agakiza ke.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ifeza n’ izahabu nta bwo zibasha\nGukingur’ urugi rugeza ku Mana.\nNyamar’ amaraso ni yo yanshoboje\nKugera ku buntu bw’ Iman’ ihoraho.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Ifeza n’ izahabu nta bwo zibasha\nKungeza ku Mana niba nkor’ ibyaha,\nNyamar’ amaraso ni yo nacungujwe,\nNi yo kimenyetso kigeza mw ijuru.",
      },
    ],
  },
  {
    number: 98,
    name: "Abazaba bakijijwe bazateranira hamwe",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"De komma från öst och väst, de...","codes":"Sgt. 565"},{"codes":"Ny. 66"},{"codes":"M.A. 362"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Abazaba bakijijwe bazateranira hamwe\nKu meza mw ijuru hamwe na Yesu\nMu bami budashira, bazareb’ uburanga bwe.\nBameny’ uko yabakunze.\nBazahora baririmbira mw ijur’ iteka.",
      },
      {
        type: "chorus",
        content:
          "Bazava mu nyanja zose, Bazava mu byago byose,\nBave mu misozi, bave mu mataba\nBager' imbere y' Imana.\nBazambar’ imyenda yera, bareb’ Umukiza wabo.\nNi we wabapfiriye Kera ku musaraba.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Bazateran’ ari benshi abakirijw’ ino mw isi.\nIbyago n’ urupfu, cyang’ umwijima Ntibizabah’ ukundi.\nNta bya kera bizabaho\nHazaba harihw ibishya.\nHazabah’ umunezer’ utagir’ amakemwa.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Niwitegerez’ urugi, ni wowe rukinguriwe,\nNa Yesu Mukiz’ arakubwir’ ati:\nNgwino nawe winjire bagenzi bacu bariyo\nBaradutegereje pe!\nBa marayika bishimiye kuzatubona.",
      },
    ],
  },
  {
    number: 99,
    name: "Nshatse kugukurikira Buri munsi, Mwami Yesu",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Jag vill följa dig, o Jesus...","codes":"Sgt. 230"},{"codes":"Ny. 28"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Nshatse kugukurikira Buri munsi, Mwami Yesu.\nMu gihe cy’ umunezero Ndetse no mu mubabaro.\nUbwo watubanjirije tuje tugukurikiye.\nTuzi rwose k’ uri hafi yo kutugeza mw ijuru.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Sinahora mbaririza Urugendo rwawe Yesu,\nCyangwa se ngo nshidikanye Kugukurikira, Yesu.\nUmurimo wanjye n’ uwo Kugukurikira Yesu,\nNo gukomez’ iyo nzira nk’ uko wayimenyesheje.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Mu gihe hagiz’ icyaza Kikantesh’ inzira yawe,\nCyangwa kikandemerera Mur’ urwo rugendo mfite,\nUzaz’ uc’ uwo mugozi Uzab’ umbeshy’ umutima.\nNezezwa no kubohorwa Nkabon’ uko ngukorera.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Urandinde, Mwami Yesu, Ntunganiriz’ imigambi.\nNiba naniw’ urugendo Uzanyibuts’ urukundo\nUti Ngwino, mwana wanjye, Hasigay’ umwanya muto,\nKuk’ uzahozw’ ibyo byose Ugez’ iwanjye mw ijuru.",
      },
    ],
  },
  {
    number: 100,
    name: "Abahoze mu mwijima",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Mel: Mana, turaguhimbaza..."},{"title":"Ind. zo Gush. Imana 14"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Abahoze mu mwijima\nBabony’ umucyo w’ ukuri.\nHaleluya, haleluya,\nUmwana yatuvukiye,\nUwo Mwana w’ umuhungu.\n|:Haleluya:|x5",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Kand’ azitw’ Igitangaza,\nAzitwa n’ Umujyanama.\nHaleluya, haleluya,\nAzitw’ Iman’ ikomeye,\nYitw’ Umwami w’ amahoro.\n|:Haleluya:|x5",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Izina rizwi ni Yesu\nRisobanur’ Umukiza.\nHaleluya, haleluya,\nAzitwa n’ Imanueli,\nYukw Iman’ iri muri twe.\n|:Haleluya:|x5",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Icyubahiro mw ijuru\nKib’ icy’ Iman’ ihoraho.\nHaleluya, haleluya.\nNo mw isi hab’ amahoro,\nAbe mubo yishimira.\n|:Haleluya:|x5",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Kand’ abemey’ uwo Mwana\nBakizera n’ izina rye.\nHaleluya, haleluya.\nBahaw’ ubushobozi pe,\nBwo kub’ abana b’ Imana.\n|:Haleluya:|x5",
      },
    ],
  },
  {
    number: 101,
    name: "Habayeh’ umusozi warih’ umusaraba",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Kwa kilima cha mbali..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Habayeh’ umusozi warih’ umusaraba\nW’ umubabar’ utey’ isoni.\nAriko ndawukunda kuko Yesu yatanze\nUbugingo bwe ngo mb’ ukijijwe.",
      },
      {
        type: "chorus",
        content:
          "Nkund’ uwo musaraba wa Yesu\nUvamw imbaraga zo kunesha\nNzahora ngundir’ umusaraba\nKugez’ ubwo nzambikwa rya kamba",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Kand’ uwo musaraba tubonahw amaraso\nDukomeze tuwuririmbe.\nYes’ Umwana w’ Imana, yapfuy’ urwo baseka,\nAduhesh’ agakiza k’ Imana.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Kand’ uwo Musaraba ni w’ unkundisha Yesu,\nNubw’ usuzugurwa na benshi.\nKand’ Umwana w’ intama yahets’ umusaraba\nAwujyana hamw’ i Gologota",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Kand’ uwo musaraba nubwo wab’ uw’ isoni,\nNzakomeza kuwuhimbaza.\nKugez’ ubw’ Umukiza azanjya na mw ijuru\nMuri bwa bwami bwe buhoraho",
      },
    ],
  },
  {
    number: 102,
    name: "Ump’ akanya, Yesu, nze nkwegere",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Låt mig få en stilla stund med Jesus...","codes":"Ny. 297"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Ump’ akanya, Yesu, nze nkwegere,\nKuko naniriwe mur’ iyi si.\nNdetse no mu gihe cy’ intambara,\nNa bwo Mwami, ujy’ ump’ amahoro.",
      },
      {
        type: "chorus",
        content:
          "Ump’ akanya, Yesu, nze nkwegere,\nKuk’ umwijim’ ukabije mw isi.\nIcyo nkeneye n’ ukukwegera\nKugira ngo numv’ ijambo ryawe.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ump’ akanya, Yesu, nze nkwegere\nMu bingerageza n’ amakuba.\nNi wowe buhungiro nizeye\nMu gihe cy’ akaga mur’ iyi si.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ump’ akanya, Yesu, nze nkwegere\nKuko wanyikorerey’ ibyaha.\nNdumva nshaka kukubwira byose\nKuko, Mwami, nizeye k’ unyumva.",
      },
    ],
  },
  {
    number: 103,
    name: "Yesu yazutse n’ ukuri",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Ni nka 100"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Yesu yazutse n’ ukuri\nYabonekey’ abigishwa.\nHaleluya, haleluya.\nMaria na bagenzi be\nBazindukira ku mva ye.\n|:Haleluya:|x5",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Basang’ imva y’ ikinguwe\nHarimo ba marayika.\nHaleluya, haleluya.\nNuko babwir’ abagore\nYuko Yes’ ari muzima.\n|:Haleluya:|x5",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Ba bagore barihuta\nKubimenye sh’ abigishwa\nHaleluya, haleluya,\nNukw abigishwa babiri\nBirukankira ku mva ye.\n|:Haleluya:|x5",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Nuko n’ abandi bigishwa\nMu nzir’ ijya Emausi\nHaleluya, haleluya,\nBaganirag’ ibya Yesu\nUko yapfuy’ agahambwa.\n|:Haleluya:|x5",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Yes’ arababonekera,\nAriko ntibamumenya.\nHaleluya, haleluya.\nYes’ ati: Yemwe, mwa bapfu.\nKristo yar’ uwo kuzuka.\n|:Haleluya:|x5",
      },
      {
        type: "verse",
        number: 6,
        content:
          "Bugorobye Yes’ araza,\nAboneker’ abigishwa\nHaleluya, haleluya,\nAti: Mugir’ amahoro!\nAbahumeker’ Umwuka.\n|:Haleluya:|x5",
      },
    ],
  },
  {
    number: 104,
    name: "Yesu, ni wowe mucyo",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Hamu nalona rohoni..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Yesu, ni wowe mucyo,\nNi wowe nshima kuko wankunze.\nMwami, byose wakoze\nKutwitangira ndabigushima.",
      },
      {
        type: "chorus",
        content: "/: Yesu, ur’ amahoro yacu,\nKuko watuberey’ inshungu. :/",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Mwami, ndanezerewe\nKukuririmba kuko wankunze.\nYesu, komez’ umfashe,\nNanjye ngukunde, nkuririmbire.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Yesu, ngwino tubane,\nNgwin’ unyobore mu nzira yawe\nKandi ni wowe nzira,\nUr’ ubugingo ndetse n’ ukuri.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Nzi ko har’ igihugu cy’ umucyo mwinshi ku bakijijwe.\nNdetse icyo gihugu\nN’ icy’ izahabu zitatse neza.",
      },
    ],
  },
  {
    number: 105,
    name: "Narimboshwe rwose mu mwijima mwinshi",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Nilifungwa sana kati giza kuu..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Narimboshwe rwose mu mwijima mwinshi,\nSinarinzi Yesu wavuye mwijuru\nYambohoy’ingoyi zose nari mfite.\nHaleluya, nsigaye ndirimba Yesu.",
      },
      {
        type: "chorus",
        content:
          "N’igitangaza pe! Nigitangaza pe!\nRwose n’igitangaza ko Yesu yankijije.\nUmwuka we Wera niw’ ujy’ unyobora.\nUzangez’iwanjye mw’ijuru amahoro.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Iyo ngeragejwe n’umwanzi satani,\nNdwan’iyo ntambara nambay’ukwizera.\nIjambo ry’Imana ni ryo nkota yanjye,\nKandi rizangeza mwijur’amahoro.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Nyura mu misozi, nyura mu mataba.\nAho hose ni ko harushy’umutima.\nNjya nsab’Uwiteka kugira ngw amfashe.\nUwiteka na we ntatinda kunyumva.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Mu gihe nanirwa mu rugendo rwanjye,\nNdebesh’ukwizera ibiri mw ijuru.\nUzat’umuruho ndetse tuzahazwa\nYesu Mukiza ni we waturaritse.",
      },
    ],
  },
  {
    number: 106,
    name: "Abantu bose batuye mw isi",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Mel: Min Konungs namn är en...","codes":"Sgt. 333"},{"codes":"Ny. 237"},{"codes":"M.A. 367"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Abantu bose batuye mw isi\nNi bo bahawe Noeli.\nNtidushobora kuzibagirwa\nIyo Noeli twahawe.",
      },
      {
        type: "chorus",
        content:
          "Noeli nziza! Noeli nziza!\nNimuze twese tuyiririmbe!\nNiy’ itwibuts’ agakiza kacu\nNoeli nziza ni Yesu.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "N’ igitangaza kukw abashumba\nBatanz’ abandi Noeli.\nNta cyubahiro bari bafite,\nNyamar’ Iman’ ikor’ ityo.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "N’ igitangaza kuk’ uwo mwana\nYavukiye mu nzu y’ inka.\nNatw’ abakene turashobora\nKuririmbira Noeli.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Mur’ iryo joro ritey’ ukwaryo\nRyaririmbwe na marayika Bat’:\nIcyubahiro n’ icy’ Imana\nNay’ amahor’ abe mw isi.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Kand’ uwo mwana nubwo yavutse\nSi bose bamwakiriye.\nNyamara bose bamwakiriye\nBabay’ abana b’ Imana.",
      },
    ],
  },
  {
    number: 107,
    name: "Twemezwa n’ iki ko tuzagera mw ijuru",
    url: "https://indirimbo.rw/song/agakiza/1",
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Twemezwa n’ iki ko tuzagera mw ijuru?--\nN’ Umwuka w’ Ihoraho\nIbyiringiro nk’ ibyo twabihabwa na nde?--\nN’ Umwuka w’ Ihoraho",
      },
      {
        type: "chorus",
        content: "/: Dushak’ uwo Mwuka Wera\nNi Yesu wawutugeneye. :/",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Umwuka Wer’ akora imirim’ ikomeye.\nNi wo wemez’ abantu.\nTugir’ ubwoba cyan’ iyo tutakimwumva\nTwibaz’ icyo twakora.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Mu gih’ ubona k’ utagifit’ urukundo\nMenya yuk’ uwo Mwuka Yabonye\nK’ uyoborwa n’ umubiri wawe\nMusab’ uti: garuka!",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Turagusaba Mwami Yes’ umwohereze\nUwo Mufasha wacu,\nKuko dufit’ intambar’ ikomeye mw isi.\nTuramukwiye rwose.",
      },
    ],
  },
  {
    number: 108,
    name: "Yew’ usonzey’ agakiza",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Yesu Mwokozi akulta..."}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Yew’ usonzey’ agakiza,\nNg’ ubabarirw’ ibyaha.\nUmv’ agakuru k’ imvaho\nYuko Yes’ agushaka.",
      },
      {
        type: "chorus",
        content:
          "Uhamagawe na Yesu,\nNa Yesu Mukiza.\nAragushak’ uyu munsi\nMwemerer’ agukize.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Nawe wabay’ inzimizi\nKuko wahunze Yesu,\nMenya ko yagupfiriye.\nNgwin’ umusange none.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Naw’ uhamagawe none\nWite kur’ iryo jwi rye.\nReka gutind’ uyu munsi.\nN’ uwawe w’ agakiza.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Harihw abumvis’ iri jwi\nBararisuzugura,\nHanyuma bajy’ ikuzimu\nKimwe na wa mutunzi.",
      },
    ],
  },
  {
    number: 109,
    name: "Pasika yacu niy’ itwibutsa",
    url: "https://indirimbo.rw/song/agakiza/1",
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "Pasika yacu niy’ itwibutsa\nAmaraso y’ Umwana w’ Imana.\nNi yo yadukuye mw Egiputa,\nAho Satani yicir’ abantu.",
      },
      {
        type: "chorus",
        content:
          "Nimuze twese tumuhimbaze\nKuko yemeye kudupfir’ atyo.\nYasatuyemo na rwa rusika\nYatumye natwe twinjir’ ahera.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "I Getsemani Yes’ arasenga Ati:\nData, niba byashoboka\nIki gikombe sinkinywereho\nAriko byose bib’ uk’ ushaka.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "Umwami Yesu n’ Umucunguzi\nYadupfiriye ku musaraba.\nByavuye kuki? Ku rukundo rwe\nRwatumy’ atanga ubugingo bwe.",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Uwagambaniye Yesu Kristo\nKandi yar’ uwo mu bigishwa be.\nNyamara yikururiy’ ishyano\nRyatumye yimanika ku giti.",
      },
      {
        type: "verse",
        number: 5,
        content:
          "Nuko kw isaha ya gatandatu\nHose habah’ ubwirakabiri.\nBwafash’ amasah’ atatu yose,\nBwagejeje mw isaha ya cyenda.",
      },
    ],
  },
  {
    number: 110,
    name: "N’ utagir’ umwete mu nzira y’ Imana",
    url: "https://indirimbo.rw/song/agakiza/1",
    references: [{"title":"Ingen hinner fram till den eviga...","codes":"Sgt. 347"},{"codes":"Ny. 196"}],
    body: [
      {
        type: "verse",
        number: 1,
        content:
          "N’ utagir’ umwete mu nzira y’ Imana,\nNtabw’ uzinjira mw ijuru.\nRindir’ umutima mw ijambo ry’ Imana,\nNi ryo rizagukomeza\nIrembo ni rito ndetse n’ inzira nto.\nWihangane rwose kugira ng’ ucemo,\nNiwemere non’ agakiza k’ Imana.\nNibw’ uzagera mw ijuru.",
      },
      {
        type: "verse",
        number: 2,
        content:
          "Ibigusha byinshi biri mu rugendo\nKandi bizanwa n’ umwanzi.\nUshobora rwose kunesh’ ibyo byose\nBishaka kukudindiza.\nNtugakurikire ijwi wumva ryose\nKuko byashobora kukuyoby’ inzira.\nUkwiye kumenya ko Yes’ agukunda\nNawe witang’ ukomeje.",
      },
      {
        type: "verse",
        number: 3,
        content:
          "N’ utizer’ Imana ntuzajya mw ijuru\nHabe no guc’ umutaru.\nKandi n’ ubugingo ntabw’ uzabubona\nIryo n’ ijambo ry’ Imana\nMu kwizera gusa ni ho wakirizwa.\nN’ ubu ndetse wumv’ ijambo ry’ agakiza\nNiwihan’ ibyaha, wizer’ Umukiza,\nInzira y’ ukuri n’ iyo",
      },
      {
        type: "verse",
        number: 4,
        content:
          "Iman’ irashaka ko bose bakizwa.\nKandi bahabw’ ubugingo.\nIraguha naw’ umurage w’ ijuru\nNib’ uwusha kan’ umwete,\nKand’ Iman’ ikunda umutima wawe.\nYesu na we agashaka kuwukiza,\nKand’ Umwuka Wera aragukangura,\nNiba wumvir’ uzahirwa.",
      },
    ],
  },
];

export default songs;
