"""
Definition of urls for first_project.
"""
from django.conf import settings
from django.conf.urls.static import static
from datetime import datetime
from django.urls import path
from django.contrib import admin
from django.contrib.auth.views import LoginView, LogoutView
from app import forms, views
from django.urls import path, include

urlpatterns = [
    path('home/', views.index, name='index'),
    path('login/', views.login_view, name='login'),
    path('google/login/', views.google_login, name='google_login'),
    path('google/callback/', views.google_callback, name='google_callback'),
    path('', views.index, name='index'),
    path('logout/',views.logout, name='logout'),
    path('home1/', views.home1, name='home1'),
    path('home2/', views.home2, name='home2'),
    path('home3/', views.home3, name='home3'),
    path('home4/', views.home4, name='home4'),
    path('ilmiy_ishlari/<int:user_id>/', views.ilmiy_ishlari, name='ilmiy_ishlari'),
    path('ilmiy_ishlari2/<int:user_id>/', views.ilmiy_ishlari2, name='ilmiy_ishlari2'),
    path('ilmiy_ishlari3/<int:user_id>/', views.ilmiy_ishlari3, name='ilmiy_ishlari3'),
    path('ilmiy_ishlari4/<int:user_id>/', views.ilmiy_ishlari4, name='ilmiy_ishlari4'),
    path('oquv_ishlari2/<int:user_id>/', views.oquv_ishlari2, name='oquv_ishlari2'),
    path('oquv_ishlari3/<int:user_id>/', views.oquv_ishlari3, name='oquv_ishlari3'),
    path('oquv_ishlari4/<int:user_id>/', views.oquv_ishlari4, name='oquv_ishlari4'),
    path('profile/<int:user_id>/', views.profile, name='profile'),
    path('profile2/<int:user_id>/', views.profile2, name='profile2'),
    path('profile3/<int:user_id>/', views.profile3, name='profile3'),
    path('profile4/<int:user_id>/', views.profile4, name='profile4'),
    path('kafedra_talablari/<int:user_id>/', views.kafedra_talablari, name='kafedra_talablari'),
    path('qoshish_talab/<int:user_id>/', views.qoshish_talab, name='qoshish_talab'),
    path('tahrirlash_talab/<int:t_id>/<int:user_id>/', views.tahrirlash_talab, name='tahrirlash_talab'),
    path('ochir_talab/<int:t_id>/<int:user_id>/', views.ochir_talab, name='ochir_talab'),
    path('talablar_monitoring/<int:user_id>/', views.talablar_monitoring, name='talablar_monitoring'),
    path('kafedra_oqituvchilari/<int:user_id>/', views.kafedra_oqituvchilari, name='kafedra_oqituvchilari'),
    path('fakultet_oqituvchilari/<int:user_id>/', views.fakultet_oqituvchilari, name='fakultet_oqituvchilari'),
    path('fakultet_hisoboti/<int:fakultet_id>/', views.fakultet_hisoboti4, name='fakultet_hisoboti4'),

    path('admin/', admin.site.urls),
    path('oquv_ishlari/<int:user_id>/', views.oquv_ishlari, name='oquv_ishlari'),
    path('qoshish/<int:user_id>/',views.qoshish, name='qoshish'),
    path('qoshish_i/<int:user_id>/',views.qoshish_i, name='qoshish_i'),
    path('qoshish_oquv/<int:user_id>/',views.qoshish_oquv, name='qoshish_oquv'),
    path('qoshish_ilmiy/<int:user_id>/',views.qoshish_ilmiy, name='qoshish_ilmiy'),
    path('ochir/<int:j_id>/<int:user_id>/',views.ochir, name='ochir'),
    path('ochirish/<int:i_id>/<int:j_id>/<int:user_id>/', views.ochirish, name='ochirish'),
    path('filtrlash_ilmiy/<int:user_id>/',views.filtrlash_ilmiy, name='filtrlash_ilmiy'),
    path('filtrlash_ilmiy2/<int:user_id>/',views.filtrlash_ilmiy2, name='filtrlash_ilmiy2'),
    path('filtrlash_ilmiy3/<int:user_id>/',views.filtrlash_ilmiy3, name='filtrlash_ilmiy3'),
    path('filtrlash_oquv/<int:user_id>/',views.filtrlash_oquv, name='filtrlash_oquv'),
    path('filtrlash_oquv2/<int:user_id>/',views.filtrlash_oquv2, name='filtrlash_oquv2'),
    path('filtrlash_oquv3/<int:user_id>/',views.filtrlash_oquv3, name='filtrlash_oquv3'),
    path('tahrirlash_ilmiy/<int:i_id>/<int:t_id>/<int:user_id>/', views.tahrirlash_ilmiy, name='tahrirlash_ilmiy'),
    path('download-zip/', views.download_zip, name='download_zip'),
    path('logout/', views.logout, name='logout'),
    path('profile_edit/<int:user_id>/', views.profil_tahrir, name='profil_tahrirlash'),
    path('profile_edit2/<int:user_id>/', views.profillarni_tahrirlash, name='profillarni_tahrirlash'),
    path('teachers/', views.teachers, name='teachers'),
    path('teacher1/<int:id>/', views.teacher1, name='teacher1'),
    path('video_darslar/<int:user_id>/', views.video_darslar, name='video_darslar'),
    path('tahrirlash_video/<int:v_id>/<int:user_id>/', views.tahrirlash_video, name='tahrirlash_video'),
    path('qoshish_video/<int:user_id>/', views.qoshish_video, name='qoshish_video'),
    path('ochirish_video/<int:user_id>/', views.ochirish_video, name='ochirish_video'),
    path('ochir_video/<int:v_id>/<int:user_id>/', views.ochir_video, name='ochir_video'),
    path('video_filtrlash/<int:user_id>/', views.video_filtrlash, name='video_filtrlash'),
    path('qidirish/', views.qidirish, name='qidirish'),
    path('registratsiya/', views.registratsiya, name='registratsiya'),
    path('get-kafedralar/<int:fakultet_id>/', views.get_kafedralar, name='get_kafedralar'),
    path('video/<int:video_id>/', views.serve_video, name='serve_video'),
    path('search_article/', views.search_article, name='search_article'),
    path('article/', views.article,name='article'),
    path('book/', views.book, name='book'),
    path('search_book/', views.search_book, name='search_book'),
    path('video/',views.video, name='video'),
    path('search_video/', views.search_video, name='search_video'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
