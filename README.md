# Turkiy Yozma Yodgorliklar Korpusi

VII–XI asrlardagi turkiy yozma yodgorliklarning elektron korpusi. Orxun, Yenisey, uyg'ur va dastlabki islom davri matnlari — asl yozuv, transliteratsiya va tarjima bilan.

## Texnologiyalar

- **Backend:** Python · Django 4.2 · Django REST Framework · SimpleJWT
- **Frontend:** React 18 + Vite (`/app/`) va klassik Django shablonlar (`/`)
- **Baza:** SQLite (standart) yoki PostgreSQL
- **Tillar:** o'zbek · rus · ingliz

## Imkoniyatlar

- 15+ yodgorlik: qidiruv, filtrlash (yozuv, asr, kategoriya), saralash
- Konkordans (KWIC qidiruv), statistika, taqqoslash, lug'at, bibliografiya, vaqt chizig'i
- Eksport: JSON · CSV · TEI-XML
- Foydalanuvchi taklif yuborishi (rasm/hujjat bilan) va admin moderatsiyasi
- Admin panel (`/panel/`) va Django admin (`/django-admin/`)

## Ishga tushirish (Ubuntu / Linux)

```bash
git clone <repo-url>
cd turkiy-korpus
./run.sh
```

`run.sh` avtomatik: virtual muhit yaratadi, kutubxonalarni o'rnatadi, migratsiya qiladi,
boshlang'ich ma'lumotlarni yuklaydi, admin yaratadi va serverni ishga tushiradi.

Qo'lda:

```bash
python3 -m venv ~/venvs/turkiy_korpus
~/venvs/turkiy_korpus/bin/pip install -r requirements.txt
export USE_POSTGRES=False
~/venvs/turkiy_korpus/bin/python manage.py migrate
~/venvs/turkiy_korpus/bin/python manage.py seed_data
~/venvs/turkiy_korpus/bin/python manage.py runserver
```

### Manzillar

| Sahifa | URL |
|---|---|
| Asosiy sayt | http://127.0.0.1:8000/ |
| React versiya | http://127.0.0.1:8000/app/ |
| Admin panel | http://127.0.0.1:8000/panel/login/ |
| Django admin | http://127.0.0.1:8000/django-admin/ |
| API | http://127.0.0.1:8000/api/monuments/ |

Standart admin: `admin` / `admin123` (production'da albatta o'zgartiring).

## Konfiguratsiya

Muhit o'zgaruvchilari `.env.example` da. Production uchun nusxa oling:

```bash
cp .env.example .env   # qiymatlarni to'ldiring
```

Muhim: `DJANGO_DEBUG=False`, kuchli `DJANGO_SECRET_KEY`, real `DJANGO_ALLOWED_HOSTS`.

## Tuzilma

```
korpus/          — asosiy Django ilova (modellar, API, views, admin)
turkiy_korpus/   — loyiha sozlamalari
templates/       — HTML shablonlar
css/  js/        — statik fayllar
frontend/        — React (Vite) ilovasi
media/           — yuklangan fayllar
manage.py        — Django boshqaruvi
run.sh           — Ubuntu ishga tushirish skripti
```

## Litsenziya

Ko'rsatilmagan — egasi bilan kelishilgan holda foydalaning.
