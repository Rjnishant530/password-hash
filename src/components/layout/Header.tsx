import React from 'react';
import './Header.css';

interface HeaderProps {
  toggleSidebar: () => void;
  showMenuButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, showMenuButton = true }) => {
  return (
    <header className="header">
      <div className="header-content">
        <h1 className="app-title">Password Hash</h1>
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
    </header>
  );
};

export default Header;