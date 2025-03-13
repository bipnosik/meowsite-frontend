import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';

function SearchPage({ user, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (user) {
      fetchSearchHistory();
    } else {
      setSearchHistory([]);
    }
  }, [user]);

  const fetchSearchHistory = () => {
    const token = localStorage.getItem('accessToken');
    fetch('http://127.0.0.1:8000/api/search-history/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        // Убираем дубли из данных с сервера и ограничиваем до 10
        const uniqueHistory = [];
        const seenQueries = new Set();
        for (const item of data) {
          if (!seenQueries.has(item.query)) {
            seenQueries.add(item.query);
            uniqueHistory.push(item);
          }
          if (uniqueHistory.length >= 10) break;
        }
        setSearchHistory(uniqueHistory);
      })
      .catch(error => console.error('Ошибка загрузки истории:', error));
  };

  const saveSearchQuery = (query) => {
    if (!query) return;

    // Убираем существующий запрос из истории, если он есть
    const filteredHistory = searchHistory.filter(item => item.query !== query);
    // Добавляем новый запрос наверх и обрезаем до 10
    const updatedHistory = [{ query }, ...filteredHistory].slice(0, 10);
    setSearchHistory(updatedHistory);

    if (user) {
      const token = localStorage.getItem('accessToken');
      fetch('http://127.0.0.1:8000/api/search-history/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      })
        .then(response => {
          if (response.ok) {
            fetchSearchHistory(); // Синхронизируем с сервером
          }
        })
        .catch(error => console.error('Ошибка сохранения истории:', error));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery) {
      saveSearchQuery(searchQuery);
      onSearch(searchQuery, setSearchResults);
      setSearchQuery('');
    }
  };

  const handleHistoryClick = (query) => {
    const queryText = query.query;
    setSearchQuery(queryText);
    saveSearchQuery(queryText); // Переносим наверх без дублей
    onSearch(queryText, setSearchResults);
  };

  return (
    <div className="search-page">
      <h1>Search Recipes</h1>
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '300px', padding: '10px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '10px' }}>Search</button>
      </form>

      <div className="search-history">
        <h4>Search History</h4>
        {searchHistory.length > 0 ? (
          <ul>
            {searchHistory.map((item, index) => (
              <li
                key={index}
                onClick={() => handleHistoryClick(item)}
                style={{ cursor: 'pointer', padding: '5px 0' }}
              >
                {item.query}
              </li>
            ))}
          </ul>
        ) : (
          <p>No history yet</p>
        )}
      </div>

      <div className="search-results" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {searchResults.length > 0 ? (
          searchResults.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
}

export default SearchPage;