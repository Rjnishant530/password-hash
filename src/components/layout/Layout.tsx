import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import './Layout.css';
import type { SavedConfig } from '../../utils/storageUtils';

interface LayoutProps {
  children: React.ReactNode;
  onLoadConfig?: (config: SavedConfig) => void;
  sidebarRefreshTrigger?: number;
  showSidebar?: boolean;
}

const Layout = forwardRef<{ toggleSidebar: () => void }, LayoutProps>(
  ({ children, onLoadConfig, sidebarRefreshTrigger = 0, showSidebar = true }, ref) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 992);

    // Check if we're on desktop
    useEffect(() => {
      const handleResize = () => {
        setIsDesktop(window.innerWidth >= 992);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
      if (!isDesktop) {
        setSidebarOpen(!sidebarOpen);
      }
    };

    const closeSidebar = () => {
      if (!isDesktop) {
        setSidebarOpen(false);
      }
    };

    // Expose toggleSidebar method to parent
    useImperativeHandle(ref, () => ({
      toggleSidebar
    }));

    const handleLoadConfig = (config: SavedConfig) => {
      if (onLoadConfig) {
        onLoadConfig(config);
      }
    };

    // Always show sidebar on desktop if showSidebar is true
    const displaySidebar = showSidebar && (isDesktop || sidebarOpen);

    return (
      <div className="layout">
        <Header toggleSidebar={toggleSidebar} showMenuButton={showSidebar && !isDesktop} />
        <div className="layout-content">
          {showSidebar && (
            <Sidebar 
              isOpen={displaySidebar} 
              onClose={closeSidebar} 
              onLoadConfig={handleLoadConfig}
              refreshTrigger={sidebarRefreshTrigger}
              isDesktop={isDesktop}
            />
          )}
          <main className="main-content">
            <div className="container">{children}</div>
          </main>
        </div>
      </div>
    );
  }
);

// Add display name for React DevTools
Layout.displayName = 'Layout';

export default Layout;