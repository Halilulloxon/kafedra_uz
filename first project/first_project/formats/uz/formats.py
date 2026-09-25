"""O'zbek tili uchun sana formatlari.

Django'ning o'zbekcha formatlarida faqat "25.10.2006" ko'rinishi bor,
brauzerning <input type="date"> maydoni esa "2006-10-25" yuboradi.
Shu sababli ISO ko'rinishi birinchi o'ringa qo'yilgan — aks holda ilmiy
ish yoki kitob qo'shishda "sana noto'g'ri" xatosi chiqadi.
"""

DATE_FORMAT = 'd/m/Y'
DATETIME_FORMAT = 'd/m/Y H:i'
SHORT_DATE_FORMAT = 'd/m/Y'
SHORT_DATETIME_FORMAT = 'd/m/Y H:i'
TIME_FORMAT = 'H:i'
FIRST_DAY_OF_WEEK = 1  # Dushanba

DATE_INPUT_FORMATS = [
    '%d/%m/%Y',
    '%d.%m.%Y',
    '%Y-%m-%d',
]

DATETIME_INPUT_FORMATS = [
    '%d.%m.%Y %H:%M:%S',
    '%d.%m.%Y %H:%M',
    '%d.%m.%Y',
    '%Y-%m-%d %H:%M:%S',
    '%Y-%m-%d %H:%M',
    '%Y-%m-%dT%H:%M',
    '%Y-%m-%d',
]

DECIMAL_SEPARATOR = '.'
THOUSAND_SEPARATOR = ' '
NUMBER_GROUPING = 3
