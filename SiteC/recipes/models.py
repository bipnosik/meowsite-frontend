from django.db import models


class Recipe(models.Model):
    # Название рецепта
    name = models.CharField(max_length=100)

    # Описание ингредиентов (можно сделать длинный текст)
    ingredients = models.TextField()

    # Время приготовления
    cooking_time = models.IntegerField()

    # Количество калорий
    calories = models.IntegerField()

    # Инструкции по приготовлению
    instructions = models.TextField()

    def __str__(self):
        return self.name