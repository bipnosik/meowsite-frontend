import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import RecipeCard from './RecipeCard';
import RecipeDetails from './RecipeDetails';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/recipes/')
      .then(response => response.json())
      .then(data => setRecipes(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const handleCardClick = (recipe) => {
    setSelectedRecipe(recipe);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="App">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <h1>Try it today</h1>
        {selectedRecipe ? (
          <RecipeDetails recipe={selectedRecipe} />
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {recipes.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} onClick={handleCardClick} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;