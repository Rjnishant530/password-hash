import React, { useState, useEffect } from 'react';
import './SavedConfigsList.css';
import Card from './Card';
import Button from './Button';
import { getSavedConfigs, deleteSavedConfig } from '../../utils/storageUtils';
import type { SavedConfig } from '../../utils/storageUtils';

interface SavedConfigsListProps {
  onLoadConfig: (config: SavedConfig) => void;
}

const SavedConfigsList: React.FC<SavedConfigsListProps> = ({ onLoadConfig }) => {
  const [configs, setConfigs] = useState<SavedConfig[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = () => {
    const savedConfigs = getSavedConfigs();
    setConfigs(savedConfigs);
  };

  const handleSelectConfig = (id: string) => {
    setSelectedConfigId(id === selectedConfigId ? null : id);
  };

  const handleLoadConfig = () => {
    if (!selectedConfigId) return;
    
    const config = configs.find(c => c.id === selectedConfigId);
    if (config) {
      onLoadConfig(config);
    }
  };

  const handleDeleteConfig = () => {
    if (!selectedConfigId) return;
    
    deleteSavedConfig(selectedConfigId);
    loadConfigs();
    setSelectedConfigId(null);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (configs.length === 0) {
    return (
      <Card className="saved-configs-list">
        <div className="no-configs">No saved configurations</div>
      </Card>
    );
  }

  return (
    <Card className="saved-configs-list">
      <h3 className="configs-title">Saved Configurations</h3>
      <div className="configs-list">
        {configs.map(config => (
          <div 
            key={config.id} 
            className={`config-item ${selectedConfigId === config.id ? 'selected' : ''}`}
            onClick={() => handleSelectConfig(config.id)}
          >
            <div className="config-name">{config.name}</div>
            <div className="config-details">
              <span className="config-algorithm">{config.algorithm}</span>
              <span className="config-date">{formatDate(config.timestamp)}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="configs-actions">
        <Button 
          onClick={handleLoadConfig} 
          disabled={!selectedConfigId}
        >
          Load
        </Button>
        <Button 
          onClick={handleDeleteConfig} 
          variant="secondary" 
          disabled={!selectedConfigId}
        >
          Delete
        </Button>
      </div>
    </Card>
  );
};

export default SavedConfigsList;