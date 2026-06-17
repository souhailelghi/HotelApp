import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Bed, Database, Bell, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminSidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin', { replace: true });
  };

  const links = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Room Management', path: '/admin/rooms', icon: Bed },
    { name: 'Data', path: '/admin/data', icon: Database },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
  ];

  const sidebarClasses = `fixed inset-y-0 left-0 z-50 w-64 bg-[#0B2046] text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={sidebarClasses}>
        <div className="flex items-center justify-between h-16 px-6 bg-[#0B2046] border-b border-white/10">
          <span className="text-2xl font-bold font-serif text-accent tracking-wider">Dar Diafa</span>
          <button className="md:hidden text-white hover:text-accent focus:outline-none" onClick={() => setIsOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-accent/20 text-accent border border-accent/20 font-medium shadow-sm' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-accent' : 'text-gray-400'}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}

          <div className="pt-8 mt-8 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center w-full space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
