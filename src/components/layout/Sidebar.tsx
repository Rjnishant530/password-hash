import React from 'react';
import './Sidebar.css';
import SavedConfigsList from '../ui/SavedConfigsList';
import type { SavedConfig } from '../../utils/storageUtils';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadConfig: (config: SavedConfig) => void;
  refreshTrigger?: number;
  isDesktop?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  onLoadConfig,
  refreshTrigger = 0,
  isDesktop = false
}) => {
  return (
    <>
      {isOpen && !isDesktop && <div className="sidebar-backdrop" onClick={onClose}></div>}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Menu</h2>
          {!isDesktop && (
            <button className="sidebar-close" onClick={onClose} aria-label="Close sidebar">
              &times;
            </button>
          )}
        </div>
        <div className="sidebar-content">
          <SavedConfigsList 
            key={`configs-${refreshTrigger}-${isOpen ? 'open' : 'closed'}`}
            onLoadConfig={(config) => {
              onLoadConfig(config);
              if (!isDesktop) {
                onClose();
              }
            }} 
          />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;