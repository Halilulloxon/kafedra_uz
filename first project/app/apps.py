from django.apps import AppConfig


class YourAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'
    verbose_name = "Kafedralar.uz ma'lumotlari"

    def ready(self):
        import app.signals