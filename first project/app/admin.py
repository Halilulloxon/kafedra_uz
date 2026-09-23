from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.urls import reverse
from .models import Foydalanuvchilar, Kafedralar, oquvIshlari, ilmiy_ishlari, Dekanatlar, video_darslar, KafedraTalablari

# --- Site Header & Title Configuration ---
admin.site.site_header = "Kafedralar.uz — Boshqaruv Markazi"
admin.site.site_title = "Kafedralar.uz Admin"
admin.site.index_title = "Tizim ma'lumotlarini boshqarish paneli"


def make_edit_button(obj):
    url = reverse(f'admin:{obj._meta.app_label}_{obj._meta.model_name}_change', args=[obj.pk])
    return format_html(
        '<a href="{}" class="admin-edit-btn">'
        '<i class="fas fa-edit"></i> Tahrirlash'
        '</a>',
        url
    )


class FoydalanuvchilarAdmin(admin.ModelAdmin):
    # Ustunlar ro'yxatga sig'ishi uchun email ism ostida, kafedra bilan
    # fakultet esa bitta ustunda ko'rsatiladi.
    list_display = ('id', 'full_name_display', 'login_f', 'role_badge', 'joylashuv', 'accepted_status', 'tahrirlash_tugmasi')
    list_display_links = ('id', 'full_name_display')
    search_fields = ('ism', 'familiya', 'sharifi', 'login_f', 'gmail')
    list_filter = ('foydalanuvchi_rol', 'accepted', 'kafedra', 'fakulteti')
    list_per_page = 25
    actions = ['tasdiqlash', 'bekor_qilish']

    @admin.display(description="Amallar")
    def tahrirlash_tugmasi(self, obj):
        return make_edit_button(obj)

    @admin.display(description="Kafedra / Fakultet")
    def joylashuv(self, obj):
        return format_html(
            '<div style="line-height:1.45;">{}<br><span style="color:#94a3b8; font-size:11.5px;">{}</span></div>',
            obj.kafedra or "Kafedra yo'q",
            obj.fakulteti or "Fakultet yo'q",
        )

    @admin.display(description="F.I.SH", ordering='familiya')
    def full_name_display(self, obj):
        return format_html(
            '<div style="line-height:1.45;"><span style="font-weight:600;">{}</span>'
            '<br><span style="color:#94a3b8; font-size:11.5px;">{}</span></div>',
            f"{obj.familiya} {obj.ism} {obj.sharifi or ''}".strip(),
            obj.gmail or "email yo'q",
        )

    @admin.display(description="Rol")
    def role_badge(self, obj):
        colors = {
            'oqituvchi': ('#dbeafe', '#1d4ed8'),
            'kafedra mudiri': ('#fef3c7', '#b45309'),
            'dekan': ('#f3e8ff', '#7e22ce'),
            'prorektor': ('#fee2e2', '#b91c1c'),
        }
        bg, fg = colors.get(obj.foydalanuvchi_rol, ('#f1f5f9', '#475569'))
        label = obj.get_foydalanuvchi_rol_display() if hasattr(obj, 'get_foydalanuvchi_rol_display') else (obj.foydalanuvchi_rol or "Belgilanmagan")
        return format_html(
            '<span style="background:{}; color:{}; padding:3px 8px; border-radius:12px; font-weight:600; font-size:11.5px;">{}</span>',
            bg, fg, label
        )

    @admin.display(description="Status")
    def accepted_status(self, obj):
        if obj.accepted:
            return mark_safe('<span style="color:#16a34a; font-weight:700;"><i class="fas fa-check-circle"></i> Tasdiqlangan</span>')
        return mark_safe('<span style="color:#dc2626; font-weight:700;"><i class="fas fa-clock"></i> Kutilmoqda</span>')

    @admin.action(description="Tanlangan foydalanuvchilarni tasdiqlash")
    def tasdiqlash(self, request, queryset):
        queryset.update(accepted=True)
        self.message_user(request, f"{queryset.count()} ta foydalanuvchi tasdiqlandi.")

    @admin.action(description="Tanlangan foydalanuvchilarni tasdiqdan chiqarish")
    def bekor_qilish(self, request, queryset):
        queryset.update(accepted=False)
        self.message_user(request, f"{queryset.count()} ta foydalanuvchi tasdig'i bekor qilindi.")


class oquvIshlariAdmin(admin.ModelAdmin):
    # Ish turi va betlar soni nom ostida ko'rsatiladi — shunda jadval
    # ekranga sig'adi (ikkalasi ham o'ng tomondagi filtrda bor).
    list_display = ('id', 'nomi_display', 'muallif', 'sana', 'file_preview', 'public_badge', 'tahrirlash_tugmasi')
    list_display_links = ('id', 'nomi_display')
    search_fields = ('nomi', 'haqida', 'muallif__ism', 'muallif__familiya')
    list_filter = ('turi', 'sana', 'foreveryone')
    date_hierarchy = 'sana'
    list_per_page = 25

    @admin.display(description="Amallar")
    def tahrirlash_tugmasi(self, obj):
        return make_edit_button(obj)

    @admin.display(description="Ish nomi", ordering='nomi')
    def nomi_display(self, obj):
        qismlar = [obj.turi or "Turi ko'rsatilmagan"]
        if obj.betlar_soni:
            qismlar.append("%s bet" % obj.betlar_soni)
        return format_html(
            '<div style="line-height:1.45;"><span style="font-weight:600;">{}</span>'
            '<br><span style="color:#94a3b8; font-size:11.5px;">{}</span></div>',
            obj.nomi, " · ".join(qismlar),
        )

    @admin.display(description="Fayl")
    def file_preview(self, obj):
        if obj.fayl:
            return format_html('<a href="{}" target="_blank" style="color:#2563eb; font-weight:600;"><i class="fas fa-file-pdf"></i> Ochish</a>', obj.get_fayl_url)
        return mark_safe('<span style="color:#94a3b8;">Fayl yo\'q</span>')

    @admin.display(description="Ommaviylik")
    def public_badge(self, obj):
        if obj.foreveryone:
            return mark_safe('<span style="background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">Ommaviy</span>')
        return mark_safe('<span style="background:#f1f5f9; color:#64748b; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">Shaxsiy</span>')


class ilmiy_ishlariAdmin(admin.ModelAdmin):
    # Ish turi va kategoriya nom ostida — jadval ekranga sig'ishi uchun.
    list_display = ('id', 'nomi_display', 'muallif', 'sana', 'file_preview', 'public_badge', 'tahrirlash_tugmasi')
    list_display_links = ('id', 'nomi_display')
    search_fields = ('nomi', 'haqida', 'muallif__ism', 'muallif__familiya')
    list_filter = ('turi', 'kategoriya', 'sana', 'foreveryone')
    date_hierarchy = 'sana'
    list_per_page = 25

    @admin.display(description="Amallar")
    def tahrirlash_tugmasi(self, obj):
        return make_edit_button(obj)

    @admin.display(description="Ish nomi", ordering='nomi')
    def nomi_display(self, obj):
        qismlar = [q for q in (obj.turi, obj.kategoriya) if q]
        return format_html(
            '<div style="line-height:1.45;"><span style="font-weight:600;">{}</span>'
            '<br><span style="color:#94a3b8; font-size:11.5px;">{}</span></div>',
            obj.nomi, " · ".join(qismlar) or "Turi ko'rsatilmagan",
        )

    @admin.display(description="Fayl")
    def file_preview(self, obj):
        if obj.fayl:
            return format_html('<a href="{}" target="_blank" style="color:#2563eb; font-weight:600;"><i class="fas fa-file-alt"></i> Ochish</a>', obj.get_fayl_url)
        return mark_safe('<span style="color:#94a3b8;">Fayl yo\'q</span>')

    @admin.display(description="Ommaviylik")
    def public_badge(self, obj):
        if obj.foreveryone:
            return mark_safe('<span style="background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">Ommaviy</span>')
        return mark_safe('<span style="background:#f1f5f9; color:#64748b; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">Shaxsiy</span>')


class video_darslarAdmin(admin.ModelAdmin):
    list_display = ('id', 'nomi', 'muallif', 'sana', 'video_preview', 'public_badge', 'tahrirlash_tugmasi')
    search_fields = ('nomi', 'haqida', 'muallif__ism', 'muallif__familiya')
    list_filter = ('sana', 'foreveryone')
    date_hierarchy = 'sana'
    list_per_page = 25

    @admin.display(description="Amallar")
    def tahrirlash_tugmasi(self, obj):
        return make_edit_button(obj)

    @admin.display(description="Video")
    def video_preview(self, obj):
        if obj.video:
            return format_html('<a href="{}" target="_blank" style="color:#2563eb; font-weight:600;"><i class="fas fa-play-circle"></i> Ko\'rish</a>', obj.get_video_url)
        return mark_safe('<span style="color:#94a3b8;">Video yo\'q</span>')

    @admin.display(description="Ommaviylik")
    def public_badge(self, obj):
        if obj.foreveryone:
            return mark_safe('<span style="background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">Ommaviy</span>')
        return mark_safe('<span style="background:#f1f5f9; color:#64748b; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">Shaxsiy</span>')


class KafedraTalablariAdmin(admin.ModelAdmin):
    list_display = ('id', 'sarlavha', 'kafedra', 'mudir', 'ish_turi', 'talab_miqdori', 'muddati', 'status_badge', 'tahrirlash_tugmasi')
    search_fields = ('sarlavha', 'kafedra__nomi', 'mudir__ism', 'mudir__familiya')
    list_filter = ('ish_turi', 'faol', 'kafedra')
    date_hierarchy = 'muddati'
    list_per_page = 25

    @admin.display(description="Amallar")
    def tahrirlash_tugmasi(self, obj):
        return make_edit_button(obj)

    @admin.display(description="Faollik")
    def status_badge(self, obj):
        if obj.faol:
            return mark_safe('<span style="background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">Faol</span>')
        return mark_safe('<span style="background:#fee2e2; color:#b91c1c; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">Nofaol</span>')


class KafedralarAdmin(admin.ModelAdmin):
    list_display = ('id', 'nomi', 'mudir', 'fakultet', 'tahrirlash_tugmasi')
    search_fields = ('nomi', 'mudir__ism', 'mudir__familiya', 'fakultet__nomi')
    list_filter = ('fakultet',)
    list_per_page = 25

    @admin.display(description="Amallar")
    def tahrirlash_tugmasi(self, obj):
        return make_edit_button(obj)


class DekanatlarAdmin(admin.ModelAdmin):
    list_display = ('id', 'nomi', 'dekan', 'tahrirlash_tugmasi')
    search_fields = ('nomi', 'dekan__ism', 'dekan__familiya')
    list_filter = ('nomi',)
    list_per_page = 25

    @admin.display(description="Amallar")
    def tahrirlash_tugmasi(self, obj):
        return make_edit_button(obj)


# --- Register ---
admin.site.register(Foydalanuvchilar, FoydalanuvchilarAdmin)
admin.site.register(Kafedralar, KafedralarAdmin)
admin.site.register(oquvIshlari, oquvIshlariAdmin)
admin.site.register(ilmiy_ishlari, ilmiy_ishlariAdmin)
admin.site.register(Dekanatlar, DekanatlarAdmin)
admin.site.register(video_darslar, video_darslarAdmin)
admin.site.register(KafedraTalablari, KafedraTalablariAdmin)
