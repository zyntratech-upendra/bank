import { useState, useEffect } from 'react';
import { X, Save, MapPin } from 'lucide-react';

const LocationModal = ({ isOpen, onClose, location, onSave }) => {
  const [formData, setFormData] = useState({
    city: '',
    address: '',
    contact: '',
    services: []
  });
  const [newService, setNewService] = useState('');

  useEffect(() => {
    if (location) {
      setFormData(location);
    } else {
      setFormData({
        city: '',
        address: '',
        contact: '',
        services: []
      });
    }
    setNewService('');
  }, [location, isOpen]);

  if (!isOpen) return null;

  const handleAddService = () => {
    if (newService.trim()) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const handleRemoveService = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <MapPin size={20} className="text-blue-600" />
            <h2>{location ? 'Edit Location' : 'Add New Location'}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4 text-xs text-slate-700">
          
          <div>
            <label className="block font-bold mb-1.5">City / Branch Name *</label>
            <input 
              type="text"
              required
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              placeholder="e.g. Vijayawada"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block font-bold mb-1.5">Full Address *</label>
            <textarea 
              required
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="Enter full address"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-medium resize-none"
            />
          </div>

          <div>
            <label className="block font-bold mb-1.5">Contact Number *</label>
            <input 
              type="text"
              required
              value={formData.contact}
              onChange={(e) => setFormData({...formData, contact: e.target.value})}
              placeholder="e.g. +91 98480 12345"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all font-medium"
            />
          </div>

          <div>
            <label className="block font-bold mb-1.5">Services Provided</label>
            <div className="flex gap-2 mb-2">
              <input 
                type="text"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddService())}
                placeholder="e.g. Gold Loan"
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={handleAddService}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded-xl transition-colors"
              >
                Add
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.services.map((srv, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-semibold text-[11px]">
                  <span>{srv}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveService(idx)}
                    className="text-blue-400 hover:text-rose-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {formData.services.length === 0 && (
                <span className="text-slate-400 italic">No services added yet.</span>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-6 mt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <Save size={16} />
              <span>{location ? 'Save Changes' : 'Add Location'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default LocationModal;
