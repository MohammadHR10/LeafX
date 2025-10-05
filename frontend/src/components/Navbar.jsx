import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ user, onLogout }) {
  const location = useLocation();

  // Public routes (always visible)
  const publicNavItems = [
    { path: '/', label: 'Home' }
  ];

  // Protected routes (only visible when authenticated)
  const protectedNavItems = [
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/advising', label: 'Advising' },
    { path: '/supply-chain', label: 'Supply Chain' },
    { path: '/chatbot', label: 'AI Chat' },
    { path: '/voice-chat', label: 'Voice Chat' }
  ];

  // Show all nav items if user is logged in, otherwise only public items
  const navItems = user ? [...publicNavItems, ...protectedNavItems] : publicNavItems;

  return (
    <nav className="nav">
      <div className="brand">
        <Link to="/" className="logo">
          <span className="logo-icon"></span>
          <span className="logo-text">LeafX</span>
        </Link>
      </div>

      <ul className="menu">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`menu-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="user-section">
        {user ? (
          <>
            <span className="welcome">Welcome, {user.name}!</span>
            <button className="logout-btn" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth" className="login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

// Component styles moved to Navbar.css

export default Navbar;
