import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function ReservationSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-xl shadow-lg text-center max-w-lg mx-auto border-t-4 border-accent">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4 font-serif">Reservation Confirmed!</h1>
          <p className="text-gray-600 mb-8 text-lg">
            Thank you for booking with Dar Diafa Rabat. We have successfully received your reservation and look forward to welcoming you.
          </p>
          <Link to="/" className="bg-primary hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-md transition-all shadow-md">
            Return to Homepage
          </Link>
        </div>
      </main>
    </div>
  );
}
