"""Admin paneli bosh sahifasidagi raqamlar."""

from django import template
from django.urls import reverse

from ..models import (
    Foydalanuvchilar,
    Kafedralar,
    Dekanatlar,
    oquvIshlari,
    ilmiy_ishlari,
    video_darslar,
)

register = template.Library()


@register.simple_tag
def kafedra_statistikasi():
    """Boshqaruv panelidagi kartochkalar uchun sanoqlar.

    Birinchi kartochka — tasdiq kutayotganlar; u eng muhim ish, shuning
    uchun alohida rangda va to'g'ridan-to'g'ri filtrlangan ro'yxatga olib
    boradi.
    """
    kutayotganlar = Foydalanuvchilar.objects.filter(accepted=False).count()

    return [
        {
            'nom': 'Tasdiq kutmoqda',
            'son': kutayotganlar,
            'ikona': 'fa-user-clock',
            'manzil': reverse('admin:app_foydalanuvchilar_changelist') + '?accepted__exact=0',
            'muhim': kutayotganlar > 0,
        },
        {
            'nom': 'Foydalanuvchilar',
            'son': Foydalanuvchilar.objects.count(),
            'ikona': 'fa-users',
            'manzil': reverse('admin:app_foydalanuvchilar_changelist'),
        },
        {
            'nom': "O'quv ishlari",
            'son': oquvIshlari.objects.count(),
            'ikona': 'fa-book',
            'manzil': reverse('admin:app_oquvishlari_changelist'),
        },
        {
            'nom': 'Ilmiy ishlar',
            'son': ilmiy_ishlari.objects.count(),
            'ikona': 'fa-file-alt',
            'manzil': reverse('admin:app_ilmiy_ishlari_changelist'),
        },
        {
            'nom': 'Video darslar',
            'son': video_darslar.objects.count(),
            'ikona': 'fa-video',
            'manzil': reverse('admin:app_video_darslar_changelist'),
        },
        {
            'nom': 'Kafedralar',
            'son': Kafedralar.objects.count(),
            'ikona': 'fa-building-columns',
            'manzil': reverse('admin:app_kafedralar_changelist'),
        },
        {
            'nom': 'Fakultetlar',
            'son': Dekanatlar.objects.count(),
            'ikona': 'fa-university',
            'manzil': reverse('admin:app_dekanatlar_changelist'),
        },
    ]
