import React from 'react';
import { 
  ChevronRight, Search, Download, Eye, Plus, CheckCircle2, 
  MapPin, Save, Users, ShieldCheck, FileText, Clock, Wallet, 
  Coins, TrendingUp, Filter, AlertCircle, BarChart3, Building,
  Check, Settings as SettingsIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OneLendingView = (props) => {
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
            const oneLendingApps = applications.filter(a => a.loanType === 'One Lending' || a.loanType === 'Personal Loan' || a.loanType === 'Business Loan');
            return (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">One Lending Module</h1>
                    <p className="text-xs text-slate-500">Manage all Unsecured Loans (Personal, Business, etc.).</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer">
                      + New Loan Lead
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <p className="text-xs font-bold text-slate-500 mb-1">Total Disbursed (One Lending)</p>
                    <p className="text-2xl font-black text-slate-800">
                      ₹{oneLendingApps.filter(a => a.status === 'Disbursed').reduce((sum, a) => sum + (a.amount || 0), 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <p className="text-xs font-bold text-slate-500 mb-1">Active Accounts</p>
                    <p className="text-2xl font-black text-slate-800">
                      {oneLendingApps.filter(a => a.status === 'Disbursed' || a.status === 'Approved').length}
                    </p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <p className="text-xs font-bold text-slate-500 mb-1">Pending Approval</p>
                    <p className="text-2xl font-black text-slate-800">
                      {oneLendingApps.filter(a => a.status.includes('Pending') || a.status.includes('Review')).length}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Application</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {oneLendingApps.map((app, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-bold text-blue-600 text-sm">#{app.applicationId}</span>
                              <p className="text-[10px] text-slate-500">{app.loanType}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="text-sm font-bold text-slate-800">{app.applicantName}</p>
                              <p className="text-xs text-slate-500">{app.applicantMobile}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-black text-slate-800 text-sm">
                                ₹{Number(app.amount).toLocaleString('en-IN')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                app.status === 'Disbursed' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button 
                                onClick={() => setSelectedApplication(app)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                        {oneLendingApps.length === 0 && (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-xs">
                              No One Lending applications found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })(
);
};

export default OneLendingView;
