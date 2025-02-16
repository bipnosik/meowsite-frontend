from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Recipe
from .serializers import RecipeSerializer

class RecipeList(APIView):
    def get(self, request):
        recipes = Recipe.objects.all()  # Получаем все рецепты из базы данных
        serializer = RecipeSerializer(recipes, many=True)  # Сериализуем их
        return Response(serializer.data, status=status.HTTP_200_OK)
@api_view(['POST'])
def create_recipe(request):
    if request.method == 'POST':
        # Создаем новый рецепт с помощью сериализатора
        serializer = RecipeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Сохраняем рецепт в базе данных
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Отправляем ответ с данными рецепта
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # В случае ошибки


@api_view(['PUT', 'PATCH'])
def update_recipe(request, pk):
    try:
        recipe = Recipe.objects.get(pk=pk)  # Получаем рецепт по ID
    except Recipe.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)  # Если рецепт не найден, отправляем 404

    # Используем сериализатор для обновления рецепта
    serializer = RecipeSerializer(recipe, data=request.data, partial=(request.method == 'PATCH'))

    if serializer.is_valid():
        serializer.save()  # Сохраняем изменения
        return Response(serializer.data)  # Возвращаем обновленные данные
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # В случае ошибки
@api_view(['DELETE'])
def delete_recipe(request, pk):
    try:
        recipe = Recipe.objects.get(pk=pk)  # Получаем рецепт по ID
    except Recipe.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)  # Если рецепт не найден, отправляем 404

    recipe.delete()  # Удаляем рецепт
    return Response(status=status.HTTP_204_NO_CONTENT)