import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import Sidebar from './Sidebar';
import RecipeCard from './RecipeCard';
import RecipeDetails from './RecipeDetails';
import RecipeForm from './RecipeForm';
import './App.css';

const BASE_URL = 'https://meowsite-backend-production.up.railway.app';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    fetchRecipes();
    const token = localStorage.getItem('accessToken');
    if (token) {
      setUser({ accessToken: token, username: localStorage.getItem('username') });
    }
  }, []);

  const fetchRecipes = () => {
    fetch(`${BASE_URL}/api/recipes/`)
      .then(response => response.json())
      .then(data => {
        const updatedRecipes = data.map(recipe => ({
          ...recipe,
          image: recipe.image ? `${BASE_URL}${recipe.image}` : '/default-image.jpg',
        }));
        setRecipes(updatedRecipes);
      })
      .catch(error => console.error("Error fetching recipes:", error));
  };

  const refreshToken = () => {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) {
      console.error('No refresh token available');
      return Promise.reject('No refresh token');
    }

    return fetch(`${BASE_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Refresh token failed');
        return response.json();
      })
      .then(data => {
        localStorage.setItem('accessToken', data.access);
        setUser({ accessToken: data.access, username: localStorage.getItem('username') });
        console.log('Token refreshed:', data.access);
        return data.access;
      })
      .catch(error => {
        console.error('Error refreshing token:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
        throw error;
      });
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('accessToken', userData.accessToken);
    localStorage.setItem('username', userData.username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('refreshToken');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const saveRecipe = (recipeData) => {
    const method = editingRecipe ? 'PUT' : 'POST';
    const url = editingRecipe && editingRecipe.id
      ? `${BASE_URL}/api/recipes/${editingRecipe.id}/`
      : `${BASE_URL}/api/recipes/`;
    let token = localStorage.getItem('accessToken');

    if (!token) {
      alert('Вы не авторизованы. Пожалуйста, войдите заново.');
      window.location.href = '/';
      return;
    }

    const formData = new FormData();
    formData.append('name', recipeData.name);
    formData.append('description', recipeData.description);
    formData.append('ingredients', recipeData.ingredients);
    formData.append('cooking_time', recipeData.cooking_time);
    formData.append('calories', recipeData.calories);
    if (recipeData.image) formData.append('image', recipeData.image);

    console.log('Sending data:', {
      name: recipeData.name,
      description: recipeData.description,
      ingredients: recipeData.ingredients,
      cooking_time: recipeData.cooking_time,
      calories: recipeData.calories,
      image: recipeData.image ? recipeData.image.name : 'No image',
    });

    const sendRequest = (accessToken) => {
      return fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: formData,
      })
        .then(response => {
          console.log('Response status:', response.status);
          return response.text().then(text => {
            console.log('Response body:', text);
            if (!response.ok) {
              throw new Error(`Failed to save recipe: ${response.status} - ${text}`);
            }
            return JSON.parse(text);
          });
        });
    };

    sendRequest(token)
      .then(() => {
        fetchRecipes();
        setShowForm(false);
        setEditingRecipe(null);
      })
      .catch(error => {
        if (error.message.includes('401')) {
          refreshToken()
            .then(newToken => sendRequest(newToken))
            .then(() => {
              fetchRecipes();
              setShowForm(false);
              setEditingRecipe(null);
            })
            .catch(() => {
              alert('Сессия истекла. Пожалуйста, войдите заново.');
            });
        } else {
          console.error("Error saving recipe:", error);
        }
      });
  };

  const deleteRecipe = (recipeId) => {
    const token = localStorage.getItem('accessToken');
    fetch(`${BASE_URL}/api/recipes/${recipeId}/`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to delete');
        setRecipes(prev => prev.filter(r => r.id !== recipeId));
      })
      .catch(error => console.error("Error deleting recipe:", error));
  };

  const toggleForm = (recipe = null) => {
    if (!user && !recipe) {
      alert('Пожалуйста, авторизуйтесь, чтобы добавить рецепт');
      return;
    }
    setEditingRecipe(recipe); // Устанавливаем рецепт для редактирования
    setShowForm(!showForm);
  };

  return (
    <Router>
      <div className="App">
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          onAddRecipe={toggleForm}
          user={user}
          onLogout={handleLogout}
          onLogin={handleLogin}
          isLoginModalOpen={isLoginModalOpen}
          setIsLoginModalOpen={setIsLoginModalOpen}
          isRegisterModalOpen={isRegisterModalOpen}
          setIsRegisterModalOpen={setIsRegisterModalOpen}
        />
        <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
          <h1>Try it today</h1>
          {user && (
            <>
              <button onClick={() => toggleForm()} style={{ marginBottom: '20px' }}>
                + Add New Recipe
              </button>
              {showForm && (
                <RecipeForm
                  onSave={saveRecipe}
                  onClose={toggleForm}
                  initialRecipe={editingRecipe}
                />
              )}
            </>
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
                      onDelete={deleteRecipe}
                      onEdit={toggleForm}
                    />
                  ))}
                </div>
              }
            />
            <Route
              path="/recipe/:id"
              element={
                <RecipeDetails
                  recipes={recipes}
                  user={user}
                  onOpenLogin={() => setIsLoginModalOpen(true)}
                  onOpenRegister={() => setIsRegisterModalOpen(true)}
                />
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;