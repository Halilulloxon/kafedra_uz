"""
Definition of views.
"""

from datetime import datetime
from functools import wraps
from django.core.exceptions import PermissionDenied
from django.shortcuts import render, get_object_or_404,redirect
from django.http import HttpRequest
from .forms import IlmiyForm, Oquv, OquvForm , VideoForm, KafedraTalablariForm
from .models import Foydalanuvchilar, oquvIshlari, ilmiy_ishlari as ilmiy , ilmiy_ishlari as ilmiy_a, Kafedralar, video_darslar as videolar, Dekanatlar, KafedraTalablari
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth import logout
from django.contrib import messages
from datetime import datetime
from django.contrib.auth.hashers import check_password
from django.db.models import Q, Count
import os
import re
from django.http import HttpResponse, FileResponse, JsonResponse
from django.conf import settings
from .models import video_darslar as VideoModel  
import secrets
import json
from django.core.files.base import ContentFile
from . import google_oauth

def get_current_user(request):
    user_id = request.session.get('user_id')
    if not user_id:
        return None
    try:
        return Foydalanuvchilar.objects.get(id=user_id)
    except Foydalanuvchilar.DoesNotExist:
        return None


ROL_DARAJASI = {
    'oqituvchi': 1,
    'kafedra mudiri': 2,
    'dekan': 3,
    'prorektor': 4,
}


def kabinet(eng_kam_rol=None):
    """Kabinet sahifalarining qo'riqchisi.

    - tizimga kirmagan bo'lsa — login sahifasiga yuboradi;
    - manzildagi user_id o'zinikidan boshqa bo'lsa — 403 (busiz manzildagi
      raqamni almashtirib birovning ma'lumotlarini ko'rish mumkin edi);
    - lavozimi yetarli bo'lmasa — 403. Yuqori lavozim pastdagi bo'limni ham
      ocha oladi (prorektor > dekan > kafedra mudiri > o'qituvchi).
    """
    kerakli_daraja = ROL_DARAJASI[eng_kam_rol] if eng_kam_rol else 0

    def dekorator(view):
        @wraps(view)
        def wrapper(request, *args, **kwargs):
            joriy = get_current_user(request)
            if joriy is None:
                return redirect('login')
            if kwargs.get('user_id') is not None and joriy.id != kwargs['user_id']:
                raise PermissionDenied("Bu sahifa sizga tegishli emas.")
            if ROL_DARAJASI.get(joriy.foydalanuvchi_rol, 0) < kerakli_daraja:
                raise PermissionDenied(
                    "Bu bo'lim %s uchun mo'ljallangan." % eng_kam_rol
                )
            return view(request, *args, **kwargs)
        return wrapper
    return dekorator


# Eski nom: faqat "sahifa o'ziniki" tekshiruvi.
ozining_sahifasi = kabinet()


def faqat_kafedra_mudiri(foydalanuvchi):
    """Kafedra talablarini faqat kafedra mudiri o'zgartira oladi."""
    if foydalanuvchi.foydalanuvchi_rol != 'kafedra mudiri':
        raise PermissionDenied("Kafedra talablarini faqat kafedra mudiri boshqaradi.")

from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth import authenticate, login as auth_login


def _normalize_title(title):
    if not title:
        return ""
    cleaned = re.sub(r'[^\w\s]+', ' ', str(title).strip().lower())
    return re.sub(r'\s+', ' ', cleaned).strip()


def _matches_author_name(user_fam, user_ism, author_str):
    if not author_str or not user_fam:
        return False
    a = str(author_str).lower()
    fam = str(user_fam).strip().lower()
    ism = str(user_ism).strip().lower() if user_ism else ''
    
    # Word boundary check for surname
    if not re.search(r'\b' + re.escape(fam) + r'\b', a):
        return False
    
    # If surname matched, check first name/initial if present in author_str
    if ism:
        first_initial = ism[0]
        has_initial = bool(re.search(r'\b' + re.escape(first_initial) + r'[\.\s]', a))
        has_full_ism = bool(re.search(r'\b' + re.escape(ism) + r'\b', a))
        words = re.findall(r'[a-zA-Z\u0400-\u04FF]+', a)
        if len(words) > 1:
            return has_initial or has_full_ism
    return True


def _deduplicate_works(works, current_user_id=None):
    seen = {}
    result = []
    
    for item in works:
        nomi_norm = _normalize_title(getattr(item, 'nomi', ''))
        turi_raw = (getattr(item, 'turi', '') or '').strip()
        turi_norm = turi_raw.lower()
        
        # Sarlavha 6 belgidan uzun bo'lsa, nomning o'zi asosiy kalit bo'ladi.
        # Bu bitta muallif "Scopus", ikkinchisi "Maqola" deb kiritgan holatda ham bitta deb topadi.
        if len(nomi_norm) >= 6:
            key = nomi_norm
        else:
            key = (turi_norm, nomi_norm)
        
        if key not in seen:
            seen[key] = item
            result.append(item)
        else:
            existing = seen[key]
            
            # 1. Hammualliflarni to'liq birlashtirish
            ex_authors = [m.strip() for m in re.split(r'[,;]+', getattr(existing, 'ish_mualliflari', '') or '') if m.strip()]
            new_authors = [m.strip() for m in re.split(r'[,;]+', getattr(item, 'ish_mualliflari', '') or '') if m.strip()]
            combined = ex_authors[:]
            for a in new_authors:
                if not any(a.lower() == ex.lower() for ex in ex_authors):
                    combined.append(a)
            existing.ish_mualliflari = ', '.join(combined)
            
            # 2. Maydonlarni boyitish (agar birida link/fayl/dgu bo'lsa, uni yo'g'iga o'tkazish)
            if not getattr(existing, 'maqola_link', None) and getattr(item, 'maqola_link', None):
                existing.maqola_link = item.maqola_link
            if not getattr(existing, 'dgu_raqami', None) and getattr(item, 'dgu_raqami', None):
                existing.dgu_raqami = item.dgu_raqami
            if not getattr(existing, 'fayl', None) and getattr(item, 'fayl', None):
                existing.fayl = item.fayl
            if getattr(item, 'foreveryone', False):
                existing.foreveryone = True
            if not getattr(existing, 'haqida', None) and getattr(item, 'haqida', None):
                existing.haqida = item.haqida
            if not getattr(existing, 'sana', None) and getattr(item, 'sana', None):
                existing.sana = item.sana
            # Agar bittasi Scopus deb kiritilgan bo'lsa, nufuzliroq turga ko'tariladi
            if 'scopus' in (getattr(item, 'turi', '') or '').lower():
                existing.turi = 'Scopus'
            elif 'patent' in (getattr(item, 'turi', '') or '').lower() and 'maqola' in (getattr(existing, 'turi', '') or '').lower():
                existing.turi = item.turi

            # Agar joriy foydalanuvchi yangi nusxaning haqiqiy egasi bo'lsa, tahrirlash huquqi uchun o'sha ob'ektni afzal ko'rish
            if current_user_id and getattr(item, 'muallif_id', None) == current_user_id and getattr(existing, 'muallif_id', None) != current_user_id:
                idx = result.index(existing)
                item.ish_mualliflari = existing.ish_mualliflari
                if not getattr(item, 'maqola_link', None) and getattr(existing, 'maqola_link', None):
                    item.maqola_link = existing.maqola_link
                if not getattr(item, 'dgu_raqami', None) and getattr(existing, 'dgu_raqami', None):
                    item.dgu_raqami = existing.dgu_raqami
                if not getattr(item, 'fayl', None) and getattr(existing, 'fayl', None):
                    item.fayl = existing.fayl
                if getattr(existing, 'foreveryone', False):
                    item.foreveryone = True
                if 'scopus' in (getattr(existing, 'turi', '') or '').lower():
                    item.turi = 'Scopus'
                result[idx] = item
                seen[key] = item
                
    return result


def _get_user_publications(user, model_class):
    if not user or not user.familiya:
        return []
    
    qs = model_class.objects.filter(
        Q(muallif_id=user.id) | Q(ish_mualliflari__icontains=user.familiya)
    ).order_by('-sana', '-id')
    
    user_works = []
    for item in qs:
        if getattr(item, 'muallif_id', None) == user.id:
            user_works.append(item)
        elif getattr(item, 'ish_mualliflari', None):
            authors = [m.strip() for m in re.split(r'[,;]+', str(item.ish_mualliflari)) if m.strip()]
            if any(_matches_author_name(user.familiya, user.ism, a) for a in authors):
                user_works.append(item)
                
    return _deduplicate_works(user_works, current_user_id=user.id)


def login_view(request):
    if request.method == 'POST':
        login = request.POST.get('login_f')
        password = request.POST.get('password')

        # 1. Check Django Superuser / Staff User (Admin Panel login)
        django_user = authenticate(request, username=login, password=password)
        if django_user is not None and (django_user.is_staff or django_user.is_superuser):
            auth_login(request, django_user)
            request.session['username'] = django_user.username
            messages.success(request, f"Xush kelibsiz, administrator {django_user.username}!")
            return redirect('/admin/')

        # 2. Check Standard Foydalanuvchilar (Teachers, Heads, Deans, Vice-rectors)
        try:
            user = Foydalanuvchilar.objects.get(login_f=login)
        except Foydalanuvchilar.DoesNotExist:
            user = None

        is_password_valid = False
        if user is not None and password:
            if user.parol == password:
                is_password_valid = True
                # Parolni avtomatik xavfsiz xeshga o'tkazish (bazani buzmasdan)
                try:
                    user.parol = make_password(password)
                    user.save(update_fields=['parol'])
                except Exception:
                    pass
            elif check_password(password, user.parol):
                is_password_valid = True

        if user is None or not is_password_valid:
            messages.error(request, 'Login yoki parol xato!')

        elif user.accepted == True:
            request.session['user_id'] = user.id
            request.session['username'] = user.login_f

            return rol_bosh_sahifasi(user)

        elif not user.accepted:
            messages.warning(
                request,
                'Sizning hisobingiz hali tasdiqlanmagan. Iltimos, administrator tasdiqlashini kuting.'
            )

        else:
            messages.error(request, 'Login yoki parol xato!')

    return render(request, 'app/login.html', {'year': datetime.now().year})


def rol_bosh_sahifasi(foydalanuvchi):
    """Foydalanuvchini lavozimiga mos kabinetga yuboradi."""
    if foydalanuvchi.foydalanuvchi_rol == 'prorektor':
        return redirect('home4')
    if foydalanuvchi.foydalanuvchi_rol == 'kafedra mudiri':
        return redirect('home2')
    if foydalanuvchi.foydalanuvchi_rol == 'dekan':
        return redirect('home3')
    return redirect('home1')


def google_login(request):
    """Foydalanuvchini Google hisobini tanlash sahifasiga yuboramiz."""
    if not google_oauth.sozlangan():
        messages.error(request, "Google orqali kirish hozircha sozlanmagan.")
        return redirect('login')

    state = google_oauth.yangi_state()
    request.session['google_state'] = state
    return redirect(google_oauth.kirish_manzili(request, state))


def google_callback(request):
    """Google qaytargan javobni qabul qilamiz."""
    if not google_oauth.sozlangan():
        messages.error(request, "Google orqali kirish hozircha sozlanmagan.")
        return redirect('login')

    kutilgan_state = request.session.pop('google_state', None)

    if request.GET.get('error'):
        messages.warning(request, "Google orqali kirish bekor qilindi.")
        return redirect('login')

    kod = request.GET.get('code')
    if not kod or not kutilgan_state or request.GET.get('state') != kutilgan_state:
        messages.error(request, "Google orqali kirishni qaytadan boshlang.")
        return redirect('login')

    try:
        token = google_oauth.token_olish(request, kod)
        profil = google_oauth.profil_olish(token)
    except google_oauth.GoogleXato as xato:
        messages.error(request, str(xato))
        return redirect('login')

    foydalanuvchi = Foydalanuvchilar.objects.filter(gmail__iexact=profil['email']).first()

    # Hisob yo'q — ro'yxatdan o'tish formasini Google ma'lumotlari bilan to'ldiramiz
    if foydalanuvchi is None:
        request.session['google_profil'] = profil
        messages.info(
            request,
            "Ma'lumotlaringiz Google hisobidan olindi. Qolgan maydonlarni to'ldirib, "
            "ro'yxatdan o'tishni yakunlang."
        )
        return redirect('registratsiya')

    if not foydalanuvchi.accepted:
        messages.warning(
            request,
            'Sizning hisobingiz hali tasdiqlanmagan. Iltimos, administrator tasdiqlashini kuting.'
        )
        return redirect('login')

    request.session.pop('google_profil', None)
    request.session['user_id'] = foydalanuvchi.id
    request.session['username'] = foydalanuvchi.login_f
    messages.success(request, "Xush kelibsiz, %s!" % foydalanuvchi.ism)
    return rol_bosh_sahifasi(foydalanuvchi)


def login(request):
    """Renders the login page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/login.html',
        {
            'title':'Login',
            'year':datetime.now().year,
        }
    )
@kabinet()
def home1(request):
    foydalanuvchi = get_current_user(request)
    if not foydalanuvchi:
        return redirect('login')
    user_ilmiy = _get_user_publications(foydalanuvchi, ilmiy)
    user_oquv = _get_user_publications(foydalanuvchi, oquvIshlari)

    maqolalar_soni = sum(1 for w in user_ilmiy if (getattr(w, 'turi', '') or '').lower() == 'maqola')
    scopuslar_soni = sum(1 for w in user_ilmiy if (getattr(w, 'turi', '') or '').lower() == 'scopus')
    oquv_soni = len(user_oquv)
    ilmiy_soni = len(user_ilmiy)
    jami = oquv_soni + ilmiy_soni

    def _count_by_month(items, m):
        return sum(1 for w in items if getattr(getattr(w, 'sana', None), 'month', None) == m)

    oy_o = [_count_by_month(user_oquv, m) for m in range(1, 13)]
    oy_i = [_count_by_month(user_ilmiy, m) for m in range(1, 13)]

    # Kafedra talablari va o'qituvchining bajarish foizi
    talablar = []
    if foydalanuvchi.kafedra:
        raw_talablar = KafedraTalablari.objects.filter(kafedra=foydalanuvchi.kafedra, faol=True)
        for t in raw_talablar:
            if t.ish_turi == 'Scopus':
                bajarilgan = scopuslar_soni
            elif t.ish_turi == 'Maqola':
                bajarilgan = maqolalar_soni
            elif t.ish_turi == 'Tezis':
                bajarilgan = sum(1 for w in user_ilmiy if (getattr(w, 'turi', '') or '').lower() == 'tezis')
            elif t.ish_turi in ['Darslik', "O`quv qo`llanma", 'Monografiya', 'Uslubiy ko`rsatma']:
                bajarilgan = sum(1 for w in user_oquv if (getattr(w, 'turi', '') or '').lower() == t.ish_turi.lower())
            else:
                bajarilgan = ilmiy_soni + oquv_soni
            
            foiz = min(100, int((bajarilgan / t.talab_miqdori) * 100)) if t.talab_miqdori > 0 else 100
            talablar.append({
                'obj': t,
                'bajarilgan': bajarilgan,
                'foiz': foiz,
                'holat': 'Bajarildi' if foiz >= 100 else 'Jarayonda'
            })

    """Renders the home page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/profil.html',
        {
            'title':'O\'qituvchi Paneli',
            'foydalanuvchi':foydalanuvchi,
            'year':datetime.now().year,
            'maqolalar_soni':maqolalar_soni,
            'scopuslar_soni':scopuslar_soni,
            'oquv_soni':oquv_soni,
            'jami':jami,
            'oy_o': oy_o,
            'oy_i': oy_i,
            'talablar': talablar,
        }
    )
@kabinet('kafedra mudiri')
def home2(request):
    foydalanuvchi = get_current_user(request)
    if not foydalanuvchi:
        return redirect('login')
    
    if foydalanuvchi.kafedra:
        kafedra_ilmiy = _deduplicate_works(ilmiy.objects.filter(muallif__kafedra=foydalanuvchi.kafedra).order_by('-sana', '-id'))
        kafedra_oquv = _deduplicate_works(oquvIshlari.objects.filter(muallif__kafedra=foydalanuvchi.kafedra).order_by('-sana', '-id'))
        maqolalar_soni = sum(1 for w in kafedra_ilmiy if (getattr(w, 'turi', '') or '').lower() == 'maqola')
        scopuslar_soni = sum(1 for w in kafedra_ilmiy if (getattr(w, 'turi', '') or '').lower() == 'scopus')
        oquv_soni = len(kafedra_oquv)
        ilmiy_soni = len(kafedra_ilmiy)
        talablar_soni = KafedraTalablari.objects.filter(kafedra=foydalanuvchi.kafedra).count()
        oqituvchilar_soni = Foydalanuvchilar.objects.filter(kafedra=foydalanuvchi.kafedra).count()
    else:
        maqolalar_soni = scopuslar_soni = oquv_soni = ilmiy_soni = talablar_soni = oqituvchilar_soni = 0
    
    jami = oquv_soni + ilmiy_soni

    """Renders the home page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/profil2.html',
        {
            'title':'Kafedra Mudiri Paneli',
            'foydalanuvchi':foydalanuvchi,
            'year':datetime.now().year,
            'maqolalar_soni':maqolalar_soni,
            'scopuslar_soni':scopuslar_soni,
            'oquv_soni':oquv_soni,
            'jami':jami,
            'talablar_soni': talablar_soni,
            'oqituvchilar_soni': oqituvchilar_soni,
        }
    )
@kabinet('dekan')
def home3(request):
    foydalanuvchi = get_current_user(request)
    if not foydalanuvchi:
        return redirect('login')
    
    if foydalanuvchi.fakulteti:
        fak_ilmiy = _deduplicate_works(ilmiy.objects.filter(muallif__fakulteti=foydalanuvchi.fakulteti).order_by('-sana', '-id'))
        fak_oquv = _deduplicate_works(oquvIshlari.objects.filter(muallif__fakulteti=foydalanuvchi.fakulteti).order_by('-sana', '-id'))
        maqolalar_soni = sum(1 for w in fak_ilmiy if (getattr(w, 'turi', '') or '').lower() == 'maqola')
        scopuslar_soni = sum(1 for w in fak_ilmiy if (getattr(w, 'turi', '') or '').lower() == 'scopus')
        oquv_soni = len(fak_oquv)
        ilmiy_soni = len(fak_ilmiy)
        kafedralar = Kafedralar.objects.filter(fakultet=foydalanuvchi.fakulteti)
        kafedralar_soni = kafedralar.count()
        oqituvchilar_soni = Foydalanuvchilar.objects.filter(fakulteti=foydalanuvchi.fakulteti).count()
        kafedra_stats = []
        for k in kafedralar:
            k_teachers = Foydalanuvchilar.objects.filter(kafedra=k).count()
            kafedra_stats.append({
                'kafedra': k,
                'teachers_count': k_teachers,
            })
    else:
        maqolalar_soni = scopuslar_soni = oquv_soni = ilmiy_soni = kafedralar_soni = oqituvchilar_soni = 0
        kafedra_stats = []
    
    jami = oquv_soni + ilmiy_soni
    """Renders the home page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/profil3.html',
        {
            'title':'Dekan Paneli',
            'foydalanuvchi':foydalanuvchi,
            'year':datetime.now().year,
            'maqolalar_soni':maqolalar_soni,
            'scopuslar_soni':scopuslar_soni,
            'oquv_soni':oquv_soni,
            'jami':jami,
            'kafedralar_soni': kafedralar_soni,
            'oqituvchilar_soni': oqituvchilar_soni,
            'kafedra_stats': kafedra_stats,
        }
    )

@kabinet('prorektor')
def home4(request):
    foydalanuvchi = get_current_user(request)
    if not foydalanuvchi:
        return redirect('login')
    
    fakultetlar_soni = Dekanatlar.objects.count()
    kafedralar_soni = Kafedralar.objects.count()
    oqituvchilar_soni = Foydalanuvchilar.objects.count()
    
    all_ilmiy = _deduplicate_works(ilmiy.objects.all().order_by('-sana', '-id'))
    all_oquv = _deduplicate_works(oquvIshlari.objects.all().order_by('-sana', '-id'))

    maqolalar_soni = sum(1 for w in all_ilmiy if (getattr(w, 'turi', '') or '').lower() == 'maqola')
    scopuslar_soni = sum(1 for w in all_ilmiy if (getattr(w, 'turi', '') or '').lower() == 'scopus')
    tezislar_soni = sum(1 for w in all_ilmiy if (getattr(w, 'turi', '') or '').lower() == 'tezis')
    
    oquv_soni = len(all_oquv)
    ilmiy_soni = len(all_ilmiy)
    video_soni = videolar.objects.count()
    jami = oquv_soni + ilmiy_soni + video_soni

    def _count_month(items, m):
        return sum(1 for w in items if getattr(getattr(w, 'sana', None), 'month', None) == m)

    oy_o = [_count_month(all_oquv, m) for m in range(1, 13)]
    oy_i = [_count_month(all_ilmiy, m) for m in range(1, 13)]
    
    fakultetlar_stat = []
    fakultet_labels = []
    fakultet_maqolalar = []
    fakultet_kitoblar = []
    
    for f in Dekanatlar.objects.all():
        m_list = _deduplicate_works(ilmiy.objects.filter(muallif__fakulteti=f).order_by('-sana', '-id'))
        k_list = _deduplicate_works(oquvIshlari.objects.filter(muallif__fakulteti=f).order_by('-sana', '-id'))
        scopus_cnt = sum(1 for w in m_list if (getattr(w, 'turi', '') or '').lower() == 'scopus')
        m_count = len(m_list)
        k_count = len(k_list)
        t_count = Foydalanuvchilar.objects.filter(fakulteti=f).count()
        k_dep_count = Kafedralar.objects.filter(fakultet=f).count()
        fakultetlar_stat.append({
            'id': f.id,
            'nomi': f.nomi,
            'dekan': f.dekan,
            'kafedralar_count': k_dep_count,
            'oqituvchilar': t_count,
            'scopus': scopus_cnt,
            'maqolalar': m_count,
            'kitoblar': k_count,
            'jami': m_count + k_count
        })
        fakultet_labels.append(f.nomi)
        fakultet_maqolalar.append(m_count)
        fakultet_kitoblar.append(k_count)

    kafedralar_stat = []
    for k in Kafedralar.objects.select_related('fakultet', 'mudir').all():
        km_list = _deduplicate_works(ilmiy.objects.filter(muallif__kafedra=k).order_by('-sana', '-id'))
        kk_list = _deduplicate_works(oquvIshlari.objects.filter(muallif__kafedra=k).order_by('-sana', '-id'))
        k_scopus = sum(1 for w in km_list if (getattr(w, 'turi', '') or '').lower() == 'scopus')
        km_count = len(km_list)
        kk_count = len(kk_list)
        kt_count = Foydalanuvchilar.objects.filter(kafedra=k).count()
        kafedralar_stat.append({
            'id': k.id,
            'nomi': k.nomi,
            'fakultet': k.fakultet,
            'mudir': k.mudir,
            'oqituvchilar': kt_count,
            'scopus': k_scopus,
            'maqolalar': km_count,
            'kitoblar': kk_count,
            'jami': km_count + kk_count,
        })

    # Mualliflar monitoringi va filtri uchun
    teachers_qs = Foydalanuvchilar.objects.select_related('kafedra', 'fakulteti').all()
    teachers_data = _build_teachers_profile_list(teachers_qs)
    teachers_data.sort(key=lambda t: t['jami_count'], reverse=True)

    return render(
        request,
        'app/profil4.html',
        {
            'title': 'Prorektor Paneli',
            'foydalanuvchi': foydalanuvchi,
            'year': datetime.now().year,
            'fakultetlar_soni': fakultetlar_soni,
            'kafedralar_soni': kafedralar_soni,
            'oqituvchilar_soni': oqituvchilar_soni,
            'maqolalar_soni': maqolalar_soni,
            'scopuslar_soni': scopuslar_soni,
            'tezislar_soni': tezislar_soni,
            'oquv_soni': oquv_soni,
            'ilmiy_soni': ilmiy_soni,
            'video_soni': video_soni,
            'jami': jami,
            'oy_o': oy_o,
            'oy_i': oy_i,
            'fakultetlar_stat': fakultetlar_stat,
            'kafedralar_stat': kafedralar_stat,
            'teachers_data': teachers_data,
            'fakultet_labels': fakultet_labels,
            'fakultet_maqolalar': fakultet_maqolalar,
            'fakultet_kitoblar': fakultet_kitoblar,
        }
    )

@kabinet('prorektor')
def profile4(request, user_id):
    return home4(request)

@kabinet()
def kafedra_talablari(request, user_id):
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    talablar = KafedraTalablari.objects.filter(kafedra=foydalanuvchi.kafedra) if foydalanuvchi.kafedra else []
    return render(request, 'app/kafedra_talablari.html', {
        'title': 'Kafedra Talablari va Rejasi',
        'foydalanuvchi': foydalanuvchi,
        'talablar': talablar,
        'year': datetime.now().year,
    })

@ozining_sahifasi
def qoshish_talab(request, user_id):
    foydalanuvchi = get_current_user(request)
    faqat_kafedra_mudiri(foydalanuvchi)
    if request.method == 'POST':
        form = KafedraTalablariForm(request.POST)
        if form.is_valid():
            talab = form.save(commit=False)
            talab.kafedra = foydalanuvchi.kafedra
            talab.mudir = foydalanuvchi
            talab.save()
            messages.success(request, "Yangi talab muvaffaqiyatli qo'shildi!")
            return redirect('kafedra_talablari', user_id=user_id)
    else:
        form = KafedraTalablariForm()
    return render(request, 'app/qoshish_talab.html', {
        'title': "Yangi Talab Qo'shish",
        'form': form,
        'foydalanuvchi': foydalanuvchi,
        'year': datetime.now().year,
    })

@ozining_sahifasi
def tahrirlash_talab(request, t_id, user_id):
    foydalanuvchi = get_current_user(request)
    faqat_kafedra_mudiri(foydalanuvchi)
    talab = get_object_or_404(KafedraTalablari, id=t_id, kafedra=foydalanuvchi.kafedra)
    if request.method == 'POST':
        form = KafedraTalablariForm(request.POST, instance=talab)
        if form.is_valid():
            form.save()
            messages.success(request, "Talab muvaffaqiyatli tahrirlandi!")
            return redirect('kafedra_talablari', user_id=user_id)
    else:
        form = KafedraTalablariForm(instance=talab)
    return render(request, 'app/qoshish_talab.html', {
        'title': "Talabni Tahrirlash",
        'form': form,
        'foydalanuvchi': foydalanuvchi,
        'talab': talab,
        'year': datetime.now().year,
    })

@ozining_sahifasi
def ochir_talab(request, t_id, user_id):
    foydalanuvchi = get_current_user(request)
    faqat_kafedra_mudiri(foydalanuvchi)
    talab = get_object_or_404(KafedraTalablari, id=t_id, kafedra=foydalanuvchi.kafedra)
    # Faqat POST: oddiy havola yoki qidiruv roboti o'chirib yubormasligi uchun
    if request.method != 'POST':
        return redirect('kafedra_talablari', user_id=user_id)
    talab.delete()
    messages.success(request, "Talab muvaffaqiyatli o'chirildi!")
    return redirect('kafedra_talablari', user_id=user_id)


def _calculate_teacher_requirements(teacher, active_requirements, user_ilmiy=None, user_oquv=None):
    if user_ilmiy is None:
        user_ilmiy = _get_user_publications(teacher, ilmiy)
    if user_oquv is None:
        user_oquv = _get_user_publications(teacher, oquvIshlari)

    scopus_count = sum(1 for w in user_ilmiy if (getattr(w, 'turi', '') or '').lower() == 'scopus')
    maqola_count = sum(1 for w in user_ilmiy if (getattr(w, 'turi', '') or '').lower() == 'maqola')
    tezis_count = sum(1 for w in user_ilmiy if (getattr(w, 'turi', '') or '').lower() == 'tezis')
    ehm_count = sum(1 for w in user_ilmiy if (getattr(w, 'turi', '') or '').lower() in ['ehm guvohnomalar', 'patent'])

    req_details = []
    total_pct_sum = 0
    all_done = True

    for t in active_requirements:
        t_type = (t.ish_turi or '').strip().lower()
        if t_type == 'scopus':
            bajarilgan = scopus_count
        elif t_type == 'maqola':
            bajarilgan = maqola_count
        elif t_type == 'tezis':
            bajarilgan = tezis_count
        elif t_type in ['ehm guvohnomalar', 'patent', 'ehm / patent']:
            bajarilgan = ehm_count
        elif t_type in ['darslik', "o`quv qo`llanma", "o'quv qo'llanma", 'monografiya', 'uslubiy ko`rsatma', "uslubiy ko'rsatma"]:
            bajarilgan = sum(1 for w in user_oquv if (getattr(w, 'turi', '') or '').lower() == t_type)
        else:
            bajarilgan = len(user_ilmiy) + len(user_oquv)

        target = t.talab_miqdori if t.talab_miqdori and t.talab_miqdori > 0 else 1
        foiz = min(100, int((bajarilgan / target) * 100))
        if foiz < 100:
            all_done = False
        total_pct_sum += foiz

        req_details.append({
            'obj': t,
            'bajarilgan': bajarilgan,
            'talab_miqdori': target,
            'foiz': foiz,
            'holat': 'Bajarildi' if foiz >= 100 else 'Jarayonda',
            'is_done': foiz >= 100,
        })

    avg_percent = int(total_pct_sum / len(active_requirements)) if active_requirements else 100
    if not active_requirements:
        all_done = True

    return {
        'teacher': teacher,
        'ilmiy_count': len(user_ilmiy),
        'oquv_count': len(user_oquv),
        'jami_ishlar': len(user_ilmiy) + len(user_oquv),
        'requirements': req_details,
        'avg_percent': avg_percent,
        'all_completed': all_done,
        'status': 'Bajarildi' if avg_percent >= 100 else ('Qisman' if avg_percent > 0 else 'Bajarilmagan'),
    }


@kabinet('kafedra mudiri')
def talablar_monitoring(request, user_id):
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    kafedra = foydalanuvchi.kafedra
    if not kafedra:
        messages.error(request, "Sizga kafedra biriktirilmagan.")
        return redirect('home2')

    active_talablar = list(KafedraTalablari.objects.filter(kafedra=kafedra, faol=True).order_by('-yaratilgan_sana'))
    
    teachers_qs = Foydalanuvchilar.objects.filter(kafedra=kafedra).order_by('familiya', 'ism')
    
    teachers_data = []
    for teacher in teachers_qs:
        t_data = _calculate_teacher_requirements(teacher, active_talablar)
        teachers_data.append(t_data)
        
    total_teachers = len(teachers_data)
    total_active_reqs = len(active_talablar)
    
    req_stats = []
    for idx, req in enumerate(active_talablar):
        planned_total = req.talab_miqdori * total_teachers
        completed_total = sum(d['requirements'][idx]['bajarilgan'] for d in teachers_data)
        pct = min(100, int((completed_total / planned_total) * 100)) if planned_total > 0 else 0
        fulfilled_teachers_count = sum(1 for d in teachers_data if d['requirements'][idx]['is_done'])
        req_stats.append({
            'talab': req,
            'planned_total': planned_total,
            'completed_total': completed_total,
            'pct': pct,
            'fulfilled_teachers_count': fulfilled_teachers_count,
            'unfulfilled_teachers_count': total_teachers - fulfilled_teachers_count,
        })
        
    fully_completed_count = sum(1 for d in teachers_data if d['all_completed']) if total_active_reqs > 0 else total_teachers
    partial_count = sum(1 for d in teachers_data if not d['all_completed'] and d['avg_percent'] > 0)
    not_started_count = sum(1 for d in teachers_data if d['avg_percent'] == 0)
    overall_dept_pct = int(sum(d['avg_percent'] for d in teachers_data) / total_teachers) if total_teachers else 0

    q = request.GET.get('q', '').strip()
    status_filter = request.GET.get('status', 'all')
    
    filtered_teachers = teachers_data
    if q:
        q_lower = q.lower()
        filtered_teachers = [
            d for d in filtered_teachers
            if q_lower in f"{d['teacher'].familiya} {d['teacher'].ism} {d['teacher'].sharifi}".lower()
        ]
        
    if status_filter == 'completed':
        filtered_teachers = [d for d in filtered_teachers if d['all_completed']]
    elif status_filter == 'partial':
        filtered_teachers = [d for d in filtered_teachers if not d['all_completed'] and d['avg_percent'] > 0]
    elif status_filter == 'not_started':
        filtered_teachers = [d for d in filtered_teachers if d['avg_percent'] == 0]

    return render(request, 'app/talablar_monitoring.html', {
        'title': 'Kafedra Talablari Bajarilishi Monitoringi',
        'foydalanuvchi': foydalanuvchi,
        'kafedra': kafedra,
        'active_talablar': active_talablar,
        'teachers_data': filtered_teachers,
        'all_teachers_data': teachers_data,
        'req_stats': req_stats,
        'total_teachers': total_teachers,
        'total_active_reqs': total_active_reqs,
        'fully_completed_count': fully_completed_count,
        'partial_count': partial_count,
        'not_started_count': not_started_count,
        'overall_dept_pct': overall_dept_pct,
        'query': q,
        'status_filter': status_filter,
        'year': datetime.now().year,
    })


def _build_teachers_profile_list(teachers_qs):
    teachers_list = []
    for t in teachers_qs:
        user_ilmiy = _get_user_publications(t, ilmiy)
        user_oquv = _get_user_publications(t, oquvIshlari)
        user_videos = VideoModel.objects.filter(muallif_id=t.id)

        scopus_count = sum(1 for w in user_ilmiy if (getattr(w, 'turi', '') or '').lower() == 'scopus')
        maqola_count = sum(1 for w in user_ilmiy if (getattr(w, 'turi', '') or '').lower() == 'maqola')
        tezis_count = sum(1 for w in user_ilmiy if (getattr(w, 'turi', '') or '').lower() == 'tezis')
        ehm_count = sum(1 for w in user_ilmiy if (getattr(w, 'turi', '') or '').lower() in ['ehm guvohnomalar', 'patent'])

        teachers_list.append({
            'obj': t,
            'ilmiy_count': len(user_ilmiy),
            'scopus_count': scopus_count,
            'maqola_count': maqola_count,
            'tezis_count': tezis_count,
            'ehm_count': ehm_count,
            'oquv_count': len(user_oquv),
            'video_count': user_videos.count(),
            'jami_count': len(user_ilmiy) + len(user_oquv),
        })
    return teachers_list


@kabinet('kafedra mudiri')
def kafedra_oqituvchilari(request, user_id):
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    kafedra = foydalanuvchi.kafedra
    if not kafedra:
        messages.error(request, "Sizga kafedra biriktirilmagan.")
        return redirect('home2')

    teachers_qs = Foydalanuvchilar.objects.filter(kafedra=kafedra).order_by('familiya', 'ism')
    teachers_data = _build_teachers_profile_list(teachers_qs)

    darajalar = sorted(list({t['obj'].ilmiy_daraja for t in teachers_data if t['obj'].ilmiy_daraja}))

    q = request.GET.get('q', '').strip()
    daraja_filter = request.GET.get('daraja', '')

    filtered = teachers_data
    if q:
        q_lower = q.lower()
        filtered = [
            t for t in filtered
            if q_lower in f"{t['obj'].familiya} {t['obj'].ism} {t['obj'].sharifi} {t['obj'].gmail or ''}".lower()
        ]
    if daraja_filter:
        filtered = [t for t in filtered if t['obj'].ilmiy_daraja == daraja_filter]

    total_teachers = len(teachers_data)
    total_ilmiy = sum(t['ilmiy_count'] for t in teachers_data)
    total_oquv = sum(t['oquv_count'] for t in teachers_data)
    total_scopus = sum(t['scopus_count'] for t in teachers_data)
    accepted_count = sum(1 for t in teachers_data if t['obj'].accepted)

    return render(request, 'app/kafedra_oqituvchilari.html', {
        'title': "Kafedra O'qituvchilari",
        'foydalanuvchi': foydalanuvchi,
        'kafedra': kafedra,
        'teachers': filtered,
        'all_teachers': teachers_data,
        'total_teachers': total_teachers,
        'total_ilmiy': total_ilmiy,
        'total_oquv': total_oquv,
        'total_scopus': total_scopus,
        'accepted_count': accepted_count,
        'darajalar': darajalar,
        'selected_daraja': daraja_filter,
        'query': q,
        'year': datetime.now().year,
    })


@kabinet('dekan')
def fakultet_oqituvchilari(request, user_id):
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    fakultet = foydalanuvchi.fakulteti
    if not fakultet:
        messages.error(request, "Sizga fakultet biriktirilmagan.")
        return redirect('home3')

    kafedralar = list(Kafedralar.objects.filter(fakultet=fakultet))
    teachers_qs = Foydalanuvchilar.objects.filter(fakulteti=fakultet).select_related('kafedra').order_by('familiya', 'ism')
    teachers_data = _build_teachers_profile_list(teachers_qs)

    kafedra_tabs = []
    for k in kafedralar:
        k_count = sum(1 for t in teachers_data if t['obj'].kafedra_id == k.id)
        kafedra_tabs.append({
            'id': k.id,
            'nomi': k.nomi,
            'count': k_count,
        })

    darajalar = sorted(list({t['obj'].ilmiy_daraja for t in teachers_data if t['obj'].ilmiy_daraja}))

    q = request.GET.get('q', '').strip()
    kafedra_filter = request.GET.get('kafedra', '')
    daraja_filter = request.GET.get('daraja', '')

    filtered = teachers_data
    if kafedra_filter:
        try:
            k_id = int(kafedra_filter)
            filtered = [t for t in filtered if t['obj'].kafedra_id == k_id]
        except ValueError:
            pass

    if daraja_filter:
        filtered = [t for t in filtered if t['obj'].ilmiy_daraja == daraja_filter]

    if q:
        q_lower = q.lower()
        filtered = [
            t for t in filtered
            if q_lower in f"{t['obj'].familiya} {t['obj'].ism} {t['obj'].sharifi} {t['obj'].kafedra.nomi if t['obj'].kafedra else ''} {t['obj'].gmail or ''}".lower()
        ]

    total_teachers = len(teachers_data)
    total_kafedralar = len(kafedralar)
    total_ilmiy = sum(t['ilmiy_count'] for t in teachers_data)
    total_oquv = sum(t['oquv_count'] for t in teachers_data)
    total_scopus = sum(t['scopus_count'] for t in teachers_data)

    return render(request, 'app/fakultet_oqituvchilari.html', {
        'title': "Fakultet O'qituvchilari",
        'foydalanuvchi': foydalanuvchi,
        'fakultet': fakultet,
        'kafedralar': kafedralar,
        'kafedra_tabs': kafedra_tabs,
        'teachers': filtered,
        'all_teachers': teachers_data,
        'total_teachers': total_teachers,
        'total_kafedralar': total_kafedralar,
        'total_ilmiy': total_ilmiy,
        'total_oquv': total_oquv,
        'total_scopus': total_scopus,
        'darajalar': darajalar,
        'selected_kafedra': kafedra_filter,
        'selected_daraja': daraja_filter,
        'query': q,
        'year': datetime.now().year,
    })


@kabinet('prorektor')
def fakultet_hisoboti4(request, fakultet_id):
    foydalanuvchi = get_current_user(request)
    fakultet = get_object_or_404(Dekanatlar, id=fakultet_id)

    # 1. Shu fakultet kafedralari va ularning ko'rsatkichlari
    kafedralar_qs = Kafedralar.objects.filter(fakultet=fakultet).select_related('mudir')
    kafedralar_stat = []
    for k in kafedralar_qs:
        km_list = _deduplicate_works(ilmiy.objects.filter(muallif__kafedra=k).order_by('-sana', '-id'))
        kk_list = _deduplicate_works(oquvIshlari.objects.filter(muallif__kafedra=k).order_by('-sana', '-id'))
        k_scopus = sum(1 for w in km_list if (getattr(w, 'turi', '') or '').lower() == 'scopus')
        k_maqola = sum(1 for w in km_list if (getattr(w, 'turi', '') or '').lower() == 'maqola')
        k_teachers = Foydalanuvchilar.objects.filter(kafedra=k).count()
        kafedralar_stat.append({
            'obj': k,
            'nomi': k.nomi,
            'mudir': k.mudir,
            'teachers_count': k_teachers,
            'scopus_count': k_scopus,
            'maqola_count': k_maqola,
            'ilmiy_count': len(km_list),
            'oquv_count': len(kk_list),
            'jami': len(km_list) + len(kk_list),
        })

    # 2. Shu fakultetdagi o'qituvchilar va mualliflar
    teachers_qs = Foydalanuvchilar.objects.filter(fakulteti=fakultet).select_related('kafedra').order_by('familiya', 'ism')
    teachers_data = _build_teachers_profile_list(teachers_qs)
    teachers_data.sort(key=lambda t: t['jami_count'], reverse=True)

    # Qidiruv va filtrlar
    q = request.GET.get('q', '').strip()
    kafedra_id_filter = request.GET.get('kafedra', '')
    daraja_filter = request.GET.get('daraja', '')

    filtered_teachers = teachers_data
    if q:
        q_lower = q.lower()
        filtered_teachers = [
            t for t in filtered_teachers
            if q_lower in f"{t['obj'].familiya} {t['obj'].ism} {t['obj'].sharifi} {t['obj'].gmail or ''}".lower()
        ]
    if kafedra_id_filter:
        filtered_teachers = [
            t for t in filtered_teachers
            if t['obj'].kafedra and str(t['obj'].kafedra.id) == str(kafedra_id_filter)
        ]
    if daraja_filter:
        filtered_teachers = [
            t for t in filtered_teachers
            if t['obj'].ilmiy_daraja == daraja_filter
        ]

    # Umumiy fakultet KPI
    total_teachers = len(teachers_data)
    total_ilmiy = sum(t['ilmiy_count'] for t in teachers_data)
    total_scopus = sum(t['scopus_count'] for t in teachers_data)
    total_oquv = sum(t['oquv_count'] for t in teachers_data)
    total_jami = total_ilmiy + total_oquv

    darajalar = sorted(list({t['obj'].ilmiy_daraja for t in teachers_data if t['obj'].ilmiy_daraja}))

    return render(request, 'app/fakultet_hisoboti4.html', {
        'title': f"{fakultet.nomi} Tahliliy Hisoboti",
        'foydalanuvchi': foydalanuvchi,
        'fakultet': fakultet,
        'kafedralar_stat': kafedralar_stat,
        'kafedralar': kafedralar_qs,
        'teachers': filtered_teachers,
        'all_teachers': teachers_data,
        'total_teachers': total_teachers,
        'total_ilmiy': total_ilmiy,
        'total_scopus': total_scopus,
        'total_oquv': total_oquv,
        'total_jami': total_jami,
        'darajalar': darajalar,
        'selected_kafedra': kafedra_id_filter,
        'selected_daraja': daraja_filter,
        'query': q,
        'year': datetime.now().year,
    })


def _parse_filter_date(d_str):
    if not d_str:
        return None
    if isinstance(d_str, datetime):
        return d_str.date()
    if hasattr(d_str, 'year') and hasattr(d_str, 'month') and hasattr(d_str, 'day'):
        return d_str
    d_str = str(d_str).strip()
    for fmt in ('%d/%m/%Y', '%d.%m.%Y', '%Y-%m-%d', '%Y/%m/%d'):
        try:
            return datetime.strptime(d_str, fmt).date()
        except ValueError:
            continue
    clean_digits = re.sub(r'\D', '', d_str)
    if len(clean_digits) == 8:
        try:
            return datetime.strptime(clean_digits, '%d%m%Y').date()
        except ValueError:
            try:
                return datetime.strptime(clean_digits, '%Y%m%d').date()
            except ValueError:
                pass
    return None


@kabinet('prorektor')
def ilmiy_ishlari4(request, user_id):
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    fakultet_id = request.GET.get('fakultet')
    kafedra_id = request.GET.get('kafedra')
    turi_filter = request.GET.get('turi')
    from_date = request.GET.get('from')
    to_date = request.GET.get('to')
    selected_mualliflar = [m.strip() for m in request.GET.getlist('ish_muallifi') if m and m.strip()]
    
    qs = ilmiy.objects.all()
    if fakultet_id:
        qs = qs.filter(muallif__fakulteti_id=fakultet_id)
    if kafedra_id:
        qs = qs.filter(muallif__kafedra_id=kafedra_id)
    if turi_filter:
        qs = qs.filter(turi=turi_filter)
    if from_date:
        f_date = _parse_filter_date(from_date)
        if f_date:
            qs = qs.filter(sana__gte=f_date)
    if to_date:
        t_date = _parse_filter_date(to_date)
        if t_date:
            qs = qs.filter(sana__lte=t_date)
        
    fakultetlar = Dekanatlar.objects.all()
    kafedralar = Kafedralar.objects.all()
    if fakultet_id:
        kafedralar = kafedralar.filter(fakultet_id=fakultet_id)
    turlar = ilmiy.objects.values_list('turi', flat=True).distinct()
    
    deduped = _deduplicate_works(qs.order_by('-sana', '-id'))
    if selected_mualliflar:
        deduped = _filter_by_authors(deduped, selected_mualliflar)

    all_mualliflar_raw = ilmiy.objects.values_list('ish_mualliflari', flat=True)
    ish_muallifi = _get_ish_muallifi_list(all_mualliflar_raw)

    return render(request, 'app/ilmiy_ishlar4.html', {
        'title': 'Universitet Ilmiy Ishlari',
        'year': datetime.now().year,
        'maqola': deduped[:300],
        'foydalanuvchi': foydalanuvchi,
        'kafedralar': kafedralar,
        'fakultetlar': fakultetlar,
        'turi': turlar,
        'ish_muallifi': ish_muallifi,
        'selected_mualliflar': selected_mualliflar,
    })

@kabinet('prorektor')
def oquv_ishlari4(request, user_id):
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    fakultet_id = request.GET.get('fakultet')
    kafedra_id = request.GET.get('kafedra')
    turi_filter = request.GET.get('turi')
    from_date = request.GET.get('from')
    to_date = request.GET.get('to')
    selected_mualliflar = [m.strip() for m in request.GET.getlist('ish_muallifi') if m and m.strip()]
    
    qs = oquvIshlari.objects.all()
    if fakultet_id:
        qs = qs.filter(muallif__fakulteti_id=fakultet_id)
    if kafedra_id:
        qs = qs.filter(muallif__kafedra_id=kafedra_id)
    if turi_filter:
        qs = qs.filter(turi=turi_filter)
    if from_date:
        f_date = _parse_filter_date(from_date)
        if f_date:
            qs = qs.filter(sana__gte=f_date)
    if to_date:
        t_date = _parse_filter_date(to_date)
        if t_date:
            qs = qs.filter(sana__lte=t_date)
        
    fakultetlar = Dekanatlar.objects.all()
    kafedralar = Kafedralar.objects.all()
    if fakultet_id:
        kafedralar = kafedralar.filter(fakultet_id=fakultet_id)
    turlar = oquvIshlari.objects.values_list('turi', flat=True).distinct()
    
    deduped = _deduplicate_works(qs.order_by('-sana', '-id'))
    if selected_mualliflar:
        deduped = _filter_by_authors(deduped, selected_mualliflar)

    all_mualliflar_raw = oquvIshlari.objects.values_list('ish_mualliflari', flat=True)
    ish_muallifi = _get_ish_muallifi_list(all_mualliflar_raw)

    return render(request, 'app/o`quv_ishlari4.html', {
        'title': 'Universitet O`quv Ishlari',
        'year': datetime.now().year,
        'maqola': deduped[:300],
        'foydalanuvchi': foydalanuvchi,
        'kafedralar': kafedralar,
        'fakultetlar': fakultetlar,
        'turi': turlar,
        'ish_muallifi': ish_muallifi,
        'selected_mualliflar': selected_mualliflar,
    })

@kabinet()
def oquv_ishlari(request, user_id):
    """Renders the oquv_ishlari page."""
    assert isinstance(request, HttpRequest)
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    maqola = _get_user_publications(foydalanuvchi, oquvIshlari)
    turi = sorted(list({getattr(w, 'turi', '') for w in maqola if getattr(w, 'turi', '')}))
    ish_muallifiy = [getattr(w, 'ish_mualliflari', '') for w in maqola]
    ish_muallifi = _get_ish_muallifi_list(ish_muallifiy)
    return render(
        request,
        'app/o`quv_ishlari.html',
        {
            'title':'Oquv Ishlari',
            'message':'Your oquv_ishlari page.',
            'year':datetime.now().year,
            'maqola':maqola,
            'foydalanuvchi': foydalanuvchi,
            'turi': turi, 
            'ish_muallifi':ish_muallifi,
            'selected_mualliflar': []
        }
    )
@kabinet()
def ilmiy_ishlari(request, user_id):
    """Renders the ilmiy_ishlari page."""
    assert isinstance(request, HttpRequest)
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    maqolalar = _get_user_publications(foydalanuvchi, ilmiy)
    turi = sorted(list({getattr(w, 'turi', '') for w in maqolalar if getattr(w, 'turi', '')}))
    ish_muallifiy = [getattr(w, 'ish_mualliflari', '') for w in maqolalar]
    ish_muallifi = _get_ish_muallifi_list(ish_muallifiy)
    return render(
        request,
        'app/ilmiy_ishlar.html',
        {
            'title':'Ilmiy Ishlari',
            'message':'Your ilmiy_ishlari page.',
            'year':datetime.now().year,
            'maqola':maqolalar,
            'foydalanuvchi': foydalanuvchi,
            'turi': turi, 
            'ish_muallifi':ish_muallifi,
            'selected_mualliflar': []
        }
    )
@ozining_sahifasi
def profile(request, user_id):
    return home1(request)

@kabinet()
def qoshish(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    existing_titles = []
    if foydalanuvchi.kafedra:
        existing_titles = list(oquvIshlari.objects.filter(muallif__kafedra=foydalanuvchi.kafedra).values_list('nomi', flat=True).distinct())
    return render(
        request,
        'app/tahrirlash.html',
        {
            'foydalanuvchi':foydalanuvchi,
            'title':'Qoshish',
            'message':'Your application description page.',
            'year':datetime.now().year,
            'existing_titles_json': json.dumps(existing_titles),
        }
    )
@kabinet()
def qoshish_i(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    existing_titles = []
    if foydalanuvchi.kafedra:
        existing_titles = list(ilmiy.objects.filter(muallif__kafedra=foydalanuvchi.kafedra).values_list('nomi', flat=True).distinct())
    return render(
        request,
        'app/tahrirlash_i.html',
        {
            'foydalanuvchi':foydalanuvchi,
            'title':'Qoshish_i',
            'message':'Your application description page.',
            'year':datetime.now().year,
            'existing_titles_json': json.dumps(existing_titles),
        }
    )
@ozining_sahifasi
def qoshish_oquv(request, user_id):
    foydalanuvchi = get_current_user(request)
    if not foydalanuvchi:
        return redirect('login')
    assert isinstance(request, HttpRequest)
    if request.method == "POST":
        try:
            turi = (request.POST.get("turi") or '').strip()
            nomi = (request.POST.get("nomi") or '').strip()
            haqida = request.POST.get("haqida")
            sana_raw = (request.POST.get("sana") or '').strip()
            ish_mualliflari = (request.POST.get("ish_mualliflari") or '').strip()
            betlar_soni = request.POST.get("betlar_soni") or 0
            fayl = request.FILES.get("fayl")
            muallif = foydalanuvchi
            foreveryone = request.POST.get("foreveryone") == "on"
            image = request.FILES.get("image")

            # Xavfsiz sana tekshiruvi (Date validation)
            sana = None
            if sana_raw:
                p_date = _parse_filter_date(sana_raw)
                if p_date:
                    sana = p_date.strftime('%Y-%m-%d')
            if not sana:
                sana = datetime.now().strftime('%Y-%m-%d')

            nomi_norm = _normalize_title(nomi)
            existing_item = None
            if len(nomi_norm) >= 6 and foydalanuvchi.kafedra:
                candidates = oquvIshlari.objects.filter(muallif__kafedra=foydalanuvchi.kafedra)
                for cand in candidates:
                    if _normalize_title(cand.nomi) == nomi_norm:
                        existing_item = cand
                        break

            if existing_item:
                cur_author_name = f"{foydalanuvchi.familiya} {foydalanuvchi.ism}".strip()
                ex_authors = [m.strip() for m in re.split(r'[,;]+', str(existing_item.ish_mualliflari or '')) if m.strip()]
                new_authors = [m.strip() for m in re.split(r'[,;]+', str(ish_mualliflari or '')) if m.strip()]
                
                if not any(_matches_author_name(foydalanuvchi.familiya, foydalanuvchi.ism, a) for a in ex_authors):
                    ex_authors.append(cur_author_name)
                for na in new_authors:
                    if not any(na.lower() == ea.lower() for ea in ex_authors):
                        ex_authors.append(na)
                existing_item.ish_mualliflari = ', '.join(ex_authors)
                
                if fayl and not existing_item.fayl:
                    existing_item.fayl = fayl
                if image and not existing_item.image:
                    existing_item.image = image
                if foreveryone:
                    existing_item.foreveryone = True
                if haqida and not existing_item.haqida:
                    existing_item.haqida = haqida
                if sana and not existing_item.sana:
                    existing_item.sana = sana
                if betlar_soni and not existing_item.betlar_soni:
                    existing_item.betlar_soni = betlar_soni

                existing_item.save()
                owner_name = f"{existing_item.muallif.familiya} {existing_item.muallif.ism}".strip() if existing_item.muallif else "hamkasbingiz"
                messages.info(
                    request,
                    f"Ushbu o'quv ishi kafedrada allaqachon mavjud ({owner_name} tomonidan yuklangan). "
                    f"Siz unga hammuallif sifatida muvaffaqiyatli biriktirildingiz!"
                )
                return redirect('oquv_ishlari', user_id=user_id)

            yangi = oquvIshlari(
                turi=turi, nomi=nomi, sana=sana, muallif=muallif,
                betlar_soni=betlar_soni, fayl=fayl, ish_mualliflari=ish_mualliflari,
                foreveryone=foreveryone, image=image, haqida=haqida
            )
            yangi.save()
            messages.success(request, "O'quv ishi muvaffaqiyatli saqlandi!")
            return redirect('oquv_ishlari', user_id=user_id)
        except Exception as e:
            messages.error(request, f"Saqlashda xatolik yuz berdi: {e}")
            return redirect('qoshish', user_id=user_id)
    return redirect('qoshish', user_id=user_id)

@ozining_sahifasi
def qoshish_ilmiy(request, user_id):
    foydalanuvchi = get_current_user(request)
    if not foydalanuvchi:
        return redirect('login')
    assert isinstance(request, HttpRequest)
    if request.method == "POST":
        try:
            turi = (request.POST.get("turi") or '').strip()
            nomi = (request.POST.get("nomi") or '').strip()
            sana_raw = (request.POST.get("sana") or '').strip()
            haqida = request.POST.get("haqida")
            ish_mualliflari = (request.POST.get("ish_mualliflari") or '').strip()
            kategoriya = (request.POST.get("kategoriya") or '').strip()
            fayl = request.FILES.get("fayl")
            foreveryone = request.POST.get("foreveryone") == "on"
            dgu_raqami = request.POST.get("dgu_raqami", "").strip() or None
            maqola_link = request.POST.get("maqola_link", "").strip() or None
            muallif = foydalanuvchi

            # Kategoriya aqlli aniqlash (Intelligent default)
            turi_lower = turi.lower()
            if not kategoriya:
                if 'scopus' in turi_lower:
                    kategoriya = 'Xalqaro'
                elif 'ehm' in turi_lower or 'guvohnoma' in turi_lower:
                    kategoriya = 'Respublika'
                elif 'patent' in turi_lower:
                    kategoriya = 'Respublika'
                else:
                    kategoriya = 'Respublika'
            elif 'scopus' in turi_lower:
                kategoriya = 'Xalqaro'
            elif 'ehm' in turi_lower or 'guvohnoma' in turi_lower:
                kategoriya = 'Respublika'

            # Xavfsiz sana tekshiruvi (Date validation)
            sana = None
            if sana_raw:
                p_date = _parse_filter_date(sana_raw)
                if p_date:
                    sana = p_date.strftime('%Y-%m-%d')
            if not sana:
                sana = datetime.now().strftime('%Y-%m-%d')

            nomi_norm = _normalize_title(nomi)
            existing_item = None
            if len(nomi_norm) >= 6 and foydalanuvchi.kafedra:
                candidates = ilmiy.objects.filter(muallif__kafedra=foydalanuvchi.kafedra)
                for cand in candidates:
                    if _normalize_title(cand.nomi) == nomi_norm:
                        existing_item = cand
                        break

            if existing_item:
                cur_author_name = f"{foydalanuvchi.familiya} {foydalanuvchi.ism}".strip()
                ex_authors = [m.strip() for m in re.split(r'[,;]+', str(existing_item.ish_mualliflari or '')) if m.strip()]
                new_authors = [m.strip() for m in re.split(r'[,;]+', str(ish_mualliflari or '')) if m.strip()]
                
                if not any(_matches_author_name(foydalanuvchi.familiya, foydalanuvchi.ism, a) for a in ex_authors):
                    ex_authors.append(cur_author_name)
                for na in new_authors:
                    if not any(na.lower() == ea.lower() for ea in ex_authors):
                        ex_authors.append(na)
                existing_item.ish_mualliflari = ', '.join(ex_authors)
                
                if maqola_link and not existing_item.maqola_link:
                    existing_item.maqola_link = maqola_link
                if dgu_raqami and not existing_item.dgu_raqami:
                    existing_item.dgu_raqami = dgu_raqami
                if fayl and not existing_item.fayl:
                    existing_item.fayl = fayl
                if (turi or '').lower() == 'scopus' and (existing_item.turi or '').lower() != 'scopus':
                    existing_item.turi = 'Scopus'
                if foreveryone:
                    existing_item.foreveryone = True
                if haqida and not existing_item.haqida:
                    existing_item.haqida = haqida
                if sana and not existing_item.sana:
                    existing_item.sana = sana

                existing_item.save()
                owner_name = f"{existing_item.muallif.familiya} {existing_item.muallif.ism}".strip() if existing_item.muallif else "hamkasbingiz"
                messages.info(
                    request,
                    f"Ushbu ilmiy ish kafedrada allaqachon mavjud ({owner_name} tomonidan yuklangan). "
                    f"Siz unga hammuallif sifatida muvaffaqiyatli biriktirildingiz!"
                )
                return redirect('ilmiy_ishlari', user_id=user_id)

            yangi = ilmiy(
                turi=turi, nomi=nomi, sana=sana, muallif=muallif,
                ish_mualliflari=ish_mualliflari, kategoriya=kategoriya,
                fayl=fayl, haqida=haqida, foreveryone=foreveryone,
                dgu_raqami=dgu_raqami, maqola_link=maqola_link
            )
            yangi.save()
            messages.success(request, "Ilmiy ish muvaffaqiyatli saqlandi!")
            return redirect('ilmiy_ishlari', user_id=user_id)
        except Exception as e:
            messages.error(request, f"Saqlashda xatolik yuz berdi: {e}")
            return redirect('qoshish_i', user_id=user_id)
    return redirect('qoshish_i', user_id=user_id)
@ozining_sahifasi
def ochir(request, j_id, user_id):
    foydalanuvchi=get_current_user(request)
    assert isinstance(request, HttpRequest)
    if j_id==1:
        ochir=oquvIshlari.objects.filter(muallif_id=foydalanuvchi.id)
    else:
        ochir=ilmiy.objects.filter(muallif_id=foydalanuvchi.id)
    return render(
        request,
        'app/ochir.html',
        {
            'ochir':ochir,
            'title':'Ochir',
            'message':'Your application description page.',
            'year':datetime.now().year,
            'j_id':j_id,
            'foydalanuvchi':foydalanuvchi

        }
        )
@ozining_sahifasi
def ochirish(request, i_id, j_id, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi=get_current_user(request)
    if request.method=="POST" and j_id==1:
        maqola=oquvIshlari.objects.filter(muallif_id=foydalanuvchi.id)
        turi=oquvIshlari.objects.filter(muallif_id=foydalanuvchi.id).values_list('turi', flat=True).distinct()
        ish_muallifiy= oquvIshlari.objects.filter(muallif_id=foydalanuvchi.id).values_list('ish_mualliflari', flat=True).distinct()
        ish_muallifi = []
        for qator in ish_muallifiy:
            if qator: 
                ish_muallifi.extend([m.strip() for m in qator.split(',')])
                ish_muallifi = list(set(ish_muallifi))
        ochir=get_object_or_404(oquvIshlari, id=i_id, muallif_id=foydalanuvchi.id)
        ochir.delete()
        return render(
        request,
        'app/o`quv_ishlari.html',
        {
            'title':'Oquv Ishlari',
            'message':'Your oquv_ishlari page.',
            'year':datetime.now().year,
            'maqola':maqola,
            'foydalanuvchi':foydalanuvchi,
            'turi': turi,
            'ish_muallifi':ish_muallifi
        }
        )
    elif request.method=="POST" and j_id==2:
        maqola=ilmiy.objects.filter(muallif_id=foydalanuvchi.id)
        turi=ilmiy.objects.filter(muallif_id=foydalanuvchi.id).values_list('turi', flat=True).distinct()
        ish_muallifiy= ilmiy.objects.filter(muallif_id=foydalanuvchi.id).values_list('ish_mualliflari', flat=True).distinct()
        ish_muallifi = []
        for qator in ish_muallifiy:
            if qator: 
                ish_muallifi.extend([m.strip() for m in qator.split(',')])
                ish_muallifi = list(set(ish_muallifi))
        ochir=get_object_or_404(ilmiy, id=i_id, muallif_id=foydalanuvchi.id)
        ochir.delete()
        return render(
        request,
        'app/ilmiy_ishlar.html',
        {
            'title':'Oquv Ishlari',
            'message':'Your oquv_ishlari page.',
            'year':datetime.now().year,
            'maqola':maqola,
            'foydalanuvchi':foydalanuvchi,
            'turi': turi,
            'ish_muallifi':ish_muallifi
        }
        )

    # GET bo'lsa yoki j_id noma'lum bo'lsa, tasdiqlash sahifasiga qaytamiz
    # (avval bu yerda hech narsa qaytmay, 500 xato chiqardi)
    return redirect('ochir', j_id=j_id, user_id=user_id)

from django.db.models import Min


def _clean_author_name(s):
    if not s:
        return ''
    s = str(s).strip()
    s = re.sub(r'[\r\n\t]+', ' ', s)
    s = re.sub(r'\s+', ' ', s)
    return s.strip()


def _extract_author_tokens(name_str):
    if not name_str:
        return set()
    s = str(name_str).lower()
    for oq in ["o'", "o`", "o’", "o‘"]:
        s = s.replace(oq, 'o')
    for gq in ["g'", "g`", "g’", "g‘"]:
        s = s.replace(gq, 'g')
    tokens = set(re.findall(r'\b[a-z0-9\u0400-\u04ff]{2,}\b', s))
    core = {t for t in tokens if not t.endswith(('ovich', 'evich', 'ovna', 'evna', 'qizi', 'ogli'))}
    return core if core else tokens


def _matches_author(filter_name, target_name):
    if not filter_name or not target_name:
        return False
    f_core = _extract_author_tokens(filter_name)
    t_core = _extract_author_tokens(target_name)
    if not f_core or not t_core:
        return False
    # Exact or subset matching (works with swapped First/Last name)
    if f_core.issubset(t_core):
        return True
    if len(f_core) >= 2 and t_core.issubset(f_core) and len(t_core) >= 2:
        return True
    if len(f_core & t_core) >= 2:
        return True
    return False


def _canonicalize_authors(raw_list):
    cleaned = [_clean_author_name(x) for x in raw_list if _clean_author_name(x)]
    sorted_raw = sorted(list(set(cleaned)), key=lambda s: len(s), reverse=True)
    canonical = []
    for name in sorted_raw:
        if not name or len(name) < 2:
            continue
        already = False
        for c in canonical:
            if _matches_author(name, c) and len(_extract_author_tokens(name) & _extract_author_tokens(c)) >= 2:
                already = True
                break
        if not already:
            canonical.append(name)
    return sorted(canonical, key=lambda s: s.lower())


def _get_ish_muallifi_list(qs_values):
    raw = set()
    for qator in qs_values:
        if qator:
            for m in re.split(r'[,;]+', str(qator)):
                cleaned = _clean_author_name(m)
                if cleaned:
                    raw.add(cleaned)
    return _canonicalize_authors(raw)


def _filter_by_authors(data, author_filters):
    if not author_filters:
        return data
    clean_filters = [_clean_author_name(f) for f in author_filters if _clean_author_name(f)]
    if not clean_filters:
        return data

    filtered = []
    for item in data:
        candidate_strings = []
        if getattr(item, 'ish_mualliflari', None):
            candidate_strings.append(str(item.ish_mualliflari))
            candidate_strings.extend([m.strip() for m in re.split(r'[,;]+', str(item.ish_mualliflari)) if m.strip()])
        if getattr(item, 'muallif', None):
            u = item.muallif
            fam = getattr(u, 'familiya', '') or ''
            ism = getattr(u, 'ism', '') or ''
            sharifi = getattr(u, 'sharifi', '') or ''
            candidate_strings.append(f"{fam} {ism} {sharifi}".strip())
            candidate_strings.append(f"{ism} {fam}".strip())

        matched = False
        for f in clean_filters:
            for cand in candidate_strings:
                if _matches_author(f, cand):
                    matched = True
                    break
            if matched:
                break
        if matched:
            filtered.append(item)
    return filtered


@kabinet()
def filtrlash_ilmiy(request, user_id):
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    start = request.GET.get('from')
    end = request.GET.get('to')
    turi = request.GET.get('turi')
    selected_mualliflar = [m.strip() for m in request.GET.getlist('ish_muallifi') if m and m.strip()]

    all_user_works = _get_user_publications(foydalanuvchi, ilmiy)
    data = all_user_works

    start_date = _parse_filter_date(start)
    end_date = _parse_filter_date(end)

    if start_date:
        data = [w for w in data if w.sana and w.sana >= start_date]
    if end_date:
        data = [w for w in data if w.sana and w.sana <= end_date]
    if turi:
        data = [w for w in data if (getattr(w, 'turi', '') or '').lower() == turi.lower()]
    if selected_mualliflar:
        data = _filter_by_authors(data, selected_mualliflar)

    data.sort(key=lambda x: (x.nomi or '').lower())
    turlar = sorted(list({getattr(w, 'turi', '') for w in all_user_works if getattr(w, 'turi', '')}))
    ish_muallifi = _get_ish_muallifi_list([getattr(w, 'ish_mualliflari', '') for w in all_user_works])

    return render(request, 'app/ilmiy_ishlar.html', {
        'maqola': data,
        'foydalanuvchi': foydalanuvchi,
        'turi': turlar,
        'ish_muallifi': ish_muallifi,
        'selected_mualliflar': selected_mualliflar,
    })


@kabinet('kafedra mudiri')
def filtrlash_ilmiy2(request, user_id):
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    start = request.GET.get('from')
    end = request.GET.get('to')
    turi = request.GET.get('turi')
    selected_mualliflar = [m.strip() for m in request.GET.getlist('ish_muallifi') if m and m.strip()]

    base_qs = ilmiy.objects.filter(muallif__kafedra=foydalanuvchi.kafedra).order_by('-sana', '-id')
    all_works = _deduplicate_works(base_qs)
    data = all_works

    start_date = _parse_filter_date(start)
    end_date = _parse_filter_date(end)

    if start_date:
        data = [w for w in data if w.sana and w.sana >= start_date]
    if end_date:
        data = [w for w in data if w.sana and w.sana <= end_date]
    if turi:
        data = [w for w in data if (getattr(w, 'turi', '') or '').lower() == turi.lower()]
    if selected_mualliflar:
        data = _filter_by_authors(data, selected_mualliflar)

    data.sort(key=lambda x: (x.nomi or '').lower())
    turlar = sorted(list({getattr(w, 'turi', '') for w in all_works if getattr(w, 'turi', '')}))
    ish_muallifi = _get_ish_muallifi_list([getattr(w, 'ish_mualliflari', '') for w in all_works])

    return render(request, 'app/ilmiy_ishlar2.html', {
        'maqola': data,
        'foydalanuvchi': foydalanuvchi,
        'turi': turlar,
        'ish_muallifi': ish_muallifi,
        'selected_mualliflar': selected_mualliflar,
    })


@kabinet('dekan')
def filtrlash_ilmiy3(request, user_id):
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    start = request.GET.get('from')
    end = request.GET.get('to')
    turi = request.GET.get('turi')
    kafedra = request.GET.get('kafedra')
    selected_mualliflar = [m.strip() for m in request.GET.getlist('ish_muallifi') if m and m.strip()]

    kafedralar = Kafedralar.objects.filter(fakultet=foydalanuvchi.fakulteti)

    if kafedra:
        base_qs = ilmiy.objects.filter(
            muallif__kafedra__nomi=kafedra,
            muallif__kafedra__fakultet=foydalanuvchi.fakulteti
        ).order_by('-sana', '-id')
    else:
        base_qs = ilmiy.objects.filter(
            muallif__kafedra__fakultet=foydalanuvchi.fakulteti
        ).order_by('-sana', '-id')

    all_works = _deduplicate_works(base_qs)
    data = all_works

    start_date = _parse_filter_date(start)
    end_date = _parse_filter_date(end)

    if start_date:
        data = [w for w in data if w.sana and w.sana >= start_date]
    if end_date:
        data = [w for w in data if w.sana and w.sana <= end_date]
    if turi:
        data = [w for w in data if (getattr(w, 'turi', '') or '').lower() == turi.lower()]
    if selected_mualliflar:
        data = _filter_by_authors(data, selected_mualliflar)

    data.sort(key=lambda x: (x.nomi or '').lower())
    turlar = sorted(list({getattr(w, 'turi', '') for w in all_works if getattr(w, 'turi', '')}))
    ish_muallifi = _get_ish_muallifi_list([getattr(w, 'ish_mualliflari', '') for w in all_works])

    return render(request, 'app/ilmiy_ishlar3.html', {
        'maqola': data,
        'foydalanuvchi': foydalanuvchi,
        'kafedralar': kafedralar,
        'turi': turlar,
        'ish_muallifi': ish_muallifi,
        'selected_mualliflar': selected_mualliflar,
    })


@kabinet()
def filtrlash_oquv(request, user_id):
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    start = request.GET.get('from')
    end = request.GET.get('to')
    turi = request.GET.get('turi')
    selected_mualliflar = [m.strip() for m in request.GET.getlist('ish_muallifi') if m and m.strip()]

    all_user_works = _get_user_publications(foydalanuvchi, oquvIshlari)
    data = all_user_works

    start_date = _parse_filter_date(start)
    end_date = _parse_filter_date(end)

    if start_date:
        data = [w for w in data if w.sana and w.sana >= start_date]
    if end_date:
        data = [w for w in data if w.sana and w.sana <= end_date]
    if turi:
        data = [w for w in data if (getattr(w, 'turi', '') or '').lower() == turi.lower()]
    if selected_mualliflar:
        data = _filter_by_authors(data, selected_mualliflar)

    data.sort(key=lambda x: (x.nomi or '').lower())
    turlar = sorted(list({getattr(w, 'turi', '') for w in all_user_works if getattr(w, 'turi', '')}))
    ish_muallifi = _get_ish_muallifi_list([getattr(w, 'ish_mualliflari', '') for w in all_user_works])

    return render(request, "app/o`quv_ishlari.html", {
        'maqola': data,
        'foydalanuvchi': foydalanuvchi,
        'turi': turlar,
        'ish_muallifi': ish_muallifi,
        'selected_mualliflar': selected_mualliflar,
    })


@kabinet('kafedra mudiri')
def filtrlash_oquv2(request, user_id):
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    start = request.GET.get('from')
    end = request.GET.get('to')
    turi = request.GET.get('turi')
    selected_mualliflar = [m.strip() for m in request.GET.getlist('ish_muallifi') if m and m.strip()]

    base_qs = oquvIshlari.objects.filter(muallif__kafedra=foydalanuvchi.kafedra).order_by('-sana', '-id')
    all_works = _deduplicate_works(base_qs)
    data = all_works

    start_date = _parse_filter_date(start)
    end_date = _parse_filter_date(end)

    if start_date:
        data = [w for w in data if w.sana and w.sana >= start_date]
    if end_date:
        data = [w for w in data if w.sana and w.sana <= end_date]
    if turi:
        data = [w for w in data if (getattr(w, 'turi', '') or '').lower() == turi.lower()]
    if selected_mualliflar:
        data = _filter_by_authors(data, selected_mualliflar)

    data.sort(key=lambda x: (x.nomi or '').lower())
    turlar = sorted(list({getattr(w, 'turi', '') for w in all_works if getattr(w, 'turi', '')}))
    ish_muallifi = _get_ish_muallifi_list([getattr(w, 'ish_mualliflari', '') for w in all_works])

    return render(request, "app/o`quv_ishlari2.html", {
        'maqola': data,
        'foydalanuvchi': foydalanuvchi,
        'turi': turlar,
        'ish_muallifi': ish_muallifi,
        'selected_mualliflar': selected_mualliflar,
    })


@kabinet('dekan')
def filtrlash_oquv3(request, user_id):
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    start = request.GET.get('from')
    end = request.GET.get('to')
    turi = request.GET.get('turi')
    kafedra = request.GET.get('kafedra')
    selected_mualliflar = [m.strip() for m in request.GET.getlist('ish_muallifi') if m and m.strip()]

    kafedralar = Kafedralar.objects.filter(fakultet=foydalanuvchi.fakulteti)

    if kafedra:
        base_qs = oquvIshlari.objects.filter(
            muallif__kafedra__nomi=kafedra,
            muallif__kafedra__fakultet=foydalanuvchi.fakulteti
        ).order_by('-sana', '-id')
    else:
        base_qs = oquvIshlari.objects.filter(
            muallif__kafedra__fakultet=foydalanuvchi.fakulteti
        ).order_by('-sana', '-id')

    all_works = _deduplicate_works(base_qs)
    data = all_works

    start_date = _parse_filter_date(start)
    end_date = _parse_filter_date(end)

    if start_date:
        data = [w for w in data if w.sana and w.sana >= start_date]
    if end_date:
        data = [w for w in data if w.sana and w.sana <= end_date]
    if turi:
        data = [w for w in data if (getattr(w, 'turi', '') or '').lower() == turi.lower()]
    if selected_mualliflar:
        data = _filter_by_authors(data, selected_mualliflar)

    data.sort(key=lambda x: (x.nomi or '').lower())
    turlar = sorted(list({getattr(w, 'turi', '') for w in all_works if getattr(w, 'turi', '')}))
    ish_muallifi = _get_ish_muallifi_list([getattr(w, 'ish_mualliflari', '') for w in all_works])

    return render(request, "app/o`quv_ishlari3.html", {
        'maqola': data,
        'foydalanuvchi': foydalanuvchi,
        'kafedralar': kafedralar,
        'turi': turlar,
        'ish_muallifi': ish_muallifi,
        'selected_mualliflar': selected_mualliflar,
    })


@ozining_sahifasi
def tahrirlash_ilmiy(request, i_id, t_id, user_id):
    foydalanuvchi = get_current_user(request)

    if int(t_id) == 1:
        model = ilmiy
        form_class = IlmiyForm
    else:
        model = oquvIshlari
        form_class = OquvForm

    item = get_object_or_404(model, id=i_id)
    is_owner = (item.muallif_id == foydalanuvchi.id)
    is_coauthor = False
    if item.ish_mualliflari and foydalanuvchi.familiya:
        authors = [m.strip() for m in re.split(r'[,;]+', str(item.ish_mualliflari)) if m.strip()]
        is_coauthor = any(_matches_author_name(foydalanuvchi.familiya, foydalanuvchi.ism, a) for a in authors)

    if not (is_owner or is_coauthor):
        raise PermissionDenied("Siz ushbu ishning muallifi yoki hammuallifi emassiz.")

    if request.method == "POST":
        form = form_class(request.POST, request.FILES, instance=item)
        if form.is_valid():
            form.save()
            messages.success(request, "Ma'lumotlar muvaffaqiyatli saqlandi!")
            if int(t_id) == 1:
                return redirect('ilmiy_ishlari', user_id=foydalanuvchi.id)
            else:
                return redirect('oquv_ishlari', user_id=foydalanuvchi.id)
    else:
        form = form_class(instance=item)

    return render(request, 'app/tahrirlash_A.html', {
        'form': form,
        'ilmiy': item,
        't_id': int(t_id),
        'is_oquv': (int(t_id) == 0),
        'is_ilmiy': (int(t_id) == 1),
        'foydalanuvchi': foydalanuvchi,
    })


@kabinet('kafedra mudiri')
def profile2(request, user_id):
    return home2(request)


@kabinet('dekan')
def profile3(request, user_id):
    return home3(request)


@kabinet('kafedra mudiri')
def ilmiy_ishlari2(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    base_qs = ilmiy.objects.filter(muallif__kafedra=foydalanuvchi.kafedra).order_by('-sana', '-id')
    maqolalar = _deduplicate_works(base_qs)
    maqolalar.sort(key=lambda x: (x.nomi or '').lower())
    turi = sorted(list({getattr(w, 'turi', '') for w in maqolalar if getattr(w, 'turi', '')}))
    ish_muallifi = _get_ish_muallifi_list([getattr(w, 'ish_mualliflari', '') for w in maqolalar])
    return render(request, 'app/ilmiy_ishlar2.html', {
        'title': 'Ilmiy Ishlari',
        'year': datetime.now().year,
        'maqola': maqolalar,
        'foydalanuvchi': foydalanuvchi,
        'turi': turi,
        'ish_muallifi': ish_muallifi,
        'selected_mualliflar': []
    })


@kabinet('dekan')
def ilmiy_ishlari3(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    kafedralar = Kafedralar.objects.filter(fakultet=foydalanuvchi.fakulteti)
    base_qs = ilmiy.objects.filter(muallif__kafedra__fakultet=foydalanuvchi.fakulteti).order_by('-sana', '-id')
    maqolalar = _deduplicate_works(base_qs)
    maqolalar.sort(key=lambda x: (x.nomi or '').lower())
    turi = sorted(list({getattr(w, 'turi', '') for w in maqolalar if getattr(w, 'turi', '')}))
    ish_muallifi = _get_ish_muallifi_list([getattr(w, 'ish_mualliflari', '') for w in maqolalar])
    return render(request, 'app/ilmiy_ishlar3.html', {
        'title': 'Ilmiy Ishlari',
        'year': datetime.now().year,
        'maqola': maqolalar,
        'foydalanuvchi': foydalanuvchi,
        'kafedralar': kafedralar,
        'turi': turi,
        'ish_muallifi': ish_muallifi,
        'selected_mualliflar': []
    })


@kabinet('kafedra mudiri')
def oquv_ishlari2(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    base_qs = oquvIshlari.objects.filter(muallif__kafedra=foydalanuvchi.kafedra).order_by('-sana', '-id')
    maqolalar = _deduplicate_works(base_qs)
    maqolalar.sort(key=lambda x: (x.nomi or '').lower())
    turi = sorted(list({getattr(w, 'turi', '') for w in maqolalar if getattr(w, 'turi', '')}))
    ish_muallifi = _get_ish_muallifi_list([getattr(w, 'ish_mualliflari', '') for w in maqolalar])
    return render(request, "app/o`quv_ishlari2.html", {
        'title': 'Oquv Ishlari',
        'year': datetime.now().year,
        'maqola': maqolalar,
        'foydalanuvchi': foydalanuvchi,
        'turi': turi,
        'ish_muallifi': ish_muallifi,
        'selected_mualliflar': []
    })


@kabinet('dekan')
def oquv_ishlari3(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    kafedralar = Kafedralar.objects.filter(fakultet=foydalanuvchi.fakulteti)
    base_qs = oquvIshlari.objects.filter(muallif__kafedra__fakultet=foydalanuvchi.fakulteti).order_by('-sana', '-id')
    maqolalar = _deduplicate_works(base_qs)
    maqolalar.sort(key=lambda x: (x.nomi or '').lower())
    turi = sorted(list({getattr(w, 'turi', '') for w in maqolalar if getattr(w, 'turi', '')}))
    ish_muallifi = _get_ish_muallifi_list([getattr(w, 'ish_mualliflari', '') for w in maqolalar])
    return render(request, "app/o`quv_ishlari3.html", {
        'title': 'Oquv Ishlari',
        'message': 'Your oquv_ishlari page.',
        'year': datetime.now().year,
        'maqola': maqolalar,
        'foydalanuvchi': foydalanuvchi,
        'kafedralar': kafedralar,
        'turi': turi,
        'ish_muallifi': ish_muallifi,
        'selected_mualliflar': []
    })

def logout(request):
    assert isinstance(request, HttpRequest)
    request.session.flush()
    return redirect('login')



from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
import base64, json, os, io, zipfile
from datetime import datetime
from urllib.parse import unquote

@csrf_exempt
def download_zip(request):
    if request.method != "POST":
        return JsonResponse({"error": "Method not allowed"}, status=405)

    try:
        data = json.loads(request.body.decode())
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    excel_base64 = data.get("excel")
    files = data.get("files", [])

    if not excel_base64:
        return JsonResponse({"error": "Excel data missing!"}, status=400)

    # Agar base64 stringda data URI bo'lsa
    if "," in excel_base64:
        excel_base64 = excel_base64.split(",", 1)[1]

    try:
        excel_bytes = base64.b64decode(excel_base64)
    except Exception:
        return JsonResponse({"error": "Invalid base64 data"}, status=400)

    # ZIP yaratish
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
        # Excel faylni qo'shish
        zipf.writestr("jadval.xlsx", excel_bytes)

        # Jadvaldagi fayllar
        for i, f in enumerate(files, start=1):  
            if isinstance(f, str):
                rel = os.path.normpath(unquote(f)).lstrip("/\\")
                basename = os.path.basename(rel)
            else:
                raw_path = unquote(f.get('path', ''))
                rel = os.path.normpath(raw_path).lstrip("/\\")
                prefix = str(f.get('prefix') or i)
                basename = f"{prefix}_{os.path.basename(rel)}" if prefix else os.path.basename(rel)

            full_path = os.path.join(settings.MEDIA_ROOT, rel)

            # Xavfsizlik: MEDIA_ROOT ichidan chiqmasligi
            if not os.path.abspath(full_path).startswith(os.path.abspath(settings.MEDIA_ROOT)):
                continue

            if os.path.exists(full_path):
                zipf.write(full_path, basename)


    zip_buffer.seek(0)

    # Sana bilan ZIP fayl nomi
    date_str = datetime.now().strftime("%Y-%m-%d")
    filename = f"jadval_va_fayllar_{date_str}.zip"

    response = HttpResponse(zip_buffer.getvalue(), content_type="application/zip")
    response["Content-Disposition"] = f'attachment; filename="{filename}"; filename*=UTF-8\'\'{filename}'

    return response 

@ozining_sahifasi
def profillarni_tahrirlash(request, user_id):
    foydalanuvchi = get_current_user(request)
    if request.method == "POST":
        ism = request.POST.get("ism")
        familiya = request.POST.get("familiya")
        otasining_ismi = request.POST.get("otasining_ismi")
        ilmiy_daraja = request.POST.get("ilmiy_daraja")
        gmail = request.POST.get("gmail")
        haqida = request.POST.get("haqida")
        tugulgan_sana = request.POST.get("tugulgan_sana")
        fakulteti_id = request.POST.get("fakulteti")
        kafedra_id = request.POST.get("kafedra")
        image = request.FILES.get("image")
        login_f = request.POST.get("login_f")
        parol = request.POST.get("parol")
        parolni_tasdiqlang = request.POST.get("parolni_tasdiqlang")

        # Rol shu yerdan o'zgartirilmaydi: aks holda har kim o'zini prorektor qilib olardi
        xato = None
        if parol and parol != parolni_tasdiqlang:
            xato = "Parollar mos kelmadi!"
        elif login_f and login_f != foydalanuvchi.login_f and \
                Foydalanuvchilar.objects.filter(login_f=login_f).exclude(id=foydalanuvchi.id).exists():
            xato = "Bu login allaqachon band!"

        if xato:
            messages.error(request, xato)
        else:
            foydalanuvchi.ism = ism
            foydalanuvchi.familiya = familiya
            foydalanuvchi.sharifi = otasining_ismi
            foydalanuvchi.ilmiy_daraja = ilmiy_daraja
            foydalanuvchi.gmail = gmail
            foydalanuvchi.haqida = haqida
            if tugulgan_sana:
                foydalanuvchi.tugulgan_sana = _parse_filter_date(tugulgan_sana) or tugulgan_sana
            if login_f:
                foydalanuvchi.login_f = login_f
            if parol:
                foydalanuvchi.parol = make_password(parol)

            # Bo'sh tanlov yuborilsa, bog'lanish olib tashlanadi
            foydalanuvchi.fakulteti = Dekanatlar.objects.filter(id=fakulteti_id).first() if fakulteti_id else None
            foydalanuvchi.kafedra = Kafedralar.objects.filter(id=kafedra_id).first() if kafedra_id else None

            if image:
                foydalanuvchi.image = image

            foydalanuvchi.save()
            messages.success(request, "Ma'lumotlaringiz saqlandi!")
            return redirect('profile', user_id=foydalanuvchi.id)

    # Xato bo'lsa yoki sahifa to'g'ridan-to'g'ri ochilsa, tahrirlash formasiga qaytamiz.
    # Avval bu yerda profil.html chizilardi — kerakli ma'lumotlarsiz, shuning uchun
    # sahifadagi diagrammalar va ko'rsatkichlar ishdan chiqardi.
    return redirect('profil_tahrirlash', user_id=foydalanuvchi.id)

@ozining_sahifasi
def profil_tahrir(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi=get_current_user(request)
    fakultetlar=Dekanatlar.objects.all()
    kafedralar=Kafedralar.objects.all()
    ROLES=Foydalanuvchilar.ROLES
    return render(
        request,
        'app/profil_tahrirlash.html',
        {
            'foydalanuvchi':foydalanuvchi,
            'fakultetlar': fakultetlar,
            'Kafedralar': kafedralar,
            'ROLES': ROLES,
            'title':'About',
            'message':'Your application description page.',
            'year':datetime.now().year,
        })
def index(request):
    assert isinstance(request, HttpRequest)
    foydalanuvchi = get_current_user(request)
    oqituvchilar_soni = Foydalanuvchilar.objects.filter(foydalanuvchi_rol='oqituvchi').count()
    video_darslar_soni = videolar.objects.filter(foreveryone=True).count()
    
    all_ilmiy = _deduplicate_works(ilmiy.objects.filter(foreveryone=True).select_related('muallif').order_by('-sana', '-id'))
    all_oquv = _deduplicate_works(oquvIshlari.objects.filter(foreveryone=True).select_related('muallif').order_by('-sana', '-id'))
    maqolalar_soni = len(all_ilmiy)
    kitoblar_soni = len(all_oquv)

    # Bosh sahifadagi "so'nggi qo'shilganlar" bo'limlari (dublikatsiz)
    songgi_kitoblar = all_oquv[:4]
    songgi_videolar = videolar.objects.filter(foreveryone=True).select_related('muallif').order_by('-sana')[:3]
    faol_oqituvchilar = Foydalanuvchilar.objects.filter(
        foydalanuvchi_rol='oqituvchi'
    ).annotate(
        ishlar_soni=Count('ilmiy_ishlari', filter=Q(ilmiy_ishlari__foreveryone=True), distinct=True)
    ).order_by('-ishlar_soni')[:4]

    return render(
        request,
        'app/index.html',
        {
            'title':'Home Page',
            'message':'Your application description page.',
            'year':datetime.now().year,
            'foydalanuvchi': foydalanuvchi,
            'oqituvchilar_soni':oqituvchilar_soni,
            'video_darslar_soni':video_darslar_soni,
            'maqolalar_soni':maqolalar_soni,
            'kitoblar_soni':kitoblar_soni,
            'songgi_kitoblar': songgi_kitoblar,
            'songgi_videolar': songgi_videolar,
            'faol_oqituvchilar': faol_oqituvchilar,
        }
    )
def teachers(request):
    assert isinstance(request, HttpRequest)
    foydalanuvchi = get_current_user(request)
    all_ilmiy = _deduplicate_works(ilmiy.objects.filter(foreveryone=True).order_by('-sana', '-id'))
    all_oquv = _deduplicate_works(oquvIshlari.objects.filter(foreveryone=True).order_by('-sana', '-id'))
    total_maqolalar = len(all_ilmiy)
    total_kitoblar = len(all_oquv)
    total_videolar = videolar.objects.filter(foreveryone=True).count()
    kafedralar = Kafedralar.objects.all().values_list('nomi', flat=True).distinct()
    teachers = Foydalanuvchilar.objects.annotate(
        videolar_soni=Count('video_darslar', filter=Q(video_darslar__foreveryone=True), distinct=True),
        maqolalar_soni=Count('ilmiy_ishlari', filter=Q(ilmiy_ishlari__foreveryone=True), distinct=True),
        kitoblar_soni=Count('oquvishlari', filter=Q(oquvishlari__foreveryone=True), distinct=True),
    )
    for t in teachers:
        t.maqolalar_soni = len([m for m in _get_user_publications(t, ilmiy) if getattr(m, 'foreveryone', False)])
        t.kitoblar_soni = len([k for k in _get_user_publications(t, oquvIshlari) if getattr(k, 'foreveryone', False)])

    return render(
        request,
        'app/teachers.html',
        {
            'teachers': teachers,
            'kafedralar': kafedralar,
            'total_kitoblar': total_kitoblar,
            'total_maqolalar': total_maqolalar,
            'total_videolar': total_videolar,
            'foydalanuvchi': foydalanuvchi,
            'title': 'Teachers',
            'message': 'Your application description page.',
            'year': datetime.now().year,
        }
    )

def teacher1(request, id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi = get_current_user(request)
    teacher = get_object_or_404(Foydalanuvchilar, id=id)
    all_ilmiy = _get_user_publications(teacher, ilmiy)
    maqolalar = [m for m in all_ilmiy if getattr(m, 'foreveryone', False)]
    all_oquv = _get_user_publications(teacher, oquvIshlari)
    kitoblar = [k for k in all_oquv if getattr(k, 'foreveryone', False)]
    video = list(videolar.objects.filter(muallif_id=teacher.id, foreveryone=True))
    
    maqolalar_soni = len(maqolalar)
    kitoblar_soni = len(kitoblar)
    videolar_soni = len(video)

    return render(
        request,
        'app/teacher1.html',
        {
            'video': video,
            'teacher': teacher,
            'maqolalar': maqolalar,
            'kitoblar': kitoblar,
            'maqolalar_soni': maqolalar_soni,
            'kitoblar_soni': kitoblar_soni,
            'videolar_soni': videolar_soni,
            'foydalanuvchi': foydalanuvchi,
            'title': f"{teacher.ism} {teacher.familiya}",
            'message': 'Your application description page.',
            'year': datetime.now().year,
        }
    )
@kabinet()
def video_darslar(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    video=videolar.objects.filter(muallif_id=user_id)
    return render(
        request,
        'app/video_darslar.html',
        {
            'videolar':video,
            'foydalanuvchi':foydalanuvchi,
            'title':'Video Darslar',
            'message':'Your video_darslar page.',
            'year':datetime.now().year,
        }
    )
@ozining_sahifasi
def tahrirlash_video(request, v_id, user_id):
    foydalanuvchi=get_current_user(request)
    video=get_object_or_404(videolar, id=v_id, muallif_id=foydalanuvchi.id)
    if request.method=="POST":
        form=VideoForm(request.POST, request.FILES, instance=video)
        if form.is_valid():
            form.save()
            return redirect('video_darslar', user_id=foydalanuvchi.id)
    else:
        form=VideoForm(instance=video)

    # Forma xato to'ldirilgan bo'lsa ham shu sahifa qaytadi (avval 500 xato berardi)
    return render(request, 'app/tahrirlash_video.html', {
        'form': form,
        'video': video,
        'foydalanuvchi': foydalanuvchi,
    })

@ozining_sahifasi
def qoshish_video(request, user_id):
    foydalanuvchi=get_current_user(request)
    if request.method=="POST":
        form=VideoForm(request.POST, request.FILES)
        if form.is_valid():
            video=form.save(commit=False)
            # Muallif sessiyadagi foydalanuvchi bo'ladi
            video.muallif=foydalanuvchi
            video.save()
            return redirect('video_darslar', user_id=foydalanuvchi.id)
    else:
        form=VideoForm()

    # Forma xato to'ldirilgan bo'lsa ham shu sahifa qaytadi (avval 500 xato berardi)
    return render(request, 'app/video_qoshish.html', {
        'form': form,
        'foydalanuvchi': foydalanuvchi,
    })
@ozining_sahifasi
def ochirish_video(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi=get_current_user(request)
    ochir=videolar.objects.filter(muallif_id=user_id)
    return render(request, 'app/ochir_video.html', {
        'ochir': ochir,
        'foydalanuvchi':foydalanuvchi,
    })
@ozining_sahifasi
def ochir_video(request, v_id, user_id):
    foydalanuvchi=get_current_user(request)
    video=get_object_or_404(videolar, id=v_id, muallif_id=foydalanuvchi.id)
    if request.method=="POST":
        video.delete()
        return render(request, 'app/video_darslar.html', {
            'videolar':videolar.objects.filter(muallif_id=user_id),
            'foydalanuvchi':foydalanuvchi,
            'title':'Video Darslar',
            'message':'Your video_darslar page.',
            'year':datetime.now().year,
        })
    else:
        return render(request, 'app/ochir_video.html', {
        'video': video,
        'foydalanuvchi':foydalanuvchi,
    })
@kabinet()
def video_filtrlash(request, user_id):
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    start = request.GET.get('from')
    end = request.GET.get('to')
    data = videolar.objects.filter(muallif_id=user_id)
    start_date = _parse_filter_date(start)
    end_date = _parse_filter_date(end)
    if start_date:
        data = data.filter(sana__gte=start_date)
    if end_date:
        data = data.filter(sana__lte=end_date)
    return render(request, 'app/video_darslar.html', {'videolar': data, 'foydalanuvchi': foydalanuvchi})
def qidirish(request):
    query = request.GET.get('q', '')
    foydalanuvchi = get_current_user(request)
    all_ilmiy = _deduplicate_works(ilmiy.objects.filter(foreveryone=True).order_by('-sana', '-id'))
    all_oquv = _deduplicate_works(oquvIshlari.objects.filter(foreveryone=True).order_by('-sana', '-id'))
    total_maqolalar = len(all_ilmiy)
    total_kitoblar = len(all_oquv)
    total_videolar = videolar.objects.filter(foreveryone=True).count()
    kafedralar = Kafedralar.objects.all().values_list('nomi', flat=True).distinct()
    teachers = Foydalanuvchilar.objects.filter(
        Q(ism__icontains=query) | Q(familiya__icontains=query) | Q(sharifi__icontains=query)
    ).annotate(
        videolar_soni=Count('video_darslar', filter=Q(video_darslar__foreveryone=True), distinct=True),
        maqolalar_soni=Count('ilmiy_ishlari', filter=Q(ilmiy_ishlari__foreveryone=True), distinct=True),
        kitoblar_soni=Count('oquvishlari', filter=Q(oquvishlari__foreveryone=True), distinct=True),
    )
    for t in teachers:
        t.maqolalar_soni = len([m for m in _get_user_publications(t, ilmiy) if getattr(m, 'foreveryone', False)])
        t.kitoblar_soni = len([k for k in _get_user_publications(t, oquvIshlari) if getattr(k, 'foreveryone', False)])

    return render(request, 'app/teachers.html', {
        'teachers': teachers,
        'query': query,
        'kafedralar': kafedralar,
        'total_kitoblar': total_kitoblar,
        'total_maqolalar': total_maqolalar,
        'total_videolar': total_videolar,
        # Qidiruvdan keyin ham yuqoridagi menyu hisobni tanisin
        'foydalanuvchi': foydalanuvchi,
        'title': 'Teachers',
        'year': datetime.now().year,
    })

from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Foydalanuvchilar, Kafedralar, Dekanatlar

def get_kafedralar(request, fakultet_id):
    kafedralar = Kafedralar.objects.filter(fakultet_id=fakultet_id)
    data = list(kafedralar.values('id', 'nomi'))
    return JsonResponse({'kafedralar': data})


def registratsiya_konteksti(request, qiymatlar=None, **qoshimcha):
    """Ro'yxatdan o'tish formasi uchun umumiy ma'lumotlar.

    Google orqali kelgan bo'lsa, maydonlar Google hisobidagi ism, familiya
    va email bilan oldindan to'ldiriladi. Xatolik bo'lganda esa foydalanuvchi
    yozgan qiymatlar yo'qolib ketmaydi.
    """
    google = request.session.get('google_profil')

    boshlangich = {
        'ism': '', 'familiya': '', 'otasining_ismi': '', 'tugulgan_sana': '',
        'ilmiy_daraja': '', 'gmail': '', 'haqida': '', 'login_f': '',
        'foydalanuvchi_rol': '', 'fakultet': '', 'kafedra': '',
    }

    if google:
        boshlangich['ism'] = google.get('ism', '')
        boshlangich['familiya'] = google.get('familiya', '')
        boshlangich['gmail'] = google.get('email', '')
        boshlangich['login_f'] = google.get('email', '').split('@')[0]

    if qiymatlar is not None:
        for kalit in boshlangich:
            boshlangich[kalit] = qiymatlar.get(kalit) or ''

    kontekst = {
        'fakultetlar': Dekanatlar.objects.all(),
        'foydalanuvchi_rollari': Foydalanuvchilar.ROLES,
        'google': google,
        'qiymatlar': boshlangich,
    }
    kontekst.update(qoshimcha)
    return kontekst


def registratsiya(request):
    google = request.session.get('google_profil')

    if request.method == "POST":
        ism = request.POST.get("ism")
        familiya = request.POST.get("familiya")
        otasining_ismi = request.POST.get("otasining_ismi")
        ilmiy_daraja = request.POST.get("ilmiy_daraja")
        foydalanuvchi_rol = request.POST.get("foydalanuvchi_rol")
        kafedra = request.POST.get("kafedra")
        fakultet = request.POST.get("fakultet")
        tugulgan_sana = request.POST.get("tugulgan_sana")
        gmail = (request.POST.get("gmail") or '').strip()
        haqida = request.POST.get("haqida")
        image = request.FILES.get("image")
        login_f = request.POST.get("login_f")
        parol = request.POST.get("parol")
        parolni_tasdiqlang = request.POST.get("parolni_tasdiqlang")

        # Email Google tasdiqlagan email bilan bir xil bo'lsagina unga ishonamiz
        google_tasdiqlangan = bool(google) and gmail.lower() == google.get('email', '')

        def xato_bilan(matn):
            return render(request, 'app/registratsiya.html',
                          registratsiya_konteksti(request, request.POST, error=matn))

        if parol != parolni_tasdiqlang:
            return xato_bilan('Parollar mos kelmadi!')

        if not parol and not google_tasdiqlangan:
            return xato_bilan('Parol kiriting!')

        if Foydalanuvchilar.objects.filter(login_f=login_f).exists():
            return xato_bilan('Bu login allaqachon mavjud!')

        if gmail and Foydalanuvchilar.objects.filter(gmail__iexact=gmail).exists():
            return xato_bilan('Bu email bilan hisob allaqachon mavjud. Tizimga kiring.')

        kafedra_id_val = int(kafedra) if kafedra and str(kafedra).isdigit() else None
        fakulteti_id_val = int(fakultet) if fakultet and str(fakultet).isdigit() else None

        # Google orqali kelgan va parol yozmagan bo'lsa — tasodifiy parol qo'yamiz,
        # bunday hisobga faqat "Google bilan davom etish" orqali kiriladi.
        xesh = make_password(parol) if parol else make_password(secrets.token_urlsafe(24))

        foydalanuvchi = Foydalanuvchilar(
            ism=ism or '',
            familiya=familiya or '',
            sharifi=otasining_ismi or '',
            tugulgan_sana=_parse_filter_date(tugulgan_sana) or '2000-01-01',
            ilmiy_daraja=ilmiy_daraja or 'Bakalavr',
            foydalanuvchi_rol=foydalanuvchi_rol or 'oqituvchi',
            kafedra_id=kafedra_id_val,
            fakulteti_id=fakulteti_id_val,
            gmail=gmail or None,
            haqida=haqida or '',
            image=image if image else None,
            login_f=login_f,
            parol=xesh
        )
        foydalanuvchi.save()

        # Rasm yuklanmagan bo'lsa, Google profilidagi rasmni olamiz
        if not image and google_tasdiqlangan and google.get('rasm'):
            natija = google_oauth.rasm_yuklab_olish(google['rasm'])
            if natija:
                baytlar, kengaytma = natija
                foydalanuvchi.image.save(
                    'google-%s%s' % (foydalanuvchi.id, kengaytma),
                    ContentFile(baytlar),
                    save=True
                )

        request.session.pop('google_profil', None)

        messages.success(
            request,
            "Ro'yxatdan muvaffaqiyatli o'tdingiz! Hisobingiz administrator "
            "tasdig'idan keyin faollashadi."
        )
        return redirect('login')

    # GET request
    return render(request, 'app/registratsiya.html', registratsiya_konteksti(request))


def article(request):
    foydalanuvchi = get_current_user(request)
    raw_maqolalar = ilmiy.objects.filter(foreveryone=True).select_related('muallif').order_by('-sana', '-id')
    maqolalar = _deduplicate_works(raw_maqolalar)
    top_mualliflar = Foydalanuvchilar.objects.annotate(
        maqola_soni=Count(
            'ilmiy_ishlari',
            filter=Q(
                ilmiy_ishlari__foreveryone=True
            )
        )
    ).order_by('-maqola_soni')[:5]
    return render(request, 'app/article.html', {
        'maqolalar': maqolalar,
        'top_mualliflar': top_mualliflar,
        'foydalanuvchi': foydalanuvchi,
        'title':'Maqolalar',
        'message':'Your article page.',
        'year':datetime.now().year,
    })

def search_article(request):
    foydalanuvchi = get_current_user(request)
    query = request.GET.get('q', '')
    raw_maqolalar = ilmiy.objects.filter(
        Q(foreveryone=True),
        Q(nomi__icontains=query) | Q(muallif__ism__icontains=query) | Q(muallif__familiya__icontains=query) | Q(muallif__sharifi__icontains=query) | Q(ish_mualliflari__icontains=query) | Q(haqida__icontains=query) | Q(muallif__kafedra__nomi__icontains=query)
    ).distinct().select_related('muallif').order_by('-sana', '-id')
    maqolalar = _deduplicate_works(raw_maqolalar)
    top_mualliflar = Foydalanuvchilar.objects.annotate(
        maqola_soni=Count(
            'ilmiy_ishlari',
            filter=Q(
                ilmiy_ishlari__foreveryone=True
            )
        )
    ).order_by('-maqola_soni')[:5]
    return render(request, 'app/article.html', {'maqolalar': maqolalar, 'top_mualliflar':top_mualliflar, 'foydalanuvchi': foydalanuvchi, 'query': query})

def book(request):
    foydalanuvchi = get_current_user(request)
    raw_kitoblar = oquvIshlari.objects.filter(foreveryone=True).select_related('muallif').order_by('-sana', '-id')
    kitoblar = _deduplicate_works(raw_kitoblar)
    top_mualliflar = Foydalanuvchilar.objects.annotate(
        kitob_soni=Count(
            'oquvishlari',
            filter=Q(
                oquvishlari__foreveryone=True
            ))
    ).order_by('-kitob_soni')[:5]
    return render(request, 'app/book.html', {
        'kitoblar': kitoblar,
        'top_mualliflar': top_mualliflar,
        'foydalanuvchi': foydalanuvchi,
        'title':'Kitoblar',
        'message':'Your book page.',
        'year':datetime.now().year,
    })

def search_book(request):
    foydalanuvchi = get_current_user(request)
    query = request.GET.get('q','')
    raw_kitoblar = oquvIshlari.objects.filter(
        Q(foreveryone=True),
        Q(nomi__icontains=query) | Q(muallif__ism__icontains=query) | Q(muallif__familiya__icontains=query) | Q(muallif__sharifi__icontains=query) | Q(ish_mualliflari__icontains=query) | Q(haqida__icontains=query) | Q(muallif__kafedra__nomi__icontains=query)
    ).distinct().select_related('muallif').order_by('-sana', '-id')
    kitoblar = _deduplicate_works(raw_kitoblar)
    top_mualliflar = Foydalanuvchilar.objects.annotate(
        kitob_soni=Count(
            'oquvishlari',
            filter=Q(
                oquvishlari__foreveryone=True
            )
        )
    ).order_by('-kitob_soni')[:5]
    return render(request, 'app/book.html', {'kitoblar':kitoblar, 'top_mualliflar':top_mualliflar, 'foydalanuvchi': foydalanuvchi, 'query': query})

def video(request):
    foydalanuvchi = get_current_user(request)
    video=videolar.objects.filter(foreveryone=True).order_by('-sana')
    top_mualliflar = Foydalanuvchilar.objects.annotate(
        video_soni=Count(
            'video_darslar',
            filter=Q(
                video_darslar__foreveryone=True
            )
        )
    ).order_by('-video_soni')[:5]
    teachers = Foydalanuvchilar.objects.filter(video_darslar__foreveryone=True).distinct()
    return render(request, 'app/video.html', {
        'videolar': video,
        'top_mualliflar': top_mualliflar,
        'teachers': teachers,
        'foydalanuvchi': foydalanuvchi,
        'title':'Video Darslar',
        'message':'Your video page.',
        'year':datetime.now().year,
    })

def search_video(request):
    foydalanuvchi = get_current_user(request)
    query = request.GET.get('q', '')
    video = videolar.objects.filter(
        Q(foreveryone=True),
        Q(nomi__icontains=query) | Q(muallif__ism__icontains=query) | Q(muallif__familiya__icontains=query) | Q(muallif__sharifi__icontains=query) | Q(haqida__icontains=query) | Q(muallif__kafedra__nomi__icontains=query)
    ).distinct().order_by('-sana')
    top_mualliflar = Foydalanuvchilar.objects.annotate(
        video_soni=Count(
            'video_darslar',
            filter=Q(
                video_darslar__foreveryone=True
            )
        )
    ).order_by('-video_soni')[:5]
    teachers = Foydalanuvchilar.objects.filter(video_darslar__foreveryone=True).distinct()
    return render(request, 'app/video.html', {'videolar': video, 'top_mualliflar':top_mualliflar, 'teachers': teachers, 'foydalanuvchi': foydalanuvchi, 'query': query})
def serve_video(request, video_id):
    # Videoni /media/ orqali beramiz: serverda nginx uni oqim bilan (Range, ya'ni oldinga o'tkazish bilan) uzatadi
    video = get_object_or_404(videolar, id=video_id)
    if video.video:
        return redirect(video.video.url)
    elif video.video_link:
        return redirect(video.video_link)
    raise Http404("Video mavjud emas")