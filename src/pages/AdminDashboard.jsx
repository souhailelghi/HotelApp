import React, { useState, useEffect } from 'react';
import CapacityFilter from '../components/admin/CapacityFilter';
import AdminRoomCard from '../components/admin/AdminRoomCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import AddRoomModal from '../components/admin/AddRoomModal';
import DeleteConfirmModal from '../components/admin/DeleteConfirmModal';
import { chambreApi } from '../api/chambreApi';
import { LayoutDashboard, PlusCircle, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [deletingRoom, setDeletingRoom] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchAllRooms = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await chambreApi.getChambres();
        setRooms(data);
      } catch (err) {
        console.error("Admin dashboard fetch error:", err);
        setError("Failed to load rooms. Please check your backend connection.");
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchAllRooms();
  }, []);

  const handleRoomAddedOrUpdated = (message) => {
    setSuccessMessage(message || 'Room successfully saved!');
    setTimeout(() => setSuccessMessage(''), 3000);
    setEditingRoom(null);
    fetchAllRooms(); // Refetch to update the list
  };

  const handleRoomDeleted = () => {
    setSuccessMessage('Room successfully deleted!');
    setTimeout(() => setSuccessMessage(''), 3000);
    setDeletingRoom(null);
    fetchAllRooms(); // Refetch to update the list
  };

  const filteredRooms = rooms.filter(room => {
    if (filter === 'All') return true;
    return room.capacity === parseInt(filter, 10);
  });

  return (
    <div className="flex flex-col h-full pb-10">
      
      {/* Admin Header */}
      <div className="bg-white border-b border-gray-200 py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <LayoutDashboard className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-3xl font-serif font-bold text-gray-900">Admin Dashboard</h1>
              </div>
              <p className="text-gray-500 ml-11">Manage your property's rooms and availability.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  setEditingRoom(null);
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-2 bg-primary hover:bg-blue-900 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                <PlusCircle className="w-5 h-5" />
                Add New Room
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl flex items-center shadow-sm">
            <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Rooms Management</h2>
              <p className="text-sm text-gray-500">Filter rooms by capacity</p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <p className="text-sm text-gray-500">Total Rooms: <span className="font-bold text-gray-900">{rooms.length}</span></p>
              <p className="text-sm text-gray-500">Showing: <span className="font-bold text-primary">{filteredRooms.length}</span></p>
            </div>
          </div>
          
          <CapacityFilter currentFilter={filter} onFilterChange={setFilter} />
        </div>

        {/* States */}
        {loading && <LoadingSpinner message="Loading property data..." />}
        {error && !loading && <ErrorMessage message={error} />}
        
        {!loading && !error && filteredRooms.length === 0 && (
          <EmptyState 
            title="No Rooms Found" 
            message={filter === 'All' ? "Your property doesn't have any rooms yet." : `No rooms found with capacity for ${filter} people.`}
          />
        )}

        {/* Grid Layout */}
        {!loading && !error && filteredRooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map(room => (
              <AdminRoomCard 
                key={room.idChambre} 
                room={room} 
                onEdit={setEditingRoom}
                onDelete={setDeletingRoom}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <AddRoomModal 
        isOpen={isAddModalOpen || !!editingRoom} 
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingRoom(null);
        }} 
        onRoomAdded={handleRoomAddedOrUpdated} 
        initialData={editingRoom}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal 
        isOpen={!!deletingRoom}
        onClose={() => setDeletingRoom(null)}
        room={deletingRoom}
        onRoomDeleted={handleRoomDeleted}
      />
    </div>
  );
}
