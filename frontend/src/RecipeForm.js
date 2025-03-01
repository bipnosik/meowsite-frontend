import React, { useState } from 'react';

function RecipeForm({ onSave, onClose }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [image, setImage] = useState(null); // Для загрузки изображения
  const [cookingTime, setCookingTime] = useState(25); // Значение по умолчанию
  const [calories, setCalories] = useState(145); // Значение по умолчанию

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRecipe = {
      name,
      description,
      ingredients: ingredients.split(',').map(item => item.trim()), // Разделяем ингредиенты по запятой
      image: image ? URL.createObjectURL(image) : '', // Превью изображения
      cooking_time: cookingTime,
      calories,
    };
    onSave(newRecipe);
    onClose();
    // Сброс формы
    setName('');
    setDescription('');
    setIngredients('');
    setImage(null);
    setCookingTime(25);
    setCalories(145);
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: '#fff',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      width: '400px',
    }}>
      <h2>Create New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Recipe Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginBottom: '10px', width: '100%' }}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ marginBottom: '10px', width: '100%', height: '100px' }}
        />
        <textarea
          placeholder="Ingredients (comma-separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          required
          style={{ marginBottom: '10px', width: '100%', height: '80px' }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginBottom: '10px' }}
        />
        <input
          type="number"
          placeholder="Cooking Time (mins)"
          value={cookingTime}
          onChange={(e) => setCookingTime(e.target.value)}
          style={{ marginBottom: '10px', width: '100%' }}
        />
        <input
          type="number"
          placeholder="Calories (kcal)"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          style={{ marginBottom: '10px', width: '100%' }}
        />
        <button type="submit" style={{ marginRight: '10px' }}>Save</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default RecipeForm;