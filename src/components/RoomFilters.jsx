import React from 'react';
import { Search } from 'lucide-react';

export default function RoomFilters({ 
  capacityFilter, 
  setCapacityFilter, 
  searchQuery,
  setSearchQuery
}) {
  const capacities = ['All', '1', '2', '3', '4', '5'];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Room Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Single Comfort Room"
              className="pl-10 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-accent outline-none transition-all"
            />
          </div>
        </div>

        {/* Capacity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
          <select 
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-accent outline-none transition-all bg-white"
          >
            {capacities.map(cap => (
              <option key={cap} value={cap}>
                {cap === 'All' ? 'All Capacities' : `${cap} Person${cap > '1' ? 's' : ''}`}
              </option>
            ))}
          </select>
        </div>

      </div>
    </div>
  );
}
