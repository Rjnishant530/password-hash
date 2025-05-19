import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

interface HeaderProps {
  toggleSidebar: () => void;
  showMenuButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, showMenuButton = true }) => {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="app-title-link">
          <div className="app-title-container">
            <img src="/logo.png" alt="Password Hash Logo" className="app-logo" />
            <h1 className="app-title">Password Hash</h1>
          </div>
        </Link>
        <div className="header-links">
          <Link to="/intent" className="header-link">Why Use This?</Link>
          {showMenuButton && (
            <button 
              className="menu-toggle" 
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              ≡
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;