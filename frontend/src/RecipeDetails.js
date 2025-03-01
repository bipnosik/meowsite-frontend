import React from 'react';
import { useParams } from 'react-router-dom';

function RecipeDetails({ recipes }) {
  const { id } = useParams(); // Извлекаем ID из URL
  const recipe = recipes.find(r => r.id === parseInt(id)); // Находим рецепт в массиве

  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div style={styles.detailsContainer}>
      <h2>{recipe.name}</h2>
      <img
        src={recipe.image}
        alt={recipe.name}
        style={styles.image}
        onError={(e) => (e.target.src = '/default-image.jpg')}
      />
      <p><strong>Cooking Time:</strong> {recipe.cooking_time} mins</p>
      <p><strong>Calories:</strong> {recipe.calories} kcal</p>
      <p><strong>Ingredients:</strong> {recipe.ingredients}</p>
      <p><strong>Instructions:</strong> {recipe.instructions || 'No instructions provided'}</p>
    </div>
  );
}

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
    borderRadius: '8px',
  },
};

export default RecipeDetails;