import React from 'react';
import { 
  ChevronRight, Search, Download, Eye, Plus, CheckCircle2, 
  MapPin, Save, Users, ShieldCheck, FileText, Clock, Wallet, 
  Coins, TrendingUp, Filter, AlertCircle, BarChart3, Building,
  Check, Settings as SettingsIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DisbursementsView = (props) => {
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
              <div>
                <h1 className="text-xl font-bold text-slate-900">Disbursement Details</h1>
                <p className="text-xs text-slate-500">Configure parameters and process loan payout</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Form (2 cols) */}
                <form onSubmit={handleDisburseLoanSubmit} className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Disbursement Amount *</label>
                      <input
                        type="text"
                        value={disbursementForm.amount}
                        onChange={(e) => setDisbursementForm({ ...disbursementForm, amount: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Disbursement Date</label>
                      <input
                        type="text"
                        value={disbursementForm.disbursementDate}
                        onChange={(e) => setDisbursementForm({ ...disbursementForm, disbursementDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Interest Rate</label>
                      <input
                        type="text"
                        value={disbursementForm.interestRate}
                        onChange={(e) => setDisbursementForm({ ...disbursementForm, interestRate: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Loan Tenure</label>
                      <input
                        type="text"
                        value={disbursementForm.tenure}
                        onChange={(e) => setDisbursementForm({ ...disbursementForm, tenure: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Repayment Mode</label>
                      <input
                        type="text"
                        value={disbursementForm.repaymentMode}
                        onChange={(e) => setDisbursementForm({ ...disbursementForm, repaymentMode: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">First EMI Date</label>
                      <input
                        type="text"
                        value={disbursementForm.firstEmiDate}
                        onChange={(e) => setDisbursementForm({ ...disbursementForm, firstEmiDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bank Account</label>
                    <input
                      type="text"
                      value={disbursementForm.bankAccount}
                      onChange={(e) => setDisbursementForm({ ...disbursementForm, bankAccount: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Remarks</label>
                    <textarea
                      rows={2}
                      value={disbursementForm.remarks}
                      onChange={(e) => setDisbursementForm({ ...disbursementForm, remarks: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>

                  {/* Verification checkbox */}
                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={disbursementForm.verifiedCheckbox}
                        onChange={(e) => setDisbursementForm({ ...disbursementForm, verifiedCheckbox: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="font-semibold text-slate-700">
                        I have verified all documents and approve disbursement
                      </span>
                    </label>
                  </div>

                  {/* Buttons */}
                  <div className="pt-4 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab('dashboard')}
                      className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      Disburse Loan
                    </button>
                  </div>

                </form>

                {/* Loan Summary Card (1 col) */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs h-fit space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                    Loan Summary
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Loan Type</span>
                      <span className="font-bold text-slate-800">{disbursementForm.loanType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Customer</span>
                      <span className="font-bold text-slate-800">{disbursementForm.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Loan Amount</span>
                      <span className="font-black text-blue-700">₹{disbursementForm.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Interest Rate</span>
                      <span className="font-bold text-emerald-600">{disbursementForm.interestRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tenure</span>
                      <span className="font-semibold text-slate-800">{disbursementForm.tenure}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-slate-100">
                      <span className="text-slate-500 font-bold">EMI Amount</span>
                      <span className="font-black text-slate-900">₹{disbursementForm.emiAmount} (Approx)</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
);
};

export default DisbursementsView;
