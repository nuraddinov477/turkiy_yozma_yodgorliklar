from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, NumberFilter, CharFilter
from django.db.models import Q, Sum, Count
from django.core.mail import send_mail
from django.conf import settings as django_settings
from django.utils import timezone

from .models import Monument, MonumentSubmission, SiteSettings
from .serializers import (
    MonumentListSerializer, MonumentDetailSerializer,
    MonumentSubmissionSerializer, SiteSettingsSerializer,
)


# ── Filters ───────────────────────────────────────────────────────────────────

class MonumentFilter(FilterSet):
    year_min  = NumberFilter(field_name='year', lookup_expr='gte')
    year_max  = NumberFilter(field_name='year', lookup_expr='lte')
    script    = CharFilter(field_name='script', lookup_expr='iexact')
    category  = CharFilter(field_name='category', lookup_expr='iexact')
    featured  = CharFilter(method='filter_featured')

    def filter_featured(self, qs, name, value):
        return qs.filter(featured=(value.lower() == 'true'))

    class Meta:
        model  = Monument
        fields = ['script', 'category', 'language', 'featured', 'year_min', 'year_max']


# ── Custom JWT — username ni javobga qo'shish ─────────────────────────────────

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        data['is_staff']  = self.user.is_staff
        return data

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# ── Monument ViewSet ──────────────────────────────────────────────────────────

class MonumentViewSet(viewsets.ModelViewSet):
    queryset = Monument.objects.filter(status='Chop etilgan').order_by('year')
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = MonumentFilter
    search_fields   = ['title', 'description', 'location', 'transliteration', 'translation']
    ordering_fields = ['year', 'views', 'title', 'importance', 'word_count']
    ordering        = ['year']

    def get_serializer_class(self):
        if self.action in ('list', 'featured'):
            return MonumentListSerializer
        return MonumentDetailSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve', 'featured', 'stats', 'concordance'):
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Monument.objects.filter(pk=instance.pk).update(views=instance.views + 1)
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='featured')
    def featured(self, request):
        qs = self.get_queryset().filter(featured=True)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        qs = Monument.objects.filter(status='Chop etilgan')
        agg = qs.aggregate(
            total_views=Sum('views'),
            total_words=Sum('word_count'),
            total_lines=Sum('line_count'),
        )
        by_script   = list(qs.values('script').annotate(count=Count('id')).order_by('-count'))
        by_category = list(qs.values('category').annotate(count=Count('id')).order_by('-count'))
        by_century  = {}
        for m in qs.values_list('year', flat=True):
            if m is not None:
                c = f"{abs(m) // 100 + 1}-asr"
                by_century[c] = by_century.get(c, 0) + 1
        return Response({
            'total':      qs.count(),
            'totalViews': agg['total_views'] or 0,
            'totalWords': agg['total_words'] or 0,
            'totalLines': agg['total_lines'] or 0,
            'byScript':   by_script,
            'byCategory': by_category,
            'byCentury':  [{'century': k, 'count': v} for k, v in sorted(by_century.items())],
        })

    @action(detail=False, methods=['get'], url_path='concordance')
    def concordance(self, request):
        q = request.query_params.get('q', '').strip()
        if not q or len(q) < 2:
            return Response({'error': "Kamida 2 ta belgi kiriting"}, status=400)
        results = []
        qs = Monument.objects.filter(status='Chop etilgan')
        for m in qs:
            for field, text in [
                ('Matn', m.full_text or ''),
                ('Transliteratsiya', m.transliteration or ''),
                ('Tarjima', m.translation or ''),
            ]:
                idx = text.lower().find(q.lower())
                while idx != -1:
                    start = max(0, idx - 40)
                    end   = min(len(text), idx + len(q) + 40)
                    results.append({
                        'monumentId':    m.id,
                        'monumentTitle': m.title,
                        'field':  field,
                        'left':   text[start:idx],
                        'match':  text[idx:idx + len(q)],
                        'right':  text[idx + len(q):end],
                    })
                    idx = text.lower().find(q.lower(), idx + 1)
                    if len(results) > 200:
                        break
        return Response({'query': q, 'count': len(results), 'results': results[:200]})


# ── MonumentSubmission API ────────────────────────────────────────────────────

class SubmissionCreateView(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes_names = ['multipart', 'form', 'json']

    def post(self, request):
        serializer = MonumentSubmissionSerializer(data=request.data)
        if not serializer.is_valid():
            first_error = next(iter(serializer.errors.values()))[0]
            return Response({'error': str(first_error)}, status=400)

        submission = serializer.save()

        # Email — admin ga
        if django_settings.ADMIN_EMAIL:
            send_mail(
                subject=f'[Turkiy Korpus] Yangi taklif: {submission.title}',
                message=(
                    f'Yangi yodgorlik taklifi keldi.\n\n'
                    f'Nomi: {submission.title}\n'
                    f'Muallif: {submission.author_name} <{submission.author_email}>\n'
                    f'Ko\'rib chiqish: http://127.0.0.1:8000/django-admin/korpus/monumentsubmission/{submission.id}/change/'
                ),
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[django_settings.ADMIN_EMAIL],
                fail_silently=True,
            )
        # Email — foydalanuvchiga
        send_mail(
            subject='Taklifingiz qabul qilindi — Turkiy Korpus',
            message=(
                f'Assalomu alaykum, {submission.author_name}!\n\n'
                f'"{submission.title}" nomli taklifingiz qabul qilindi.\n'
                f'Admin ko\'rib chiqqandan so\'ng saytda ko\'rinadi.\n\n'
                f'Turkiy Yozma Yodgorliklar Elektron Korpusi'
            ),
            from_email=django_settings.DEFAULT_FROM_EMAIL,
            recipient_list=[submission.author_email],
            fail_silently=True,
        )

        return Response({
            'success': True,
            'id': submission.id,
            'message': "Yodgorlik muvaffaqiyatli yuborildi. Admin ko'rib chiqqandan so'ng saytda ko'rinadi.",
        }, status=201)


# ── SiteSettings API ──────────────────────────────────────────────────────────

class SiteSettingsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        obj = SiteSettings.objects.first()
        if not obj:
            return Response({})
        return Response(SiteSettingsSerializer(obj).data)


# ── Export ────────────────────────────────────────────────────────────────────

class ExportView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        import csv
        from django.http import HttpResponse, JsonResponse
        fmt = request.query_params.get('format', 'json')
        qs  = Monument.objects.filter(status='Chop etilgan').order_by('year')

        if fmt == 'csv':
            response = HttpResponse(content_type='text/csv; charset=utf-8')
            response['Content-Disposition'] = 'attachment; filename="yodgorliklar.csv"'
            response.write('﻿')
            w = csv.writer(response)
            w.writerow(['ID', 'Nomi', 'Yil', 'Joy', 'Yozuv', 'Kategoriya', 'Til', "So'zlar", 'Ko\'rishlar'])
            for m in qs:
                w.writerow([m.id, m.title, m.year, m.location, m.script, m.category, m.language, m.word_count, m.views])
            return response

        data = MonumentDetailSerializer(qs, many=True).data
        return JsonResponse({'monuments': data, 'total': len(data)}, safe=False, json_dumps_params={'ensure_ascii': False})
