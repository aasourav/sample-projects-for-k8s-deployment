from django.db import models

class File(models.Model):
    name = models.CharField(max_length=255)
    upload_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
