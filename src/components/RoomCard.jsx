import { Link } from 'react-router-dom';
import { Users, Bed, Wifi, Coffee } from 'lucide-react';

export default function RoomCard({ room, checkIn, checkOut, guests, nights }) {
  const imageUrl = room.imageUrl || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop";
  const totalPrice = room.pricePerNight * nights;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col md:flex-row border border-gray-100 hover:shadow-lg transition-shadow">
      {/* Image Section */}
      <div className="w-full md:w-1/3 h-64 md:h-auto bg-gray-200 relative">
        <img 
          src={imageUrl} 
          alt={room.name || "Hotel Room"} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl font-bold font-serif text-gray-900">{room.name || "Deluxe Room"}</h3>
            <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded border border-green-200">
              {room.statut}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-2">
            {room.description || "A beautiful and comfortable room for your stay."}
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-2 text-primary" />
              <span>Capacity: {room.capacity}</span>
            </div>
            {(room.singleBeds > 0 || room.kingBeds > 0) && (
              <div className="flex items-center text-sm text-gray-600">
                <Bed className="w-4 h-4 mr-2 text-primary" />
                <span>
                  {room.kingBeds > 0 ? `${room.kingBeds} King ` : ''}
                  {room.singleBeds > 0 ? `${room.singleBeds} Single` : ''}
                </span>
              </div>
            )}
            {room.freeWifi && (
              <div className="flex items-center text-sm text-gray-600">
                <Wifi className="w-4 h-4 mr-2 text-primary" />
                <span>Free WiFi</span>
              </div>
            )}
            {room.freeBreakfast && (
              <div className="flex items-center text-sm text-gray-600">
                <Coffee className="w-4 h-4 mr-2 text-primary" />
                <span>Free Breakfast</span>
              </div>
            )}
          </div>
        </div>

        {/* Pricing and Action */}
        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mt-4 pt-4 border-t border-gray-100">
          <div className="mb-4 sm:mb-0">
            <p className="text-sm text-gray-500">Price for {nights} night{nights > 1 ? 's' : ''}</p>
            <p className="text-3xl font-bold text-gray-900">${totalPrice}</p>
            <p className="text-xs text-gray-400">${room.pricePerNight} / night</p>
          </div>
          
          <Link
            to={`/checkout/${room.idChambre}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&nights=${nights}`}
            state={{ room }}
            className="bg-accent hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-md transition-colors w-full sm:w-auto text-center shadow-md hover:shadow-lg"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
