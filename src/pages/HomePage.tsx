import React, { useState, useRef } from 'react';
import './HomePage.css';
import Layout from '../components/layout/Layout';
import HashGenerator from '../components/hash/HashGenerator';
import VisualizationSelector from '../components/visualization/VisualizationSelector';
import type { VisualizationMethod } from '../utils/hashUtils';
import type { SavedConfig } from '../utils/storageUtils';

const HomePage: React.FC = () => {
  const [secondarySalt, setSecondarySalt] = useState('');
  const [visualizationMethod, setVisualizationMethod] = useState<VisualizationMethod>('keypad');
  const [text, setText] = useState('');
  const [algorithm, setAlgorithm] = useState('SHA512');
  const [sidebarRefreshTrigger, setSidebarRefreshTrigger] = useState(0);
  const layoutRef = useRef<{ toggleSidebar: () => void }>(null);

  const handleApplySecondarySalt = (salt: string, method: VisualizationMethod) => {
    setSecondarySalt(salt);
    setVisualizationMethod(method);
  };

  const handleClearAll = () => {
    setSecondarySalt('');
  };

  const handleLoadConfig = (config: SavedConfig) => {
    setText(config.text);
    // Don't set salt from saved config
    setAlgorithm(config.algorithm);
    // Don't set secondarySalt from saved config
    setVisualizationMethod(config.visualizationMethod);
  };

  const handleConfigSaved = () => {
    // Increment the refresh trigger to force sidebar to reload configs
    setSidebarRefreshTrigger(prev => prev + 1);
    
    // Open the sidebar to show the saved config
    setTimeout(() => {
      if (layoutRef.current) {
        layoutRef.current.toggleSidebar();
      }
    }, 1800); // Wait for the save modal to close
  };

  return (
    <Layout 
      onLoadConfig={handleLoadConfig}
      ref={layoutRef}
      sidebarRefreshTrigger={sidebarRefreshTrigger}
    >
      <div className="home-page">
        <HashGenerator 
          secondarySalt={secondarySalt} 
          onClear={handleClearAll}
          visualizationMethod={visualizationMethod}
          initialText={text}
          initialSalt={''}
          initialAlgorithm={algorithm}
          onConfigSaved={handleConfigSaved}
        />
        <VisualizationSelector 
          onApplySalt={handleApplySecondarySalt}
          initialMethod={visualizationMethod}
        />
      </div>
    </Layout>
  );
};

export default HomePage;