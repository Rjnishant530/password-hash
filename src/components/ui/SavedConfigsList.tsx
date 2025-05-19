import React, { useState, useEffect, useRef } from 'react';
import './SavedConfigsList.css';
import Card from './Card';
import Button from './Button';
import { getSavedConfigs, deleteSavedConfig, exportConfigs, importConfigs } from '../../utils/storageUtils';
import type { SavedConfig } from '../../utils/storageUtils';

interface SavedConfigsListProps {
  onLoadConfig: (config: SavedConfig) => void;
}

const SavedConfigsList: React.FC<SavedConfigsListProps> = ({ onLoadConfig }) => {
  const [configs, setConfigs] = useState<SavedConfig[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleExportConfigs = () => {
    const configsJson = exportConfigs();
    const blob = new Blob([configsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'password-hash-configs.json';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImportConfigs = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importConfigs(content);
      
      if (success) {
        loadConfigs();
      } else {
        setImportError('Invalid configuration file format');
      }
    };
    
    reader.readAsText(file);
    
    // Reset the input so the same file can be selected again
    e.target.value = '';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  if (configs.length === 0) {
    return (
      <Card className="saved-configs-list">
        <div className="no-configs">No saved configurations</div>
        <div className="configs-actions">
          <input
            type="file"
            ref={fileInputRef}
            accept=".json"
            onChange={handleImportConfigs}
            style={{ display: 'none' }}
          />
          <Button variant="secondary" onClick={handleImportClick}>
            Import Configs
          </Button>
          {importError && <div className="import-error">{importError}</div>}
        </div>
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
      <div className="configs-import-export">
        <Button onClick={handleExportConfigs} variant="outline">
          Export All
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          accept=".json"
          onChange={handleImportConfigs}
          style={{ display: 'none' }}
        />
        <Button variant="outline" onClick={handleImportClick}>
          Import
        </Button>
      </div>
      {importError && <div className="import-error">{importError}</div>}
    </Card>
  );
};

export default SavedConfigsList;