import React from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Clock, History } from 'lucide-react';

const PaymentsTab = ({ applications = [] }) => {
  const activeLoans = applications.filter(app => app.status === 'Approved');
  
  // Fake calculation: 5% of total active loan amount as EMI
  const totalLoanAmount = activeLoans.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const nextEmiAmount = totalLoanAmount > 0 ? Math.round(totalLoanAmount * 0.05) : 0;
  
  // Generate some fake transactions based on active loans
  const recentTransactions = activeLoans.map((loan, idx) => ({
    id: idx,
    name: loan.loanType || 'Gold Loan',
    amount: Math.round((loan.amount || 0) * 0.05),
    status: 'Success'
  })).slice(0, 3); // max 3

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight mb-1">Payments & EMIs</h2>
          <p className="text-sm text-slate-500">Track your upcoming and past payments.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Due */}
        <div className="bg-gradient-to-br from-[#0e274a] to-[#163866] rounded-3xl p-6 shadow-lg text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-2 text-white/70 mb-4">
              <Clock size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Next EMI Due</span>
            </div>
            
            <h3 className="text-4xl font-black mb-1">₹{nextEmiAmount > 0 ? nextEmiAmount.toLocaleString('en-IN') : '0'}</h3>
            <p className="text-sm text-white/80 font-medium mb-6">
              {nextEmiAmount > 0 ? 'Due on 05 Oct 2026' : 'No active EMIs due'}
            </p>
            
            <button 
              disabled={nextEmiAmount === 0}
              className={`mt-auto w-full py-3 text-sm font-bold rounded-xl transition-colors ${
                nextEmiAmount > 0 
                  ? 'bg-white text-[#0e274a] hover:bg-slate-50' 
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
            >
              Pay Now
            </button>
          </div>
        </div>

        {/* History */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-500 mb-6">
            <History size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Recent Transactions</span>
          </div>

          <div className="space-y-4">
            {recentTransactions.length > 0 ? recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/50 border border-white/60 hover:bg-white/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                    <IndianRupee size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">EMI Payment</p>
                    <p className="text-[10px] font-semibold text-slate-500">{tx.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-800">₹{tx.amount.toLocaleString('en-IN')}</span>
                  <p className="text-[10px] font-semibold text-emerald-500 mt-0.5">{tx.status}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-6">
                <p className="text-sm font-medium text-slate-400">No recent transactions found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentsTab;
