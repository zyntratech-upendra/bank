import React from 'react';
import { 
  ChevronRight, Search, Download, Eye, Plus, CheckCircle2, 
  MapPin, Save, Users, ShieldCheck, FileText, Clock, Wallet, 
  Coins, TrendingUp, Filter, AlertCircle, BarChart3, Building,
  Check, Settings as SettingsIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomersView = (props) => {
  const {
    loading = false,
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
            const totalPages = Math.ceil(customersList.length / customersPerPage);
            const paginatedCustomers = customersList.slice((customersPage - 1) * customersPerPage, customersPage * customersPerPage);

            return (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 drop-shadow-sm">Registered Customers</h1>
                    <p className="text-xs text-slate-500 mt-1">View and manage customers who have created an account.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => showToast('Exporting customer data...')}
                      className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Download size={16} />
                      Export Data
                    </button>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
                  <div className="absolute top-0 left-0 -ml-16 -mt-16 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/40 border-b border-slate-200/60 text-slate-500 uppercase text-[10px] tracking-widest font-bold">
                          <th className="py-4 px-6">Customer Details</th>
                          <th className="py-4 px-4">Contact Info</th>
                          <th className="py-4 px-4 hidden lg:table-cell">KYC Info</th>
                          <th className="py-4 px-4 hidden sm:table-cell">Joined Date</th>
                          <th className="py-4 px-4">Status</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/60">
                        {paginatedCustomers.map((cust, i) => (
                          <tr key={cust._id || i} className="hover:bg-white/60 transition-all duration-300 group">
                            <td className="py-4 px-6 font-bold text-slate-800 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 overflow-hidden">
                                {cust.profilePicUrl || cust.avatar ? (
                                  <img src={cust.profilePicUrl || cust.avatar} alt={cust.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="font-bold text-sm">{cust.name?.charAt(0) || 'C'}</span>
                                )}
                              </div>
                              <div>
                                <span className="block font-bold text-sm">{cust.name}</span>
                                <span className="text-[10px] text-slate-500 font-medium">ID: {cust._id?.slice(-6).toUpperCase() || 'CUST01'}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-semibold text-slate-800">{cust.email}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{cust.phone || 'N/A'}</div>
                            </td>
                            <td className="py-4 px-4 hidden lg:table-cell">
                              <div className="flex flex-col gap-1">
                                {cust.aadhaarNumber ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                                    Aadhaar: {cust.aadhaarNumber}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">No Aadhaar</span>
                                )}
                                {cust.panNumber ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md">
                                    PAN: {cust.panNumber}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">No PAN</span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-slate-600 font-medium hidden sm:table-cell">
                              {new Date(cust.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                cust.status === 'Active' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                  : 'bg-rose-50 text-rose-700 border border-rose-100'
                              }`}>
                                {cust.status || 'Active'}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => { setSelectedCustomer(cust); setShowCustomerModal(true); }}
                                  className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold transition-colors cursor-pointer"
                                  title="View Profile"
                                >
                                  <Eye size={16} />
                                </button>
                                <a 
                                  href={`mailto:${cust.email}`}
                                  className="p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-bold transition-colors cursor-pointer block"
                                  title="Send Message"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {customersList.length === 0 && !loading && (
                          <tr>
                            <td colSpan="6" className="px-6 py-16 text-center">
                              <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300 shadow-inner">
                                  <Users size={32} />
                                </div>
                                <h3 className="text-slate-700 font-bold mb-1">No Customers Found</h3>
                                <p className="text-slate-400 text-xs">There are no registered customers yet.</p>
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
                        Showing <span className="font-bold text-slate-800">{(customersPage - 1) * customersPerPage + 1}</span> to <span className="font-bold text-slate-800">{Math.min(customersPage * customersPerPage, customersList.length)}</span> of <span className="font-bold text-slate-800">{customersList.length}</span> entries
                      </p>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setCustomersPage(p => Math.max(1, p - 1))}
                          disabled={customersPage === 1}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCustomersPage(i + 1)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              customersPage === i + 1 
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button 
                          onClick={() => setCustomersPage(p => Math.min(totalPages, p + 1))}
                          disabled={customersPage === totalPages}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })(
);
};

export default CustomersView;
