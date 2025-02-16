import React from 'react';

// Компонент для отображения одного рецепта
function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card" style={styles.card}>
      <h3>{recipe.name}</h3>
      <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
      <p><strong>Cooking Time:</strong> {recipe.cooking_time} mins</p>
      <p><strong>Calories:</strong> {recipe.calories} kcal</p>
      <p><strong>Instructions:</strong> {recipe.instructions}</p>
    </div>
  );
}

// Простейшие стили для карточки рецепта (по желанию)
const styles = {
  card: {
    border: '1px solid #ccc',
    padding: '20px',
    margin: '10px',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
};

export default RecipeCard;
