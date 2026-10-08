import React from 'react';
import { 
  ChevronRight, Search, Download, Eye, Plus, CheckCircle2, 
  MapPin, Save, Users, ShieldCheck, FileText, Clock, Wallet, 
  Coins, TrendingUp, Filter, AlertCircle, BarChart3, Building,
  Check, Settings as SettingsIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RepaymentsView = (props) => {
  const { applications, showToast } = props;

  // Filter only disbursed loans (exclude service requests if they don't have EMIs)
  const disbursedLoans = applications.filter(a => a.status === 'Disbursed' && !a.isServiceRequest);

  // Generate repayment entries based on actual disbursed loans
  const repaymentEntries = disbursedLoans.map((loan, index) => {
    // Generate mock status for demonstration if real repayment tracking isn't in DB yet
    let status = 'Pending';
    let statusColor = 'bg-amber-50 text-amber-700 border-amber-200';
    
    if (index % 3 === 0) {
      status = 'Paid';
      statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    } else if (index % 5 === 0) {
      status = 'Overdue';
      statusColor = 'bg-rose-50 text-rose-700 border-rose-200';
    }

    const emi = Number(loan.disbursementDetails?.monthlyEmi) || 12500; // fallback if missing
    const due = loan.disbursementDetails?.firstEmiDate || '10 Oct 2026';

    return {
      loanId: loan.applicationId,
      customer: loan.applicantName,
      emi: emi,
      due: due,
      status: status,
      statusColor: statusColor
    };
  });

  // Calculate totals based on the entries
  const totalExpected = repaymentEntries.reduce((sum, item) => sum + item.emi, 0);
  const totalCollected = repaymentEntries.filter(i => i.status === 'Paid').reduce((sum, item) => sum + item.emi, 0);
  const totalPending = repaymentEntries.filter(i => i.status === 'Pending').reduce((sum, item) => sum + item.emi, 0);
  const totalOverdue = repaymentEntries.filter(i => i.status === 'Overdue').reduce((sum, item) => sum + item.emi, 0);

  const formatLakhs = (amount) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Repayments & Collections</h1>
          <p className="text-xs text-slate-500">Track incoming EMIs, overdue accounts, and collection metrics.</p>
        </div>
        <div className="flex gap-2 text-xs">
          <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50">This Month</button>
          <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-pointer hover:bg-slate-100">Overdue Only</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Expected</span>
          <p className="text-xl font-black text-slate-800 mt-1">{formatLakhs(totalExpected)}</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs border-b-4 border-b-emerald-500">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Collected</span>
          <p className="text-xl font-black text-emerald-600 mt-1">{formatLakhs(totalCollected)}</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs border-b-4 border-b-amber-500">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Pending</span>
          <p className="text-xl font-black text-amber-600 mt-1">{formatLakhs(totalPending)}</p>
        </div>
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs border-b-4 border-b-rose-500">
          <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Overdue</span>
          <p className="text-xl font-black text-rose-600 mt-1">{formatLakhs(totalOverdue)}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Loan ID</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">EMI Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {repaymentEntries.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-blue-600 text-sm">#{item.loanId}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-bold text-slate-800">{item.customer}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-black text-slate-800 text-sm">
                      ₹{item.emi.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-semibold">
                    {item.due}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => showToast(`Record payment for ${item.loanId}`)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Log Payment
                    </button>
                  </td>
                </tr>
              ))}
              {repaymentEntries.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500 text-xs">
                    No active repayments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RepaymentsView;
