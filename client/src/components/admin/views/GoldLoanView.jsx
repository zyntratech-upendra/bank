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

  return (
<div className="space-y-6">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Gold Loan Management</h1>
                <p className="text-xs text-slate-500">Manage gold loan applications and approvals</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="relative w-72">
                    <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by customer name, loan number..."
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none"
                    />
                  </div>
                  <select className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white">
                    <option>All Branches</option>
                    <option>Vijayawada</option>
                  </select>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/60 border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-6 font-bold">Loan No.</th>
                        <th className="py-3 px-4 font-bold">Customer Name</th>
                        <th className="py-3 px-4 font-bold">Gold Weight</th>
                        <th className="py-3 px-4 font-bold">Loan Amount</th>
                        <th className="py-3 px-4 font-bold">Interest Rate</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-6 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { loanNo: 'GL000123', name: 'Suresh Babu', weight: '50 gms', amount: '₹3,00,000', rate: '8.5%', status: 'Under Review' },
                        { loanNo: 'GL000124', name: 'Divya Nair', weight: '30 gms', amount: '₹2,00,000', rate: '8.5%', status: 'Approved' },
                        { loanNo: 'GL000125', name: 'Mohan Rao', weight: '80 gms', amount: '₹5,00,000', rate: '8.0%', status: 'Disbursed' },
                        { loanNo: 'GL000126', name: 'Lakshmi Devi', weight: '25 gms', amount: '₹1,50,000', rate: '8.5%', status: 'Document Pending' },
                        { loanNo: 'GL000127', name: 'Arjun Patel', weight: '60 gms', amount: '₹4,00,000', rate: '8.0%', status: 'Rejected' },
                      ].map((item) => (
                        <tr key={item.loanNo} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-6 font-bold text-blue-600">{item.loanNo}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">{item.name}</td>
                          <td className="py-3.5 px-4 font-semibold text-amber-700">{item.weight}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">{item.amount}</td>
                          <td className="py-3.5 px-4 text-emerald-600 font-bold">{item.rate}</td>
                          <td className="py-3.5 px-4">{getStatusBadge(item.status)}</td>
                          <td className="py-3.5 px-6 text-right">
                            <button 
                              onClick={() => {
                                const found = applications.find(a => a.applicantName === item.name) || applications[0];
                                setSelectedApplication(found);
                              }}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] cursor-pointer"
                            >
                              View
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

export default GoldLoanView;
