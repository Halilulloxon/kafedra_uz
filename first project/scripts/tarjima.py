# -*- coding: utf-8 -*-
"""Admin panelining tarjimasiz qatorlari uchun loyiha katalogini yasaydi.

Django'ning o'zbekcha katalogida 101 ta qator tarjimasiz qolgan — ular
inglizcha chiqadi. Shu skript o'sha qatorlarni topib, tarjimasi bor
bo'lganlarini "first project/locale/uz/LC_MESSAGES/" ichiga .po va .mo
qilib yozadi. Loyiha katalogi Django'nikidan ustun turadi.
"""
import io, os, struct, array

LOYIHA = r"C:\Users\Javohir\Desktop\kafedra_uz\first project"
PO_MANBA = os.path.join(LOYIHA, r"venv\Lib\site-packages\django\contrib\admin\locale\uz\LC_MESSAGES\django.po")
CHIQISH = os.path.join(LOYIHA, "locale", "uz", "LC_MESSAGES")


def normal(matn):
    """Qo'shtirnoq va uch nuqtani oddiy belgilarga keltiradi."""
    return (matn.replace('\u2018', "'").replace('\u2019', "'")
                .replace('\u201c', '"').replace('\u201d', '"')
                .replace('\u2026', '...').replace('\xa0', ' '))


TARJIMALAR = {
    # Umumiy
    "Home": "Bosh sahifa",
    "Log in": "Kirish",
    "Site administration": "Boshqaruv paneli",
    "Django site admin": "Kafedralar.uz boshqaruvi",
    "Django administration": "Kafedralar.uz boshqaruvi",
    "%(app)s administration": "%(app)s bo'limi",
    "Models in the %(name)s application": "%(name)s bo'limidagi ma'lumotlar",
    "History": "Tarix",
    "Go": "Bajarish",
    "Show all": "Hammasini ko'rsatish",
    "Objects": "Yozuvlar",
    "Date/time": "Sana va vaqt",
    "User": "Foydalanuvchi",
    "Action": "Amal",
    "None available": "Hozircha yo'q",
    "Unknown content": "Noma'lum ma'lumot",
    "Popup closing...": "Oyna yopilmoqda...",
    "Start typing to filter...": "Qidirish uchun yozing...",
    "Filter navigation items": "Bo'limlarni filtrlash",
    "Clear all filters": "Filtrlarni tozalash",
    "Toggle sorting": "Saralash tartibini almashtirish",
    "Sorting priority: %(priority_number)s": "Saralash tartibi: %(priority_number)s",
    "Clear selection": "Tanlovni bekor qilish",
    "0 of %(cnt)s selected": "%(cnt)s tadan 0 tasi tanlandi",
    "%(full_result_count)s total": "jami %(full_result_count)s ta",
    "Click here to select the objects across all pages":
        "Barcha sahifalardagi yozuvlarni tanlash uchun shu yerni bosing",
    "Select all %(total_count)s %(module_name)s":
        "Barcha %(total_count)s ta %(module_name)s tanlansin",
    "Change history: %s": "O'zgarishlar tarixi: %s",

    # Ro'yxat sahifalari
    "Select %s to change": "%s ro'yxati",
    "Select %s to view": "%s ro'yxati",

    # Xabarlar
    "Please correct the error below.": "Quyidagi xatoni to'g'rilang.",
    "Please correct the errors below.": "Quyidagi xatolarni to'g'rilang.",
    "No fields changed.": "Hech qanday maydon o'zgarmadi.",
    "Added.": "Qo'shildi.",
    "Added {name} \"{object}\".": "{name} \"{object}\" qo'shildi.",
    "Changed {fields} for {name} \"{object}\".": "{name} \"{object}\" da {fields} o'zgartirildi.",
    "Changed {fields}.": "{fields} o'zgartirildi.",
    "Deleted {name} \"{object}\".": "{name} \"{object}\" o'chirildi.",
    "The {name} \"{obj}\" was added successfully.": "{name} \"{obj}\" muvaffaqiyatli qo'shildi.",
    "You may edit it again below.": "Quyida uni yana tahrirlashingiz mumkin.",
    "The {name} \"{obj}\" was added successfully. You may add another {name} below.":
        "{name} \"{obj}\" qo'shildi. Quyida yana {name} qo'shishingiz mumkin.",
    "The {name} \"{obj}\" was changed successfully. You may edit it again below.":
        "{name} \"{obj}\" o'zgartirildi. Quyida uni yana tahrirlashingiz mumkin.",
    "The {name} \"{obj}\" was added successfully. You may edit it again below.":
        "{name} \"{obj}\" qo'shildi. Quyida uni yana tahrirlashingiz mumkin.",
    "The {name} \"{obj}\" was changed successfully. You may add another {name} below.":
        "{name} \"{obj}\" o'zgartirildi. Quyida yana {name} qo'shishingiz mumkin.",
    "Items must be selected in order to perform actions on them. No items have been changed.":
        "Amal bajarish uchun avval yozuvlarni belgilang. Hech narsa o'zgarmadi.",
    "No action selected.": "Amal tanlanmadi.",
    "%(name)s with ID \"%(key)s\" doesn't exist. Perhaps it was deleted?":
        "\"%(key)s\" raqamli %(name)s topilmadi. Ehtimol, u o'chirilgan.",
    "Hold down \"Control\", or \"Command\" on a Mac, to select more than one.":
        "Bir nechtasini tanlash uchun Ctrl (Mac'da Command) tugmasini bosib turing.",

    # O'chirish
    "Yes, I'm sure": "Ha, o'chirilsin",
    "No, take me back": "Yo'q, ortga qaytaring",
    "Delete multiple objects": "Bir nechta yozuvni o'chirish",
    "Are you sure you want to delete the selected %(objects_name)s? All of the following objects and their related items will be deleted:":
        "Tanlangan %(objects_name)s o'chirilsinmi? Quyidagi yozuvlar va ularga bog'liq ma'lumotlar ham o'chib ketadi:",

    # Kirish va xatolar
    "Forgotten your password or username?": "Parol yoki loginni unutdingizmi?",
    "Page not found": "Sahifa topilmadi",
    "We're sorry, but the requested page could not be found.":
        "Kechirasiz, so'ralgan sahifa topilmadi.",
    "You don't have permission to view or edit anything.":
        "Sizda ko'rish yoki tahrirlash huquqi yo'q.",
    "You are authenticated as %(username)s, but are not authorized to access this page. Would you like to login to a different account?":
        "Siz %(username)s sifatida kirgansiz, lekin bu sahifaga ruxsatingiz yo'q. Boshqa hisob bilan kirasizmi?",
    "This object doesn't have a change history. It probably wasn't added via this admin site.":
        "Bu yozuvning o'zgarishlar tarixi yo'q. Ehtimol, u admin panel orqali qo'shilmagan.",
    "First, enter a username and password. Then, you'll be able to edit more user options.":
        "Avval login va parolni kiriting. Keyin qolgan sozlamalarni tahrirlaysiz.",
    "Enter a new password for the user <strong>%(username)s</strong>.":
        "<strong>%(username)s</strong> uchun yangi parol kiriting.",
}


# Admin katalogida emas, boshqa ilovalarda turgan qatorlar.
# Django'ning auth modeli "user" deb ataladi — bu saytdagi o'qituvchilar emas,
# admin panelga kiradigan hisoblar, shuning uchun nomi aniqroq qilingan.
QOSHIMCHA = {
    "user": "admin hisobi",
    "users": "admin hisoblari",
    "group": "guruh",
    "groups": "guruhlar",
    # Kirish formasidagi xato xabari "username" so'zini ishlatadi
    "username": "login",
    "password": "parol",
}


def po_oqish(p):
    """Sodda .po o'quvchi: (msgid, msgstr bo'shmi) ro'yxatini qaytaradi."""
    satrlar = io.open(p, encoding='utf-8').read().split('\n')
    natija, i = [], 0

    def matn(j):
        """Qo'shtirnoq ichidagi matnni ochadi."""
        xom = satrlar[j].split('"', 1)[1].rsplit('"', 1)[0]
        return xom.encode().decode('unicode_escape').encode('latin-1').decode('utf-8')

    while i < len(satrlar):
        if satrlar[i].startswith('msgid "') :
            msgid = matn(i)
            j = i + 1
            while j < len(satrlar) and satrlar[j].startswith('"'):
                msgid += matn(j)
                j += 1
            plural = j < len(satrlar) and satrlar[j].startswith('msgid_plural')
            bosh = j < len(satrlar) and satrlar[j] == 'msgstr ""' and \
                   not (j + 1 < len(satrlar) and satrlar[j + 1].startswith('"'))
            if msgid and not plural:
                natija.append((msgid, bosh))
            i = j
        else:
            i += 1
    return natija


def mo_yozish(p, juftlar):
    """Lug'atni GNU .mo formatida yozadi."""
    juftlar = sorted(juftlar, key=lambda x: x[0].encode('utf-8'))
    kalitlar = [k.encode('utf-8') for k, _ in juftlar]
    qiymatlar = [v.encode('utf-8') for _, v in juftlar]
    n = len(juftlar)

    korsatkich_o, korsatkich_t = 28, 28 + 8 * n
    boshlanish = korsatkich_t + 8 * n
    jadval_o, jadval_t, malumot = [], [], b''

    for k in kalitlar:
        jadval_o.append((len(k), boshlanish + len(malumot)))
        malumot += k + b'\x00'
    for v in qiymatlar:
        jadval_t.append((len(v), boshlanish + len(malumot)))
        malumot += v + b'\x00'

    chiqish = struct.pack('<Iiiiiii', 0x950412de, 0, n, korsatkich_o, korsatkich_t, 0, 0)
    for uzunlik, ofset in jadval_o + jadval_t:
        chiqish += struct.pack('<ii', uzunlik, ofset)
    io.open(p, 'wb').write(chiqish + malumot)


# ── Ish boshlandi ──
bosh_qatorlar = [m for m, b in po_oqish(PO_MANBA) if b]
tanlangan, topilmagan = [], []

for msgid in bosh_qatorlar:
    kalit = normal(msgid)
    if kalit in TARJIMALAR:
        tanlangan.append((msgid, TARJIMALAR[kalit]))

tanlangan += list(QOSHIMCHA.items())

ishlatilgan = {normal(m) for m, _ in tanlangan}
topilmagan = [k for k in TARJIMALAR if k not in ishlatilgan]

sarlavha = (
    "Project-Id-Version: kafedralar.uz\\n"
    "Report-Msgid-Bugs-To: \\n"
    "MIME-Version: 1.0\\n"
    "Content-Type: text/plain; charset=UTF-8\\n"
    "Content-Transfer-Encoding: 8bit\\n"
    "Language: uz\\n"
    "Plural-Forms: nplurals=1; plural=0;\\n"
).replace("\\n", "\n")

os.makedirs(CHIQISH, exist_ok=True)
mo_yozish(os.path.join(CHIQISH, 'django.mo'), [('', sarlavha)] + tanlangan)

# O'qish uchun .po nusxasi
with io.open(os.path.join(CHIQISH, 'django.po'), 'w', encoding='utf-8', newline='\n') as f:
    f.write('# Kafedralar.uz — Django admin panelining tarjimasiz qatorlari.\n')
    f.write('# Bu fayl qo\'lda yuritiladi; .mo ni yangilash: scripts/tarjima.py\n')
    f.write('msgid ""\nmsgstr ""\n')
    for q in sarlavha.strip().split('\n'):
        f.write('"%s\\n"\n' % q)
    for msgid, msgstr in tanlangan:
        f.write('\nmsgid "%s"\n' % msgid.replace('\\', '\\\\').replace('"', '\\"'))
        f.write('msgstr "%s"\n' % msgstr.replace('\\', '\\\\').replace('"', '\\"'))

print("tarjima qilindi:", len(tanlangan), "ta qator")
if topilmagan:
    print("mos kelmadi (tekshirish kerak):")
    for t in topilmagan:
        print('  -', t[:70])
