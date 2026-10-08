import React from 'react';
import { 
  ChevronRight, Search, Download, Eye, Plus, CheckCircle2, 
  MapPin, Save, Users, ShieldCheck, FileText, Clock, Wallet, 
  Coins, TrendingUp, Filter, AlertCircle, BarChart3, Building,
  Check, Settings as SettingsIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DashboardOverviewView = (props) => {
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
<div className="space-y-6">
              
              {/* Welcome Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Welcome Back, {adminUser?.name || 'Ravi Kumar'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Here's what's happening at your branch today.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>Branch: <strong className="text-slate-900">{selectedBranch}</strong></span>
                  <span>•</span>
                  <span>24 Sep 2026</span>
                </div>
              </div>

              {/* 5 Metric Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                
                {/* Total Applications */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500 block">Total Applications</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      {stats?.metrics?.totalApplications || 0}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      +12% from last week
                    </span>
                  </div>
                </div>

                {/* Pending Verification */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/70 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500 block">Pending Verification</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-amber-600">
                      {stats?.metrics?.pendingVerification || 0}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      Needs your action
                    </span>
                  </div>
                </div>

                {/* Approved Today */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500 block">Approved Today</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                      {stats?.metrics?.approvedToday || 0}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      +8% from yesterday
                    </span>
                  </div>
                </div>

                {/* Disbursed Amount */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500 block">Disbursed Amount</span>
                  <div className="mt-2">
                    <span className="text-2xl sm:text-3xl font-black text-blue-700">
                      {stats?.metrics?.disbursedAmount || '₹0.00 Lakh'}
                    </span>
                  </div>
                </div>

                {/* Active Loans */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500 block">Active Loans</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      {stats?.metrics?.activeLoans || 0}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      +5% this month
                    </span>
                  </div>
                </div>

              </div>

              {/* 2 Charts Grid: Applications Overview + Loan Type Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Applications Overview Multi-line Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h2 className="text-sm font-bold text-slate-900">Applications Overview</h2>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-blue-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Received
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Approved
                      </span>
                      <span className="flex items-center gap-1.5 text-rose-500">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Rejected
                      </span>
                    </div>
                  </div>

                  {/* Interactive SVG Chart matching visual design */}
                  <div className="h-60 w-full relative">
                    <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                      {/* Grid Lines */}
                      <line x1="0" y1="20" x2="600" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="65" x2="600" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="110" x2="600" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="155" x2="600" y2="155" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="195" x2="600" y2="195" stroke="#e2e8f0" strokeWidth="1" />

                      {(() => {
                        const trend = stats?.weeklyTrend && stats.weeklyTrend.length > 0 ? stats.weeklyTrend : [
                          { date: 'Mon', received: 0, approved: 0, rejected: 0 },
                          { date: 'Tue', received: 0, approved: 0, rejected: 0 },
                          { date: 'Wed', received: 0, approved: 0, rejected: 0 },
                          { date: 'Thu', received: 0, approved: 0, rejected: 0 },
                          { date: 'Fri', received: 0, approved: 0, rejected: 0 },
                          { date: 'Sat', received: 0, approved: 0, rejected: 0 },
                          { date: 'Sun', received: 0, approved: 0, rejected: 0 }
                        ];
                        const maxVal = Math.max(...trend.map(t => Math.max(t.received, t.approved, t.rejected, 1)));
                        const getPts = (key) => trend.map((t, i) => {
                          const x = 20 + i * (560 / Math.max(1, trend.length - 1));
                          const y = 180 - (t[key] / maxVal) * 140; // Scale dynamically between y=180 (bottom) and y=40 (top)
                          return { x, y };
                        });
                        const rPts = getPts('received');
                        const aPts = getPts('approved');
                        const rejPts = getPts('rejected');
                        const toPath = (pts) => pts.length > 0 ? `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') : '';
                        
                        return (
                          <>
                            {/* Received Curve (Blue) */}
                            <path d={toPath(rPts)} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" />
                            {rPts.map((p, i) => <circle key={`r-${i}`} cx={p.x} cy={p.y} r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />)}
                            
                            {/* Approved Curve (Green) */}
                            <path d={toPath(aPts)} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />
                            {aPts.map((p, i) => <circle key={`a-${i}`} cx={p.x} cy={p.y} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" />)}
                            
                            {/* Rejected Curve (Red) */}
                            <path d={toPath(rejPts)} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinejoin="round" />
                            {rejPts.map((p, i) => <circle key={`rej-${i}`} cx={p.x} cy={p.y} r="4" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />)}
                          </>
                        );
                      })()}
                    </svg>

                    {/* Chart X Labels */}
                    <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2 px-2">
                      {(stats?.weeklyTrend || [{date: '18 Sep'}, {date: '19 Sep'}, {date: '20 Sep'}, {date: '21 Sep'}, {date: '22 Sep'}, {date: '23 Sep'}, {date: '24 Sep'}]).map((t, i) => (
                        <span key={i}>{t.date}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Loan Type Distribution Donut Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <h2 className="text-sm font-bold text-slate-900 mb-4">Loan Type Distribution</h2>
                  
                  <div className="flex items-center justify-center relative my-2">
                    {/* SVG Donut */}
                    <svg viewBox="0 0 160 160" className="w-40 h-40 transform -rotate-90">
                      {(() => {
                        const dist = stats?.loanTypeDistribution && stats.loanTypeDistribution.length > 0 ? stats.loanTypeDistribution : [
                          { name: 'No Data', percentage: 100, color: '#cbd5e1' }
                        ];
                        let offset = 0;
                        return dist.map((item, i) => {
                          const val = (item.percentage / 100) * 365;
                          const currentOffset = offset;
                          offset += val;
                          return (
                            <circle key={i} cx="80" cy="80" r="58" fill="none" stroke={item.color} strokeWidth="18" strokeDasharray={`${val} 365`} strokeDashoffset={-currentOffset} />
                          );
                        });
                      })()}
                    </svg>
                    
                    {/* Donut Center Count */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black text-slate-900">{stats?.metrics?.totalApplications || 0}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applications</span>
                    </div>
                  </div>

                  {/* Distribution Legend */}
                  <div className="space-y-1.5 text-xs font-semibold pt-2">
                    {(stats?.loanTypeDistribution && stats.loanTypeDistribution.length > 0 ? stats.loanTypeDistribution : []).map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-slate-600">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} /> {item.name}
                        </span>
                        <span className="font-bold text-slate-800">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Recent Applications Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900">Recent Applications</h2>
                  <button 
                    onClick={() => setActiveTab('applications')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/60 border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-6 font-bold">#</th>
                        <th className="py-3 px-4 font-bold">Applicant Name</th>
                        <th className="py-3 px-4 font-bold">Loan Type</th>
                        <th className="py-3 px-4 font-bold">Amount</th>
                        <th className="py-3 px-4 font-bold">Submitted On</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold">Assigned To</th>
                        <th className="py-3 px-6 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApplications.slice(0, 6).map((app) => (
                        <tr key={app.applicationId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-6 font-bold text-blue-600">{app.applicationId}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">{app.applicantName}</td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">{app.loanType}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">₹{Number(app.amount).toLocaleString('en-IN')}</td>
                          <td className="py-3.5 px-4 text-slate-500">{app.submittedOn}</td>
                          <td className="py-3.5 px-4">{getStatusBadge(app.status)}</td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">{app.assignedTo || 'Me'}</td>
                          <td className="py-3.5 px-6 text-right">
                            <button
                              onClick={() => setSelectedApplication(app)}
                              className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
                            >
                              View →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
);
};

export default DashboardOverviewView;
