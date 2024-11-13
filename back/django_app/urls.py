from django.contrib import admin
from django.urls import path
from django_app import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)


urlpatterns = [
    path("", view=views.index),
    #
    path("api/", view=views.api),
    #
    path(
        "api/token/",
        views.CustomTokenObtainPairView.as_view(),
        name="token_obtain_pair",
    ),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("api/register", view=views.api_user_register),
    #
    path("api/tasks/", view=views.api_all_tasks),
    path("api/tasks/archive", view=views.api_archive_tasks),
    path("api/task/to/archive/<int:task_id>", view=views.api_task_to_archive),
    path("api/task/delete/<int:task_id>", view=views.api_task_delete),
    path("api/tasks/<int:user_id>/", view=views.api_user_tasks),
    path("api/create/task/", view=views.api_create_task),
    path("api/report/<int:task_id>", view=views.api_report_of_task),
    path("api/report/check/<int:task_id>", view=views.api_check_report),
    path("api/change/role", view=views.api_change_role),
    path("api/user/profile/<int:user_id>", view=views.api_user_profile),
]
