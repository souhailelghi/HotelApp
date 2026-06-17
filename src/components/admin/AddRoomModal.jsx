import React, { useState } from 'react';
import { X, Save, AlertCircle, Loader2 } from 'lucide-react';
import { chambreApi } from '../../api/chambreApi';
import { uploadApi } from '../../api/uploadApi';

export default function AddRoomModal({ isOpen, onClose, onRoomAdded, initialData = null }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImageFiles, setSelectedImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const defaultState = {
    name: '',
    description: '',
    imageUrl: '',
    imageUrls: '',
    totalImages: 1,
    freeBreakfast: false,
    freeParking: false,
    freeWifi: false,
    airportTransferAvailable: false,
    loyaltyProgramAvailable: false,
    capacity: 1,
    singleBeds: 0,
    kingBeds: 0,
    currentPrice: '',
    oldPrice: '',
    pricePerNight: '',
    nights: 1,
    taxesIncluded: true,
    freeCancellationAvailable: false,
    details: '',
    statut: 'Available',
    idAdmin: '3fa85f64-5717-4562-b3fc-2c963f66afa6'
  };

  const [formData, setFormData] = useState(defaultState);

  // Initialize form when modal opens or initialData changes
  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
        if (initialData.imageUrls) {
          setImagePreviews(initialData.imageUrls.split(';').filter(Boolean));
        } else if (initialData.imageUrl) {
          setImagePreviews([initialData.imageUrl]);
        } else {
          setImagePreviews([]);
        }
      } else {
        setFormData(defaultState);
        setImagePreviews([]);
      }
      setSelectedImageFiles([]);
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(f => !validTypes.includes(f.type));
    
    if (invalidFiles.length > 0) {
      setError('Please upload valid images only (JPG, PNG, or WebP).');
      return;
    }

    setSelectedImageFiles(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
    setError(''); // Clear error if valid
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.description) {
      setError('Name and Description are required.');
      return;
    }
    if (!initialData && selectedImageFiles.length === 0) {
      setError('At least one room image is required.');
      return;
    }
    if (initialData && selectedImageFiles.length === 0 && !formData.imageUrl) {
      setError('At least one room image is required.');
      return;
    }
    if (formData.capacity < 1 || formData.capacity > 5) {
      setError('Capacity must be between 1 and 5.');
      return;
    }
    if (Number(formData.pricePerNight) <= 0 || Number(formData.currentPrice) <= 0) {
      setError('Prices must be greater than 0.');
      return;
    }

    setLoading(true);
    try {
      let finalImageUrl = formData.imageUrl;
      let finalImageUrls = formData.imageUrls || '';
      let finalTotalImages = Number(formData.totalImages) || 1;
      
      if (selectedImageFiles.length > 0) {
        const uploadedUrls = await uploadApi.uploadRoomImages(selectedImageFiles);
        if (uploadedUrls && uploadedUrls.length > 0) {
          finalImageUrl = uploadedUrls[0];
          finalImageUrls = uploadedUrls.join(';');
          finalTotalImages = uploadedUrls.length;
        }
      }

      // Parse numbers
      const payload = {
        ...formData,
        imageUrl: finalImageUrl,
        imageUrls: finalImageUrls,
        totalImages: finalTotalImages,
        capacity: Number(formData.capacity),
        singleBeds: Number(formData.singleBeds),
        kingBeds: Number(formData.kingBeds),
        currentPrice: Number(formData.currentPrice),
        oldPrice: Number(formData.oldPrice) || 0,
        pricePerNight: Number(formData.pricePerNight),
        nights: Number(formData.nights)
      };

      if (initialData && initialData.idChambre) {
        await chambreApi.updateChambre(initialData.idChambre, payload);
      } else {
        await chambreApi.createChambre(payload);
      }
      
      onRoomAdded(initialData ? 'Room successfully updated!' : 'Room successfully added!');
      onClose();
    } catch (err) {
      console.error(err);
      setError('Failed to save room. Please try again or check backend logs.');
    } finally {
      setLoading(false);
    }
  };

  const Checkbox = ({ label, name }) => (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        name={name}
        checked={formData[name]}
        onChange={handleChange}
        className="w-4 h-4 text-primary rounded focus:ring-accent"
      />
      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-2xl font-bold font-serif text-gray-900">
            {initialData ? 'Edit Room' : 'Add New Room'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="p-6 overflow-y-auto flex-grow">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start text-red-700">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form id="addRoomForm" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Room Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-accent outline-none transition-all" placeholder="e.g. Single Comfort Room 101" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea name="description" required value={formData.description} onChange={handleChange} rows="3" className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-accent outline-none transition-all"></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Details (Extra info)</label>
                  <input type="text" name="details" value={formData.details} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-accent outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Media & Status */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Media & Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select name="statut" value={formData.statut} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-accent outline-none transition-all bg-white">
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
                
                <div className="md:col-span-3 mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Images *</label>
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <div className="flex-1">
                        <input 
                          type="file" 
                          multiple
                          accept=".jpg,.jpeg,.png,.webp"
                          onChange={handleImageChange}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 transition-all cursor-pointer border border-gray-300 rounded-md p-1 bg-white"
                        />
                        <p className="mt-1 text-xs text-gray-500">Select multiple JPG, PNG, or WebP images.</p>
                      </div>
                      {imagePreviews.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImageFiles([]);
                            setImagePreviews([]);
                            setFormData(prev => ({ ...prev, imageUrl: '', imageUrls: '', totalImages: 0 }));
                          }}
                          className="px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium border border-red-200 whitespace-nowrap self-start sm:self-auto"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    {/* Image Previews Grid */}
                    {imagePreviews.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative aspect-video rounded-md overflow-hidden border border-gray-300 shadow-sm">
                            <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                            {index === 0 && (
                              <span className="absolute bottom-0 left-0 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tr-md">
                                MAIN
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-24 rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
                        <span className="text-sm font-medium">No images selected</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Capacity & Beds */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Capacity & Beds</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity (1-5) *</label>
                  <input type="number" name="capacity" min="1" max="5" required value={formData.capacity} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-accent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Single Beds</label>
                  <input type="number" name="singleBeds" min="0" value={formData.singleBeds} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-accent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">King Beds</label>
                  <input type="number" name="kingBeds" min="0" value={formData.kingBeds} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-accent outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Price *</label>
                  <input type="number" name="currentPrice" min="1" required value={formData.currentPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-accent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Old Price</label>
                  <input type="number" name="oldPrice" min="0" value={formData.oldPrice} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-accent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Night *</label>
                  <input type="number" name="pricePerNight" min="1" required value={formData.pricePerNight} onChange={handleChange} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-accent outline-none transition-all" />
                </div>
              </div>
            </div>

            {/* Amenities & Features */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Amenities & Policies</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <Checkbox name="freeBreakfast" label="Free Breakfast" />
                <Checkbox name="freeParking" label="Free Parking" />
                <Checkbox name="freeWifi" label="Free WiFi" />
                <Checkbox name="airportTransferAvailable" label="Airport Transfer" />
                <Checkbox name="loyaltyProgramAvailable" label="Loyalty Program" />
                <Checkbox name="taxesIncluded" label="Taxes Included" />
                <Checkbox name="freeCancellationAvailable" label="Free Cancellation" />
              </div>
            </div>

          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="addRoomForm"
            disabled={loading}
            className="px-5 py-2.5 bg-accent hover:bg-yellow-600 text-white rounded-lg font-bold transition-colors flex items-center shadow-md disabled:opacity-70"
          >
            {loading ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-5 h-5 mr-2" /> Save Room</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
