import React from 'react';
import { 
  ChevronRight, Search, Download, Eye, Plus, CheckCircle2, 
  MapPin, Save, Users, ShieldCheck, FileText, Clock, Wallet, 
  Coins, TrendingUp, Filter, AlertCircle, BarChart3, Building,
  Check, Settings as SettingsIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UsersRolesView = (props) => {
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
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Users & Roles</h1>
                  <p className="text-xs text-slate-500">Manage branch staff, roles and permissions</p>
                </div>
                <button
                  onClick={() => {
                    setEditingUser(null);
                    setShowAddUserModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus size={16} />
                  <span>+ Add User</span>
                </button>
              </div>

              {/* Sub tabs filter */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold">All Users</button>
                <button className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold">Branch Staff</button>
                <button className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs font-semibold">Role Management</button>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/60 border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-6 font-bold"># User ID</th>
                        <th className="py-3 px-4 font-bold">Name</th>
                        <th className="py-3 px-4 font-bold">Role / Title</th>
                        <th className="py-3 px-4 font-bold">Branch</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-6 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(usersList.length > 0 ? usersList : [
                        { id: 'USR001', name: 'Ravi Kumar', title: 'Branch Manager', branch: 'Vijayawada', status: 'Active' },
                        { id: 'USR002', name: 'Sita Reddy', title: 'Branch Staff', branch: 'Vijayawada', status: 'Active' },
                        { id: 'USR003', name: 'Anil Mehta', title: 'KYC Officer', branch: 'Vijayawada', status: 'Active' },
                        { id: 'USR004', name: 'Priya Sharma', title: 'Operations Executive', branch: 'Vijayawada', status: 'Active' },
                        { id: 'USR005', name: 'Karthik', title: 'Collections Executive', branch: 'Vijayawada', status: 'Inactive' }
                      ]).map((u) => (
                        <tr key={u.id || u._id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3.5 px-6 font-bold text-blue-600">{u.id || 'USR' + u._id?.slice(-3)}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">{u.name}</td>
                          <td className="py-3.5 px-4 text-slate-600">{u.title || u.role}</td>
                          <td className="py-3.5 px-4 text-slate-500">{u.branch || 'Vijayawada'}</td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {u.status || 'Active'}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-right">
                            <button 
                              onClick={() => {
                                setEditingUser(u);
                                setShowAddUserModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
                            >
                              Edit
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

export default UsersRolesView;
