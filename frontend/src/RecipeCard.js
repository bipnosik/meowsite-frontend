import React from 'react';
import { Link } from 'react-router-dom';

function RecipeCard({ recipe, onClick, onDelete, onEdit }) {
  const categories = Array.isArray(recipe.categories) ? recipe.categories.slice(0, 2) : [];

  return (
    <div
      className={`recipe-card ${recipe.userCreated ? 'user-recipe' : ''}`}
      style={styles.card}
    >
      <Link to={`/recipe/${recipe.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <img
          src={recipe.image && recipe.image.startsWith('http') ? recipe.image : `http://127.0.0.1:8000${recipe.image || ''}`}
          alt={recipe.name}
          style={styles.image}
        />
        <div style={styles.info}>
          <h3 style={styles.title}>{recipe.name}</h3>
          <p><strong>Cooking time:</strong> {recipe.cooking_time} mins</p>
          <p><strong>Calories:</strong> {recipe.calories} kcal</p>
          <div style={styles.categories}>
            {categories.map((category, index) => (
              <span key={index} style={styles.category}>{category}</span>
            ))}
          </div>
        </div>
      </Link>
      {recipe.userCreated && (
        <div style={styles.buttons}>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(recipe); }}
            style={styles.editButton}
          >
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(recipe.id); }}
            style={styles.deleteButton}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
const styles = {
  card: {
    width: '230px',
    height: '330px',
    border: '2px solid #ccc',
    borderRadius: '12px',
    margin: '10px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    background: '#fff',
    overflow: 'hidden',
  },
  userRecipe: {
    borderColor: '#4CAF50', // Стиль для пользовательских рецептов
  },
  image: {
    width: '100%',
    height: '170px',
    objectFit: 'cover',
    borderTopLeftRadius: '10px',
    borderTopRightRadius: '10px',
  },
  info: {
    padding: '15px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 'calc(100% - 170px)',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  categories: {
    display: 'flex',
    gap: '8px',
    marginTop: '10px',
    flexWrap: 'wrap',
  },
  category: {
    backgroundColor: '#f0f0f0',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    color: '#666',
  },
  buttons: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px',
  },
  editButton: {
    background: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'background 0.3s ease',
    ':hover': { background: '#45a049' }, // Не работает в inline-стилях, нужно через CSS
  },
  deleteButton: {
    background: '#ff4444',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    transition: 'background 0.3s ease',
    ':hover': { background: '#cc0000' }, // Не работает в inline-стилях, нужно через CSS
  },
};

export default RecipeCard;