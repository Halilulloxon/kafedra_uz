"""Google orqali kirish uchun kichik yordamchi (OAuth 2.0 authorization code).

Qo'shimcha kutubxona talab qilmaydi — faqat Python'ning o'z urllib'i.
Kalitlar "first project/.env" faylidan olinadi:

    GOOGLE_CLIENT_ID=...apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=...

Google Cloud Console → APIs & Services → Credentials → OAuth client ID
(Web application) da "Authorized redirect URIs" ro'yxatiga quyidagilar
qo'shilgan bo'lishi shart:

    http://localhost:8000/google/callback/
    https://kafedralar.uz/google/callback/
"""

import json
import secrets
import urllib.error
import urllib.parse
import urllib.request

from django.conf import settings
from django.urls import reverse

AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth'
TOKEN_URL = 'https://oauth2.googleapis.com/token'
USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo'
SCOPE = 'openid email profile'
TIMEOUT = 15


class GoogleXato(Exception):
    """Google bilan bog'lanishda yuzaga kelgan xatolik."""


def _kalit(nom):
    """.env dagi kalit. Namuna matn ("...") yozib qoldirilgan bo'lsa — bo'sh."""
    qiymat = (getattr(settings, nom, '') or '').strip()
    if '...' in qiymat or len(qiymat) < 15:
        return ''
    return qiymat


def client_id():
    return _kalit('GOOGLE_CLIENT_ID')


def client_secret():
    return _kalit('GOOGLE_CLIENT_SECRET')


def sozlangan():
    return bool(client_id() and client_secret())


def qaytish_manzili(request):
    """Google qaytib keladigan to'liq manzil (.env dagi qiymat ustun turadi)."""
    if settings.GOOGLE_REDIRECT_URI:
        return settings.GOOGLE_REDIRECT_URI
    return request.build_absolute_uri(reverse('google_callback'))


def kirish_manzili(request, state):
    """Foydalanuvchi yuboriladigan Google sahifasi manzili."""
    parametrlar = {
        'client_id': client_id(),
        'redirect_uri': qaytish_manzili(request),
        'response_type': 'code',
        'scope': SCOPE,
        'state': state,
        'access_type': 'online',
        'include_granted_scopes': 'true',
        'prompt': 'select_account',
    }
    return AUTH_URL + '?' + urllib.parse.urlencode(parametrlar)


def yangi_state():
    return secrets.token_urlsafe(24)


def _sorov(manzil, data=None, sarlavhalar=None):
    so_rov = urllib.request.Request(manzil, data=data, headers=sarlavhalar or {})
    try:
        with urllib.request.urlopen(so_rov, timeout=TIMEOUT) as javob:
            return json.loads(javob.read().decode('utf-8'))
    except urllib.error.HTTPError as xato:
        matn = xato.read().decode('utf-8', 'replace')[:300]
        raise GoogleXato('Google javobi: %s %s' % (xato.code, matn))
    except (urllib.error.URLError, ValueError, TimeoutError) as xato:
        raise GoogleXato('Google bilan bog\'lanib bo\'lmadi: %s' % xato)


def token_olish(request, code):
    """Authorization code'ni access token'ga almashtiramiz."""
    data = urllib.parse.urlencode({
        'code': code,
        'client_id': client_id(),
        'client_secret': client_secret(),
        'redirect_uri': qaytish_manzili(request),
        'grant_type': 'authorization_code',
    }).encode('utf-8')

    javob = _sorov(TOKEN_URL, data, {
        'Content-Type': 'application/x-www-form-urlencoded',
    })
    token = javob.get('access_token')
    if not token:
        raise GoogleXato('Google access token bermadi.')
    return token


def profil_olish(access_token):
    """Google hisobidagi ism, familiya, email va rasm."""
    malumot = _sorov(USERINFO_URL, None, {
        'Authorization': 'Bearer ' + access_token,
    })

    email = (malumot.get('email') or '').strip().lower()
    if not email:
        raise GoogleXato('Google hisobida email topilmadi.')
    if not malumot.get('email_verified'):
        raise GoogleXato('Bu Google hisobining emaili tasdiqlanmagan.')

    return {
        'email': email,
        'ism': (malumot.get('given_name') or '').strip(),
        'familiya': (malumot.get('family_name') or '').strip(),
        'toliq_ism': (malumot.get('name') or '').strip(),
        'rasm': malumot.get('picture') or '',
    }


def rasm_yuklab_olish(manzil, eng_kop_bayt=3 * 1024 * 1024):
    """Google profil rasmini yuklab olamiz. Xato bo'lsa — None."""
    if not manzil.startswith('https://'):
        return None
    try:
        with urllib.request.urlopen(manzil, timeout=TIMEOUT) as javob:
            turi = (javob.headers.get('Content-Type') or '').lower()
            if not turi.startswith('image/'):
                return None
            baytlar = javob.read(eng_kop_bayt + 1)
    except Exception:
        return None

    if not baytlar or len(baytlar) > eng_kop_bayt:
        return None

    kengaytma = {
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
    }.get(turi.split(';')[0].strip(), '.jpg')
    return baytlar, kengaytma
