from django.urls import path
from . import views

urlpatterns = [
    # Main site
    path('', views.index, name='index'),

    # Public API
    path('api/monuments/', views.api_monuments, name='api-monuments'),
    path('api/monuments/<int:pk>/', views.api_monument_detail, name='api-monument-detail'),
    path('api/monuments/<int:pk>/update/', views.api_monument_update, name='api-monument-update'),
    path('api/monuments/<int:pk>/delete/', views.api_monument_delete, name='api-monument-delete'),
    path('api/monuments/create/', views.api_monument_create, name='api-monument-create'),
    path('api/stats/', views.api_stats, name='api-stats'),
    path('api/concordance/', views.api_concordance, name='api-concordance'),
    path('api/export/', views.api_export, name='api-export'),
    path('api/auth/status/', views.api_auth_status, name='api-auth-status'),
    path('api/submit/', views.api_submit_monument, name='api-submit'),

    # React SPA
    path('app/', views.react_app, name='react-app'),

    # SEO
    path('robots.txt', views.robots_txt, name='robots-txt'),
    path('sitemap.xml', views.sitemap_xml, name='sitemap-xml'),

    # Admin panel
    path('panel/login/', views.panel_login, name='panel-login'),
    path('panel/logout/', views.panel_logout, name='panel-logout'),
    path('panel/', views.panel_index, name='panel-index'),

    # Admin AJAX API
    path('panel/api/monuments/', views.panel_api_monuments, name='panel-api-monuments'),
    path('panel/api/monuments/<int:pk>/', views.panel_api_monument_detail, name='panel-api-monument-detail'),
    path('panel/api/stats/', views.panel_api_stats, name='panel-api-stats'),
    path('panel/api/settings/', views.panel_api_settings, name='panel-api-settings'),
]
