# Deploy Django Backend no Railway.app 🚀

Guia completo para fazer deploy do backend Django no Railway.app (hosting gratuito com PostgreSQL).

## 📋 Pré-requisitos

- Conta no GitHub
- Conta no Railway.app (criar em https://railway.app)
- Repositório Git com o código do backend

## 🔧 Passo 1: Preparar o Repositório

### 1.1 Inicializar Git (se ainda não tiver)

```powershell
cd backend
git init
git add .
git commit -m "Initial commit - Django backend"
```

### 1.2 Criar Repositório no GitHub

1. Acesse https://github.com/new
2. Nome: `webfun-backend` (ou outro nome de sua preferência)
3. **NÃO** marque "Initialize with README" (já temos arquivos)
4. Clique em "Create repository"

### 1.3 Conectar ao GitHub

```powershell
git remote add origin https://github.com/SEU-USUARIO/webfun-backend.git
git branch -M main
git push -u origin main
```

## 🚂 Passo 2: Deploy no Railway

### 2.1 Criar Projeto no Railway

1. Acesse https://railway.app e faça login
2. Clique em "New Project"
3. Selecione "Deploy from GitHub repo"
4. Autorize o Railway a acessar sua conta GitHub
5. Selecione o repositório `webfun-backend`

### 2.2 Adicionar PostgreSQL

1. No dashboard do projeto, clique em "+ New"
2. Selecione "Database" → "Add PostgreSQL"
3. Railway criará automaticamente um banco PostgreSQL
4. A variável `DATABASE_URL` será criada automaticamente

### 2.3 Configurar Variáveis de Ambiente

No painel do seu serviço Django, vá em "Variables" e adicione:

```env
# Django Secret Key (gerar nova chave segura)
SECRET_KEY=sua-chave-super-secreta-aqui-min-50-caracteres

# Modo de produção
DEBUG=False

# Hosts permitidos (será preenchido automaticamente, mas pode adicionar custom domain)
ALLOWED_HOSTS=*.railway.app,seudominio.com

# CORS - permitir seu frontend Hostinger
CORS_ALLOW_ALL_ORIGINS=False
CORS_ALLOWED_ORIGINS=https://seusite.com.br

# CSRF - adicionar domínio Railway + domínio frontend
CSRF_TRUSTED_ORIGINS=https://*.railway.app,https://seusite.com.br
```

**⚠️ IMPORTANTE - Gerar SECRET_KEY segura:**

```powershell
# Dentro do venv do backend:
.venv\Scripts\python.exe -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copie o resultado e cole em `SECRET_KEY`.

### 2.4 Deploy Automático

1. Railway detectará automaticamente os arquivos:
   - `Procfile`: Define o comando web
   - `railway.json`: Configuração de build
   - `runtime.txt`: Versão do Python
   - `requirements.txt`: Dependências

2. O deploy iniciará automaticamente e executará:
   ```bash
   python manage.py migrate
   python manage.py collectstatic --noinput
   gunicorn webfun_backend.wsgi
   ```

3. Aguarde a conclusão (1-3 minutos)

## 👤 Passo 3: Criar Superusuário

### Opção A: Via Railway CLI (Recomendado)

1. Instalar Railway CLI:
   ```powershell
   npm i -g @railway/cli
   # ou
   brew install railway  # macOS/Linux
   ```

2. Fazer login:
   ```powershell
   railway login
   ```

3. Conectar ao projeto:
   ```powershell
   cd backend
   railway link
   ```

4. Criar superusuário:
   ```powershell
   railway run python manage.py createsuperuser
   ```

### Opção B: Via Terminal Web do Railway

1. No dashboard do Railway, clique no serviço Django
2. Vá em "Settings" → "Deploy" → "Shell"
3. Execute:
   ```bash
   python manage.py createsuperuser
   ```

Preencha:
- Username: `admin`
- Email: `seu-email@example.com`
- Password: (senha segura, min 8 caracteres)

## 🌐 Passo 4: Obter URL do Backend

1. No dashboard do Railway, clique no serviço Django
2. Vá em "Settings" → "Domains"
3. Clique em "Generate Domain"
4. Railway gerará uma URL tipo: `webfun-backend-production.up.railway.app`

## ✅ Passo 5: Testar o Backend

### 5.1 Acessar Admin

Abra no navegador:
```
https://SEU-DOMINIO.railway.app/admin/
```

Faça login com o superusuário criado.

### 5.2 Testar API de Leads

```bash
curl -X POST https://SEU-DOMINIO.railway.app/api/leads/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste Railway",
    "email": "teste@railway.com",
    "phone": "11999999999",
    "message": "Testando API no Railway"
  }'
```

Deverá retornar status 201 Created.

### 5.3 Verificar no Admin

Acesse `/admin/leads/lead/` para ver o lead criado.

## 🔗 Passo 6: Conectar Frontend

Atualizar o formulário de contato no `index.html`:

```html
<form id="contactForm" action="https://SEU-DOMINIO.railway.app/api/leads/" method="POST">
  <!-- campos do formulário -->
</form>
```

Ou via JavaScript (recomendado para feedback visual):

```javascript
const form = document.getElementById('contactForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await fetch('https://SEU-DOMINIO.railway.app/api/leads/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      alert('Mensagem enviada com sucesso!');
      form.reset();
    }
  } catch (error) {
    alert('Erro ao enviar mensagem. Tente novamente.');
  }
});
```

## 🔄 Atualizações Futuras

Sempre que fizer alterações no código:

```powershell
git add .
git commit -m "Descrição da alteração"
git push
```

Railway fará deploy automático após o push.

## 📊 Monitoramento

- **Logs**: Railway → Seu serviço → "Deployments" → Ver logs
- **Metrics**: Railway → Seu serviço → "Metrics" (CPU, Memory, Network)
- **Database**: Railway → PostgreSQL → "Data" (visualizar tabelas)

## 🆘 Troubleshooting

### Erro 500 Internal Server Error

```powershell
# Ver logs no Railway CLI:
railway logs

# Comandos úteis:
railway run python manage.py check  # Verificar configuração
railway run python manage.py migrate --plan  # Ver migrações pendentes
```

### Variáveis de Ambiente não funcionando

Verifique se as variáveis estão no formato correto (sem espaços extras) e reinicie o deploy:
```powershell
railway up  # Forçar novo deploy
```

### CORS ou CSRF errors

Certifique-se de que `CORS_ALLOWED_ORIGINS` e `CSRF_TRUSTED_ORIGINS` incluem:
- O domínio Railway: `https://*.railway.app`
- Seu domínio frontend: `https://seusite.com.br`

## 💰 Plano Gratuito Railway

- **$5 de crédito gratuito por mês** (suficiente para hobby projects)
- PostgreSQL incluído
- Deploy automático via GitHub
- Hibernação após 24h de inatividade (acordará no primeiro request)

## 🎉 Pronto!

Seu backend Django está rodando no Railway com:
- ✅ PostgreSQL configurado
- ✅ HTTPS automático
- ✅ Deploy automático via GitHub
- ✅ Admin Django acessível
- ✅ API de leads funcionando

**URL do Admin:** `https://SEU-DOMINIO.railway.app/admin/`  
**URL da API:** `https://SEU-DOMINIO.railway.app/api/leads/`
