import React from 'react';
import { CreditCard, Wallet, Building } from 'lucide-react';

export default function FakePaymentForm({ formData, handleChange }) {
  const isCreditCard = formData.paymentMethod === 'Credit Card';

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8">
      <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center">
        <span className="bg-blue-100 p-2 rounded-lg mr-3">
          <CreditCard className="w-6 h-6 text-primary" />
        </span>
        Payment Details
      </h2>

      {/* Payment Method Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${
          formData.paymentMethod === 'Credit Card' ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-blue-200'
        }`}>
          <input type="radio" name="paymentMethod" value="Credit Card" checked={formData.paymentMethod === 'Credit Card'} onChange={handleChange} className="hidden" />
          <CreditCard className={`w-8 h-8 mb-2 ${formData.paymentMethod === 'Credit Card' ? 'text-primary' : 'text-gray-400'}`} />
          <span className="font-semibold text-gray-900">Credit Card</span>
        </label>

        <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${
          formData.paymentMethod === 'Cash on Arrival' ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-blue-200'
        }`}>
          <input type="radio" name="paymentMethod" value="Cash on Arrival" checked={formData.paymentMethod === 'Cash on Arrival'} onChange={handleChange} className="hidden" />
          <Wallet className={`w-8 h-8 mb-2 ${formData.paymentMethod === 'Cash on Arrival' ? 'text-primary' : 'text-gray-400'}`} />
          <span className="font-semibold text-gray-900">Cash on Arrival</span>
        </label>

        <label className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${
          formData.paymentMethod === 'Bank Transfer' ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-blue-200'
        }`}>
          <input type="radio" name="paymentMethod" value="Bank Transfer" checked={formData.paymentMethod === 'Bank Transfer'} onChange={handleChange} className="hidden" />
          <Building className={`w-8 h-8 mb-2 ${formData.paymentMethod === 'Bank Transfer' ? 'text-primary' : 'text-gray-400'}`} />
          <span className="font-semibold text-gray-900">Bank Transfer</span>
        </label>
      </div>

      {/* Credit Card Form (Fake) */}
      {isCreditCard && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-2">Name on Card *</label>
            <input 
              type="text" 
              id="cardName" 
              name="cardName"
              required={isCreditCard}
              value={formData.cardName} 
              onChange={handleChange} 
              className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white" 
              placeholder="JOHN DOE"
            />
          </div>

          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
            <div className="relative">
              <input 
                type="text" 
                id="cardNumber" 
                name="cardNumber"
                required={isCreditCard}
                maxLength="19"
                value={formData.cardNumber} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-xl p-3 pl-10 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white tracking-widest font-mono" 
                placeholder="XXXX XXXX XXXX XXXX"
              />
              <CreditCard className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
              <input 
                type="text" 
                id="cardExpiry" 
                name="cardExpiry"
                required={isCreditCard}
                maxLength="5"
                value={formData.cardExpiry} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white font-mono" 
                placeholder="MM/YY"
              />
            </div>
            <div>
              <label htmlFor="cardCvv" className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
              <input 
                type="text" 
                id="cardCvv" 
                name="cardCvv"
                required={isCreditCard}
                maxLength="4"
                value={formData.cardCvv} 
                onChange={handleChange} 
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white font-mono" 
                placeholder="123"
              />
            </div>
          </div>
        </div>
      )}

      {!isCreditCard && (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-gray-600 text-sm">
          {formData.paymentMethod === 'Cash on Arrival' 
            ? 'You have chosen to pay upon arrival at the hotel. Please note that your room is held until 6:00 PM on the day of check-in.' 
            : 'Bank transfer instructions will be sent to your email after booking confirmation. Please complete the transfer within 24 hours to secure your room.'}
        </div>
      )}

    </div>
  );
}
