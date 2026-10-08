import React from 'react';
import { 
  ChevronRight, Search, Download, Eye, Plus, CheckCircle2, 
  MapPin, Save, Users, ShieldCheck, FileText, Clock, Wallet, 
  Coins, TrendingUp, Filter, AlertCircle, BarChart3, Building,
  Check, Settings as SettingsIcon, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const KycDocumentsView2 = (props) => {
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
            const pendingKycApps = applications.filter(app => app.status.includes('Pending') || app.status.includes('Review'));
            
            return (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">KYC & Document Verification</h1>
                    <p className="text-xs text-slate-500">Review and approve customer KYC documents.</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Application</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Applicant</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pendingKycApps.map((app, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-bold text-blue-600 text-sm">#{app.applicationId}</span>
                              <p className="text-[10px] text-slate-500">{app.submittedOn}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="text-sm font-bold text-slate-800">{app.applicantName}</p>
                              <p className="text-xs text-slate-500">{app.applicantMobile}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold border border-amber-200">
                                {app.loanType}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2.5 py-1 bg-orange-50 text-orange-700 rounded-lg text-xs font-bold border border-orange-200">
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button 
                                onClick={() => setSelectedApplication(app)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                              >
                                Review Documents
                              </button>
                            </td>
                          </tr>
                        ))}
                        {pendingKycApps.length === 0 && (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-xs">
                              No applications pending KYC verification.
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

export default KycDocumentsView2;
