import React from 'react';

const Textarea = ({
  label,
  value,
  onChange,
  placeholder = 'Type your message...',
  rows = 5,
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
    <textarea
      className={`
        w-full px-4 py-3 rounded-lg border 
        focus:outline-none focus:ring-2 focus:ring-blue-400
        bg-white text-gray-900 shadow-sm
        transition duration-200
        ${error ? 'border-red-400 focus:ring-red-300' : 'border-gray-300'}
        resize-y
      `}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      {...props}
    />
    {error && (
      <p className="mt-1 text-xs text-red-500">{error}</p>
    )}
  </div>
);

export default Textarea;
