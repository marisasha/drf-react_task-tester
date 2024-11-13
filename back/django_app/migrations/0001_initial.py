# Generated by Django 5.1.3 on 2024-11-11 21:00

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('task_text', models.TextField(blank=True, verbose_name='Тех.задание')),
                ('author', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='authored_tasks', to=settings.AUTH_USER_MODEL, verbose_name='Автор задания')),
                ('executor', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='executed_tasks', to=settings.AUTH_USER_MODEL, verbose_name='Исполнитель задания')),
                ('inspector', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='inspected_tasks', to=settings.AUTH_USER_MODEL, verbose_name='Проверяющий задания')),
            ],
            options={
                'verbose_name': 'Задача',
                'verbose_name_plural': 'Задачи',
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='TaskChek',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.TextField(blank=True, verbose_name='Отчет ')),
                ('task', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='task_check', to='django_app.task', verbose_name='Задание')),
            ],
            options={
                'verbose_name': 'Проверка отчета',
                'verbose_name_plural': 'Проверки отчетов',
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='TaskReport',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.TextField(blank=True, verbose_name='Отчет ')),
                ('task', models.OneToOneField(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='task_report', to='django_app.task', verbose_name='Задание')),
            ],
            options={
                'verbose_name': 'Отчет',
                'verbose_name_plural': 'Отчеты',
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='ReportFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(blank=True, default=None, null=True, upload_to='report_files/')),
                ('report', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='report', to='django_app.taskreport', verbose_name='Отчет')),
            ],
            options={
                'verbose_name': 'Файл',
                'verbose_name_plural': 'Файлы',
                'ordering': ('id',),
            },
        ),
        migrations.CreateModel(
            name='TaskStageAndData',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creation_date', models.DateTimeField(blank=True, db_index=True, default=django.utils.timezone.now, verbose_name='Стадия создания')),
                ('completion_date', models.DateTimeField(blank=True, db_index=True, default=None, null=True, verbose_name='Стадия выполнения')),
                ('check_date', models.DateTimeField(blank=True, db_index=True, default=None, null=True, verbose_name='Стадия проверки')),
                ('is_creation', models.BooleanField(default=True, verbose_name='Стадия создания')),
                ('is_completion', models.BooleanField(default=False, verbose_name='Стадия выполнения')),
                ('is_check', models.BooleanField(default=False, verbose_name='Стадия проверки')),
                ('task', models.OneToOneField(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='task_data', to='django_app.task', verbose_name='Задание')),
            ],
            options={
                'verbose_name': 'Даты и этапы задачи',
                'verbose_name_plural': 'Даты и этапы задачи',
                'ordering': ('-id',),
            },
        ),
    ]