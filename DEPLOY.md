# Kafedralar.uz — serverga joylashtirish yo'riqnomasi

Bu yo'riqnoma loyihani **Ubuntu 22.04 / 24.04** o'rnatilgan VPS serverga birinchi marta o'rnatish va
keyinchalik yangilash uchun. Buyruqlar server terminalida (SSH orqali) `root` sifatida bajariladi.

```
Brauzer ──► Nginx (80/443) ──► Gunicorn (unix socket) ──► Django ──► MySQL
              │
              ├── /static/  → staticfiles/  (CSS, JS, rasmlar)
              └── /media/   → media/        (yuklangan fayllar, videolar)
```

**Belgilar:** quyida `SERVER_IP` va `kafedralar.uz` so'zlarini o'zingizning server IP manzilingiz
va domeningizga almashtiring.

---

## 0. Oldindan kerak bo'ladiganlar

- [ ] VPS server: Ubuntu 22.04 yoki 24.04, kamida **2 GB RAM**, videolar uchun **20 GB+ disk**
- [ ] Serverga `root` (yoki `sudo`) huquqi bilan SSH orqali kirish
- [ ] Domen (masalan `kafedralar.uz`): DNS'da **A yozuvi** server IP manziliga yo'naltirilgan
      (`kafedralar.uz` va `www.kafedralar.uz`)
- [ ] GitHub repozitoriyga kirish huquqi (repo yopiq bo'lsa, 3-qadamdagi "Deploy key" bo'limiga qarang)
- [ ] Email xabarlari uchun Gmail **App Password**: https://myaccount.google.com/apppasswords

---

## 1. Serverga ulanish va kerakli dasturlarni o'rnatish

```bash
ssh root@SERVER_IP
```

```bash
apt update && apt upgrade -y
```

```bash
apt install -y python3 python3-venv python3-dev build-essential pkg-config default-libmysqlclient-dev mysql-server nginx git certbot python3-certbot-nginx ufw
```

## 2. Loyiha uchun alohida foydalanuvchi yaratish

Sayt `root` nomidan emas, alohida `kafedra` foydalanuvchisi nomidan ishlaydi.

```bash
adduser --system --group --home /var/www/kafedra_uz --shell /bin/bash kafedra
```

```bash
chmod 755 /var/www/kafedra_uz
```

## 3. Kodni serverga yuklab olish

```bash
sudo -u kafedra git clone https://github.com/Halilulloxon/kafedra_uz.git /var/www/kafedra_uz/repo
```

Papka nomida bo'sh joy bor (`first project`). Keyingi buyruqlar oson bo'lishi uchun unga qisqa havola yaratamiz:

```bash
ln -s "/var/www/kafedra_uz/repo/first project" /var/www/kafedra_uz/app
```

Endi `manage.py` fayli `/var/www/kafedra_uz/app/manage.py` manzilida turadi.

<details>
<summary><b>Repo yopiq (private) bo'lsa: Deploy key</b></summary>

```bash
sudo -u kafedra mkdir -p -m 700 /var/www/kafedra_uz/.ssh
```

```bash
sudo -u kafedra ssh-keygen -t ed25519 -N "" -f /var/www/kafedra_uz/.ssh/id_ed25519
```

```bash
cat /var/www/kafedra_uz/.ssh/id_ed25519.pub
```

Chiqqan matnni GitHub → repo → **Settings → Deploy keys → Add deploy key** bo'limiga qo'shing.
So'ng klonlashni SSH manzil orqali bajaring:

```bash
sudo -u kafedra git clone git@github.com:Halilulloxon/kafedra_uz.git /var/www/kafedra_uz/repo
```
</details>

## 4. MySQL bazasini yaratish

```bash
mysql
```

MySQL ichida (`KUCHLI_PAROL` o'rniga o'zingizning parolingizni yozing va uni eslab qoling):

```sql
CREATE DATABASE myproject CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'kafedra_user'@'localhost' IDENTIFIED BY 'KUCHLI_PAROL';
GRANT ALL PRIVILEGES ON myproject.* TO 'kafedra_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 5. Python virtual muhiti va kutubxonalar

```bash
sudo -u kafedra python3 -m venv /var/www/kafedra_uz/venv
```

```bash
sudo -u kafedra /var/www/kafedra_uz/venv/bin/pip install --upgrade pip
```

```bash
sudo -u kafedra /var/www/kafedra_uz/venv/bin/pip install -r /var/www/kafedra_uz/app/requirements.txt
```

> Serverda Django 5.2 (LTS) o'rnatiladi. U MySQL 8 bilan to'g'ri ishlaydi.

## 6. `.env` sozlamalar fayli

Barcha maxfiy ma'lumotlar (parollar, kalitlar) `settings.py` ichida emas, `.env` faylida saqlanadi.

```bash
sudo -u kafedra cp /var/www/kafedra_uz/app/.env.example /var/www/kafedra_uz/app/.env
```

```bash
chmod 600 /var/www/kafedra_uz/app/.env
```

Yangi maxfiy kalit (SECRET_KEY) yarating va natijani nusxalab oling:

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

Faylni tahrirlang:

```bash
sudo -u kafedra nano /var/www/kafedra_uz/app/.env
```

To'ldirilishi kerak bo'lgan qatorlar:

| O'zgaruvchi | Qiymat |
|---|---|
| `DJANGO_DEBUG` | `False` (serverda **doim** False) |
| `DJANGO_SECRET_KEY` | yuqorida yaratilgan kalit |
| `DJANGO_ALLOWED_HOSTS` | `kafedralar.uz,www.kafedralar.uz,SERVER_IP` |
| `DJANGO_CSRF_TRUSTED_ORIGINS` | `https://kafedralar.uz,https://www.kafedralar.uz` |
| `DJANGO_HTTPS` | hozircha `False` (10-qadamdan keyin `True` qilinadi) |
| `DB_USER` / `DB_PASSWORD` | 4-qadamdagi `kafedra_user` va uning paroli |
| `EMAIL_HOST_USER` | Gmail manzili |
| `EMAIL_HOST_PASSWORD` | Gmail App Password (bo'sh joylari bo'lsa, qo'shtirnoq ichida yozing) |

Saqlash: `Ctrl+O`, `Enter`, chiqish: `Ctrl+X`.

## 7. Bazani tayyorlash, statik fayllar, admin

```bash
cd /var/www/kafedra_uz/app
```

```bash
sudo -u kafedra /var/www/kafedra_uz/venv/bin/python manage.py migrate
```

```bash
sudo -u kafedra /var/www/kafedra_uz/venv/bin/python manage.py collectstatic --noinput
```

```bash
sudo -u kafedra mkdir -p /var/www/kafedra_uz/app/media
```

Admin panel uchun bosh foydalanuvchi (superuser):

```bash
sudo -u kafedra /var/www/kafedra_uz/venv/bin/python manage.py createsuperuser
```

Sozlamalarni tekshirish (HSTS haqidagi ogohlantirishlar muhim emas):

```bash
sudo -u kafedra /var/www/kafedra_uz/venv/bin/python manage.py check --deploy
```

<details>
<summary><b>Eski kompyuterdagi ma'lumotlarni ko'chirish (bor bo'lsa)</b></summary>

Buni `migrate` dan **oldin** qiling. Eski kompyuterda (XAMPP):

```bash
C:\xampp\mysql\bin\mysqldump.exe -u root -p myproject > backup.sql
```

```bash
scp backup.sql root@SERVER_IP:/tmp/backup.sql
```

```bash
scp -r "first project/media" root@SERVER_IP:/var/www/kafedra_uz/app/
```

Serverda:

```bash
mysql -u kafedra_user -p myproject < /tmp/backup.sql
```

```bash
chown -R kafedra:www-data /var/www/kafedra_uz/repo/first\ project/media
```

So'ng `migrate` va `collectstatic` ni bajaring. Superuser eski bazada bo'lsa, qayta yaratish shart emas.
</details>

## 8. Gunicorn xizmatini sozlash

```bash
nano /etc/systemd/system/kafedra.service
```

Quyidagini joylashtiring:

```ini
[Unit]
Description=Kafedralar.uz (gunicorn)
After=network.target mysql.service

[Service]
User=kafedra
Group=www-data
RuntimeDirectory=kafedra
WorkingDirectory=/var/www/kafedra_uz/app
ExecStart=/var/www/kafedra_uz/venv/bin/gunicorn --workers 3 --timeout 120 --bind unix:/run/kafedra/gunicorn.sock first_project.wsgi:application
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
```

```bash
systemctl enable --now kafedra
```

```bash
systemctl status kafedra
```

`active (running)` yozuvi chiqishi kerak. Chiqmasa: `journalctl -u kafedra -n 50`.

## 9. Nginx sozlash

```bash
nano /etc/nginx/sites-available/kafedra
```

```nginx
server {
    listen 80;
    server_name kafedralar.uz www.kafedralar.uz;

    # Video darslarni yuklash uchun katta fayllarga ruxsat
    client_max_body_size 500M;

    location /static/ {
        alias /var/www/kafedra_uz/app/staticfiles/;
    }

    location /media/ {
        alias /var/www/kafedra_uz/app/media/;
    }

    location / {
        proxy_pass http://unix:/run/kafedra/gunicorn.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/kafedra /etc/nginx/sites-enabled/kafedra
```

```bash
rm -f /etc/nginx/sites-enabled/default
```

```bash
nginx -t && systemctl reload nginx
```

Firewall (faqat SSH va veb portlar ochiq qoladi):

```bash
ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw enable
```

Endi `http://kafedralar.uz` ochilishi kerak.

## 10. SSL (https) o'rnatish

Domen DNS'i serverga yo'naltirilgan bo'lishi shart.

```bash
certbot --nginx -d kafedralar.uz -d www.kafedralar.uz
```

"Redirect" so'ralsa, **2** (http → https) ni tanlang. Sertifikat avtomatik yangilanib turadi.

So'ng `.env` da `DJANGO_HTTPS=True` qiling va saytni qayta ishga tushiring:

```bash
sudo -u kafedra nano /var/www/kafedra_uz/app/.env
```

```bash
systemctl restart kafedra
```

## 11. Ishga tushgandan keyingi tekshiruv

1. `https://kafedralar.uz/` — bosh sahifa dizayn (CSS) bilan ochiladi
2. `https://kafedralar.uz/admin/` — superuser bilan kiring
3. Admin panelda avval **Dekanatlar** (fakultetlar), keyin **Kafedralar** ni qo'shing —
   ularsiz ro'yxatdan o'tish formasidagi ro'yxatlar bo'sh bo'ladi
4. `https://kafedralar.uz/registratsiya/` — sinov foydalanuvchisini ro'yxatdan o'tkazing,
   emailga xat kelishini tekshiring
5. Admin → **Foydalanuvchilar** → sinov foydalanuvchisida `Accepted` ni belgilang → tasdiqlash xati keladi
6. `https://kafedralar.uz/login/` — shu foydalanuvchi bilan kiring
7. Ilmiy ish / o'quv ishi / video qo'shib ko'ring, video o'ynashini tekshiring

**Loglar:**

```bash
journalctl -u kafedra -f
```

```bash
tail -f /var/log/nginx/error.log
```

---

## 12. Yangilash (kodga o'zgarish kiritilganda)

Avval zaxira nusxa oling (13-qadam), keyin:

```bash
cd /var/www/kafedra_uz/repo && sudo -u kafedra git pull
```

```bash
sudo -u kafedra /var/www/kafedra_uz/venv/bin/pip install -r /var/www/kafedra_uz/app/requirements.txt
```

```bash
cd /var/www/kafedra_uz/app && sudo -u kafedra /var/www/kafedra_uz/venv/bin/python manage.py migrate
```

```bash
cd /var/www/kafedra_uz/app && sudo -u kafedra /var/www/kafedra_uz/venv/bin/python manage.py collectstatic --noinput
```

```bash
systemctl restart kafedra
```

## 13. Zaxira nusxa (backup)

```bash
mysqldump -u kafedra_user -p myproject > /root/backup_$(date +%F).sql
```

```bash
tar czf /root/media_$(date +%F).tar.gz -C /var/www/kafedra_uz/app/ media
```

Zaxira fayllarni vaqti-vaqti bilan serverdan tashqariga ham ko'chirib qo'ying.

## 14. Orqaga qaytarish (yangilanish buzilsa)

```bash
cd /var/www/kafedra_uz/repo && sudo -u kafedra git log --oneline -5
```

```bash
cd /var/www/kafedra_uz/repo && sudo -u kafedra git checkout ISHLAGAN_COMMIT_ID
```

```bash
systemctl restart kafedra
```

Agar yangi migratsiya bazani buzgan bo'lsa, zaxiradan tiklang (`SANA` o'rniga zaxira sanasi):

```bash
mysql -u kafedra_user -p myproject < /root/backup_SANA.sql
```

Tuzatilgandan keyin asosiy branchga qaytish: `sudo -u kafedra git checkout main`.

---

## 15. Tez-tez uchraydigan muammolar

| Belgi | Sabab | Yechim |
|---|---|---|
| **502 Bad Gateway** | Gunicorn ishlamayapti | `journalctl -u kafedra -n 50` — xatoni o'qing |
| `ImproperlyConfigured: DJANGO_SECRET_KEY` | `.env` yo'q yoki kalit bo'sh | 6-qadam |
| **400 Bad Request** | Domen `DJANGO_ALLOWED_HOSTS` da yo'q | `.env` ni tuzating, `systemctl restart kafedra` |
| **403 CSRF** kirishda | https domen `DJANGO_CSRF_TRUSTED_ORIGINS` da yo'q yoki `DJANGO_HTTPS` noto'g'ri | `.env` ni tekshiring |
| Sahifa dizaynsiz (CSS yo'q) | `collectstatic` bajarilmagan | 7-qadam, keyin `systemctl reload nginx` |
| **413 Request Entity Too Large** | Yuklanayotgan video juda katta | nginx'da `client_max_body_size` ni oshiring |
| Email kelmayapti | App Password xato yoki provayder 587-portni yopgan | `.env` ni tekshiring; provayderdan SMTP ochishni so'rang |
| `mysqlclient` o'rnatilmayapti | Kompilyatsiya paketlari yo'q | 1-qadamdagi `apt install` ni qayta bajaring |
| Yuklangan rasm/video ko'rinmaydi | `media` papkasiga ruxsat yo'q | `chown -R kafedra:www-data /var/www/kafedra_uz/repo/first\ project/media` |

---

## Lokal kompyuterda ishlatish (Windows + XAMPP)

1. Python 3.12 o'rnating (python.org, o'rnatishda **"Add python.exe to PATH"** ni belgilang)
2. XAMPP'da MySQL'ni yoqing va baza yarating:
   `C:\xampp\mysql\bin\mysql.exe -u root -e "CREATE DATABASE myproject CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"`
3. `first project` papkasida `.env` yarating (`.env.example` dan nusxa), `DJANGO_DEBUG=True` qiling
4. XAMPP'dagi MariaDB 10.4 yangi Django bilan ishlamaydi, shuning uchun lokalda Django 4.2 o'rnating:
   `pip install "Django>=4.2,<5.0"` va `pip install -r requirements.txt`
5. `python manage.py migrate`, `python manage.py createsuperuser`, `python manage.py runserver`
6. Brauzerda: http://127.0.0.1:8000/ (admin: http://127.0.0.1:8000/admin/)

---

## Xavfsizlik bo'yicha muhim eslatmalar

- **Eski parollar GitHub tarixida qolgan.** Avval `settings.py` ichida Gmail App Password, MySQL paroli va
  `SECRET_KEY` ochiq yozilgan edi. Ular git tarixida saqlanib qoladi, shuning uchun:
  Gmail App Password'ni bekor qilib yangisini yarating, serverda yangi `SECRET_KEY` va boshqa MySQL parolidan foydalaning.
- Foydalanuvchi parollari (`Foydalanuvchilar.parol`) bazada **shifrlanmagan holda** saqlanadi.
- Ko'p sahifalar URL'dagi `user_id` bo'yicha ochiladi va kim kirganini tekshirmaydi.
- `/media/` ichidagi barcha fayllar havolasini bilgan har bir kishiga ochiq ("hamma uchun emas" deb belgilangan ishlar ham).
