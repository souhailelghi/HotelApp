import React, { useState } from 'react';
import { Users, Bed, Wifi, Coffee, Car, Tag, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function AdminRoomCard({ room, onEdit, onDelete }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  let images = [];
  if (room.imageUrls) {
    images = room.imageUrls.split(';').filter(Boolean);
  } else if (room.imageUrl) {
    images = [room.imageUrl];
  }

  const nextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  
  // Determine status badge color
  let statusColor = "bg-gray-100 text-gray-800 border-gray-200";
  switch(room.statut?.toLowerCase()) {
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
      <div className="h-48 bg-gray-200 relative group overflow-hidden">
        {images.length > 0 ? (
          <>
            <img 
              src={images[currentImageIndex]} 
              alt={room.name || "Room"} 
              className="w-full h-full object-cover transition-transform duration-300"
            />
            
            {/* Arrows (only if multiple images) */}
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {images.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-3' : 'bg-white/60'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <ImageIcon className="w-12 h-12 opacity-30" />
          </div>
        )}

        <div className="absolute top-4 right-4 flex flex-col gap-2 items-end z-20">
          <span className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm border ${statusColor}`}>
            {room.statut || 'Unknown'}
          </span>
          {room.totalImages > 1 && (
            <span className="text-xs font-bold px-3 py-1 rounded-full shadow-sm border bg-black/60 text-white border-transparent backdrop-blur-sm">
              {room.totalImages} Photos
            </span>
          )}
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
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
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
        
        {/* Actions */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
          <button 
            onClick={() => onEdit(room)}
            className="text-sm font-medium text-primary hover:text-blue-800 transition-colors px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-md"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(room)}
            className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors px-3 py-1 bg-red-50 hover:bg-red-100 rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
