import { useState } from 'react';
import { X, Building, MapPin, Coins, Percent } from 'lucide-react';
import api from '../../utils/api';

const BankRateModal = ({ onClose, onSaved, rate = null, locationsList = [] }) => {
  const [formData, setFormData] = useState(rate ? {
    cityName: rate.cityName,
    bankName: rate.bankName,
    branchName: rate.branchName,
    goldRatePerGram: rate.goldRatePerGram,
    interestRate: rate.interestRate
  } : {
    cityName: locationsList.length > 0 ? locationsList[0].city : '',
    bankName: '',
    branchName: '',
    goldRatePerGram: '',
    interestRate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (rate) {
        const res = await api.put(`/admin/bank-rates/${rate._id || rate.id}`, formData);
        onSaved(res.data.rate, true);
      } else {
        const res = await api.post('/admin/bank-rates', formData);
        onSaved(res.data.rate, false);
      }
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save bank rate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all">
        
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-5 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Coins size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-none">{rate ? 'Edit Gold Loan Rate' : 'Bank Gold Loan Rate'}</h3>
              <p className="text-blue-100 text-[11px] mt-1 font-medium">Configure gold loan pricing parameters</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-blue-200 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1.5">City Name <span className="text-rose-500">*</span></label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <select
                  required
                  value={formData.cityName}
                  onChange={(e) => setFormData({ ...formData, cityName: e.target.value })}
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 hover:bg-white transition-colors appearance-none font-semibold text-slate-700 cursor-pointer"
                >
                  <option value="" disabled>Select a city</option>
                  {locationsList.map((loc, idx) => (
                    <option key={loc.id || idx} value={loc.city}>
                      {loc.city}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1.5">Bank Name <span className="text-rose-500">*</span></label>
              <div className="relative">
                <Building size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  placeholder="e.g. State Bank of India"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 hover:bg-white transition-colors font-medium text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 text-xs mb-1.5">Branch Name <span className="text-rose-500">*</span></label>
              <div className="relative">
                <Building size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.branchName}
                  onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                  placeholder="e.g. MG Road Branch"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 hover:bg-white transition-colors font-medium text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1.5">Gold Loan Rate Per Gram <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    value={formData.goldRatePerGram}
                    onChange={(e) => setFormData({ ...formData, goldRatePerGram: Number(e.target.value) })}
                    placeholder="5800"
                    className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 hover:bg-white transition-colors font-black text-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1.5">Interest Rate <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Percent size={14} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: Number(e.target.value) })}
                    placeholder="8.5"
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50 hover:bg-white transition-colors font-black text-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-colors flex items-center justify-center cursor-pointer text-xs"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankRateModal;
