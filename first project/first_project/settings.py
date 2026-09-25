"""
Django settings for first_project project.

Based on 'django-admin startproject' using Django 2.1.2.

For more information on this file, see
https://docs.djangoproject.com/en/2.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.1/ref/settings/
"""

import os
import posixpath
import secrets

from django.core.exceptions import ImproperlyConfigured

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Maxfiy sozlamalar "first project/.env" faylidan o'qiladi (namuna: .env.example)
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(BASE_DIR, '.env'))
except ImportError:
    pass



def env_list(name, default=''):
    return [item.strip() for item in os.getenv(name, default).split(',') if item.strip()]


# SECURITY WARNING: don't run with debug turned on in production!
# Sukut bo'yicha o'chiq: .env unutilgan serverda xatoliklar sahifasi
# sozlamalarni va so'rov ma'lumotlarini ko'rsatib qo'ymasin.
DEBUG = os.getenv('DJANGO_DEBUG', 'False') == 'True'

# SECURITY WARNING: keep the secret key used in production secret!
# Kalit faqat .env dan olinadi. Kodda zaxira kalit turmaydi — u ochiq
# repozitoriyda yotgani uchun sessiyalarni soxtalashtirishga yo'l ochardi.
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', '')
if not SECRET_KEY:
    if not DEBUG:
        raise ImproperlyConfigured(
            "DJANGO_SECRET_KEY \"first project/.env\" faylida ko'rsatilmagan. "
            "Yangi kalit yaratish: "
            "python -c \"import secrets; print(secrets.token_urlsafe(50))\""
        )
    # Lokal ish uchun vaqtinchalik kalit (server qayta ishga tushganda
    # yangilanadi, ya'ni sessiyalar uziladi — .env ga o'z kalitingizni yozing).
    SECRET_KEY = secrets.token_urlsafe(50)

# Faqat .env da sanab o'tilgan manzillar. Ilgari ro'yxatga '*' qo'shilardi,
# ya'ni har qanday Host sarlavhasi qabul qilinardi.
ALLOWED_HOSTS = env_list('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1')
if DEBUG:
    # Lokal sinov: ngrok yoki telefondan IP orqali kirish uchun
    ALLOWED_HOSTS.append('*')

# Application references
# https://docs.djangoproject.com/en/2.1/ref/settings/#std:setting-INSTALLED_APPS
INSTALLED_APPS = [
    # Add your apps here to enable them
    'app.apps.YourAppConfig',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

# Middleware framework
# https://docs.djangoproject.com/en/2.1/topics/http/middleware/
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'first_project.urls'

# Template configuration
# https://docs.djangoproject.com/en/2.1/topics/templates/
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'app.context_processors.google_sozlamalari',
            ],
        },
    },
]

WSGI_APPLICATION = 'first_project.wsgi.application'
# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases
_db_engine = os.getenv('DB_ENGINE', '')
if not _db_engine:
    if os.getenv('DB_NAME'):
        try:
            import MySQLdb  # noqa
            _db_engine = 'django.db.backends.mysql'
        except ImportError:
            _db_engine = 'django.db.backends.sqlite3'
    else:
        _db_engine = 'django.db.backends.sqlite3'

if _db_engine == 'django.db.backends.mysql':
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': os.getenv('DB_NAME', 'myproject'),
            'USER': os.getenv('DB_USER', 'root'),
            'PASSWORD': os.getenv('DB_PASSWORD', ''),
            'HOST': os.getenv('DB_HOST', 'localhost'),
            'PORT': os.getenv('DB_PORT', '3306'),
            'OPTIONS': {'charset': 'utf8mb4'},
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        }
    }



# Password validation
# https://docs.djangoproject.com/en/2.1/ref/settings/#auth-password-validators
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/
# Admin paneli va Django xabarlari o'zbek tilida chiqadi
LANGUAGE_CODE = 'uz'

# Django'ning o'zbekcha tarjimasi to'liq emas — yetishmaganlari
# "locale/uz" dan olinadi (yangilash: scripts/tarjima.py)
LOCALE_PATHS = [os.path.join(BASE_DIR, 'locale')]

# Sana formatlari: dd.mm.yyyy (masalan: 17.08.1983)
DATE_FORMAT = 'd.m.Y'
DATE_INPUT_FORMATS = [
    '%d.%m.%Y',
    '%Y-%m-%d',
    '%d/%m/%Y',
]
FORMAT_MODULE_PATH = ['first_project.formats']
TIME_ZONE = 'Asia/Tashkent'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True

EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]


CSRF_TRUSTED_ORIGINS = [
    'https://*.ngrok-free.app',
    'https://*.ngrok-free.dev',
    'https://*.ngrok.io',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
] + env_list('DJANGO_CSRF_TRUSTED_ORIGINS')

# Serverda SSL (https) o'rnatilgandan keyin .env da DJANGO_HTTPS=True qiling
if os.getenv('DJANGO_HTTPS', 'False') == 'True':
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True


# --- Google orqali kirish (OAuth 2.0) ---
# Kalitlar Google Cloud Console → APIs & Services → Credentials da olinadi
# va "first project/.env" fayliga yoziladi. Bo'sh bo'lsa, tugma ko'rinmaydi.
GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', '')
GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', '')
# Odatda bo'sh qoldiriladi — manzil so'rovdan avtomatik yasaladi.
# Kerak bo'lsa: https://kafedralar.uz/google/callback/
GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI', '')
