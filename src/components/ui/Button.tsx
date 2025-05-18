import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  fullWidth = false,
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`button ${variant} ${fullWidth ? 'full-width' : ''}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;