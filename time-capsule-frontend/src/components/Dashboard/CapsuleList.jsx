// src/components/Dashboard/CapsuleList.jsx
import React from 'react';
import CapsuleCard from './CapsuleCard'; // Adjust path if needed
import Button from '../Button'; // Adjust path if needed
import { Link } from 'react-router-dom';

const CapsuleList = ({ capsules, title, onDeleteSuccess }) => {
  if (!capsules || capsules.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <p className="text-xl text-gray-600 mb-6">You don't have any {title.toLowerCase()} capsules yet.</p>
        <Link to="/create-capsule">
          <Button variant="primary">Create Capsule</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capsules.map((capsule) => (
          <CapsuleCard key={capsule.id} capsule={capsule} onDeleteSuccess={onDeleteSuccess} />
        ))}
      </div>
    </div>
  );
};

export default CapsuleList;