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
from django.http import HttpResponse, FileResponse, JsonResponse
from django.conf import settings
from .models import video_darslar as VideoModel  
import secrets
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
    maqolalar_soni=ilmiy.objects.filter(muallif_id=foydalanuvchi.id, turi__iexact='maqola').count()
    scopuslar_soni=ilmiy.objects.filter(muallif_id=foydalanuvchi.id, turi__iexact='scopus').count()
    oquv_soni= oquvIshlari.objects.filter(muallif_id=foydalanuvchi.id).count()
    ilmiy_soni= ilmiy.objects.filter(muallif_id=foydalanuvchi.id).count()
    jami= oquv_soni+ilmiy_soni
    yanvar_o=oquvIshlari.objects.filter(sana__month=1, muallif_id=foydalanuvchi.id).count()
    fevral_o=oquvIshlari.objects.filter(sana__month=2, muallif_id=foydalanuvchi.id).count()
    mart_o=oquvIshlari.objects.filter(sana__month=3, muallif_id=foydalanuvchi.id).count()
    aprel_o=oquvIshlari.objects.filter(sana__month=4, muallif_id=foydalanuvchi.id).count()
    may_o=oquvIshlari.objects.filter(sana__month=5, muallif_id=foydalanuvchi.id).count()
    iyun_o=oquvIshlari.objects.filter(sana__month=6, muallif_id=foydalanuvchi.id).count()
    iyul_o=oquvIshlari.objects.filter(sana__month=7, muallif_id=foydalanuvchi.id).count()
    avgust_o=oquvIshlari.objects.filter(sana__month=8, muallif_id=foydalanuvchi.id).count()
    sentabr_o=oquvIshlari.objects.filter(sana__month=9, muallif_id=foydalanuvchi.id).count()
    oktabr_o=oquvIshlari.objects.filter(sana__month=10, muallif_id=foydalanuvchi.id).count()
    noyabr_o=oquvIshlari.objects.filter(sana__month=11, muallif_id=foydalanuvchi.id).count()
    dekabr_o=oquvIshlari.objects.filter(sana__month=12, muallif_id=foydalanuvchi.id).count()
    yanvar_i=ilmiy.objects.filter(sana__month=1, muallif_id=foydalanuvchi.id).count()
    fevral_i=ilmiy.objects.filter(sana__month=2, muallif_id=foydalanuvchi.id).count()
    mart_i=ilmiy.objects.filter(sana__month=3, muallif_id=foydalanuvchi.id).count()
    aprel_i=ilmiy.objects.filter(sana__month=4, muallif_id=foydalanuvchi.id).count()
    may_i=ilmiy.objects.filter(sana__month=5, muallif_id=foydalanuvchi.id).count()
    iyun_i=ilmiy.objects.filter(sana__month=6, muallif_id=foydalanuvchi.id).count()
    iyul_i=ilmiy.objects.filter(sana__month=7, muallif_id=foydalanuvchi.id).count()
    avgust_i=ilmiy.objects.filter(sana__month=8, muallif_id=foydalanuvchi.id).count()
    sentabr_i=ilmiy.objects.filter(sana__month=9, muallif_id=foydalanuvchi.id).count()
    oktabr_i=ilmiy.objects.filter(sana__month=10, muallif_id=foydalanuvchi.id).count()
    noyabr_i=ilmiy.objects.filter(sana__month=11, muallif_id=foydalanuvchi.id).count()
    dekabr_i=ilmiy.objects.filter(sana__month=12, muallif_id=foydalanuvchi.id).count()

    # Kafedra talablari va o'qituvchining bajarish foizi
    talablar = []
    if foydalanuvchi.kafedra:
        raw_talablar = KafedraTalablari.objects.filter(kafedra=foydalanuvchi.kafedra, faol=True)
        for t in raw_talablar:
            if t.ish_turi == 'Scopus':
                bajarilgan = ilmiy.objects.filter(muallif=foydalanuvchi, turi__iexact='scopus').count()
            elif t.ish_turi == 'Maqola':
                bajarilgan = ilmiy.objects.filter(muallif=foydalanuvchi, turi__iexact='maqola').count()
            elif t.ish_turi == 'Tezis':
                bajarilgan = ilmiy.objects.filter(muallif=foydalanuvchi, turi__iexact='tezis').count()
            elif t.ish_turi in ['Darslik', "O`quv qo`llanma", 'Monografiya', 'Uslubiy ko`rsatma']:
                bajarilgan = oquvIshlari.objects.filter(muallif=foydalanuvchi, turi__iexact=t.ish_turi).count()
            else:
                bajarilgan = ilmiy.objects.filter(muallif=foydalanuvchi).count() + oquvIshlari.objects.filter(muallif=foydalanuvchi).count()
            
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
            'oy_o':[yanvar_o, fevral_o, mart_o, aprel_o, may_o, iyun_o, iyul_o, avgust_o, sentabr_o, oktabr_o, noyabr_o, dekabr_o],
            'oy_i':[yanvar_i, fevral_i, mart_i, aprel_i, may_i, iyun_i, iyul_i, avgust_i, sentabr_i, oktabr_i, noyabr_i, dekabr_i],
            'talablar': talablar,
        }
    )
@kabinet('kafedra mudiri')
def home2(request):
    foydalanuvchi = get_current_user(request)
    if not foydalanuvchi:
        return redirect('login')
    
    if foydalanuvchi.kafedra:
        maqolalar_soni = ilmiy.objects.filter(muallif__kafedra=foydalanuvchi.kafedra, turi__iexact='maqola').count()
        scopuslar_soni = ilmiy.objects.filter(muallif__kafedra=foydalanuvchi.kafedra, turi__iexact='scopus').count()
        oquv_soni = oquvIshlari.objects.filter(muallif__kafedra=foydalanuvchi.kafedra).count()
        ilmiy_soni = ilmiy.objects.filter(muallif__kafedra=foydalanuvchi.kafedra).count()
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
        maqolalar_soni = ilmiy.objects.filter(muallif__fakulteti=foydalanuvchi.fakulteti, turi__iexact='maqola').count()
        scopuslar_soni = ilmiy.objects.filter(muallif__fakulteti=foydalanuvchi.fakulteti, turi__iexact='scopus').count()
        oquv_soni = oquvIshlari.objects.filter(muallif__fakulteti=foydalanuvchi.fakulteti).count()
        ilmiy_soni = ilmiy.objects.filter(muallif__fakulteti=foydalanuvchi.fakulteti).count()
    else:
        maqolalar_soni = scopuslar_soni = oquv_soni = ilmiy_soni = 0
    
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
    
    maqolalar_soni = ilmiy.objects.filter(turi__iexact='maqola').count()
    scopuslar_soni = ilmiy.objects.filter(turi__iexact='scopus').count()
    tezislar_soni = ilmiy.objects.filter(turi__iexact='tezis').count()
    
    oquv_soni = oquvIshlari.objects.count()
    ilmiy_soni = ilmiy.objects.count()
    video_soni = videolar.objects.count()
    jami = oquv_soni + ilmiy_soni + video_soni

    oy_o = [oquvIshlari.objects.filter(sana__month=m).count() for m in range(1, 13)]
    oy_i = [ilmiy.objects.filter(sana__month=m).count() for m in range(1, 13)]
    
    fakultetlar_stat = []
    fakultet_labels = []
    fakultet_maqolalar = []
    fakultet_kitoblar = []
    
    for f in Dekanatlar.objects.all():
        m_count = ilmiy.objects.filter(muallif__fakulteti=f).count()
        k_count = oquvIshlari.objects.filter(muallif__fakulteti=f).count()
        t_count = Foydalanuvchilar.objects.filter(fakulteti=f).count()
        fakultetlar_stat.append({
            'nomi': f.nomi,
            'dekan': f.dekan,
            'oqituvchilar': t_count,
            'maqolalar': m_count,
            'kitoblar': k_count,
            'jami': m_count + k_count
        })
        fakultet_labels.append(f.nomi)
        fakultet_maqolalar.append(m_count)
        fakultet_kitoblar.append(k_count)

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

@kabinet('prorektor')
def ilmiy_ishlari4(request, user_id):
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    fakultet_id = request.GET.get('fakultet')
    kafedra_id = request.GET.get('kafedra')
    turi_filter = request.GET.get('turi')
    from_date = request.GET.get('from')
    to_date = request.GET.get('to')
    
    qs = ilmiy.objects.all()
    if fakultet_id:
        qs = qs.filter(muallif__fakulteti_id=fakultet_id)
    if kafedra_id:
        qs = qs.filter(muallif__kafedra_id=kafedra_id)
    if turi_filter:
        qs = qs.filter(turi=turi_filter)
    if from_date:
        qs = qs.filter(sana__gte=from_date)
    if to_date:
        qs = qs.filter(sana__lte=to_date)
        
    fakultetlar = Dekanatlar.objects.all()
    kafedralar = Kafedralar.objects.all()
    if fakultet_id:
        kafedralar = kafedralar.filter(fakultet_id=fakultet_id)
    turlar = ilmiy.objects.values_list('turi', flat=True).distinct()
    
    return render(request, 'app/ilmiy_ishlar4.html', {
        'title': 'Universitet Ilmiy Ishlari',
        'year': datetime.now().year,
        'maqola': qs.order_by('-sana')[:300],
        'foydalanuvchi': foydalanuvchi,
        'kafedralar': kafedralar,
        'fakultetlar': fakultetlar,
        'turi': turlar,
    })

@kabinet('prorektor')
def oquv_ishlari4(request, user_id):
    foydalanuvchi = get_object_or_404(Foydalanuvchilar, id=user_id)
    fakultet_id = request.GET.get('fakultet')
    kafedra_id = request.GET.get('kafedra')
    turi_filter = request.GET.get('turi')
    from_date = request.GET.get('from')
    to_date = request.GET.get('to')
    
    qs = oquvIshlari.objects.all()
    if fakultet_id:
        qs = qs.filter(muallif__fakulteti_id=fakultet_id)
    if kafedra_id:
        qs = qs.filter(muallif__kafedra_id=kafedra_id)
    if turi_filter:
        qs = qs.filter(turi=turi_filter)
    if from_date:
        qs = qs.filter(sana__gte=from_date)
    if to_date:
        qs = qs.filter(sana__lte=to_date)
        
    fakultetlar = Dekanatlar.objects.all()
    kafedralar = Kafedralar.objects.all()
    if fakultet_id:
        kafedralar = kafedralar.filter(fakultet_id=fakultet_id)
    turlar = oquvIshlari.objects.values_list('turi', flat=True).distinct()
    
    return render(request, 'app/o`quv_ishlari4.html', {
        'title': 'Universitet O`quv Ishlari',
        'year': datetime.now().year,
        'maqola': qs.order_by('-sana')[:300],
        'foydalanuvchi': foydalanuvchi,
        'kafedralar': kafedralar,
        'fakultetlar': fakultetlar,
        'turi': turlar,
    })

@kabinet()
def oquv_ishlari(request, user_id):
    """Renders the oquv_ishlari page."""
    assert isinstance(request, HttpRequest)
    foydalanuvchi = Foydalanuvchilar.objects.get(id=user_id)
    maqola=oquvIshlari.objects.filter(muallif_id=foydalanuvchi.id)
    turi=oquvIshlari.objects.filter(muallif_id=foydalanuvchi.id).values_list('turi', flat=True).distinct()
    ish_muallifiy= oquvIshlari.objects.filter(muallif_id=foydalanuvchi.id).values_list('ish_mualliflari', flat=True).distinct()
    ish_muallifi = []
    for qator in ish_muallifiy:
        if qator: 
            ish_muallifi.extend([m.strip() for m in qator.split(',')])
            ish_muallifi = list(set(ish_muallifi))
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
            'ish_muallifi':ish_muallifi
        }
    )
@kabinet()
def ilmiy_ishlari(request, user_id):
    """Renders the oquv_ishlari page."""
    assert isinstance(request, HttpRequest)
    foydalanuvchi = Foydalanuvchilar.objects.get(id=user_id)
    maqolalar=ilmiy.objects.filter(muallif_id=foydalanuvchi.id)
    turi=ilmiy.objects.filter(muallif_id=foydalanuvchi.id).values_list('turi', flat=True).distinct()
    ish_muallifiy= ilmiy.objects.filter(muallif_id=foydalanuvchi.id).values_list('ish_mualliflari', flat=True).distinct()
    ish_muallifi = []

    for qator in ish_muallifiy:
        if qator: 
            ish_muallifi.extend([m.strip() for m in qator.split(',')])
            ish_muallifi = list(set(ish_muallifi))
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
            'ish_muallifi':ish_muallifi
        }
    )
@ozining_sahifasi
def profile(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi = get_current_user(request)
    maqolalar_soni = ilmiy.objects.filter(muallif_id=foydalanuvchi.id, turi__iexact='maqola').count()
    scopuslar_soni = ilmiy.objects.filter(muallif_id=foydalanuvchi.id, turi__iexact='scopus').count()
    oquv_soni = oquvIshlari.objects.filter(muallif_id=foydalanuvchi.id).count()
    ilmiy_soni = ilmiy.objects.filter(muallif_id=foydalanuvchi.id).count() 
    jami = oquv_soni + ilmiy_soni
    yanvar_o = oquvIshlari.objects.filter(sana__month=1, muallif_id=foydalanuvchi.id).count()
    fevral_o = oquvIshlari.objects.filter(sana__month=2, muallif_id=foydalanuvchi.id).count()
    mart_o = oquvIshlari.objects.filter(sana__month=3, muallif_id=foydalanuvchi.id).count()
    aprel_o = oquvIshlari.objects.filter(sana__month=4, muallif_id=foydalanuvchi.id).count()
    may_o = oquvIshlari.objects.filter(sana__month=5, muallif_id=foydalanuvchi.id).count()
    iyun_o = oquvIshlari.objects.filter(sana__month=6, muallif_id=foydalanuvchi.id).count()
    iyul_o = oquvIshlari.objects.filter(sana__month=7, muallif_id=foydalanuvchi.id).count()
    avgust_o = oquvIshlari.objects.filter(sana__month=8, muallif_id=foydalanuvchi.id).count()
    sentabr_o = oquvIshlari.objects.filter(sana__month=9, muallif_id=foydalanuvchi.id).count()
    oktabr_o = oquvIshlari.objects.filter(sana__month=10, muallif_id=foydalanuvchi.id).count()
    noyabr_o = oquvIshlari.objects.filter(sana__month=11, muallif_id=foydalanuvchi.id).count()
    dekabr_o = oquvIshlari.objects.filter(sana__month=12, muallif_id=foydalanuvchi.id).count()
    yanvar_i = ilmiy.objects.filter(sana__month=1, muallif_id=foydalanuvchi.id).count()
    fevral_i = ilmiy.objects.filter(sana__month=2, muallif_id=foydalanuvchi.id).count()
    mart_i = ilmiy.objects.filter(sana__month=3, muallif_id=foydalanuvchi.id).count()
    aprel_i = ilmiy.objects.filter(sana__month=4, muallif_id=foydalanuvchi.id).count()
    may_i = ilmiy.objects.filter(sana__month=5, muallif_id=foydalanuvchi.id).count()
    iyun_i = ilmiy.objects.filter(sana__month=6, muallif_id=foydalanuvchi.id).count()
    iyul_i = ilmiy.objects.filter(sana__month=7, muallif_id=foydalanuvchi.id).count()
    avgust_i = ilmiy.objects.filter(sana__month=8, muallif_id=foydalanuvchi.id).count()
    sentabr_i = ilmiy.objects.filter(sana__month=9, muallif_id=foydalanuvchi.id).count()
    oktabr_i = ilmiy.objects.filter(sana__month=10, muallif_id=foydalanuvchi.id).count()
    noyabr_i = ilmiy.objects.filter(sana__month=11, muallif_id=foydalanuvchi.id).count()
    dekabr_i = ilmiy.objects.filter(sana__month=12, muallif_id=foydalanuvchi.id).count()

    # Kafedra talablari va o'qituvchining bajarish foizi
    talablar = []
    if foydalanuvchi.kafedra:
        raw_talablar = KafedraTalablari.objects.filter(kafedra=foydalanuvchi.kafedra, faol=True)
        for t in raw_talablar:
            if t.ish_turi == 'Scopus':
                bajarilgan = ilmiy.objects.filter(muallif=foydalanuvchi, turi__iexact='scopus').count()
            elif t.ish_turi == 'Maqola':
                bajarilgan = ilmiy.objects.filter(muallif=foydalanuvchi, turi__iexact='maqola').count()
            elif t.ish_turi == 'Tezis':
                bajarilgan = ilmiy.objects.filter(muallif=foydalanuvchi, turi__iexact='tezis').count()
            elif t.ish_turi in ['Darslik', "O`quv qo`llanma", 'Monografiya', 'Uslubiy ko`rsatma']:
                bajarilgan = oquvIshlari.objects.filter(muallif=foydalanuvchi, turi__iexact=t.ish_turi).count()
            else:
                bajarilgan = ilmiy.objects.filter(muallif=foydalanuvchi).count() + oquvIshlari.objects.filter(muallif=foydalanuvchi).count()
            
            foiz = min(100, int((bajarilgan / t.talab_miqdori) * 100)) if t.talab_miqdori > 0 else 100
            talablar.append({
                'obj': t,
                'bajarilgan': bajarilgan,
                'foiz': foiz,
                'holat': 'Bajarildi' if foiz >= 100 else 'Jarayonda'
            })

    return render(
        request,
        'app/profil.html',
        {
            'foydalanuvchi': foydalanuvchi,
            'title': 'O\'qituvchi Paneli',
            'year': datetime.now().year,
            'maqolalar_soni': maqolalar_soni,
            'scopuslar_soni': scopuslar_soni,
            'oquv_soni': oquv_soni,
            'jami': jami,
            'oy_o': [yanvar_o, fevral_o, mart_o, aprel_o, may_o, iyun_o, iyul_o, avgust_o, sentabr_o, oktabr_o, noyabr_o, dekabr_o],
            'oy_i': [yanvar_i, fevral_i, mart_i, aprel_i, may_i, iyun_i, iyul_i, avgust_i, sentabr_i, oktabr_i, noyabr_i, dekabr_i],
            'talablar': talablar,
        }
    )
@kabinet()
def qoshish(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    return render(
        request,
        'app/tahrirlash.html',
        {
            'foydalanuvchi':foydalanuvchi,
            'title':'Qoshish',
            'message':'Your application description page.',
            'year':datetime.now().year,
        }
    )
@kabinet()
def qoshish_i(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    return render(
        request,
        'app/tahrirlash_i.html',
        {
            'foydalanuvchi':foydalanuvchi,
            'title':'Qoshish_i',
            'message':'Your application description page.',
            'year':datetime.now().year,
        }
    )
@ozining_sahifasi
def qoshish_oquv(request, user_id):
    foydalanuvchi=get_current_user(request)
    assert isinstance(request, HttpRequest)
    if request.method=="POST":
        turi=request.POST.get("turi")
        nomi=request.POST.get("nomi")
        haqida=request.POST.get("haqida")
        sana=request.POST.get("sana")
        ish_mualliflari=request.POST.get("ish_mualliflari")
        betlar_soni=request.POST.get("betlar_soni")
        fayl=request.FILES.get("fayl")
        # Muallif formadan emas, sessiyadan olinadi: aks holda birovning nomidan ish qo'shish mumkin edi
        muallif=foydalanuvchi
        foreveryone = request.POST.get("foreveryone") == "on"
        image = request.FILES.get("image")
        yangi=oquvIshlari(turi=turi,nomi=nomi,sana=sana,muallif=muallif,betlar_soni=betlar_soni,fayl=fayl,ish_mualliflari=ish_mualliflari,foreveryone=foreveryone, image=image, haqida=haqida)
        yangi.save()
    return render(
        request,
        'app/tahrirlash.html',
        {
            'foydalanuvchi':foydalanuvchi,
            'title':'Qoshish',
            'message':'Your application description page.',
            'year':datetime.now().year,
        }
    )
@ozining_sahifasi
def qoshish_ilmiy(request, user_id):
    foydalanuvchi=get_current_user(request)
    assert isinstance(request, HttpRequest)
    if request.method=="POST":
        turi=request.POST.get("turi")
        nomi=request.POST.get("nomi")
        sana=request.POST.get("sana")
        haqida=request.POST.get("haqida")
        ish_mualliflari=request.POST.get("ish_mualliflari")
        kategoriya=request.POST.get("kategoriya")
        fayl=request.FILES.get("fayl")
        # Muallif formadan emas, sessiyadan olinadi
        foreveryone = request.POST.get("foreveryone") == "on"
        dgu_raqami = request.POST.get("dgu_raqami", "").strip() or None
        maqola_link = request.POST.get("maqola_link", "").strip() or None
        yangi=ilmiy(turi=turi,nomi=nomi,sana=sana,muallif=muallif, ish_mualliflari=ish_mualliflari, kategoriya=kategoriya, fayl=fayl, haqida=haqida, foreveryone=foreveryone, dgu_raqami=dgu_raqami, maqola_link=maqola_link)
        yangi.save()
    return render(
        request,
        'app/tahrirlash_i.html',
        {

            'title':'Qoshish',
            'message':'Your application description page.',
            'year':datetime.now().year,
            'foydalanuvchi':foydalanuvchi,
        }
    )
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


def _get_ish_muallifi_list(qs_values):
    result = set()
    for qator in qs_values:
        if qator:
            result.update(m.strip() for m in qator.split(','))
    return sorted(result)


@kabinet()
def filtrlash_ilmiy(request, user_id):
    foydalanuvchi = Foydalanuvchilar.objects.get(id=user_id)
    start = request.GET.get('from')
    end = request.GET.get('to')
    turi = request.GET.get('turi')
    ish_muallifi_filter = request.GET.get('ish_muallifi')

    base_qs = ilmiy.objects.filter(muallif_id=foydalanuvchi.id)

    unique_ids = base_qs.values('nomi', 'turi', 'sana').annotate(
        min_id=Min('id')
    ).values_list('min_id', flat=True)
    data = ilmiy.objects.filter(id__in=unique_ids).order_by('nomi')

    if start and end:
        data = data.filter(sana__range=[start, end])
    if turi:
        data = data.filter(turi=turi)
    if ish_muallifi_filter:
        data = [item for item in data if item.ish_mualliflari and
                ish_muallifi_filter in [m.strip() for m in item.ish_mualliflari.split(',')]]

    turlar = base_qs.values_list('turi', flat=True).distinct()
    ish_muallifi = _get_ish_muallifi_list(
        base_qs.values_list('ish_mualliflari', flat=True)
    )

    return render(request, 'app/ilmiy_ishlar.html', {
        'maqola': data,
        'foydalanuvchi': foydalanuvchi,
        'turi': turlar,
        'ish_muallifi': ish_muallifi
    })


@kabinet('kafedra mudiri')
def filtrlash_ilmiy2(request, user_id):
    foydalanuvchi = Foydalanuvchilar.objects.get(id=user_id)
    start = request.GET.get('from')
    end = request.GET.get('to')
    turi = request.GET.get('turi')
    ish_muallifi_filter = request.GET.get('ish_muallifi')

    base_qs = ilmiy.objects.filter(
        muallif__kafedra=foydalanuvchi.kafedra
    )

    unique_ids = base_qs.values('nomi', 'turi', 'sana').annotate(
        min_id=Min('id')
    ).values_list('min_id', flat=True)
    data = ilmiy.objects.filter(id__in=unique_ids).order_by('nomi')

    if start and end:
        data = data.filter(sana__range=[start, end])
    if turi:
        data = data.filter(turi=turi)
    if ish_muallifi_filter:
        data = [item for item in data if item.ish_mualliflari and
                ish_muallifi_filter in [m.strip() for m in item.ish_mualliflari.split(',')]]

    turlar = base_qs.values_list('turi', flat=True).distinct()
    ish_muallifi = _get_ish_muallifi_list(
        base_qs.values_list('ish_mualliflari', flat=True)
    )

    return render(request, 'app/ilmiy_ishlar2.html', {
        'maqola': data,
        'foydalanuvchi': foydalanuvchi,
        'turi': turlar,
        'ish_muallifi': ish_muallifi
    })


@kabinet('dekan')
def filtrlash_ilmiy3(request, user_id):
    foydalanuvchi = Foydalanuvchilar.objects.get(id=user_id)
    start = request.GET.get('from')
    end = request.GET.get('to')
    turi = request.GET.get('turi')
    kafedra = request.GET.get('kafedra')
    ish_muallifi_filter = request.GET.get('ish_muallifi')

    kafedralar = Kafedralar.objects.filter(fakultet=foydalanuvchi.fakulteti)

    if kafedra:
        base_qs = ilmiy.objects.filter(
            muallif__kafedra__nomi=kafedra,
            muallif__kafedra__fakultet=foydalanuvchi.fakulteti
        )
    else:
        base_qs = ilmiy.objects.filter(
            muallif__kafedra__fakultet=foydalanuvchi.fakulteti
        )

    unique_ids = base_qs.values('nomi', 'turi', 'sana').annotate(
        min_id=Min('id')
    ).values_list('min_id', flat=True)
    data = ilmiy.objects.filter(id__in=unique_ids).order_by('nomi')

    if start and end:
        data = data.filter(sana__range=[start, end])
    if turi:
        data = data.filter(turi=turi)
    if ish_muallifi_filter:
        data = [item for item in data if item.ish_mualliflari and
                ish_muallifi_filter in [m.strip() for m in item.ish_mualliflari.split(',')]]

    turlar = base_qs.values_list('turi', flat=True).distinct()
    ish_muallifi = _get_ish_muallifi_list(
        base_qs.values_list('ish_mualliflari', flat=True)
    )

    return render(request, 'app/ilmiy_ishlar3.html', {
        'maqola': data,
        'foydalanuvchi': foydalanuvchi,
        'kafedralar': kafedralar,
        'turi': turlar,
        'ish_muallifi': ish_muallifi
    })


@kabinet()
def filtrlash_oquv(request, user_id):
    foydalanuvchi = Foydalanuvchilar.objects.get(id=user_id)
    start = request.GET.get('from')
    end = request.GET.get('to')
    turi = request.GET.get('turi')
    ish_muallifi_filter = request.GET.get('ish_muallifi')

    base_qs = oquvIshlari.objects.filter(muallif_id=foydalanuvchi.id)

    unique_ids = base_qs.values('nomi', 'turi', 'sana').annotate(
        min_id=Min('id')
    ).values_list('min_id', flat=True)
    data = oquvIshlari.objects.filter(id__in=unique_ids).order_by('nomi')

    if start and end:
        data = data.filter(sana__range=[start, end])
    if turi:
        data = data.filter(turi=turi)
    if ish_muallifi_filter:
        data = [item for item in data if item.ish_mualliflari and
                ish_muallifi_filter in [m.strip() for m in item.ish_mualliflari.split(',')]]

    turlar = base_qs.values_list('turi', flat=True).distinct()
    ish_muallifi = _get_ish_muallifi_list(
        base_qs.values_list('ish_mualliflari', flat=True)
    )

    return render(request, "app/o`quv_ishlari.html", {
        'maqola': data,
        'foydalanuvchi': foydalanuvchi,
        'turi': turlar,
        'ish_muallifi': ish_muallifi
    })


@kabinet('kafedra mudiri')
def filtrlash_oquv2(request, user_id):
    foydalanuvchi = Foydalanuvchilar.objects.get(id=user_id)
    start = request.GET.get('from')
    end = request.GET.get('to')
    turi = request.GET.get('turi')
    ish_muallifi_filter = request.GET.get('ish_muallifi')

    base_qs = oquvIshlari.objects.filter(
        muallif__kafedra=foydalanuvchi.kafedra
    )

    unique_ids = base_qs.values('nomi', 'turi', 'sana').annotate(
        min_id=Min('id')
    ).values_list('min_id', flat=True)
    data = oquvIshlari.objects.filter(id__in=unique_ids).order_by('nomi')

    if start and end:
        data = data.filter(sana__range=[start, end])
    if turi:
        data = data.filter(turi=turi)
    if ish_muallifi_filter:
        data = [item for item in data if item.ish_mualliflari and
                ish_muallifi_filter in [m.strip() for m in item.ish_mualliflari.split(',')]]

    turlar = base_qs.values_list('turi', flat=True).distinct()
    ish_muallifi = _get_ish_muallifi_list(
        base_qs.values_list('ish_mualliflari', flat=True)
    )

    return render(request, "app/o`quv_ishlari2.html", {
        'maqola': data,
        'foydalanuvchi': foydalanuvchi,
        'turi': turlar,
        'ish_muallifi': ish_muallifi
    })


@kabinet('dekan')
def filtrlash_oquv3(request, user_id):
    foydalanuvchi = Foydalanuvchilar.objects.get(id=user_id)
    start = request.GET.get('from')
    end = request.GET.get('to')
    turi = request.GET.get('turi')
    kafedra = request.GET.get('kafedra')
    ish_muallifi_filter = request.GET.get('ish_muallifi')

    kafedralar = Kafedralar.objects.filter(fakultet=foydalanuvchi.fakulteti)

    if kafedra:
        base_qs = oquvIshlari.objects.filter(
            muallif__kafedra__nomi=kafedra,
            muallif__kafedra__fakultet=foydalanuvchi.fakulteti
        )
    else:
        base_qs = oquvIshlari.objects.filter(
            muallif__kafedra__fakultet=foydalanuvchi.fakulteti
        )

    unique_ids = base_qs.values('nomi', 'turi', 'sana').annotate(
        min_id=Min('id')
    ).values_list('min_id', flat=True)
    data = oquvIshlari.objects.filter(id__in=unique_ids).order_by('nomi')

    if start and end:
        data = data.filter(sana__range=[start, end])
    if turi:
        data = data.filter(turi=turi)
    if ish_muallifi_filter:
        data = [item for item in data if item.ish_mualliflari and
                ish_muallifi_filter in [m.strip() for m in item.ish_mualliflari.split(',')]]

    turlar = base_qs.values_list('turi', flat=True).distinct()
    ish_muallifi = _get_ish_muallifi_list(
        base_qs.values_list('ish_mualliflari', flat=True)
    )

    return render(request, "app/o`quv_ishlari3.html", {
        'maqola': data,
        'foydalanuvchi': foydalanuvchi,
        'kafedralar': kafedralar,
        'turi': turlar,
        'ish_muallifi': ish_muallifi
    })
@ozining_sahifasi
def tahrirlash_ilmiy(request, i_id, t_id, user_id):
    foydalanuvchi=get_current_user(request)

    if t_id == 1:
        model = ilmiy_a
        form_class = IlmiyForm
        
    else:
        model = oquvIshlari
        form_class = OquvForm

    ilmiy = get_object_or_404(model, id=i_id, muallif_id=foydalanuvchi.id)

    if request.method == "POST":
        form = form_class(request.POST, request.FILES, instance=ilmiy)
        if form.is_valid():
            form.save()
         
            if int(t_id) == 1:
                return render(request, 'app/ilmiy_ishlar.html', {
                    'title':'Oquv Ishlari',
                    'message':'Your oquv_ishlari page.',
                    'year':datetime.now().year,
                    'maqola':ilmiy_a.objects.filter(muallif_id=foydalanuvchi.id),
                    'foydalanuvchi':foydalanuvchi})
            else:
                return render(request, 'app/o`quv_ishlari.html', {
                                'title':'Oquv Ishlari',
                                'message':'Your oquv_ishlari page.',
                                'year':datetime.now().year,
                                'maqola':oquvIshlari.objects.filter(muallif_id=foydalanuvchi.id),
                                'foydalanuvchi':foydalanuvchi})

    else:
        form = form_class(instance=ilmiy)

    return render(request, 'app/tahrirlash_A.html', {
        'form': form,
        'ilmiy': ilmiy,
        't_id': t_id,
        'foydalanuvchi':foydalanuvchi,
    })

@kabinet('kafedra mudiri')
def profile2(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi = Foydalanuvchilar.objects.get(id=user_id)
    if foydalanuvchi.kafedra:
        maqolalar_soni = ilmiy.objects.filter(muallif__kafedra=foydalanuvchi.kafedra, turi__iexact='maqola').count()
        scopuslar_soni = ilmiy.objects.filter(muallif__kafedra=foydalanuvchi.kafedra, turi__iexact='scopus').count()
        oquv_soni = oquvIshlari.objects.filter(muallif__kafedra=foydalanuvchi.kafedra).count()
        ilmiy_soni = ilmiy.objects.filter(muallif__kafedra=foydalanuvchi.kafedra).count()
        talablar_soni = KafedraTalablari.objects.filter(kafedra=foydalanuvchi.kafedra).count()
        oqituvchilar_soni = Foydalanuvchilar.objects.filter(kafedra=foydalanuvchi.kafedra).count()
    else:
        maqolalar_soni = scopuslar_soni = oquv_soni = ilmiy_soni = talablar_soni = oqituvchilar_soni = 0
    
    jami = oquv_soni + ilmiy_soni
    return render(
        request,
        'app/profil2.html',
        {
            'foydalanuvchi': foydalanuvchi,
            'title': 'Kafedra Mudiri Paneli',
            'year': datetime.now().year,
            'maqolalar_soni': maqolalar_soni,
            'scopuslar_soni': scopuslar_soni,
            'oquv_soni': oquv_soni,
            'jami': jami,
            'talablar_soni': talablar_soni,
            'oqituvchilar_soni': oqituvchilar_soni,
        }
    )

@kabinet('dekan')
def profile3(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi = Foydalanuvchilar.objects.get(id=user_id)
    if foydalanuvchi.fakulteti:
        maqolalar_soni = ilmiy.objects.filter(muallif__fakulteti=foydalanuvchi.fakulteti, turi__iexact='maqola').count()
        scopuslar_soni = ilmiy.objects.filter(muallif__fakulteti=foydalanuvchi.fakulteti, turi__iexact='scopus').count()
        oquv_soni = oquvIshlari.objects.filter(muallif__fakulteti=foydalanuvchi.fakulteti).count()
        ilmiy_soni = ilmiy.objects.filter(muallif__fakulteti=foydalanuvchi.fakulteti).count()
    else:
        maqolalar_soni = scopuslar_soni = oquv_soni = ilmiy_soni = 0
    
    jami = oquv_soni + ilmiy_soni
    return render(
        request,
        'app/profil3.html',
        {
            'foydalanuvchi': foydalanuvchi,
            'title': 'Dekan Paneli',
            'year': datetime.now().year,
            'maqolalar_soni': maqolalar_soni,
            'scopuslar_soni': scopuslar_soni,
            'oquv_soni': oquv_soni,
            'jami': jami,
        }
    )
from django.db.models import Min


@kabinet('kafedra mudiri')
def ilmiy_ishlari2(request, user_id):
    assert isinstance(request, HttpRequest)

    foydalanuvchi = Foydalanuvchilar.objects.get(id=user_id)

    base_qs = ilmiy.objects.filter(
        muallif__kafedra=foydalanuvchi.kafedra
    )

    unique_ids = base_qs.values('nomi', 'turi', 'sana').annotate(
        min_id=Min('id')
    ).values_list('min_id', flat=True)

    maqolalar = ilmiy.objects.filter(
        id__in=unique_ids
    ).order_by('nomi')

    turi = base_qs.values_list('turi', flat=True).distinct()

    ish_muallifi_set = set()
    for item in base_qs.values_list('ish_mualliflari', flat=True):
        if item:
            ish_muallifi_set.update(m.strip() for m in item.split(','))

    return render(request, 'app/ilmiy_ishlar2.html', {
        'title': 'Ilmiy Ishlari',
        'year': datetime.now().year,
        'maqola': maqolalar,
        'foydalanuvchi': foydalanuvchi,
        'turi': turi,
        'ish_muallifi': sorted(ish_muallifi_set)
    })


@kabinet('dekan')
def ilmiy_ishlari3(request, user_id):
    assert isinstance(request, HttpRequest)

    foydalanuvchi = Foydalanuvchilar.objects.get(id=user_id)

    kafedralar = Kafedralar.objects.filter(
        fakultet=foydalanuvchi.fakulteti
    )

    base_qs = ilmiy.objects.filter(
        muallif__kafedra__fakultet=foydalanuvchi.fakulteti
    )

    unique_ids = base_qs.values('nomi', 'turi', 'sana').annotate(
        min_id=Min('id')
    ).values_list('min_id', flat=True)

    maqolalar = ilmiy.objects.filter(
        id__in=unique_ids
    ).order_by('nomi')

    turi = base_qs.values_list('turi', flat=True).distinct()

    ish_muallifi_set = set()
    for item in base_qs.values_list('ish_mualliflari', flat=True):
        if item:
            ish_muallifi_set.update(m.strip() for m in item.split(','))

    return render(request, 'app/ilmiy_ishlar3.html', {
        'title': 'Ilmiy Ishlari',
        'year': datetime.now().year,
        'maqola': maqolalar,
        'foydalanuvchi': foydalanuvchi,
        'kafedralar': kafedralar,
        'turi': turi,
        'ish_muallifi': sorted(ish_muallifi_set)
    })


@kabinet('kafedra mudiri')
def oquv_ishlari2(request, user_id):
    assert isinstance(request, HttpRequest)

    foydalanuvchi = Foydalanuvchilar.objects.get(id=user_id)

    base_qs = oquvIshlari.objects.filter(
        muallif__kafedra=foydalanuvchi.kafedra
    )

    unique_ids = base_qs.values('nomi', 'turi', 'sana').annotate(
        min_id=Min('id')
    ).values_list('min_id', flat=True)

    maqolalar = oquvIshlari.objects.filter(
        id__in=unique_ids
    ).order_by('nomi')

    turi = base_qs.values_list('turi', flat=True).distinct()

    ish_muallifi_set = set()
    for item in base_qs.values_list('ish_mualliflari', flat=True):
        if item:
            ish_muallifi_set.update(m.strip() for m in item.split(','))

    return render(request, "app/o`quv_ishlari2.html", {
        'title': 'Oquv Ishlari',
        'year': datetime.now().year,
        'maqola': maqolalar,
        'foydalanuvchi': foydalanuvchi,
        'turi': turi,
        'ish_muallifi': sorted(ish_muallifi_set)
    })


@kabinet('dekan')
def oquv_ishlari3(request, user_id):
    assert isinstance(request, HttpRequest)

    foydalanuvchi = Foydalanuvchilar.objects.get(id=user_id)

    kafedralar = Kafedralar.objects.filter(
        fakultet=foydalanuvchi.fakulteti
    )

    base_qs = oquvIshlari.objects.filter(
        muallif__kafedra__fakultet=foydalanuvchi.fakulteti
    )

    unique_ids = base_qs.values('nomi', 'turi', 'sana').annotate(
        min_id=Min('id')
    ).values_list('min_id', flat=True)

    maqolalar = oquvIshlari.objects.filter(
        id__in=unique_ids
    ).order_by('nomi')

    turi = base_qs.values_list('turi', flat=True).distinct()

    ish_muallifi_set = set()
    for item in base_qs.values_list('ish_mualliflari', flat=True):
        if item:
            ish_muallifi_set.update(m.strip() for m in item.split(','))

    return render(request, "app/o`quv_ishlari3.html", {
        'title': 'Oquv Ishlari',
        'message': 'Your oquv_ishlari page.',
        'year': datetime.now().year,
        'maqola': maqolalar,
        'foydalanuvchi': foydalanuvchi,
        'kafedralar': kafedralar,
        'turi': turi,
        'ish_muallifi': sorted(list(ish_muallifi_set))
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
                rel = os.path.normpath(f).lstrip("/\\")
                basename = os.path.basename(rel)
            else:
                rel = os.path.normpath(f.get('path', '')).lstrip("/\\")
                prefix = str(i)  # loop indeksi prefix sifatida ishlatiladi
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
                foydalanuvchi.tugulgan_sana = tugulgan_sana
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
    oqituvchilar_soni=Foydalanuvchilar.objects.filter(foydalanuvchi_rol='oqituvchi').count()
    video_darslar_soni=videolar.objects.filter(foreveryone=True).count()
    # Turi katta-kichik harfda saqlanishi mumkin, shuning uchun iexact
    maqolalar_soni=ilmiy.objects.filter(turi__iexact='maqola', foreveryone=True).count()+ilmiy.objects.filter(turi__iexact='scopus', foreveryone=True).count()
    kitoblar_soni=oquvIshlari.objects.filter(foreveryone=True).count()

    # Bosh sahifadagi "so'nggi qo'shilganlar" bo'limlari
    songgi_kitoblar = oquvIshlari.objects.filter(foreveryone=True).select_related('muallif').order_by('-sana')[:4]
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
    total_maqolalar = ilmiy.objects.filter(foreveryone=True).count()
    total_kitoblar = oquvIshlari.objects.filter(foreveryone=True).count()
    total_videolar = videolar.objects.filter(foreveryone=True).count()
    kafedralar = Kafedralar.objects.all().values_list('nomi', flat=True).distinct()
    teachers = Foydalanuvchilar.objects.annotate(
        videolar_soni=Count('video_darslar', filter=Q(video_darslar__foreveryone=True), distinct=True),
        maqolalar_soni=Count('ilmiy_ishlari', filter=Q(ilmiy_ishlari__foreveryone=True), distinct=True),
        kitoblar_soni=Count('oquvishlari', filter=Q(oquvishlari__foreveryone=True), distinct=True),
    )
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
    maqolalar = ilmiy.objects.filter(muallif_id=teacher.id, foreveryone=True)
    kitoblar = oquvIshlari.objects.filter(muallif_id=teacher.id, foreveryone=True)
    video = videolar.objects.filter(muallif_id=teacher.id, foreveryone=True)
    
    maqolalar_soni = maqolalar.count()
    kitoblar_soni = kitoblar.count()
    videolar_soni = video.count()

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
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    start = request.GET.get('from')
    end = request.GET.get('to')
    data = videolar.objects.filter(muallif_id=user_id)
    if start and end:
        data = data.filter(sana__range=[start, end], muallif_id=user_id)
    return render(request, 'app/video_darslar.html', {'videolar': data, 'foydalanuvchi':foydalanuvchi})
def qidirish(request):
    query = request.GET.get('q', '')
    foydalanuvchi = get_current_user(request)
    total_maqolalar = ilmiy.objects.filter(foreveryone=True).count()
    total_kitoblar = oquvIshlari.objects.filter(foreveryone=True).count()
    total_videolar = videolar.objects.filter(foreveryone=True).count()
    kafedralar = Kafedralar.objects.all().values_list('nomi', flat=True).distinct()
    teachers = Foydalanuvchilar.objects.filter(
        Q(ism__icontains=query) | Q(familiya__icontains=query) | Q(sharifi__icontains=query)
    ).annotate(
        videolar_soni=Count('video_darslar', filter=Q(video_darslar__foreveryone=True), distinct=True),
        maqolalar_soni=Count('ilmiy_ishlari', filter=Q(ilmiy_ishlari__foreveryone=True), distinct=True),
        kitoblar_soni=Count('oquvishlari', filter=Q(oquvishlari__foreveryone=True), distinct=True),
    )
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
            tugulgan_sana=tugulgan_sana or '2000-01-01',
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
    maqolalar = ilmiy.objects.filter(foreveryone=True).order_by('-sana')
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
    maqolalar = ilmiy.objects.filter(
        Q(foreveryone=True),
        Q(nomi__icontains=query) | Q(muallif__ism__icontains=query) | Q(muallif__familiya__icontains=query) | Q(muallif__sharifi__icontains=query) | Q(ish_mualliflari__icontains=query) | Q(haqida__icontains=query) | Q(muallif__kafedra__nomi__icontains=query)
    ).distinct().order_by('-sana')
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
    kitoblar = oquvIshlari.objects.filter(foreveryone=True).order_by('-sana')
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
    kitoblar = oquvIshlari.objects.filter(
        Q(foreveryone=True),
        Q(nomi__icontains=query) | Q(muallif__ism__icontains=query) | Q(muallif__familiya__icontains=query) | Q(muallif__sharifi__icontains=query) | Q(ish_mualliflari__icontains=query) | Q(haqida__icontains=query) | Q(muallif__kafedra__nomi__icontains=query)
    ).distinct().order_by('-sana')
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
    return redirect(video.video.url)