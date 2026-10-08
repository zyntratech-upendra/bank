import React from 'react';
import { 
  ChevronRight, Search, Download, Eye, Plus, CheckCircle2, 
  MapPin, Save, Users, ShieldCheck, FileText, Clock, Wallet, 
  Coins, TrendingUp, Filter, AlertCircle, BarChart3, Building,
  Check, Settings as SettingsIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const KycDocumentsView = (props) => {
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
                <h1 className="text-xl font-bold text-slate-900">KYC Verification</h1>
                <p className="text-xs text-slate-500">Verify customer identity and documents</p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="relative w-72">
                    <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name or application ID..."
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
                        <th className="py-3 px-6 font-bold"># Customer ID</th>
                        <th className="py-3 px-4 font-bold">Name</th>
                        <th className="py-3 px-4 font-bold">Mobile</th>
                        <th className="py-3 px-4 font-bold">Document Type</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold">Uploaded On</th>
                        <th className="py-3 px-6 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { cid: 'KYC00123', name: 'Suresh Babu', phone: '+91 98765 43210', doc: 'Aadhaar Card', status: 'Verified', date: '24 Sep 2026' },
                        { cid: 'KYC00124', name: 'Divya Nair', phone: '+91 91234 56789', doc: 'PAN Card', status: 'Pending', date: '24 Sep 2026' },
                        { cid: 'KYC00125', name: 'Mohan Rao', phone: '+91 98765 44556', doc: 'Address Proof', status: 'Verified', date: '24 Sep 2026' },
                        { cid: 'KYC00126', name: 'Lakshmi Devi', phone: '+91 90123 44556', doc: 'Bank Statement', status: 'Verified', date: '23 Sep 2026' },
                        { cid: 'KYC00127', name: 'Arjun Patel', phone: '+91 98765 22534', doc: 'Selfie / Photo', status: 'Verified', date: '22 Sep 2026' }
                      ].map((item) => (
                        <tr key={item.cid} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-6 font-bold text-blue-600">{item.cid}</td>
                          <td className="py-3 px-4 font-semibold text-slate-800">{item.name}</td>
                          <td className="py-3 px-4 text-slate-500">{item.phone}</td>
                          <td className="py-3 px-4 text-slate-700 font-medium">{item.doc}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              item.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500">{item.date}</td>
                          <td className="py-3 px-6 text-right space-x-2">
                            {item.status === 'Pending' ? (
                              <button 
                                onClick={() => showToast(`KYC for ${item.name} verified!`)}
                                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] cursor-pointer"
                              >
                                Verify
                              </button>
                            ) : (
                              <button 
                                onClick={() => showToast(`Opening document for ${item.name}`)}
                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg font-bold text-[11px] cursor-pointer"
                              >
                                View
                              </button>
                            )}
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

export default KycDocumentsView;
