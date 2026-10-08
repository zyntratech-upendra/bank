import React from 'react';
import { 
  ChevronRight, Search, Download, Eye, Plus, CheckCircle2, 
  MapPin, Save, Users, ShieldCheck, FileText, Clock, Wallet, 
  Coins, TrendingUp, Filter, AlertCircle, BarChart3, Building,
  Check, Settings as SettingsIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsView = (props) => {
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
                <h1 className="text-xl font-bold text-slate-900">Interest Rates & Charges</h1>
                <p className="text-xs text-slate-500">Manage interest rates, processing charges and other settings</p>
              </div>

              {/* Loan Type Tabs */}
              <div className="flex border-b border-slate-200 overflow-x-auto gap-2">
                {['Gold Loan', 'Loan Transfer', 'One Lending', 'Personal Loan', 'Business Loan'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveSettingsTab(tab)}
                    className={`py-2 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
                      activeSettingsTab === tab 
                        ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg' 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Settings Fields */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
                  <h3 className="font-bold text-slate-800 text-sm pb-2 border-b border-slate-100">
                    {activeSettingsTab} Settings
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Interest Rate (p.a.) *</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          value={currentSettingForm.interestRate}
                          onChange={(e) => setCurrentSettingForm({ ...currentSettingForm, interestRate: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
                        />
                        <span className="absolute right-3 top-2.5 text-slate-400 font-bold">%</span>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Processing Fee (%)</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          value={currentSettingForm.processingFee}
                          onChange={(e) => setCurrentSettingForm({ ...currentSettingForm, processingFee: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none"
                        />
                        <span className="absolute right-3 top-2.5 text-slate-400 font-bold">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Minimum Loan Amount</label>
                      <input
                        type="text"
                        value={`₹ ${currentSettingForm.minAmount?.toLocaleString('en-IN')}`}
                        onChange={(e) => setCurrentSettingForm({ ...currentSettingForm, minAmount: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Maximum Loan Amount</label>
                      <input
                        type="text"
                        value={`₹ ${currentSettingForm.maxAmount?.toLocaleString('en-IN')}`}
                        onChange={(e) => setCurrentSettingForm({ ...currentSettingForm, maxAmount: parseInt(e.target.value.replace(/\D/g, '')) || 0 })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Loan Tenure (Months)</label>
                      <input
                        type="text"
                        value={currentSettingForm.tenure}
                        onChange={(e) => setCurrentSettingForm({ ...currentSettingForm, tenure: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Prepayment Charges (%)</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          value={currentSettingForm.prepaymentCharges}
                          onChange={(e) => setCurrentSettingForm({ ...currentSettingForm, prepaymentCharges: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none"
                        />
                        <span className="absolute right-3 top-2.5 text-slate-400 font-bold">%</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <Save size={15} />
                      <span>Save Changes</span>
                    </button>
                  </div>

                </div>

                {/* Additional Charges Checkboxes */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4 h-fit">
                  <h3 className="font-bold text-slate-800 text-sm pb-2 border-b border-slate-100">
                    Additional Charges
                  </h3>

                  <div className="space-y-3 text-xs">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentSettingForm.enableLatePayment}
                        onChange={(e) => setCurrentSettingForm({ ...currentSettingForm, enableLatePayment: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="font-semibold text-slate-700">Enable late payment charges</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentSettingForm.enableGoldStorage}
                        onChange={(e) => setCurrentSettingForm({ ...currentSettingForm, enableGoldStorage: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="font-semibold text-slate-700">Enable gold storage charges</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentSettingForm.enableInsurance}
                        onChange={(e) => setCurrentSettingForm({ ...currentSettingForm, enableInsurance: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="font-semibold text-slate-700">Enable insurance charges</span>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentSettingForm.enableGst}
                        onChange={(e) => setCurrentSettingForm({ ...currentSettingForm, enableGst: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="font-semibold text-slate-700">Enable GST</span>
                    </label>
                  </div>
                </div>

              </div>

            </div>
);
};

export default SettingsView;
