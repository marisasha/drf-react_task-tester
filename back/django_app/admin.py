from django.contrib import admin
from django_app import models

admin.site.register(models.Profile)
admin.site.register(models.ProfileRole)
admin.site.register(models.Task)
admin.site.register(models.TaskReport)
admin.site.register(models.TaskChek)
admin.site.register(models.TaskStage)
