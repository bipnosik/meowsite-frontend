import React, { useEffect, useState } from 'react';
import RecipeCard from './RecipeCard'; // Импортируем компонент для отображения рецепта

function App() {
  const [recipes, setRecipes] = useState([]);  // Состояние для хранения рецептов
  const [loading, setLoading] = useState(true); // Состояние для отображения "Загрузка"

  // Загружаем рецепты с API при первом рендере компонента
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/recipes/')  // Указываем URL для получения данных
      .then(response => response.json())  // Преобразуем ответ в формат JSON
      .then(data => {
        setRecipes(data);  // Сохраняем данные в состоянии
        setLoading(false);  // Останавливаем показ "Загрузка"
      })
      .catch(error => {
        console.error("Error fetching data:", error);  // Логируем ошибку, если что-то пошло не так
        setLoading(false);  // Останавливаем показ "Загрузка", даже если ошибка
      });
  }, []);  // Пустой массив зависимостей: код выполнится только один раз, когда компонент монтируется

  return (
    <div className="App">
      <h1>Recipes</h1>
      <div>
        {loading ? (
          <p>Loading...</p>  // Показываем "Загрузка", если рецепты еще не загружены
        ) : (
          recipes.length > 0 ? (
            recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />  // Для каждого рецепта создаем компонент
            ))
          ) : (
            <p>No recipes available</p>  // Если рецептов нет
          )
        )}
      </div>
    </div>
  );
}

export default App;
