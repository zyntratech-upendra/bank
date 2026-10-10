import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, ShieldCheck, X, Layers, Settings, FileText } from 'lucide-react';
import api from '../../utils/api';

const ManageServices = ({ showToast }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'FileText',
    status: 'Active'
  });

  const fetchServices = async () => {
    try {
      const res = await api.get('/admin/services');
      setServices(res.data);
    } catch (err) {
      showToast('Error loading services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        const res = await api.put(`/admin/services/${editingService._id}`, formData);
        setServices(prev => prev.map(s => s._id === res.data._id ? res.data : s));
        showToast('Service updated successfully');
      } else {
        const res = await api.post('/admin/services', formData);
        setServices([res.data, ...services]);
        showToast('Service added successfully');
      }
      setIsModalOpen(false);
      setEditingService(null);
    } catch (err) {
      showToast('Error saving service');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`/admin/services/${id}`);
        setServices(prev => prev.filter(s => s._id !== id));
        showToast('Service deleted');
      } catch (err) {
        showToast('Error deleting service');
      }
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const paginatedServices = services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 drop-shadow-sm">Manage Services</h1>
          <p className="text-xs text-slate-500 mt-1">Add, edit, or configure dynamic services available to customers.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setEditingService(null); setFormData({ title: '', description: '', icon: 'FileText', status: 'Active' }); setIsModalOpen(true); }}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus size={16} />
            Add New Service
          </button>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
        {/* Decorative glassmorphism glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/40 border-b border-slate-200/60 text-slate-500 uppercase text-[10px] tracking-widest font-bold">
                <th className="py-4 px-6">Service Overview</th>
                <th className="py-4 px-4 hidden md:table-cell">Description</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/60">
              {paginatedServices.map(srv => (
                <tr key={srv._id} className="hover:bg-white/60 transition-all duration-300 group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50/80 text-blue-600 flex items-center justify-center border border-blue-100/50 shrink-0">
                        <Layers size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{srv.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 md:hidden line-clamp-1">{srv.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-600 max-w-sm truncate hidden md:table-cell">
                    {srv.description}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${srv.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                      {srv.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setEditingService(srv); setFormData(srv); setIsModalOpen(true); }}
                        className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(srv._id)}
                        className="p-1.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg font-bold transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {services.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300 shadow-inner">
                        <Settings size={32} />
                      </div>
                      <h3 className="text-slate-700 font-bold mb-1">No Services Found</h3>
                      <p className="text-slate-400 text-xs">Click the button above to add a new service.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Glassmorphic Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-slate-200/60 p-4 flex items-center justify-between bg-white/40 relative z-10">
            <p className="text-xs text-slate-500 font-medium">
              Showing <span className="font-bold text-slate-800">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-slate-800">{Math.min(currentPage * itemsPerPage, services.length)}</span> of <span className="font-bold text-slate-800">{services.length}</span> entries
            </p>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    currentPage === i + 1 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          {/* Backdrop with dark blur */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-md transition-opacity" 
            onClick={() => setIsModalOpen(false)} 
          />
          
          {/* Pop-up Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            {/* Top decorative gradient bar */}
            <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500" />
            
            {/* Header */}
            <div className="px-6 sm:px-8 pt-6 pb-4 flex items-center justify-between border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-sm">
                  {editingService ? <Edit2 size={20} className="stroke-[2.5]" /> : <Plus size={22} className="stroke-[2.5]" />}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-display tracking-tight">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    {editingService ? 'Update details for this banking service' : 'Configure a new dynamic service for customers'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-5">
              {/* Service Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Service Title <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Layers size={17} />
                  </div>
                  <input 
                    type="text"
                    required 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all outline-none" 
                    placeholder="e.g. Gold Loan, Home Loan, Vehicle Loan"
                  />
                </div>
              </div>
              
              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea 
                  required 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 transition-all outline-none h-28 resize-none leading-relaxed" 
                  placeholder="Describe key features, eligibility, interest rates, and customer benefits..."
                />
              </div>
              
              {/* Status Radio / Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Service Status
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, status: 'Active'})}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      formData.status === 'Active'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${formData.status === 'Active' ? 'bg-emerald-500 ring-4 ring-emerald-200' : 'bg-slate-400'}`} />
                    Active
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({...formData, status: 'Inactive'})}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                      formData.status === 'Inactive'
                        ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${formData.status === 'Inactive' ? 'bg-amber-500 ring-4 ring-amber-200' : 'bg-slate-400'}`} />
                    Inactive
                  </button>
                </div>
              </div>
              
              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 size={17} className="stroke-[2.5]" />
                  <span>{editingService ? 'Update Service' : 'Save Service'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;

