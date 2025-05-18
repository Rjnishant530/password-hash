import React from 'react';
import './Input.css';

interface InputProps {
  type?: 'text' | 'password' | 'email';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  showPasswordToggle?: boolean;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  id,
  name,
  required = false,
  disabled = false,
  showPasswordToggle = false,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="input-container">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="input-wrapper">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          id={id}
          name={name}
          required={required}
          disabled={disabled}
          className="input-field"
        />
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="password-toggle"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;