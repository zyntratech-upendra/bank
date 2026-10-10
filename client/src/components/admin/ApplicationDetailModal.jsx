import { useState, useEffect } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  UserCheck, 
  Clock, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Coins, 
  ShieldCheck, 
  FileText, 
  Check, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Send
} from 'lucide-react';
import api from '../../utils/api';

const ApplicationDetailModal = ({ application, onClose, onUpdate }) => {
  const [activeSubTab, setActiveSubTab] = useState('Documents');
  const [assignDropdown, setAssignDropdown] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [appData, setAppData] = useState(application);
  const [customer, setCustomer] = useState(null);
  
  const [sanctionForm, setSanctionForm] = useState({
    amount: application?.amount || 0,
    interestRate: application?.interestRate || 8.5,
    tenure: application?.loanTenure || 12,
    firstEmiDate: '',
    repaymentMode: 'Auto-Debit',
  });

  useEffect(() => {
    if (appData?.applicantEmail) {
      api.get('/admin/customers').then(res => {
        const match = res.data.find(c => (c.email || '').toLowerCase() === appData.applicantEmail.toLowerCase());
        if (match) setCustomer(match);
      }).catch(err => console.error("Error fetching customer", err));
    }
  }, [appData?.applicantEmail]);

  if (!appData) return null;

  const handleStatusChange = async (newStatus) => {
    try {
      setActionLoading(true);
      const res = await api.patch(`/admin/applications/${appData.applicationId}/status`, { status: newStatus });
      setAppData(res.data.application || { ...appData, status: newStatus });
      onUpdate && onUpdate(res.data.application || { ...appData, status: newStatus });
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssign = async (staffName) => {
    try {
      setActionLoading(true);
      const res = await api.patch(`/admin/applications/${appData.applicationId}/assign`, { assignedTo: staffName });
      setAppData(res.data.application || { ...appData, assignedTo: staffName });
      setAssignDropdown(false);
      onUpdate && onUpdate(res.data.application || { ...appData, assignedTo: staffName });
    } catch (err) {
      console.error('Failed to assign:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyDocument = async (docId) => {
    try {
      const res = await api.patch(`/admin/applications/${appData.applicationId}/documents/${docId}`, {
        status: 'Verified',
        remarks: 'Verified by Branch Manager'
      });
      setAppData(res.data.application || {
        ...appData,
        documents: appData.documents.map(d => d.id === docId ? { ...d, status: 'Verified', remarks: 'Verified by Branch Manager' } : d)
      });
      onUpdate && onUpdate(res.data.application);
    } catch (err) {
      console.error('Document verification error:', err);
    }
  };

  const docsCount = appData.documents?.length || (customer?.aadhaarDocUrl ? 3 : 4);
  const subTabs = [
    `Documents (${docsCount})`,
    'KYC Details',
    'Gold Details',
    'Bank Details',
    'Comments',
    'History',
    'Sanction'
  ];

  const handleDisburse = async () => {
    try {
      setActionLoading(true);
      const emi = (() => {
        const P = Number(sanctionForm.amount);
        const R = Number(sanctionForm.interestRate) / 12 / 100;
        const N = Number(sanctionForm.tenure);
        if (!P || !R || !N) return 0;
        return Math.round((P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1));
      })();

      const res = await api.post(`/admin/applications/${appData.applicationId}/disburse`, {
        ...sanctionForm,
        monthlyEmi: emi
      });
      setAppData(res.data.application);
      onUpdate && onUpdate(res.data.application);
      setActiveSubTab('History');
      alert(`Loan Sanctioned and Disbursed successfully! EMI: ₹${emi.toLocaleString('en-IN')}`);
    } catch (err) {
      console.error(err);
      alert('Error during disbursement.');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'KYC Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Under Review': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Document Pending': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Rejected': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Disbursed': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#f8fafc] w-full max-w-6xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header / Breadcrumb & Actions */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
              <span className="hover:text-blue-600 cursor-pointer" onClick={onClose}>Applications</span>
              <ChevronRight size={14} />
              <span className="text-[#0e274a] font-bold">#{appData.applicationId}</span>
            </div>
            
            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${getStatusColor(appData.status)}`}>
              {appData.status}
            </span>
          </div>

          {/* Action Buttons: Assign, Approve, Reject, Close */}
          <div className="flex items-center gap-2.5">
            {/* Assign Button & Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAssignDropdown(!assignDropdown)}
                disabled={actionLoading}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <UserCheck size={14} className="text-blue-600" />
                <span>Assign ({appData.assignedTo || 'Unassigned'})</span>
              </button>

              {assignDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-30 text-xs">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400">Assign to Officer</div>
                  {['Ravi Kumar', 'Anil Mehta', 'Sita Reddy', 'Priya Sharma'].map(officer => (
                    <button
                      key={officer}
                      onClick={() => handleAssign(officer)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium"
                    >
                      {officer}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Approve Button */}
            <button
              onClick={() => setActiveSubTab('Sanction')}
              disabled={appData.status === 'Disbursed'}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 size={15} />
              <span>Sanction</span>
            </button>

            {/* Reject Button */}
            <button
              onClick={() => handleStatusChange('Rejected')}
              disabled={actionLoading || appData.status === 'Rejected'}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <XCircle size={15} />
              <span>Reject</span>
            </button>

            {/* Close Modal */}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Top 3 Columns: Customer Info, Loan Details, Application Status Stepper */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Customer Information Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Customer Information
              </h3>
              
              <div className="flex items-center gap-3.5 mb-4 pb-4 border-b border-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
                  alt="Customer"
                  className="w-14 h-14 rounded-full object-cover border-2 border-slate-200"
                />
                <div>
                  <h4 className="text-base font-bold text-slate-800">{appData.applicantName}</h4>
                  <p className="text-xs text-slate-500 font-medium">{appData.applicantMobile}</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Email</span>
                  <span className="font-semibold text-slate-700">{appData.applicantEmail || 'sureshbabu@gmail.com'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Date of Birth</span>
                  <span className="font-semibold text-slate-700">{appData.dateOfBirth || '15 Jan 1988'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Address</span>
                  <span className="font-semibold text-slate-700">{appData.address || '12-3-45, MG Road, Vijayawada, AP'}</span>
                </div>
              </div>
            </div>

            {/* 2. Loan Details Card */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Loan Details
              </h3>

              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#c48722]">
                  <Coins size={22} />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block">Loan Type</span>
                  <span className="text-sm font-bold text-slate-800">{appData.loanType}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Loan Amount</span>
                  <span className="text-sm font-black text-[#0e274a]">₹{Number(appData.amount).toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Interest Rate</span>
                  <span className="text-sm font-bold text-emerald-600">{appData.interestRate || 8.5}% p.a.</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Loan Tenure</span>
                  <span className="font-semibold text-slate-700">{appData.loanTenure || 12} Months</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Purpose</span>
                  <span className="font-semibold text-slate-700">{appData.purpose || 'Personal'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Submitted On</span>
                  <span className="font-semibold text-slate-700">{appData.submittedOn}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Branch</span>
                  <span className="font-semibold text-slate-700">{appData.branch || 'Vijayawada'}</span>
                </div>
              </div>
            </div>

            {/* 3. Application Status Stepper */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Application Status
              </h3>

              <div className="space-y-4">
                {[
                  { title: 'Application Submitted', completed: true, active: false },
                  { title: 'KYC Verification', completed: appData.status === 'Approved' || appData.status === 'Disbursed', active: appData.status === 'KYC Pending' },
                  { title: 'Document Verification', completed: appData.status === 'Approved' || appData.status === 'Disbursed', active: appData.status === 'Document Pending' || appData.status === 'Under Review' },
                  { title: 'Loan Approval', completed: appData.status === 'Approved' || appData.status === 'Disbursed', active: false },
                  { title: 'Disbursement', completed: appData.status === 'Disbursed', active: appData.status === 'Approved' }
                ].map((step, idx) => (
                  <div key={step.title} className="flex items-start gap-3">
                    <div className="relative flex items-center justify-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        step.completed ? 'bg-emerald-500 text-white' : 
                        step.active ? 'bg-blue-600 text-white animate-pulse' : 
                        'border-2 border-slate-300 text-slate-400'
                      }`}>
                        {step.completed ? <Check size={12} /> : idx + 1}
                      </div>
                      {idx < 4 && (
                        <div className={`absolute top-5 w-0.5 h-4 ${step.completed ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-semibold leading-tight ${step.active ? 'text-blue-600 font-bold' : 'text-slate-700'}`}>
                        {step.title}
                      </p>
                      <span className="text-[10px] text-slate-400">
                        {step.completed ? 'Completed' : step.active ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sub Tabs Navigation */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="flex border-b border-slate-200 bg-slate-50/50 px-4 overflow-x-auto">
              {subTabs.map(tab => {
                const tabKey = tab.split(' ')[0];
                const isActive = activeSubTab === tabKey;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveSubTab(tabKey)}
                    className={`py-3.5 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                      isActive 
                        ? 'border-blue-600 text-blue-600 bg-white' 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Sub Tab Content */}
            <div className="p-5">
              
              {/* 1. Documents Tab */}
              {activeSubTab === 'Documents' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-2.5 font-bold">Document Type</th>
                        <th className="py-2.5 font-bold">File</th>
                        <th className="py-2.5 font-bold">Status</th>
                        <th className="py-2.5 font-bold">Remarks</th>
                        <th className="py-2.5 font-bold">Uploaded On</th>
                        <th className="py-2.5 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(() => {
                        let docs = appData.documents || [];
                        if (docs.length === 0) {
                          if (customer?.aadhaarDocUrl) {
                            docs = [
                              { id: 'aadhaar', type: 'Aadhaar Card', fileName: 'aadhaar.jpg', status: 'Uploaded', url: customer.aadhaarDocUrl },
                              { id: 'pan', type: 'PAN Card', fileName: 'pan.jpg', status: 'Uploaded', url: customer.panDocUrl },
                              { id: 'profile', type: 'Profile Pic', fileName: 'profile.jpg', status: 'Uploaded', url: customer.profilePicUrl }
                            ].filter(d => d.url);
                          } else {
                            docs = [
                              { id: '1', type: 'Aadhaar Card', fileName: 'suresh_aadhaar.pdf', status: 'Verified', remarks: '-', uploadedOn: '24 Sep 2026' },
                              { id: '2', type: 'PAN Card', fileName: 'suresh_pan.pdf', status: 'Verified', remarks: '-', uploadedOn: '24 Sep 2026' },
                              { id: '3', type: 'Address Proof', fileName: 'address_proof.pdf', status: 'Pending', remarks: 'Need clear copy', uploadedOn: '24 Sep 2026' },
                              { id: '4', type: 'Gold Invoice / Ornament Photo', fileName: 'gold_photo.jpg', status: 'Pending', remarks: 'Need better image', uploadedOn: '24 Sep 2026' }
                            ];
                          }
                        }
                        return docs;
                      })().map((doc) => (
                        <tr key={doc.id || doc.type} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-semibold text-slate-800">{doc.type}</td>
                          <td className="py-3">
                            <span className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                              {doc.fileName || `${doc.type.toLowerCase().replace(/\s+/g, '_')}.pdf`}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              doc.status === 'Verified' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {doc.status}
                            </span>
                          </td>
                          <td className="py-3 text-slate-500">{doc.remarks || '-'}</td>
                          <td className="py-3 text-slate-500">{doc.uploadedOn || '24 Sep 2026'}</td>
                          <td className="py-3 text-right space-x-2">
                            {doc.status !== 'Verified' && (
                              <button
                                onClick={() => handleVerifyDocument(doc.id || doc.type)}
                                className="px-2.5 py-1 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs cursor-pointer"
                              >
                                Verify
                              </button>
                            )}
                            <button 
                              onClick={() => doc.url ? window.open(doc.url, '_blank') : null}
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 2. KYC Details Tab */}
              {activeSubTab === 'KYC' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-2">UIDAI Aadhaar Verification</h4>
                    <p className="text-slate-500 mb-1">Aadhaar Number: <span className="font-bold text-slate-700">XXXX XXXX 8912</span></p>
                    <p className="text-slate-500 mb-2">Verification Mode: <span className="text-emerald-600 font-bold">Biometric OTP Verified</span></p>
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">Passed</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-2">Income Tax PAN Verification</h4>
                    <p className="text-slate-500 mb-1">PAN Number: <span className="font-bold text-slate-700">ABCDE1234F</span></p>
                    <p className="text-slate-500 mb-2">Name on PAN: <span className="font-bold text-slate-700">SURESH BABU</span></p>
                    <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold">Name Matched 100%</span>
                  </div>
                </div>
              )}

              {/* 3. Gold Details Tab */}
              {activeSubTab === 'Gold' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
                    <span className="text-slate-500 text-[11px]">Ornament Type</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">{appData.goldDetails?.ornamentType || 'Gold Bangles & Chain'}</p>
                  </div>
                  <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
                    <span className="text-slate-500 text-[11px]">Gross Weight</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">{appData.goldDetails?.weightGrams || 50} Grams</p>
                  </div>
                  <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
                    <span className="text-slate-500 text-[11px]">Assayed Carat</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">{appData.goldDetails?.carat || 22} Karat (91.6%)</p>
                  </div>
                  <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl">
                    <span className="text-slate-500 text-[11px]">Assessed Market Value</span>
                    <p className="font-bold text-emerald-700 text-sm mt-0.5">₹{Number(appData.goldDetails?.estimatedValue || 350000).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              )}

              {/* 4. Bank Details Tab */}
              {activeSubTab === 'Bank' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[11px]">Bank Name</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">{appData.bankDetails?.bankName || 'State Bank of India'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[11px]">Account Number</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">{appData.bankDetails?.accountNumber || 'XXXXXX1234'}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-slate-400 text-[11px]">IFSC Code</span>
                    <p className="font-bold text-slate-800 text-sm mt-0.5">{appData.bankDetails?.ifsc || 'SBIN0001234'}</p>
                  </div>
                </div>
              )}

              {/* 5. Comments Tab */}
              {activeSubTab === 'Comments' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    {(appData.comments?.length > 0 ? appData.comments : [
                      { author: 'Ravi Kumar', role: 'Branch Manager', text: 'Customer visited branch. Physical verification pending for jewelry.', date: '24 Sep 2026, 11:00 AM' }
                    ]).map((c, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-800">{c.author} <span className="text-slate-400 font-normal">({c.role})</span></span>
                          <span className="text-[10px] text-slate-400">{c.date}</span>
                        </div>
                        <p className="text-slate-600">{c.text}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an internal note or remark..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      onClick={() => {
                        if (!newComment.trim()) return;
                        setAppData({
                          ...appData,
                          comments: [...(appData.comments || []), { author: 'Ravi Kumar', role: 'Branch Manager', text: newComment, date: 'Just now' }]
                        });
                        setNewComment('');
                      }}
                      className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                    >
                      <Send size={12} />
                      <span>Post</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 6. History Tab */}
              {activeSubTab === 'History' && (
                <div className="space-y-2 text-xs">
                  {(appData.history || [
                    { action: 'Application Submitted', by: 'Suresh Babu', date: '24 Sep 2026, 10:30 AM' },
                    { action: 'Assigned to Ravi Kumar', by: 'System', date: '24 Sep 2026, 10:32 AM' },
                    { action: 'Aadhaar & PAN Verified', by: 'Anil Mehta', date: '24 Sep 2026, 11:15 AM' }
                  ]).map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <div>
                        <span className="font-bold text-slate-800">{h.action}</span>
                        <span className="text-slate-400 ml-2">by {h.by}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{h.date}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 7. Sanction & Disburse Tab */}
              {activeSubTab === 'Sanction' && (
                <div className="space-y-6 text-xs max-w-2xl">
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
                    <h4 className="font-bold text-blue-800 text-sm mb-1">Sanction Terms & Disbursement</h4>
                    <p className="text-blue-600">Review and finalize the loan terms before disbursing funds to the customer's account.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-slate-500 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Approved Amount (₹)</label>
                      <input 
                        type="number" 
                        value={sanctionForm.amount}
                        onChange={e => setSanctionForm({...sanctionForm, amount: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Interest Rate (% p.a.)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        value={sanctionForm.interestRate}
                        onChange={e => setSanctionForm({...sanctionForm, interestRate: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1.5 uppercase tracking-wider text-[10px]">Tenure (Months)</label>
                      <input 
                        type="number" 
                        value={sanctionForm.tenure}
                        onChange={e => setSanctionForm({...sanctionForm, tenure: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-bold text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 font-bold mb-1.5 uppercase tracking-wider text-[10px]">First EMI Date</label>
                      <input 
                        type="date" 
                        value={sanctionForm.firstEmiDate}
                        onChange={e => setSanctionForm({...sanctionForm, firstEmiDate: e.target.value})}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all font-bold text-slate-800"
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="block text-emerald-800 font-bold mb-0.5">Calculated Monthly EMI</span>
                      <span className="text-[10px] text-emerald-600">Based on flat rate reducing balance</span>
                    </div>
                    <span className="text-2xl font-black text-emerald-700">₹{
                      (() => {
                         const P = Number(sanctionForm.amount);
                         const R = Number(sanctionForm.interestRate) / 12 / 100;
                         const N = Number(sanctionForm.tenure);
                         if (!P || !R || !N) return 0;
                         const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
                         return Math.round(emi).toLocaleString('en-IN');
                      })()
                    }</span>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => handleStatusChange('Approved')}
                      disabled={actionLoading || appData.status === 'Approved' || appData.status === 'Disbursed'}
                      className="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-xl transition-colors disabled:opacity-50"
                    >
                      Only Approve
                    </button>
                    <button 
                      onClick={handleDisburse}
                      disabled={actionLoading || appData.status === 'Disbursed' || !sanctionForm.firstEmiDate}
                      className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-md hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Send size={14} />
                      Approve & Disburse
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ApplicationDetailModal;
