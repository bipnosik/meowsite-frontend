import React, { useState } from 'react';
import { FaHome, FaSearch, FaUser, FaHeart, FaClipboardList, FaBars } from 'react-icons/fa';
import './Sidebar.css';

function Sidebar({ isOpen, toggleSidebar }) {
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
            <li><FaHome /><span className="nav-text">Home</span></li>
            <li><FaSearch /><span className="nav-text">Search</span></li>
            <li><FaUser /><span className="nav-text">Profile</span></li>
            <li><FaHeart /><span className="nav-text">Favorites</span></li>
            <li><FaClipboardList /><span className="nav-text">My Recipes</span></li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;