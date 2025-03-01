from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404
from .models import Recipe
from .serializers import RecipeSerializer
from rest_framework.viewsets import ModelViewSet

class RecipeViewSet(ModelViewSet):
    queryset = Recipe.objects.all()  # <-- ДОЛЖНО БЫТЬ!
    serializer_class = RecipeSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return Recipe.objects.all()

    def list(self, request, *args, **kwargs):
        print("Запрос к /api/recipes/")
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None, *args, **kwargs):
        recipe = get_object_or_404(Recipe, pk=pk)
        serializer = self.serializer_class(recipe)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None, *args, **kwargs):
        recipe = get_object_or_404(Recipe, pk=pk)
        serializer = self.serializer_class(recipe, data=request.data, partial=True)
        if serializer.is_valid():
            self.perform_update(serializer)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None, *args, **kwargs):
        recipe = get_object_or_404(Recipe, pk=pk)
        recipe.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)