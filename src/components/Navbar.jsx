import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold font-serif tracking-wider text-accent">
              Dar Diafa
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-accent transition-colors">Home</Link>
            <Link to="/rooms" className="hover:text-accent transition-colors">Rooms</Link>
            <Link to="/contact" className="hover:text-accent transition-colors">Contact</Link>
            
            {user ? (
              <>
                <Link to="/my-reservations" className="hover:text-accent transition-colors">My Reservations</Link>
                <div className="h-6 w-px bg-white/20"></div>
                <Link to="/profile" className="flex items-center gap-2 hover:text-accent transition-colors">
                  <UserIcon className="w-4 h-4" />
                  Profile
                </Link>
                <button onClick={handleLogout} className="flex items-center gap-2 hover:text-red-400 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="h-6 w-px bg-white/20"></div>
                <Link to="/login" className="hover:text-accent transition-colors font-medium">Login</Link>
                <Link to="/register" className="bg-accent hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium transition-colors">Register</Link>
              </>
            )}
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
            <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium hover:text-accent hover:bg-white/5 transition-colors">Contact</Link>
            
            <div className="border-t border-white/10 my-2"></div>
            
            {user ? (
              <>
                <Link to="/my-reservations" className="block px-3 py-2 rounded-md text-base font-medium hover:text-accent hover:bg-white/5 transition-colors">My Reservations</Link>
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium hover:text-accent hover:bg-white/5 transition-colors">
                  <UserIcon className="w-5 h-5" /> Profile
                </Link>
                <button onClick={handleLogout} className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-300 hover:bg-white/5 transition-colors">
                  <LogOut className="w-5 h-5" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:text-accent hover:bg-white/5 transition-colors">Login</Link>
                <Link to="/register" className="block px-3 py-2 rounded-md text-base font-medium text-accent hover:bg-white/5 transition-colors">Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
