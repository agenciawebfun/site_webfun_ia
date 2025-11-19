# Guia de Deploy - Hostinger (Python App)

## Pré-requisitos
- Conta Hostinger com suporte a Python
- Domínio configurado
- Acesso SSH ou painel hPanel

## Passo 1: Preparar arquivos localmente

Já está pronto! Os arquivos foram configurados:
- ✅ `requirements.txt` - dependências
- ✅ `settings.py` - lê variáveis de ambiente
- ✅ `.env.example` - template de configuração

## Passo 2: Upload dos arquivos

Faça upload da pasta `backend/` para o servidor via:
- FTP/SFTP (FileZilla, WinSCP)
- Git (recomendado)
- Painel de arquivos da Hostinger

Estrutura no servidor:
```
~/seu-app/
  backend/
    manage.py
    db.sqlite3
    requirements.txt
    webfun_backend/
    leads/
    .venv/ (será criado)
```

## Passo 3: Configurar Python App no hPanel

1. Acesse hPanel → **Advanced** → **Python App**
2. Clique em **Create Application**
3. Configure:
   - **Python version**: 3.11 ou superior
   - **Application root**: `backend`
   - **Application URL**: seu domínio
   - **Application startup file**: `webfun_backend/wsgi.py`
   - **Application Entry point**: `application`

## Passo 4: Configurar variáveis de ambiente

No painel Python App, adicione as variáveis:

```
DJANGO_SETTINGS_MODULE=webfun_backend.settings
SECRET_KEY=gere-uma-chave-nova-aqui-use-python-secrets
DEBUG=False
ALLOWED_HOSTS=seudominio.com,www.seudominio.com
CSRF_TRUSTED_ORIGINS=https://seudominio.com,https://www.seudominio.com
CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=https://seudominio.com
```

**Gerar SECRET_KEY segura:**
```python
import secrets
print(secrets.token_urlsafe(50))
```

## Passo 5: Instalar dependências via SSH

Conecte via SSH e execute:

```bash
cd ~/seu-app/backend
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

## Passo 6: Preparar banco e arquivos estáticos

```bash
cd ~/seu-app/backend
source .venv/bin/activate

# Aplicar migrações
python manage.py migrate

# Coletar arquivos estáticos
python manage.py collectstatic --noinput

# Criar superusuário para acessar /admin
python manage.py createsuperuser
```

## Passo 7: Configurar arquivos estáticos

No hPanel, configure:
- **Static files path**: `/staticfiles`
- **Static files URL**: `/static/`

Ou adicione no `.htaccess` (se usar Apache):
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^static/(.*)$ staticfiles/$1 [L]
</IfModule>
```

## Passo 8: Reiniciar aplicação

No painel Python App, clique em **Restart Application**

## Passo 9: Testar

Acesse:
- Site: `https://seudominio.com`
- Admin: `https://seudominio.com/admin`
- API Leads (se existir): `https://seudominio.com/api/leads/`

## Troubleshooting

### Erro 500 - Internal Server Error
- Verifique logs no hPanel (Python App → Logs)
- Confirme que `DEBUG=False` e `ALLOWED_HOSTS` está correto
- Verifique permissões do arquivo `db.sqlite3` (chmod 664)

### Static files não carregam
- Execute `python manage.py collectstatic --noinput`
- Verifique configuração de Static files no hPanel
- Confirme STATIC_ROOT em settings.py

### CSRF verification failed
- Adicione seu domínio em `CSRF_TRUSTED_ORIGINS`
- Formato: `https://seudominio.com` (com https://)

### Database is locked
- SQLite não suporta muita concorrência
- Para tráfego alto, migre para PostgreSQL/MySQL

## Manutenção

### Backup do banco
```bash
cp ~/seu-app/backend/db.sqlite3 ~/backups/db_$(date +%Y%m%d).sqlite3
```

### Ver logs
```bash
tail -f ~/logs/python_app_error.log
```

### Atualizar código
```bash
cd ~/seu-app/backend
git pull  # se usar git
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
# Reiniciar app no hPanel
```

## Segurança

- ✅ Nunca commite `.env` ou chaves secretas no Git
- ✅ Use HTTPS (Hostinger oferece SSL grátis)
- ✅ Mantenha `DEBUG=False` em produção
- ✅ Configure backup automático do db.sqlite3
- ✅ Limite CORS apenas aos domínios necessários

## Suporte

Dúvidas? Consulte:
- Hostinger: https://support.hostinger.com/
- Django Deployment: https://docs.djangoproject.com/en/5.2/howto/deployment/
