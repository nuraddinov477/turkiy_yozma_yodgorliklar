// Yodgorlik "joy" matnidan xarita koordinatasini aniqlaydi.
// Yangi data qo'shishning hojati yo'q — mavjud `location` maydonidan ishlaydi.
// Agar bazada aniq latitude/longitude bo'lsa, o'sha ustunlik qiladi.

// Mashhur turkiy yodgorlik manzillari → [kenglik, uzunlik].
// Ro'yxat tartibi muhim: aniqroq kalit umumiy kalitdan oldin turadi.
const PLACES = [
  { key: 'arxangay',  coord: [47.57, 102.83] }, // O'rxun vodiysi (Kültigin, Bilge, Bugut)
  { key: 'zavxan',    coord: [47.72, 96.85] },  // Shine-Usu
  { key: 'nalayh',    coord: [47.72, 107.48] }, // Tonyuquq
  { key: 'turfon',    coord: [42.95, 89.18] },  // Turfon (Xuastuanift, Altun Yoruq)
  { key: 'dunhuang',  coord: [40.14, 94.66] },  // Irq Bitig
  { key: 'iroq',      coord: [33.31, 44.36] },  // Bog'dod — Devonu Lug'atit Turk
  { key: 'koshg',     coord: [39.47, 75.99] },  // Koshg'ar — Qutadg'u Bilig
  { key: 'talas',     coord: [42.52, 72.24] },  // Talas bitiklari
  { key: 'yenisey',   coord: [53.72, 91.43] },  // Yenisey bitiklari
  { key: 'sibir',     coord: [53.72, 91.43] },
  { key: 'uliston',   coord: [46.86, 103.85] }, // Mo'g'uliston (umumiy) — Suji, Mo'yinchur
]

// Bir joyda bir necha yodgorlik bo'lsa, belgilar ustma-ust tushmasligi uchun
// id asosida kichik (aniq, tasodifiy emas) siljish beramiz.
function jitter(coord, id) {
  const dLat = (((id * 13) % 7) - 3) * 0.09
  const dLng = (((id * 7) % 7) - 3) * 0.09
  return [coord[0] + dLat, coord[1] + dLng]
}

export function geocode(m) {
  // 1) Bazadagi aniq koordinata (agar keyinchalik qo'shilsa)
  if (m.latitude != null && m.longitude != null && m.latitude !== '' && m.longitude !== '') {
    return [Number(m.latitude), Number(m.longitude)]
  }
  // 2) Joy nomidan aniqlash
  const loc = (m.location || '').toLowerCase()
  for (const p of PLACES) {
    if (loc.includes(p.key)) return jitter(p.coord, m.id || 0)
  }
  return null // topilmadi — xaritada ko'rsatilmaydi
}
