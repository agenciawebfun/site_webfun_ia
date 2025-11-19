#!/usr/bin/env python
"""
Script para criar superusuário automaticamente no Render
Execute apenas uma vez após o deploy
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'webfun_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Credenciais do superusuário (ALTERE DEPOIS DO PRIMEIRO LOGIN!)
username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@webfun.com')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123456')  # MUDE ISSO!

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f'✅ Superusuário "{username}" criado com sucesso!')
else:
    print(f'ℹ️  Superusuário "{username}" já existe.')
