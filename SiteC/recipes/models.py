from django.db import models

class Recipe(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    ingredients = models.TextField()
    image = models.ImageField(upload_to='recipes/', blank=True, null=True)
    cooking_time = models.IntegerField(default=25)
    calories = models.IntegerField(default=145)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['-created_at']