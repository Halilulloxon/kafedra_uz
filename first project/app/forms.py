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

class IlmiyForm(forms.ModelForm):
    class Meta:
        model = Ilmiy
        fields = ['turi', 'nomi', 'haqida', 'muallif', 'ish_mualliflari', 'sana', 'kategoriya', 'fayl', 'foreveryone']

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs.update({
                'class': 'form-control',
                'style': 'border-radius:8px; padding:8px; font-size:14px;'
            })

class OquvForm(forms.ModelForm):
    class Meta:
        model = Oquv
        fields = ['turi', 'nomi', 'haqida', 'muallif', 'ish_mualliflari', 'sana', 'betlar_soni', 'fayl', 'foreveryone', 'image']
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
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        for field in self.fields.values():
            field.widget.attrs.update({
                'class': 'form-control',
                'style': 'border-radius:8px; padding:8px; font-size:14px;'
            })
