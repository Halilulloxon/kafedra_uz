import os
from django.conf import settings
from email.mime.image import MIMEImage
from django.core.mail import EmailMultiAlternatives
from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from .models import Foydalanuvchilar

OLD_VALUES = {}


# ─────────────────────────────────────────────────────────────────────────────
# Eski qiymatni saqlash (faqat mavjud obyektlar uchun)
# ─────────────────────────────────────────────────────────────────────────────
@receiver(pre_save, sender=Foydalanuvchilar)
def capture_old_accepted(sender, instance, **kwargs):
    if instance.pk:
        try:
            old = Foydalanuvchilar.objects.get(pk=instance.pk)
            OLD_VALUES[instance.pk] = old.accepted
        except Foydalanuvchilar.DoesNotExist:
            OLD_VALUES[instance.pk] = None


# ─────────────────────────────────────────────────────────────────────────────
# Email yuborish yordamchi funksiyasi
# ─────────────────────────────────────────────────────────────────────────────
def _send_status_email(instance, subject, accent_color, accent_light,
                       icon_char, icon_bg, header_title, status_intro,
                       features, button_text, button_link, footer_note, banner_text):

    full_name = f"{instance.familiya} {instance.ism} {instance.sharifi}"

    # ── Plain-text fallback ──
    feature_lines = "\n".join(f"  • {t}: {d}" for _, t, d in features)
    text_content = (
        f"Assalomu alaykum!\n\n"
        f"Hurmatli {full_name},\n\n"
        f"{banner_text}\n\n"
        f"{feature_lines}\n\n"
        f"Havola: {button_link}\n\n"
        f"Hurmat bilan,\nKafedralar.uz administratsiyasi"
    )

    # ── Feature rows HTML ──
    feature_rows_html = ""
    for emoji, title, desc in features:
        feature_rows_html += f"""
        <tr>
          <td style="padding:10px 0; vertical-align:top;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td width="44" style="vertical-align:top; padding-top:2px;">
                  <div style="width:36px; height:36px; background:{accent_light};
                              border-radius:8px; text-align:center; line-height:36px; font-size:18px;">
                    {emoji}
                  </div>
                </td>
                <td style="padding-left:12px; vertical-align:top;">
                  <p style="margin:0 0 3px 0; font-size:14px; font-weight:700;
                             color:#1e293b; font-family:Georgia,serif;">
                    {title}
                  </p>
                  <p style="margin:0; font-size:13px; color:#64748b; line-height:1.5;">
                    {desc}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0;">
            <hr style="border:none; border-top:1px solid #f1f5f9; margin:0;">
          </td>
        </tr>
        """

    # ── Full HTML ──
    html_content = f"""<!DOCTYPE html>
<html lang="uz">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:Georgia,'Times New Roman',serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0"
       style="background:#f1f5f9; padding:40px 16px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" border="0"
             style="max-width:600px; width:100%; background:#ffffff;
                    border-radius:16px; overflow:hidden;
                    box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);
                     padding:36px 40px 32px; text-align:center;">
            <div style="margin-bottom:20px;">
              <img src="cid:logo_image" alt="Kafedralar.uz"
                   style="height:200px; width:auto; display:inline-block;">
            </div>
            <div style="display:inline-block; width:64px; height:64px;
                        background:{icon_bg}; border-radius:50%;
                        text-align:center; line-height:64px;
                        font-size:30px; color:white; font-weight:900;
                        margin-bottom:16px; box-shadow:0 4px 16px rgba(0,0,0,0.25);">
              {icon_char}
            </div>
            <h1 style="margin:0; color:#ffffff; font-size:24px;
                       font-family:Georgia,'Times New Roman',serif;
                       font-weight:700; letter-spacing:0.5px;">
              {header_title}
            </h1>
            <p style="margin:8px 0 0; color:rgba(255,255,255,0.6);
                      font-size:13px; font-family:Arial,sans-serif;">
              Kafedralar.uz &mdash; Rasmiy Xabarnoma
            </p>
          </td>
        </tr>

        <!-- STATUS BANNER -->
        <tr>
          <td style="background:{accent_light}; border-left:4px solid {accent_color};
                     padding:16px 40px;">
            <p style="margin:0; font-size:14px; color:{accent_color};
                      font-family:Arial,sans-serif; font-weight:700; letter-spacing:0.3px;">
              {banner_text}
            </p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:36px 40px 24px;">
            <p style="margin:0 0 24px; font-size:15px; line-height:1.75;
                      color:#334155; font-family:Arial,sans-serif;">
              Assalomu alaykum!<br><br>
              {status_intro}
            </p>
            <hr style="border:none; border-top:2px solid #f1f5f9; margin:0 0 24px;">
            <p style="margin:0 0 16px; font-size:13px; font-weight:700;
                      color:#94a3b8; text-transform:uppercase; letter-spacing:1.5px;
                      font-family:Arial,sans-serif;">
              Keyingi qadamlar
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              {feature_rows_html}
            </table>
          </td>
        </tr>

        <!-- CTA BUTTON -->
        <tr>
          <td style="padding:8px 40px 36px; text-align:center;">
            <a href="{button_link}"
               style="display:inline-block; background:{accent_color};
                      color:#ffffff; text-decoration:none;
                      font-family:Arial,sans-serif; font-size:15px; font-weight:700;
                      padding:14px 40px; border-radius:8px; letter-spacing:0.3px;
                      box-shadow:0 4px 12px rgba(0,0,0,0.15);">
              {button_text} &rarr;
            </a>
          </td>
        </tr>

        <!-- INFO BOX -->
        <tr>
          <td style="padding:0 40px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background:#f8fafc; border-radius:10px;
                           padding:16px 20px; border:1px solid #e2e8f0;">
                  <p style="margin:0; font-size:13px; color:#64748b;
                             line-height:1.6; font-family:Arial,sans-serif;">
                    💡 <strong style="color:#334155;">Eslatma:</strong>
                    {footer_note}
                    Aloqa uchun:
                    <a href="mailto:halilullohayotullo0608@gmail.com"
                       style="color:{accent_color}; text-decoration:none; font-weight:700;">
                      halilullohayotullo0608@gmail.com
                    </a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#0f172a; padding:24px 40px; text-align:center;">
            <p style="margin:0 0 6px; font-size:15px; font-weight:700;
                      color:#ffffff; font-family:Georgia,serif; letter-spacing:0.5px;">
              Kafedralar.uz
            </p>
            <p style="margin:0 0 12px; font-size:12px; color:#64748b;
                      font-family:Arial,sans-serif;">
              Universitet kafedralar platformasi
            </p>
            <p style="margin:0; font-size:11px; color:#475569;
                      font-family:Arial,sans-serif; line-height:1.6;">
              Ushbu xabar avtomatik yuborilgan &bull;
              &copy; 2026 Kafedralar.uz &bull; Barcha huquqlar himoyalangan
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>

</body>
</html>"""

    # ── Send ──
    email = EmailMultiAlternatives(
        subject,
        text_content,
        '"Kafedralar.uz" <halilullohayotullo0608@gmail.com>',
        [instance.gmail],
    )
    email.attach_alternative(html_content, "text/html")

    logo_path = os.path.join(
        settings.BASE_DIR, "static", "app", "app-assets", "images", "logo", "logo-dark.png"
    )
    with open(logo_path, "rb") as f:
        logo = MIMEImage(f.read())
        logo.add_header("Content-ID", "<logo_image>")
        logo.add_header("Content-Disposition", "inline", filename="logo-dark.png")
        email.attach(logo)

    email.send()


# ─────────────────────────────────────────────────────────────────────────────
# Asosiy signal
# ─────────────────────────────────────────────────────────────────────────────
@receiver(post_save, sender=Foydalanuvchilar)
def tasdiqlash_email(sender, instance, created, **kwargs):
    full_name = f"{instance.familiya} {instance.ism} {instance.sharifi}"

    # ══════════════════════════════════════════════════════════════════════
    # 1) YANGI RO'YXATDAN O'TISH → sariq "kutish" xati
    # ══════════════════════════════════════════════════════════════════════
    if created:
        OLD_VALUES.pop(instance.pk, None)   # pre_save qoldig'ini tozalash
        _send_status_email(
            instance,
            subject      = "⏳ Ro'yxatdan o'tdingiz — hisobingiz tasdiqlanishini kuting",
            accent_color = "#d97706",
            accent_light = "#fffbeb",
            icon_char    = "⏳",
            icon_bg      = "#f59e0b",
            header_title = "Ro'yxatdan O'tdingiz",
            status_intro = (
                f"Hurmatli <strong>{full_name}</strong>,<br><br>"
                "Siz <strong>Kafedralar.uz</strong> platformasida muvaffaqiyatli "
                "ro'yxatdan o'tdingiz. Hisobingiz hozirda administrator tomonidan "
                "ko'rib chiqilmoqda. Tasdiqlangandan so'ng siz bu haqda alohida "
                "xabarnoma olasiz."
            ),
            features     = [
                ("📋", "Ma'lumotlar tekshirilmoqda",
                        "Administrator sizning ma'lumotlaringizni ko'rib chiqmoqda"),
                ("📧", "Xabarnoma kutib turing",
                        "Hisob tasdiqlangach, emailingizga xat yuboriladi"),
                ("⏱️", "Ko'rib chiqish muddati",
                        "Odatda 1–2 ish kuni ichida javob beriladi"),
            ],
            button_text  = "Kafedralar.uz saytiga o'tish",
            button_link  = "https://kafedralar.uz",
            footer_note  = "Savollaringiz bo'lsa, administrator bilan bog'laning.",
            banner_text  = "⏳ HISOB KO'RIB CHIQILMOQDA",
        )
        # Xat yuborgandan keyin created ni False qilib saqlash
        Foydalanuvchilar.objects.filter(pk=instance.pk).update(created=False)
        return

    # ══════════════════════════════════════════════════════════════════════
    # 2) MAVJUD FOYDALANUVCHI → faqat accepted o'zgarganda xat yuboriladi
    # ══════════════════════════════════════════════════════════════════════
    old_accepted = OLD_VALUES.pop(instance.pk, None)
    if old_accepted is None or old_accepted == instance.accepted:
        return  # qiymat o'zgarmagan — email yuborilmaydi

    if instance.accepted:
        # ── Tasdiqlandi (yashil) ──
        _send_status_email(
            instance,
            subject      = "✅ Sizning hisobingiz Kafedralar.uz platformasida tasdiqlandi",
            accent_color = "#16a34a",
            accent_light = "#f0fdf4",
            icon_char    = "✓",
            icon_bg      = "#22c55e",
            header_title = "Hisob Tasdiqlandi",
            status_intro = (
                f"Hurmatli <strong>{full_name}</strong>,<br><br>"
                "Sizning <strong>Kafedralar.uz</strong> platformasidagi foydalanuvchi "
                "hisobingiz administrator tomonidan rasmiy ravishda "
                "<strong>tasdiqlandi</strong>. Endilikda platformaning barcha "
                "imkoniyatlaridan to'liq foydalanishingiz mumkin."
            ),
            features     = [
                ("📚", "Kurslar va kafedralar",
                        "To'liq ma'lumot olish va o'quv materiallariga kirish imkoniyati"),
                ("👤", "Shaxsiy profil",
                        "Profilingizni boshqaring va o'quv progressingizni kuzating"),
                ("📖", "Kutubxona resurslari",
                        "Platformadagi barcha resurslardan samarali foydalaning"),
                ("🔔", "Bildirishnomalar",
                        "Yangiliklar va e'lonlardan doimiy xabardor bo'ling"),
            ],
            button_text  = "Tizimga Kirish",
            button_link  = "https://kafedralar.uz/login",
            footer_note  = "Ushbu xabar avtomatik tarzda yuborildi. Savol yuzaga kelsa, administrator bilan bog'laning.",
            banner_text  = "✅ HISOB FAOLLASHTIRILDI",
        )
    else:
        # ── Bekor qilindi (qizil) ──
        _send_status_email(
            instance,
            subject      = "❌ Sizning hisobingiz Kafedralar.uz platformasida bekor qilindi",
            accent_color = "#dc2626",
            accent_light = "#fef2f2",
            icon_char    = "✕",
            icon_bg      = "#ef4444",
            header_title = "Hisob Bekor Qilindi",
            status_intro = (
                f"Hurmatli <strong>{full_name}</strong>,<br><br>"
                "Sizning <strong>Kafedralar.uz</strong> platformasidagi foydalanuvchi "
                "hisobingiz administrator tomonidan <strong>bekor qilindi</strong>. "
                "Qo'shimcha ma'lumot va yordam olish uchun quyidagi amallarni bajaring."
            ),
            features     = [
                ("📋", "Ma'lumotlarni tekshiring",
                        "Hisob ma'lumotlaringiz to'liq va to'g'ri kiritilganligini tekshiring"),
                ("📬", "Xabarlarni ko'ring",
                        "Oldingi xabarlar, e'lonlar va bildirishnomalarni ko'rib chiqing"),
                ("🛠️", "Yordam so'rang",
                        "Administrator bilan bog'lanib qo'shimcha ma'lumot oling"),
            ],
            button_text  = "Administrator bilan Bog'lanish",
            button_link  = "mailto:halilullohayotullo0608@gmail.com",
            footer_note  = "Hisob bekor qilinishiga oid savollar bo'lsa, iltimos administrator bilan bog'laning.",
            banner_text  = "❌ HISOB BLOKLANDI",
        )