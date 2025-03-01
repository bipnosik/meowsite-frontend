import React from 'react';
import { FaHome, FaSearch, FaUser, FaHeart, FaClipboardList, FaBars, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ isOpen, toggleSidebar, onAddRecipe }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <div className="sidebar-content">
        <div className="user-info">
          <div className="avatar">
            <img src="https://via.placeholder.com/50" alt="User Avatar" />
          </div>
          <p className="username">Username</p>
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                <FaHome />
                <span className="nav-text">Home</span>
              </Link>
            </li>
            <li><FaSearch /><span className="nav-text">Browse</span></li>
            <li><FaUser /><span className="nav-text">Profile</span></li>
            <li><FaHeart /><span className="nav-text">Favorites</span></li>
            <li><FaClipboardList /><span className="nav-text">My Recipes</span></li>
            <li onClick={onAddRecipe} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <FaPlus />
              <span className="nav-text">Add Recipe</span>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;