import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Landmark, ArrowRight, ShieldCheck } from 'lucide-react';

const ApplyLoanTab = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Application submitted successfully!');
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm"
    >
      <h2 className="text-xl font-black text-slate-800 tracking-tight mb-2">Apply for a New Loan</h2>
      <p className="text-sm text-slate-500 mb-8">Fill in the details below to start your application.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Loan Type</label>
            <select className="w-full px-4 py-3 rounded-xl border border-white/60 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm font-medium">
              <option>Gold Loan</option>
              <option>Loan Transfer</option>
              <option>Personal Loan</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Requested Amount (₹)</label>
            <input type="number" placeholder="e.g. 500000" required className="w-full px-4 py-3 rounded-xl border border-white/60 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm font-medium" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Purpose of Loan</label>
          <textarea rows="3" placeholder="Briefly describe why you need this loan..." className="w-full px-4 py-3 rounded-xl border border-white/60 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-sm font-medium"></textarea>
        </div>

        <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
          <ShieldCheck size={24} className="text-blue-500 shrink-0" />
          <p className="text-xs text-slate-600">Your information is securely encrypted and submitted directly to our loan processing team.</p>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3 bg-[#0e274a] hover:bg-[#163866] text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? 'Processing...' : 'Submit Application'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </form>
    </motion.div>
  );
};

export default ApplyLoanTab;
