
import React from 'react';

const EmptyCard = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-700 mb-4">
        Your Dashboard is Empty
      </h1>
      <p className="text-lg sm:text-xl text-gray-500 mb-6">
        Got some ideas? Start by creating your first note!
      </p>
      <button className="btn-primary px-6 py-2 text-white text-lg rounded-lg shadow-md">
        Create Note by Clicking the + icon. 
      </button>
    </div>
  );
};

export default EmptyCard;
