import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Lock, Save, Loader2, CheckCircle, Edit3, X, EyeOff, Eye, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { clientApi } from '../api/clientApi';

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  
  const [clientData, setClientData] = useState(null);
  const [loadingClient, setLoadingClient] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingPwd, setIsSubmittingPwd] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [pwdSuccessMessage, setPwdSuccessMessage] = useState('');
  
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (authLoading) return;
      
      if (!user) {
        setLoadingClient(false);
        return;
      }
      
      let finalClientId = localStorage.getItem('hotelClientId') || user?.hotelClientId;

      try {
        if (!finalClientId && user.email) {
          const allClients = await clientApi.getClients();
          const existingClient = allClients.find(c => c.email && c.email.toLowerCase() === user.email.toLowerCase());
          
          if (existingClient) {
            finalClientId = existingClient.idClient || existingClient.id;
            localStorage.setItem("hotelClientId", finalClientId);
          } else {
            const newClient = await clientApi.createClient({
              nom: user.lastName || "Guest",
              prenom: user.firstName || "User",
              email: user.email,
              motDePasse: "MyReservationsProfile123!", 
              telephone: user.phone || ""
            });
            finalClientId = newClient.idClient || newClient.id;
            if (finalClientId) localStorage.setItem("hotelClientId", finalClientId);
          }
        }

        if (!finalClientId) {
          setLoadingClient(false);
          return;
        }

        setClientId(finalClientId);

        const data = await clientApi.getClient(finalClientId);
        setClientData(data);
        setFormData({
          nom: data.nom || '',
          prenom: data.prenom || '',
          email: data.email || '',
          telephone: data.telephone || ''
        });
      } catch (err) {
        console.error("Failed to fetch client data", err);
      } finally {
        setLoadingClient(false);
      }
    };
    
    fetchClient();
  }, [authLoading, user]);

  if (authLoading || loadingClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <LoadingSpinner message="Loading profile information..." />
        </main>
      </div>
    );
  }

  if (!user || (!clientId && !loadingClient)) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.prenom) newErrors.prenom = 'First Name is required';
    if (!formData.nom) newErrors.nom = 'Last Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.telephone) newErrors.telephone = 'Phone is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
    if (passwordData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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

    try {
      const updatePayload = {
        idClient: clientId,
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        motDePasse: clientData.motDePasse // Preserve existing password
      };

      await clientApi.updateClient(clientId, updatePayload);
      
      setClientData(prev => ({ ...prev, ...updatePayload }));
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setErrors({ form: 'Failed to update profile' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;

    setIsSubmittingPwd(true);
    setErrors({});
    setPwdSuccessMessage('');

    try {
      const updatePayload = {
        idClient: clientId,
        nom: clientData.nom,
        prenom: clientData.prenom,
        email: clientData.email,
        telephone: clientData.telephone,
        motDePasse: passwordData.newPassword // New password
      };

      await clientApi.updateClient(clientId, updatePayload);
      
      setClientData(prev => ({ ...prev, motDePasse: passwordData.newPassword }));
      setPwdSuccessMessage('Password changed successfully!');
      setPasswordData({ newPassword: '', confirmPassword: '' });
      
      setTimeout(() => setPwdSuccessMessage(''), 4000);
    } catch (err) {
      setErrors({ pwdForm: 'Failed to update password' });
    } finally {
      setIsSubmittingPwd(false);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      nom: clientData?.nom || '',
      prenom: clientData?.prenom || '',
      email: clientData?.email || '',
      telephone: clientData?.telephone || ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      
      <div className="bg-primary pt-12 pb-32 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-serif font-bold mb-2">My Profile</h1>
          <p className="text-lg text-blue-100">Manage your personal information and account details.</p>
        </div>
      </div>

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 -mt-20 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8"
        >
          {/* Header Card Area */}
          <div className="p-8 md:p-10 border-b border-gray-100 flex flex-col md:flex-row items-center md:justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50 rounded-full opacity-50 blur-3xl"></div>
            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
              <div className="w-24 h-24 bg-blue-100 text-primary rounded-full flex items-center justify-center text-4xl font-bold font-serif shadow-inner border-4 border-white ring-4 ring-blue-50">
                {clientData?.prenom?.charAt(0).toUpperCase() || ''}{clientData?.nom?.charAt(0).toUpperCase() || ''}
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-900">{clientData?.prenom} {clientData?.nom}</h2>
                <p className="text-gray-500 flex items-center justify-center md:justify-start gap-2 mt-1">
                  <Mail className="w-4 h-4" /> {clientData?.email}
                </p>
              </div>
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all border border-gray-200 shadow-sm flex items-center gap-2 relative z-10 hover:shadow"
              >
                <Edit3 className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>

          <div className="p-8 md:p-10">
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

            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div>
                  <h3 className="text-lg font-serif font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">Personal Information</h3>
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-1">First Name (Prenom)</p>
                      <p className="font-medium text-gray-900 text-lg">{clientData?.prenom}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-1">Last Name (Nom)</p>
                      <p className="font-medium text-gray-900 text-lg">{clientData?.nom}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5">Account Details</h3>
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-1 flex items-center gap-1">Email Address</p>
                      <p className="font-medium text-gray-900 text-lg">{clientData?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-1 flex items-center gap-1">Phone Number</p>
                      <p className="font-medium text-gray-900 text-lg">{clientData?.telephone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-lg font-serif font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">Edit Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name (Prenom)</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text" 
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.prenom ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white`}
                      />
                    </div>
                    {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name (Nom)</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text" 
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.nom ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white`}
                      />
                    </div>
                    {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
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
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.telephone ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white`}
                      />
                    </div>
                    {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone}</p>}
                  </div>
                </div>

                <div className="pt-6 flex items-center justify-end gap-3 border-t border-gray-100">
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-white text-gray-600 rounded-xl font-bold hover:bg-gray-50 border border-gray-200 transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-blue-900 text-white font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    {isSubmitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</> : <><Save className="w-5 h-5" /> Save Changes</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>

        {/* Password Management Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <div className="p-8 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-primary">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-gray-900">Security Settings</h3>
                <p className="text-sm text-gray-500">Update your password to keep your account secure.</p>
              </div>
            </div>

            <AnimatePresence>
              {pwdSuccessMessage && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 flex items-center gap-3 overflow-hidden"
                >
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <p className="font-medium">{pwdSuccessMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {errors.pwdForm && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-sm font-medium">
                {errors.pwdForm}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full pl-10 pr-4 py-2.5 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors bg-gray-50 focus:bg-white`}
                      placeholder="••••••••"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmittingPwd}
                  className="bg-gray-900 hover:bg-black text-white font-bold py-2.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md w-full md:w-auto"
                >
                  {isSubmittingPwd ? <><Loader2 className="w-5 h-5 animate-spin" /> Updating...</> : <><Lock className="w-4 h-4" /> Update Password</>}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
