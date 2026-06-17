import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Hash, AlertTriangle, CheckCircle, XCircle, Download, Loader2, Moon, BedDouble, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import { reservationApi } from '../api/reservationApi';
import { chambreApi } from '../api/chambreApi';
import { clientApi } from '../api/clientApi';
import { useAuth } from '../context/AuthContext';
import { generateInvoicePdf } from '../utils/generateInvoicePdf';

export default function MyReservations() {
  const { user, loading: authLoading } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [generatingPdfId, setGeneratingPdfId] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'history'
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      console.log("Current user:", user);
      
      const hotelClientId = localStorage.getItem("hotelClientId");
      let finalClientId = hotelClientId;
      console.log("XXXXXXXXXXXXXX", finalClientId);
       console.log("hotelClientId from localStorage:", hotelClientId);
    console.log("User Email:", user?.email);
    console.log("User Id:", user?.id);
    console.log("User Object:", JSON.stringify(user, null, 2));
      console.log("XXXXXXXXXXFFFFFFFFFFFF:",hotelClientId);
      
      if (!finalClientId) {
        if (!user || !user.email || user.email === "undefined") {
          console.warn("No hotelClientId and no email available to create one. Cannot resolve profile.");
          setError("Session missing necessary details. Please try logging out and back in.");
          setLoading(false);
          return;
        }
        
        console.warn("No hotelClientId found. Fetching or creating HotelApp Client profile...");
        
        try {
          // Find existing client by email first
          const allClients = await clientApi.getClients();
          const existingClient = allClients.find(c => c.email && user.email && c.email.toLowerCase() === user.email.toLowerCase());

          if (existingClient) {
            finalClientId = existingClient.idClient || existingClient.id;
          } else {
            // Create the client in HotelApp-Api
            const newClient = await clientApi.createClient({
              nom: user.lastName || "Guest",
              prenom: user.firstName || "User",
              email: user.email,
              motDePasse: "MyReservationsProfile123!", 
              telephone: user.phone || ""
            });
            finalClientId = newClient.idClient || newClient.id;
             console.log("idclientXXXXXXXXXXFFFFFFFFFFFF:",newClient.idClient );
          }

          if (finalClientId) {
            localStorage.setItem("hotelClientId", finalClientId);
          } else {
            setReservations([]);
            setLoading(false);
            return;
          }
        } catch (profileError) {
          console.error("Failed loading client profile:", profileError);
          setError("Failed to resolve client profile.");
          setLoading(false);
          return;
        }
      }
      
      console.log("hotelClientId used:heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeere", finalClientId);
      console.log("Calling:", `/Reservations/client/${finalClientId}`);
      
      const [resData, roomsData] = await Promise.all([
        reservationApi.getClientReservations(finalClientId),
        chambreApi.getChambres().catch(() => []) // Fallback if chambres fail
      ]);
      
      console.log("Reservations returned:", resData);
      
      // Data is already mapped to the client, no need to filter by GUID
      const myData = Array.isArray(resData) ? resData : [];
      
      setRooms(roomsData);
      setReservations(myData);
    } catch (err) {
      console.error("Failed loading reservations:", err);
      setError("Failed to load your reservations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchData();
    }
  }, [authLoading, user]);

  const handleCancel = async (reservation) => {
    const resId = reservation.idReservation || reservation.id;
    if (!resId) return;

    if (!window.confirm("Are you sure you want to cancel this reservation?")) {
      return;
    }

    setCancellingId(resId);
    try {
      console.log("Cancelling reservation:", resId);
      
      const response = await reservationApi.cancelReservation(resId);
      
      console.log("Cancel response:", response.data || response);

      // Refresh list
      await fetchData();
      
      alert("Reservation cancelled successfully.");
    } catch (err) {
      console.error("Cancellation error:", err);
      alert("Unable to cancel reservation. Please try again.");
    } finally {
      setCancellingId(null);
    }
  };

  const handleDownloadInvoice = async (res, roomDetails) => {
    const resId = res.idReservation || res.id;
    if (!resId) return;
    
    try {
      setGeneratingPdfId(resId);
      await generateInvoicePdf({
        ...res,
        clientName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || res.clientName,
        clientEmail: user.email || res.clientEmail,
        clientPhone: user.phone || res.clientPhone,
        roomName: roomDetails?.name || res.roomName,
        roomCapacity: roomDetails?.capacity || res.roomCapacity,
        roomPrice: roomDetails?.pricePerNight || res.roomPrice,
        statut: 'Paid'
      });
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF invoice.");
    } finally {
      setGeneratingPdfId(null);
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
    return <Navigate to="/login" replace state={{ message: "Please login to view your reservations." }} />;
  }

  // --- Categorize & Sort Logic ---
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = [];
  const history = [];

  reservations.forEach(res => {
    const checkOut = new Date(res.dateFin);
    checkOut.setHours(0, 0, 0, 0);
    const statut = (res.statut || '').toLowerCase();
    
    if (checkOut >= today && statut !== 'cancelled' && statut !== 'annulé') {
      upcoming.push(res);
    } else {
      history.push(res);
    }
  });

  // Sort upcoming chronologically (closest first)
  upcoming.sort((a, b) => new Date(a.dateDebut) - new Date(b.dateDebut));
  // Sort history newest first
  history.sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut));

  const displayList = activeTab === 'upcoming' ? upcoming : history;

  // Added logs for testing counts
  useEffect(() => {
    if (!loading && reservations.length > 0) {
      console.log("upcoming reservations count:", upcoming.length);
      console.log("history reservations count:", history.length);
    }
  }, [loading, upcoming.length, history.length, reservations.length]);

  const renderReservationCard = (res, index) => {
    const resId = res.idReservation || res.id || `temp-${index}`;
    const checkInDate = new Date(res.dateDebut);
    const checkOutDate = new Date(res.dateFin);
    const bookingDate = res.createdAt || res.dateReservation;
    
    // Identify the associated room from the rooms fetch to get its image
    const roomDetails = rooms.find(r => r.idChambre === res.idChambre || r.id === res.idChambre);
    
    // Cancellation Rule: BEFORE check-in date
    const checkInDay = new Date(checkInDate);
    checkInDay.setHours(0, 0, 0, 0);
    const isExpired = today >= checkInDay;
    
    const statut = (res.statut || '').toLowerCase();
    const isCancelled = statut === 'cancelled' || statut === 'annulé';
    
    // Safely slice GUID
    const shortId = resId.length > 8 ? resId.slice(0, 8) : resId;

    return (
      <motion.div 
        key={resId}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
      >
        <div className="flex flex-col md:flex-row">
          {/* Room Image */}
          <div className="md:w-64 h-48 md:h-auto bg-gray-200 relative flex-shrink-0">
            {res.roomImageUrl || roomDetails?.imageUrl ? (
              <img src={res.roomImageUrl || roomDetails?.imageUrl} alt={res.roomName || roomDetails?.name || "Room"} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                <BedDouble className="w-12 h-12 opacity-50" />
              </div>
            )}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide backdrop-blur-md shadow-sm ${
                isCancelled ? 'bg-red-500/90 text-white' : 'bg-green-500/90 text-white'
              }`}>
                {isCancelled ? 'Cancelled' : (res.statut || 'Confirmed')}
              </span>
            </div>
          </div>

          {/* Details & Actions */}
          <div className="flex-grow p-6 flex flex-col justify-between">
            <div className="flex flex-col lg:flex-row justify-between gap-6 mb-6 border-b border-gray-100 pb-6">
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><Hash className="w-3 h-3"/> {shortId}</span>
                    {bookingDate && (
                      <span className="text-xs text-gray-400 ml-2">• Booked {new Date(bookingDate).toLocaleDateString()}</span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold font-serif text-gray-900">
                    {res.roomName || roomDetails?.name || `Room #${res.idChambre || 'Unknown'}`}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{checkInDate.toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">Check-in</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 hidden sm:block" />
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{checkOutDate.toLocaleDateString()}</p>
                      <p className="text-xs text-gray-500">Check-out</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
                      <Moon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{res.nights || 1} Nights</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Block */}
              <div className="lg:text-right bg-gray-50 p-4 rounded-xl lg:bg-transparent lg:p-0 flex flex-row lg:flex-col justify-between items-center lg:items-end">
                <div className="text-sm text-gray-500 mb-1">Total Amount</div>
                <div className="text-2xl font-bold text-gray-900">
                  ${res.roomPrice ? (res.roomPrice * (res.nights || 1)) : (res.prixTotal || res.totalPrice || 0)}
                </div>
                {!isCancelled && (
                  <div className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-0.5 rounded mt-1 inline-flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Paid
                  </div>
                )}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex-grow w-full sm:w-auto">
                {activeTab === 'upcoming' && (
                  <div className="flex flex-col items-start w-full">
                    <button
                      onClick={() => handleCancel(res)}
                      disabled={isCancelled || isExpired || cancellingId === resId}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all w-full sm:w-auto ${
                        isExpired 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300'
                      }`}
                    >
                      {cancellingId === resId ? 'Cancelling...' : 'Cancel Reservation'}
                    </button>
                    {isExpired && (
                      <div className="text-xs text-orange-500 mt-2 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Cancellation period has expired.
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {!isCancelled && (
                <button
                  onClick={() => handleDownloadInvoice(res, roomDetails)}
                  disabled={generatingPdfId === resId}
                  className="px-4 py-2 rounded-lg text-sm font-bold transition-all w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-white hover:bg-blue-900 disabled:opacity-50"
                >
                  {generatingPdfId === resId ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Download Invoice
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-primary pt-12 pb-24 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold mb-4">My Reservations</h1>
          <p className="text-lg text-blue-100">
            View your upcoming stays, download invoices, and manage your history.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-12 pb-12">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-2 mb-8 flex flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-3 px-4 text-center font-bold text-sm rounded-lg transition-colors ${
              activeTab === 'upcoming' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Upcoming Reservations ({upcoming.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-4 text-center font-bold text-sm rounded-lg transition-colors ${
              activeTab === 'history' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Reservation History ({history.length})
          </button>
        </div>

        {loading && <LoadingSpinner message="Loading your reservations..." />}
        {error && !loading && <ErrorMessage message={error} />}
        
        {!loading && !error && displayList.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyState 
              title={activeTab === 'upcoming' ? "No Upcoming Reservations" : "No Past Reservations"} 
              message={activeTab === 'upcoming' 
                ? "You don't have any upcoming stays booked with us. Ready for your next trip?"
                : "Your past stay history will appear here."}
            />
          </motion.div>
        )}

        {!loading && !error && displayList.length > 0 && (
          <div className="space-y-6">
            <AnimatePresence mode="popLayout">
              {displayList.map((res, index) => renderReservationCard(res, index))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
