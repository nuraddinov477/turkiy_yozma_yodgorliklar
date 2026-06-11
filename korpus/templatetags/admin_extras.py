from django import template
from korpus.models import MonumentSubmission

register = template.Library()

@register.simple_tag
def pending_count():
    return MonumentSubmission.objects.filter(status='pending').count()
