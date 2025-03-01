import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Sidebar';
import RecipeCard from './RecipeCard';
import RecipeDetails from './RecipeDetails';
import RecipeForm from './RecipeForm';
import './App.css';

const BASE_URL = 'http://127.0.0.1:8000';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = () => {
    console.log('Fetching recipes from http://127.0.0.1:8000/api/recipes/');
    fetch(`${BASE_URL}/api/recipes/`)
      .then(response => {
        if (!response.ok) {
          console.error('Server responded with:', response.status, response.statusText);
          throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Received recipes:', data);
        const updatedRecipes = data.map(recipe => ({
          ...recipe,
          image: recipe.image ? `${BASE_URL}${recipe.image}` : '/default-image.jpg',
        }));
        setRecipes(updatedRecipes);
      })
      .catch(error => {
        console.error("Error fetching recipes:", error);
        setRecipes([
          { id: 1, name: "Chicken with Rice", image: "/chicken-rice.jpg", description: "Delicious chicken", ingredients: "Chicken, Rice", cooking_time: 25, calories: 145, userCreated: true },
          { id: 2, name: "Pasta", image: "/pasta.jpg", description: "Tasty pasta", ingredients: "Pasta, Sauce", cooking_time: 25, calories: 145, userCreated: true },
        ]);
      });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const saveRecipe = (recipeData) => {
    const method = editingRecipe ? 'PUT' : 'POST';
    const url = editingRecipe
      ? `${BASE_URL}/api/recipes/${editingRecipe.id}/`
      : `${BASE_URL}/api/recipes/`;

    const formData = new FormData();
    formData.append('name', recipeData.name);
    formData.append('description', recipeData.description);
    formData.append('ingredients', recipeData.ingredients.join(', '));
    formData.append('cooking_time', recipeData.cooking_time);
    formData.append('calories', recipeData.calories);
    if (recipeData.image) {
      formData.append('image', recipeData.image);
    }

    fetch(url, {
      method,
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to save recipe: ' + response.statusText);
        }
        return response.json();
      })
      .then(() => {
        fetchRecipes();
        setShowForm(false);
        setEditingRecipe(null);
      })
      .catch(error => console.error("Error saving recipe:", error));
  };

  const deleteRecipe = (recipeId) => {
    fetch(`${BASE_URL}/api/recipes/${recipeId}/`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          console.error('Server responded with:', response.status, response.statusText);
          throw new Error('Failed to delete recipe: ' + response.statusText);
        }
        setRecipes(prevRecipes => prevRecipes.filter(r => r.id !== recipeId));
      })
      .catch(error => console.error("Error deleting recipe:", error));
  };

  const toggleForm = (recipe = null) => {
    setEditingRecipe(recipe);
    setShowForm(!showForm);
  };

  return (
    <Router>
      <div className="App">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onAddRecipe={toggleForm}
        />

        <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <h1>Try it today</h1>
          <button onClick={() => toggleForm()} style={{ marginBottom: '20px' }}>+ Add New Recipe</button>

          {showForm && (
            <RecipeForm
              onSave={saveRecipe}
              onClose={toggleForm}
              initialRecipe={editingRecipe}
            />
          )}

          <Routes>
            <Route
              path="/"
              element={
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                  {recipes.map(recipe => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onClick={() => window.location.href = `/recipe/${recipe.id}`} // Временный переход
                      onDelete={deleteRecipe}
                      onEdit={toggleForm}
                    />
                  ))}
                </div>
              }
            />
            <Route
              path="/recipe/:id"
              element={<RecipeDetails recipes={recipes} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;