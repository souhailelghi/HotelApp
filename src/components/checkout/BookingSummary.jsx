import React from 'react';
import { Calendar, Users, Moon, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { calculateReservationTotals, formatDH } from '../../utils/priceUtils';

export default function BookingSummary({ room, checkIn, checkOut, guests, nights }) {
  const imageUrl = room.imageUrl || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop";
  const totals = calculateReservationTotals({ nights }, room);

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 sticky top-8">
      {/* Header Image */}
      <div className="relative h-48">
        <img 
          src={imageUrl} 
          alt={room.name || "Room"} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-xl font-bold font-serif mb-1 line-clamp-1">{room.name || "Deluxe Room"}</h2>
          <p className="text-sm opacity-90 flex items-center"><ShieldCheck className="w-4 h-4 mr-1" /> Dar Diafa Rabat</p>
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 text-lg">Your Stay</h3>
        
        {/* Dates & Guests */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-3 text-primary" />
              <div>
                <p className="font-medium text-gray-900">Check-in</p>
                <p>{checkIn}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900">Check-out</p>
              <p className="text-gray-600">{checkOut}</p>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm pt-2">
            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-3 text-primary" />
              <span className="font-medium text-gray-900">Guests</span>
            </div>
            <span className="text-gray-600">{guests} Person{guests > 1 ? 's' : ''}</span>
          </div>

          <div className="flex justify-between items-center text-sm pt-2">
            <div className="flex items-center text-gray-600">
              <Moon className="w-5 h-5 mr-3 text-primary" />
              <span className="font-medium text-gray-900">Length of stay</span>
            </div>
            <span className="text-gray-600">{nights} Night{nights > 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="space-y-2 mb-6 border-y border-gray-100 py-4">
          <div className="flex items-center text-sm text-green-700 bg-green-50 p-2 rounded-lg">
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Taxes and fees included
          </div>
          {room.freeCancellationAvailable && (
            <div className="flex items-center text-sm text-green-700 bg-green-50 p-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Free cancellation available
            </div>
          )}
        </div>

        {/* Pricing */}
        <div className="space-y-2 mb-6 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Price per night</span>
            <span>{formatDH(totals.pricePerNight)}</span>
          </div>
          <div className="flex justify-between">
            <span>Subtotal HT</span>
            <span>{formatDH(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>TVA 10%</span>
            <span>{formatDH(totals.taxes)}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
          <span className="font-bold text-gray-900 text-lg">Total TTC</span>
          <span className="font-bold text-primary text-2xl">{formatDH(totals.totalTTC)}</span>
        </div>
      </div>
    </div>
  );
}
