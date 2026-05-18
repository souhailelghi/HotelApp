import React from 'react';
import { User, Mail, Phone } from 'lucide-react';

export default function GuestInfoForm({ formData, handleChange }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center">
        <span className="bg-blue-100 p-2 rounded-lg mr-3">
          <User className="w-6 h-6 text-primary" />
        </span>
        Guest Information
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="prenom" className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input 
            type="text" 
            id="prenom" 
            name="prenom"
            required 
            value={formData.prenom} 
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" 
            placeholder="John"
          />
        </div>
        <div>
          <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <input 
            type="text" 
            id="nom" 
            name="nom"
            required 
            value={formData.nom} 
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" 
            placeholder="Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Mail className="w-4 h-4 mr-2 text-gray-400" /> Email Address *
          </label>
          <input 
            type="email" 
            id="email" 
            name="email"
            required 
            value={formData.email} 
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" 
            placeholder="john.doe@example.com"
          />
        </div>

        <div>
          <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
            <Phone className="w-4 h-4 mr-2 text-gray-400" /> Phone Number *
          </label>
          <input 
            type="tel" 
            id="telephone" 
            name="telephone"
            required 
            value={formData.telephone} 
            onChange={handleChange} 
            className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" 
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>
    </div>
  );
}
