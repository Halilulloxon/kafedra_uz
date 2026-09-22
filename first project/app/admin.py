from django.contrib import admin
from .models import Foydalanuvchilar, Kafedralar, oquvIshlari, ilmiy_ishlari, Dekanatlar, video_darslar, KafedraTalablari

# --- Inlines ---
class oquvIshlariAdmin(admin.ModelAdmin):
    list_display = ('id', 'nomi', 'turi', 'muallif', 'sana', 'foreveryone')
    search_fields = ('nomi', 'turi', 'muallif')
    list_filter = ('nomi', 'turi', 'muallif', 'sana', 'foreveryone')
   

class ilmiy_ishlariAdmin(admin.ModelAdmin):
    list_display = ('id', 'nomi', 'turi', 'muallif', 'sana', 'foreveryone')
    search_fields = ('nomi', 'turi', 'muallif')
    list_filter = ('nomi', 'turi', 'muallif', 'sana', 'foreveryone')


class video_darslarAdmin(admin.ModelAdmin):
    list_display = ('id', 'nomi', 'muallif')
    search_fields = ('nomi', 'muallif')
    list_filter = ('nomi', 'muallif')


class KafedraTalablariAdmin(admin.ModelAdmin):
    list_display = ('id', 'kafedra', 'mudir', 'sarlavha', 'ish_turi', 'talab_miqdori', 'muddati', 'faol')
    search_fields = ('sarlavha', 'kafedra__nomi', 'mudir__ism', 'mudir__familiya')
    list_filter = ('ish_turi', 'faol', 'kafedra')

# --- Admin Classes ---
class FoydalanuvchilarAdmin(admin.ModelAdmin):
    list_display = ('id', 'ism', 'familiya', 'sharifi', 'tugulgan_sana', 'kafedra','accepted','created')
    search_fields = ('ism', 'familiya', 'sharifi')
    list_filter = ('tugulgan_sana', 'kafedra','accepted')

class KafedralarAdmin(admin.ModelAdmin):
    list_display = ('nomi', 'mudir')
    search_fields = ('nomi', 'mudir__ism', 'mudir__familiya')
    list_filter = ('nomi',)

class DekanatlarAdmin(admin.ModelAdmin):
    list_display = ('nomi', 'dekan')
    search_fields = ('nomi', 'dekan__ism', 'dekan__familiya')
    list_filter = ('nomi',)

# --- Register ---
admin.site.register(Foydalanuvchilar, FoydalanuvchilarAdmin)
admin.site.register(Kafedralar, KafedralarAdmin)
admin.site.register(oquvIshlari, oquvIshlariAdmin)
admin.site.register(ilmiy_ishlari, ilmiy_ishlariAdmin)
admin.site.register(Dekanatlar, DekanatlarAdmin)
admin.site.register(video_darslar, video_darslarAdmin)
admin.site.register(KafedraTalablari, KafedraTalablariAdmin)
