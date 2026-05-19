import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
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
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-md mx-auto relative z-20 border-t-8 border-accent">
      <h3 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Find Your Perfect Stay</h3>
      
      {message.text && (
        <div className={`p-3 mb-4 rounded-md text-sm ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSearch} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <DateInput
            id="checkIn"
            label="Check In"
            value={formData.checkIn}
            onChange={handleChange}
            icon={Calendar}
            min={new Date().toISOString().split('T')[0]}
            required
          />
          <DateInput
            id="checkOut"
            label="Check Out"
            value={formData.checkOut}
            onChange={handleChange}
            icon={Calendar}
            min={formData.checkIn || new Date().toISOString().split('T')[0]}
            required
          />
        </div>

        <SelectInput
          id="guests"
          label="Guests"
          value={formData.guests}
          onChange={handleChange}
          options={guestOptions}
          icon={Users}
          required
        />

        <button
          type="submit"
          className="w-full mt-6 bg-primary hover:bg-blue-900 text-white font-bold py-4 px-4 rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 tracking-wide text-lg"
        >
          Check Availability
        </button>
      </form>
    </div>
  );
}
