"""Barcha shablonlarga uzatiladigan umumiy qiymatlar."""

from . import google_oauth


def google_sozlamalari(request):
    """"Google bilan davom etish" tugmasi faqat kalitlar .env da bo'lsa ko'rinadi."""
    return {'google_yoqilgan': google_oauth.sozlangan()}
