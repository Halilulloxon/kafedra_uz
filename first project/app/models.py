from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
import os

class Foydalanuvchilar(models.Model):
    ROLES = (
        ('prorektor', 'Prorektor'),
        ('dekan', 'Dekan'),
        ('kafedra mudiri', 'Kafedra mudiri'),
        ('oqituvchi', 'Oqituvchi'),
    )
    foydalanuvchi_rol = models.CharField("Lavozim", max_length=50, choices=ROLES)
    kafedra = models.ForeignKey(
        'Kafedralar',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='foydalanuvchilari',
        verbose_name="Kafedra"
    )
    fakulteti = models.ForeignKey(
        'Dekanatlar',
        on_delete = models.CASCADE,
        null=True,
        blank=True,
        related_name='fakulteti',
        verbose_name="Fakultet"
    )
    ism = models.CharField("Ism", max_length=250)
    familiya = models.CharField("Familiya", max_length=250)
    sharifi = models.CharField("Otasining ismi", max_length=250)
    ilmiy_daraja= models.CharField("Ilmiy daraja", max_length=250, default='Bakalavr', blank=True)
    gmail= models.EmailField("Email", max_length=250, null=True)
    haqida= models.TextField("Qisqacha ma'lumot", null=True, blank=True)
    tugulgan_sana = models.DateField("Tug'ilgan sana")
    login_f=models.CharField("Login", max_length=250)
    parol=models.CharField("Parol (xeshlangan)", max_length=250)
    image=models.ImageField("Profil rasmi", upload_to='foydalanuvchilar/', null=True, blank=True)
    accepted=models.BooleanField("Tasdiqlangan", default=False)
    created=models.BooleanField(default=True,editable=False)

    @property
    def get_image_url(self):
        if self.image and hasattr(self.image, 'url'):
            try:
                return self.image.url
            except Exception:
                pass
        return '/static/app/app-assets/images/portrait/small/avatar-s-11.png'

    class Meta:
        verbose_name = "Foydalanuvchi"
        verbose_name_plural = "Foydalanuvchilar"

    def __str__(self):
        return f"{self.ism} {self.familiya} {self.sharifi}"


class Kafedralar(models.Model):
    nomi = models.CharField("Kafedra nomi", max_length=250)
    fakultet= models.ForeignKey('Dekanatlar',
                                on_delete=models.SET_NULL,
                                related_name='fakultet',
                                null= True,
                                blank=True,
                                verbose_name="Fakultet")
    mudir = models.ForeignKey(
        'Foydalanuvchilar',
        on_delete=models.SET_NULL,
        related_name='kafedra_mudiri',
        null=True,
        blank=True,
        verbose_name="Kafedra mudiri"
    )
    oqituvchilar = models.ManyToManyField(
        'Foydalanuvchilar',
        related_name='kafedra_oqituvchilari',
        blank=True,
        verbose_name="O'qituvchilar"
    )
    class Meta:
        verbose_name = "Kafedra"
        verbose_name_plural = "Kafedralar"

    def __str__(self):
        return self.nomi
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        foydalanuvchilar = Foydalanuvchilar.objects.filter(kafedra=self)
        self.oqituvchilar.set(foydalanuvchilar)



class Dekanatlar(models.Model):
    nomi = models.CharField("Fakultet nomi", max_length=250)
    dekan = models.ForeignKey(
        'Foydalanuvchilar',
        on_delete=models.SET_NULL,
        related_name='dekan',
        null=True,
        blank=True,
        verbose_name="Dekan"
    )
    kafedralar = models.ManyToManyField(
        Kafedralar,
        related_name='dekanat_kafedralari',
        blank=True,
        verbose_name="Kafedralar"
    )

    class Meta:
        verbose_name = "Fakultet"
        verbose_name_plural = "Fakultetlar"

    def __str__(self):
        return self.nomi

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        self.kafedralar.set(self.kafedralar.all())


class ilmiy_ishlari(models.Model):
    i_id = models.IntegerField(editable=False, unique=True, null=True, blank=True)
    TURLAR = ('Scopus', 'Maqola', 'Tezis', 'EHM guvohnomalar', 'patent')
    turi = models.CharField("Ish turi", max_length=250, choices=[(t, t) for t in TURLAR])
    nomi = models.CharField("Ish nomi", max_length=250)
    muallif = models.ForeignKey(Foydalanuvchilar, on_delete=models.CASCADE, verbose_name="Muallif")
    ish_mualliflari= models.TextField("Hammualliflar", null = True)
    sana = models.DateField("Sana")
    haqida = models.TextField("Izoh", null=True, blank=True)
    kategoriya = models.CharField(
        max_length=250,
        choices=[('Xalqaro', 'Xalqaro'), ('Respublika', 'Respublika')],
        null=True,
        verbose_name="Kategoriya"
    )
    fayl = models.FileField("Fayl", upload_to='ilmiy_ishlari/')
    foreveryone= models.BooleanField("Hamma ko'ra oladi", default=False)
    dgu_raqami = models.CharField("DGU / Guvohnoma raqami", max_length=150, null=True, blank=True)
    maqola_link = models.URLField("Maqola havolasi (DOI / Link)", max_length=500, null=True, blank=True, default='')

    @property
    def get_fayl_url(self):
        if self.fayl and hasattr(self.fayl, 'url'):
            try:
                return self.fayl.url
            except Exception:
                pass
        return ''

    def save(self, *args, **kwargs):
        if self.i_id is None:
            last = ilmiy_ishlari.objects.order_by('-i_id').first()
            self.i_id = (last.i_id + 1) if last else 1
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Ilmiy ish"
        verbose_name_plural = "Ilmiy ishlar"

    def __str__(self):
        return f"{self.i_id}. {self.nomi}"


class oquvIshlari(models.Model):
    o_id = models.IntegerField(editable=False, unique=True, null=True, blank=True)
    TURLAR = ('Uslubiy ko`rsatma', 'O`quv qo`llanma', 'Darslik', 'Monografiya')
    turi = models.CharField("Ish turi", max_length=250, choices=[(t, t) for t in TURLAR])
    nomi = models.CharField("Ish nomi", max_length=250)
    haqida = models.TextField("Izoh", null=True, blank=True)
    muallif = models.ForeignKey(Foydalanuvchilar, on_delete=models.CASCADE, verbose_name="Muallif")
    sana = models.DateField("Sana")
    betlar_soni = models.IntegerField("Betlar soni")
    ish_mualliflari= models.TextField("Hammualliflar", null = True)
    fayl = models.FileField("Fayl", upload_to='oquv_ishlari/')
    image = models.ImageField("Muqova rasmi", upload_to='oquv_ishlari_images/', null=True, blank=True)
    foreveryone= models.BooleanField("Hamma ko'ra oladi", default=False)

    @property
    def get_fayl_url(self):
        if self.fayl and hasattr(self.fayl, 'url'):
            try:
                return self.fayl.url
            except Exception:
                pass
        return ''

    @property
    def get_image_url(self):
        if self.image and hasattr(self.image, 'url'):
            try:
                return self.image.url
            except Exception:
                pass
        return '/static/app/app-assets/images/portrait/small/avatar-s-11.png'

    def save(self, *args, **kwargs):
        if self.o_id is None:
            last = oquvIshlari.objects.order_by('-o_id').first()
            self.o_id = (last.o_id + 1) if last else 1
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "O'quv ishi"
        verbose_name_plural = "O'quv ishlari"

    def __str__(self):
        return self.nomi

class video_darslar(models.Model):
    nomi = models.CharField("Dars nomi", max_length=250)
    muallif = models.ForeignKey(Foydalanuvchilar, on_delete=models.CASCADE, verbose_name="Muallif")
    haqida = models.TextField("Izoh", blank=True, null=True)
    video = models.FileField("Video fayl", upload_to='video_darslar/', null=True, blank=True)
    video_link = models.URLField("Video havolasi (YouTube / Link)", max_length=500, null=True, blank=True, default='')
    sana = models.DateField("Sana", null=True)
    foreveryone= models.BooleanField("Hamma ko'ra oladi", default=False)

    @property
    def get_video_url(self):
        if self.video and hasattr(self.video, 'url'):
            try:
                return self.video.url
            except Exception:
                pass
        if self.video_link:
            return self.video_link
        return ''

    @property
    def is_youtube(self):
        if not self.video_link:
            return False
        return 'youtube.com' in self.video_link or 'youtu.be' in self.video_link

    @property
    def youtube_id(self):
        if not self.video_link:
            return ''
        import re
        m = re.search(r'(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})', self.video_link)
        return m.group(1) if m else ''

    @property
    def youtube_embed_url(self):
        y_id = self.youtube_id
        if y_id:
            return f"https://www.youtube.com/embed/{y_id}"
        return self.video_link or ''

    @property
    def youtube_thumbnail_url(self):
        y_id = self.youtube_id
        if y_id:
            return f"https://img.youtube.com/vi/{y_id}/hqdefault.jpg"
        return ''

    class Meta:
        verbose_name = "Video dars"
        verbose_name_plural = "Video darslar"

    def __str__(self):
        return self.nomi

@receiver(post_delete, sender=ilmiy_ishlari)
def reorder_iid_after_delete(sender, instance, **kwargs):
    objects = ilmiy_ishlari.objects.order_by('i_id')
    for index, obj in enumerate(objects, start=1):
        if obj.i_id != index:
            obj.i_id = index
            obj.save()


@receiver(post_delete, sender=oquvIshlari)
def reorder_oid_after_delete(sender, instance, **kwargs):
    objects = oquvIshlari.objects.order_by('o_id')
    for index, obj in enumerate(objects, start=1):
        if obj.o_id != index:
            obj.o_id = index
            obj.save()


class KafedraTalablari(models.Model):
    ISH_TURLARI = (
        ('Scopus', 'Scopus maqola'),
        ('Maqola', 'OAK / Xalqaro maqola'),
        ('Tezis', 'Tezis / Konferensiya'),
        ('Darslik', 'Darslik'),
        ('O`quv qo`llanma', 'O`quv qo`llanma'),
        ('Monografiya', 'Monografiya'),
        ('Uslubiy ko`rsatma', 'Uslubiy ko`rsatma'),
        ('EHM guvohnomalar', 'EHM / Patent'),
        ('Boshqa', 'Boshqa vazifa'),
    )
    kafedra = models.ForeignKey(Kafedralar, on_delete=models.CASCADE, related_name='talablar', verbose_name="Kafedra")
    mudir = models.ForeignKey(Foydalanuvchilar, on_delete=models.CASCADE, related_name='yuklagan_talablari', verbose_name="Kim qo'ygan")
    sarlavha = models.CharField("Sarlavha", max_length=300)
    ish_turi = models.CharField("Ish turi", max_length=100, choices=ISH_TURLARI, default='Maqola')
    talab_miqdori = models.PositiveIntegerField("Talab miqdori", default=1, help_text="Har bir o'qituvchidan talab qilinadigan soni")
    muddati = models.DateField("Muddati", null=True, blank=True)
    tavsif = models.TextField("Tavsif", blank=True, null=True)
    faol = models.BooleanField("Faol", default=True)
    yaratilgan_sana = models.DateTimeField("Yaratilgan sana", auto_now_add=True, null=True)

    class Meta:
        ordering = ['-yaratilgan_sana']
        verbose_name = "Kafedra talabi"
        verbose_name_plural = "Kafedra talablari"

    def __str__(self):
        return f"{self.kafedra.nomi} - {self.sarlavha}"

