# Generated by Django 5.1.3 on 2024-11-12 03:58

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('django_app', '0004_remove_taskstage_is_creation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='taskchek',
            name='task',
            field=models.OneToOneField(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='task_check', to='django_app.task', verbose_name='Задание'),
        ),
    ]
