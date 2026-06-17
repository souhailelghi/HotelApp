import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, Hash, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { reservationApi } from '../api/reservationApi';
import { chambreApi } from '../api/chambreApi';
import { useAuth } from '../context/AuthContext';

export default function MyReservations() {
  const { user, loading: authLoading } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchReservations = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all reservations and filter by the logged-in user's GUID
      const data = await reservationApi.getReservations();
      const myData = data.filter(r => r.idClient === user?.idClient || r.idClient === user?.id);
      // Sort by newest check-in first
      const sortedData = myData.sort((a, b) => new Date(b.dateDebut || 0) - new Date(a.dateDebut || 0));
      setReservations(sortedData);
    } catch (err) {
      console.error("Fetch reservations error:", err);
      setError("Failed to load your reservations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleCancel = async (reservation) => {
    const resId = reservation.idReservation || reservation.id;
    if (!resId) return;

    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    setCancellingId(resId);
    try {
      // Update Reservation Status
      await reservationApi.updateReservation(resId, {
        ...reservation,
        statut: 'Cancelled'
      });

      // Attempt to update room status to Available if we have room info
      const roomId = reservation.idChambre || reservation.roomId;
      if (roomId) {
        // We need the full room object to update if backend requires it.
        // We'll fetch all rooms, find this one, and update it.
        const allRooms = await chambreApi.getChambres();
        const roomToUpdate = allRooms.find(r => r.idChambre === roomId || r.id === roomId);
        
        if (roomToUpdate) {
          await chambreApi.updateChambre(roomId, {
            ...roomToUpdate,
            statut: 'Available'
          });
        }
      }

      // Refresh list
      await fetchReservations();
      
    } catch (err) {
      console.error("Cancellation error:", err);
      alert("Failed to cancel the reservation. Please try again or contact support.");
    } finally {
      setCancellingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <LoadingSpinner message="Checking authentication..." />
        </main>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Header */}
      <div className="bg-primary py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold mb-4">My Reservations</h1>
          <p className="text-lg text-blue-100 max-w-2xl">
            View and manage your upcoming stays with us.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {loading && <LoadingSpinner message="Loading your reservations..." />}
        {error && !loading && <ErrorMessage message={error} />}
        
        {!loading && !error && reservations.length === 0 && (
          <EmptyState 
            title="No Reservations Found" 
            message="You don't have any reservations yet. Head over to our Rooms page to book your next stay!"
          />
        )}

        {!loading && !error && reservations.length > 0 && (
          <div className="space-y-6">
            {reservations.map((res, index) => {
              const resId = res.idReservation || res.id || `temp-${index}`;
              const checkInDate = new Date(res.dateDebut);
              const checkOutDate = new Date(res.dateFin);
              
              // Cancellation Rule: BEFORE check-in date
              const today = new Date();
              today.setHours(0, 0, 0, 0); // start of today
              
              const checkInDay = new Date(checkInDate);
              checkInDay.setHours(0, 0, 0, 0);

              const isExpired = today >= checkInDay;
              const statut = (res.statut || '').toLowerCase();
              const isCancelled = statut === 'cancelled' || statut === 'annulé';

              return (
                <motion.div 
                  key={resId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row gap-6 md:items-center justify-between"
                >
                  <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* ID & Room */}
                    <div>
                      <div className="text-sm text-gray-500 mb-1 flex items-center gap-1.5">
                        <Hash className="w-4 h-4" /> Reservation ID
                      </div>
                      <div className="font-bold text-gray-900 mb-2">#{resId}</div>
                      <div className="font-semibold text-primary">{res.roomName || `Room #${res.idChambre || 'N/A'}`}</div>
                    </div>
                    
                    {/* Dates */}
                    <div>
                      <div className="text-sm text-gray-500 mb-1 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" /> Dates
                      </div>
                      <div className="font-medium text-gray-900">
                        {checkInDate.toLocaleDateString()}
                        <span className="mx-2 text-gray-400">→</span>
                        {checkOutDate.toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        {res.nights || 1} Night(s)
                      </div>
                    </div>

                    {/* Guests & Price */}
                    <div>
                      <div className="text-sm text-gray-500 mb-1 flex items-center gap-1.5">
                        <User className="w-4 h-4" /> Guest Info
                      </div>
                      <div className="font-medium text-gray-900 line-clamp-1">{res.clientName || 'N/A'}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        Total Price: <span className="font-bold text-green-600">${res.prixTotal || res.totalPrice || 0}</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Status</div>
                      <div className="flex items-center gap-2">
                        {isCancelled ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                            <XCircle className="w-3.5 h-3.5" /> Cancelled
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                            <CheckCircle className="w-3.5 h-3.5" /> {res.statut || 'Confirmed'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex-shrink-0 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 md:pl-6 md:border-l">
                    {!isCancelled ? (
                      <div className="flex flex-col items-center md:items-end">
                        <button
                          onClick={() => handleCancel(res)}
                          disabled={isExpired || cancellingId === resId}
                          className={`w-full md:w-auto px-5 py-2.5 rounded-lg font-bold transition-all ${
                            isExpired 
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 hover:border-red-300 shadow-sm'
                          }`}
                        >
                          {cancellingId === resId ? 'Cancelling...' : 'Cancel Reservation'}
                        </button>
                        {isExpired && (
                          <div className="text-xs text-orange-500 mt-2 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> Cancellation period has expired.
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="px-5 py-2.5 rounded-lg bg-gray-50 text-gray-400 font-bold border border-gray-100 text-center">
                        Reservation Cancelled
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
