import type { HashAlgorithm, VisualizationMethod } from './hashUtils';
import * as pako from 'pako';

export interface SavedConfig {
  id: string;
  name: string;
  text: string;
  algorithm: HashAlgorithm;
  visualizationMethod: VisualizationMethod;
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

export const exportConfigsCompressed = (): string => {
  const configs = getSavedConfigs();
  const jsonString = JSON.stringify(configs);
  const compressed = pako.deflate(jsonString);
  const binaryString = Array.from(compressed, byte => String.fromCharCode(byte)).join('');
  return btoa(binaryString);
};

export const importConfigsCompressed = (compressedData: string): boolean => {
  try {
    const binaryString = atob(compressedData);
    const compressed = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      compressed[i] = binaryString.charCodeAt(i);
    }
    const decompressed = pako.inflate(compressed, { to: 'string' });
    return importConfigs(decompressed);
  } catch (error) {
    console.error('Error importing compressed configurations:', error);
    return false;
  }
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
    
    const existingConfigs = getSavedConfigs();

    const finalConfigs = [...existingConfigs];
    configs.forEach((newConfig: SavedConfig) => {
      const exists = existingConfigs.find(config => config.id === newConfig.id);
      if (!exists) {
        finalConfigs.push(newConfig);
      }else{
        // If it exists,Here we skip.
      }
    });

    // Save the imported configs
    localStorage.setItem('passwordHashConfigs', JSON.stringify(finalConfigs));
    return true;
  } catch (error) {
    console.error('Error importing configurations:', error);
    return false;
  }
};