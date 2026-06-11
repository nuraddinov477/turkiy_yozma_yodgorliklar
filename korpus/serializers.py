from rest_framework import serializers
from .models import Monument, MonumentSubmission, SiteSettings


class MonumentListSerializer(serializers.ModelSerializer):
    """Ro'yxat uchun yengil serializer."""
    script_display   = serializers.CharField(source='get_script_display',   read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    century = serializers.SerializerMethodField()

    class Meta:
        model  = Monument
        fields = [
            'id', 'title', 'title_original', 'year', 'year_end', 'century',
            'location', 'script', 'script_display', 'category', 'category_display',
            'language', 'image', 'description', 'word_count', 'line_count',
            'importance', 'views', 'featured', 'status',
            'author_name', 'author_institution', 'is_user_submission',
        ]

    def get_century(self, obj):
        if obj.year is None:
            return None
        return abs(obj.year) // 100 + (1 if abs(obj.year) % 100 else 0)


class MonumentDetailSerializer(MonumentListSerializer):
    """To'liq ma'lumot uchun serializer."""
    class Meta(MonumentListSerializer.Meta):
        fields = MonumentListSerializer.Meta.fields + [
            'significance', 'full_text', 'transliteration', 'translation',
            'researchers', 'bibliography', 'tags',
            'author_email', 'created_at', 'updated_at',
        ]


class MonumentSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MonumentSubmission
        fields = [
            'id', 'title', 'year', 'location', 'script', 'category', 'language',
            'description', 'image', 'image_file', 'document',
            'transliteration', 'translation', 'source_info',
            'author_name', 'author_email', 'author_institution', 'author_bio',
        ]
        extra_kwargs = {
            'image_file': {'required': False},
            'document':   {'required': False},
        }

    def validate_year(self, value):
        if not (-3000 <= value <= 2000):
            raise serializers.ValidationError("Yil -3000 va 2000 orasida bo'lishi kerak.")
        return value

    def validate_description(self, value):
        if len(value.strip()) < 30:
            raise serializers.ValidationError("Tavsif kamida 30 ta belgidan iborat bo'lishi kerak.")
        return value


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model  = SiteSettings
        fields = ['site_title', 'site_subtitle', 'about_text', 'contact_email']
