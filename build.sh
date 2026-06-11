#!/usr/bin/env bash
# Render build skripti — har deploy'da ishlaydi.
set -o errexit

pip install -r requirements.txt

# Statik fayllar (Django admin / DRF) — WhiteNoise uzatadi
python manage.py collectstatic --no-input

# Migratsiya
python manage.py migrate

# Boshlang'ich ma'lumot — faqat baza bo'sh bo'lsa
python manage.py shell <<'PY'
from korpus.models import Monument
from django.core.management import call_command
if not Monument.objects.exists():
    call_command('seed_data')
    print('seed_data bajarildi')
else:
    print('Ma\'lumot mavjud, seed o\'tkazib yuborildi')
PY

# Superuser — env'dan (DJANGO_SUPERUSER_*), agar mavjud bo'lmasa
python manage.py shell <<'PY'
import os
from django.contrib.auth.models import User
u = os.environ.get('DJANGO_SUPERUSER_USERNAME')
p = os.environ.get('DJANGO_SUPERUSER_PASSWORD')
e = os.environ.get('DJANGO_SUPERUSER_EMAIL', '')
if u and p and not User.objects.filter(username=u).exists():
    User.objects.create_superuser(u, e, p)
    print(f'superuser yaratildi: {u}')
PY
