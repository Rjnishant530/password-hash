import React from 'react';
import './Toggle.css';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  id,
  disabled = false,
}) => {
  const toggleId = id || `toggle-${Math.random().toString(36).substring(2, 9)}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="toggle-container">
      <label className="toggle-label" htmlFor={toggleId}>
        <input
          type="checkbox"
          id={toggleId}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="toggle-input"
        />
        <span className="toggle-switch"></span>
        {label && <span className="toggle-text">{label}</span>}
      </label>
    </div>
  );
};

export default Toggle;