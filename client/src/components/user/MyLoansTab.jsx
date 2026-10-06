import React from 'react';
import { motion } from 'framer-motion';
import { Banknote, ArrowRight } from 'lucide-react';

const MyLoansTab = ({ applications }) => {
  const approvedLoans = applications.filter(app => app.status === 'Approved');

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight mb-1">My Active Loans</h2>
          <p className="text-sm text-slate-500">Manage your currently active loans.</p>
        </div>
      </div>

      {approvedLoans.length === 0 ? (
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-10 text-center shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Banknote size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-700">No Active Loans</h3>
          <p className="text-sm text-slate-500 mt-2">You don't have any active approved loans right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {approvedLoans.map((loan, idx) => (
            <div key={idx} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
                  <Banknote size={24} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{loan.loanType}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-1">{loan.applicationId || 'LOAN-' + Math.floor(Math.random()*10000)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 text-left md:text-right">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Loan Amount</p>
                  <p className="text-sm font-bold text-slate-800">₹{(loan.amount || 0).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className="text-sm font-bold text-emerald-600 flex items-center justify-end gap-1">Active</p>
                </div>
              </div>

              <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default MyLoansTab;
