import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserDetails } from '../../shared/hooks/index.js';
import './Navbar.css';

const AppNavbar = ({ modoOscuro, setModoOscuro }) => {
  const navigate = useNavigate();
  
  return (
    <nav className="custom-navbar d-flex justify-content-between align-items-center">
      <span
        className="navbar-brand"
        onClick={() => navigate('/')}
        style={{ cursor: 'pointer' }}
      >
        🌐 Blog
      </span>

      <div className="d-flex gap-2 align-items-center">
        <button
          className="btn btn-custom"
          onClick={() => setModoOscuro((prev) => !prev)}
        >
          {modoOscuro ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

export default AppNavbar;
