import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import DateInput from './DateInput';
import SelectInput from './SelectInput';

export default function BookingSearchForm() {
  const navigate = useNavigate();
  const [message, setMessage] = useState({ text: '', type: '' });
  
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '1'
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    // Validation
    if (!formData.checkIn || !formData.checkOut) {
      setMessage({ text: 'Please select both Check In and Check Out dates.', type: 'error' });
      return;
    }
    
    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      setMessage({ text: 'Check In date cannot be in the past.', type: 'error' });
      return;
    }

    if (checkOutDate <= checkInDate) {
      setMessage({ text: 'Check Out date must be after Check In date.', type: 'error' });
      return;
    }

    // Redirect to search results
    navigate(`/search?checkIn=${formData.checkIn}&checkOut=${formData.checkOut}&guests=${formData.guests}`);
  };

  const guestOptions = [
    { value: '1', label: '1 Guest' },
    { value: '2', label: '2 Guests' },
    { value: '3', label: '3 Guests' },
    { value: '4', label: '4 Guests' },
    { value: '5', label: '5 Guests' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 md:p-10 w-full max-w-md mx-auto relative z-20 border-t-[6px] border-accent"
    >
      <h3 className="text-3xl font-bold text-gray-900 mb-8 font-serif text-center">Find Your Perfect Stay</h3>
      
      {message.text && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`p-3 mb-4 rounded-md text-sm ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
        >
          {message.text}
        </motion.div>
      )}

      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="w-full">
            <DateInput
              id="checkIn"
              label="Check In"
              value={formData.checkIn}
              onChange={handleChange}
              icon={Calendar}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="w-full">
            <DateInput
              id="checkOut"
              label="Check Out"
              value={formData.checkOut}
              onChange={handleChange}
              icon={Calendar}
              min={formData.checkIn || new Date().toISOString().split('T')[0]}
              required
            />
          </motion.div>
        </div>

        <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
          <SelectInput
            id="guests"
            label="Guests"
            value={formData.guests}
            onChange={handleChange}
            options={guestOptions}
            icon={Users}
            required
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full mt-8 bg-[#0B2046] hover:bg-[#112d5e] text-white font-bold py-4 px-4 rounded-xl transition-colors flex items-center justify-center shadow-lg text-lg tracking-wide"
        >
          Check Availability
        </motion.button>
      </form>
    </motion.div>
  );
}
