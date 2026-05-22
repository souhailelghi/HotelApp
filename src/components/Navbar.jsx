import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-primary text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold font-serif tracking-wider text-accent">
              Dar Diafa
            </Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <Link to="/rooms" className="hover:text-accent transition-colors">Rooms</Link>
            <Link to="/" className="hover:text-accent transition-colors">Contact</Link>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-accent focus:outline-none">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute w-full bg-primary/95 backdrop-blur-sm border-t border-white/10 shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:text-accent hover:bg-white/5 transition-colors">Home</Link>
            <Link to="/rooms" className="block px-3 py-2 rounded-md text-base font-medium hover:text-accent hover:bg-white/5 transition-colors">Rooms</Link>
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium hover:text-accent hover:bg-white/5 transition-colors">Contact</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
