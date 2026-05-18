import React from 'react';

export default function CapacityFilter({ currentFilter, onFilterChange }) {
  const filters = [
    { value: 'All', label: 'All Rooms' },
    { value: '1', label: '1 Person' },
    { value: '2', label: '2 People' },
    { value: '3', label: '3 People' },
    { value: '4', label: '4 People' },
    { value: '5', label: '5 People' },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
            currentFilter === filter.value
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
