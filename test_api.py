import requests
import json

url = 'http://127.0.0.1:8000/api/leads/'
data = {
    'name': 'Teste API',
    'email': 'teste@api.com',
    'phone': '11999999999',
    'message': 'Teste da API do formulário'
}

try:
    response = requests.post(url, json=data, timeout=5)
    print(f'Status: {response.status_code}')
    print(f'Response: {response.json()}')
except Exception as e:
    print(f'Erro: {e}')