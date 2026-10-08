import React from 'react';
import { 
  ChevronRight, Search, Download, Eye, Plus, CheckCircle2, 
  MapPin, Save, Users, ShieldCheck, FileText, Clock, Wallet, 
  Coins, TrendingUp, Filter, AlertCircle, BarChart3, Building,
  Check, Settings as SettingsIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReportsView = (props) => {
  const {
    adminUser, stats, selectedBranch, setSelectedBranch,
    applications, filteredApplications, getStatusBadge,
    setActiveTab, setSelectedApplication, showToast,
    customersList, customersPage, setCustomersPage, customersPerPage,
    setSelectedCustomer, setShowCustomerModal,
    disbursementForm, setDisbursementForm, handleDisburseLoanSubmit,
    usersList, setEditingUser, setShowAddUserModal,
    activeSettingsTab, setActiveSettingsTab, currentSettingForm, setCurrentSettingForm, handleSaveSettings,
    locationsList, setEditingLocation, setShowLocationModal, handleRemoveLocation
  } = props;

  return (
() => {
            const totalApps = applications.length;
            const approvedLoans = applications.filter(a => a.status === 'Approved').length;
            const disbursedLoans = applications.filter(a => a.status === 'Disbursed');
            const activeLoans = applications.filter(a => ['Approved', 'Disbursed'].includes(a.status)).length;
            
            const disbursedAmount = disbursedLoans.reduce((sum, a) => {
              const amtStr = String(a.amount || 0).replace(/,/g, '');
              const amt = parseFloat(amtStr);
              return sum + (isNaN(amt) ? 0 : amt);
            }, 0);
            
            const formatAmount = (amt) => {
              if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(2)} Cr`;
              if (amt >= 100000) return `₹${(amt / 100000).toFixed(2)} L`;
              return `₹${amt.toLocaleString('en-IN')}`;
            };

            // Calculate Monthly Data
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthlyCounts = {};
            applications.forEach(app => {
              const date = new Date(app.createdAt || Date.now());
              const m = months[date.getMonth()];
              monthlyCounts[m] = (monthlyCounts[m] || 0) + 1;
            });
            // Prepare last 6 months
            const currMonthIdx = new Date().getMonth();
            const monthlyData = [];
            for (let i = 5; i >= 0; i--) {
              const mIdx = (currMonthIdx - i + 12) % 12;
              monthlyData.push({ month: months[mIdx], val: monthlyCounts[months[mIdx]] || 0 });
            }
            const maxVal = Math.max(...monthlyData.map(d => d.val), 1);

            return (
            <div className="space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Reports & Analytics</h1>
                  <p className="text-xs text-slate-500">View branch performance and generate reports</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <input
                    type="text"
                    defaultValue="01 Sep 2026 - 24 Sep 2026"
                    className="px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  />
                  <select className="px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium">
                    <option>All Reports</option>
                    <option>Gold Loan Portfolio</option>
                    <option>Disbursement Statement</option>
                  </select>
                  <button 
                    onClick={() => showToast('Branch analytics report generated!')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Generate Report
                  </button>
                </div>
              </div>

              {/* 4 Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500">Total Applications</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{totalApps.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500">Approved Loans</span>
                  <p className="text-2xl font-black text-emerald-600 mt-1">{approvedLoans.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500">Disbursed Amount</span>
                  <p className="text-2xl font-black text-blue-600 mt-1">{formatAmount(disbursedAmount)}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500">Active Loans</span>
                  <p className="text-2xl font-black text-[#c48722] mt-1">{activeLoans.toLocaleString()}</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Monthly Disbursement Bar Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-6">Recent Applications (Last 6 Months)</h3>
                  <div className="h-56 flex items-end justify-between gap-3 px-4 pb-2 border-b border-slate-200">
                    {monthlyData.map(b => (
                      <div key={b.month} className="flex-1 flex flex-col items-center gap-2 group relative">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-lg transition-all"
                          style={{ height: `${(b.val / maxVal) * 180}px`, minHeight: '4px' }}
                        />
                        <div className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {b.val}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">{b.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collection Performance */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Collection Performance</h3>
                  
                  <div className="relative my-4 flex items-center justify-center">
                    <svg viewBox="0 0 160 160" className="w-36 h-36 transform -rotate-90">
                      <circle cx="80" cy="80" r="58" fill="none" stroke="#10b981" strokeWidth="18" strokeDasharray="335 365" strokeDashoffset="0" />
                      <circle cx="80" cy="80" r="58" fill="none" stroke="#f59e0b" strokeWidth="18" strokeDasharray="22 365" strokeDashoffset="-335" />
                      <circle cx="80" cy="80" r="58" fill="none" stroke="#ef4444" strokeWidth="18" strokeDasharray="8 365" strokeDashoffset="-357" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black text-emerald-600">92%</span>
                      <span className="text-[10px] font-bold text-slate-400">Collection Rate</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-semibold">
                    <div className="flex justify-between"><span className="text-slate-600">• Collected</span><span className="font-bold text-emerald-600">92%</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">• Pending</span><span className="font-bold text-amber-600">6%</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">• Overdue</span><span className="font-bold text-rose-600">2%</span></div>
                  </div>

                </div>

              </div>

            </div>
            );
          })(
);
};

export default ReportsView;
