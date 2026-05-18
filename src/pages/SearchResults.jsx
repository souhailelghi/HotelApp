import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import RoomCard from '../components/RoomCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { chambreApi } from '../api/chambreApi';
import { Calendar } from 'lucide-react';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  // Calculate nights. Ensure it's at least 1.
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)));

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError('');
      console.log(`[SEARCH] Initializing search for CheckIn: ${checkIn}, CheckOut: ${checkOut}, Guests: ${guests}`);
      try {
        if (!checkIn || !checkOut || !guests) {
          throw new Error("Missing search parameters");
        }
        const data = await chambreApi.getAvailableRooms(checkIn, checkOut, guests);
        console.log(`[SEARCH] Updating UI state with ${data.length} rooms.`);
        setRooms(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch available rooms. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [checkIn, checkOut, guests]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      {/* Search Header */}
      <div className="bg-primary text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold mb-2">Available Rooms</h1>
            <div className="flex items-center gap-4 text-sm text-blue-100">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {checkIn} to {checkOut}</span>
              <span>•</span>
              <span>{guests} Guest{guests > 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{nights} Night{nights > 1 ? 's' : ''}</span>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-xl font-medium text-accent">
              {!loading && !error && `${rooms.length} room${rooms.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {loading && <LoadingSpinner message="Searching for the perfect room..." />}
        
        {error && !loading && <ErrorMessage message={error} />}
        
        {!loading && !error && rooms.length === 0 && (
          <EmptyState 
            title="No Rooms Available" 
            message={`We couldn't find any available rooms for ${guests} guest(s) on the selected dates. Please try adjusting your search.`} 
          />
        )}

        {!loading && !error && rooms.length > 0 && (
          <div className="space-y-6">
            {rooms.map(room => (
              <RoomCard 
                key={room.idChambre} 
                room={room} 
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
                nights={nights}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
