import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, X, Loader2, User, Mail, Phone, Lock, Eye, AlertCircle, Users, Activity, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { clientApi } from '../../api/clientApi';

export default function AdminData() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit' | 'view'
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    idClient: '',
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    motDePasse: ''
  });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await clientApi.getClients();
      setClients(data || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load clients. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter(c => {
    const term = searchTerm.toLowerCase();
    const fullName = `${c.prenom} ${c.nom}`.toLowerCase();
    const id = (c.idClient || c.id || '').toLowerCase();
    return fullName.includes(term) || 
           (c.email && c.email.toLowerCase().includes(term)) || 
           (c.telephone && c.telephone.includes(term)) ||
           id.includes(term);
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);
  const paginatedClients = filteredClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleOpenModal = (mode, client = null) => {
    setModalMode(mode);
    if (client) {
      setFormData({
        idClient: client.idClient || client.id,
        prenom: client.prenom || '',
        nom: client.nom || '',
        email: client.email || '',
        telephone: client.telephone || '',
        motDePasse: client.motDePasse || ''
      });
    } else {
      setFormData({
        idClient: '',
        prenom: '',
        nom: '',
        email: '',
        telephone: '',
        motDePasse: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ idClient: '', prenom: '', nom: '', email: '', telephone: '', motDePasse: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (modalMode === 'add') {
        await clientApi.createClient({
          prenom: formData.prenom,
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          motDePasse: formData.motDePasse
        });
      } else if (modalMode === 'edit') {
        await clientApi.updateClient(formData.idClient, {
          idClient: formData.idClient,
          prenom: formData.prenom,
          nom: formData.nom,
          email: formData.email,
          telephone: formData.telephone,
          motDePasse: formData.motDePasse
        });
      }
      await fetchClients();
      closeModal();
    } catch (err) {
      console.error(err);
      alert('Operation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      try {
        await clientApi.deleteClient(id);
        await fetchClients();
      } catch (err) {
        console.error(err);
        alert('Failed to delete client.');
      }
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-gray-900">Client Management</h1>
          <p className="text-gray-500 mt-1">View, edit, and manage all registered customers.</p>
        </div>
        <button
          onClick={() => handleOpenModal('add')}
          className="bg-primary hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold transition-colors shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" /> Add New Client
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-primary">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Clients</p>
            <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-green-600">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Active Clients</p>
            <p className="text-3xl font-bold text-gray-900">{clients.length}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">New This Month</p>
            <p className="text-3xl font-bold text-gray-900">{Math.min(clients.length, 12)}</p>
          </div>
        </motion.div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or client ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
              <p className="font-medium text-lg">Loading client data...</p>
            </div>
          ) : error ? (
            <div className="p-20 flex flex-col items-center justify-center text-red-500">
              <AlertCircle className="w-12 h-12 mb-4 opacity-50" />
              <p className="font-medium">{error}</p>
              <button onClick={fetchClients} className="mt-4 text-primary font-bold underline">Try Again</button>
            </div>
          ) : paginatedClients.length === 0 ? (
            <div className="p-24 flex flex-col items-center justify-center text-gray-500">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-gray-300" />
              </div>
              <p className="text-xl font-bold text-gray-900">No clients found</p>
              <p className="text-md mt-2 text-gray-500">Try adjusting your search terms or add a new client.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-bold">
                  <th className="px-6 py-4">Client ID</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4 text-center">Reservations</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginatedClients.map((client) => {
                  const id = client.idClient || client.id;
                  const shortId = id && id.length > 8 ? id.slice(0, 8) : id;
                  const resCount = client.reservations ? client.reservations.length : 0;
                  
                  return (
                    <tr key={id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4 text-sm font-mono text-gray-500">{shortId}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-primary flex items-center justify-center text-sm font-bold font-serif shadow-inner border border-white">
                            {client.prenom?.charAt(0).toUpperCase()}{client.nom?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">{client.prenom} {client.nom}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">{client.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{client.telephone || '—'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                          {resCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                        <button 
                          onClick={() => handleOpenModal('view', client)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all inline-flex"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenModal('edit', client)}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all inline-flex"
                          title="Edit Client"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all inline-flex"
                          title="Delete Client"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && filteredClients.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between text-sm text-gray-600">
            <div>
              Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredClients.length)}</span> of <span className="font-bold text-gray-900">{filteredClients.length}</span> clients
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="px-4 font-medium text-gray-900">Page {currentPage} of {totalPages}</div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-6 lg:p-8 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-2xl font-serif font-bold text-gray-900">
                  {modalMode === 'add' ? 'Add New Client' : modalMode === 'edit' ? 'Edit Client' : 'Client Profile'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-800 p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 lg:p-8 overflow-y-auto">
                <form id="clientForm" onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">First Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="prenom"
                          required
                          disabled={modalMode === 'view'}
                          value={formData.prenom}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50 transition-all font-medium text-gray-900"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="nom"
                          required
                          disabled={modalMode === 'view'}
                          value={formData.nom}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50 transition-all font-medium text-gray-900"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        required
                        disabled={modalMode === 'view'}
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50 transition-all font-medium text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="telephone"
                        disabled={modalMode === 'view'}
                        value={formData.telephone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50 transition-all font-medium text-gray-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={modalMode === 'view' ? "password" : "text"}
                        name="motDePasse"
                        required={modalMode === 'add'}
                        disabled={modalMode === 'view'}
                        value={formData.motDePasse}
                        onChange={handleChange}
                        placeholder={modalMode === 'edit' ? "Leave empty to keep unchanged" : ""}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary outline-none disabled:bg-gray-50 transition-all font-medium text-gray-900"
                      />
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 lg:p-8 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-3xl">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 text-gray-700 font-bold bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                >
                  {modalMode === 'view' ? 'Close Window' : 'Cancel'}
                </button>
                {modalMode !== 'view' && (
                  <button
                    type="submit"
                    form="clientForm"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-primary font-bold text-white rounded-xl hover:bg-blue-900 transition-colors flex items-center gap-2 shadow-md hover:shadow-lg"
                  >
                    {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                    {modalMode === 'add' ? 'Create Client' : 'Save Changes'}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
