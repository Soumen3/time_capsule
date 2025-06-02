// src/components/Input.jsx
import React from 'react';

const Input = ({ label, type = 'text', id, value, onChange, placeholder, required = false, error, name='', ...rest }) => {
  // Extract className from rest, defaulting to an empty string if not provided
  const { className: restClassName, ...otherRest } = rest;

  const baseClassName = `shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out ${
    error ? 'border-red-500' : 'border-gray-300'
  }`;

  // Combine base classes with any additional classes from props
  const combinedClassName = `${baseClassName} ${restClassName || ''}`.trim();

  return (
    <div className="mb-4 w-full">
      {label && (
        <label htmlFor={id} className="block text-gray-700 text-sm font-semibold mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        name={name}
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={combinedClassName} // Use the combined className
        {...otherRest} // Spread the remaining rest props (excluding className)
      />
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};

export default Input;