import React, { useState } from 'react';
import { X, Trash2, Loader2 } from 'lucide-react';
import { chambreApi } from '../../api/chambreApi';

export default function DeleteConfirmModal({ isOpen, onClose, room, onRoomDeleted }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !room) return null;

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      await chambreApi.deleteChambre(room.idChambre);
      onRoomDeleted();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to delete the room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-red-50">
          <div className="flex items-center text-red-600">
            <Trash2 className="w-5 h-5 mr-2" />
            <h2 className="text-xl font-bold font-serif">Delete Room</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
          <p className="text-gray-700 mb-2">Are you sure you want to delete this room?</p>
          <p className="font-bold text-gray-900 border-l-4 border-red-500 pl-3 py-1 bg-gray-50">{room.name}</p>
          <p className="text-sm text-gray-500 mt-4">This action cannot be undone.</p>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={handleDelete}
            disabled={loading}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors flex items-center shadow-sm disabled:opacity-70"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...</>
            ) : (
              'Delete Room'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
