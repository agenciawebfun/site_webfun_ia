# Deploy Django Backend no Render.com 🚀

Guia completo para fazer deploy do backend Django no Render.com (hosting **100% GRATUITO** com PostgreSQL).

## 🎁 Por que Render.com?

- ✅ **Completamente gratuito** (750 horas/mês - suficiente para rodar 24/7)
- ✅ PostgreSQL gratuito incluído
- ✅ Deploy automático via GitHub
- ✅ HTTPS automático
- ✅ Sem limitações de trial
- ✅ Melhor que Railway para planos free

## 📋 Pré-requisitos

- Conta no GitHub (já tem ✅)
- Código no GitHub (já está ✅)
- Conta no Render.com (criar em https://render.com)

## 🚀 Passo a Passo Completo

### 1️⃣ Criar Conta no Render

1. Acesse: https://render.com
2. Clique em "Get Started" ou "Sign Up"
3. **Conecte com GitHub** (mais fácil)
4. Autorize o Render a acessar seus repositórios

### 2️⃣ Criar PostgreSQL Database

1. No dashboard do Render, clique em **"New +"** (canto superior direito)
2. Selecione **"PostgreSQL"**
3. Configure:
   - **Name**: `webfun-db`
   - **Database**: `webfun_db`
   - **User**: `webfun_user` (ou deixe o padrão)
   - **Region**: escolha o mais próximo (ex: Oregon, USA)
   - **Plan**: **Free** ✅
4. Clique em **"Create Database"**
5. Aguarde 1-2 minutos até ficar "Available"
6. **⚠️ IMPORTANTE**: Na página do database, copie a **"Internal Database URL"** (vamos usar depois)

### 3️⃣ Criar Web Service (Django)

1. No dashboard, clique em **"New +"** novamente
2. Selecione **"Web Service"**
3. Conecte seu repositório:
   - Selecione **"Build and deploy from a Git repository"**
   - Clique em "Next"
   - Encontre e selecione: `agenciawebfun/site_webfun_ia`
   - Clique em "Connect"

4. Configure o serviço:
   - **Name**: `webfun-backend` (ou outro nome)
   - **Region**: mesmo do database (ex: Oregon)
   - **Branch**: `main`
   - **Root Directory**: `backend` ⚠️ **IMPORTANTE**
   - **Runtime**: **Python 3**
   - **Build Command**: `./build.sh` (vamos criar esse arquivo)
   - **Start Command**: `gunicorn webfun_backend.wsgi:application`
   - **Plan**: **Free** ✅

5. **NÃO clique em "Create Web Service" ainda!** Antes, vamos adicionar as variáveis de ambiente 👇

### 4️⃣ Configurar Variáveis de Ambiente

Na mesma página de configuração, role até **"Environment Variables"** e adicione:

#### 4.1 Gerar SECRET_KEY

No seu computador, execute:
```powershell
cd "c:\Users\felipe.pedroso\Downloads\Projeto Integrador - Webfun IA - Final\backend"
.venv\Scripts\python.exe -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copie o resultado.

#### 4.2 Adicionar Variáveis

Clique em "Add Environment Variable" e adicione cada uma:

| Key | Value |
|-----|-------|
| `SECRET_KEY` | Cole a chave gerada acima |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `*` (por enquanto, depois ajustamos) |
| `DATABASE_URL` | Cole a **Internal Database URL** do PostgreSQL |
| `CORS_ALLOW_ALL_ORIGINS` | `False` |
| `CORS_ALLOWED_ORIGINS` | `https://seusite.com.br` (seu domínio Hostinger) |
| `CSRF_TRUSTED_ORIGINS` | `https://webfun-backend.onrender.com,https://seusite.com.br` |
| `PYTHON_VERSION` | `3.11.9` |

**⚠️ Nota**: Após o deploy, o Render vai te dar uma URL tipo `https://webfun-backend.onrender.com`. Depois você volta e atualiza `CSRF_TRUSTED_ORIGINS` com essa URL real.

### 5️⃣ Criar Script de Build

Antes de clicar em "Create Web Service", precisamos criar o arquivo `build.sh`:

**No seu computador:**

```powershell
cd "c:\Users\felipe.pedroso\Downloads\Projeto Integrador - Webfun IA - Final\backend"
```

Crie o arquivo `build.sh` com este conteúdo:

```bash
#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --no-input
python manage.py migrate
```

Salve, commite e envie ao GitHub:

```powershell
git add build.sh
git commit -m "Add Render build script"
git push origin main
```

### 6️⃣ Iniciar Deploy

1. Agora sim, clique em **"Create Web Service"**
2. O Render vai:
   - Clonar seu repositório
   - Executar `build.sh` (instalar deps, collectstatic, migrate)
   - Iniciar o gunicorn
   - Atribuir uma URL pública

3. Aguarde 3-5 minutos (primeira build demora mais)
4. Quando aparecer "Live" em verde ✅, seu backend está no ar!

### 7️⃣ Obter URL do Backend

1. Na página do seu web service, você verá a URL no topo:
   ```
   https://webfun-backend.onrender.com
   ```
2. Copie essa URL

### 8️⃣ Atualizar CSRF_TRUSTED_ORIGINS

1. No Render, vá em seu web service
2. Clique em **"Environment"** (menu lateral)
3. Edite `CSRF_TRUSTED_ORIGINS`:
   ```
   https://webfun-backend.onrender.com,https://seusite.com.br
   ```
4. Clique em "Save Changes"
5. Aguarde o redeploy automático (~1 min)

### 9️⃣ Criar Superusuário (Admin Django)

#### Opção A: Via Render Shell (Web)

1. No seu web service no Render, clique em **"Shell"** (menu lateral)
2. Aguarde o terminal carregar
3. Execute:
   ```bash
   python manage.py createsuperuser
   ```
4. Preencha:
   - Username: `admin`
   - Email: `seu-email@example.com`
   - Password: (senha segura)

#### Opção B: Via Render CLI (Local)

```powershell
# Instalar Render CLI
npm install -g @render-cli/cli

# Login
render login

# Conectar ao serviço
render shell webfun-backend

# Criar superuser
python manage.py createsuperuser
```

### 🔟 Testar o Backend

#### 10.1 Acessar Admin

Abra no navegador:
```
https://webfun-backend.onrender.com/admin/
```

Faça login com o superusuário criado.

#### 10.2 Testar API de Leads

```powershell
curl -X POST https://webfun-backend.onrender.com/api/leads/ `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"Teste Render\",\"email\":\"teste@render.com\",\"phone\":\"11999999999\",\"message\":\"Testando API\"}'
```

Ou use o Postman/Insomnia com:
- **Method**: POST
- **URL**: `https://webfun-backend.onrender.com/api/leads/`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "name": "Teste Render",
    "email": "teste@render.com",
    "phone": "11999999999",
    "message": "Testando API no Render"
  }
  ```

Deverá retornar **201 Created**.

#### 10.3 Verificar no Admin

Acesse `/admin/leads/lead/` para ver o lead criado.

## 🔗 Conectar ao Frontend

Atualize o formulário no `index.html`:

```javascript
const form = document.getElementById('contactForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await fetch('https://webfun-backend.onrender.com/api/leads/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      alert('Mensagem enviada com sucesso!');
      form.reset();
    } else {
      alert('Erro ao enviar mensagem. Tente novamente.');
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
git push origin main
```

O Render fará **deploy automático** em ~2 minutos.

## 📊 Monitoramento

- **Logs**: Render → Seu serviço → "Logs" (tempo real)
- **Metrics**: Render → Seu serviço → "Metrics" (CPU, Memory, Requests)
- **Database**: Render → PostgreSQL → "Info" (conexões, tamanho)

## 🆘 Troubleshooting

### ⚠️ Service Unavailable / Cold Start

O plano free "hiberna" após 15 minutos de inatividade. O primeiro acesso após hibernar leva ~30-60 segundos para "acordar". É normal!

### Erro 500 / Build Failed

1. Veja os logs: Render → "Logs" → "Deploy logs"
2. Comandos úteis via Shell:
   ```bash
   python manage.py check
   python manage.py showmigrations
   ```

### CORS ou CSRF Errors

Certifique-se de que:
- `CORS_ALLOWED_ORIGINS` inclui seu domínio frontend
- `CSRF_TRUSTED_ORIGINS` inclui tanto a URL do Render quanto seu domínio frontend
- Ambas URLs começam com `https://`

### Database Connection Error

Verifique se `DATABASE_URL` está correta (copie a **Internal Database URL** do PostgreSQL no Render).

## 💰 Plano Gratuito Render

- ✅ **750 horas por mês** (suficiente para 31 dias 24/7)
- ✅ PostgreSQL com 1GB de storage
- ✅ Deploy automático ilimitado
- ✅ HTTPS gratuito
- ⚠️ Hibernação após 15 min de inatividade (acordar leva ~30s)
- ⚠️ Builds limitadas a 500 minutos/mês (mais que suficiente)

## 🎉 Pronto!

Seu backend Django está rodando no Render com:
- ✅ PostgreSQL gratuito configurado
- ✅ HTTPS automático
- ✅ Deploy automático via GitHub
- ✅ Admin Django acessível
- ✅ API de leads funcionando

**URL do Admin:** `https://webfun-backend.onrender.com/admin/`  
**URL da API:** `https://webfun-backend.onrender.com/api/leads/`

---

## 🆚 Render vs Railway

| Recurso | Render (Free) | Railway (Free) |
|---------|---------------|----------------|
| **Custo** | 100% Grátis | $5 crédito/mês |
| **Limitações** | Cold start (15min) | Trial limitado |
| **PostgreSQL** | 1GB grátis | Incluído |
| **Uptime** | 750h/mês | Limitado |
| **Recomendação** | ✅ **Melhor para começar** | ⚠️ Limitado agora |
