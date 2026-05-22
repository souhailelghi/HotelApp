import React, { useState } from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import { Menu } from 'lucide-react';

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen transition-all duration-300 overflow-x-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center px-4 sticky top-0 z-30 shadow-sm">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-600 hover:text-primary focus:outline-none p-1"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 text-xl font-bold font-serif text-primary">Admin Portal</span>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
