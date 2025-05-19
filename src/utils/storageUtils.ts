import type { HashAlgorithm, VisualizationMethod } from './hashUtils';

export interface SavedConfig {
  id: string;
  name: string;
  text: string;
  salt: string;
  algorithm: HashAlgorithm;
  visualizationMethod: VisualizationMethod;
  secondarySalt: string;
  timestamp: number;
}

export const saveConfig = (config: Omit<SavedConfig, 'id' | 'timestamp'>) => {
  const savedConfigs = getSavedConfigs();
  const newConfig: SavedConfig = {
    ...config,
    id: Date.now().toString(),
    timestamp: Date.now()
  };
  
  savedConfigs.push(newConfig);
  localStorage.setItem('passwordHashConfigs', JSON.stringify(savedConfigs));
  return newConfig;
};

export const getSavedConfigs = (): SavedConfig[] => {
  const configs = localStorage.getItem('passwordHashConfigs');
  return configs ? JSON.parse(configs) : [];
};

export const deleteSavedConfig = (id: string) => {
  const savedConfigs = getSavedConfigs();
  const updatedConfigs = savedConfigs.filter(config => config.id !== id);
  localStorage.setItem('passwordHashConfigs', JSON.stringify(updatedConfigs));
};

export const exportConfigs = (): string => {
  const configs = getSavedConfigs();
  return JSON.stringify(configs);
};

export const importConfigs = (jsonData: string): boolean => {
  try {
    const configs = JSON.parse(jsonData);
    
    // Validate the imported data
    if (!Array.isArray(configs)) {
      return false;
    }
    
    // Check if each item has the required fields
    const isValid = configs.every(config => 
      typeof config.id === 'string' &&
      typeof config.name === 'string' &&
      typeof config.text === 'string' &&
      typeof config.algorithm === 'string' &&
      typeof config.visualizationMethod === 'string' &&
      typeof config.timestamp === 'number'
    );
    
    if (!isValid) {
      return false;
    }
    
    // Save the imported configs
    localStorage.setItem('passwordHashConfigs', jsonData);
    return true;
  } catch (error) {
    console.error('Error importing configurations:', error);
    return false;
  }
};