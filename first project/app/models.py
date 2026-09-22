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
    foydalanuvchi_rol = models.CharField(max_length=50, choices=ROLES)
    kafedra = models.ForeignKey(
        'Kafedralar',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='foydalanuvchilari'
    )
    fakulteti = models.ForeignKey(
        'Dekanatlar',
        on_delete = models.CASCADE,
        null=True,
        blank=True,
        related_name='fakulteti'
    )
    ism = models.CharField(max_length=250)
    familiya = models.CharField(max_length=250)
    sharifi = models.CharField(max_length=250)
    ilmiy_daraja= models.CharField(max_length=250, default='Bakalavr', blank=True)
    gmail= models.EmailField(max_length=250, null=True)
    haqida= models.TextField(null=True, blank=True)
    tugulgan_sana = models.DateField()
    login_f=models.CharField(max_length=250)
    parol=models.CharField(max_length=250)
    image=models.ImageField(upload_to='foydalanuvchilar/', null=True, blank=True)
    accepted=models.BooleanField(default=False)
    created=models.BooleanField(default=True,editable=False)

    @property
    def get_image_url(self):
        if self.image and hasattr(self.image, 'url'):
            try:
                return self.image.url
            except Exception:
                pass
        return '/static/app/app-assets/images/portrait/small/avatar-s-11.png'

    def __str__(self):
        return f"{self.ism} {self.familiya} {self.sharifi}"


class Kafedralar(models.Model):
    nomi = models.CharField(max_length=250)
    fakultet= models.ForeignKey('Dekanatlar',
                                on_delete=models.SET_NULL,
                                related_name='fakultet',
                                null= True,
                                blank=True)
    mudir = models.ForeignKey(
        'Foydalanuvchilar',
        on_delete=models.SET_NULL,
        related_name='kafedra_mudiri',
        null=True,
        blank=True
    )
    oqituvchilar = models.ManyToManyField(
        'Foydalanuvchilar',
        related_name='kafedra_oqituvchilari',
        blank=True
    )
    def __str__(self):
        return self.nomi
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        foydalanuvchilar = Foydalanuvchilar.objects.filter(kafedra=self)
        self.oqituvchilar.set(foydalanuvchilar)



class Dekanatlar(models.Model):
    nomi = models.CharField(max_length=250)
    dekan = models.ForeignKey(
        'Foydalanuvchilar',
        on_delete=models.SET_NULL,
        related_name='dekan',
        null=True,
        blank=True
    )
    kafedralar = models.ManyToManyField(
        Kafedralar,
        related_name='dekanat_kafedralari',
        blank=True
    )

    def __str__(self):
        return self.nomi

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        self.kafedralar.set(self.kafedralar.all())


class ilmiy_ishlari(models.Model):
    i_id = models.IntegerField(editable=False, unique=True, null=True, blank=True)
    TURLAR = ('Scopus', 'Maqola', 'Tezis', 'EHM guvohnomalar', 'patent')
    turi = models.CharField(max_length=250, choices=[(t, t) for t in TURLAR])
    nomi = models.CharField(max_length=250)
    muallif = models.ForeignKey(Foydalanuvchilar, on_delete=models.CASCADE)
    ish_mualliflari= models.TextField(null = True)
    sana = models.DateField()
    haqida = models.TextField(null=True, blank=True)
    kategoriya = models.CharField(
        max_length=250,
        choices=[('Xalqaro', 'Xalqaro'), ('Respublika', 'Respublika')],
        null=True
    )
    fayl = models.FileField(upload_to='ilmiy_ishlari/')
    foreveryone= models.BooleanField(default=False)
    def save(self, *args, **kwargs):
        if self.i_id is None:
            last = ilmiy_ishlari.objects.order_by('-i_id').first()
            self.i_id = (last.i_id + 1) if last else 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.i_id}. {self.nomi}"


class oquvIshlari(models.Model):
    o_id = models.IntegerField(editable=False, unique=True, null=True, blank=True)
    TURLAR = ('Uslubiy ko`rsatma', 'O`quv qo`llanma', 'Darslik', 'Monografiya')
    turi = models.CharField(max_length=250, choices=[(t, t) for t in TURLAR])
    nomi = models.CharField(max_length=250)
    haqida = models.TextField(null=True, blank=True)
    muallif = models.ForeignKey(Foydalanuvchilar, on_delete=models.CASCADE)
    sana = models.DateField()
    betlar_soni = models.IntegerField()
    ish_mualliflari= models.TextField(null = True)
    fayl = models.FileField(upload_to='oquv_ishlari/')
    image = models.ImageField(upload_to='oquv_ishlari_images/', null=True, blank=True)
    foreveryone= models.BooleanField(default=False)
    def save(self, *args, **kwargs):
        if self.o_id is None:
            last = oquvIshlari.objects.order_by('-o_id').first()
            self.o_id = (last.o_id + 1) if last else 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.nomi

class video_darslar(models.Model):
    nomi = models.CharField(max_length=250)
    muallif = models.ForeignKey(Foydalanuvchilar, on_delete=models.CASCADE)
    haqida = models.TextField(blank=True, null=True)
    video = models.FileField(upload_to='video_darslar/')
    sana = models.DateField(null=True)
    foreveryone= models.BooleanField(default=False)
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
    kafedra = models.ForeignKey(Kafedralar, on_delete=models.CASCADE, related_name='talablar')
    mudir = models.ForeignKey(Foydalanuvchilar, on_delete=models.CASCADE, related_name='yuklagan_talablari')
    sarlavha = models.CharField(max_length=300)
    ish_turi = models.CharField(max_length=100, choices=ISH_TURLARI, default='Maqola')
    talab_miqdori = models.PositiveIntegerField(default=1, help_text="Har bir o'qituvchidan talab qilinadigan soni")
    muddati = models.DateField(null=True, blank=True)
    tavsif = models.TextField(blank=True, null=True)
    faol = models.BooleanField(default=True)
    yaratilgan_sana = models.DateTimeField(auto_now_add=True, null=True)

    class Meta:
        ordering = ['-yaratilgan_sana']

    def __str__(self):
        return f"{self.kafedra.nomi} - {self.sarlavha}"

