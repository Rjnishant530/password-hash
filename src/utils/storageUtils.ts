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