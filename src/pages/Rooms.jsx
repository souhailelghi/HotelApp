import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import RoomFilters from '../components/RoomFilters';
import PublicRoomCard from '../components/PublicRoomCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { chambreApi } from '../api/chambreApi';
import { LayoutDashboard } from 'lucide-react';

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [capacityFilter, setCapacityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAllRooms = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await chambreApi.getChambres();
        setRooms(data);
      } catch (err) {
        console.error("Fetch rooms error:", err);
        setError("Failed to load rooms. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllRooms();
  }, []);

  const filteredRooms = rooms.filter(room => {
    // Capacity check
    if (capacityFilter !== 'All' && room.capacity !== parseInt(capacityFilter, 10)) {
      return false;
    }
    
    // Status check
    if (statusFilter !== 'All' && room.statut !== statusFilter) {
      return false;
    }
    
    // Search query check
    if (searchQuery && !room.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Header */}
      <div className="bg-primary py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold mb-4">Our Rooms</h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            Explore our collection of luxurious rooms and suites. Filter by capacity, status, or search for your favorite room to find exactly what you're looking for.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Filters */}
        <RoomFilters 
          capacityFilter={capacityFilter}
          setCapacityFilter={setCapacityFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Results Summary */}
        <div className="mb-6 flex justify-between items-end border-b border-gray-200 pb-2">
          <h2 className="text-xl font-bold text-gray-900">Room Directory</h2>
          <div className="text-sm text-gray-500">
            Showing <span className="font-bold text-primary">{filteredRooms.length}</span> of {rooms.length} rooms
          </div>
        </div>

        {/* States */}
        {loading && <LoadingSpinner message="Loading our beautiful rooms..." />}
        {error && !loading && <ErrorMessage message={error} />}
        
        {!loading && !error && filteredRooms.length === 0 && (
          <EmptyState 
            title="No Rooms Found" 
            message="We couldn't find any rooms matching your current filters. Try adjusting your search criteria."
          />
        )}

        {/* Grid Layout */}
        {!loading && !error && filteredRooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredRooms.map(room => (
              <PublicRoomCard key={room.idChambre} room={room} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
