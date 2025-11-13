from django.db import models


class Lead(models.Model):
	name = models.CharField(max_length=150)
	email = models.EmailField()
	phone = models.CharField(max_length=30, blank=True)
	message = models.TextField(blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

	def __str__(self) -> str:
		return f"{self.name} <{self.email}>"

# Create your models here.
