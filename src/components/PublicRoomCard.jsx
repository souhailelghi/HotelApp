import React from 'react';
import { Users, Bed, Wifi, Coffee, Car, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PublicRoomCard({ room }) {
  const imageUrl = room.imageUrl || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop";
  
  // Determine status
  const statut = room.statut?.toLowerCase() || 'unknown';
  const isAvailable = statut === 'available' || statut === 'disponible';
  
  let statusColor = "bg-gray-100 text-gray-800 border-gray-200";
  switch(statut) {
    case 'available':
    case 'disponible':
      statusColor = "bg-green-100 text-green-800 border-green-200";
      break;
    case 'reserved':
    case 'réservé':
      statusColor = "bg-orange-100 text-orange-800 border-orange-200";
      break;
    case 'occupied':
    case 'occupé':
      statusColor = "bg-red-100 text-red-800 border-red-200";
      break;
    case 'cleaning':
    case 'nettoyage':
      statusColor = "bg-blue-100 text-blue-800 border-blue-200";
      break;
    case 'maintenance':
      statusColor = "bg-gray-200 text-gray-800 border-gray-300";
      break;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
      {/* Image Area */}
      <div className="h-48 bg-gray-200 relative">
        <img 
          src={imageUrl} 
          alt={room.name || "Room"} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm border ${statusColor}`}>
            {room.statut || 'Unknown'}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold font-serif text-gray-900 line-clamp-1">{room.name || "Deluxe Room"}</h3>
          <div className="flex items-center text-primary font-bold">
            <Tag className="w-4 h-4 mr-1" />
            ${room.pricePerNight}
          </div>
        </div>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-grow">
          {room.description || "No description provided."}
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 mb-5">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-primary opacity-70" />
            <span>Cap: {room.capacity}</span>
          </div>
          
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-2 text-primary opacity-70" />
            <span className="line-clamp-1">
              {room.kingBeds > 0 ? `${room.kingBeds}K ` : ''}
              {room.singleBeds > 0 ? `${room.singleBeds}S` : ''}
              {room.kingBeds === 0 && room.singleBeds === 0 ? 'No beds' : ''}
            </span>
          </div>

          <div className="flex items-center">
            <Wifi className={`w-4 h-4 mr-2 ${room.freeWifi ? 'text-green-500' : 'text-gray-400'}`} />
            <span className={!room.freeWifi ? 'text-gray-400 line-through' : ''}>WiFi</span>
          </div>

          <div className="flex items-center">
            <Coffee className={`w-4 h-4 mr-2 ${room.freeBreakfast ? 'text-green-500' : 'text-gray-400'}`} />
            <span className={!room.freeBreakfast ? 'text-gray-400 line-through' : ''}>Breakfast</span>
          </div>
          
          {room.freeParking !== undefined && (
            <div className="flex items-center col-span-2">
              <Car className={`w-4 h-4 mr-2 ${room.freeParking ? 'text-green-500' : 'text-gray-400'}`} />
              <span className={!room.freeParking ? 'text-gray-400 line-through' : ''}>Parking</span>
            </div>
          )}
        </div>
        
        {/* Book Now Button */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          {isAvailable ? (
            <Link 
              to="/" 
              className="block w-full text-center bg-accent hover:bg-yellow-600 text-white font-bold py-2.5 rounded-lg transition-colors shadow-sm"
              title="Search availability dates to book"
            >
              Book Now
            </Link>
          ) : (
            <button 
              disabled
              className="w-full text-center bg-gray-200 text-gray-500 font-bold py-2.5 rounded-lg cursor-not-allowed"
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
