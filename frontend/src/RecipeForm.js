import React, { useState, useEffect } from 'react';
import './RecipeForm.css'; // Подключаем CSS (создадим ниже)

function RecipeForm({ onSave, onClose, initialRecipe }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState(''); // Оставляем строкой
  const [image, setImage] = useState(null); // Для файла изображения
  const [cookingTime, setCookingTime] = useState(25); // По умолчанию 25
  const [calories, setCalories] = useState(145); // По умолчанию 145

  // Если передан initialRecipe (для редактирования), заполняем форму
  useEffect(() => {
    if (initialRecipe) {
      setName(initialRecipe.name || '');
      setDescription(initialRecipe.description || '');
      setIngredients(initialRecipe.ingredients || '');
      setCookingTime(initialRecipe.cooking_time || 25);
      setCalories(initialRecipe.calories || 145);
      // Изображение не устанавливаем, так как это файл, а не URL
    }
  }, [initialRecipe]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Создаём объект с данными формы
    const newRecipe = {
      name,
      description,
      ingredients, // Отправляем как строку, бэкенд сам разберётся
      cooking_time: parseInt(cookingTime), // Преобразуем в число
      calories: parseInt(calories), // Преобразуем в число
      image: image || null, // Отправляем файл или null
    };

    onSave(newRecipe); // Передаём данные в App.js для отправки на сервер
    onClose(); // Закрываем форму

    // Сброс формы после отправки
    setName('');
    setDescription('');
    setIngredients('');
    setImage(null);
    setCookingTime(25);
    setCalories(145);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // Устанавливаем файл
    }
  };

  return (
    <div className="recipe-form-overlay">
      <form className="recipe-form" onSubmit={handleSubmit}>
        <h2>{initialRecipe ? 'Edit Recipe' : 'Create New Recipe'}</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Recipe Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <textarea
            placeholder="Ingredients (comma-separated)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {image && <p>Selected: {image.name}</p>} {/* Показываем имя файла */}
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="Cooking Time (mins)"
            value={cookingTime}
            onChange={(e) => setCookingTime(Math.max(1, e.target.value))} // Не меньше 1
            min="1"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            placeholder="Calories (kcal)"
            value={calories}
            onChange={(e) => setCalories(Math.max(0, e.target.value))} // Не меньше 0
            min="0"
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="save-btn">Save</button>
          <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default RecipeForm;