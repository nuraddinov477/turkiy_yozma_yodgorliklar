// ============================================================
// i18n — Ko'p til qo'llab-quvvatlash (UZ / RU / EN)
// ============================================================

window.I18N = (function () {
  const LANGS = {

    // ══════════════════════════════════════════════════════════
    uz: {
      // ── Navbar ──────────────────────────────────────────────
      'nav.home':        'Bosh sahifa',
      'nav.monuments':   'Yodgorliklar',
      'nav.timeline':    "Vaqt chizig'i",
      'nav.scripts':     'Yozuvlar',
      'nav.stats':       'Statistika',
      'nav.arch':        'Arxitektura',
      'nav.about':       'Haqida',
      'nav.more':        "Qo'shimcha",
      'nav.concordance': 'Konkordans',
      'nav.reader':      "O'qish",
      'nav.map':         'Xarita',
      'nav.compare':     'Taqqoslash',
      'nav.biblio':      'Bibliografiya',
      'nav.glossary':    "So'zlik",
      'nav.submit':      "Yodgorlik qo'shish",

      // ── Hero ────────────────────────────────────────────────
      'hero.badge':       "Elektron Korpus · VII–XI Asrlar",
      'hero.title1':      'Turkiy Yozma',
      'hero.title2':      'Yodgorliklar',
      'hero.title3':      'Elektron Korpusi',
      'hero.subtitle':    "Ko'ktürk, Uyg'ur va Qoraxoniy davrlariga mansub turkiy xalqlar yaratgan qadimiy yozma manbalarning ilmiy elektron to'plami.",
      'hero.btn.explore': "Korpusni ko'rish",
      'hero.btn.about':   'Loyiha haqida',
      'hero.btn.stats':   'Statistika',
      'hero.scroll':      'Bosing',

      // ── Counters ────────────────────────────────────────────
      'lbl.monuments': 'Yodgorlik',
      'lbl.scripts':   'Yozuv turi',
      'lbl.words':     "So'zlar",
      'lbl.lines':     'Satrlar',
      'lbl.views':     "Ko'rishlar",
      'lbl.all':       'Barchasi',
      'lbl.year':      'Yil',
      'lbl.century':   'Asr',
      'lbl.location':  'Joylashuv',
      'lbl.script':    'Yozuv',
      'lbl.category':  'Toifa',

      // ── Quick nav cards ─────────────────────────────────────
      'qnav.monuments.desc': "Barcha yozma manbalar",
      'qnav.timeline.desc':  "Xronologik tartib",
      'qnav.scripts.desc':   "Yozuv tizimlari va alifbo",
      'qnav.stats.desc':     "Tahlil va diagrammalar",
      'qnav.about.desc':     "Loyiha haqida ma'lumot",

      // ── Featured section ────────────────────────────────────
      'featured.title':    'Tanlangan',
      'featured.title2':   'Yodgorliklar',
      'featured.see_all':  "Barchasini ko'rish →",

      // ── Filter bar ──────────────────────────────────────────
      'filter.search':   'Yodgorlik qidirish...',
      'filter.all':      'Barchasi',
      'filter.script':   'Yozuv:',
      'filter.category': 'Tur:',
      'filter.sort':     'Saralash',
      'sort.year_asc':   'Yil (eski)',
      'sort.year_desc':  'Yil (yangi)',
      'sort.views':      "Ko'p ko'rilgan",
      'sort.alpha':      'Alifbo',

      // ── Buttons ─────────────────────────────────────────────
      'btn.read':    "O'qish",
      'btn.compare': 'Taqqoslash',
      'btn.export':  'Eksport',
      'btn.search':  'Qidirish',
      'btn.close':   'Yopish',
      'btn.back':    '← Orqaga',
      'btn.save':    'Saqlash',
      'btn.submit':  '📤 Yuborish',
      'btn.cancel':  'Bekor qilish',

      // ── Monument card ───────────────────────────────────────
      'card.read':  "O'qish",
      'card.views': "ko'rishlar",
      'card.year':  'yil',

      // ── Modal ───────────────────────────────────────────────
      'modal.overview':    'Umumiy',
      'modal.text':        'Matn',
      'modal.translation': 'Tarjima',
      'modal.info':        "Ma'lumot",
      'modal.tab.about':   'Haqida',
      'modal.tab.text':    'Matn',
      'modal.tab.research':'Tadqiqot',
      'modal.close':       'Yopish',
      'modal.read':        "To'liq o'qish",
      'modal.compare':     'Taqqoslash',

      // ── Pages ───────────────────────────────────────────────
      'page.monuments':      'Yodgorliklar',
      'page.monuments.sub':  "Ko'ktürk, Uyg'ur va boshqa yozuvlardagi manbalar",
      'page.timeline':       "Vaqt Chizig'i",
      'page.timeline.sub':   'VII–XI asrlar xronologiyasi',
      'page.scripts':        'Yozuvlar',
      'page.scripts.sub':    'Yozuv tizimlari va alifbolar',
      'page.stats':          'Statistika',
      'page.stats.sub':      'Raqamlar va tahlil',
      'page.arch':           'Arxitektura',
      'page.about':          'Haqida',
      'page.concordance':    'Konkordans Qidiruvi',
      'page.concordance.sub':'KWIC formatida so\'z qidirish',
      'page.reader':         "Matn O'qish",
      'page.map':            'Yodgorliklar Xaritasi',
      'page.map.sub':        'Topilgan joy va tarqalish geografiyasi',
      'page.compare':        'Yodgorliklarni Taqqoslash',
      'page.compare.sub':    'Ikkita yodgorlikni yonma-yon tahlil qiling',
      'page.biblio':         'Bibliografiya',
      'page.biblio.sub':     'Tadqiqotchilar va manbalar',
      'page.glossary':       "Ko'hna Turkiy So'zlik",
      'page.glossary.sub':   "Ko'hna turkiy so'zlar va iboralar",
      'page.submit':         "Yodgorlik Qo'shish",
      'page.submit.sub':     "Siz bilgan yodgorlikni ma'lumotlar bazasiga qo'shing",

      // ── Stats page ──────────────────────────────────────────
      'stats.title':         'Statistika va Tahlil',
      'stats.subtitle':      "Korpus ma'lumotlari asosida raqamli ko'rsatkichlar",
      'stats.by_script':     'Yozuv turlari',
      'stats.by_century':    "Asrlar bo'yicha",
      'stats.by_category':   "Toifalar bo'yicha",
      'stats.total':         'Jami yodgorliklar',
      'stats.words':         "Jami so'zlar",

      // ── Concordance ─────────────────────────────────────────
      'kwic.placeholder':    "So'z kiriting… masalan: tengri, türk, bitig",
      'kwic.btn':            'Qidirish',
      'kwic.no_results':     'Natija topilmadi',
      'kwic.results':        'natija',
      'kwic.field.text':     'Matn',
      'kwic.field.translit': 'Transliteratsiya',
      'kwic.field.transl':   'Tarjima',

      // ── Compare page ────────────────────────────────────────
      'compare.left':   '1-chi yodgorlik',
      'compare.right':  '2-chi yodgorlik',
      'compare.select': '— Tanlang —',
      'compare.hint':   'Ikkita yodgorlik tanlansin',

      // ── Glossary ────────────────────────────────────────────
      'sozlik.placeholder': "So'z qidiring… masalan: tengri, türk, qagan",
      'sozlik.all':         'Barchasi',
      'sozlik.pos.noun':    'Ot',
      'sozlik.pos.adj':     'Sifat',
      'sozlik.pos.verb':    "Fe'l",
      'sozlik.pos.adv':     'Ravish',

      // ── Submission form ─────────────────────────────────────
      'submit.section.monument': "📋 Yodgorlik ma'lumotlari",
      'submit.section.author':   "👤 Muallif ma'lumotlari",
      'submit.section.text':     "📝 Matnlar (ixtiyoriy)",
      'submit.lbl.title':        "Yodgorlik nomi",
      'submit.lbl.year':         "Yil (taxminiy)",
      'submit.lbl.location':     "Joylashuv",
      'submit.lbl.script':       "Yozuv turi",
      'submit.lbl.category':     "Kategoriya",
      'submit.lbl.language':     "Til",
      'submit.lbl.description':  "Tavsif",
      'submit.lbl.image':        "Rasm URL",
      'submit.lbl.image_file':   "Rasm fayli",
      'submit.lbl.document':     "Hujjat",
      'submit.lbl.source':       "Manba / Adabiyot",
      'submit.lbl.author':       "Ismingiz",
      'submit.lbl.email':        "Elektron pochta",
      'submit.lbl.institution':  "Tashkilot / Universitet",
      'submit.lbl.bio':          "O'zingiz haqingizda",
      'submit.lbl.translit':     "Transliteratsiya",
      'submit.lbl.translation':  "Tarjima",
      'submit.btn':              "📤 Yuborish",
      'submit.sending':          "⏳ Yuborilmoqda...",
      'submit.success.title':    "Muvaffaqiyatli yuborildi!",
      'submit.success.text':     "Taklifingiz admin tomonidan ko'rib chiqilgandan so'ng saytda ko'rinadi.",
      'submit.req':              "*",
      'submit.opt':              "(ixtiyoriy)",

      // ── Search overlay ──────────────────────────────────────
      'search.placeholder': "Yodgorlik nomi, matn, tadqiqotchi...",

      // ── About page ──────────────────────────────────────────
      'about.title':    'Loyiha',
      'about.title2':   'Haqida',
      'about.subtitle': 'Turkiy yozma yodgorliklar elektron korpusi loyihasi',
      'about.mission':  "Ushbu elektron korpus VII–XI asrlar oralig'ida yaratilgan turkiy yozma yodgorliklarni to'plash, tizimlashtirish va ilmiy jamoatchilikka taqdim etish maqsadida yaratilgan.",

      // ── Footer ──────────────────────────────────────────────
      'footer.about':        "Ko'ktürk, Uyg'ur va Qoraxoniy davrlariga mansub VII–XI asrlar turkiy yozma yodgorliklarining ilmiy elektron to'plami.",
      'footer.quicklinks':   'Tezkor havolalar',
      'footer.research':     'Tadqiqotchilarga',
      'footer.contact':      "Bog'lanish",
      'footer.location':     "Toshkent, O'zbekiston",
      'footer.export':       'JSON eksport',
      'footer.concordance':  'Konkordans qidiruvi',
      'footer.map':          'Yodgorliklar xaritasi',
      'footer.compare':      'Taqqoslash vositasi',
      'footer.biblio':       'Bibliografiya',
      'footer.sozlik':       "Ko'hna turkiy so'zlik",
      'footer.rights':       'Barcha huquqlar himoyalangan.',

      // ── Timeline labels ─────────────────────────────────────
      'timeline.century':  '-asr',
      'timeline.bc':       'mil.av.',
      'timeline.ad':       'mil.',
      'timeline.era.early':  "Erta o'rta asrlar",
      'timeline.era.middle': "O'rta asrlar",

      // ── Script names ────────────────────────────────────────
      'script.koktürk': 'Ko\'ktürk (Runik)',
      "script.uyg'ur":  "Uyg'ur",
      'script.arab':    'Arab',
      'script.sogd':    "So'g'diy",
      'script.boshqa':  'Boshqa',

      // ── Category names ──────────────────────────────────────
      'cat.bitiglar':    'Tosh bitiklar',
      'cat.qollanmalar': "Qo'lyozmalar",
      'cat.adabiy':      'Adabiy asarlar',
      'cat.diniy':       'Diniy matnlar',
      'cat.boshqa':      'Boshqa',

      // ── Error / empty states ────────────────────────────────
      'err.no_results':  'Natija topilmadi',
      'err.loading':     'Yuklanmoqda...',
      'err.network':     'Tarmoq xatosi. Internet aloqangizni tekshiring.',
    },

    // ══════════════════════════════════════════════════════════
    ru: {
      // ── Navbar ──────────────────────────────────────────────
      'nav.home':        'Главная',
      'nav.monuments':   'Памятники',
      'nav.timeline':    'Хронология',
      'nav.scripts':     'Письмена',
      'nav.stats':       'Статистика',
      'nav.arch':        'Архитектура',
      'nav.about':       'О проекте',
      'nav.more':        'Ещё',
      'nav.concordance': 'Конкорданс',
      'nav.reader':      'Читать',
      'nav.map':         'Карта',
      'nav.compare':     'Сравнение',
      'nav.biblio':      'Библиография',
      'nav.glossary':    'Словарь',
      'nav.submit':      'Добавить памятник',

      // ── Hero ────────────────────────────────────────────────
      'hero.badge':       'Электронный корпус · VII–XI вв.',
      'hero.title1':      'Тюркские Письменные',
      'hero.title2':      'Памятники',
      'hero.title3':      'Электронный Корпус',
      'hero.subtitle':    'Полная научная база тюркских письменных памятников VII–XI веков эпох кёктюрков, уйгуров и Карахан.',
      'hero.btn.explore': 'Просмотр памятников',
      'hero.btn.about':   'О проекте',
      'hero.btn.stats':   'Статистика',
      'hero.scroll':      'Листайте',

      // ── Counters ────────────────────────────────────────────
      'lbl.monuments': 'Памятников',
      'lbl.scripts':   'Видов письма',
      'lbl.words':     'Слова',
      'lbl.lines':     'Строки',
      'lbl.views':     'Просмотры',
      'lbl.all':       'Все',
      'lbl.year':      'Год',
      'lbl.century':   'Век',
      'lbl.location':  'Местонахождение',
      'lbl.script':    'Письмо',
      'lbl.category':  'Категория',

      // ── Quick nav cards ─────────────────────────────────────
      'qnav.monuments.desc': "Все письменные источники",
      'qnav.timeline.desc':  "Хронологический порядок",
      'qnav.scripts.desc':   "Системы письма и алфавиты",
      'qnav.stats.desc':     "Анализ и диаграммы",
      'qnav.about.desc':     "Информация о проекте",

      // ── Featured section ────────────────────────────────────
      'featured.title':   'Избранные',
      'featured.title2':  'Памятники',
      'featured.see_all': 'Смотреть все →',

      // ── Filter bar ──────────────────────────────────────────
      'filter.search':   'Поиск памятников...',
      'filter.all':      'Все',
      'filter.script':   'Письмо:',
      'filter.category': 'Тип:',
      'filter.sort':     'Сортировка',
      'sort.year_asc':   'Год (старые)',
      'sort.year_desc':  'Год (новые)',
      'sort.views':      'Популярные',
      'sort.alpha':      'По алфавиту',

      // ── Buttons ─────────────────────────────────────────────
      'btn.read':    'Читать',
      'btn.compare': 'Сравнить',
      'btn.export':  'Экспорт',
      'btn.search':  'Поиск',
      'btn.close':   'Закрыть',
      'btn.back':    '← Назад',
      'btn.save':    'Сохранить',
      'btn.submit':  '📤 Отправить',
      'btn.cancel':  'Отмена',

      // ── Monument card ───────────────────────────────────────
      'card.read':  'Читать',
      'card.views': 'просмотров',
      'card.year':  'год',

      // ── Modal ───────────────────────────────────────────────
      'modal.overview':    'Обзор',
      'modal.text':        'Текст',
      'modal.translation': 'Перевод',
      'modal.info':        'Сведения',
      'modal.tab.about':   'Описание',
      'modal.tab.text':    'Текст',
      'modal.tab.research':'Исследование',
      'modal.close':       'Закрыть',
      'modal.read':        'Читать полностью',
      'modal.compare':     'Сравнить',

      // ── Pages ───────────────────────────────────────────────
      'page.monuments':      'Памятники',
      'page.monuments.sub':  'Источники на письмах кёктюрков, уйгуров и других',
      'page.timeline':       'Хронология',
      'page.timeline.sub':   'Хронология VII–XI веков',
      'page.scripts':        'Письмена',
      'page.scripts.sub':    'Системы письма и алфавиты',
      'page.stats':          'Статистика',
      'page.stats.sub':      'Цифры и анализ',
      'page.arch':           'Архитектура',
      'page.about':          'О проекте',
      'page.concordance':    'Конкордансный поиск',
      'page.concordance.sub':'Поиск слов в формате KWIC',
      'page.reader':         'Чтение текста',
      'page.map':            'Карта памятников',
      'page.map.sub':        'Место находки и география распространения',
      'page.compare':        'Сравнение памятников',
      'page.compare.sub':    'Сравнительный анализ двух памятников',
      'page.biblio':         'Библиография',
      'page.biblio.sub':     'Исследователи и источники',
      'page.glossary':       'Древнетюркский словарь',
      'page.glossary.sub':   'Слова и выражения на древнетюркском',
      'page.submit':         'Добавить памятник',
      'page.submit.sub':     'Добавьте известный вам памятник в базу данных',

      // ── Stats page ──────────────────────────────────────────
      'stats.title':      'Статистика и Анализ',
      'stats.subtitle':   'Цифровые показатели на основе данных корпуса',
      'stats.by_script':  'По типу письма',
      'stats.by_century': 'По векам',
      'stats.by_category':'По категориям',
      'stats.total':      'Всего памятников',
      'stats.words':      'Всего слов',

      // ── Concordance ─────────────────────────────────────────
      'kwic.placeholder':    "Введите слово… например: tengri, türk, bitig",
      'kwic.btn':            'Поиск',
      'kwic.no_results':     'Результаты не найдены',
      'kwic.results':        'результат',
      'kwic.field.text':     'Текст',
      'kwic.field.translit': 'Транслитерация',
      'kwic.field.transl':   'Перевод',

      // ── Compare page ────────────────────────────────────────
      'compare.left':   '1-й памятник',
      'compare.right':  '2-й памятник',
      'compare.select': '— Выберите —',
      'compare.hint':   'Выберите два памятника',

      // ── Glossary ────────────────────────────────────────────
      'sozlik.placeholder': "Поиск слова… например: tengri, türk, qagan",
      'sozlik.all':         'Все',
      'sozlik.pos.noun':    'Сущ.',
      'sozlik.pos.adj':     'Прил.',
      'sozlik.pos.verb':    'Глаг.',
      'sozlik.pos.adv':     'Нареч.',

      // ── Submission form ─────────────────────────────────────
      'submit.section.monument': "📋 Данные памятника",
      'submit.section.author':   "👤 Данные автора",
      'submit.section.text':     "📝 Тексты (необязательно)",
      'submit.lbl.title':        "Название памятника",
      'submit.lbl.year':         "Год (приблизительно)",
      'submit.lbl.location':     "Местонахождение",
      'submit.lbl.script':       "Тип письма",
      'submit.lbl.category':     "Категория",
      'submit.lbl.language':     "Язык",
      'submit.lbl.description':  "Описание",
      'submit.lbl.image':        "URL изображения",
      'submit.lbl.image_file':   "Файл изображения",
      'submit.lbl.document':     "Документ",
      'submit.lbl.source':       "Источник / Литература",
      'submit.lbl.author':       "Ваше имя",
      'submit.lbl.email':        "Электронная почта",
      'submit.lbl.institution':  "Организация / Университет",
      'submit.lbl.bio':          "О себе",
      'submit.lbl.translit':     "Транслитерация",
      'submit.lbl.translation':  "Перевод",
      'submit.btn':              "📤 Отправить",
      'submit.sending':          "⏳ Отправка...",
      'submit.success.title':    "Успешно отправлено!",
      'submit.success.text':     "Ваша заявка будет опубликована после проверки администратором.",
      'submit.req':              "*",
      'submit.opt':              "(необязательно)",

      // ── Search overlay ──────────────────────────────────────
      'search.placeholder': "Название, текст, исследователь...",

      // ── About page ──────────────────────────────────────────
      'about.title':    'О',
      'about.title2':   'Проекте',
      'about.subtitle': 'Электронный корпус тюркских письменных памятников',
      'about.mission':  'Данный электронный корпус создан с целью сбора, систематизации и представления научному сообществу тюркских письменных памятников VII–XI веков.',

      // ── Footer ──────────────────────────────────────────────
      'footer.about':       'Научная электронная база тюркских письменных памятников VII–XI веков эпох Кёктюрк, Уйгуров и Карахан.',
      'footer.quicklinks':  'Быстрые ссылки',
      'footer.research':    'Исследователям',
      'footer.contact':     'Контакты',
      'footer.location':    'Ташкент, Узбекистан',
      'footer.export':      'JSON экспорт',
      'footer.concordance': 'Конкордансный поиск',
      'footer.map':         'Карта памятников',
      'footer.compare':     'Инструмент сравнения',
      'footer.biblio':      'Библиография',
      'footer.sozlik':      'Древнетюркский словарь',
      'footer.rights':      'Все права защищены.',

      // ── Timeline labels ─────────────────────────────────────
      'timeline.century':    '-й век',
      'timeline.bc':         'до н.э.',
      'timeline.ad':         'н.э.',
      'timeline.era.early':  'Раннее Средневековье',
      'timeline.era.middle': 'Средние века',

      // ── Script names ────────────────────────────────────────
      'script.koktürk': 'Кёктюркское (Руническое)',
      "script.uyg'ur":  'Уйгурское',
      'script.arab':    'Арабское',
      'script.sogd':    'Согдийское',
      'script.boshqa':  'Другое',

      // ── Category names ──────────────────────────────────────
      'cat.bitiglar':    'Надписи на камне',
      'cat.qollanmalar': 'Рукописи',
      'cat.adabiy':      'Литературные тексты',
      'cat.diniy':       'Религиозные тексты',
      'cat.boshqa':      'Другое',

      // ── Error / empty states ────────────────────────────────
      'err.no_results': 'Результаты не найдены',
      'err.loading':    'Загрузка...',
      'err.network':    'Ошибка сети. Проверьте интернет-соединение.',
    },

    // ══════════════════════════════════════════════════════════
    en: {
      // ── Navbar ──────────────────────────────────────────────
      'nav.home':        'Home',
      'nav.monuments':   'Monuments',
      'nav.timeline':    'Timeline',
      'nav.scripts':     'Scripts',
      'nav.stats':       'Statistics',
      'nav.arch':        'Architecture',
      'nav.about':       'About',
      'nav.more':        'More',
      'nav.concordance': 'Concordance',
      'nav.reader':      'Reader',
      'nav.map':         'Map',
      'nav.compare':     'Compare',
      'nav.biblio':      'Bibliography',
      'nav.glossary':    'Glossary',
      'nav.submit':      'Add Monument',

      // ── Hero ────────────────────────────────────────────────
      'hero.badge':       'Digital Corpus · 7th–11th Century',
      'hero.title1':      'Turkic Written',
      'hero.title2':      'Monuments',
      'hero.title3':      'Digital Corpus',
      'hero.subtitle':    'A comprehensive scholarly database of Turkic written monuments from the 7th–11th centuries — runic inscriptions, manuscripts, epics and glossaries.',
      'hero.btn.explore': 'Browse Corpus',
      'hero.btn.about':   'About project',
      'hero.btn.stats':   'Statistics',
      'hero.scroll':      'Scroll',

      // ── Counters ────────────────────────────────────────────
      'lbl.monuments': 'Monuments',
      'lbl.scripts':   'Script types',
      'lbl.words':     'Words',
      'lbl.lines':     'Lines',
      'lbl.views':     'Views',
      'lbl.all':       'All',
      'lbl.year':      'Year',
      'lbl.century':   'Century',
      'lbl.location':  'Location',
      'lbl.script':    'Script',
      'lbl.category':  'Category',

      // ── Quick nav cards ─────────────────────────────────────
      'qnav.monuments.desc': "All written sources",
      'qnav.timeline.desc':  "Chronological order",
      'qnav.scripts.desc':   "Writing systems & alphabets",
      'qnav.stats.desc':     "Analysis & charts",
      'qnav.about.desc':     "Project information",

      // ── Featured section ────────────────────────────────────
      'featured.title':   'Featured',
      'featured.title2':  'Monuments',
      'featured.see_all': 'See all →',

      // ── Filter bar ──────────────────────────────────────────
      'filter.search':   'Search monuments...',
      'filter.all':      'All',
      'filter.script':   'Script:',
      'filter.category': 'Type:',
      'filter.sort':     'Sort',
      'sort.year_asc':   'Year (oldest)',
      'sort.year_desc':  'Year (newest)',
      'sort.views':      'Most viewed',
      'sort.alpha':      'Alphabetical',

      // ── Buttons ─────────────────────────────────────────────
      'btn.read':    'Read',
      'btn.compare': 'Compare',
      'btn.export':  'Export',
      'btn.search':  'Search',
      'btn.close':   'Close',
      'btn.back':    '← Back',
      'btn.save':    'Save',
      'btn.submit':  '📤 Submit',
      'btn.cancel':  'Cancel',

      // ── Monument card ───────────────────────────────────────
      'card.read':  'Read',
      'card.views': 'views',
      'card.year':  'AD',

      // ── Modal ───────────────────────────────────────────────
      'modal.overview':    'Overview',
      'modal.text':        'Text',
      'modal.translation': 'Translation',
      'modal.info':        'Info',
      'modal.tab.about':   'About',
      'modal.tab.text':    'Text',
      'modal.tab.research':'Research',
      'modal.close':       'Close',
      'modal.read':        'Read full text',
      'modal.compare':     'Compare',

      // ── Pages ───────────────────────────────────────────────
      'page.monuments':      'Monuments',
      'page.monuments.sub':  'Sources in Göktürk, Uyghur and other scripts',
      'page.timeline':       'Timeline',
      'page.timeline.sub':   '7th–11th century chronology',
      'page.scripts':        'Scripts',
      'page.scripts.sub':    'Writing systems and alphabets',
      'page.stats':          'Statistics',
      'page.stats.sub':      'Numbers and analysis',
      'page.arch':           'Architecture',
      'page.about':          'About',
      'page.concordance':    'Concordance Search',
      'page.concordance.sub':'Word search in KWIC format',
      'page.reader':         'Text Reader',
      'page.map':            'Monuments Map',
      'page.map.sub':        'Find location and geographical distribution',
      'page.compare':        'Compare Monuments',
      'page.compare.sub':    'Side-by-side comparative analysis',
      'page.biblio':         'Bibliography',
      'page.biblio.sub':     'Researchers and sources',
      'page.glossary':       'Old Turkic Glossary',
      'page.glossary.sub':   'Old Turkic words and phrases',
      'page.submit':         'Add Monument',
      'page.submit.sub':     'Add a monument you know to the database',

      // ── Stats page ──────────────────────────────────────────
      'stats.title':      'Statistics & Analysis',
      'stats.subtitle':   'Digital metrics based on corpus data',
      'stats.by_script':  'By script type',
      'stats.by_century': 'By century',
      'stats.by_category':'By category',
      'stats.total':      'Total monuments',
      'stats.words':      'Total words',

      // ── Concordance ─────────────────────────────────────────
      'kwic.placeholder':    "Enter word… e.g.: tengri, türk, bitig",
      'kwic.btn':            'Search',
      'kwic.no_results':     'No results found',
      'kwic.results':        'result',
      'kwic.field.text':     'Text',
      'kwic.field.translit': 'Transliteration',
      'kwic.field.transl':   'Translation',

      // ── Compare page ────────────────────────────────────────
      'compare.left':   '1st monument',
      'compare.right':  '2nd monument',
      'compare.select': '— Select —',
      'compare.hint':   'Select two monuments',

      // ── Glossary ────────────────────────────────────────────
      'sozlik.placeholder': "Search word… e.g.: tengri, türk, qagan",
      'sozlik.all':         'All',
      'sozlik.pos.noun':    'Noun',
      'sozlik.pos.adj':     'Adj.',
      'sozlik.pos.verb':    'Verb',
      'sozlik.pos.adv':     'Adv.',

      // ── Submission form ─────────────────────────────────────
      'submit.section.monument': "📋 Monument data",
      'submit.section.author':   "👤 Author data",
      'submit.section.text':     "📝 Texts (optional)",
      'submit.lbl.title':        "Monument name",
      'submit.lbl.year':         "Year (approximate)",
      'submit.lbl.location':     "Location",
      'submit.lbl.script':       "Script type",
      'submit.lbl.category':     "Category",
      'submit.lbl.language':     "Language",
      'submit.lbl.description':  "Description",
      'submit.lbl.image':        "Image URL",
      'submit.lbl.image_file':   "Image file",
      'submit.lbl.document':     "Document",
      'submit.lbl.source':       "Source / References",
      'submit.lbl.author':       "Your name",
      'submit.lbl.email':        "Email",
      'submit.lbl.institution':  "Institution / University",
      'submit.lbl.bio':          "About yourself",
      'submit.lbl.translit':     "Transliteration",
      'submit.lbl.translation':  "Translation",
      'submit.btn':              "📤 Submit",
      'submit.sending':          "⏳ Submitting...",
      'submit.success.title':    "Successfully submitted!",
      'submit.success.text':     "Your submission will appear on the site after admin review.",
      'submit.req':              "*",
      'submit.opt':              "(optional)",

      // ── Search overlay ──────────────────────────────────────
      'search.placeholder': "Monument name, text, researcher...",

      // ── About page ──────────────────────────────────────────
      'about.title':    'About the',
      'about.title2':   'Project',
      'about.subtitle': 'Turkic written monuments digital corpus project',
      'about.mission':  'This digital corpus was created to collect, systematize and present to the scholarly community Turkic written monuments from the 7th–11th centuries.',

      // ── Footer ──────────────────────────────────────────────
      'footer.about':       'A comprehensive scholarly database of Turkic written monuments from the 7th–11th centuries of the Göktürk, Uyghur and Kara-Khanid eras.',
      'footer.quicklinks':  'Quick links',
      'footer.research':    'For researchers',
      'footer.contact':     'Contact',
      'footer.location':    'Tashkent, Uzbekistan',
      'footer.export':      'JSON export',
      'footer.concordance': 'Concordance search',
      'footer.map':         'Monuments map',
      'footer.compare':     'Comparison tool',
      'footer.biblio':      'Bibliography',
      'footer.sozlik':      'Old Turkic glossary',
      'footer.rights':      'All rights reserved.',

      // ── Timeline labels ─────────────────────────────────────
      'timeline.century':    'th century',
      'timeline.bc':         'BC',
      'timeline.ad':         'AD',
      'timeline.era.early':  'Early Middle Ages',
      'timeline.era.middle': 'Middle Ages',

      // ── Script names ────────────────────────────────────────
      'script.koktürk': 'Göktürk (Runic)',
      "script.uyg'ur":  'Uyghur',
      'script.arab':    'Arabic',
      'script.sogd':    'Sogdian',
      'script.boshqa':  'Other',

      // ── Category names ──────────────────────────────────────
      'cat.bitiglar':    'Stone inscriptions',
      'cat.qollanmalar': 'Manuscripts',
      'cat.adabiy':      'Literary texts',
      'cat.diniy':       'Religious texts',
      'cat.boshqa':      'Other',

      // ── Error / empty states ────────────────────────────────
      'err.no_results': 'No results found',
      'err.loading':    'Loading...',
      'err.network':    'Network error. Check your internet connection.',
    },
  };

  let current = localStorage.getItem('turkiy_lang') || 'uz';

  function t(key) {
    return (LANGS[current] || LANGS.uz)[key] || (LANGS.uz[key] || key);
  }

  function setLang(lang) {
    if (!LANGS[lang]) return;
    current = lang;
    localStorage.setItem('turkiy_lang', lang);
    applyAll();
    document.dispatchEvent(new CustomEvent('langchange', { detail: lang }));
  }

  function getLang() { return current; }

  function applyAll() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const val = t(el.dataset.i18n);
      el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      el.placeholder = t(el.dataset.i18nPh);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = t(el.dataset.i18nTitle);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      // faqat xavfsiz, developer tomonidan yozilgan HTML uchun
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === current);
    });
  }

  return { t, setLang, getLang, applyAll, LANGS };
})();
