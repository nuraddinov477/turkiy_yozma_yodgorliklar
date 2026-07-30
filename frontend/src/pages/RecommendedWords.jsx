import { useState } from 'react'
import { useApp } from '../context/AppContext'

// O'zbek tili qoida va me'yorlari asosida shakllantirilgan hamda rasmiy
// muomalaga kiritiladigan yangi so'z va atamalar ro'yxati (Davlat tomonidan tavsiya etilgan).
const RECOMMENDED_WORDS = [
  { foreign: 'Аккомпанемент', recommended: "Jo'rnavoz", meaning: "Fransuz tilidan o'zlashgan so'z bo'lib, \"jo'r bo'lmoq\", \"ashula yoki musiqaga jo'r bo'lish\" degan ma'nolarni bildiradi." },
  { foreign: 'Антракт', recommended: 'Tanaffus', meaning: "Fransuz tilidan o'zlashgan so'z bo'lib, spektakl pardalari yoki konsert bo'limlari orasidagi tanaffus nomi hisoblanadi." },
  { foreign: 'Арьерсцена', recommended: 'Sahnaorti', meaning: "Fransuz va yunon tillaridan o'zlashgan so'z bo'lib, \"sahnaorti\" degan ma'noni bildiradi." },
  { foreign: 'АСКУЭ', foreignFull: 'Автоматизированная система контроля и учета электроэнергии', recommended: 'EHNAT', recommendedFull: 'Energiya hisobi va nazoratining avtomatlashtirilgan tizimi', meaning: "Rus tili orqali o'zlashgan so'z birikmasi bo'lib, \"Energiya hisobi va nazoratining avtomatlashtirilgan tizimi\" ma'nosini bildiradi." },
  { foreign: 'Банкет', recommended: 'Ziyofat', meaning: "Fransuz tilidan o'zlashgan so'z bo'lib, \"tantanali ziyofat\", \"maxsus uyushtiriladigan ziyofat\" degan ma'noni bildiradi." },
  { foreign: 'Башмак', recommended: 'Boshmoq', meaning: "Rus tiliga turkiy tildan o'zlashgan so'z bo'lib, \"boshmoq\", ya'ni oyoq kiyimi ma'nosini bildiradi." },
  { foreign: 'БГС', foreignFull: 'Барабанные грануляторы – сушилки', recommended: 'DQU', recommendedFull: 'Donalab quritish uskunasi', meaning: "Rus tili orqali o'zlashgan so'z birikmasi bo'lib, kimyo sanoatida xomashyoni quritish uchun mo'ljallangan uskuna." },
  { foreign: 'БПЛА', foreignFull: 'Беспилотный летательный аппарат', recommended: 'UHA', recommendedFull: 'Uchuvchisiz havo apparati', meaning: "Rus tili orqali o'zlashgan so'z birikmasi bo'lib, \"uchuvchisiz uchish qurilmasi\" ma'nosini bildiradi." },
  { foreign: 'Брекеты', recommended: 'Tishsim', meaning: "Ingliz tilidan o'zlashgan so'z bo'lib, \"qavs\" degan ma'noni bildiradi." },
  { foreign: 'Бренд', recommended: 'Xosnom', meaning: "Eski skandinavcha so'zdan olingan bo'lib, tovar yoki xizmatlarning xosnomini boshqalardan ajratib turuvchi atama sifatida ishlatilib kelinmoqda." },
  { foreign: 'Вебинар', recommended: "Vebyig'in", meaning: "Ingliz tilida \"tarmoqda o'tkaziladigan seminar, yig'in\" ma'nosini bildiradi." },
  { foreign: 'Датчик', recommended: 'Sezgich', meaning: "Rus tili orqali o'zlashgan so'z bo'lib, tashqi ta'sirlarni o'lchov natijasini qabul qilish va uzatishga mo'ljallangan qurilma ma'nosini bildiradi." },
  { foreign: 'Дедлайн', recommended: "So'ngmuddat", meaning: "Ingliz tilidan o'zlashgan so'z bo'lib, \"oxirgi muddat\", \"so'nggi muddat\" ma'nolarida ishlatilib kelinmoqda." },
  { foreign: 'Декорация', recommended: 'Sahnabezak', meaning: "Fransuz tilidan o'zlashgan so'z bo'lib, \"maydon va sahnani bezatish\", \"badiiy jihozlash\" ma'nolarida qo'llanmoqda." },
  { foreign: 'ДПО', foreignFull: 'Дробильно-помольное отделение', recommended: 'MYB', recommendedFull: "Maydalash-yanchish bo'linmasi", meaning: "Rus tili orqali o'zlashgan so'z birikmasi bo'lib, sanoat tarmoqlari, qurilishda materiallarni maydalash va yanchishda qo'llanadi." },
  { foreign: 'ЕЭС', foreignFull: 'Единая электрическая система', recommended: 'YET', recommendedFull: 'Yagona elektr tizimi', meaning: "Rus tili orqali o'zlashgan so'z birikmasi bo'lib, \"Yagona elektr tizimi\" ma'nosini bildiradi." },
  { foreign: 'Инвентаризация', recommended: 'Xatlov', meaning: "Lotincha \"inventarium\" so'zidan olingan bo'lib, \"mol-mulk ro'yxati, xatlovi\" ma'nosini bildirgan." },
  { foreign: 'Интерактив', recommended: 'Interfaol', meaning: "Ingliz tilidan o'zlashgan so'z bo'lib, \"o'zaro, birgalikda harakat qilish\" ma'nosini bildiradi." },
  { foreign: 'КВФ', foreignFull: 'Карусельный вакуумный фильтр', recommended: 'AVF', recommendedFull: 'Aylanma vakuum filtri', meaning: "Rus tili orqali o'zlashgan so'z birikmasi bo'lib, texnologik yarimtayyor mahsulotni filtrlab beruvchi aylanma vakuum uskunasi." },
  { foreign: 'Комментарий', recommended: 'Izoh', meaning: "Lotincha \"commentarius\" so'zidan olingan bo'lib, \"tushuntirish\", \"eslatma\", \"sharh\", \"izoh\" ma'nosini bildirgan." },
  { foreign: 'Миксер', recommended: "Qorg'ich", meaning: "Ingliz tilidan o'zlashgan so'z bo'lib, narsani aralashtirib beruvchi qurilma nomini bildiradi." },
  { foreign: 'ЛВФ', foreignFull: 'Ленточный вакуумный фильтр', recommended: 'TVF', recommendedFull: 'Tasmali vakuum filtri', meaning: "Rus tili orqali o'zlashgan so'z birikmasi bo'lib, texnologik yarimtayyor mahsulotni filtrlovchi tasmali vakuum uskunasi." },
  { foreign: 'Палатка', recommended: 'Chodir', meaning: "Rus tili orqali o'zlashgan so'z bo'lib, \"matodan tayyorlangan vaqtinchalik boshpana\" ma'nosini bildiradi." },
  { foreign: 'Негатив', recommended: 'Salbiy', meaning: "Lotincha \"negativus\" so'zidan olingan bo'lib, \"manfiy\", \"salbiy\" ma'nosini bildirgan." },
  { foreign: 'Пенопласт', recommended: "Po'kak", meaning: "Rus tili orqali o'zlashgan so'z bo'lib, \"qotgan ko'pik yoki po'kak (pena) asosli polimer modda\" ma'nosini bildiradi." },
  { foreign: 'Пеноблок', recommended: "Po'kak g'isht", meaning: "Rus tili orqali o'zlashgan so'z bo'lib, \"qotgan ko'pik yoki po'kak asosli qirrali bo'lak\" ma'nosini bildiradi." },
  { foreign: 'Полигон ТБО', foreignFull: 'Твердые бытовые отходы', recommended: 'QMCh maydoni', recommendedFull: 'Qattiq maishiy chiqindilar', meaning: "Rus tili orqali o'zlashgan so'z birikmasi bo'lib, \"QMCh (qattiq maishiy chiqindilar) maydoni\" ma'nosini bildiradi." },
  { foreign: 'Пробел', recommended: "Bo'shliq", meaning: "Rus tili orqali o'zlashgan so'z bo'lib, \"oq bo'shliq\", \"oq oraliq\" ma'nosini bildiradi." },
  { foreign: 'Раковина', recommended: 'Chanoq', meaning: "Rus tili orqali o'zlashgan so'z bo'lib, \"qobiq\", \"qalqon\" ma'nosini bildiradi." },
  { foreign: 'Распродажа', recommended: 'Arzonsotuv', meaning: "Rus tili orqali o'zlashgan so'z bo'lib, \"arzon sotib tugatish\" ma'nosini bildiradi." },
  { foreign: 'Рубильник', recommended: 'Uzgich', meaning: "Rus tili orqali o'zlashgan so'z bo'lib, \"uzish\", \"kesish\", \"ajratish\" ma'nosini bildiradi." },
  { foreign: 'Симптом', recommended: 'Belgi, alomat', meaning: "Yunoncha \"symptoma\" so'zidan olingan bo'lib, \"alomat\", \"belgi\" ma'nosini bildirgan." },
  { foreign: 'СБ', foreignFull: 'Сушилка барабанная', recommended: 'BQ', recommendedFull: 'Barabanli quritkich', meaning: "Rus tili orqali o'zlashgan so'z birikmasi bo'lib, metallurgiya, kimyo sanoatida material va minerallarning namligini yo'qotish hamda quritishda qo'llanadi." },
  { foreign: 'Суфлёр', recommended: 'Shivirchi', meaning: "Fransuz tilidan o'zlashgan so'z bo'lib, \"shivirlab aytib turish\", \"puflash\" ma'nosini bildiradi." },
  { foreign: 'Тренинг', recommended: "Mashg'ulot", meaning: "Ingliz tilidan o'zlashgan so'z bo'lib, \"o'qitish\", \"tarbiyalash\" ma'nosini bildiradi." },
  { foreign: 'Фитосанитария', recommended: 'Fitohimoya', meaning: "Yunoncha va lotincha so'zlardan tashkil topgan bo'lib, \"o'simliklar himoyasi\" ma'nosini bildiradi." },
  { foreign: 'Фрилансер', recommended: 'Erkin ishchi', meaning: "Ingliz tilidan o'zlashgan so'z bo'lib, \"o'zini o'zi ish bilan ta'minlovchi, ish beruvchiga bog'lanib qolmagan, xizmatini masofadan taklif etib ishlovchi\" ma'nosini bildiradi." },
  { foreign: 'Эможи', recommended: 'Hisbelgi', meaning: "Yapon tili orqali o'zlashgan so'z bo'lib, elektron qisqa xabarlarda harakat yoki g'oyalarni ifodalash uchun ishlatiladigan rasmli imo-ishoralar jamlanmasi." },
  { foreign: 'Хештег', recommended: "Kalitso'z", meaning: "Ingliz tilidan o'zlashgan so'z bo'lib, ijtimoiy tarmoqlarda xabarlarni guruhlash uchun ishlatiladigan belgi sifatida qo'llanmoqda." },
  { foreign: 'Шпалер', recommended: 'Tokustun', meaning: "Italyan va nemis tillari orqali o'zlashgan so'z bo'lib, tokzorlarda uzum ko'chatlarini ko'tarish uchun o'rnatiladigan ustun ma'nosida qo'llanmoqda." },
  { foreign: 'Хостел', recommended: "Qo'noquy", meaning: "Ingliz tilidan o'zlashgan so'z bo'lib, \"umumiy yashash uyi\", \"boshpana\", \"yotoqxona\" ma'nosini bildiradi." },
]

export default function RecommendedWords() {
  const { t } = useApp()
  const [search, setSearch] = useState('')

  const filtered = RECOMMENDED_WORDS.filter(w => {
    const q = search.toLowerCase()
    return !q ||
      w.foreign.toLowerCase().includes(q) ||
      w.recommended.toLowerCase().includes(q) ||
      w.meaning.toLowerCase().includes(q)
  }).sort((a, b) => a.recommended.localeCompare(b.recommended))

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">{t('recommended_title')}</h1>
        <p style={{ color: 'var(--text2)', maxWidth: '720px', margin: '0 0 1.5rem', lineHeight: 1.6 }}>
          {t('recommended_desc')}
        </p>
        <input type="search" placeholder={t('recommended_search')} value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ marginBottom: '1.5rem', maxWidth: '400px', display: 'block' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(w => (
            <div key={w.foreign} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--text2)', textDecoration: 'line-through', fontSize: '0.95rem' }}>
                  {w.foreign}
                </span>
                <span style={{ color: 'var(--text2)' }}>→</span>
                <span style={{
                  fontWeight: 700, color: 'var(--accent)', fontSize: '1rem',
                  background: 'rgba(var(--accent-rgb),0.1)', padding: '0.1rem 0.6rem', borderRadius: '100px',
                }}>
                  {w.recommended}
                </span>
              </div>
              {(w.foreignFull || w.recommendedFull) && (
                <div style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>
                  {w.foreignFull && <span>{w.foreignFull}</span>}
                  {w.foreignFull && w.recommendedFull && <span> — </span>}
                  {w.recommendedFull && <span>{w.recommendedFull}</span>}
                </div>
              )}
              <div style={{ fontSize: '0.9rem', color: 'var(--text)', lineHeight: 1.6 }}>{w.meaning}</div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text2)', padding: '2rem' }}>{t('no_results')}</div>
          )}
        </div>
      </div>
    </div>
  )
}
