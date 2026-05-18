import { MapPin } from 'lucide-react';
import BookingSearchForm from './BookingSearchForm';

export default function HeroBookingSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px]"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left text-white mt-10 lg:mt-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md mb-6 border border-white/30 text-sm font-medium">
              <MapPin className="w-4 h-4 text-accent" />
              <span>Rabat, Morocco</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-serif tracking-tight leading-tight mb-6 drop-shadow-lg">
              Dar Diafa <br />
              <span className="text-accent">Rabat</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto lg:mx-0 mb-8 font-light drop-shadow-md">
              Réservez votre séjour dans une maison d’hôtes élégante au cœur de Rabat. Profitez d'un confort exceptionnel et d'une hospitalité authentique.
            </p>
            
            <button className="bg-accent hover:bg-yellow-600 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
              Découvrir
            </button>
          </div>

          {/* Right Booking Card */}
          <div className="w-full lg:w-5/12 max-w-lg mx-auto lg:mx-0">
            <BookingSearchForm />
          </div>

        </div>
      </div>
    </section>
  );
}
