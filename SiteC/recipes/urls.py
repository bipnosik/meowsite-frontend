# recipes/urls.py

from django.urls import path
from .views import RecipeList,create_recipe, update_recipe, delete_recipe  # импортируем класс представления, который будет возвращать рецепты

urlpatterns = [
    path('recipes/', RecipeList.as_view(), name='recipe-list'),  # URL для списка рецептов
    path('recipes/create/', create_recipe, name='create-recipe'), # маршрут для создания рецепта
    path('recipes/<int:pk>/update/', update_recipe, name='update-recipe'),  # Путь для обновления рецепта
    path('recipes/<int:pk>/delete/', delete_recipe, name='delete-recipe'),  # Путь для удаления рецепта
]
