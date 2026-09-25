"""
Definition of forms.
"""

from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.utils.translation import gettext_lazy as _

class BootstrapAuthenticationForm(AuthenticationForm):
    """Authentication form which uses boostrap CSS."""
    username = forms.CharField(max_length=254,
                               widget=forms.TextInput({
                                   'class': 'form-control',
                                   'placeholder': 'User name'}))
    password = forms.CharField(label=_("Password"),
                               widget=forms.PasswordInput({
                                   'class': 'form-control',
                                   'placeholder':'Password'}))
from django import forms
from .models import ilmiy_ishlari as Ilmiy, oquvIshlari as Oquv, video_darslar as Video  

import os
from django.core.exceptions import ValidationError

DANGEROUS_EXTENSIONS = {'.php', '.phtml', '.php5', '.py', '.sh', '.bat', '.exe', '.js', '.jsp', '.cgi', '.html', '.htm', '.htaccess'}

def validate_safe_document(file_obj):
    if not file_obj:
        return file_obj
    ext = os.path.splitext(file_obj.name)[1].lower()
    if ext in DANGEROUS_EXTENSIONS:
        raise ValidationError("Xavfsizlik talabi: Ushbu turdagi fayllarni yuklash taqiqlangan!")
    allowed = {'.pdf', '.doc', '.docx', '.zip', '.rar', '.ppt', '.pptx', '.xls', '.xlsx', '.txt'}
    if ext not in allowed:
        raise ValidationError(f"Faqat quyidagi turdagi fayllar qabul qilinadi: {', '.join(allowed)}")
    if file_obj.size > 50 * 1024 * 1024:
        raise ValidationError("Fayl hajmi 50 MB dan oshmasligi kerak!")
    return file_obj

def validate_safe_image(img_obj):
    if not img_obj:
        return img_obj
    ext = os.path.splitext(img_obj.name)[1].lower()
    allowed = {'.jpg', '.jpeg', '.png', '.webp', '.gif'}
    if ext not in allowed:
        raise ValidationError("Faqat rasm fayllari (.jpg, .jpeg, .png, .webp) yuklanishi mumkin!")
    if img_obj.size > 10 * 1024 * 1024:
        raise ValidationError("Rasm hajmi 10 MB dan oshmasligi kerak!")
    return img_obj

def validate_safe_video(video_obj):
    if not video_obj:
        return video_obj
    ext = os.path.splitext(video_obj.name)[1].lower()
    allowed = {'.mp4', '.mkv', '.avi', '.mov', '.webm'}
    if ext not in allowed:
        raise ValidationError("Faqat video fayllari (.mp4, .mkv, .avi, .mov, .webm) yuklanishi mumkin!")
    if video_obj.size > 250 * 1024 * 1024:
        raise ValidationError("Video hajmi 250 MB dan oshmasligi kerak!")
    return video_obj


class IlmiyForm(forms.ModelForm):
    class Meta:
        model = Ilmiy
        fields = ['turi', 'nomi', 'haqida', 'muallif', 'ish_mualliflari', 'sana', 'kategoriya', 'fayl', 'foreveryone', 'dgu_raqami']

    def clean_fayl(self):
        return validate_safe_document(self.cleaned_data.get('fayl'))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs.update({
                'class': 'form-control',
                'style': 'border-radius:8px; padding:8px; font-size:14px;'
            })
        if 'dgu_raqami' in self.fields:
            self.fields['dgu_raqami'].widget.attrs.update({
                'placeholder': 'Masalan: № DGU 21495'
            })

class OquvForm(forms.ModelForm):
    class Meta:
        model = Oquv
        fields = ['turi', 'nomi', 'haqida', 'muallif', 'ish_mualliflari', 'sana', 'betlar_soni', 'fayl', 'foreveryone', 'image']

    def clean_fayl(self):
        return validate_safe_document(self.cleaned_data.get('fayl'))

    def clean_image(self):
        return validate_safe_image(self.cleaned_data.get('image'))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs.update({
                'class': 'form-control',
                'style': 'border-radius:8px; padding:8px; font-size:14px;'
            })

class VideoForm(forms.ModelForm):
    class Meta:
        model = Video
        fields = ['nomi', 'muallif', 'haqida', 'video', 'sana', 'foreveryone']
        widgets = {
            'sana': forms.DateInput(attrs={'type': 'date'}),
            'haqida': forms.Textarea(attrs={'rows': 3, 'placeholder': 'Video dars haqida qisqacha ma\'lumot...'}),
            'nomi': forms.TextInput(attrs={'placeholder': 'Video dars mavzusi / nomi'}),
        }

    def clean_video(self):
        return validate_safe_video(self.cleaned_data.get('video'))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for name, field in self.fields.items():
            if name == 'foreveryone':
                field.widget.attrs.update({
                    'class': 'form-check-input',
                    'style': 'width:20px; height:20px; cursor:pointer;'
                })
            else:
                field.widget.attrs.update({
                    'class': 'form-control',
                    'style': 'border-radius:8px; padding:8px; font-size:14px;'
                })




from .models import KafedraTalablari

class KafedraTalablariForm(forms.ModelForm):
    class Meta:
        model = KafedraTalablari
        fields = ['sarlavha', 'ish_turi', 'talab_miqdori', 'muddati', 'tavsif', 'faol']
        widgets = {
            'muddati': forms.DateInput(attrs={'type': 'date'}),
            'tavsif': forms.Textarea(attrs={'rows': 3}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs.update({
                'class': 'form-control',
                'style': 'border-radius:8px; padding:8px; font-size:14px;'
            })

