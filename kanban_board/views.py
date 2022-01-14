from multiprocessing import context
from django.http import HttpResponse
import json
from django.shortcuts import render
from .models import Kanban, Project
from django.core.serializers.json import DjangoJSONEncoder

# Create your views here.
def Home(request):
    projects = Project.objects.all()

    context = {"projects": projects}
    return render(request, "kanban_board/home.html", context)

def ViewProject(request, pk):
    project = Project.objects.get(id=pk)
    
    try:
        kanban = Kanban.objects.get(project=project)
    except Kanban.DoesNotExist:
        kanban = Kanban(project=project)
        kanban.save()

    jsonKanban = json.dumps(kanban.kanban)

    context = {
        "project": project,
        "kanban_id": json.dumps(kanban.id, cls=DjangoJSONEncoder),
        "kanban_data": jsonKanban,
    }
    return render(request, "kanban_board/view_project.html", context)

def SaveKanban(request):
    payload = {}
    if request.method == 'POST':
        board_id = request.POST.get('board_id')
        kanban_data = request.POST.get('data')

        kanban = Kanban.objects.get(id=board_id)
        kanban.kanban = json.loads(kanban_data)
        kanban.save()
        
        payload['response'] = "Success"
    else:
        payload['response'] = "Something went wrong."
    
    return HttpResponse(json.dumps(payload), content_type="application/json")