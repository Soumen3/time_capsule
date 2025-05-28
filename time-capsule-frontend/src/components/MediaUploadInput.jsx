// src/components/MediaUploadInput.jsx
import React, { useState, useRef, useEffect } from 'react';


const MediaUploadInput = ({
  label,
  onChange,
  initialFiles = [],
  multiple = true,
  accept = 'image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain',
}) => {
  const [selectedFiles, setSelectedFiles] = useState(initialFiles);
  const fileInputRef = useRef(null);

  // Effect to notify parent component when selectedFiles change
  useEffect(() => {
    // Only call onChange if the selectedFiles array has actually changed
    // This prevents unnecessary re-renders if initialFiles are the same
    if (typeof onChange === 'function') {
      if (JSON.stringify(selectedFiles.map(f => f.name)) !== JSON.stringify(initialFiles.map(f => f.name))) {
        onChange(selectedFiles);
      }
    }
  }, [selectedFiles, onChange, initialFiles]); // Added initialFiles to dependency array

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (multiple) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    } else {
      setSelectedFiles(files.length > 0 ? [files[0]] : []);
    }
    // Clear the input value to allow selecting the same file again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };


  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const getPreviewUrl = (file) => {
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  // Drag and drop handlers
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const files = Array.from(event.dataTransfer.files);
    if (multiple) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...files]);
    } else {
      setSelectedFiles(files.length > 0 ? [files[0]] : []);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div className="mb-4 w-full">
      {label && (
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          {label}
        </label>
      )}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition duration-200"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple={multiple}
          accept={accept}
          className="hidden"
        />
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 0115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          ></path>
        </svg>
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">
          {multiple ? 'Multiple files allowed' : 'Single file allowed'} (Images, Videos, Docs)
        </p>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <p className="text-sm font-semibold text-gray-700 mb-2">Selected Files:</p>
          <ul className="space-y-2">
            {selectedFiles.map((file, index) => {
              const previewUrl = getPreviewUrl(file);
              return (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 bg-white rounded-md shadow-sm border border-gray-100"
                >
                  <div className="flex items-center flex-grow min-w-0">
                    {previewUrl ? (
                      file.type.startsWith('image/') ? (
                        <img
                          src={previewUrl}
                          alt="preview"
                          className="h-10 w-10 object-cover rounded-md mr-3"
                        />
                      ) : (
                        <video
                          src={previewUrl}
                          className="h-10 w-10 object-cover rounded-md mr-3"
                          controls={false}
                          muted
                        />
                      )
                    ) : (
                      <span className="text-gray-500 mr-3">📄</span> // Document icon
                    )}
                    <span className="text-sm text-gray-800 truncate">{file.name}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="ml-4 text-red-500 hover:text-red-700 focus:outline-none"
                    aria-label={`Remove ${file.name}`}
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MediaUploadInput;
