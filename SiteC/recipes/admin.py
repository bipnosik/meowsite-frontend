from django.contrib import admin
from .models import Recipe

# Регистрируем модель Recipe в админке
admin.site.register(Recipe)
