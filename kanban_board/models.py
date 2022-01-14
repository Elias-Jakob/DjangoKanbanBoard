from operator import mod
from django.db import models
import uuid

# Create your models here.
class Project(models.Model):

    title = models.CharField(max_length=200)
    description = models.TextField(max_length=5000)
    
    created = models.DateTimeField(auto_now_add=True)
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)    

    def __str__(self) -> str:
        return self.title

    class Meta:
        ordering = ['-created']


def default_board():
    return [
			{
				"id": 1,
				"items": []
			},
			{
				"id": 2,
				"items": []
			},
			{
				"id": 3,
				"items": []
			}
		]

class Kanban(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, null=True, blank=True)
    kanban = models.JSONField(default=default_board)
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False) 
