import React from 'react';
import { 
  ChevronRight, Search, Download, Eye, Plus, CheckCircle2, 
  MapPin, Save, Users, ShieldCheck, FileText, Clock, Wallet, 
  Coins, TrendingUp, Filter, AlertCircle, BarChart3, Building,
  Check, Settings as SettingsIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BranchOperationsView = (props) => {
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
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Branch Operations</h1>
                  <p className="text-xs text-slate-500">Monitor daily activity and cash flows across branches.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Branch Selector & Metrics */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-800">Branch Performance</h3>
                      <select 
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none cursor-pointer"
                      >
                        <option value="All">All Branches</option>
                        {locationsList.map(loc => (
                          <option key={loc.id} value={loc.city}>{loc.city}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <p className="text-xs font-semibold text-blue-600 mb-1">Today's Applications</p>
                        <p className="text-2xl font-black text-slate-900">
                          {selectedBranch === 'All' ? applications.length : applications.filter(a => a.branch === selectedBranch).length}
                        </p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-xl">
                        <p className="text-xs font-semibold text-emerald-600 mb-1">Total Disbursed</p>
                        <p className="text-2xl font-black text-slate-900">
                          ₹{selectedBranch === 'All' ? '12.5L' : '4.2L'}
                        </p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-xl">
                        <p className="text-xs font-semibold text-amber-600 mb-1">Pending KYC</p>
                        <p className="text-2xl font-black text-slate-900">
                          {selectedBranch === 'All' ? applications.filter(a => a.status.includes('Pending')).length : applications.filter(a => a.branch === selectedBranch && a.status.includes('Pending')).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Branch Activity (Mock) */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                    <h3 className="font-bold text-slate-800 mb-4">Live Activity Feed</h3>
                    <div className="space-y-4">
                      {applications.slice(0, 5).map((app, i) => (
                        <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                          <div>
                            <p className="text-xs font-bold text-slate-800">{app.applicantName} <span className="text-slate-500 font-normal">submitted a new {app.loanType} application</span></p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{app.branch} • {app.submittedOn}</p>
                          </div>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${app.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : app.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Staff on Duty */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                    <h3 className="font-bold text-slate-800 mb-4">Staff on Duty</h3>
                    <div className="space-y-3">
                      {usersList
                        .filter(u => selectedBranch === 'All' || u.branch === selectedBranch)
                        .slice(0, 6)
                        .map((user, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250'} alt="staff" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-xs font-bold text-slate-800">{user.name}</p>
                            <p className="text-[10px] text-slate-500">{user.title}</p>
                          </div>
                          <div className={`ml-auto w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
);
};

export default BranchOperationsView;
