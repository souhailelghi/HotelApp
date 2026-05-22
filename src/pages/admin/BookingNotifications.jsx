import React, { useState, useEffect } from 'react';
import { reservationApi } from '../../api/reservationApi';
import BookingNotificationCard from '../../components/admin/BookingNotificationCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { Bell, RefreshCw, CalendarCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BookingNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNotifications = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setLoading(true);
    
    setError('');
    
    try {
      const data = await reservationApi.getBookingNotifications();
      // Sort newest first based on createdAt or dateReservation
      const sortedData = data.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.dateReservation || 0);
        const dateB = new Date(b.createdAt || b.dateReservation || 0);
        return dateB - dateA;
      }).map(notif => ({
        ...notif,
        statut: 'Paid'
      }));
      setNotifications(sortedData);
    } catch (err) {
      setError('Failed to load booking notifications. Please check the backend connection.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRefresh = () => {
    fetchNotifications(true);
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'All') return true;
    return (notif.statut || 'Pending').toLowerCase() === filter.toLowerCase();
  });

  // Calculate stats
  const total = notifications.length;
  const paid = notifications.filter(n => (n.statut || '').toLowerCase() === 'paid').length;

  const StatCard = ({ title, count, icon: Icon, colorClass }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{count}</p>
      </div>
      <div className={`p-4 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Bell className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">Booking Notifications</h1>
          </div>
          <p className="text-gray-500 ml-11">Track new room reservations from customers.</p>
        </div>
        
        <button 
          onClick={handleRefresh}
          disabled={isRefreshing || loading}
          className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      {!error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <StatCard title="Total Reservations" count={total} icon={CalendarCheck} colorClass="bg-gray-100 text-gray-600" />
          <StatCard title="Paid" count={paid} icon={CheckCircle} colorClass="bg-green-100 text-green-600" />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 inline-flex flex-wrap gap-1 mb-6">
        {['All', 'Paid'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f 
                ? 'bg-primary text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message="Fetching latest booking notifications..." />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : filteredNotifications.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
        >
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="w-10 h-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No booking notifications yet.</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {filter === 'All' 
              ? "When customers make reservations, they will appear here automatically."
              : `You don't have any ${filter.toLowerCase()} reservations at the moment.`}
          </p>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredNotifications.map((notif, index) => (
            <motion.div
              key={notif.idReservation || notif.id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="h-full"
            >
              <BookingNotificationCard notification={notif} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
