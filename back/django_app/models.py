from django.contrib.auth.models import User
from django.db import models
from django.utils import timezone
from django.core.validators import FileExtensionValidator
from django.dispatch import receiver
from django.db.models.signals import post_save


class Profile(models.Model):
    user = models.OneToOneField(
        verbose_name="Пользователь",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        default=None,
        to=User,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    name = models.CharField(
        verbose_name="Имя",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        default=None,
        max_length=50,
    )
    surname = models.CharField(
        verbose_name="Фамилия",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        default=None,
        max_length=50,
    )

    class Meta:
        app_label = "auth"
        ordering = ("-name",)
        verbose_name = "Профиль"
        verbose_name_plural = "Профили"

    def __str__(self):
        return f"[{self.id}] {self.name}"


@receiver(post_save, sender=User)
def profile_create(sender, instance: User, created: bool, **kwargs):
    profile = Profile.objects.get_or_create(user=instance)


class ProfileRole(models.Model):

    profile = models.OneToOneField(
        verbose_name="Роль",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        default=None,
        to=Profile,
        on_delete=models.CASCADE,
        related_name="role",
    )

    executor = models.BooleanField(
        verbose_name="Исполнитель",
        null=False,
        default=True,
    )

    inspector = models.BooleanField(
        verbose_name="Проверяющий",
        null=False,
        default=False,
    )

    author = models.BooleanField(
        verbose_name="Автор",
        null=False,
        default=False,
    )

    boss = models.BooleanField(
        verbose_name="Босс",
        null=False,
        default=False,
    )

    class Meta:
        app_label = "auth"
        ordering = ("-id",)
        verbose_name = "Роль"
        verbose_name_plural = "Роли"

    def __str__(self):
        return f"Роли : [{self.id}] {self.profile.name}"


@receiver(post_save, sender=User)
def profile_create(sender, instance, created, **kwargs):
    if created:
        profile, _ = Profile.objects.get_or_create(user=instance)
        ProfileRole.objects.get_or_create(profile=profile)


class Task(models.Model):
    author = models.ForeignKey(
        verbose_name="Автор задания",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=False,
        to=User,
        on_delete=models.CASCADE,
        related_name="authored_tasks",
    )
    executor = models.ForeignKey(
        verbose_name="Исполнитель задания",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=False,
        to=User,
        on_delete=models.CASCADE,
        related_name="executed_tasks",
    )
    inspector = models.ForeignKey(
        verbose_name="Проверяющий задания",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=False,
        to=User,
        on_delete=models.CASCADE,
        related_name="inspected_tasks",
    )
    task_text = models.TextField(
        verbose_name="Тех.задание",
        db_index=False,
        primary_key=False,
        unique=False,
        editable=True,
        blank=True,
        null=False,
    )

    creation_date = models.DateTimeField(
        verbose_name="Дата создания",
        db_index=True,
        editable=True,
        blank=True,
        null=False,
        default=timezone.now,
    )

    class Meta:
        app_label = "django_app"
        ordering = ("-id",)
        verbose_name = "Задача"
        verbose_name_plural = "Задачи"

    def __str__(self):
        return f"[{self.id}] Автор : {self.author} Задача : {self.task_text[:30]}..."


class TaskStage(models.Model):
    task = models.OneToOneField(
        verbose_name="Задание",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        default=None,
        to=Task,
        on_delete=models.CASCADE,
        related_name="task_data",
    )

    is_completion = models.BooleanField(
        verbose_name="Выполнено",
        null=False,
        default=False,
    )
    is_check = models.BooleanField(
        verbose_name="Проверено",
        null=False,
        default=False,
    )
    is_archive = models.BooleanField(
        verbose_name="В архиве",
        null=False,
        default=False,
    )

    class Meta:
        app_label = "django_app"
        ordering = ("-id",)
        verbose_name = "Даты и этапы задачи"
        verbose_name_plural = "Даты и этапы задачи"

    def __str__(self):
        return f"Даты и этапы выполнения задания № {self.task.id}"


@receiver(post_save, sender=Task)
def data_and_stages_create(sender, instance: User, created: bool, **kwargs):
    TaskStage.objects.get_or_create(task=instance)


class TaskReport(models.Model):
    task = models.OneToOneField(
        verbose_name="Задание",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        default=None,
        to=Task,
        on_delete=models.CASCADE,
        related_name="task_report",
    )
    comment = models.TextField(
        verbose_name="Ответ ",
        db_index=False,
        primary_key=False,
        unique=False,
        editable=True,
        blank=True,
        null=False,
    )
    completion_date = models.DateTimeField(
        verbose_name="Дата выполнения",
        db_index=True,
        editable=True,
        blank=True,
        null=True,
        default=None,
    )
    file = models.FileField(
        unique=False,
        editable=True,
        blank=True,
        null=True,
        default=None,
        upload_to="report_files/",
    )

    class Meta:
        app_label = "django_app"
        ordering = ("-id",)
        verbose_name = "Отчет"
        verbose_name_plural = "Отчеты"

    def __str__(self):
        return f"Отчет № [{self.id}]"


@receiver(post_save, sender=Task)
def data_and_stages_create(sender, instance: User, created: bool, **kwargs):
    TaskReport.objects.get_or_create(task=instance)


class TaskChek(models.Model):
    task = models.ForeignKey(
        verbose_name="Задание",
        db_index=True,
        primary_key=False,
        editable=True,
        blank=True,
        null=True,
        default=None,
        to=Task,
        on_delete=models.CASCADE,
        related_name="task_check",
    )

    comment = models.TextField(
        verbose_name="Комментарий ",
        db_index=False,
        primary_key=False,
        unique=False,
        editable=True,
        blank=True,
        null=False,
    )
    check_date = models.DateTimeField(
        verbose_name="Дата проверки",
        db_index=True,
        editable=True,
        blank=True,
        null=True,
        default=None,
    )

    class Meta:
        app_label = "django_app"
        ordering = ("-id",)
        verbose_name = "Проверка отчета"
        verbose_name_plural = "Проверки отчетов"

    def __str__(self):
        return f"Отчет № {self.id}"


@receiver(post_save, sender=Task)
def data_and_stages_create(sender, instance: User, created: bool, **kwargs):
    TaskChek.objects.get_or_create(task=instance)
