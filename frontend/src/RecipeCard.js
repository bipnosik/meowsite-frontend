import React from 'react';

function RecipeCard({ recipe, onClick }) {
  // Проверяем, что categories существует и является массивом
  const categories = Array.isArray(recipe.categories) ? recipe.categories.slice(0, 2) : [];

  return (
    <div className="recipe-card" style={styles.card} onClick={() => onClick(recipe)}>
      {/* Путь к изображению, который передается через пропс */}
      <img src={`/${recipe.image}`} alt={recipe.name} style={styles.image} />
      <div style={styles.info}>
        <h3>{recipe.name}</h3>
        <p><strong>Cooking time:</strong> {recipe.cooking_time} mins</p>
        <p><strong>Calories:</strong> {recipe.calories} kcal</p>
        <div style={styles.categories}>
          {categories.map((category, index) => (
            <span key={index} style={styles.category}>{category}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// Стили для карточки рецепта
const styles = {
  card: {
    width: '230px',
    height: '330px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    margin: '10px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  image: {
    width: '100%',
    height: '170px',
    objectFit: 'cover',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
  },
  info: {
    padding: '10px',
  },
  categories: {
    display: 'flex',
    gap: '8px',
  },
  category: {
    backgroundColor: '#f0f0f0',
    padding: '4px 8px',
    borderRadius: '4px',
  },
};

export default RecipeCard;
