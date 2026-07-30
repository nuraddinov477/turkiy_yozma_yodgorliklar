#!/usr/bin/env bash
# Render build skripti — har deploy'da ishlaydi.
set -o errexit

pip install -r requirements.txt

# Statik fayllar (Django admin / DRF) — WhiteNoise uzatadi
python manage.py collectstatic --no-input

# Migratsiya
python manage.py migrate

# Demo ma'lumotlar — seed'dagi yozuvlar (nomi bo'yicha) yangilanadi,
# admin orqali qo'shilgan boshqa yozuvlarga tegilmaydi.
python manage.py seed_data --refresh-demo

# Superuser — env'dan (DJANGO_SUPERUSER_*); eski demo parollar bloklanadi
python manage.py shell <<'PY'
import os
from django.contrib.auth.models import User

u = os.environ.get('DJANGO_SUPERUSER_USERNAME')
p = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
e = os.environ.get('DJANGO_SUPERUSER_EMAIL', '')

if u and p:
    obj, created = User.objects.get_or_create(username=u, defaults={'email': e})
    obj.is_staff = obj.is_superuser = obj.is_active = True
    # Parol faqat yangi akkauntga yoki zaif (eski demo) parolli akkauntga
    # o'rnatiladi — admin panelda qo'lda o'zgartirilgan parol saqlanib qoladi.
    if created or obj.check_password('admin123') or not obj.has_usable_password():
        obj.set_password(p)
        print(f"superuser paroli env'dan o'rnatildi: {u}")
    obj.save()

# Eski seed'dan qolgan, demo paroli o'zgartirilmagan akkauntlarni bloklash
for name, pwd in (('admin', 'admin123'), ('editor', 'editor123')):
    if name == u:
        continue
    du = User.objects.filter(username=name).first()
    if du and du.is_active and du.check_password(pwd):
        du.is_active = False
        du.save()
        print(f"{name}: demo parol bilan aktiv edi — bloklandi")
PY
