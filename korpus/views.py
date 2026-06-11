import json
import csv
import time
from io import StringIO
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db.models import Q, Sum
from django.contrib.auth.models import User
from django.core.cache import cache
from django.core.mail import send_mail
from django.conf import settings as django_settings
from .models import Monument, SiteSettings, MonumentSubmission


def is_staff(user):
    return user.is_staff or user.is_superuser


# ── Main site ──────────────────────────────────────────────────────────────────

def index(request):
    return render(request, 'index.html')


# ── API views ──────────────────────────────────────────────────────────────────

def api_monuments(request):
    qs = Monument.objects.all()

    # Search
    q = request.GET.get('q', '').strip()
    if q:
        qs = qs.filter(
            Q(title__icontains=q) |
            Q(description__icontains=q) |
            Q(location__icontains=q) |
            Q(full_text__icontains=q)
        )

    # Filters
    script = request.GET.get('script', '')
    if script:
        qs = qs.filter(script=script)

    category = request.GET.get('category', '')
    if category:
        qs = qs.filter(category=category)

    featured = request.GET.get('featured', '')
    if featured:
        qs = qs.filter(featured=True)

    # Sort
    sort = request.GET.get('sort', 'year')
    sort_map = {
        'year': 'year',
        'year_desc': '-year',
        'title': 'title',
        'views': '-views',
    }
    qs = qs.order_by(sort_map.get(sort, 'year'))

    data = [m.to_dict() for m in qs]
    return JsonResponse({'monuments': data, 'total': len(data)})


@require_http_methods(['GET'])
def api_monument_detail(request, pk):
    monument = get_object_or_404(Monument, pk=pk)
    monument.views += 1
    monument.save(update_fields=['views'])
    return JsonResponse(monument.to_dict())


@csrf_exempt
@login_required
@require_http_methods(['POST'])
def api_monument_create(request):
    if not is_staff(request.user):
        return JsonResponse({'error': 'Ruxsat yo\'q'}, status=403)
    try:
        data = json.loads(request.body)
        monument = _monument_from_data(data)
        monument.save()
        return JsonResponse(monument.to_dict(), status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
@login_required
@require_http_methods(['PUT', 'PATCH'])
def api_monument_update(request, pk):
    if not is_staff(request.user):
        return JsonResponse({'error': 'Ruxsat yo\'q'}, status=403)
    monument = get_object_or_404(Monument, pk=pk)
    try:
        data = json.loads(request.body)
        _update_monument(monument, data)
        monument.save()
        return JsonResponse(monument.to_dict())
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
@login_required
@require_http_methods(['DELETE'])
def api_monument_delete(request, pk):
    if not is_staff(request.user):
        return JsonResponse({'error': 'Ruxsat yo\'q'}, status=403)
    monument = get_object_or_404(Monument, pk=pk)
    monument.delete()
    return JsonResponse({'success': True})


def api_stats(request):
    total = Monument.objects.count()
    agg = Monument.objects.aggregate(
        total_views=Sum('views'),
        total_words=Sum('word_count'),
    )
    total_views = agg['total_views'] or 0
    total_words = agg['total_words'] or 0

    by_script = {}
    for m in Monument.objects.values('script'):
        by_script[m['script']] = by_script.get(m['script'], 0) + 1

    by_century = {}
    for m in Monument.objects.values('year'):
        century = ((abs(m['year']) - 1) // 100 + 1)
        key = str(century)
        by_century[key] = by_century.get(key, 0) + 1

    by_category = {}
    for m in Monument.objects.values('category'):
        by_category[m['category']] = by_category.get(m['category'], 0) + 1

    top_viewed = [
        m.to_dict()
        for m in Monument.objects.order_by('-views')[:5]
    ]

    return JsonResponse({
        'total': total,
        'totalViews': total_views,
        'totalWords': total_words,
        'scripts': len(by_script),
        'byScript': by_script,
        'byCentury': by_century,
        'byCategory': by_category,
        'topViewed': top_viewed,
    })


def api_concordance(request):
    q = request.GET.get('q', '').strip()
    if not q or len(q) < 2:
        return JsonResponse({'results': [], 'total': 0, 'query': q})

    monuments = Monument.objects.all()
    results = []
    CTX = 80

    for m in monuments:
        fields = [
            ('Asl matn', m.full_text or ''),
            ('Transliteratsiya', m.transliteration or ''),
            ('Tarjima', m.translation or ''),
            ('Tavsif', m.description or ''),
        ]
        for field_label, text in fields:
            if not text:
                continue
            text_lower = text.lower()
            q_lower = q.lower()
            idx = 0
            while len(results) < 200:
                pos = text_lower.find(q_lower, idx)
                if pos == -1:
                    break
                s = max(0, pos - CTX)
                e = min(len(text), pos + len(q) + CTX)
                left = ('…' if s > 0 else '') + text[s:pos]
                match = text[pos:pos + len(q)]
                right = text[pos + len(q):e] + ('…' if e < len(text) else '')
                results.append({
                    'monumentId': m.id,
                    'monumentTitle': m.title,
                    'script': m.script,
                    'field': field_label,
                    'left': left,
                    'match': match,
                    'right': right,
                })
                idx = pos + 1

    return JsonResponse({'results': results, 'total': len(results), 'query': q})


def api_export(request):
    fmt = request.GET.get('format', 'json')
    monuments = Monument.objects.all().order_by('year')

    if fmt == 'csv':
        out = StringIO()
        w = csv.writer(out)
        w.writerow(['id', 'title', 'year', 'location', 'script', 'category',
                    'language', 'wordCount', 'lineCount', 'featured', 'description'])
        for m in monuments:
            w.writerow([m.id, m.title, m.year, m.location, m.script,
                        m.category, m.language, m.word_count, m.line_count,
                        m.featured, m.description])
        resp = HttpResponse(out.getvalue(), content_type='text/csv; charset=utf-8')
        resp['Content-Disposition'] = 'attachment; filename="turkiy-korpus.csv"'
        return resp

    elif fmt == 'xml':
        lines = [
            '<?xml version="1.0" encoding="UTF-8"?>',
            '<teiCorpus xmlns="http://www.tei-c.org/ns/1.0">',
            '  <teiHeader><fileDesc><titleStmt>',
            '    <title>Turkiy Yozma Yodgorliklar Elektron Korpusi</title>',
            '  </titleStmt></fileDesc></teiHeader>',
        ]
        for m in monuments:
            lines.append(f'  <TEI xml:id="m{m.id}">')
            lines.append(f'    <teiHeader><fileDesc><titleStmt><title>{m.title}</title></titleStmt>')
            lines.append(f'    <publicationStmt><p>{m.year}</p></publicationStmt>')
            lines.append(f'    <sourceDesc><p>{m.location}</p></sourceDesc></fileDesc></teiHeader>')
            lines.append(f'    <text><body><div type="original"><p>{m.full_text or ""}</p></div>')
            lines.append(f'    <div type="transliteration"><p>{m.transliteration or ""}</p></div>')
            lines.append(f'    <div type="translation"><p>{m.translation or ""}</p></div></body></text>')
            lines.append(f'  </TEI>')
        lines.append('</teiCorpus>')
        resp = HttpResponse('\n'.join(lines), content_type='application/xml; charset=utf-8')
        resp['Content-Disposition'] = 'attachment; filename="turkiy-korpus-tei.xml"'
        return resp

    else:
        data = [m.to_dict() for m in monuments]
        resp = HttpResponse(
            json.dumps({'monuments': data, 'total': len(data)}, ensure_ascii=False, indent=2),
            content_type='application/json; charset=utf-8'
        )
        resp['Content-Disposition'] = 'attachment; filename="turkiy-korpus.json"'
        return resp


@csrf_exempt
@require_http_methods(['POST'])
def api_submit_monument(request):
    from django.conf import settings as django_settings

    # Multipart (FormData) yoki JSON qabul qiladi
    is_multipart = request.content_type.startswith('multipart/') or request.content_type.startswith('application/x-www-form-urlencoded')
    if is_multipart:
        data = request.POST
    else:
        try:
            data = json.loads(request.body)
        except Exception:
            return JsonResponse({'error': 'Noto\'g\'ri so\'rov formati'}, status=400)

    def get(key, default=''):
        val = data.get(key, default)
        return val.strip() if isinstance(val, str) else val

    required = ['title', 'year', 'location', 'script', 'category', 'description', 'authorName', 'authorEmail']
    for field in required:
        if not get(field):
            return JsonResponse({'error': f'"{field}" maydoni to\'ldirilishi shart'}, status=400)

    try:
        year = int(get('year'))
    except (ValueError, TypeError):
        return JsonResponse({'error': 'Yil to\'g\'ri son bo\'lishi kerak'}, status=400)

    desc = get('description')
    if len(desc) < 30:
        return JsonResponse({'error': 'Tavsif kamida 30 ta belgidan iborat bo\'lishi kerak'}, status=400)

    # ── Fayl validatsiyasi ─────────────────────────────────────────────────────
    image_file = request.FILES.get('image_file')
    document   = request.FILES.get('document')

    if image_file:
        ext = image_file.name.rsplit('.', 1)[-1].lower()
        if ext not in django_settings.ALLOWED_IMAGE_EXTENSIONS:
            return JsonResponse({'error': f'Rasm formati qo\'llab-quvvatlanmaydi. Ruxsat: {", ".join(sorted(django_settings.ALLOWED_IMAGE_EXTENSIONS))}'}, status=400)
        max_bytes = django_settings.MAX_IMAGE_SIZE_MB * 1024 * 1024
        if image_file.size > max_bytes:
            return JsonResponse({'error': f'Rasm hajmi {django_settings.MAX_IMAGE_SIZE_MB} MB dan oshmasligi kerak'}, status=400)

    if document:
        ext = document.name.rsplit('.', 1)[-1].lower()
        if ext not in django_settings.ALLOWED_DOC_EXTENSIONS:
            return JsonResponse({'error': f'Hujjat formati qo\'llab-quvvatlanmaydi. Ruxsat: {", ".join(sorted(django_settings.ALLOWED_DOC_EXTENSIONS))}'}, status=400)
        max_bytes = django_settings.MAX_DOC_SIZE_MB * 1024 * 1024
        if document.size > max_bytes:
            return JsonResponse({'error': f'Hujjat hajmi {django_settings.MAX_DOC_SIZE_MB} MB dan oshmasligi kerak'}, status=400)

    # ── Saqlash ────────────────────────────────────────────────────────────────
    submission = MonumentSubmission(
        title=get('title'),
        year=year,
        location=get('location'),
        script=get('script'),
        category=get('category'),
        language=get('language') or "Ko'hna turkiy",
        description=desc,
        image=get('image'),
        transliteration=get('transliteration'),
        translation=get('translation'),
        source_info=get('sourceInfo'),
        author_name=get('authorName'),
        author_email=get('authorEmail'),
        author_institution=get('authorInstitution'),
        author_bio=get('authorBio'),
    )
    if image_file:
        submission.image_file = image_file
    if document:
        submission.document = document
    submission.save()

    # ── Emaillar ───────────────────────────────────────────────────────────────
    # Admin ga xabar
    if django_settings.ADMIN_EMAIL:
        send_mail(
            subject=f'[Turkiy Korpus] Yangi taklif: {submission.title}',
            message=(
                f'Yangi yodgorlik taklifi keldi.\n\n'
                f'Nomi: {submission.title}\n'
                f'Muallif: {submission.author_name} <{submission.author_email}>\n'
                f'Yozuv: {submission.script} | Yil: {submission.year}\n'
                f'Joy: {submission.location}\n\n'
                f'Ko\'rib chiqish: http://127.0.0.1:8000/django-admin/korpus/monumentsubmission/{submission.id}/change/'
            ),
            from_email=django_settings.DEFAULT_FROM_EMAIL,
            recipient_list=[django_settings.ADMIN_EMAIL],
            fail_silently=True,
        )
    # Foydalanuvchiga tasdiqlash xabari
    send_mail(
        subject='Taklifingiz qabul qilindi — Turkiy Korpus',
        message=(
            f'Assalomu alaykum, {submission.author_name}!\n\n'
            f'"{submission.title}" nomli yodgorlik taklifingiz muvaffaqiyatli qabul qilindi.\n'
            f'Admin ko\'rib chiqqandan so\'ng saytda ko\'rinadi. '
            f'Natija haqida elektron pochtangizga xabar yuboriladi.\n\n'
            f'Turkiy Yozma Yodgorliklar Elektron Korpusi\n'
            f'https://turkiy-korpus.uz'
        ),
        from_email=django_settings.DEFAULT_FROM_EMAIL,
        recipient_list=[submission.author_email],
        fail_silently=True,
    )

    return JsonResponse({
        'success': True,
        'id': submission.id,
        'message': 'Yodgorlik muvaffaqiyatli yuborildi. Admin ko\'rib chiqqandan so\'ng saytda ko\'rinadi.'
    }, status=201)


def api_auth_status(request):
    if request.user.is_authenticated and is_staff(request.user):
        return JsonResponse({
            'authenticated': True,
            'username': request.user.username,
            'isAdmin': request.user.is_superuser,
        })
    return JsonResponse({'authenticated': False})


# ── Admin panel ────────────────────────────────────────────────────────────────

def panel_login(request):
    if request.user.is_authenticated and is_staff(request.user):
        return redirect('/panel/')

    error = ''
    if request.method == 'POST':
        ip = request.META.get('REMOTE_ADDR', 'unknown')
        cache_key = f'login_attempts_{ip}'
        attempts = cache.get(cache_key, 0)

        if attempts >= 10:
            error = 'Juda ko\'p urinish. 15 daqiqadan so\'ng qayta urinib ko\'ring.'
        else:
            username = request.POST.get('username', '').strip()
            password = request.POST.get('password', '')
            user = authenticate(request, username=username, password=password)
            if user and is_staff(user):
                cache.delete(cache_key)
                login(request, user)
                return redirect('/panel/')
            else:
                cache.set(cache_key, attempts + 1, timeout=900)
                time.sleep(0.5)  # Brute-force sekinlashtirish
                error = 'Noto\'g\'ri login yoki parol'

    return render(request, 'login.html', {'error': error})


@login_required(login_url='/panel/login/')
def panel_logout(request):
    logout(request)
    return redirect('/panel/login/')


@login_required(login_url='/panel/login/')
def panel_index(request):
    if not is_staff(request.user):
        return redirect('/panel/login/')
    return render(request, 'panel.html', {
        'username': request.user.username,
        'is_admin': request.user.is_superuser,
    })


# ── Admin AJAX API ─────────────────────────────────────────────────────────────

@csrf_exempt
@login_required(login_url='/panel/login/')
def panel_api_monuments(request):
    if not is_staff(request.user):
        return JsonResponse({'error': 'Ruxsat yo\'q'}, status=403)

    if request.method == 'GET':
        qs = Monument.objects.all().order_by('year')
        q = request.GET.get('q', '').strip()
        if q:
            qs = qs.filter(Q(title__icontains=q) | Q(description__icontains=q))
        page = int(request.GET.get('page', 1))
        per_page = int(request.GET.get('per_page', 10))
        total = qs.count()
        start = (page - 1) * per_page
        items = list(qs[start:start + per_page])
        return JsonResponse({
            'monuments': [m.to_dict() for m in items],
            'total': total,
            'page': page,
            'pages': (total + per_page - 1) // per_page,
        })

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            monument = _monument_from_data(data)
            monument.save()
            return JsonResponse(monument.to_dict(), status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
@login_required(login_url='/panel/login/')
def panel_api_monument_detail(request, pk):
    if not is_staff(request.user):
        return JsonResponse({'error': 'Ruxsat yo\'q'}, status=403)

    monument = get_object_or_404(Monument, pk=pk)

    if request.method == 'GET':
        return JsonResponse(monument.to_dict())

    if request.method in ('PUT', 'PATCH'):
        try:
            data = json.loads(request.body)
            _update_monument(monument, data)
            monument.save()
            return JsonResponse(monument.to_dict())
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    if request.method == 'DELETE':
        monument.delete()
        return JsonResponse({'success': True})

    return JsonResponse({'error': 'Method not allowed'}, status=405)


@login_required(login_url='/panel/login/')
def panel_api_stats(request):
    if not is_staff(request.user):
        return JsonResponse({'error': 'Ruxsat yo\'q'}, status=403)
    return api_stats(request)


@csrf_exempt
@login_required(login_url='/panel/login/')
def panel_api_settings(request):
    if not is_staff(request.user):
        return JsonResponse({'error': 'Ruxsat yo\'q'}, status=403)

    settings_obj, _ = SiteSettings.objects.get_or_create(pk=1)

    if request.method == 'GET':
        return JsonResponse({
            'siteTitle': settings_obj.site_title,
            'siteSubtitle': settings_obj.site_subtitle,
            'aboutText': settings_obj.about_text,
            'contactEmail': settings_obj.contact_email,
        })

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            settings_obj.site_title = data.get('siteTitle', settings_obj.site_title)
            settings_obj.site_subtitle = data.get('siteSubtitle', settings_obj.site_subtitle)
            settings_obj.about_text = data.get('aboutText', settings_obj.about_text)
            settings_obj.contact_email = data.get('contactEmail', settings_obj.contact_email)
            settings_obj.save()
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Method not allowed'}, status=405)


# ── Helpers ────────────────────────────────────────────────────────────────────

def _parse_json_field(value, default=None):
    if default is None:
        default = []
    if isinstance(value, (list, dict)):
        return value
    if isinstance(value, str):
        try:
            return json.loads(value)
        except Exception:
            return [v.strip() for v in value.split(',') if v.strip()]
    return default


def _monument_from_data(data):
    return Monument(
        title=data.get('title', ''),
        title_original=data.get('titleOriginal', ''),
        year=int(data.get('year', 0)),
        year_end=data.get('yearEnd') or None,
        location=data.get('location', ''),
        script=data.get('script', 'boshqa'),
        category=data.get('category', 'boshqa'),
        language=data.get('language', "Ko'hna turkiy"),
        description=data.get('description', ''),
        full_text=data.get('fullText', ''),
        transliteration=data.get('transliteration', ''),
        translation=data.get('translation', ''),
        image=data.get('image', ''),
        researchers=_parse_json_field(data.get('researchers', [])),
        bibliography=_parse_json_field(data.get('bibliography', [])),
        tags=_parse_json_field(data.get('tags', [])),
        featured=bool(data.get('featured', False)),
    )


def _update_monument(monument, data):
    if 'title' in data:
        monument.title = data['title']
    if 'titleOriginal' in data:
        monument.title_original = data['titleOriginal']
    if 'year' in data:
        monument.year = int(data['year'])
    if 'yearEnd' in data:
        monument.year_end = data['yearEnd'] or None
    if 'location' in data:
        monument.location = data['location']
    if 'script' in data:
        monument.script = data['script']
    if 'category' in data:
        monument.category = data['category']
    if 'language' in data:
        monument.language = data['language']
    if 'description' in data:
        monument.description = data['description']
    if 'fullText' in data:
        monument.full_text = data['fullText']
    if 'transliteration' in data:
        monument.transliteration = data['transliteration']
    if 'translation' in data:
        monument.translation = data['translation']
    if 'image' in data:
        monument.image = data['image']
    if 'researchers' in data:
        monument.researchers = _parse_json_field(data['researchers'])
    if 'bibliography' in data:
        monument.bibliography = _parse_json_field(data['bibliography'])
    if 'tags' in data:
        monument.tags = _parse_json_field(data['tags'])
    if 'featured' in data:
        monument.featured = bool(data['featured'])


def custom_404(request, exception=None):
    from django.shortcuts import render as _render
    return _render(request, '404.html', status=404)


def react_app(request):
    """Serve React SPA build."""
    from django.conf import settings as _s
    from django.http import FileResponse, Http404
    index = _s.REACT_BUILD_DIR / 'index.html'
    if index.exists():
        return FileResponse(open(index, 'rb'), content_type='text/html')
    raise Http404("React build topilmadi. cd frontend && npm run build")


def robots_txt(request):
    lines = [
        "User-agent: *",
        "Disallow: /django-admin/",
        "Disallow: /panel/",
        "Disallow: /api/",
        "Allow: /",
        "",
        f"Sitemap: {request.scheme}://{request.get_host()}/sitemap.xml",
    ]
    return HttpResponse("\n".join(lines), content_type="text/plain")


def sitemap_xml(request):
    from django.utils.timezone import now
    monuments = Monument.objects.filter(status='Chop etilgan').values_list('id', flat=True)
    base = f"{request.scheme}://{request.get_host()}"
    today = now().strftime('%Y-%m-%d')
    urls = [
        f'  <url><loc>{base}/</loc><lastmod>{today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>',
    ]
    for mid in monuments:
        urls.append(f'  <url><loc>{base}/#yodgorlik-{mid}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>')
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    xml += '\n'.join(urls)
    xml += '\n</urlset>'
    return HttpResponse(xml, content_type="application/xml")
