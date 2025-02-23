import React from 'react';

function RecipeDetails({ recipe }) {
  return (
    <div style={styles.detailsContainer}>
      <h2>{recipe.name}</h2>
      <img src={recipe.image} alt={recipe.name} style={styles.image} />
      <p><strong>Cooking Time:</strong> {recipe.cooking_time} mins</p>
      <p><strong>Calories:</strong> {recipe.calories} kcal</p>
      <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
      <p><strong>Instructions:</strong> {recipe.instructions}</p>
    </div>
  );
}

// Стили для подробного рецепта
const styles = {
  detailsContainer: {
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  image: {
    width: '100%',
    height: 'auto',
    marginBottom: '20px',
  },
};

export default RecipeDetails;
