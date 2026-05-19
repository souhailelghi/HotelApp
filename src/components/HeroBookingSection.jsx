import { MapPin } from 'lucide-react';
import BookingSearchForm from './BookingSearchForm';

export default function HeroBookingSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex items-center">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-gray-900/40"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 py-12 md:py-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
          
          {/* Left Text Content */}
          <div className="w-full lg:w-[55%] text-center lg:text-left text-white mt-10 lg:mt-0 relative z-10">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-6">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wide">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Rabat, Morocco</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wide">
                <span className="text-accent">★</span>
                <span>Maison d’hôtes</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent/20 backdrop-blur-md border border-accent/40 text-sm font-medium tracking-wide text-yellow-50">
                <span>Best comfort</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold font-serif tracking-tight leading-tight mb-6 drop-shadow-2xl">
              Dar Diafa <br />
              <span className="text-accent font-italic">Rabat</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-100 max-w-2xl mx-auto lg:mx-0 mb-4 font-light drop-shadow-lg leading-relaxed">
              Vivez une expérience marocaine authentique au cœur de Rabat.
            </p>
            
            <p className="text-lg text-gray-300 max-w-xl mx-auto lg:mx-0 mb-10 font-light italic">
              "Confort, calme et hospitalité pour un séjour inoubliable."
            </p>
            
            {/* Decorative element */}
            <div className="hidden lg:flex items-center gap-4 mt-12 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 max-w-md">
              <img src="https://images.unsplash.com/photo-1542314831-c6a4d14d8c85?w=100&h=100&fit=crop" alt="Riad courtyard" className="w-16 h-16 rounded-xl object-cover shadow-md" />
              <div>
                <p className="font-serif font-bold text-lg text-white">Traditional Riad</p>
                <p className="text-sm text-gray-300">Modern comfort meets Moroccan heritage</p>
              </div>
            </div>
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
