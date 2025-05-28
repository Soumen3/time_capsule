import React from 'react';

const TimePicker = ({
  label = 'Select Time',
  value,
  onChange,
  min,
  max,
  className = '',
  error = '',
  ...props
}) => (
  <div className={`w-full mb-4 ${className}`}>
    {label && (
      <label className="block mb-2 text-sm font-semibold text-gray-700">
        {label}
      </label>
    )}
    <input
      type="time"
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      className={`
        w-full px-4 py-3 rounded-lg border 
        focus:outline-none focus:ring-2 focus:ring-blue-400
        bg-white text-gray-900 shadow-sm
        transition duration-200
        ${error ? 'border-red-400 focus:ring-red-300' : 'border-gray-300'}
      `}
      {...props}
    />
    {error && (
      <p className="mt-1 text-xs text-red-500">{error}</p>
    )}
  </div>
);

export default TimePicker;
