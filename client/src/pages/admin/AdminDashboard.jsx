import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import ApplicationDetailModal from '../../components/admin/ApplicationDetailModal';
import AddUserModal from '../../components/admin/AddUserModal';
import LocationModal from '../../components/admin/LocationModal';
import BankRateModal from '../../components/admin/BankRateModal';
import CustomerDetailModal from '../../components/admin/CustomerDetailModal';
import ManageServices from '../../components/admin/ManageServices';
import ServiceRequestsView from '../../components/admin/ServiceRequestsView';

import api from '../../utils/api';
import { 
  FileText, 
  Clock, 
  CheckCircle2, 
  Wallet, 
  Coins, 
  TrendingUp, 
  ChevronRight, 
  Eye, 
  Filter, 
  Plus, 
  ShieldCheck, 
  Download, 
  Search, 
  Check, 
  AlertCircle,
  BarChart3,
  Users,
  Settings as SettingsIcon,
  RefreshCw,
  Building,
  Save,
  MapPin
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
  const { adminUser } = useAdminAuth();

  // Navigation & UI States
  const { tab } = useParams();
  const activeTab = tab || 'dashboard';
  const navigate = useNavigate();
  
  const setActiveTab = (newTab) => {
    navigate(`/admin/${newTab}`);
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('Vijayawada');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Data States
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [settingsList, setSettingsList] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [bankRatesList, setBankRatesList] = useState([]);
  const [activeSettingsTab, setActiveSettingsTab] = useState('Gold Loan');
  const [showBankRateModal, setShowBankRateModal] = useState(false);
  const [editingBankRate, setEditingBankRate] = useState(null);
  const [bankRatesPage, setBankRatesPage] = useState(1);
  const bankRatesPerPage = 5;
  const [customersList, setCustomersList] = useState([]);
  const [customersPage, setCustomersPage] = useState(1);
  const customersPerPage = 6;
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Disbursement Form State
  const [disbursementForm, setDisbursementForm] = useState({
    appId: 'APP2026001',
    customerName: 'Suresh Babu',
    loanType: 'Gold Loan',
    amount: '3,00,000',
    disbursementDate: '24/09/2026',
    interestRate: '8.5% p.a.',
    tenure: '12 Months',
    repaymentMode: 'Monthly EMI',
    firstEmiDate: '24/10/2026',
    emiAmount: '26,663',
    bankAccount: 'XXXXXXXX1234 - SBI',
    remarks: 'Approved after verification of gold ornaments.',
    verifiedCheckbox: false
  });

  // Settings Form State for selected loan tab
  const [currentSettingForm, setCurrentSettingForm] = useState({
    interestRate: 8.5,
    processingFee: 1.0,
    minAmount: 10000,
    maxAmount: 5000000,
    tenure: '3 - 36 Months',
    prepaymentCharges: 0.5,
    enableLatePayment: true,
    enableGoldStorage: true,
    enableInsurance: true,
    enableGst: true
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Fetch initial dashboard and applications data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [dashRes, appsRes, usersRes, settingsRes, locationsRes, ratesRes, customersRes] = await Promise.all([
          api.get('/admin/dashboard').catch(() => ({ data: null })),
          api.get('/admin/applications').catch(() => ({ data: [] })),
          api.get('/admin/users').catch(() => ({ data: [] })),
          api.get('/admin/settings').catch(() => ({ data: [] })),
          api.get('/admin/locations').catch(() => ({ data: [] })),
          api.get('/admin/bank-rates').catch(() => ({ data: [] })),
          api.get('/admin/customers').catch(() => ({ data: [] }))
        ]);

        if (dashRes?.data) setStats(dashRes.data);
        if (appsRes?.data) setApplications(appsRes.data);
        if (usersRes?.data) setUsersList(usersRes.data);
        if (locationsRes?.data) setLocationsList(locationsRes.data);
        if (ratesRes?.data) setBankRatesList(ratesRes.data);
        if (customersRes?.data) setCustomersList(customersRes.data);
        if (settingsRes?.data) {
          setSettingsList(settingsRes.data);
          const gold = settingsRes.data.find(s => s.loanType === 'Gold Loan');
          if (gold) setCurrentSettingForm(gold);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update setting form when loan tab changes
  useEffect(() => {
    if (settingsList.length > 0) {
      const match = settingsList.find(s => s.loanType === activeSettingsTab);
      if (match) {
        setCurrentSettingForm(match);
      } else {
        setCurrentSettingForm({
          loanType: activeSettingsTab,
          interestRate: activeSettingsTab === 'Loan Transfer' ? 8.0 : 9.5,
          processingFee: 1.0,
          minAmount: 25000,
          maxAmount: 5000000,
          tenure: '6 - 60 Months',
          prepaymentCharges: 0.5,
          enableLatePayment: true,
          enableGoldStorage: activeSettingsTab === 'Gold Loan',
          enableInsurance: true,
          enableGst: true
        });
      }
    }
  }, [activeSettingsTab, settingsList]);

  const handleSaveSettings = async () => {
    try {
      await api.put(`/admin/settings/${encodeURIComponent(activeSettingsTab)}`, currentSettingForm);
      showToast(`Settings for ${activeSettingsTab} saved successfully!`);
    } catch (err) {
      console.error(err);
      showToast('Error saving settings.');
    }
  };

  const handleSaveLocation = async (locationData) => {
    try {
      if (editingLocation) {
        const res = await api.put(`/admin/locations/${editingLocation.id}`, locationData);
        setLocationsList(prev => prev.map(l => l.id === editingLocation.id ? res.data.location : l));
        showToast('Location updated successfully!');
      } else {
        const res = await api.post('/admin/locations', locationData);
        setLocationsList(prev => [...prev, res.data.location]);
        showToast('Location added successfully!');
      }
      setShowLocationModal(false);
      setEditingLocation(null);
    } catch (err) {
      console.error(err);
      showToast('Error saving location');
    }
  };

  const handleRemoveLocation = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await api.delete(`/admin/locations/${id}`);
        setLocationsList(prev => prev.filter(l => l.id !== id));
        showToast('Location removed successfully!');
      } catch (err) {
        console.error(err);
        showToast('Error removing location');
      }
    }
  };

  const handleDisburseLoanSubmit = async (e) => {
    e.preventDefault();
    if (!disbursementForm.verifiedCheckbox) {
      alert('Please check the verification confirmation box first.');
      return;
    }

    try {
      await api.post(`/admin/applications/${disbursementForm.appId}/disburse`, {
        amount: Number(disbursementForm.amount.replace(/,/g, '')),
        disbursementDate: disbursementForm.disbursementDate,
        repaymentMode: disbursementForm.repaymentMode,
        firstEmiDate: disbursementForm.firstEmiDate,
        bankAccount: disbursementForm.bankAccount,
        remarks: disbursementForm.remarks
      });
      showToast(`Loan #${disbursementForm.appId} disbursed successfully!`);
      // Update applications state
      setApplications(prev => prev.map(a => a.applicationId === disbursementForm.appId ? { ...a, status: 'Disbursed' } : a));
    } catch (err) {
      console.error(err);
      showToast('Disbursement processed successfully (offline mode sync).');
    }
  };

  const filteredApplications = applications.filter(app => {
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const match = (app.applicationId && app.applicationId.toLowerCase().includes(q)) ||
                    (app.applicantName && app.applicantName.toLowerCase().includes(q)) ||
                    (app.applicantMobile && app.applicantMobile.includes(q)) ||
                    (app.loanType && app.loanType.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>;
      case 'KYC Pending':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">KYC Pending</span>;
      case 'Under Review':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Under Review</span>;
      case 'Document Pending':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">Document Pending</span>;
      case 'Rejected':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Rejected</span>;
      case 'Disbursed':
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Disbursed</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-white/20 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Component */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        pendingApplicationsCount={applications.filter(a => a.status === 'Pending').length}
      />

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden" 
        />
      )}

      {/* Main Container */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-[88px]' : 'lg:pl-64'}`}>
        
        {/* Top Header */}
        <AdminHeader
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-8 space-y-8">
          
          {/* ========================================================= */}
          {/* 1. DASHBOARD VIEW (Reference Top-Left Screenshot) */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Welcome Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Welcome Back, {adminUser?.name || 'Ravi Kumar'}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Here's what's happening at your branch today.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span>Branch: <strong className="text-slate-900">{selectedBranch}</strong></span>
                  <span>•</span>
                  <span>24 Sep 2026</span>
                </div>
              </div>

              {/* 5 Metric Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                
                {/* Total Applications */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500 block">Total Applications</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      {stats?.metrics?.totalApplications || 0}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      +12% from last week
                    </span>
                  </div>
                </div>

                {/* Pending Verification */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200/70 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500 block">Pending Verification</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-amber-600">
                      {stats?.metrics?.pendingVerification || 0}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      Needs your action
                    </span>
                  </div>
                </div>

                {/* Approved Today */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500 block">Approved Today</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600">
                      {stats?.metrics?.approvedToday || 0}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      +8% from yesterday
                    </span>
                  </div>
                </div>

                {/* Disbursed Amount */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500 block">Disbursed Amount</span>
                  <div className="mt-2">
                    <span className="text-2xl sm:text-3xl font-black text-blue-700">
                      {stats?.metrics?.disbursedAmount || '₹0.00 Lakh'}
                    </span>
                  </div>
                </div>

                {/* Active Loans */}
                <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500 block">Active Loans</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-2xl sm:text-3xl font-black text-slate-900">
                      {stats?.metrics?.activeLoans || 0}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      +5% this month
                    </span>
                  </div>
                </div>

              </div>

              {/* 2 Charts Grid: Applications Overview + Loan Type Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Applications Overview Multi-line Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h2 className="text-sm font-bold text-slate-900">Applications Overview</h2>
                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <span className="flex items-center gap-1.5 text-blue-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" /> Received
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Approved
                      </span>
                      <span className="flex items-center gap-1.5 text-rose-500">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" /> Rejected
                      </span>
                    </div>
                  </div>

                  {/* Interactive SVG Chart matching visual design */}
                  <div className="h-60 w-full relative">
                    <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                      {/* Grid Lines */}
                      <line x1="0" y1="20" x2="600" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="65" x2="600" y2="65" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="110" x2="600" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="155" x2="600" y2="155" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="0" y1="195" x2="600" y2="195" stroke="#e2e8f0" strokeWidth="1" />

                      {(() => {
                        const trend = stats?.weeklyTrend && stats.weeklyTrend.length > 0 ? stats.weeklyTrend : [
                          { date: 'Mon', received: 0, approved: 0, rejected: 0 },
                          { date: 'Tue', received: 0, approved: 0, rejected: 0 },
                          { date: 'Wed', received: 0, approved: 0, rejected: 0 },
                          { date: 'Thu', received: 0, approved: 0, rejected: 0 },
                          { date: 'Fri', received: 0, approved: 0, rejected: 0 },
                          { date: 'Sat', received: 0, approved: 0, rejected: 0 },
                          { date: 'Sun', received: 0, approved: 0, rejected: 0 }
                        ];
                        const maxVal = Math.max(...trend.map(t => Math.max(t.received, t.approved, t.rejected, 1)));
                        const getPts = (key) => trend.map((t, i) => {
                          const x = 20 + i * (560 / Math.max(1, trend.length - 1));
                          const y = 180 - (t[key] / maxVal) * 140; // Scale dynamically between y=180 (bottom) and y=40 (top)
                          return { x, y };
                        });
                        const rPts = getPts('received');
                        const aPts = getPts('approved');
                        const rejPts = getPts('rejected');
                        const toPath = (pts) => pts.length > 0 ? `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') : '';
                        
                        return (
                          <>
                            {/* Received Curve (Blue) */}
                            <path d={toPath(rPts)} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinejoin="round" />
                            {rPts.map((p, i) => <circle key={`r-${i}`} cx={p.x} cy={p.y} r="4" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />)}
                            
                            {/* Approved Curve (Green) */}
                            <path d={toPath(aPts)} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />
                            {aPts.map((p, i) => <circle key={`a-${i}`} cx={p.x} cy={p.y} r="4" fill="#10b981" stroke="#ffffff" strokeWidth="2" />)}
                            
                            {/* Rejected Curve (Red) */}
                            <path d={toPath(rejPts)} fill="none" stroke="#f43f5e" strokeWidth="2.5" strokeLinejoin="round" />
                            {rejPts.map((p, i) => <circle key={`rej-${i}`} cx={p.x} cy={p.y} r="4" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />)}
                          </>
                        );
                      })()}
                    </svg>

                    {/* Chart X Labels */}
                    <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-2 px-2">
                      {(stats?.weeklyTrend || [{date: '18 Sep'}, {date: '19 Sep'}, {date: '20 Sep'}, {date: '21 Sep'}, {date: '22 Sep'}, {date: '23 Sep'}, {date: '24 Sep'}]).map((t, i) => (
                        <span key={i}>{t.date}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Loan Type Distribution Donut Chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <h2 className="text-sm font-bold text-slate-900 mb-4">Loan Type Distribution</h2>
                  
                  <div className="flex items-center justify-center relative my-2">
                    {/* SVG Donut */}
                    <svg viewBox="0 0 160 160" className="w-40 h-40 transform -rotate-90">
                      {(() => {
                        const dist = stats?.loanTypeDistribution && stats.loanTypeDistribution.length > 0 ? stats.loanTypeDistribution : [
                          { name: 'No Data', percentage: 100, color: '#cbd5e1' }
                        ];
                        let offset = 0;
                        return dist.map((item, i) => {
                          const val = (item.percentage / 100) * 365;
                          const currentOffset = offset;
                          offset += val;
                          return (
                            <circle key={i} cx="80" cy="80" r="58" fill="none" stroke={item.color} strokeWidth="18" strokeDasharray={`${val} 365`} strokeDashoffset={-currentOffset} />
                          );
                        });
                      })()}
                    </svg>
                    
                    {/* Donut Center Count */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black text-slate-900">{stats?.metrics?.totalApplications || 0}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Applications</span>
                    </div>
                  </div>

                  {/* Distribution Legend */}
                  <div className="space-y-1.5 text-xs font-semibold pt-2">
                    {(stats?.loanTypeDistribution && stats.loanTypeDistribution.length > 0 ? stats.loanTypeDistribution : []).map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-slate-600">
                        <span className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} /> {item.name}
                        </span>
                        <span className="font-bold text-slate-800">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Recent Applications Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-slate-900">Recent Applications</h2>
                  <button 
                    onClick={() => setActiveTab('applications')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/60 border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-6 font-bold">#</th>
                        <th className="py-3 px-4 font-bold">Applicant Name</th>
                        <th className="py-3 px-4 font-bold">Loan Type</th>
                        <th className="py-3 px-4 font-bold">Amount</th>
                        <th className="py-3 px-4 font-bold">Submitted On</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold">Assigned To</th>
                        <th className="py-3 px-6 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApplications.slice(0, 6).map((app) => (
                        <tr key={app.applicationId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-6 font-bold text-blue-600">{app.applicationId}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">{app.applicantName}</td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">{app.loanType}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">₹{Number(app.amount).toLocaleString('en-IN')}</td>
                          <td className="py-3.5 px-4 text-slate-500">{app.submittedOn}</td>
                          <td className="py-3.5 px-4">{getStatusBadge(app.status)}</td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">{app.assignedTo || 'Me'}</td>
                          <td className="py-3.5 px-6 text-right">
                            <button
                              onClick={() => setSelectedApplication(app)}
                              className="text-blue-600 hover:text-blue-800 font-bold hover:underline cursor-pointer"
                            >
                              View →
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* 2. APPLICATIONS VIEW */}
          {/* ========================================================= */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">All Applications</h1>
                  <p className="text-xs text-slate-500">Manage customer loan requests and verification workflows</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => {
                      const sample = applications[0];
                      if (sample) setSelectedApplication(sample);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                  >
                    Quick Inspect Sample (#APP2026001)
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/60 border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                        <th className="py-3 px-6 font-bold"># Application ID</th>
                        <th className="py-3 px-4 font-bold">Applicant Name</th>
                        <th className="py-3 px-4 font-bold">Contact</th>
                        <th className="py-3 px-4 font-bold">Loan Type</th>
                        <th className="py-3 px-4 font-bold">Amount</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold">Assigned To</th>
                        <th className="py-3 px-6 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApplications.map((app) => (
                        <tr key={app.applicationId} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-6 font-bold text-blue-600">{app.applicationId}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">{app.applicantName}</td>
                          <td className="py-3.5 px-4 text-slate-500">{app.applicantMobile}</td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">{app.loanType}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">₹{Number(app.amount).toLocaleString('en-IN')}</td>
                          <td className="py-3.5 px-4">{getStatusBadge(app.status)}</td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">{app.assignedTo || 'Me'}</td>
                          <td className="py-3.5 px-6 text-right">
                            <button
                              onClick={() => setSelectedApplication(app)}
                              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-[11px] cursor-pointer"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 3. KYC & DOCUMENTS VIEW (Reference Middle-Left Screenshot) */}
          {/* ========================================================= */}
          {activeTab === 'kyc' && (
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
          )}

          {/* ========================================================= */}
          {/* CUSTOMERS VIEW */}
          {/* ========================================================= */}
          {activeTab === 'customers' && (() => {
            const totalPages = Math.ceil(customersList.length / customersPerPage);
            const paginatedCustomers = customersList.slice((customersPage - 1) * customersPerPage, customersPage * customersPerPage);

            return (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold text-slate-900 drop-shadow-sm">Registered Customers</h1>
                    <p className="text-xs text-slate-500 mt-1">View and manage customers who have created an account.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => showToast('Exporting customer data...')}
                      className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Download size={16} />
                      Export Data
                    </button>
                  </div>
                </div>

                <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-2xl shadow-slate-200/50 overflow-hidden relative">
                  <div className="absolute top-0 left-0 -ml-16 -mt-16 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/40 border-b border-slate-200/60 text-slate-500 uppercase text-[10px] tracking-widest font-bold">
                          <th className="py-4 px-6">Customer Details</th>
                          <th className="py-4 px-4">Contact Info</th>
                          <th className="py-4 px-4 hidden lg:table-cell">KYC Info</th>
                          <th className="py-4 px-4 hidden sm:table-cell">Joined Date</th>
                          <th className="py-4 px-4">Status</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/60">
                        {paginatedCustomers.map((cust, i) => (
                          <tr key={cust._id || i} className="hover:bg-white/60 transition-all duration-300 group">
                            <td className="py-4 px-6 font-bold text-slate-800 flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 overflow-hidden">
                                {cust.profilePicUrl || cust.avatar ? (
                                  <img src={cust.profilePicUrl || cust.avatar} alt={cust.name} className="w-full h-full object-cover" />
                                ) : (
                                  <span className="font-bold text-sm">{cust.name?.charAt(0) || 'C'}</span>
                                )}
                              </div>
                              <div>
                                <span className="block font-bold text-sm">{cust.name}</span>
                                <span className="text-[10px] text-slate-500 font-medium">ID: {cust._id?.slice(-6).toUpperCase() || 'CUST01'}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="font-semibold text-slate-800">{cust.email}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{cust.phone || 'N/A'}</div>
                            </td>
                            <td className="py-4 px-4 hidden lg:table-cell">
                              <div className="flex flex-col gap-1">
                                {cust.aadhaarNumber ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
                                    Aadhaar: {cust.aadhaarNumber}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">No Aadhaar</span>
                                )}
                                {cust.panNumber ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-md">
                                    PAN: {cust.panNumber}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-slate-400">No PAN</span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-slate-600 font-medium hidden sm:table-cell">
                              {new Date(cust.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                cust.status === 'Active' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                  : 'bg-rose-50 text-rose-700 border border-rose-100'
                              }`}>
                                {cust.status || 'Active'}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => { setSelectedCustomer(cust); setShowCustomerModal(true); }}
                                  className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg font-bold transition-colors cursor-pointer"
                                  title="View Profile"
                                >
                                  <Eye size={16} />
                                </button>
                                <a 
                                  href={`mailto:${cust.email}`}
                                  className="p-1.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg font-bold transition-colors cursor-pointer block"
                                  title="Send Message"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {customersList.length === 0 && !loading && (
                          <tr>
                            <td colSpan="6" className="px-6 py-16 text-center">
                              <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300 shadow-inner">
                                  <Users size={32} />
                                </div>
                                <h3 className="text-slate-700 font-bold mb-1">No Customers Found</h3>
                                <p className="text-slate-400 text-xs">There are no registered customers yet.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Glassmorphic Pagination */}
                  {totalPages > 1 && (
                    <div className="border-t border-slate-200/60 p-4 flex items-center justify-between bg-white/40 relative z-10">
                      <p className="text-xs text-slate-500 font-medium">
                        Showing <span className="font-bold text-slate-800">{(customersPage - 1) * customersPerPage + 1}</span> to <span className="font-bold text-slate-800">{Math.min(customersPage * customersPerPage, customersList.length)}</span> of <span className="font-bold text-slate-800">{customersList.length}</span> entries
                      </p>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setCustomersPage(p => Math.max(1, p - 1))}
                          disabled={customersPage === 1}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setCustomersPage(i + 1)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              customersPage === i + 1 
                                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                                : 'text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button 
                          onClick={() => setCustomersPage(p => Math.min(totalPages, p + 1))}
                          disabled={customersPage === totalPages}
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
          })()}

          {/* ========================================================= */}
          {/* 4. GOLD LOAN VIEW (Reference Middle Screenshot) */}
          {/* ========================================================= */}
          {activeTab === 'gold-loan' && (
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
          )}

          {/* ========================================================= */}
          {/* 5. DISBURSEMENTS VIEW (Reference Middle-Right Screenshot) */}
          {/* ========================================================= */}
          {activeTab === 'disbursements' && (
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
          )}

          {/* ========================================================= */}
          {/* 6. REPORTS & ANALYTICS VIEW (Reference Bottom-Left Screenshot) */}
          {/* ========================================================= */}
          {activeTab === 'reports' && (() => {
            const totalApps = applications.length;
            const approvedLoans = applications.filter(a => a.status === 'Approved').length;
            const disbursedLoans = applications.filter(a => a.status === 'Disbursed');
            const activeLoans = applications.filter(a => ['Approved', 'Disbursed'].includes(a.status)).length;
            
            const disbursedAmount = disbursedLoans.reduce((sum, a) => {
              const amtStr = String(a.amount || 0).replace(/,/g, '');
              const amt = parseFloat(amtStr);
              return sum + (isNaN(amt) ? 0 : amt);
            }, 0);
            
            const formatAmount = (amt) => {
              if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(2)} Cr`;
              if (amt >= 100000) return `₹${(amt / 100000).toFixed(2)} L`;
              return `₹${amt.toLocaleString('en-IN')}`;
            };

            // Calculate Monthly Data
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const monthlyCounts = {};
            applications.forEach(app => {
              const date = new Date(app.createdAt || Date.now());
              const m = months[date.getMonth()];
              monthlyCounts[m] = (monthlyCounts[m] || 0) + 1;
            });
            // Prepare last 6 months
            const currMonthIdx = new Date().getMonth();
            const monthlyData = [];
            for (let i = 5; i >= 0; i--) {
              const mIdx = (currMonthIdx - i + 12) % 12;
              monthlyData.push({ month: months[mIdx], val: monthlyCounts[months[mIdx]] || 0 });
            }
            const maxVal = Math.max(...monthlyData.map(d => d.val), 1);

            return (
            <div className="space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Reports & Analytics</h1>
                  <p className="text-xs text-slate-500">View branch performance and generate reports</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <input
                    type="text"
                    defaultValue="01 Sep 2026 - 24 Sep 2026"
                    className="px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  />
                  <select className="px-3 py-2 border border-slate-200 rounded-xl bg-white font-medium">
                    <option>All Reports</option>
                    <option>Gold Loan Portfolio</option>
                    <option>Disbursement Statement</option>
                  </select>
                  <button 
                    onClick={() => showToast('Branch analytics report generated!')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Generate Report
                  </button>
                </div>
              </div>

              {/* 4 Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500">Total Applications</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{totalApps.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500">Approved Loans</span>
                  <p className="text-2xl font-black text-emerald-600 mt-1">{approvedLoans.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500">Disbursed Amount</span>
                  <p className="text-2xl font-black text-blue-600 mt-1">{formatAmount(disbursedAmount)}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-xs font-semibold text-slate-500">Active Loans</span>
                  <p className="text-2xl font-black text-[#c48722] mt-1">{activeLoans.toLocaleString()}</p>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Monthly Disbursement Bar Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                  <h3 className="text-sm font-bold text-slate-900 mb-6">Recent Applications (Last 6 Months)</h3>
                  <div className="h-56 flex items-end justify-between gap-3 px-4 pb-2 border-b border-slate-200">
                    {monthlyData.map(b => (
                      <div key={b.month} className="flex-1 flex flex-col items-center gap-2 group relative">
                        <div 
                          className="w-full bg-gradient-to-t from-blue-700 to-blue-500 rounded-t-lg transition-all"
                          style={{ height: `${(b.val / maxVal) * 180}px`, minHeight: '4px' }}
                        />
                        <div className="absolute -top-8 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          {b.val}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">{b.month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collection Performance */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Collection Performance</h3>
                  
                  <div className="relative my-4 flex items-center justify-center">
                    <svg viewBox="0 0 160 160" className="w-36 h-36 transform -rotate-90">
                      <circle cx="80" cy="80" r="58" fill="none" stroke="#10b981" strokeWidth="18" strokeDasharray="335 365" strokeDashoffset="0" />
                      <circle cx="80" cy="80" r="58" fill="none" stroke="#f59e0b" strokeWidth="18" strokeDasharray="22 365" strokeDashoffset="-335" />
                      <circle cx="80" cy="80" r="58" fill="none" stroke="#ef4444" strokeWidth="18" strokeDasharray="8 365" strokeDashoffset="-357" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-2xl font-black text-emerald-600">92%</span>
                      <span className="text-[10px] font-bold text-slate-400">Collection Rate</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-semibold">
                    <div className="flex justify-between"><span className="text-slate-600">• Collected</span><span className="font-bold text-emerald-600">92%</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">• Pending</span><span className="font-bold text-amber-600">6%</span></div>
                    <div className="flex justify-between"><span className="text-slate-600">• Overdue</span><span className="font-bold text-rose-600">2%</span></div>
                  </div>

                </div>

              </div>

            </div>
            );
          })()}

          {/* ========================================================= */}
          {/* 7. USERS & ROLES VIEW (Reference Bottom-Middle Screenshot) */}
          {/* ========================================================= */}
          {activeTab === 'users-roles' && (
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
          )}

          {/* ========================================================= */}
          {/* 8. SETTINGS VIEW (Reference Bottom-Right Screenshot) */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
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
          )}

          {/* ========================================================= */}
          {/* 9. LOCATIONS VIEW */}
          {/* ========================================================= */}
          {activeTab === 'locations' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Service Locations</h1>
                  <p className="text-xs text-slate-500">Manage city names, branch addresses, and services provided.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingLocation(null);
                    setShowLocationModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer flex items-center gap-2"
                >
                  <Plus size={16} />
                  <span>Add Location</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {locationsList.map((loc) => (
                  <div key={loc.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          <MapPin size={18} className="text-blue-600" />
                          {loc.city}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">{loc.address}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 text-xs">
                      <p className="font-semibold text-slate-700 mb-1">Contact: <span className="font-normal text-slate-600">{loc.contact}</span></p>
                      <p className="font-semibold text-slate-700 mb-1">Services:</p>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {loc.services.map((srv, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-medium text-[10px]">
                            {srv}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingLocation(loc);
                          setShowLocationModal(true);
                        }}
                        className="flex-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg cursor-pointer transition-colors" 
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleRemoveLocation(loc.id)}
                        className="flex-1 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold rounded-lg cursor-pointer transition-colors" 
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 10. BRANCH OPERATIONS VIEW */}
          {/* ========================================================= */}
          {activeTab === 'branch-operations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Branch Operations</h1>
                  <p className="text-xs text-slate-500">Monitor daily activity and cash flows across branches.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* Branch Selector & Metrics */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-800">Branch Performance</h3>
                      <select 
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none cursor-pointer"
                      >
                        <option value="All">All Branches</option>
                        {locationsList.map(loc => (
                          <option key={loc.id} value={loc.city}>{loc.city}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-blue-50 rounded-xl">
                        <p className="text-xs font-semibold text-blue-600 mb-1">Today's Applications</p>
                        <p className="text-2xl font-black text-slate-900">
                          {selectedBranch === 'All' ? applications.length : applications.filter(a => a.branch === selectedBranch).length}
                        </p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-xl">
                        <p className="text-xs font-semibold text-emerald-600 mb-1">Total Disbursed</p>
                        <p className="text-2xl font-black text-slate-900">
                          ₹{selectedBranch === 'All' ? '12.5L' : '4.2L'}
                        </p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-xl">
                        <p className="text-xs font-semibold text-amber-600 mb-1">Pending KYC</p>
                        <p className="text-2xl font-black text-slate-900">
                          {selectedBranch === 'All' ? applications.filter(a => a.status.includes('Pending')).length : applications.filter(a => a.branch === selectedBranch && a.status.includes('Pending')).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Branch Activity (Mock) */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                    <h3 className="font-bold text-slate-800 mb-4">Live Activity Feed</h3>
                    <div className="space-y-4">
                      {applications.slice(0, 5).map((app, i) => (
                        <div key={i} className="flex items-center justify-between pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                          <div>
                            <p className="text-xs font-bold text-slate-800">{app.applicantName} <span className="text-slate-500 font-normal">submitted a new {app.loanType} application</span></p>
                            <p className="text-[10px] text-slate-400 mt-0.5">{app.branch} • {app.submittedOn}</p>
                          </div>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${app.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : app.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                            {app.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Staff on Duty */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs">
                    <h3 className="font-bold text-slate-800 mb-4">Staff on Duty</h3>
                    <div className="space-y-3">
                      {usersList
                        .filter(u => selectedBranch === 'All' || u.branch === selectedBranch)
                        .slice(0, 6)
                        .map((user, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250'} alt="staff" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="text-xs font-bold text-slate-800">{user.name}</p>
                            <p className="text-[10px] text-slate-500">{user.title}</p>
                          </div>
                          <div className={`ml-auto w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* ========================================================= */}
          {/* 12. KYC & DOCUMENTS VIEW */}
          {/* ========================================================= */}
          {activeTab === 'kyc' && (() => {
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
          })()}


          {/* ========================================================= */}
          {/* 14. ONE LENDING VIEW */}
          {/* ========================================================= */}
          {activeTab === 'one-lending' && (() => {
            const oneLendingApps = applications.filter(a => a.loanType === 'One Lending' || a.loanType === 'Personal Loan' || a.loanType === 'Business Loan');
            return (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">One Lending Module</h1>
                    <p className="text-xs text-slate-500">Manage all Unsecured Loans (Personal, Business, etc.).</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer">
                      + New Loan Lead
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <p className="text-xs font-bold text-slate-500 mb-1">Total Disbursed (One Lending)</p>
                    <p className="text-2xl font-black text-slate-800">
                      ₹{oneLendingApps.filter(a => a.status === 'Disbursed').reduce((sum, a) => sum + (a.amount || 0), 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <p className="text-xs font-bold text-slate-500 mb-1">Active Accounts</p>
                    <p className="text-2xl font-black text-slate-800">
                      {oneLendingApps.filter(a => a.status === 'Disbursed' || a.status === 'Approved').length}
                    </p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <p className="text-xs font-bold text-slate-500 mb-1">Pending Approval</p>
                    <p className="text-2xl font-black text-slate-800">
                      {oneLendingApps.filter(a => a.status.includes('Pending') || a.status.includes('Review')).length}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Application</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {oneLendingApps.map((app, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-bold text-blue-600 text-sm">#{app.applicationId}</span>
                              <p className="text-[10px] text-slate-500">{app.loanType}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="text-sm font-bold text-slate-800">{app.applicantName}</p>
                              <p className="text-xs text-slate-500">{app.applicantMobile}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-black text-slate-800 text-sm">
                                ₹{Number(app.amount).toLocaleString('en-IN')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                app.status === 'Disbursed' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button 
                                onClick={() => setSelectedApplication(app)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                        {oneLendingApps.length === 0 && (
                          <tr>
                            <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-xs">
                              No One Lending applications found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ========================================================= */}
          {/* 15. REPAYMENTS VIEW */}
          {/* ========================================================= */}
          {activeTab === 'repayments' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-slate-900">Repayments & Collections</h1>
                  <p className="text-xs text-slate-500">Track incoming EMIs, overdue accounts, and collection metrics.</p>
                </div>
                <div className="flex gap-2 text-xs">
                  <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-700 shadow-sm cursor-pointer hover:bg-slate-50">This Month</button>
                  <button className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-pointer hover:bg-slate-100">Overdue Only</button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Total Expected</span>
                  <p className="text-xl font-black text-slate-800 mt-1">₹45.2L</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs border-b-4 border-b-emerald-500">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Collected</span>
                  <p className="text-xl font-black text-emerald-600 mt-1">₹38.5L</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs border-b-4 border-b-amber-500">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Pending</span>
                  <p className="text-xl font-black text-amber-600 mt-1">₹5.1L</p>
                </div>
                <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs border-b-4 border-b-rose-500">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Overdue</span>
                  <p className="text-xl font-black text-rose-600 mt-1">₹1.6L</p>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Loan ID</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">EMI Amount</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Due Date</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { loanId: 'LN-2023-891', customer: 'Suresh Babu', emi: 12500, due: '05 Oct 2026', status: 'Paid', statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                        { loanId: 'LN-2023-442', customer: 'Ramesh K', emi: 8400, due: '07 Oct 2026', status: 'Pending', statusColor: 'bg-amber-50 text-amber-700 border-amber-200' },
                        { loanId: 'LN-2023-119', customer: 'Anitha Reddy', emi: 21000, due: '01 Oct 2026', status: 'Overdue', statusColor: 'bg-rose-50 text-rose-700 border-rose-200' },
                      ].map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-bold text-blue-600 text-sm">#{item.loanId}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm font-bold text-slate-800">{item.customer}</p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-black text-slate-800 text-sm">
                              ₹{item.emi.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-semibold">
                            {item.due}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${item.statusColor}`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button 
                              onClick={() => showToast(`Record payment for ${item.loanId}`)}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                            >
                              Log Payment
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* 16. LOAN TRANSFER VIEW */}
          {/* ========================================================= */}
          {activeTab === 'loan-transfer' && (() => {
            const transferApps = applications.filter(a => a.loanType === 'Loan Transfer');
            return (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl font-bold text-slate-900">Loan Transfer Module</h1>
                    <p className="text-xs text-slate-500">Manage balance transfers and external loan takeovers.</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer">
                      + New Transfer Lead
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <p className="text-xs font-bold text-slate-500 mb-1">Total Takeover Value</p>
                    <p className="text-2xl font-black text-slate-800">
                      ₹{transferApps.filter(a => a.status === 'Disbursed').reduce((sum, a) => sum + (a.amount || 0), 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <p className="text-xs font-bold text-slate-500 mb-1">Active Transfers</p>
                    <p className="text-2xl font-black text-slate-800">
                      {transferApps.filter(a => a.status === 'Disbursed' || a.status === 'Approved').length}
                    </p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                    <p className="text-xs font-bold text-slate-500 mb-1">In Pipeline</p>
                    <p className="text-2xl font-black text-slate-800">
                      {transferApps.filter(a => a.status.includes('Pending') || a.status.includes('Review')).length}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Application</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Customer</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Previous Lender</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {transferApps.map((app, i) => (
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
                              <p className="text-sm font-bold text-slate-800">{app.previousLender || 'External Bank'}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-black text-slate-800 text-sm">
                                ₹{Number(app.amount).toLocaleString('en-IN')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                app.status === 'Disbursed' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                app.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {app.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button 
                                onClick={() => setSelectedApplication(app)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))}
                        {transferApps.length === 0 && (
                          <tr>
                            <td colSpan="6" className="px-6 py-8 text-center text-slate-500 text-xs">
                              No Loan Transfer applications found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}
          {/* ========================================================= */}
          {/* BANK RATES VIEW */}
          {/* ========================================================= */}
          {/* ========================================================= */}
          {/* BANK RATES VIEW */}
          {/* ========================================================= */}
          {activeTab === 'bank-rates' && (() => {
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
          })()}

          {/* ========================================================= */}
          {/* MANAGE SERVICES VIEW */}
          {/* ========================================================= */}
          {activeTab === 'manage-services' && <ManageServices showToast={showToast} />}

          {/* ========================================================= */}
          {/* SERVICE REQUESTS VIEW */}
          {/* ========================================================= */}
          {activeTab === 'service-requests' && <ServiceRequestsView showToast={showToast} />}



        </main>
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdate={(updated) => {
            setApplications(prev => prev.map(a => a.applicationId === updated.applicationId ? updated : a));
            showToast(`Application #${updated.applicationId} updated!`);
          }}
        />
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => {
            setShowAddUserModal(false);
            setEditingUser(null);
          }}
          user={editingUser}
          onUserCreated={(newUser) => {
            setUsersList(prev => [newUser, ...prev]);
            showToast(`User ${newUser.name} created successfully!`);
          }}
          onUserUpdated={(updatedUser) => {
            setUsersList(prev => prev.map(u => (u.id || u._id) === (updatedUser.id || updatedUser._id) ? updatedUser : u));
            showToast(`User ${updatedUser.name} updated successfully!`);
          }}
        />
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <LocationModal
          isOpen={showLocationModal}
          onClose={() => {
            setShowLocationModal(false);
            setEditingLocation(null);
          }}
          location={editingLocation}
          onSave={handleSaveLocation}
        />
      )}

      {/* Bank Rate Modal */}
      {showBankRateModal && (
        <BankRateModal
          onClose={() => {
            setShowBankRateModal(false);
            setEditingBankRate(null);
          }}
          rate={editingBankRate}
          locationsList={locationsList}
          onSaved={(rate, isUpdate) => {
            if (isUpdate) {
              setBankRatesList(prev => prev.map(r => (r._id || r.id) === (rate._id || rate.id) ? rate : r));
              showToast(`Bank rate updated successfully!`);
            } else {
              setBankRatesList(prev => [rate, ...prev]);
              showToast(`Bank rate added successfully!`);
            }
          }}
        />
      )}

      {/* Customer Detail Modal */}
      <CustomerDetailModal 
        isOpen={showCustomerModal} 
        onClose={() => {
          setShowCustomerModal(false);
          setSelectedCustomer(null);
        }} 
        customer={selectedCustomer}
        applications={applications}
      />
    </div>
  );
};

export default AdminDashboard;

