import React, { useState, useEffect } from 'react';
import './VisualizationSelector.css';
import Dropdown from '../ui/Dropdown';
import Card from '../ui/Card';
import KeypadVisualizer from './KeypadVisualizer';
import AndroidPatternVisualizer from './AndroidPatternVisualizer';
import BankVaultVisualizer from './BankVaultVisualizer';
import { visualizationMethods } from '../../utils/hashUtils';
import type { VisualizationMethod } from '../../utils/hashUtils';

interface VisualizationSelectorProps {
  onApplySalt: (salt: string, method: VisualizationMethod) => void;
  initialMethod?: VisualizationMethod;
}

const VisualizationSelector: React.FC<VisualizationSelectorProps> = ({ 
  onApplySalt,
  initialMethod = 'keypad'
}) => {
  const [method, setMethod] = useState<VisualizationMethod>(initialMethod);

  useEffect(() => {
    setMethod(initialMethod);
  }, [initialMethod]);

  const handleMethodChange = (value: string) => {
    setMethod(value as VisualizationMethod);
  };

  const handleApplySalt = (salt: string) => {
    onApplySalt(salt, method);
  };

  return (
    <div className="visualization-selector">
      <Card>
        <div className="visualization-header">
          <h3 style={{marginBottom:'20px'}}>Secondary Salt Method (Optional)</h3>
          
          <Dropdown
            options={visualizationMethods}
            value={method}
            onChange={handleMethodChange}
          />
        </div>
        
        <div className="visualization-content">
          {method === 'keypad' && (
            <KeypadVisualizer onApplySalt={handleApplySalt} />
          )}
          
          {method === 'androidPattern' && (
            <AndroidPatternVisualizer onApplySalt={handleApplySalt} />
          )}
          
          {method === 'bankVault' && (
            <BankVaultVisualizer onApplySalt={handleApplySalt} />
          )}
        </div>
      </Card>
    </div>
  );
};

export default VisualizationSelector;