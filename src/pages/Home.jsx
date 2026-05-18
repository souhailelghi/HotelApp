import Navbar from '../components/Navbar';
import HeroBookingSection from '../components/HeroBookingSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroBookingSection />
      </main>
    </div>
  );
}
