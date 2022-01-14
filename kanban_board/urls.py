from unicodedata import name
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.Home, name="home"),
    path('view_project/<str:pk>', views.ViewProject, name="view_project"),
    path('view_project/save_kanban/', views.SaveKanban, name="save_kanban"),
]