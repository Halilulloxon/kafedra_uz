"""
Definition of views.
"""

from datetime import datetime
from math import e
from webbrowser import get
from django.shortcuts import render, get_object_or_404,redirect
from django.http import HttpRequest
from .forms import IlmiyForm, Oquv, OquvForm , VideoForm
from .models import Foydalanuvchilar, oquvIshlari, ilmiy_ishlari as ilmiy , ilmiy_ishlari as ilmiy_a, Kafedralar, video_darslar as videolar, Dekanatlar
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth import logout
from django.contrib import messages
from datetime import datetime
from django.contrib.auth.hashers import check_password
from django.db.models import Q, Count
import os
from django.http import HttpResponse, FileResponse
from django.conf import settings
from django.shortcuts import get_object_or_404
from .models import video_darslar as VideoModel  

def login_view(request):
    if request.method == 'POST':
        login = request.POST.get('login_f')
        password = request.POST.get('password')

        try:
            user = Foydalanuvchilar.objects.get(login_f=login)
        except Foydalanuvchilar.DoesNotExist:
            user = None

        if user is None:
            messages.error(request, 'Login yoki parol xato!')

        elif user.parol == password and user.accepted == True:
            request.session['user_id'] = user.id
            request.session['username'] = user.login_f

            if user.foydalanuvchi_rol == 'kafedra mudiri':
                return redirect('home2')
            elif user.foydalanuvchi_rol == 'dekan':
                return redirect('home3')
            else:
                return redirect('home1')

        elif not user.accepted:
            messages.warning(
                request,
                'Sizning hisobingiz hali tasdiqlanmagan. Iltimos, administrator tasdiqlashini kuting. '
                '<a href="mailto:halilullohayotullo0608@gmail.com">halilullohayotullo0608@gmail.com</a> '
                'Admin tasdiqlagandan keyin email orqali xabar yuboriladi.'
            )

        else:
            messages.error(request, 'Login yoki parol xato!')

    return render(request, 'app/login.html', {'year': datetime.now().year})
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
def home1(request):
    user_id = request.session.get('user_id')
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    maqolalar_soni=ilmiy.objects.filter(muallif_id=foydalanuvchi.id, turi='maqola').count()
    scopuslar_soni=ilmiy.objects.filter(muallif_id=foydalanuvchi.id, turi='scopus').count()
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
    """Renders the home page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/profil.html',
        {
            'title':'Home Page',
            'foydalanuvchi':foydalanuvchi,
            'year':datetime.now().year,
            'maqolalar_soni':maqolalar_soni,
            'scopuslar_soni':scopuslar_soni,
            'oquv_soni':oquv_soni,
            'jami':jami,
            'oy_o':[yanvar_o, fevral_o, mart_o, aprel_o, may_o, iyun_o, iyul_o, avgust_o, sentabr_o, oktabr_o, noyabr_o, dekabr_o],
            'oy_i':[yanvar_i, fevral_i, mart_i, aprel_i, may_i, iyun_i, iyul_i, avgust_i, sentabr_i, oktabr_i, noyabr_i, dekabr_i],

        }
    )
def home2(request):
    user_id = request.session.get('user_id')
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    maqolalar_soni=0
    scopuslar_soni=0
    oquv_soni=0
    ilmiy_soni=0
    for muallif in Foydalanuvchilar.objects.filter(kafedra = foydalanuvchi.kafedra):
        maqolalar_soni+=ilmiy.objects.filter(muallif_id=muallif.id, turi='maqola').count()
        scopuslar_soni+=ilmiy.objects.filter(muallif_id=muallif.id, turi='scopus').count()
        oquv_soni+= oquvIshlari.objects.filter(muallif_id=muallif.id).count()
        ilmiy_soni+= ilmiy.objects.filter(muallif_id=muallif.id).count()
    jami= oquv_soni+ilmiy_soni
    """Renders the home page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/profil2.html',
        {
            'title':'Home Page',
            'foydalanuvchi':foydalanuvchi,
            'year':datetime.now().year,
            'maqolalar_soni':maqolalar_soni,
            'scopuslar_soni':scopuslar_soni,
            'oquv_soni':oquv_soni,
            'jami':jami,    
        }
    )
def home3(request):
    user_id = request.session.get('user_id')
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    maqolalar_soni=0
    scopuslar_soni=0
    oquv_soni=0
    ilmiy_soni=0
    for kafedra_f in Kafedralar.objects.filter(fakultet=foydalanuvchi.fakulteti):
        for muallif in Foydalanuvchilar.objects.filter(kafedra=kafedra_f):
            maqolalar_soni+=ilmiy.objects.filter(muallif_id=muallif.id, turi='maqola').count()
            scopuslar_soni+=ilmiy.objects.filter(muallif_id=muallif.id, turi='scopus').count()
            oquv_soni+= oquvIshlari.objects.filter(muallif_id=muallif.id).count()
            ilmiy_soni+= ilmiy.objects.filter(muallif_id=muallif.id).count()
    jami=oquv_soni+ilmiy_soni
    """Renders the home page."""
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/profil3.html',
        {
            'title':'Home Page',
            'foydalanuvchi':foydalanuvchi,
            'year':datetime.now().year,
            'maqolalar_soni':maqolalar_soni,
            'scopuslar_soni':scopuslar_soni,
            'oquv_soni':oquv_soni,
            'jami':jami,
        }
    )
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
def profile(request, user_id):
    
    assert isinstance(request, HttpRequest)
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    maqolalar_soni=ilmiy.objects.filter(muallif_id=foydalanuvchi.id, turi='maqola').count()
    scopuslar_soni=ilmiy.objects.filter(muallif_id=foydalanuvchi.id, turi='scopus').count()
    oquv_soni= oquvIshlari.objects.filter(muallif_id=foydalanuvchi.id).count()
    ilmiy_soni= ilmiy.objects.filter(muallif_id=foydalanuvchi.id).count() 
    jami=oquv_soni+ilmiy_soni
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
    return render(
        request,
        'app/profil.html',
        {
            'foydalanuvchi':foydalanuvchi,
            'title':'About',
            'message':'Your application description page.',
            'year':datetime.now().year,
            'maqolalar_soni':maqolalar_soni,
            'scopuslar_soni':scopuslar_soni,
            'oquv_soni':oquv_soni,
            'jami':jami,
            'oy_o':[yanvar_o, fevral_o, mart_o, aprel_o, may_o, iyun_o, iyul_o, avgust_o, sentabr_o, oktabr_o, noyabr_o, dekabr_o],
            'oy_i':[yanvar_i, fevral_i, mart_i, aprel_i, may_i, iyun_i, iyul_i, avgust_i, sentabr_i, oktabr_i, noyabr_i, dekabr_i],
            
           
        }
    )
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
def qoshish_oquv(request, user_id):
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    assert isinstance(request, HttpRequest)
    if request.method=="POST":
        turi=request.POST.get("turi")
        nomi=request.POST.get("nomi")
        haqida=request.POST.get("haqida")
        sana=request.POST.get("sana")
        muallif_id=request.POST.get("muallif")
        ish_mualliflari=request.POST.get("ish_mualliflari")
        betlar_soni=request.POST.get("betlar_soni")
        fayl=request.FILES.get("fayl")
        muallif=Foydalanuvchilar.objects.get(id=muallif_id)
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
def qoshish_ilmiy(request, user_id):
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    assert isinstance(request, HttpRequest)
    if request.method=="POST":
        turi=request.POST.get("turi")
        nomi=request.POST.get("nomi")
        sana=request.POST.get("sana")
        muallif_id=request.POST.get("muallif")
        haqida=request.POST.get("haqida")
        ish_mualliflari=request.POST.get("ish_mualliflari")
        kategoriya=request.POST.get("kategoriya")
        fayl=request.FILES.get("fayl")
        muallif=Foydalanuvchilar.objects.get(id=muallif_id)
        foreveryone = request.POST.get("foreveryone") == "on"
        yangi=ilmiy(turi=turi,nomi=nomi,sana=sana,muallif=muallif, ish_mualliflari=ish_mualliflari ,kategoriya=kategoriya,fayl=fayl, haqida=haqida, foreveryone=foreveryone)
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
def ochir(request, j_id, user_id):
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
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
def ochirish(request, i_id, j_id, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    if request.method=="POST" and j_id==1:
        maqola=oquvIshlari.objects.filter(muallif_id=foydalanuvchi.id)
        turi=oquvIshlari.objects.filter(muallif_id=foydalanuvchi.id).values_list('turi', flat=True).distinct()
        ish_muallifiy= oquvIshlari.objects.filter(muallif_id=foydalanuvchi.id).values_list('ish_mualliflari', flat=True).distinct()
        ish_muallifi = []
        for qator in ish_muallifiy:
            if qator: 
                ish_muallifi.extend([m.strip() for m in qator.split(',')])
                ish_muallifi = list(set(ish_muallifi))
        ochir=get_object_or_404(oquvIshlari, id=i_id)
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
        ochir=get_object_or_404(ilmiy, id=i_id)
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
from django.db.models import Min


def _get_ish_muallifi_list(qs_values):
    result = set()
    for qator in qs_values:
        if qator:
            result.update(m.strip() for m in qator.split(','))
    return sorted(result)


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
def tahrirlash_ilmiy(request, i_id, t_id, user_id):
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)

    if t_id == 1:
        model = ilmiy_a
        form_class = IlmiyForm
        
    else:
        model = oquvIshlari
        form_class = OquvForm

    ilmiy = get_object_or_404(model, id=i_id)

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

def profile2(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    maqolalar_soni=0
    scopuslar_soni=0
    oquv_soni=0
    ilmiy_soni=0
    for muallif in Foydalanuvchilar.objects.filter(kafedra = foydalanuvchi.kafedra):
        maqolalar_soni+=ilmiy.objects.filter(muallif_id=muallif.id, turi='maqola').count()
        scopuslar_soni+=ilmiy.objects.filter(muallif_id=muallif.id, turi='scopus').count()
        oquv_soni+= oquvIshlari.objects.filter(muallif_id=muallif.id).count()
        ilmiy_soni+= ilmiy.objects.filter(muallif_id=muallif.id).count()
    jami=oquv_soni+ilmiy_soni
    return render(
        request,
        'app/profil2.html',
        {
            'foydalanuvchi':foydalanuvchi,
            'title':'About',
            'message':'Your application description page.',
            'year':datetime.now().year,
            'maqolalar_soni':maqolalar_soni,
            'scopuslar_soni':scopuslar_soni,
            'oquv_soni':oquv_soni,
            'jami':jami,
        }
    )
def profile3(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    maqolalar_soni=0
    scopuslar_soni=0
    oquv_soni=0
    ilmiy_soni=0
    for kafedra_f in Kafedralar.objects.filter(fakultet=foydalanuvchi.fakulteti):
        for muallif in Foydalanuvchilar.objects.filter(kafedra=kafedra_f):
            maqolalar_soni+=ilmiy.objects.filter(muallif_id=muallif.id, turi='maqola').count()
            scopuslar_soni+=ilmiy.objects.filter(muallif_id=muallif.id, turi='scopus').count()
            oquv_soni+= oquvIshlari.objects.filter(muallif_id=muallif.id).count()
            ilmiy_soni+= ilmiy.objects.filter(muallif_id=muallif.id).count()
    jami=oquv_soni+ilmiy_soni
    return render(
        request,
        'app/profil3.html',
        {
            'foydalanuvchi':foydalanuvchi,
            'title':'About',
            'message':'Your application description page.',
            'year':datetime.now().year,
            'maqolalar_soni':maqolalar_soni,
            'scopuslar_soni':scopuslar_soni,
            'oquv_soni':oquv_soni,
            'jami':jami,
        }
    )
from django.db.models import Min


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
    return render(
        request,
        'app/login.html'
    )


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

def logout(request):
    assert isinstance(request, HttpRequest)
    return render(
        request,
        'app/login.html'
    )
def profillarni_tahrirlash(request, user_id):
    foydalanuvchi = Foydalanuvchilar.objects.get(id=user_id)
    if request.method == "POST":
        ism = request.POST.get("ism")
        familiya = request.POST.get("familiya")
        otasining_ismi = request.POST.get("otasining_ismi")
        ilmiy_daraja = request.POST.get("ilmiy_daraja")
        gmail = request.POST.get("gmail")
        haqida = request.POST.get("haqida")
        foydalanuvchi_rol = request.POST.get("foydalanuvchi_rol")
        fakulteti_id = request.POST.get("fakultet")
        kafedra_id = request.POST.get("kafedra")
        image = request.FILES.get("image")
        login_f = request.POST.get("login_f")
        parol = request.POST.get("parol")

        foydalanuvchi.ism = ism
        foydalanuvchi.familiya = familiya
        foydalanuvchi.sharifi = otasining_ismi
        foydalanuvchi.ilmiy_daraja = ilmiy_daraja
        foydalanuvchi.gmail = gmail
        foydalanuvchi.haqida = haqida
        foydalanuvchi.foydalanuvchi_rol = foydalanuvchi_rol
        foydalanuvchi.login_f = login_f
        if parol:
            foydalanuvchi.set_password(parol)
        

        if fakulteti_id:
            foydalanuvchi.fakulteti = Dekanatlar.objects.get(id=fakulteti_id)
        else:
            foydalanuvchi.fakulteti = None

        if kafedra_id:
            foydalanuvchi.kafedra = Kafedralar.objects.get(id=kafedra_id)
        else:
            foydalanuvchi.kafedra = None

        if image:
            foydalanuvchi.image = image

        foydalanuvchi.save()

    kafedralar = Kafedralar.objects.all()
    fakultetlar = Dekanatlar.objects.all()
    foydalanuvchi_rollari = Foydalanuvchilar.ROLES

    return render(
        request,
        'app/profil.html',
        {
            'foydalanuvchi': foydalanuvchi,
            'kafedralar': kafedralar,
            'fakultetlar': fakultetlar,
            'foydalanuvchi_rollari': foydalanuvchi_rollari,
            'title': 'About',
            'message': 'Your application description page.',
            'year': datetime.now().year,
        }
    )

def profil_tahrir(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
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
    oqituvchilar_soni=Foydalanuvchilar.objects.filter(foydalanuvchi_rol='oqituvchi').count()
    video_darslar_soni=videolar.objects.filter(foreveryone=True).count()
    maqolalar_soni=ilmiy.objects.filter(turi='maqola', foreveryone=True).count()+ilmiy.objects.filter(turi='scopus', foreveryone=True).count()
    kitoblar_soni=oquvIshlari.objects.filter(foreveryone=True).count()
    return render(
        request,
        'app/index.html',
        {
            'title':'Home Page',
            'message':'Your application description page.',
            'year':datetime.now().year,
            'oqituvchilar_soni':oqituvchilar_soni,
            'video_darslar_soni':video_darslar_soni,
            'maqolalar_soni':maqolalar_soni,
            'kitoblar_soni':kitoblar_soni,
        }
    )
def teachers(request):
    assert isinstance(request, HttpRequest)
    teachers=Foydalanuvchilar.objects.all()
    total_maqolalar=ilmiy.objects.filter(foreveryone=True).count()
    total_kitoblar=oquvIshlari.objects.filter(foreveryone=True).count()
    total_videolar=videolar.objects.filter(foreveryone=True).count()
    for teacher in teachers:
        teacher.videolar_soni=videolar.objects.filter(muallif_id=teacher.id, foreveryone=True).count()
        teacher.maqolalar_soni=ilmiy.objects.filter(muallif_id=teacher.id, foreveryone=True).count()
        teacher.kitoblar_soni=oquvIshlari.objects.filter(muallif_id=teacher.id, foreveryone=True).count()
    return render(
        request,
        'app/teachers.html',
        {
            'teachers':teachers,
            'total_kitoblar':total_kitoblar,
            'total_maqolalar':total_maqolalar,
            'total_videolar':total_videolar,
            'title':'Teachers',
            'message':'Your application description page.',
            'year':datetime.now().year,
        }
    )
def teacher1(request, id):
    assert isinstance(request, HttpRequest)
    teacher=Foydalanuvchilar.objects.get(id=id)
    maqolalar=ilmiy.objects.filter(muallif_id=teacher.id, foreveryone=True, turi='maqola').union(ilmiy.objects.filter(muallif_id=teacher.id, foreveryone=True, turi='scopus'))[:5]
    kitoblar=oquvIshlari.objects.filter(muallif_id=teacher.id, foreveryone=True)[:5]
    video=videolar.objects.filter(muallif_id=teacher.id, foreveryone=True)[:5]
    return render(
        request,
        'app/teacher1.html',
        {
            'video':video,
            'teacher':teacher,
            'maqolalar':maqolalar,
            'kitoblar':kitoblar,
            'title':'Teacher1',
            'message':'Your application description page.',
            'year':datetime.now().year,
        }
    )
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
def tahrirlash_video(request, v_id, user_id):
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    video=get_object_or_404(videolar, id=v_id)
    if request.method=="POST":
        form=VideoForm(request.POST, request.FILES, instance=video)
        if form.is_valid():
            form.save()
            return render(request, 'app/video_darslar.html', {
                'videolar':videolar.objects.filter(muallif_id=user_id),
                'foydalanuvchi':foydalanuvchi,
                'title':'Video Darslar',
                'message':'Your video_darslar page.',
                'year':datetime.now().year,
            })
    else:
        form=VideoForm(instance=video)
        return render(request, 'app/tahrirlash_video.html', {
        'form': form,
        'video': video,
        'foydalanuvchi':foydalanuvchi,
    })

def qoshish_video(request, user_id):
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    if request.method=="POST":
        form=VideoForm(request.POST, request.FILES)
        if form.is_valid():
            video=form.save(commit=False)
            video.muallif_id=user_id
            video.save()
            return render(request, 'app/video_darslar.html', {
                'videolar':videolar.objects.filter(muallif_id=user_id),
                'foydalanuvchi':foydalanuvchi,
                'title':'Video Darslar',
                'message':'Your video_darslar page.',
                'year':datetime.now().year,
            })
    else:
        form=VideoForm()
        return render(request, 'app/video_qoshish.html', {
        'form': form,
        'foydalanuvchi':foydalanuvchi,
    })
def ochirish_video(request, user_id):
    assert isinstance(request, HttpRequest)
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    ochir=videolar.objects.filter(muallif_id=user_id)
    return render(request, 'app/ochir_video.html', {
        'ochir': ochir,
        'foydalanuvchi':foydalanuvchi,
    })
def ochir_video(request, v_id, user_id):
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    video=get_object_or_404(videolar, id=v_id)
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
def video_filtrlash(request, user_id):
    foydalanuvchi=Foydalanuvchilar.objects.get(id=user_id)
    start = request.GET.get('from')
    end = request.GET.get('to')
    data = videolar.objects.filter(muallif_id=user_id)
    if start and end:
        data = data.filter(sana__range=[start, end], muallif_id=user_id)
    return render(request, 'app/video_darslar.html', {'videolar': data, 'foydalanuvchi':foydalanuvchi})
def qidirish(request):
    teachers=Foydalanuvchilar.objects.all()
    query = request.GET.get('q', '')
    teachers = teachers.filter(
        Q(ism__icontains=query) | Q(familiya__icontains=query) | Q(sharifi__icontains=query)
    )
    for teacher in teachers:
        teacher.videolar_soni=videolar.objects.filter(muallif_id=teacher.id, foreveryone=True).count()
        teacher.maqolalar_soni=ilmiy.objects.filter(muallif_id=teacher.id, foreveryone=True).count()
        teacher.kitoblar_soni=oquvIshlari.objects.filter(muallif_id=teacher.id, foreveryone=True).count()
    return render(request, 'app/teachers.html', {'teachers': teachers, 'query': query})
from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Foydalanuvchilar, Kafedralar, Dekanatlar

def get_kafedralar(request, fakultet_id):
    kafedralar = Kafedralar.objects.filter(fakultet_id=fakultet_id)
    data = list(kafedralar.values('id', 'nomi'))
    return JsonResponse({'kafedralar': data})


def registratsiya(request):
    ROLES = Foydalanuvchilar.ROLES
    if request.method == "POST":
        ism = request.POST.get("ism")
        familiya = request.POST.get("familiya")
        otasining_ismi = request.POST.get("otasining_ismi")
        ilmiy_daraja = request.POST.get("ilmiy_daraja")
        foydalanuvchi_rol = request.POST.get("foydalanuvchi_rol")
        kafedra = request.POST.get("kafedra")
        fakultet = request.POST.get("fakultet")
        tugulgan_sana = request.POST.get("tugulgan_sana")
        gmail = request.POST.get("gmail")
        haqida = request.POST.get("haqida")
        image = request.FILES.get("image")
        login_f = request.POST.get("login_f")
        parol = request.POST.get("parol")
        parolni_tasdiqlang = request.POST.get("parolni_tasdiqlang")

        if parol != parolni_tasdiqlang:
            return render(request, 'app/registratsiya.html', {
                'error': 'Parollar mos kelmadi!',
                'fakultetlar': Dekanatlar.objects.all(),
                'foydalanuvchi_rollari': ROLES
            })

        if Foydalanuvchilar.objects.filter(login_f=login_f).exists():
            return render(request, 'app/registratsiya.html', {
                'error': 'Bu login allaqachon mavjud!',
                'fakultetlar': Dekanatlar.objects.all(),
                'foydalanuvchi_rollari': ROLES
            })

        foydalanuvchi = Foydalanuvchilar(
            ism=ism,
            familiya=familiya,
            sharifi=otasining_ismi,
            tugulgan_sana=tugulgan_sana,
            ilmiy_daraja=ilmiy_daraja,
            foydalanuvchi_rol=foydalanuvchi_rol,
            kafedra_id=kafedra,
            fakulteti_id=fakultet,
            gmail=gmail,
            haqida=haqida,
            image=image,
            login_f=login_f,
            parol=parol
        )
        foydalanuvchi.save()

        return render(request, 'app/login.html', {
            'success': 'Ro\'yxatdan muvaffaqiyatli o\'tildi! Iltimos, tizimga kiring.'
        })

    # GET request
    return render(request, 'app/registratsiya.html', {
        'fakultetlar': Dekanatlar.objects.all(),
        'foydalanuvchi_rollari': ROLES
    })
def article(request):
    maqolalar=ilmiy.objects.filter(turi='maqola', foreveryone=True).union(ilmiy.objects.filter(turi='scopus', foreveryone=True))
    top_mualliflar = Foydalanuvchilar.objects.annotate(
    maqola_soni=Count(
        'ilmiy_ishlari',
        filter=Q(
            ilmiy_ishlari__turi__in=['maqola', 'scopus'],
            ilmiy_ishlari__foreveryone=True
        )
    )
).order_by('-maqola_soni')[:5]
    return render(request, 'app/article.html', {
        'maqolalar': maqolalar,
        'top_mualliflar': top_mualliflar,
        'title':'Maqolalar',
        'message':'Your article page.',
        'year':datetime.now().year,
    })
def search_article(request):
    query = request.GET.get('q', '')
    maqolalar = ilmiy.objects.filter(
        Q(turi='maqola', foreveryone=True) | Q(turi='scopus', foreveryone=True),
        Q(nomi__icontains=query) | Q(muallif__ism__icontains=query) | Q(muallif__familiya__icontains=query) | Q(muallif__sharifi__icontains=query) | Q(ish_mualliflari__icontains=query) | Q(haqida__icontains=query) | Q(muallif__kafedra__nomi__icontains=query)
    ).distinct()
    top_mualliflar = Foydalanuvchilar.objects.annotate(
    maqola_soni=Count(
        'ilmiy_ishlari',
        filter=Q(
            ilmiy_ishlari__turi__in=['maqola', 'scopus'],
            ilmiy_ishlari__foreveryone=True
        )
    )
    ).order_by('-maqola_soni')[:5]
    return render(request, 'app/article.html', {'maqolalar': maqolalar, 'top_mualliflar':top_mualliflar,'query': query})
def book(request):
    kitoblar=oquvIshlari.objects.filter(foreveryone=True)
    top_mualliflar = Foydalanuvchilar.objects.annotate(
    kitob_soni=Count(
        'oquvishlari',
        filter=Q(
            oquvishlari__turi__in=['darslik', 'O`quv qo`llanma'],
            oquvishlari__foreveryone=True
        ))
).order_by('-kitob_soni')[:5]
    return render(request, 'app/book.html', {
        'kitoblar': kitoblar,
        'top_mualliflar': top_mualliflar,
        'title':'Kitoblar',
        'message':'Your book page.',
        'year':datetime.now().year,
    })
def search_book(request):
    query = request.GET.get('q','')
    kitoblar = oquvIshlari.objects.filter(
        Q(turi='darslik', foreveryone=True) | Q(turi='O`quv qo`llanma', foreveryone=True),
        Q(nomi__icontains=query) | Q(muallif__ism__icontains=query) | Q(muallif__familiya__icontains=query) | Q(muallif__sharifi__icontains=query) | Q(ish_mualliflari__icontains=query) | Q(haqida__icontains=query) | Q(muallif__kafedra__nomi__icontains=query)
    ).distinct()
    top_mualliflar = Foydalanuvchilar.objects.annotate(
    kitob_soni=Count(
        'oquvishlari',
        filter=Q(
            oquvishlari__turi__in=['darslik', 'O`quv qo`llanma'],
            oquvishlari__foreveryone=True
        )
    )
 ).order_by('-kitob_soni')[:5]
    return render(request, 'app/book.html', {'kitoblar':kitoblar, 'top_mualliflar':top_mualliflar,'query': query})
def video(request):
    video=videolar.objects.filter(foreveryone=True).order_by('-sana')
    top_mualliflar = Foydalanuvchilar.objects.annotate(
    video_soni=Count(
        'video_darslar',
        filter=Q(
            video_darslar__foreveryone=True
        )
    )
).order_by('-video_soni')[:5]
    return render(request, 'app/video.html', {
        'videolar': video,
        'top_mualliflar': top_mualliflar,
        'title':'Video Darslar',
        'message':'Your video page.',
        'year':datetime.now().year,
    })
def search_video(request):
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
    return render(request, 'app/video.html', {'videolar': video, 'top_mualliflar':top_mualliflar,'query': query})
def serve_video(request, video_id):
    video = get_object_or_404(videolar, id=video_id)
    file_path = video.video.path
    with open(file_path, 'rb') as f:
        response = HttpResponse(f.read(), content_type='video/mp4')
        response['Content-Disposition'] = f'inline; filename="{os.path.basename(file_path)}"'
        return response