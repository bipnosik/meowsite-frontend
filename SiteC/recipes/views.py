from django.db.models import Model
from rest_framework import viewsets, status, generics, permissions
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import Recipe, Comment
from .serializers import RecipeSerializer, UserSerializer, CommentSerializer

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.all()  # Все рецепты по умолчанию
    serializer_class = RecipeSerializer  # Сериализатор для рецептов
    parser_classes = (MultiPartParser, FormParser)  # Поддержка multipart/form-data для загрузки изображений
    permission_classes = [IsAuthenticatedOrReadOnly]  # Чтение — всем, запись — авторизованным

    def get_queryset(self):
        # Возвращаем все рецепты для списка
        return Recipe.objects.all()

    def list(self, request, *args, **kwargs):
        # Вывод списка всех рецептов
        print("Запрос к /api/recipes/")  # Лог для отладки
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)  # Возвращаем сериализованные данные

    def retrieve(self, request, pk=None, *args, **kwargs):
        # Получение конкретного рецепта по ID
        recipe = get_object_or_404(Recipe, pk=pk)
        serializer = self.serializer_class(recipe)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        # Создание нового рецепта
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)  # Автоматически привязываем текущего пользователя
            return Response(serializer.data, status=status.HTTP_201_CREATED)  # Успешное создание
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Ошибка валидации

    def update(self, request, pk=None, *args, **kwargs):
        # Обновление рецепта
        recipe = get_object_or_404(Recipe, pk=pk)
        # Проверяем, что пользователь — владелец рецепта
        if recipe.user != request.user:
            return Response({"detail": "You do not have permission to edit this recipe."}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.serializer_class(recipe, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()  # Сохраняем изменения
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None, *args, **kwargs):
        # Удаление рецепта
        recipe = get_object_or_404(Recipe, pk=pk)
        # Проверяем, что пользователь — владелец рецепта
        if recipe.user != request.user:
            return Response({"detail": "You do not have permission to delete this recipe."}, status=status.HTTP_403_FORBIDDEN)
        recipe.delete()  # Удаляем рецепт
        return Response(status=status.HTTP_204_NO_CONTENT)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()  # Все пользователи
    permission_classes = (permissions.AllowAny,)  # Доступ всем (регистрация)
    serializer_class = UserSerializer  # Сериализатор для пользователей

    def create(self, request, *args, **kwargs):
        # Создание нового пользователя
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()  # Сохраняем пользователя
        refresh = RefreshToken.for_user(user)  # Генерируем токены
        return Response({
            'refresh': str(refresh),
            "access": str(refresh.access_token),
        })  # Возвращаем токены

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()  # Все комментарии
    serializer_class = CommentSerializer  # Сериализатор для комментариев
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  # Чтение — всем, запись — авторизованным

    def perform_create(self, serializer):
        # Привязываем текущего пользователя как автора комментария
        serializer.save(author=self.request.user)

    def get_queryset(self):
        # Фильтрация комментариев по ID рецепта из параметров запроса
        recipe_id = self.request.query_params.get('recipe', None)
        if recipe_id is not None:
            return Comment.objects.filter(recipe_id=recipe_id)
        return Comment.objects.all()