from django.contrib import admin
from django.urls import path
from upload_app import views

urlpatterns = [
    path('admin', admin.site.urls),
    path('upload', views.upload_file, name='upload_file'),
    path('files', views.get_files, name='get_files'),
    path('download/<int:file_id>', views.download_file, name='download_file'),
    path('files/<int:file_id>', views.delete_file, name='delete_file'),
]
