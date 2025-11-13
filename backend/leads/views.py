from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Lead


@csrf_exempt
def create_lead(request):
    if request.method == 'GET':
        # Return the most recent 100 leads as a convenience for viewing
        leads = Lead.objects.order_by('-created_at')[:100]
        data = [
            {
                'id': l.id,
                'name': l.name,
                'email': l.email,
                'phone': l.phone,
                'message': l.message,
                'created_at': l.created_at.isoformat(),
            }
            for l in leads
        ]
        return JsonResponse({'results': data}, status=200)
    if request.method != 'POST':
        return JsonResponse({'detail': 'Method not allowed'}, status=405)
    try:
        if request.headers.get('Content-Type', '').startswith('application/json'):
            data = json.loads(request.body.decode('utf-8'))
        else:
            # Fallback to form-encoded
            data = request.POST.dict()
    except Exception:
        return JsonResponse({'detail': 'Invalid body'}, status=400)

    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip()
    phone = (data.get('phone') or '').strip()
    message = (data.get('message') or '').strip()

    if not name or not email:
        return JsonResponse({'detail': 'name and email are required'}, status=400)

    lead = Lead.objects.create(name=name, email=email, phone=phone, message=message)
    return JsonResponse({'id': lead.id, 'created_at': lead.created_at.isoformat()}, status=201)
from django.shortcuts import render

# Create your views here.
