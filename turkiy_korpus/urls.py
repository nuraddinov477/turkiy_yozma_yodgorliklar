from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.http import FileResponse, Http404
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from korpus import api as korpus_api

handler404 = 'korpus.views.custom_404'

# ── DRF Router ────────────────────────────────────────────────────────────────
router = DefaultRouter()
router.register(r'monuments', korpus_api.MonumentViewSet, basename='monument')


def react_index(request):
    """Serve React SPA index.html. Assets (/app/assets/*) are handled by static()."""
    index = settings.REACT_BUILD_DIR / 'index.html'
    if index.exists():
        return FileResponse(open(index, 'rb'), content_type='text/html')
    raise Http404("React build topilmadi. cd frontend && npm run build")


urlpatterns = [
    # Django admin
    path('django-admin/', admin.site.urls),

    # ── REST API v2 ───────────────────────────────────────────────────────────
    path('api/v2/', include(router.urls)),
    path('api/v2/auth/token/',         korpus_api.CustomTokenObtainPairView.as_view(), name='token-obtain'),
    path('api/v2/auth/token/refresh/', TokenRefreshView.as_view(),                     name='token-refresh'),
    path('api/v2/submit/',             korpus_api.SubmissionCreateView.as_view(),       name='v2-submit'),
    path('api/v2/settings/',           korpus_api.SiteSettingsView.as_view(),           name='v2-settings'),
    path('api/v2/export/',             korpus_api.ExportView.as_view(),                 name='v2-export'),

    # ── React SPA ─────────────────────────────────────────────────────────────
    # /app/assets/* — served by static() below (must be before re_path catch-all)
    # /app/<any-route> — React client-side routing, all return index.html
    re_path(r'^app/(?!assets/).*$', react_index),

    # ── Legacy Django frontend ─────────────────────────────────────────────────
    path('', include('korpus.urls')),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT) \
  + static(settings.MEDIA_URL,  document_root=settings.MEDIA_ROOT) \
  + static('/app/assets/', document_root=settings.REACT_BUILD_DIR / 'assets') \
  + static('/app/vite.svg', document_root=settings.REACT_BUILD_DIR)
