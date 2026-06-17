import React, { useState } from 'react';
import { useParams, useSearchParams, useLocation, useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ErrorMessage from '../components/ErrorMessage';
import { clientApi } from '../api/clientApi';
import { reservationApi } from '../api/reservationApi';
import GuestInfoForm from '../components/checkout/GuestInfoForm';
import FakePaymentForm from '../components/checkout/FakePaymentForm';
import BookingSummary from '../components/checkout/BookingSummary';
import { Loader2 } from 'lucide-react';

export default function Checkout() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests');
  const nights = searchParams.get('nights');
  
  const room = location.state?.room;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    nom: user?.lastName || '',
    prenom: user?.firstName || '',
    email: user?.email || '',
    telephone: user?.phone || '',
    paymentMethod: 'Credit Card',
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Ensure client exists in backend
      const clientData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        motDePasse: "default123"
      };
      
      const newClient = await clientApi.createClient(clientData);
      
      if (!newClient || !newClient.idClient) {
        throw new Error("Failed to create client in backend or missing idClient.");
      }

      // 2. Create Reservation
      // We format the date exactly as YYYY-MM-DDT00:00:00 to avoid UTC timezone shifts on the backend
      const formattedDateDebut = `${checkIn}T00:00:00`;
      const formattedDateFin = `${checkOut}T00:00:00`;
      
      const reservationData = {
        dateDebut: formattedDateDebut,
        dateFin: formattedDateFin,
        idClient: newClient.idClient,
        idChambre: roomId
      };

      console.log("Reservation payload:", reservationData);
      const resResult = await reservationApi.createReservation(reservationData);
      console.log("[CHECKOUT] Reservation successful:", resResult);

      // (Optional) 3. Create fake payment API call if endpoint exists
      // We bypass this for now to prevent 404 since /api/Paiements was not explicitly built in previous steps.

      // 4. Navigate to success. When the user navigates back, the cache-buster in chambreApi ensures a fresh room list.
      navigate('/reservation-success', { replace: true });

    } catch (err) {
      console.error(err.response?.data || err);
      setError("Failed to complete reservation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <ErrorMessage message="Room details not found. Please start your search again." />
            <Link to="/" className="mt-4 inline-block bg-primary text-white py-2 px-4 rounded-md">Return Home</Link>
          </div>
        </main>
      </div>
    );
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search, message: "Please login or create an account before making a reservation." }} replace />;
  }

  const totalPrice = room.pricePerNight * parseInt(nights, 10);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-primary text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif font-bold mb-2">Secure Checkout</h1>
          <p className="text-blue-200">Complete your details to finalize your booking.</p>
        </div>
      </div>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Forms */}
          <div className="w-full lg:w-2/3">
            {error && <div className="mb-6"><ErrorMessage message={error} /></div>}

            <GuestInfoForm formData={formData} handleChange={handleChange} />
            
            <FakePaymentForm formData={formData} handleChange={handleChange} />

            <div className="mt-8 flex justify-end">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto min-w-[250px] bg-accent hover:bg-yellow-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-lg"
              >
                {loading ? (
                  <><Loader2 className="w-6 h-6 mr-3 animate-spin" /> Processing...</>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center md:text-right mt-4">
              By clicking "Confirm Booking", you agree to our Terms & Conditions and Privacy Policy.
            </p>
          </div>

          {/* Right Column: Summary */}
          <div className="w-full lg:w-1/3">
            <BookingSummary 
              room={room} 
              checkIn={checkIn} 
              checkOut={checkOut} 
              guests={guests} 
              nights={nights} 
              totalPrice={totalPrice} 
            />
          </div>

        </form>
      </main>
    </div>
  );
}
