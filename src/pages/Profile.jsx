import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, Save, Loader2, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Profile() {
  const { user, loading: authLoading, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <LoadingSpinner message="Checking authentication..." />
        </main>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First Name is required';
    if (!formData.lastName) newErrors.lastName = 'Last Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Required to change password';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});
    setSuccessMessage('');

    // If changing password, verify current password first (Simulated by checking localStorage directly)
    if (formData.newPassword) {
      const accounts = JSON.parse(localStorage.getItem('darDiafa_accounts') || '[]');
      const currentUser = accounts.find(acc => acc.id === user.id);
      if (currentUser && currentUser.password !== formData.currentPassword) {
        setErrors({ currentPassword: 'Incorrect current password' });
        setIsSubmitting(false);
        return;
      }
    }

    const updates = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
    };

    if (formData.newPassword) {
      updates.password = formData.newPassword;
    }

    const res = await updateProfile(updates);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessMessage('Profile updated successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setTimeout(() => setSuccessMessage(''), 4000);
    } else {
      setErrors({ form: res.message || 'Failed to update profile' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      
      {/* Header */}
      <div className="bg-primary py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold mb-2">My Profile</h1>
          <p className="text-lg text-blue-100">Manage your personal information and security settings.</p>
        </div>
      </div>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10"
        >
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div className="w-20 h-20 bg-blue-100 text-primary rounded-full flex items-center justify-center text-3xl font-bold font-serif">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h2>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          <AnimatePresence>
            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-center gap-3 overflow-hidden"
              >
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                <p className="font-medium">{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {errors.form && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-sm font-medium">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Personal Info Section */}
            <div>
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    />
                  </div>
                  {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
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
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">Change Password</h3>
              <p className="text-sm text-gray-500 mb-6">Leave fields empty if you don't want to change your password.</p>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative md:w-1/2">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type={showCurrentPassword ? "text" : "password"} 
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-12 py-2.5 rounded-lg border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white`}
                      placeholder="••••••••"
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-12 py-2.5 rounded-lg border ${errors.newPassword ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white`}
                        placeholder="••••••••"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type={showNewPassword ? "text" : "password"} 
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-primary hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg w-full md:w-auto"
              >
                {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Save Changes</>}
              </button>
            </div>
          </form>

        </motion.div>
      </main>
    </div>
  );
}
