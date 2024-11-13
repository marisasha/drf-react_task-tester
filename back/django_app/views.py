from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.hashers import make_password
from django_app import models, serializers, utils
from django.contrib.auth.models import User
from django.forms import ValidationError
from django.db.models import QuerySet
from django.shortcuts import render
from django.http import HttpRequest
from django.utils import timezone
from django.db.models import Q


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = serializers.CustomTokenObtainPairSerializer


def index(request) -> HttpRequest:
    return render(request, "index.html", context={})


@api_view(http_method_names=["GET"])
def api(request: Request) -> Response:
    return Response(data={"message": " ok , let's go "}, status=status.HTTP_200_OK)


@api_view(http_method_names=["POST"])
def api_user_register(request: Request) -> Response:
    username = str(request.data.get("username", None))
    password = str(request.data.get("password", None))
    password_accept = str(request.data.get("password2", None))
    name = str(request.data.get("name", None))
    surname = str(request.data.get("surname", None))

    if password == password_accept:
        user = User.objects.create(username=username, password=make_password(password))
        profile = models.Profile.objects.get(user=user)
        profile.name = name
        profile.surname = surname
        profile.save()
        return Response(
            data={"success": "Account succesfully created!"}, status=status.HTTP_200_OK
        )
    else:
        return Response(
            data={"error": "Login or password is incorrect"},
            status=status.HTTP_401_UNAUTHORIZED,
        )


@api_view(http_method_names=["GET"])
def api_all_tasks(requets: Request) -> Response:
    tasks = models.Task.objects.filter(task_data__is_archive=False)
    serialized_data = serializers.TaskSerializer(
        tasks, many=True if isinstance(tasks, QuerySet) else False
    ).data
    data_serialize_with_cache = utils.Cache.get_cache(
        key="tasks_cache", query=lambda: serialized_data, timeout=2
    )
    return Response(data={"data": data_serialize_with_cache}, status=status.HTTP_200_OK)


@api_view(http_method_names=["GET"])
def api_user_tasks(request: Request, user_id: int) -> Response:
    tasks = models.Task.objects.filter(Q(executor=user_id) | Q(inspector=user_id))
    serialized_data = serializers.TaskSerializer(
        tasks, many=True if isinstance(tasks, QuerySet) else False
    ).data
    data_serialize_with_cache = utils.Cache.get_cache(
        key="user_tasks_cache", query=lambda: serialized_data, timeout=2
    )
    return Response(data={"data": data_serialize_with_cache}, status=status.HTTP_200_OK)


@api_view(http_method_names=["GET", "POST"])
def api_create_task(request: Request) -> Response:
    if request.method == "GET":
        dummy_profile_role = models.ProfileRole()
        serialized_data = serializers.ProfileRoleSerializer(
            instance=dummy_profile_role
        ).data
        data_serialize_with_cache = utils.Cache.get_cache(
            key="profile_roles_cache", query=lambda: serialized_data, timeout=2
        )
        return Response(
            data={"data": data_serialize_with_cache}, status=status.HTTP_200_OK
        )
    if request.method == "POST":
        author_id = int(request.data.get("author_id", None))
        executor_id = int(request.data.get("executor_id", None))
        inspector_id = int(request.data.get("inspector_id", None))
        task_text = str(request.data.get("task_text", None))
        try:
            author = User.objects.get(id=author_id)
            executor = User.objects.get(id=executor_id)
            inspector = User.objects.get(id=inspector_id)

            task = models.Task.objects.create(
                author=author,
                executor=executor,
                inspector=inspector,
                task_text=task_text,
            )
            task.save()
            return Response(
                data={"success": "Task successfully create!"}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                data={"error": f"Error: {e}"}, status=status.HTTP_404_NOT_FOUND
            )


@api_view(http_method_names=["GET", "POST"])
def api_report_of_task(request: Request, task_id: int) -> Response:
    task = models.Task.objects.get(id=task_id)
    if request.method == "GET":
        serialized_data = serializers.TaskSerializer(
            task, many=True if isinstance(task, QuerySet) else False
        ).data
        data_serialize_with_cache = utils.Cache.get_cache(
            key="task_cache", query=lambda: serialized_data, timeout=2
        )
        return Response(
            data={"data": data_serialize_with_cache}, status=status.HTTP_200_OK
        )
    if request.method == "POST":
        try:
            comment = str(request.data.get("comment", None))
            file = request.FILES.get("file", None)
            task_report = models.TaskReport.objects.get(task=task)
            task_report.comment = comment
            task_report.completion_date = timezone.now()
            if file:
                task_report.file = file
            data_and_stage_of_task = models.TaskStage.objects.get(task=task)
            data_and_stage_of_task.is_completion = True
            data_and_stage_of_task.save()
            task_report.save()
            return Response(
                data={"success": "Report successfully create!"},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                data={"message": f"Error: {e}"}, status=status.HTTP_404_NOT_FOUND
            )


@api_view(http_method_names=["GET", "POST"])
def api_check_report(request: Request, task_id: int) -> Response:
    task = models.Task.objects.get(id=task_id)
    if request.method == "GET":
        serialized_data = serializers.TaskSerializer(
            task, many=True if isinstance(task, QuerySet) else False
        ).data
        data_serialize_with_cache = utils.Cache.get_cache(
            key="task_cache", query=lambda: serialized_data, timeout=2
        )
        return Response(
            data={"data": data_serialize_with_cache}, status=status.HTTP_200_OK
        )
    if request.method == "POST":
        try:
            comment = str(request.data.get("comment", None))
            check_report = models.TaskChek.objects.get(task=task)
            check_report.comment = comment
            check_report.check_date = timezone.now()
            check_report.save()
            data_and_stage_of_task = models.TaskStage.objects.get(task=task)
            data_and_stage_of_task.is_check = True
            data_and_stage_of_task.save()
            return Response(
                data={"success": "Comment for report successfully create!"},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response(
                data={"message": f"Error: {e}"}, status=status.HTTP_404_NOT_FOUND
            )


@api_view(http_method_names=["GET"])
def api_user_profile(request: Request, user_id: int) -> Response:
    user = User.objects.get(id=user_id)
    serialized_data = serializers.UsersSerializer(
        user, many=True if isinstance(user, QuerySet) else False
    ).data
    data_serialize_with_cache = utils.Cache.get_cache(
        key="user_cache", query=lambda: serialized_data, timeout=2
    )
    return Response(data={"data": data_serialize_with_cache}, status=status.HTTP_200_OK)


@api_view(http_method_names=["GET", "POST"])
def api_change_role(request: Request) -> Response:
    if request.method == "GET":
        users = User.objects.all()
        serialized_data = serializers.UsersSerializer(
            users, many=True if isinstance(users, QuerySet) else False
        ).data
        data_serialize_with_cache = utils.Cache.get_cache(
            key="users_cache", query=lambda: serialized_data, timeout=2
        )
        return Response(
            data={"data": data_serialize_with_cache}, status=status.HTTP_200_OK
        )

    if request.method == "POST":
        try:
            user_id = int(request.data.get("user_id"))
            role = str(request.data.get("role"))
            action = str(request.data.get("action"))
            profile = models.Profile.objects.get(id=user_id)
            profile_role = models.ProfileRole.objects.get(profile=profile)
            if action == "assign":
                if role == "inspector":
                    profile_role.inspector = True
                elif role == "author":
                    profile_role.author = True
                elif role == "boss":
                    profile_role.boss = True
                else:
                    return Response(
                        data={"message": "Invalid role specified"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            if action == "remove":
                if role == "Проверяющий":
                    profile_role.inspector = False
                elif role == "Автор":
                    profile_role.author = False
                elif role == "Босс":
                    profile_role.boss = False
                else:
                    return Response(
                        data={"message": "Invalid role specified"},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
            profile_role.save()
            return Response(
                data={"message": "Role successfully change !"},
                status=status.HTTP_200_OK,
            )

        except Exception as e:
            return Response(
                data={"message": f"Error: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST
            )


@api_view(http_method_names=["DELETE"])
def api_task_delete(request: Request, task_id: int) -> Response:
    task = models.Task.objects.get(id=task_id)
    task.delete()
    return Response(data={"success": "Task is delete !"}, status=status.HTTP_200_OK)


@api_view(http_method_names=["GET"])
def api_archive_tasks(request: Request) -> Response:
    archived_tasks = models.Task.objects.filter(task_data__is_archive=True)
    serialized_data = serializers.TaskSerializer(
        archived_tasks, many=True if isinstance(archived_tasks, QuerySet) else False
    ).data
    data_serialize_with_cache = utils.Cache.get_cache(
        key="archive_task_cache", query=lambda: serialized_data, timeout=2
    )
    return Response(data={"data": data_serialize_with_cache}, status=status.HTTP_200_OK)


@api_view(http_method_names=["POST"])
def api_task_to_archive(request: Request, task_id) -> Response:
    task = models.Task.objects.get(id=task_id)
    task_to_archive = models.TaskStage.objects.get(task=task)
    task_to_archive.is_archive = True
    task_to_archive.save()
    return Response(
        data={"message": "Task successfully transferred to archive !"},
        status=status.HTTP_200_OK,
    )
