import React from 'react';
import { Calendar, User, Phone, Mail, Bed, Moon, Hash } from 'lucide-react';

export default function BookingNotificationCard({ notification }) {
  const id = notification.idReservation || notification.id || 'N/A';
  const clientName = notification.clientName || 'Unknown Client';
  const email = notification.clientEmail || 'N/A';
  const phone = notification.clientPhone || 'N/A';
  
  const roomName = notification.roomName || 'Unknown Room';
  const roomCapacity = notification.roomCapacity || '-';
  const roomPrice = notification.roomPrice || 0;
  
  const checkIn = notification.dateDebut ? new Date(notification.dateDebut).toLocaleDateString() : 'N/A';
  const checkOut = notification.dateFin ? new Date(notification.dateFin).toLocaleDateString() : 'N/A';
  
  const statut = (notification.statut || 'Paid').toLowerCase();
  
  let statusColor = "bg-orange-100 text-orange-800 border-orange-200";
  if (statut === 'confirmed') statusColor = "bg-blue-100 text-blue-800 border-blue-200";
  if (statut === 'paid') statusColor = "bg-green-100 text-green-800 border-green-200";
  if (statut === 'cancelled') statusColor = "bg-red-100 text-red-800 border-red-200";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Hash className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Reservation #{id}</h3>
              <p className="text-xs text-gray-500">
                {new Date(notification.createdAt || notification.dateReservation || new Date()).toLocaleString()}
              </p>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm border capitalize ${statusColor}`}>
            {statut}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Client Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-gray-500" /> Client Details
            </h4>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span className="font-medium text-gray-800">{clientName}</span>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <a href={`mailto:${email}`} className="hover:text-primary transition-colors line-clamp-1">{email}</a>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <a href={`tel:${phone}`} className="hover:text-primary transition-colors">{phone}</a>
            </div>
          </div>

          {/* Room Info */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
              <Bed className="w-4 h-4 text-gray-500" /> Stay Details
            </h4>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span className="font-medium text-gray-800 line-clamp-1">{roomName}</span>
              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 whitespace-nowrap">Cap: {roomCapacity}</span>
              {roomPrice > 0 && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded border border-green-100">${roomPrice}</span>}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{checkIn} → {checkOut}</span>
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-gray-400" />
              <span>{notification.nights || 1} Nights</span>
            </div>
          </div>
        </div>
      </div>

      {notification.message && (
        <div className="mt-4 pt-4 border-t border-gray-50">
          <p className="text-sm text-gray-600 italic">
            <span className="font-semibold not-italic">Message: </span>
            {notification.message}
          </p>
        </div>
      )}
    </div>
  );
}
