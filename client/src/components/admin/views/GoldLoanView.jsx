import React from 'react';
import { 
  ChevronRight, Search, Download, Eye, Plus, CheckCircle2, 
  MapPin, Save, Users, ShieldCheck, FileText, Clock, Wallet, 
  Coins, TrendingUp, Filter, AlertCircle, BarChart3, Building,
  Check, Settings as SettingsIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GoldLoanView = (props) => {
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

  const [searchTerm, setSearchTerm] = React.useState('');
  const goldLoanApps = applications.filter(a => a.loanType === 'Gold Loan');
  const filteredGoldLoans = goldLoanApps.filter(a => {
    const q = searchTerm.toLowerCase();
    return !searchTerm ||
      (a.applicationId && a.applicationId.toLowerCase().includes(q)) ||
      (a.applicantName && a.applicantName.toLowerCase().includes(q)) ||
      (a.applicantMobile && a.applicantMobile.includes(q));
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Gold Loan Management</h1>
          <p className="text-xs text-slate-500">Live gold loan applications and approvals from database</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-amber-50 text-amber-700 rounded-xl border border-amber-200">
            Active Records: {filteredGoldLoans.length}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="relative w-72">
            <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by customer name, loan number..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <select 
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
          >
            <option value="All">All Branches</option>
            <option value="Vijayawada">Vijayawada</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-6 font-bold">Loan / Ref No.</th>
                <th className="py-3 px-4 font-bold">Customer Name</th>
                <th className="py-3 px-4 font-bold">Gold Weight</th>
                <th className="py-3 px-4 font-bold">Loan Amount</th>
                <th className="py-3 px-4 font-bold">Interest Rate</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredGoldLoans.map((item) => (
                <tr key={item.applicationId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-blue-600">#{item.applicationId}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    <p>{item.applicantName}</p>
                    <p className="text-[10px] text-slate-400">{item.applicantMobile}</p>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-amber-700">
                    {item.goldDetails?.weightGrams ? `${item.goldDetails.weightGrams} gms` : '-'}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    ₹{Number(item.amount).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-600 font-bold">
                    {item.interestRate ? `${item.interestRate}%` : '8.5%'}
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                  <td className="py-3.5 px-6 text-right">
                    <button 
                      onClick={() => setSelectedApplication(item)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] cursor-pointer"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredGoldLoans.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 text-xs">
                    No gold loan applications found in database.
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

export default GoldLoanView;
