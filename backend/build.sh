#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate

# Criar superusuário automaticamente (apenas se não existir)
python create_superuser.py
