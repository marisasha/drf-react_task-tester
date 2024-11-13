from django.contrib.auth.models import User
from rest_framework import serializers
from django_app import models
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class TaskStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TaskStage
        fields = ("is_completion", "is_check")


class TaskReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TaskReport
        fields = ("comment", "completion_date", "file")


class TaskCheckSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TaskChek
        fields = ("comment", "check_date")


class TaskSerializer(serializers.ModelSerializer):
    entrants_of_task = serializers.SerializerMethodField()
    task_stages_complited = TaskStageSerializer(source="task_data", read_only=True)
    task_report = TaskReportSerializer(read_only=True)
    task_check = TaskCheckSerializer(many=True, read_only=True)

    def get_entrants_of_task(self, obj):
        return {
            "author": obj.author.profile.surname,
            "author_id": obj.author.profile.id,
            "executor": obj.executor.profile.surname,
            "executor_id": obj.executor.profile.id,
            "inspector": obj.inspector.profile.surname,
            "inspector_id": obj.inspector.profile.id,
        }

    class Meta:
        model = models.Task
        fields = (
            "id",
            "task_text",
            "entrants_of_task",
            "creation_date",
            "task_stages_complited",
            "task_report",
            "task_check",
        )


class UsersSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField()

    def get_profile(self, obj):
        return {
            "id": obj.profile.id,
            "surname": obj.profile.surname,
            "name": obj.profile.name,
        }

    class Meta:
        model = models.User
        fields = ("id", "profile")


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data["user_id"] = self.user.id
        return data


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Profile
        fields = ("id", "surname", "name")


class ProfileRoleSerializer(serializers.Serializer):
    authors = serializers.SerializerMethodField()
    executors = serializers.SerializerMethodField()
    inspectors = serializers.SerializerMethodField()
    boss = serializers.SerializerMethodField()

    def get_authors(self, obj):
        authors = models.ProfileRole.objects.filter(author=True).select_related(
            "profile"
        )
        return ProfileSerializer([role.profile for role in authors], many=True).data

    def get_executors(self, obj):
        executors = models.ProfileRole.objects.filter(executor=True).select_related(
            "profile"
        )
        return ProfileSerializer([role.profile for role in executors], many=True).data

    def get_inspectors(self, obj):
        inspectors = models.ProfileRole.objects.filter(inspector=True).select_related(
            "profile"
        )
        return ProfileSerializer([role.profile for role in inspectors], many=True).data

    def get_boss(self, obj):
        boss = models.ProfileRole.objects.filter(boss=True).select_related("profile")
        return ProfileSerializer([role.profile for role in boss], many=True).data
