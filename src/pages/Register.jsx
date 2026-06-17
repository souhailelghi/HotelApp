import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, Loader2, CheckCircle, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length > 5) strength++;
    if (pwd.length > 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength; // 0 to 5
  };

  const strength = calculatePasswordStrength(formData.password);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone) newErrors.phone = 'Phone Number is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    setErrors({});
    
    const res = await register(formData);
    setIsSubmitting(false);
    
    if (res.success) {
      setSuccess(true);
      
      // Auto login after successful registration
      await login(formData.email, formData.password);

      setTimeout(() => {
        const pendingBookingStr = localStorage.getItem('pendingBooking');
        if (pendingBookingStr) {
          const pendingBooking = JSON.parse(pendingBookingStr);
          localStorage.removeItem('pendingBooking');
          const { roomId, checkIn, checkOut, guests, nights, room } = pendingBooking;
          navigate(`/checkout/${roomId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&nights=${nights}`, { state: { room }, replace: true });
        } else {
          navigate('/login');
        }
      }, 3000);
    } else {
      setErrors({ form: res.message || 'Registration failed' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-4xl w-full flex flex-col md:flex-row"
        >
          {/* Left Side - Image/Branding */}
          <div className="w-full md:w-5/12 bg-primary relative hidden md:flex flex-col justify-between p-10 text-white overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
              <img 
                src="https://images.unsplash.com/photo-1542314831-c6a4d14d8373?q=80&w=2070&auto=format&fit=crop" 
                alt="Hotel Luxury" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-8">
                <Shield className="w-8 h-8 text-accent" />
                <span className="text-2xl font-bold font-serif text-accent">Dar Diafa</span>
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Experience True Luxury</h2>
              <p className="text-blue-100 opacity-90">Create an account to manage your bookings, save preferences, and enjoy exclusive member benefits.</p>
            </div>
            <div className="relative z-10">
              <p className="text-sm text-blue-200">Already a member?</p>
              <Link to="/login" className="inline-block mt-2 font-bold hover:text-accent transition-colors">Sign in to your account →</Link>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full md:w-7/12 p-8 md:p-12 relative">
            
            <AnimatePresence>
              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                  >
                    <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
                  </motion.div>
                  <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Registration Successful!</h2>
                  <p className="text-gray-600 mb-8 max-w-sm">Welcome to Dar Diafa. Your account has been created. Redirecting you...</p>
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </motion.div>
              )}
            </AnimatePresence>

            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500 mb-8 md:hidden">Already a member? <Link to="/login" className="text-primary font-bold">Sign in</Link></p>
            
            {errors.form && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-sm">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white`}
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white`}
                      placeholder="Doe"
                    />
                  </div>
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white`}
                    placeholder="+212 ..."
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-12 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white`}
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex gap-1 h-1.5 mb-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div 
                          key={level} 
                          className={`flex-1 rounded-full ${
                            level <= strength 
                              ? strength <= 2 ? 'bg-red-400' : strength <= 3 ? 'bg-yellow-400' : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 text-right">
                      {strength <= 2 ? 'Weak' : strength <= 3 ? 'Fair' : strength <= 4 ? 'Good' : 'Strong'}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-accent hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</> : 'Create Account'}
              </button>

            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
