import os
import sys
import django
from datetime import date

# Set settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'first_project.settings')
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.core.files.base import ContentFile
from app.models import (
    Foydalanuvchilar, Dekanatlar, Kafedralar,
    ilmiy_ishlari, oquvIshlari, video_darslar, KafedraTalablari
)

def seed():
    print("=== TEST DATABASE FULL SEEDING BOSHLANDI ===")

    # 1. Admin superuser
    admin_user, created = User.objects.get_or_create(username='admin')
    admin_user.is_staff = True
    admin_user.is_superuser = True
    admin_user.set_password('admin123')
    admin_user.save()
    print("Admin foydalanuvchi:", "Yaratildi" if created else "Yangilandi", "(login: admin, parol: admin123)")

    # 2. Fakultetlar (Dekanatlar)
    fak_ki, _ = Dekanatlar.objects.get_or_create(nomi="Kompyuter injiniringi fakulteti")
    fak_di, _ = Dekanatlar.objects.get_or_create(nomi="Dasturiy injiniring fakulteti")
    fak_kx, _ = Dekanatlar.objects.get_or_create(nomi="Kiberxavfsizlik fakulteti")

    # 3. Kafedralar
    kaf_at, _ = Kafedralar.objects.get_or_create(nomi="Axborot texnologiyalari kafedrasi", defaults={'fakultet': fak_ki})
    kaf_at.fakultet = fak_ki
    kaf_at.save()

    kaf_ai, _ = Kafedralar.objects.get_or_create(nomi="Sun'iy intellekt kafedrasi", defaults={'fakultet': fak_ki})
    kaf_ai.fakultet = fak_ki
    kaf_ai.save()

    kaf_dt, _ = Kafedralar.objects.get_or_create(nomi="Dasturiy ta'minot kafedrasi", defaults={'fakultet': fak_di})
    kaf_dt.fakultet = fak_di
    kaf_dt.save()

    kaf_kx, _ = Kafedralar.objects.get_or_create(nomi="Kiberxavfsizlik va tarmoqlar kafedrasi", defaults={'fakultet': fak_kx})
    kaf_kx.fakultet = fak_kx
    kaf_kx.save()

    # Link faculties to departments
    fak_ki.kafedralar.set([kaf_at, kaf_ai])
    fak_di.kafedralar.set([kaf_dt])
    fak_kx.kafedralar.set([kaf_kx])

    # 4. Foydalanuvchilar (Users)
    default_pass = make_password('12345')

    def create_or_update_user(login, rol, ism, familiya, sharifi, daraja, email, bdate, kafedra=None, fakultet=None):
        defaults = {
            'foydalanuvchi_rol': rol,
            'ism': ism,
            'familiya': familiya,
            'sharifi': sharifi,
            'ilmiy_daraja': daraja,
            'gmail': email,
            'tugulgan_sana': bdate,
            'parol': default_pass,
            'accepted': True,
            'kafedra': kafedra,
            'fakulteti': fakultet,
            'haqida': f"{ism} {familiya} {sharifi} - {daraja}, {rol}."
        }
        u, created = Foydalanuvchilar.objects.get_or_create(login_f=login, defaults=defaults)
        if not created:
            for k, v in defaults.items():
                setattr(u, k, v)
            u.save()
        return u

    # Prorektor
    prorektor = create_or_update_user(
        login='prorektor',
        rol='prorektor',
        ism='Aziz',
        familiya='Rahimov',
        sharifi='Karimovich',
        daraja='DSc, Professor',
        email='prorektor@univ.edu.uz',
        bdate=date(1975, 4, 12),
        kafedra=None,
        fakultet=None
    )

    # Dekanlar
    dekan_ki = create_or_update_user(
        login='dekan', # Alias
        rol='dekan',
        ism='Alisher',
        familiya='Alimov',
        sharifi='Akbarovich',
        daraja='PhD, Dotsent',
        email='dekan.ki@univ.edu.uz',
        bdate=date(1980, 8, 25),
        kafedra=None,
        fakultet=fak_ki
    )
    dekan_ki_2 = create_or_update_user(
        login='dekan_ki',
        rol='dekan',
        ism='Alisher',
        familiya='Alimov',
        sharifi='Akbarovich',
        daraja='PhD, Dotsent',
        email='dekan.ki@univ.edu.uz',
        bdate=date(1980, 8, 25),
        kafedra=None,
        fakultet=fak_ki
    )
    fak_ki.dekan = dekan_ki
    fak_ki.save()

    dekan_di = create_or_update_user(
        login='dekan_di',
        rol='dekan',
        ism='Botir',
        familiya='Umarov',
        sharifi='Zokirovich',
        daraja='PhD, Dotsent',
        email='dekan.di@univ.edu.uz',
        bdate=date(1982, 3, 15),
        kafedra=None,
        fakultet=fak_di
    )
    fak_di.dekan = dekan_di
    fak_di.save()

    # Kafedra Mudirlari
    mudir_at = create_or_update_user(
        login='mudir', # Alias
        rol='kafedra mudiri',
        ism='Javohir',
        familiya='Toshmatov',
        sharifi='Botirovich',
        daraja='PhD, Dotsent',
        email='mudir.at@univ.edu.uz',
        bdate=date(1983, 11, 20),
        kafedra=kaf_at,
        fakultet=fak_ki
    )
    mudir_at_2 = create_or_update_user(
        login='mudir_at',
        rol='kafedra mudiri',
        ism='Javohir',
        familiya='Toshmatov',
        sharifi='Botirovich',
        daraja='PhD, Dotsent',
        email='mudir.at@univ.edu.uz',
        bdate=date(1983, 11, 20),
        kafedra=kaf_at,
        fakultet=fak_ki
    )
    kaf_at.mudir = mudir_at
    kaf_at.save()

    mudir_ai = create_or_update_user(
        login='mudir_ai',
        rol='kafedra mudiri',
        ism='Jamshid',
        familiya='Saidov',
        sharifi='Anvarovich',
        daraja='DSc, Professor',
        email='mudir.ai@univ.edu.uz',
        bdate=date(1979, 6, 18),
        kafedra=kaf_ai,
        fakultet=fak_ki
    )
    kaf_ai.mudir = mudir_ai
    kaf_ai.save()

    mudir_dt = create_or_update_user(
        login='mudir_dt',
        rol='kafedra mudiri',
        ism='Dilshod',
        familiya='Mahmudov',
        sharifi='Rustamovich',
        daraja='PhD, Dotsent',
        email='mudir.dt@univ.edu.uz',
        bdate=date(1985, 2, 10),
        kafedra=kaf_dt,
        fakultet=fak_di
    )
    kaf_dt.mudir = mudir_dt
    kaf_dt.save()

    # O'qituvchilar (Teachers)
    teacher_sardor = create_or_update_user(
        login='teacher', # Alias
        rol='oqituvchi',
        ism='Sardor',
        familiya='Eshmatov',
        sharifi='Rustamovich',
        daraja='PhD, Katta o\'qituvchi',
        email='sardor.eshmatov@univ.edu.uz',
        bdate=date(1990, 5, 14),
        kafedra=kaf_at,
        fakultet=fak_ki
    )
    teacher_sardor_2 = create_or_update_user(
        login='teacher_sardor',
        rol='oqituvchi',
        ism='Sardor',
        familiya='Eshmatov',
        sharifi='Rustamovich',
        daraja='PhD, Katta o\'qituvchi',
        email='sardor.eshmatov@univ.edu.uz',
        bdate=date(1990, 5, 14),
        kafedra=kaf_at,
        fakultet=fak_ki
    )

    teacher_ali = create_or_update_user(
        login='teacher_ali',
        rol='oqituvchi',
        ism='Ali',
        familiya='Aliyev',
        sharifi='Aliyevich',
        daraja='PhD, Dotsent',
        email='ali.aliyev@univ.edu.uz',
        bdate=date(1987, 9, 21),
        kafedra=kaf_at,
        fakultet=fak_ki
    )

    teacher_vali = create_or_update_user(
        login='teacher_vali',
        rol='oqituvchi',
        ism='Vali',
        familiya='Valiyev',
        sharifi='Valiyevich',
        daraja='Katta o\'qituvchi',
        email='vali.valiyev@univ.edu.uz',
        bdate=date(1991, 12, 5),
        kafedra=kaf_at,
        fakultet=fak_ki
    )

    teacher_nodira = create_or_update_user(
        login='teacher_nodira',
        rol='oqituvchi',
        ism='Nodira',
        familiya='Karimova',
        sharifi='Shuhratovna',
        daraja='Assistent',
        email='nodira.karimova@univ.edu.uz',
        bdate=date(1995, 7, 30),
        kafedra=kaf_at,
        fakultet=fak_ki
    )

    teacher_jasur = create_or_update_user(
        login='teacher_jasur',
        rol='oqituvchi',
        ism='Jasur',
        familiya='Yusupov',
        sharifi='Baxtiyorovich',
        daraja='PhD, Katta o\'qituvchi',
        email='jasur.yusupov@univ.edu.uz',
        bdate=date(1989, 4, 18),
        kafedra=kaf_ai,
        fakultet=fak_ki
    )

    teacher_malika = create_or_update_user(
        login='teacher_malika',
        rol='oqituvchi',
        ism='Malika',
        familiya='Nazarova',
        sharifi='Tohirovna',
        daraja='Assistent',
        email='malika.nazarova@univ.edu.uz',
        bdate=date(1996, 10, 11),
        kafedra=kaf_ai,
        fakultet=fak_ki
    )

    teacher_bobur = create_or_update_user(
        login='teacher_bobur',
        rol='oqituvchi',
        ism='Bobur',
        familiya='Sodiqov',
        sharifi='Ilhomovich',
        daraja='PhD, Dotsent',
        email='bobur.sodiqov@univ.edu.uz',
        bdate=date(1986, 1, 22),
        kafedra=kaf_dt,
        fakultet=fak_di
    )

    # Set kafedra teachers
    kaf_at.oqituvchilar.set([mudir_at, teacher_sardor, teacher_ali, teacher_vali, teacher_nodira])
    kaf_ai.oqituvchilar.set([mudir_ai, teacher_jasur, teacher_malika])
    kaf_dt.oqituvchilar.set([mudir_dt, teacher_bobur])

    print("Foydalanuvchilar va kafedralar muvaffaqiyatli sozlandi.")

    # 5. Media fayllar uchun namuna PDF yaratish
    from django.conf import settings
    sample_pdf_rel = 'ilmiy_ishlari/namuna_hujjat.pdf'
    sample_pdf_full = os.path.join(settings.MEDIA_ROOT, sample_pdf_rel)
    os.makedirs(os.path.dirname(sample_pdf_full), exist_ok=True)
    if not os.path.exists(sample_pdf_full):
        with open(sample_pdf_full, 'wb') as f:
            f.write(b"%PDF-1.4 sample document content for testing")

    sample_oquv_rel = 'oquv_ishlari/namuna_kitob.pdf'
    sample_oquv_full = os.path.join(settings.MEDIA_ROOT, sample_oquv_rel)
    os.makedirs(os.path.dirname(sample_oquv_full), exist_ok=True)
    if not os.path.exists(sample_oquv_full):
        with open(sample_oquv_full, 'wb') as f:
            f.write(b"%PDF-1.4 sample book content for testing")

    # 6. Ilmiy ishlar (Scientific Publications)
    ilmiy_data = [
        # Case 1: Scopus with multiple co-authors across the department
        {
            'turi': 'Scopus',
            'nomi': 'Deep Learning Architectures for Real-Time Big Data Analytics in Smart Cities',
            'muallif': teacher_ali,
            'ish_mualliflari': 'Aliyev Ali Aliyevich, Valiyev Vali Valievich, Toshmatov Javohir Botirovich',
            'sana': date(2024, 2, 15),
            'haqida': 'Smart city sensorlaridan olinayotgan katta hajmdagi ma\'lumotlarni chuqur o\'rganish usullari orqali real vaqtda tahlil qilish algoritmi.',
            'kategoriya': 'Xalqaro',
            'fayl': sample_pdf_rel,
            'foreveryone': True,
            'maqola_link': 'https://doi.org/10.1016/j.smartsys.2024.1042',
            'dgu_raqami': ''
        },
        # Case 2: Deduplication scenario - Sardor uploaded as Maqola
        {
            'turi': 'Maqola',
            'nomi': 'Kiberxavfsizlikda neyron tarmoqlaridan foydalanish istiqbollari',
            'muallif': teacher_sardor,
            'ish_mualliflari': 'Eshmatov Sardor Rustamovich, Aliyev Ali Aliyevich',
            'sana': date(2024, 3, 10),
            'haqida': 'Axborot tizimlariga bo\'ladigan kiberhujumlarni neyron tarmoqlar yordamida aniqlash va oldini olish usullari.',
            'kategoriya': 'Respublika',
            'fayl': sample_pdf_rel,
            'foreveryone': True,
            'maqola_link': '',
            'dgu_raqami': ''
        },
        # Case 2 duplicate variant: Ali uploaded same title as Scopus with link
        {
            'turi': 'Scopus',
            'nomi': 'Kiberxavfsizlikda neyron tarmoqlaridan foydalanish istiqbollari',
            'muallif': teacher_ali,
            'ish_mualliflari': 'Aliyev Ali Aliyevich, Eshmatov Sardor Rustamovich',
            'sana': date(2024, 3, 20),
            'haqida': 'Neural network application in cybersecurity systems with deep packet inspection.',
            'kategoriya': 'Xalqaro',
            'fayl': sample_pdf_rel,
            'foreveryone': True,
            'maqola_link': 'https://doi.org/10.1109/ACCESS.2024.987654',
            'dgu_raqami': ''
        },
        # Case 3: EHM Guvohnoma
        {
            'turi': 'EHM guvohnomalar',
            'nomi': 'Talabalar davomatini yuzni tanish orqali avtomatlashtirilgan qayd etish dasturiy majmuasi',
            'muallif': teacher_vali,
            'ish_mualliflari': 'Valiyev Vali Valievich, Eshmatov Sardor Rustamovich',
            'sana': date(2024, 4, 18),
            'haqida': 'O\'quv jarayonida talabalar davomatini kameralar va sun\'iy intellekt yordamida avtomatik belgilash dasturi.',
            'kategoriya': 'Respublika',
            'fayl': sample_pdf_rel,
            'foreveryone': True,
            'maqola_link': '',
            'dgu_raqami': '№ DGU 2024 18452'
        },
        # Case 4: Patent
        {
            'turi': 'patent',
            'nomi': 'Aqlli qishloq xo\'jaligi uchun tuproq namligini optik tahlil qiluvchi qurilma',
            'muallif': mudir_at,
            'ish_mualliflari': 'Toshmatov Javohir Botirovich, Aliyev Ali Aliyevich',
            'sana': date(2023, 11, 25),
            'haqida': 'Tuproq holatini spektral tahlil qilish orqali sug\'orish tizimlarini avtomatlashtirilgan boshqarish ixtirosi.',
            'kategoriya': 'Respublika',
            'fayl': sample_pdf_rel,
            'foreveryone': True,
            'maqola_link': '',
            'dgu_raqami': '№ IAP 2023 0512'
        },
        # Case 5: OAK Respublika Maqola
        {
            'turi': 'Maqola',
            'nomi': 'Kriptografik algoritmlarning zamonaviy bank-moliya axborot tizimlaridagi samaradorligi',
            'muallif': teacher_nodira,
            'ish_mualliflari': 'Karimova Nodira Shuhratovna',
            'sana': date(2024, 5, 5),
            'haqida': 'Asimmetrik shifrlash usullari va ularning tranzaksiyalar tezligiga ta\'siri.',
            'kategoriya': 'Respublika',
            'fayl': sample_pdf_rel,
            'foreveryone': True,
            'maqola_link': 'https://journal.tuit.uz/articles/2024/05/crypto-efficiency',
            'dgu_raqami': ''
        },
        # Case 6: Tezis / Xalqaro Konferensiya
        {
            'turi': 'Tezis',
            'nomi': 'Sun\'iy intellekt texnologiyalarining tibbiy diagnostikadagi zamonaviy tendensiyalari',
            'muallif': teacher_jasur,
            'ish_mualliflari': 'Yusupov Jasur Baxtiyorovich, Saidov Jamshid Anvarovich',
            'sana': date(2024, 1, 28),
            'haqida': 'MRT va rentgen tasvirlarini tahlil qilishda konvolyutsion tarmoqlardan foydalanish.',
            'kategoriya': 'Xalqaro',
            'fayl': sample_pdf_rel,
            'foreveryone': True,
            'maqola_link': '',
            'dgu_raqami': ''
        },
        # Case 7: Sun'iy intellekt kafedrasi Scopus
        {
            'turi': 'Scopus',
            'nomi': 'Autonomous Robotic Path Planning Using Reinforcement Learning with Sparse Rewards',
            'muallif': mudir_ai,
            'ish_mualliflari': 'Saidov Jamshid Anvarovich, Yusupov Jasur Baxtiyorovich, Nazarova Malika Tohirovna',
            'sana': date(2024, 6, 12),
            'haqida': 'To\'siqlarga ega notekis muhitlarda robotlarning mustaqil harakat yo\'nalishini hisoblash usuli.',
            'kategoriya': 'Xalqaro',
            'fayl': sample_pdf_rel,
            'foreveryone': True,
            'maqola_link': 'https://doi.org/10.1007/s11042-024-18921-x',
            'dgu_raqami': ''
        },
        # Case 8: Dasturiy ta'minot kafedrasi Scopus
        {
            'turi': 'Scopus',
            'nomi': 'Microservices Architecture Optimization in High-Load Enterprise Systems',
            'muallif': teacher_bobur,
            'ish_mualliflari': 'Sodiqov Bobur Ilhomovich, Mahmudov Dilshod Rustamovich',
            'sana': date(2024, 4, 3),
            'haqida': 'Yuklama yuqori bo\'lgan korporativ tizimlarda mikroxizmatlararo aloqani tezlashtirish arxitekturasi.',
            'kategoriya': 'Xalqaro',
            'fayl': sample_pdf_rel,
            'foreveryone': True,
            'maqola_link': 'https://doi.org/10.1145/3612345.3612346',
            'dgu_raqami': ''
        }
    ]

    for item in ilmiy_data:
        obj, created = ilmiy_ishlari.objects.get_or_create(
            nomi=item['nomi'],
            muallif=item['muallif'],
            defaults=item
        )
        if not created:
            for k, v in item.items():
                setattr(obj, k, v)
            obj.save()

    print("Ilmiy ishlar muvaffaqiyatli saqlandi. Jami:", ilmiy_ishlari.objects.count())

    # 7. O'quv ishlari (Educational Works)
    oquv_data = [
        {
            'turi': 'Darslik',
            'nomi': 'Zamonaviy kompyuter tarmoqlari va axborot xavfsizligi asoslari',
            'muallif': mudir_at,
            'ish_mualliflari': 'Toshmatov Javohir Botirovich, Eshmatov Sardor Rustamovich',
            'sana': date(2023, 9, 1),
            'betlar_soni': 380,
            'haqida': 'Oliy ta\'lim muassasalari axborot texnologiyalari yo\'nalishlari talabalari uchun darslik.',
            'fayl': sample_oquv_rel,
            'foreveryone': True
        },
        {
            'turi': 'O`quv qo`llanma',
            'nomi': 'Python dasturlash tili: Ma\'lumotlar tahlili va mashinali o\'rganish',
            'muallif': teacher_ali,
            'ish_mualliflari': 'Aliyev Ali Aliyevich, Valiyev Vali Valievich',
            'sana': date(2024, 1, 15),
            'betlar_soni': 260,
            'haqida': 'NumPy, Pandas, Scikit-learn kutubxonalari bilan ishlash bo\'yicha amaliy qo\'llanma.',
            'fayl': sample_oquv_rel,
            'foreveryone': True
        },
        {
            'turi': 'Monografiya',
            'nomi': 'Bulutli hisoblashlar va taqsimlangan tizimlarda resurslarni boshqarish modellari',
            'muallif': mudir_ai,
            'ish_mualliflari': 'Saidov Jamshid Anvarovich',
            'sana': date(2023, 12, 10),
            'betlar_soni': 195,
            'haqida': 'Taqsimlangan hisoblash klasterlarida virtual mashinalarni optimallashtirish bo\'yicha monografiya.',
            'fayl': sample_oquv_rel,
            'foreveryone': True
        },
        {
            'turi': 'Uslubiy ko`rsatma',
            'nomi': 'Algoritmlar va ma\'lumotlar tuzilmasi fanidan laboratoriya ishlari to\'plami',
            'muallif': teacher_bobur,
            'ish_mualliflari': 'Sodiqov Bobur Ilhomovich, Mahmudov Dilshod Rustamovich',
            'sana': date(2024, 2, 20),
            'betlar_soni': 88,
            'haqida': 'Algoritmlarni loyihalash va baholash bo\'yicha amaliy topshiriqlar majmuasi.',
            'fayl': sample_oquv_rel,
            'foreveryone': True
        }
    ]

    for item in oquv_data:
        obj, created = oquvIshlari.objects.get_or_create(
            nomi=item['nomi'],
            muallif=item['muallif'],
            defaults=item
        )
        if not created:
            for k, v in item.items():
                setattr(obj, k, v)
            obj.save()

    print("O'quv ishlari muvaffaqiyatli saqlandi. Jami:", oquvIshlari.objects.count())

    # 8. Video darslar
    video_data = [
        {
            'nomi': 'Python dasturlash: 1-dars. O\'zgaruvchilar va ma\'lumot turlari',
            'muallif': teacher_ali,
            'haqida': 'Python dasturlash asoslari, o\'zgaruvchilar va ma\'lumot turlari bo\'yicha interaktiv dars.',
            'video_link': 'https://www.youtube.com/watch?v=rfscVS0vtbw',
            'sana': date(2024, 2, 10),
            'foreveryone': True
        },
        {
            'nomi': 'Mashinali o\'rganish asoslari: Neyron tarmoqlarning matematik modeli',
            'muallif': mudir_ai,
            'haqida': 'Sun\'iy neyron, gradient tushish va xatolik funksiyalarining amaliy tahlili.',
            'video_link': 'https://www.youtube.com/watch?v=aircAruvnKk',
            'sana': date(2024, 3, 5),
            'foreveryone': True
        },
        {
            'nomi': 'Axborot xavfsizligi: Tarmoq xavfsizligi va kriptografiya amaliyoti',
            'muallif': mudir_at,
            'haqida': 'Tarmoq trafigini himoyalash va shifrlash protokollari bo\'yicha video ma\'ruza.',
            'video_link': 'https://www.youtube.com/watch?v=inWWhr5tnEA',
            'sana': date(2024, 4, 1),
            'foreveryone': True
        }
    ]

    for item in video_data:
        obj, created = video_darslar.objects.get_or_create(
            nomi=item['nomi'],
            muallif=item['muallif'],
            defaults=item
        )
        if not created:
            for k, v in item.items():
                setattr(obj, k, v)
            obj.save()

    print("Video darslar muvaffaqiyatli saqlandi. Jami:", video_darslar.objects.count())

    # 9. Kafedra Talablari
    talablar_data = [
        {
            'kafedra': kaf_at,
            'mudir': mudir_at,
            'sarlavha': '2024-2025 o\'quv yili uchun Scopus maqola chop etish',
            'ish_turi': 'Scopus',
            'talab_miqdori': 1,
            'muddati': date(2025, 6, 30),
            'tavsif': 'Kafedraning har bir ilmiy darajali o\'qituvchisi nufuzli Scopus yoki Web of Science bazasidagi jurnalda maqola chiqarishi shart.',
            'faol': True
        },
        {
            'kafedra': kaf_at,
            'mudir': mudir_at,
            'sarlavha': 'OAK ro\'yxatidagi jurnallarda ilmiy maqola chiqarish',
            'ish_turi': 'Maqola',
            'talab_miqdori': 2,
            'muddati': date(2025, 5, 31),
            'tavsif': 'OAK e\'tirof etgan xalqaro va respublika ilmiy jurnallarida kamida 2 ta maqola chop etish.',
            'faol': True
        },
        {
            'kafedra': kaf_at,
            'mudir': mudir_at,
            'sarlavha': 'Darslik yoki o\'quv qo\'llanma nashr etish',
            'ish_turi': 'Darslik',
            'talab_miqdori': 1,
            'muddati': date(2025, 12, 31),
            'tavsif': 'Oliy ta\'lim vazirligi grifi asosida darslik yoki o\'quv qo\'llanma tayyorlash.',
            'faol': True
        },
        {
            'kafedra': kaf_at,
            'mudir': mudir_at,
            'sarlavha': 'Dasturiy mahsulot uchun EHM guvohnoma yoki patent olish',
            'ish_turi': 'EHM guvohnomalar',
            'talab_miqdori': 1,
            'muddati': date(2025, 6, 1),
            'tavsif': 'Adliya vazirligi huzuridagi intellektual mulk agentligidan EHM guvohnoma rasmiylashtirish.',
            'faol': True
        },
        {
            'kafedra': kaf_ai,
            'mudir': mudir_ai,
            'sarlavha': 'Sun\'iy intellekt bo\'yicha Q1/Q2 Scopus maqolasi',
            'ish_turi': 'Scopus',
            'talab_miqdori': 2,
            'muddati': date(2025, 7, 1),
            'tavsif': 'Xalqaro nufuzli konferensiya va Q1/Q2 kvartildagi jurnallarda maqolalar.',
            'faol': True
        }
    ]

    for item in talablar_data:
        obj, created = KafedraTalablari.objects.get_or_create(
            kafedra=item['kafedra'],
            sarlavha=item['sarlavha'],
            defaults=item
        )
        if not created:
            for k, v in item.items():
                setattr(obj, k, v)
            obj.save()

    print("Kafedra talablari muvaffaqiyatli saqlandi. Jami:", KafedraTalablari.objects.count())
    print("\n=== TEST DATABASE FULL SEEDING MUVAFFAQIYATLI YAKUNLANDI ===")

if __name__ == '__main__':
    seed()
