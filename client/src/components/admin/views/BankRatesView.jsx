import React from 'react';
import { 
  ChevronRight, Search, Download, Eye, Plus, CheckCircle2, 
  MapPin, Save, Users, ShieldCheck, FileText, Clock, Wallet, 
  Coins, TrendingUp, Filter, AlertCircle, BarChart3, Building,
  Check, Settings as SettingsIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../utils/api';

const BankRatesView = (props) => {
  const {
    adminUser, stats, selectedBranch, setSelectedBranch,
    applications, filteredApplications, getStatusBadge,
    setActiveTab, setSelectedApplication, showToast,
    customersList, customersPage, setCustomersPage, customersPerPage,
    setSelectedCustomer, setShowCustomerModal,
    disbursementForm, setDisbursementForm, handleDisburseLoanSubmit,
    usersList, setEditingUser, setShowAddUserModal,
    activeSettingsTab, setActiveSettingsTab, currentSettingForm, setCurrentSettingForm, handleSaveSettings,
    locationsList, setEditingLocation, setShowLocationModal, handleRemoveLocation,
    bankRatesList, bankRatesPage, setBankRatesPage, bankRatesPerPage, setEditingBankRate, setShowBankRateModal, setBankRatesList
  } = props;

  return (
() => {
            const totalPages = Math.ceil(bankRatesList.length / bankRatesPerPage);
            const paginatedRates = bankRatesList.slice((bankRatesPage - 1) * bankRatesPerPage, bankRatesPage * bankRatesPerPage);

            return (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 drop-shadow-sm">Bank Gold Rates</h1>
                    <p className="text-xs text-slate-500 mt-1">Manage gold loan rates across different banks and cities.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { setEditingBankRate(null); setShowBankRateModal(true); }}
                      className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/30 transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Coins size={16} />
                      Bank Gold Loan Rate
                    </button>
                  </div>
                </div>
                
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
                  {/* Decorative glassmorphism glow */}
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/40 border-b border-slate-200/60 text-slate-500 uppercase text-[10px] tracking-widest font-bold">
                          <th className="py-4 px-6">City</th>
                          <th className="py-4 px-4">Bank & Branch</th>
                          <th className="py-4 px-4">Gold Loan Rate Per Gram</th>
                          <th className="py-4 px-4 hidden sm:table-cell">Interest Rate</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/60">
                        {paginatedRates.map((rate, i) => (
                          <tr key={i} className="hover:bg-white/60 transition-all duration-300 group">
                            <td className="py-4 px-6 font-bold text-slate-800 flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                <MapPin size={14} />
                              </div>
                              {rate.cityName}
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-bold text-slate-800">{rate.bankName}</span>
                              <span className="block text-[10px] text-slate-500 font-medium">{rate.branchName}</span>
                            </td>
                            <td className="py-4 px-4 font-black text-blue-600 text-sm">
                              ₹{rate.goldRatePerGram.toLocaleString('en-IN')}
                            </td>
                            <td className="py-4 px-4 font-bold text-emerald-600 hidden sm:table-cell">
                              <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg">
                                {rate.interestRate}% <span className="opacity-70 text-[10px]">p.a.</span>
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => { setEditingBankRate(rate); setShowBankRateModal(true); }}
                                  className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold transition-colors cursor-pointer"
                                  title="Edit"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                                </button>
                                <button 
                                  onClick={async () => {
                                    if (window.confirm('Delete this bank rate?')) {
                                      try {
                                        await api.delete(`/admin/bank-rates/${rate._id || rate.id}`);
                                        setBankRatesList(prev => prev.filter(r => (r._id || r.id) !== (rate._id || rate.id)));
                                        showToast('Bank rate deleted successfully!');
                                      } catch (err) {
                                        console.error(err);
                                        showToast('Error deleting bank rate.');
                                      }
                                    }
                                  }}
                                  className="p-1.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-lg font-bold transition-colors cursor-pointer"
                                  title="Delete"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {bankRatesList.length === 0 && (
                          <tr>
                            <td colSpan="5" className="px-6 py-16 text-center">
                              <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300 shadow-inner">
                                  <Coins size={32} />
                                </div>
                                <h3 className="text-slate-700 font-bold mb-1">No Bank Rates Found</h3>
                                <p className="text-slate-400 text-xs">Click the button above to add your first rate.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Glassmorphic Pagination */}
                  {totalPages > 1 && (
                    <div className="border-t border-slate-200/60 p-4 flex items-center justify-between bg-white/40">
                      <p className="text-xs text-slate-500 font-medium">
                        Showing <span className="font-bold text-slate-800">{(bankRatesPage - 1) * bankRatesPerPage + 1}</span> to <span className="font-bold text-slate-800">{Math.min(bankRatesPage * bankRatesPerPage, bankRatesList.length)}</span> of <span className="font-bold text-slate-800">{bankRatesList.length}</span> entries
                      </p>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setBankRatesPage(p => Math.max(1, p - 1))}
                          disabled={bankRatesPage === 1}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setBankRatesPage(i + 1)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              bankRatesPage === i + 1 
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button 
                          onClick={() => setBankRatesPage(p => Math.min(totalPages, p + 1))}
                          disabled={bankRatesPage === totalPages}
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

export default BankRatesView;
