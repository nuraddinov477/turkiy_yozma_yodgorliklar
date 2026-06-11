// ============================================================
// TURKIY YOZMA YODGORLIKLAR KORPUSI — Ma'lumotlar bazasi
// VII–XI asrlar | Electronic Corpus of Turkic Written Monuments
// ============================================================

const SCRIPTS_INFO = {
  // Django DB qiymatlari
  "koktürk":  { name: "Ko'hna turkiy runik", color: "#c9a84c", bg: "#2a1e06", icon: "𐰓" },
  "uyg'ur":   { name: "Eski uyg'ur",          color: "#e8913a", bg: "#2a1406", icon: "ئ" },
  arab:        { name: "Arab yozuvi",           color: "#7ecb9e", bg: "#062a16", icon: "ع" },
  sogd:        { name: "So'g'diy yozuv",        color: "#a08bc4", bg: "#160626", icon: "𐼇" },
  "sogʻd":    { name: "So'g'diy yozuv",        color: "#a08bc4", bg: "#160626", icon: "𐼇" },
  boshqa:      { name: "Boshqa",                color: "#8090a8", bg: "#1a1e26", icon: "?" },
  // localStorage (statik) qiymatlari
  runik:       { name: "Ko'hna turkiy runik", color: "#c9a84c", bg: "#2a1e06", icon: "𐰓" },
  uyghur:      { name: "Eski uyg'ur",          color: "#e8913a", bg: "#2a1406", icon: "ئ" },
  brahmi:      { name: "Brahmi",                color: "#c4a08b", bg: "#26160a", icon: "𑀩" }
};

const CATEGORIES_INFO = {
  // Django DB qiymatlari
  bitiglar:     { name: "Tosh bitiklar",   icon: "🗿" },
  qollanmalar:  { name: "Qo'llanmalar",    icon: "📜" },
  diniy:        { name: "Diniy matnlar",   icon: "🕌" },
  adabiy:       { name: "Adabiy asarlar",  icon: "📚" },
  boshqa:       { name: "Boshqa",          icon: "📄" },
  // localStorage (statik) qiymatlari
  tosh_bitik:   { name: "Tosh bitiklar",   icon: "🗿" },
  qolyozma:     { name: "Qo'lyozmalar",    icon: "📜" },
  yozuv:        { name: "Yozuvlar",        icon: "✍️" },
  lugat:        { name: "Lug'atlar",       icon: "📖" },
  doston:       { name: "Dostonlar",       icon: "📚" }
};

const DEFAULT_MONUMENTS = [
  {
    id: 1,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Tonyukuk_Inscription.jpg/640px-Tonyukuk_Inscription.jpg",
    coords: [47.73, 107.22],
    title: "Tonyuquq Bitigi",
    subtitle: "Тоньюкук битиги",
    era: "Ko'ktürk II xoqonligi",
    date: "716–720",
    century: 8,
    script: "runik",
    language: "Ko'hna turkiy",
    location: "Mo'g'uliston, Bayn-Tsokto hududi",
    region: "Markaziy Osiyo",
    category: "tosh_bitik",
    wordCount: 2800,
    lineCount: 62,
    importance: 5,
    status: "Mo'g'uliston — ochiq havo muzeyi",
    description: "Tonyuquq bitiglari Ko'ktürk II xoqonligining eng muhim yozma yodgorliklaridan biri hisoblanadi. Ushbu matn Ko'ktürk davlatining mashhur siyosatchi va harbiy qo'mondoni Tonyuquq tomonidan o'zi haqida yozdirgan avtobiografik xarakter kasb etadi. Ikki qismdan iborat bo'lgan bitiglar Mo'g'uliston cho'llarida topilgan bo'lib, runik yozuvdagi eng qadimgi avtobiografik matn sifatida tarixga kirgan.",
    significance: "Ko'hna turkiy tildagi eng qadimgi avtobiografik matn. Ko'ktürk tarixini o'rganishda birlamchi manba hisoblanadi.",
    transcription: "𐱃𐰆𐰤𐰞𐰸𐰸 𐰉𐰃𐱃𐰃𐰏𐰃",
    transliteration: "Men özüm tonyuquq bilge tonyuquq Tabgaçqa köl bolmış erim. Türk bodun Tabgaçqa köl boltı. Köl bolup yanı yana yok boltı...",
    translation: "Men, Tonyuquq, dono Tonyuquq, Xitoyga tobe bo'lgan edim. Turk xalqi Xitoyga tobe bo'ldi. Tobe bo'lib, yana-yana yo'q bo'la boshladi...",
    researchers: ["S.E. Malov", "Talat Tekin", "H.N. Orkun", "A. von Gabain"],
    bibliography: [
      "Malov S.E. Pamyatniki drevnetyurkskoy pis'mennosti. M–L: AN SSSR, 1951",
      "Tekin T. A Grammar of Orkhon Turkic. Bloomington, 1968",
      "Orkun H.N. Eski Türk Yazıtları. Ankara: TTK, 1936"
    ],
    tags: ["orxon", "runik", "avtobiografik", "ko'ktürk", "siyosiy"],
    views: 1847,
    addedDate: "2024-01-01"
  },
  {
    id: 2,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Kul_Tigin_at_Khoshoo_Tsaidam.jpg/640px-Kul_Tigin_at_Khoshoo_Tsaidam.jpg",
    coords: [47.55, 101.48],
    title: "Kültigin Bitigi",
    subtitle: "Кюльтегин битиги",
    era: "Ko'ktürk II xoqonligi",
    date: "732",
    century: 8,
    script: "runik",
    language: "Ko'hna turkiy",
    location: "Mo'g'uliston, Orxon vodiysi, Qo'sho'Tsaydam",
    region: "Markaziy Osiyo",
    category: "tosh_bitik",
    wordCount: 3420,
    lineCount: 68,
    importance: 5,
    status: "Mo'g'uliston milliy muzeyi (Ulaanbaatar)",
    description: "Kültigin bitigi Ko'ktürk II xoqonligining eng buyuk harbiy sardari Kültiginning vafotidan so'ng, uning akasi Bilge xoqon tomonidan 732 yilda o'rnatilgan yodgorlik. Bu matn ko'hna turkiy yozma adabiyotining eng muhim asarlaridan biri bo'lib, xalqning tarixi, urf-odatlari va davlat tuzumini aks ettiradi. Toshda runik va xitoy yozuvlari birga keltirilgan.",
    significance: "Ko'hna turkiy yozma adabiyotining eng yirik va muhim namunasi. Turkiy xalqlar tarixini o'rganishda beqiyos ahamiyatga ega.",
    transcription: "𐱅𐰭𐰼𐰃 𐱅𐰏 𐱅𐰭𐰼𐰃𐰓𐰀 𐰉𐰆𐰞𐰢𐱁 𐱅𐰇𐰼𐰚 𐰉𐰃𐰞𐰏𐰀 𐰴𐰍𐰣",
    transliteration: "Tengri teg tengride bolmış türk bilge qagan bu ödke olurttum. Sabımın tüketi eşidgil. Ulayu iniyigünüm oğlanım biriki oğuşum budunum biriye şadapit begler yırıya tarqat buyruq begler...",
    translation: "Osmonday osmonda tug'ilgan Turk Bilge Xoqon men bu vaqtda taxtga o'tirdim. So'zlarimni to'liq eshiting. Mendan keyingi inim-jiyanlarim, o'g'illarim, bir urugimdan bo'lgan xalqim, janubiy shapit beglar, shimoliy tarqat-buyruq beglar...",
    researchers: ["V.V. Radlov", "H.N. Orkun", "Talat Tekin", "S.G. Klyashtorny"],
    bibliography: [
      "Radlov V.V. Die alttürkischen Inschriften der Mongolei. SPb, 1895",
      "Orkun H.N. Eski Türk Yazıtları I–IV. İstanbul, 1936–1941",
      "Tekin T. A Grammar of Orkhon Turkic. 1968"
    ],
    tags: ["orxon", "runik", "epigrafik", "ko'ktürk", "siyosiy", "tarixiy"],
    views: 2341,
    addedDate: "2024-01-01"
  },
  {
    id: 3,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Bilge_Kaghan_stele.jpg/640px-Bilge_Kaghan_stele.jpg",
    coords: [47.54, 101.45],
    title: "Bilge Xoqon Bitigi",
    subtitle: "Бильге хаган битиги",
    era: "Ko'ktürk II xoqonligi",
    date: "735",
    century: 8,
    script: "runik",
    language: "Ko'hna turkiy",
    location: "Mo'g'uliston, Orxon vodiysi, Qo'sho'Tsaydam",
    region: "Markaziy Osiyo",
    category: "tosh_bitik",
    wordCount: 3100,
    lineCount: 72,
    importance: 5,
    status: "Mo'g'uliston milliy muzeyi (Ulaanbaatar)",
    description: "Bilge Xoqon bitigi Ko'ktürk II xoqonligining eng buyuk hukmdori Bilge Xoqon vafotidan so'ng, uning o'g'li tomonidan 735 yilda o'rnatilgan. Matn Bilge Xoqonning hayoti, urushlari va siyosatini batafsil hikoya qiladi. Kültigin bitigi bilan birga Ko'ktürk tarixining asosiy manbasini tashkil etadi. Matnning muallifi Yuluq Tigin, ya'ni Bilge Xoqonning o'g'li hisoblanadi.",
    significance: "Ko'ktürk xoqonligining siyosiy tarixi va davlat boshqaruv tizimini aks ettiruvchi eng muhim yozma manba.",
    transcription: "𐰇𐰕𐰀 𐰚𐰇𐰚 𐱅𐰭𐰼𐰃 𐰀𐱁𐰼𐰀 𐰘𐰍𐰄𐰕 𐰘𐰃𐰺 𐰴𐰞𐰣𐰑𐰴𐰑𐰀",
    transliteration: "Üze kök tengri asra yagız yir qılındıqda ikín ara kişi oglı qılınmış. Kişi oglında üze eçüm apam Bumin qagan Istemi qagan olurmuş. Olurupan türk budunung ilin törüsin tuta birmiş...",
    translation: "Yuqorida ko'k osmon, pastda qora yer yaratilganda, ikkalasining orasida inson o'g'li yaratilgan. Insonlar ustida ajdodlarim Bumin xoqon va Istemi xoqon taxtga o'tirgan. Taxtga o'tirib turk xalqining davlati va qonunini tutib boshqargan...",
    researchers: ["V.V. Radlov", "H.N. Orkun", "Talat Tekin", "Louis Bazin"],
    bibliography: [
      "Radlov V.V. Die alttürkischen Inschriften der Mongolei. SPb, 1895",
      "Bazin L. Les calendriers turcs anciens et médiévaux. Lille, 1974"
    ],
    tags: ["orxon", "runik", "epigrafik", "ko'ktürk", "siyosiy"],
    views: 1923,
    addedDate: "2024-01-01"
  },
  {
    id: 4,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Bugut_inscription.jpg/640px-Bugut_inscription.jpg",
    coords: [47.32, 100.83],
    title: "Bugut Bitigi",
    subtitle: "Бугут битиги",
    era: "Ko'ktürk I xoqonligi",
    date: "~584",
    century: 6,
    script: "sogd",
    language: "So'g'diy va sanskrit",
    location: "Mo'g'uliston, Bugut",
    region: "Markaziy Osiyo",
    category: "tosh_bitik",
    wordCount: 600,
    lineCount: 20,
    importance: 4,
    status: "Mo'g'ulistonda saqlanmoqda",
    description: "Bugut bitigi Ko'ktürk I xoqonligi davriga oid eng qadimgi tosh yodgorlik bo'lib, so'g'diy tili va yozuvida bitilgan. Bu yodgorlik turkiy xalqlarning yozma madaniyatida so'g'diy ta'sirini ko'rsatuvchi muhim manba hisoblanadi. Tosh ustunning to'rt tomoniga yozilgan bo'lib, xitoy va brahmi yozuvlari ham uchraydi.",
    significance: "Ko'ktürk xoqonligi davriga oid eng qadimgi epigrafik yodgorlik. So'g'diy-turkiy madaniy aloqalarning yorqin namunasidir.",
    transcription: "",
    transliteration: "ywβ 'l Mwγan Qγ'n MN G'W nsknd 'γr'γt'k 'wyn...",
    translation: "Mugan xoqondan keyin osmon singari [bo'lgan]...",
    researchers: ["V. Livshits", "S.G. Klyashtorny"],
    bibliography: [
      "Klyashtorny S.G., Livshits V.A. The Sogdian inscription of Bugut revisited. 1972"
    ],
    tags: ["so'g'diy", "ko'ktürk", "epigrafik", "qadimgi"],
    views: 654,
    addedDate: "2024-02-01"
  },
  {
    id: 5,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Orkhon_inscription_2.jpg/640px-Orkhon_inscription_2.jpg",
    coords: [48.02, 96.53],
    title: "Shine-Usu Bitigi",
    subtitle: "Шине-Усу битиги",
    era: "Uyg'ur xoqonligi",
    date: "759–760",
    century: 8,
    script: "runik",
    language: "Ko'hna turkiy",
    location: "Mo'g'uliston, Shine-Usu",
    region: "Markaziy Osiyo",
    category: "tosh_bitik",
    wordCount: 1800,
    lineCount: 45,
    importance: 4,
    status: "Mo'g'ulistonda",
    description: "Shine-Usu bitigi Uyg'ur xoqonligining asoschisi Mo'yinchur (Bayan-Chur) xoqon tomonidan o'rnatilgan muhim yodgorlik. Bu matn runik yozuvdagi so'nggi muhim yodgorliklardan biri bo'lib, Uyg'ur xoqonligining tarixini yoritadi. Shine-Usu daryosi bo'yida topilgan bu tosh ko'ktürkcha runik yozuv an'anasining davomchisidir.",
    significance: "Runik yozuvdagi Uyg'ur davri yodgorliklarining eng muhimi. Uyg'ur xoqonligi tarixini o'rganishda asosiy manba.",
    transcription: "𐰢𐰇𐰘𐰤𐰲𐰆𐰺 𐰉𐰃𐱃𐰃𐰏𐰃",
    transliteration: "Bilge tengri bilge qagan el tutdı. Türk oguz bodunug yarlıqadı...",
    translation: "Bilge osmon, bilge xoqon davlatni boshqardi. Turk-o'g'uz xalqiga marhamat ko'rsatdi...",
    researchers: ["S.G. Klyashtorny", "V.E. Voytov"],
    bibliography: [
      "Klyashtorny S.G. Drevnetyurkskie runicheskie pamyatniki. M: Nauka, 1964"
    ],
    tags: ["runik", "uyg'ur", "epigrafik", "siyosiy"],
    views: 876,
    addedDate: "2024-01-15"
  },
  {
    id: 6,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Yenisei_runic_inscription.jpg/640px-Yenisei_runic_inscription.jpg",
    coords: [53.72, 91.42],
    title: "Yenisey Bitiglari",
    subtitle: "Енисей битиглари",
    era: "Ko'ktürk va keyingi davrlar",
    date: "VII–IX asrlar",
    century: 8,
    script: "runik",
    language: "Ko'hna turkiy",
    location: "Rossiya — Xakasiya va Tuva respublikalari",
    region: "Sibir",
    category: "tosh_bitik",
    wordCount: 4500,
    lineCount: 120,
    importance: 4,
    status: "Turli muzeylar va ochiq havoda",
    description: "Yenisey bitiglari Rossiyaning Xakasiya va Tuva respublikalarida topilgan runik yozuvdagi 150 dan ortiq tosh yodgorliklar majmuasidir. Bu yodgorliklar asosan qabr toshlari (epitafiyalar) bo'lib, 7–9 asrlarga oid ko'hna turkiy tilni o'rganishda muhim manba hisoblanadi. Ko'ktürk runik yozuvining Sibirda tarqalishini ko'rsatadi.",
    significance: "Runik yozuvdagi eng ko'p sonli epigrafik yodgorliklar to'plami. Ko'hna turkiy dialektologiyasi uchun muhim material.",
    transcription: "E1–E111 bitiglari",
    transliteration: "Uçuz yigirmi yaşıma qıtaynı süledim. Otuz artukı bir yaşıma sülemiş...",
    translation: "Yigirma uch yoshimda xitoylarga qo'shin tortdim. O'ttiz bir yoshimda yurish qildim...",
    researchers: ["V.V. Radlov", "S.E. Malov", "I.A. Batmanov"],
    bibliography: [
      "Batmanov I.A. Yazyk yeniseyskikh pamyatnikov. 1959",
      "Malov S.E. Eniseyskaya pis'mennost' tyurkov. M–L, 1952"
    ],
    tags: ["runik", "yenisey", "epitafiya", "sibir"],
    views: 1123,
    addedDate: "2024-02-15"
  },
  {
    id: 7,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Old_Turkic_Talas_inscription.jpg/640px-Old_Turkic_Talas_inscription.jpg",
    coords: [42.52, 72.23],
    title: "Talas Bitiglari",
    subtitle: "Талас битиглари",
    era: "Turli davrlar",
    date: "VIII–IX asrlar",
    century: 8,
    script: "runik",
    language: "Ko'hna turkiy",
    location: "Qirg'iziston, Talas vodiysi",
    region: "Markaziy Osiyo",
    category: "tosh_bitik",
    wordCount: 800,
    lineCount: 30,
    importance: 3,
    status: "Qirg'iziston muzeylarida",
    description: "Talas vodiysi bitiglari O'rta Osiyoning Qirg'iziston hududidagi runik yozuvdagi epigrafik yodgorliklar bo'lib, 8–9 asrlarga oiddir. Bu yodgorliklar O'rta Osiyo turkiy qabilalarining hayoti haqida qimmatli ma'lumot beradi. Talas bitiglari O'rta Osiyo runik an'anasining o'ziga xos mahsuli hisoblanadi.",
    significance: "O'rta Osiyodagi turkiy runik yozuv an'anasining namunasidir. Ko'hna turkiy til tarqalish geografiyasini kengaytiradi.",
    transcription: "",
    transliteration: "Men Kül Çor anta ötüg ötigme...",
    translation: "Men Kul Chor bu yerda o'tindim...",
    researchers: ["D.D. Vasilyev", "T. Nishida"],
    bibliography: [
      "Vasilyev D.D. Graficheskiy fond pamyatnikov tyurkskoy runicheskoy pis'mennosti. 1983"
    ],
    tags: ["runik", "talas", "o'rta osiyo"],
    views: 543,
    addedDate: "2024-03-01"
  },
  {
    id: 8,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Irq_bitig.jpg/640px-Irq_bitig.jpg",
    coords: [40.14, 94.66],
    title: "Irq Bitig",
    subtitle: "Ырк Битиг — Fol Kitobi",
    era: "Uyg'ur xoqonligi",
    date: "IX asr (taxm. 850–950)",
    century: 9,
    script: "uyghur",
    language: "Ko'hna uyg'ur",
    location: "Turfan va Dunhuang (Xitoy)",
    region: "Sharqiy Turkiston",
    category: "qolyozma",
    wordCount: 3200,
    lineCount: 95,
    importance: 4,
    status: "Britaniya kutubxonasi (London)",
    description: "Irq Bitig ('Fol kitobi') eski uyg'ur yozuvida bitilgan falchilik kitobi bo'lib, 65 ta fol o'z ichiga oladi. Bu kitob Dunhuangdagi Mogao g'orlarida topilgan. U turkiy xalqlarning diniy e'tiqodlari, baxt-saodat tasavvurlari va turmush tarzi haqida qimmatli ma'lumot beradi. Shamanistik va buddaviy tasavvurlarning o'ziga xos qo'shilishini aks ettiradi.",
    significance: "Eski uyg'ur yozuvida saqlanib qolgan eng qadimgi nasriy asar. Shamanizm va Uyg'ur madaniyatini o'rganishda muhim manba.",
    transcription: "ئىرق بىتىگ",
    transliteration: "Irq bitig. Bir er yılkısın ewke kirürür. Edgü ol. Bir er ewke kirip ewinteki yılkısın ötrü...",
    translation: "Fol kitobi. Bir er (odam) mol-mulkini uyiga kiritadi. Bu yaxshi (belgi). Bir er uyga kirib, uyidagi mol-mulkini so'ng...",
    researchers: ["W. Radloff", "P. Zieme", "Talat Tekin"],
    bibliography: [
      "Tekin T. Irk Bitig. The Book of Omens. Wiesbaden: Harrassowitz, 1993",
      "Zieme P. Manichäisch-türkische Texte. Berlin, 1975"
    ],
    tags: ["uyg'ur", "qo'lyozma", "falchilik", "dunhuang", "diniy"],
    views: 987,
    addedDate: "2024-03-15"
  },
  {
    id: 9,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Manichaean_manuscript_Turfan.jpg/640px-Manichaean_manuscript_Turfan.jpg",
    coords: [42.93, 89.19],
    title: "Xuastuanift",
    subtitle: "Хуастуанифт — Tavbanoma",
    era: "Uyg'ur xoqonligi — Manixeylik davri",
    date: "IX–X asrlar",
    century: 9,
    script: "uyghur",
    language: "Ko'hna uyg'ur",
    location: "Turfan (Xitoy)",
    region: "Sharqiy Turkiston",
    category: "qolyozma",
    wordCount: 2100,
    lineCount: 60,
    importance: 4,
    status: "Berlin, London, Sankt-Peterburg kutubxonalari",
    description: "Xuastuanift manixeylik diniga oid tavbanoma matn bo'lib, ko'hna uyg'ur yozuvida yozilgan. Matn Turfan xazinasida topilgan. Bu asar manixeylik dinining Markaziy Osiyodagi tarqalishini va uyg'ur adabiy tilini o'rganishda muhim manba hisoblanadi. Uyg'ur xoqonligining rasmiy dini bo'lgan manixeylikka bag'ishlangan.",
    significance: "Eski uyg'ur tili va manixeylik dinini o'rganishda asosiy manba. Ko'hna turkiy diniy adabiyotning namunasidir.",
    transcription: "خواستوانيفت",
    transliteration: "Yme bir tengri öd tengri üçün mü yme el xan üçün mü yme bitig nom üçün mü köngüllüg bolsar...",
    translation: "Yana bir tangri vaqti uchun, tangri uchunmi yoki el xon uchunmi yoki diniy kitob uchunmi ko'ngil qo'ysa...",
    researchers: ["V.V. Radlov", "W.B. Henning", "A. von Gabain"],
    bibliography: [
      "Radlov V.V. Chuastuanit — das Bussgebet der Manichäer. SPb, 1909",
      "Clark L. The Manichean Turkic Pothi-Book. 1982"
    ],
    tags: ["uyg'ur", "qo'lyozma", "manixeylik", "turfan", "diniy"],
    views: 734,
    addedDate: "2024-04-01"
  },
  {
    id: 10,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Uyghur_Buddhist_manuscript.jpg/640px-Uyghur_Buddhist_manuscript.jpg",
    coords: [42.94, 89.22],
    title: "Altun Yoruq",
    subtitle: "Алтун Ёруғ — Oltin Yorug'",
    era: "Idiqut Uyg'ur davlati",
    date: "X asr (taxm. 980–1000)",
    century: 10,
    script: "uyghur",
    language: "Ko'hna uyg'ur",
    location: "Sharqiy Turkiston, Dunhuang",
    region: "Sharqiy Turkiston",
    category: "qolyozma",
    wordCount: 15000,
    lineCount: 450,
    importance: 5,
    status: "Sankt-Peterburg (Rossiya) va boshqa kutubxonalar",
    description: "Altun Yoruq ('Oltin yorug'') Suvarnaprabhasa buddaviy matnining ko'hna uyg'ur tilidagi tarjimasi bo'lib, X asrda yaratilgan. Bu asar ko'hna uyg'ur adabiyotining eng yirik va eng muhim asarlaridan biri hisoblanadi. Matn buddizm va o'rta asr uyg'ur madaniyatini o'rganishda beqiyos ahamiyatga ega. So'g'diycha va xitoycha asliyatdan tarjima qilingan.",
    significance: "Ko'hna uyg'ur adabiyotining eng yirik asari. Buddaviy matnlarning turkiy tiliga tarjima an'anasini ko'rsatadi.",
    transcription: "التون يوروق",
    transliteration: "Nom elig suvarnaprabhasa ötüg adınçıg tüz tözlüg sutra iki katın ögdülmüş nom elig...",
    translation: "Suvarnaprabhasa deb nomlanuvchi ajoyib, to'g'ri tabiatli sutra, ikki marta maqtangan nom eligi...",
    researchers: ["S.E. Malov", "P. Zieme", "C. Kaya"],
    bibliography: [
      "Kaya C. Uygurca Altun Yaruk. Ankara: TDK, 1994",
      "Zieme P. Altun Yaruk Sudur. Turnhout: Brepols, 1996"
    ],
    tags: ["uyg'ur", "qo'lyozma", "buddizm", "sutra", "tarjima"],
    views: 1456,
    addedDate: "2024-04-15"
  },
  {
    id: 11,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Orkhon_inscription_3.jpg/640px-Orkhon_inscription_3.jpg",
    coords: [47.52, 101.03],
    title: "Mo'yinchur Bitigi",
    subtitle: "Муйинчур битиги",
    era: "Uyg'ur xoqonligi",
    date: "762",
    century: 8,
    script: "runik",
    language: "Ko'hna turkiy",
    location: "Mo'g'uliston, Selenga daryosi bo'yi",
    region: "Markaziy Osiyo",
    category: "tosh_bitik",
    wordCount: 1200,
    lineCount: 38,
    importance: 4,
    status: "Mo'g'ulistonda",
    description: "Mo'yinchur (Bayan Chur) bitigi Uyg'ur xoqonligining ikkinchi xoqoni Mo'yinchur tomonidan o'rnatilgan. Bu matn Uyg'ur xoqonligining kuchayishi va Xitoy bilan munosabatlarni aks ettiradi. Matn Selenga daryosi bo'yida topilgan tosh stela ustiga o'yib yozilgan.",
    significance: "Uyg'ur xoqonligi davridagi runik yozuvning muhim namunasi. Xitoy-Uyg'ur munosabatlarini yoritadi.",
    transcription: "𐰢𐰇𐰘𐰤𐰲𐰆𐰺",
    transliteration: "Tengri yarlıqadı. Qut birlä biz aşnü yağıg etmiş bodug biz...",
    translation: "Osmon (xudo) marhamat ko'rsatdi. Baxt bilan biz avval dushmanlarni bo'ysundirib oldik...",
    researchers: ["S.G. Klyashtorny", "T.A. Shumovskiy"],
    bibliography: [
      "Klyashtorny S.G. Drevnetyurkskie runicheskie pamyatniki. 1964"
    ],
    tags: ["runik", "uyg'ur", "epigrafik", "siyosiy"],
    views: 678,
    addedDate: "2024-05-01"
  },
  {
    id: 12,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Uighur_Turfan_manuscript.jpg/640px-Uighur_Turfan_manuscript.jpg",
    coords: [42.94, 89.19],
    title: "Turfon Qo'lyozmalari",
    subtitle: "Турфан қўлёзмалари",
    era: "Idiqut Uyg'ur davlati",
    date: "VIII–XI asrlar",
    century: 9,
    script: "uyghur",
    language: "Ko'hna uyg'ur",
    location: "Turfan vohasi (Xitoy, Sharqiy Turkiston)",
    region: "Sharqiy Turkiston",
    category: "qolyozma",
    wordCount: 50000,
    lineCount: 2000,
    importance: 5,
    status: "Berlin, Sankt-Peterburg, London, Stokgolm kutubxonalari",
    description: "Turfan qo'lyozmalari — Sharqiy Turkistondagi Turfan vohasidan topilgan ko'hna uyg'ur tilidagi yozma yodgorliklar majmuasi. Bu qo'lyozmalar buddizm, manixeylik, nasroniylik va islom dinlariga oid turli xil matnlarni o'z ichiga oladi. 19–20 asr boshlarida Nemis, Rus va Britaniya ekspeditsiyalari tomonidan topilgan. Dunyo bo'yicha 40 000 dan ortiq qo'lyozma parcha qayd etilgan.",
    significance: "Ko'hna uyg'ur tili va madaniyatini o'rganishda eng muhim manba. Markaziy Osiyo diniy va madaniy hayotini aks ettiradi.",
    transcription: "تۇرفان قول يازمىلىرى",
    transliteration: "Nom elig sutra. Maitrisimit. Sekiz yükmäk. Qutadgu bilig...",
    translation: "Turli diniy va dunyoviy matnlar majmuasi...",
    researchers: ["A. Grünwedel", "A. von Le Coq", "A. von Gabain"],
    bibliography: [
      "von Le Coq A. Auf Hellas Spuren in Ostturkistan. Leipzig, 1926",
      "Gabain A. von. Das Leben im uigurischen Königreich von Qočo. 1973"
    ],
    tags: ["uyg'ur", "qo'lyozma", "buddizm", "manixeylik", "turfan", "katta to'plam"],
    views: 2187,
    addedDate: "2024-06-01"
  },
  {
    id: 13,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Orkhon_valley_stele.jpg/640px-Orkhon_valley_stele.jpg",
    coords: [47.50, 101.00],
    title: "Suji Bitigi",
    subtitle: "Сужи битиги",
    era: "Uyg'ur xoqonligi",
    date: "753",
    century: 8,
    script: "runik",
    language: "Ko'hna turkiy",
    location: "Mo'g'uliston",
    region: "Markaziy Osiyo",
    category: "tosh_bitik",
    wordCount: 900,
    lineCount: 28,
    importance: 3,
    status: "Mo'g'ulistonda",
    description: "Suji bitigi Uyg'ur xoqonligi davriga oid tosh yodgorlik bo'lib, 753 yilga oiddir. Bu matn Uyg'ur xoqonligi va uning atrofdagi xalqlar bilan munosabatlarini aks ettiradi. Orxon vodiysidagi boshqa bitiglar bilan birgalikda o'rta asrlar turkiy tarixini yorituvchi muhim manbalardan biri hisoblanadi.",
    significance: "Uyg'ur xoqonligi davrining muhim epigrafik yodgorliklaridan biri.",
    transcription: "",
    transliteration: "Süzük atlıg yir anta biz ordugı... anta süke...",
    translation: "Suji deb ataladigan yerda biz qo'rg'on... u yerda qo'shinga...",
    researchers: ["L. Bazin", "T. Moriyasu"],
    bibliography: [
      "Bazin L., Moriyasu T. L'inscription de Suji. 1987"
    ],
    tags: ["runik", "uyg'ur", "epigrafik"],
    views: 432,
    addedDate: "2024-05-15"
  },
  {
    id: 14,
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Qutadghu_bilig_Herat_manuscript.jpg/640px-Qutadghu_bilig_Herat_manuscript.jpg",
    coords: [39.47, 75.98],
    title: "Qutadg'u Bilig",
    subtitle: "Қутадғу Билиг — Saodatga Elituvchi Bilim",
    era: "Qoraxoniylar davlati",
    date: "1069–1070",
    century: 11,
    script: "uyghur",
    language: "Ko'hna o'zbek (Qoraxoniy turk)",
    location: "Koshgar (Qashqar), O'rta Osiyo",
    region: "Markaziy Osiyo",
    category: "doston",
    wordCount: 13290,
    lineCount: 6645,
    importance: 5,
    status: "Vena, Qohira, Namangan (3 nusxa)",
    description: "Qutadg'u Bilig — Yusuf Xos Hojib tomonidan 1069–1070 yillarda Koshgarda yozilgan o'rta asr turkiy adabiyotining eng buyuk asarlaridan biri. Ushbu asar davlat boshqaruvi, axloq va insoniy munosabatlar haqida hikoya qiluvchi didaktik doston bo'lib, turkiy adabiyot tarixida alohida o'rin tutadi. Asar Qoraxoniy hukmdori Tavg'achxon Bog'roxonga taqdim etilgan.",
    significance: "Islomiy turkiy adabiyotining birinchi yirik asari. O'rta asr turkiy siyosiy falsafasini aks ettiradi. Masnav'iy janrida yozilgan.",
    transcription: "قتدغو بيلیگ",
    transliteration: "Ödrüm sözüg bilge kişi tınlasun, Ukuşluğ kişi köngli açlım bolsun. Okıp bilse bilgüsüz bilge bolur, Ukuşsuz ukuşluğ ükek tolur...",
    translation: "Sayqallangan so'zni dono odam tinglasin, Aqlli odamning ko'ngli ochiq bo'lsin. O'qib bilsa, bilmaydigan dono bo'ladi, Idroklining qalbini bilim to'ldiradi...",
    researchers: ["V.V. Radlov", "R.R. Arat", "Q. Karimov", "A.N. Kononov"],
    bibliography: [
      "Arat R.R. Kutadgu Bilig I: Metin. Ankara: TTK, 1947",
      "Karimov Q. Qutadg'u Bilig. Toshkent: Fan, 1971"
    ],
    tags: ["qoraxoniy", "uyg'ur yozuvi", "doston", "didaktik", "falsafa"],
    views: 3241,
    addedDate: "2024-06-15"
  },
  {
    id: 15,
    image: "https://upload.wikimedia.org/wikipedia/commons/2/25/Mahmud_al-Kashgari_world_map.jpg",
    coords: [33.32, 44.42],
    title: "Devonu Lug'atit Turk",
    subtitle: "ديوان لغات الترک — Turk Tillari Devoni",
    era: "Qoraxoniylar davlati",
    date: "1072–1074",
    century: 11,
    script: "arab",
    language: "Ko'hna turkiy + Arab",
    location: "Bag'dod (yozilgan), Koshgar (kelib chiqishi)",
    region: "Yaqin Sharq / Markaziy Osiyo",
    category: "lugat",
    wordCount: 9000,
    lineCount: 800,
    importance: 5,
    status: "Istanbul — Milliy kutubxona (yagona nusxa)",
    description: "Devonu Lug'atit Turk — Mahmud Koshg'ariy tomonidan 1072–1074 yillarda Bag'dodda yozilgan ko'hna turkiy tilning eng muhim ensiklopedik lug'ati. Ushbu asar turkiy qabilalarning tili, urf-odatlari, she'riyati va tarixi haqida noyob ma'lumotlar to'plami bo'lib, o'rta asr turkiy tilshunosligida tengi yo'q manba hisoblanadi. Xalifaga bag'ishlangan. Turk xalqlari yashagan hududlarning noyob xaritasini o'z ichiga oladi.",
    significance: "Ko'hna turkiy tilshunoslikning asosiy manbasi. 11-asr turkiy qabilalari haqida ensiklopedik ma'lumot beradi. Geografik xarita ham mavjud.",
    transcription: "ديوان لغات الترک",
    transliteration: "Öd tengri yaşar, Kün tengri yañılur. Insan oglı kamuğ ölür, şanı kalır...",
    translation: "Vaqt (tangri) yashar, Quyosh (tangri) yo'l adashadi. Insonning hammasi o'ladi, sha'ni qoladi...",
    researchers: ["K. Brockelmann", "B. Atalay", "A. Erdi", "S. Mutallibov"],
    bibliography: [
      "Atalay B. Divanü Lûgat-it-Türk I–IV. Ankara: TTK, 1941–1943",
      "Mahmud Koshg'ariy. Devonu Lug'atit Turk (O'zb. tarj.). Toshkent, 1960–1963"
    ],
    tags: ["qoraxoniy", "arab yozuvi", "lug'at", "ensiklopediya", "tilshunoslik", "xarita"],
    views: 4127,
    addedDate: "2024-07-01"
  }
];

// ============================================================
// localStorage-based Data Manager
// ============================================================
const CorpusDB = {
  STORAGE_KEY: "turkiy_korpus_monuments",
  SETTINGS_KEY: "turkiy_korpus_settings",

  init() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(DEFAULT_MONUMENTS));
    }
  },

  getAll() {
    this.init();
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    } catch {
      return DEFAULT_MONUMENTS;
    }
  },

  getById(id) {
    return this.getAll().find(m => m.id === parseInt(id));
  },

  add(monument) {
    const all = this.getAll();
    const maxId = all.length ? Math.max(...all.map(m => m.id)) : 0;
    const newMonument = {
      ...monument,
      id: maxId + 1,
      views: 0,
      addedDate: new Date().toISOString().split("T")[0]
    };
    all.push(newMonument);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    return newMonument;
  },

  update(id, data) {
    const all = this.getAll();
    const idx = all.findIndex(m => m.id === parseInt(id));
    if (idx === -1) return null;
    all[idx] = { ...all[idx], ...data };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    return all[idx];
  },

  delete(id) {
    const all = this.getAll().filter(m => m.id !== parseInt(id));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
  },

  incrementViews(id) {
    const m = this.getById(id);
    if (m) this.update(id, { views: (m.views || 0) + 1 });
  },

  search(query) {
    if (!query) return this.getAll();
    const q = query.toLowerCase();
    return this.getAll().filter(m =>
      m.title.toLowerCase().includes(q) ||
      (m.subtitle || "").toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      (m.transliteration || "").toLowerCase().includes(q) ||
      (m.translation || "").toLowerCase().includes(q) ||
      m.language.toLowerCase().includes(q) ||
      m.location.toLowerCase().includes(q) ||
      (m.tags || []).some(t => t.toLowerCase().includes(q))
    );
  },

  filter(opts = {}) {
    let data = this.getAll();
    if (opts.script && opts.script !== "all") data = data.filter(m => m.script === opts.script);
    if (opts.category && opts.category !== "all") data = data.filter(m => m.category === opts.category);
    if (opts.century && opts.century !== "all") data = data.filter(m => m.century === parseInt(opts.century));
    if (opts.region && opts.region !== "all") data = data.filter(m => m.region === opts.region);
    if (opts.query) {
      const q = opts.query.toLowerCase();
      data = data.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        (m.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
    if (opts.sort === "views") data.sort((a, b) => (b.views || 0) - (a.views || 0));
    else if (opts.sort === "date_asc") data.sort((a, b) => a.century - b.century);
    else if (opts.sort === "date_desc") data.sort((a, b) => b.century - a.century);
    else if (opts.sort === "title") data.sort((a, b) => a.title.localeCompare(b.title));
    return data;
  },

  getStats() {
    const all = this.getAll();
    const byCentury = {};
    const byScript = {};
    const byCategory = {};
    all.forEach(m => {
      byCentury[m.century] = (byCentury[m.century] || 0) + 1;
      byScript[m.script] = (byScript[m.script] || 0) + 1;
      byCategory[m.category] = (byCategory[m.category] || 0) + 1;
    });
    return {
      total: all.length,
      totalWords: all.reduce((s, m) => s + (m.wordCount || 0), 0),
      totalLines: all.reduce((s, m) => s + (m.lineCount || 0), 0),
      totalViews: all.reduce((s, m) => s + (m.views || 0), 0),
      scripts: Object.keys(byScript).length,
      byCentury,
      byScript,
      byCategory,
      topViewed: [...all].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5)
    };
  },

  getSettings() {
    try {
      return JSON.parse(localStorage.getItem(this.SETTINGS_KEY)) || {};
    } catch {
      return {};
    }
  },

  saveSettings(settings) {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  },

  reset() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(DEFAULT_MONUMENTS));
  }
};
