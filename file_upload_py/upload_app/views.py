import os
from django.conf import settings
from django.http import JsonResponse, HttpResponse, Http404
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from .models import File

@csrf_exempt
def upload_file(request):
    if request.method == 'POST':
        file = request.FILES['file']
        file_instance = File(name=file.name)
        file_instance.save()

        # Save file to the uploads directory
        file_path = os.path.join(settings.MEDIA_ROOT, file.name)
        with open(file_path, 'wb+') as destination:
            for chunk in file.chunks():
                destination.write(chunk)

        return JsonResponse({'message': 'File uploaded successfully', 'fileName': file.name})

    return JsonResponse({'error': 'Invalid request'}, status=400)

def get_files(request):
    files = File.objects.all().values('id', 'name', 'upload_time')
    return JsonResponse(list(files), safe=False)

def download_file(request, file_id):
    try:
        file = File.objects.get(pk=file_id)
        file_path = os.path.join(settings.MEDIA_ROOT, file.name)

        if os.path.exists(file_path):
            with open(file_path, 'rb') as fh:
                response = HttpResponse(fh.read(), content_type="application/octet-stream")
                response['Content-Disposition'] = 'inline; filename=' + os.path.basename(file_path)
                return response
        else:
            raise Http404
    except File.DoesNotExist:
        raise Http404

@csrf_exempt
def delete_file(request, file_id):
    try:
        file = File.objects.get(pk=file_id)
        file_path = os.path.join(settings.MEDIA_ROOT, file.name)

        if os.path.exists(file_path):
            os.remove(file_path)

        file.delete()
        return JsonResponse({'message': 'File deleted successfully'})
    except File.DoesNotExist:
        return JsonResponse({'error': 'File not found'}, status=404)
