# Generated by Django 5.1.3 on 2024-11-13 12:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('django_app', '0006_alter_taskchek_task'),
    ]

    operations = [
        migrations.AddField(
            model_name='taskstage',
            name='is_archive',
            field=models.BooleanField(default=False, verbose_name='В архиве'),
        ),
        migrations.AlterField(
            model_name='taskstage',
            name='is_check',
            field=models.BooleanField(default=False, verbose_name='Проверено'),
        ),
        migrations.AlterField(
            model_name='taskstage',
            name='is_completion',
            field=models.BooleanField(default=False, verbose_name='Выполнено'),
        ),
    ]
