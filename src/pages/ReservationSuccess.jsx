import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Download, Loader2 } from 'lucide-react';
import { generateInvoicePdf } from '../utils/generateInvoicePdf';
import { formatDH } from '../utils/priceUtils';

import { sendReservationSuccessEmail } from '../services/emailNotificationService';

export default function ReservationSuccess() {
  const location = useLocation();
  const { reservation } = location.state || {};
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleTestEmail = async () => {
    const fakeData = {
      clientName: "Test User",
      clientEmail: "test@example.com",
      clientPhone: "0600000000",
      roomName: "Test Suite",
      dateDebut: new Date().toISOString(),
      dateFin: new Date(Date.now() + 86400000 * 2).toISOString(),
      nights: 2,
      totalPrice: 1500,
      prixTotal: 1500
    };
    alert("Sending test email...");
    await sendReservationSuccessEmail(fakeData);
  };

  const handleDownloadInvoice = async () => {
    if (!reservation) return;
    try {
      setIsGeneratingPdf(true);
      await generateInvoicePdf({
        ...reservation,
        statut: 'Paid'
      });
    } catch (err) {
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4 py-12">
        <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 text-center max-w-xl mx-auto w-full">
          <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-serif">Reservation Confirmed!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for booking with Dar Diafa Rabat. We have successfully received your reservation.
          </p>

          {reservation && (
            <div className="bg-gray-50 rounded-xl p-6 text-left mb-8 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Booking Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Reservation ID:</span>
                  <span className="font-bold text-gray-900">#{reservation.idReservation?.slice(0,8) || reservation.id?.slice(0,8) || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Room:</span>
                  <span className="font-medium text-gray-900">{reservation.roomName || 'Selected Room'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Check-in:</span>
                  <span className="font-medium text-gray-900">{new Date(reservation.dateDebut).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Check-out:</span>
                  <span className="font-medium text-gray-900">{new Date(reservation.dateFin).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                  <span className="text-gray-700">Total Paid:</span>
                  <span className="text-green-600">{formatDH(reservation.totalPrice || reservation.prixTotal)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {reservation && (
              <button 
                onClick={handleDownloadInvoice}
                disabled={isGeneratingPdf}
                className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-lg transition-colors border border-gray-300 shadow-sm disabled:opacity-50"
              >
                {isGeneratingPdf ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                Download Invoice
              </button>
            )}
            <button 
              onClick={handleTestEmail}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md text-center"
            >
              Test Email
            </button>
            <Link to="/my-reservations" className="bg-primary hover:bg-blue-900 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md text-center">
              View My Reservations
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
