from django.apps import AppConfig


class KorpusConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'korpus'
    verbose_name = "Turkiy Yozma Yodgorliklar Korpusi"

    def ready(self):
        from . import signals  # noqa: F401 — kirish tarixi signallarini ulaydi
