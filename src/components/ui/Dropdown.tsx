import React from 'react';
import './Dropdown.css';

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  label,
  id,
  name,
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="dropdown-container">
      {label && <label className='dropdown-label' htmlFor={id}>{label}</label>}
      <select
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="dropdown-select"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;