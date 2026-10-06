import React, { useState } from 'react';
import { X, Upload, CheckCircle2, FileText, Send } from 'lucide-react';
import api from '../utils/api';

const DynamicServiceModal = ({ isOpen, onClose, serviceName }) => {
  const isGoldLoanRenewal = serviceName && serviceName.toLowerCase().includes('renew gold loan') || serviceName.toLowerCase().includes('financial help');

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    // specific fields
    bankDetails: '',
    goldWeight: '',
    loanAmount: '',
    loanDueDate: '',
    finalValue: '',
    receiptPic: '',
    // generic fields
    requirements: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, receiptPic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submittedFormData = isGoldLoanRenewal ? {
        bankDetails: formData.bankDetails,
        goldWeight: formData.goldWeight,
        loanAmount: formData.loanAmount,
        loanDueDate: formData.loanDueDate,
        finalValue: formData.finalValue,
        receiptPic: formData.receiptPic
      } : {
        requirements: formData.requirements
      };

      await api.post('/public/service-requests', {
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        serviceName: serviceName,
        formData: submittedFormData
      });
      setSuccess(true);
    } catch (err) {
      alert('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center shadow-2xl">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={36} />
          </div>
          <h3 className="text-2xl font-bold text-[#0e274a] mb-2">Request Submitted!</h3>
          <p className="text-slate-600 text-sm mb-6">
            Your request for <strong>{serviceName}</strong> has been sent to our verification team. We will contact you shortly.
          </p>
          <button onClick={onClose} className="w-full py-3 bg-[#0e274a] text-white font-bold rounded-xl hover:bg-[#163866] transition-colors">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative max-h-[95vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors">
          <X size={20} />
        </button>

        <div className="mb-6">
          <span className="text-[11px] font-bold text-[#c48722] uppercase tracking-wider">Service Request</span>
          <h3 className="text-2xl font-bold text-[#0e274a] leading-tight mt-1">{serviceName}</h3>
          <p className="text-xs text-slate-500 mt-1">Please provide the details below to proceed.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
              <input required type="text" value={formData.customerName} onChange={e => setFormData({...formData, customerName: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number *</label>
              <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-2">
            <h4 className="text-sm font-bold text-[#0e274a] mb-4 flex items-center gap-2"><FileText size={16}/> Service Specific Details</h4>
            
            {isGoldLoanRenewal ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Bank Details (Account / Branch) *</label>
                  <input required type="text" value={formData.bankDetails} onChange={e => setFormData({...formData, bankDetails: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:border-blue-500 outline-none" placeholder="e.g. SBI, Main Branch" />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Gold Weight (Grams) *</label>
                  <input required type="number" value={formData.goldWeight} onChange={e => setFormData({...formData, goldWeight: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:border-blue-500 outline-none" placeholder="e.g. 50" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Loan Amount Outstanding *</label>
                  <input required type="number" value={formData.loanAmount} onChange={e => setFormData({...formData, loanAmount: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:border-blue-500 outline-none" placeholder="e.g. 150000" />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Loan Due Date *</label>
                  <input required type="date" value={formData.loanDueDate} onChange={e => setFormData({...formData, loanDueDate: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Final Settlement Value</label>
                  <input type="number" value={formData.finalValue} onChange={e => setFormData({...formData, finalValue: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-xl text-sm focus:border-blue-500 outline-none" placeholder="e.g. 155000" />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Gold Loan Receipt Picture *</label>
                  <div className="flex items-center gap-4">
                    <label className="flex-1 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer transition-colors">
                      <input required={!formData.receiptPic} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                      <Upload size={20} className="mx-auto text-slate-400 mb-2" />
                      <span className="text-xs font-bold text-slate-600 block">Click to upload receipt</span>
                      <span className="text-[10px] text-slate-400">PNG, JPG up to 5MB</span>
                    </label>
                    {formData.receiptPic && (
                      <div className="w-24 h-24 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                        <img src={formData.receiptPic} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Detailed Requirements / Message *</label>
                  <textarea required value={formData.requirements} onChange={e => setFormData({...formData, requirements: e.target.value})} className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm focus:border-blue-500 outline-none h-32 resize-none" placeholder="Please describe what you need help with..." />
                </div>
              </div>
            )}
          </div>

          <button disabled={loading} type="submit" className="w-full py-3.5 bg-[#0e274a] hover:bg-[#163866] text-white font-bold rounded-xl mt-4 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-70">
            {loading ? 'Submitting...' : (
              <>
                <Send size={18} />
                <span>Submit Request</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DynamicServiceModal;
