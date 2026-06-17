import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, LogIn, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    const res = await login(formData.email, formData.password);
    setIsSubmitting(false);
    
    if (res.success) {
      const pendingBookingStr = localStorage.getItem('pendingBooking');
      if (pendingBookingStr) {
        const pendingBooking = JSON.parse(pendingBookingStr);
        localStorage.removeItem('pendingBooking');
        const { roomId, checkIn, checkOut, guests, nights, room } = pendingBooking;
        navigate(`/checkout/${roomId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&nights=${nights}`, { state: { room }, replace: true });
      } else {
        const from = location.state?.from || '/';
        navigate(from, { replace: true });
      }
    } else {
      setErrors({ form: res.message || 'Login failed. Please check your credentials.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4 py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-4xl w-full flex flex-col md:flex-row-reverse"
        >
          {/* Right Side (Image/Branding for Login) */}
          <div className="w-full md:w-5/12 bg-primary relative hidden md:flex flex-col justify-between p-10 text-white overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" 
                alt="Hotel Luxury" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <Shield className="w-8 h-8 text-accent" />
                <span className="text-2xl font-bold font-serif text-accent">Dar Diafa</span>
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Welcome Back</h2>
              <p className="text-blue-100 opacity-90">Sign in to access your reservations, continue your booking, or update your profile.</p>
            </div>
            <div className="relative z-10">
              <p className="text-sm text-blue-200">Don't have an account?</p>
              <Link to="/register" className="inline-block mt-2 font-bold hover:text-accent transition-colors">Create an account →</Link>
            </div>
          </div>

          {/* Left Side - Form */}
          <div className="w-full md:w-7/12 p-8 md:p-12 relative">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Sign In</h2>
            <p className="text-gray-500 mb-8 md:hidden">Don't have an account? <Link to="/register" className="text-primary font-bold">Register</Link></p>
            
            {location.state?.message && (
              <div className="mb-6 bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-100 text-sm font-medium">
                {location.state.message}
              </div>
            )}

            {errors.form && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-sm font-medium">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-xs text-primary font-medium hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white`}
                    placeholder="••••••••"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-blue-900 text-white font-bold py-3.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-6 shadow-md hover:shadow-lg"
              >
                {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing In...</> : <><LogIn className="w-5 h-5" /> Sign In</>}
              </button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
