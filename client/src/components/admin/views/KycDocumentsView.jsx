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

  // Build KYC list from customers and loan applications in database
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedDocType, setSelectedDocType] = React.useState('All');

  // 1. Gather all documents from real database records (Customers + Loan Applications)
  const realKycItems = [];

  // From customers collection in DB
  (customersList || []).forEach(cust => {
    if (cust.aadhaarNumber || cust.aadhaarDocUrl) {
      realKycItems.push({
        id: cust._id || cust.id,
        cid: `CUST-${(cust._id || cust.id || '').toString().slice(-6).toUpperCase()}`,
        name: cust.name || 'Unknown Customer',
        phone: cust.phone || cust.email || 'N/A',
        email: cust.email,
        docType: 'Aadhaar Card',
        docNumber: cust.aadhaarNumber || 'Attached',
        docUrl: cust.aadhaarDocUrl,
        status: cust.aadhaarDocUrl ? 'Verified' : 'Pending',
        uploadedOn: cust.createdAt ? new Date(cust.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently',
        rawCustomer: cust
      });
    }
    if (cust.panNumber || cust.panDocUrl) {
      realKycItems.push({
        id: cust._id || cust.id,
        cid: `CUST-${(cust._id || cust.id || '').toString().slice(-6).toUpperCase()}`,
        name: cust.name || 'Unknown Customer',
        phone: cust.phone || cust.email || 'N/A',
        email: cust.email,
        docType: 'PAN Card',
        docNumber: cust.panNumber || 'Attached',
        docUrl: cust.panDocUrl,
        status: cust.panDocUrl ? 'Verified' : 'Pending',
        uploadedOn: cust.createdAt ? new Date(cust.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently',
        rawCustomer: cust
      });
    }
    // Also include customer if they have no specific doc uploaded yet
    if (!cust.aadhaarNumber && !cust.aadhaarDocUrl && !cust.panNumber && !cust.panDocUrl) {
      realKycItems.push({
        id: cust._id || cust.id,
        cid: `CUST-${(cust._id || cust.id || '').toString().slice(-6).toUpperCase()}`,
        name: cust.name || 'Unknown Customer',
        phone: cust.phone || cust.email || 'N/A',
        email: cust.email,
        docType: 'KYC Profile',
        docNumber: 'Pending Upload',
        docUrl: null,
        status: 'Pending',
        uploadedOn: cust.createdAt ? new Date(cust.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently',
        rawCustomer: cust
      });
    }
  });

  // From loan applications in DB
  (applications || []).forEach(app => {
    if (Array.isArray(app.documents) && app.documents.length > 0) {
      app.documents.forEach((d, idx) => {
        realKycItems.push({
          id: `${app.applicationId}-${idx}`,
          cid: `#${app.applicationId}`,
          name: app.applicantName,
          phone: app.applicantMobile || 'N/A',
          email: app.applicantEmail,
          docType: d.type || 'Identification Document',
          docNumber: d.fileName || app.loanType,
          docUrl: d.fileUrl,
          status: d.status || (app.status === 'Approved' ? 'Verified' : 'Pending'),
          uploadedOn: d.uploadedOn || app.submittedOn || 'Recently',
          rawApplication: app
        });
      });
    } else {
      realKycItems.push({
        id: app.applicationId,
        cid: `#${app.applicationId}`,
        name: app.applicantName,
        phone: app.applicantMobile || 'N/A',
        email: app.applicantEmail,
        docType: `${app.loanType} KYC`,
        docNumber: app.applicationId,
        docUrl: null,
        status: app.status === 'Approved' ? 'Verified' : 'Pending',
        uploadedOn: app.submittedOn || 'Recently',
        rawApplication: app
      });
    }
  });

  const filteredItems = realKycItems.filter(item => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      (item.cid && item.cid.toLowerCase().includes(q)) ||
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.phone && item.phone.toLowerCase().includes(q)) ||
      (item.docType && item.docType.toLowerCase().includes(q));

    const matchesType = selectedDocType === 'All' || item.docType.toLowerCase().includes(selectedDocType.toLowerCase());
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">KYC Verification</h1>
          <p className="text-xs text-slate-500">Live customer identity & KYC records from database</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-200">
            Total Records: {filteredItems.length}
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
              placeholder="Search by customer name, mobile or ID..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white focus:outline-none"
            >
              <option value="All">All Documents</option>
              <option value="Aadhaar">Aadhaar Card</option>
              <option value="PAN">PAN Card</option>
              <option value="KYC">Loan KYC</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-6 font-bold"># Customer / Ref ID</th>
                <th className="py-3 px-4 font-bold">Customer Name</th>
                <th className="py-3 px-4 font-bold">Contact</th>
                <th className="py-3 px-4 font-bold">Document Type</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold">Registered / Uploaded</th>
                <th className="py-3 px-6 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item, index) => (
                <tr key={`${item.id}-${index}`} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-6 font-bold text-blue-600">{item.cid}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{item.name}</td>
                  <td className="py-3 px-4 text-slate-500">{item.phone}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {item.docType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      item.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{item.uploadedOn}</td>
                  <td className="py-3 px-6 text-right space-x-2">
                    {item.rawCustomer && (
                      <button 
                        onClick={() => {
                          if (setSelectedCustomer && setShowCustomerModal) {
                            setSelectedCustomer(item.rawCustomer);
                            setShowCustomerModal(true);
                          } else {
                            showToast(`Viewing KYC profile for ${item.name}`);
                          }
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
                      >
                        View Details
                      </button>
                    )}
                    {item.rawApplication && (
                      <button 
                        onClick={() => {
                          if (setSelectedApplication) {
                            setSelectedApplication(item.rawApplication);
                          } else {
                            showToast(`Viewing application for ${item.name}`);
                          }
                        }}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] cursor-pointer transition-colors"
                      >
                        Review Application
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 text-xs">
                    No customer KYC records found in the database.
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

export default KycDocumentsView;
