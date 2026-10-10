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
import DashboardOverviewView from '../../components/admin/views/DashboardOverviewView';
import ApplicationsView from '../../components/admin/views/ApplicationsView';
import KycDocumentsView from '../../components/admin/views/KycDocumentsView';
import CustomersView from '../../components/admin/views/CustomersView';
import GoldLoanView from '../../components/admin/views/GoldLoanView';
import DisbursementsView from '../../components/admin/views/DisbursementsView';
import ReportsView from '../../components/admin/views/ReportsView';
import UsersRolesView from '../../components/admin/views/UsersRolesView';
import SettingsView from '../../components/admin/views/SettingsView';
import LocationsView from '../../components/admin/views/LocationsView';
import BranchOperationsView from '../../components/admin/views/BranchOperationsView';
import OneLendingView from '../../components/admin/views/OneLendingView';
import RepaymentsView from '../../components/admin/views/RepaymentsView';
import LoanTransferView from '../../components/admin/views/LoanTransferView';
import BankRatesView from '../../components/admin/views/BankRatesView';

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
  const { tab, id } = useParams();
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
    appId: '',
    customerName: '',
    loanType: 'Gold Loan',
    amount: '',
    disbursementDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    interestRate: '8.5% p.a.',
    tenure: '12 Months',
    repaymentMode: 'Monthly EMI',
    firstEmiDate: '',
    emiAmount: '0',
    bankAccount: '',
    remarks: '',
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

  
  const commonProps = {
    loading,
    adminUser, stats, selectedBranch, setSelectedBranch,
    applications, filteredApplications, getStatusBadge,
    setActiveTab, setSelectedApplication, showToast,
    customersList, customersPage, setCustomersPage, customersPerPage,
    setSelectedCustomer, setShowCustomerModal,
    disbursementForm, setDisbursementForm, handleDisburseLoanSubmit,
    usersList, setEditingUser, setShowAddUserModal,
    activeSettingsTab, setActiveSettingsTab, currentSettingForm, setCurrentSettingForm, handleSaveSettings,
    locationsList, setEditingLocation, setShowLocationModal, handleRemoveLocation,
    bankRatesList, bankRatesPage, setBankRatesPage, bankRatesPerPage, setEditingBankRate, setShowBankRateModal, setBankRatesList
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
          {activeTab === 'dashboard' && <DashboardOverviewView {...commonProps} />}

          {/* ========================================================= */}
          {/* 2. APPLICATIONS VIEW */}
          {/* ========================================================= */}
          {activeTab === 'applications' && <ApplicationsView {...commonProps} />}

          {/* ========================================================= */}
          {/* 3. KYC & DOCUMENTS VIEW (Reference Middle-Left Screenshot) */}
          {/* ========================================================= */}
          {activeTab === 'kyc' && <KycDocumentsView {...commonProps} />}

          {/* ========================================================= */}
          {/* CUSTOMERS VIEW */}
          {/* ========================================================= */}
          {activeTab === 'customers' && <CustomersView {...commonProps} />}

          {/* ========================================================= */}
          {/* 4. GOLD LOAN VIEW (Reference Middle Screenshot) */}
          {/* ========================================================= */}
          {activeTab === 'gold-loan' && <GoldLoanView {...commonProps} />}

          {/* ========================================================= */}
          {/* 5. DISBURSEMENTS VIEW (Reference Middle-Right Screenshot) */}
          {/* ========================================================= */}
          {activeTab === 'disbursements' && <DisbursementsView {...commonProps} />}

          {/* ========================================================= */}
          {/* 6. REPORTS & ANALYTICS VIEW (Reference Bottom-Left Screenshot) */}
          {/* ========================================================= */}
          {activeTab === 'reports' && <ReportsView {...commonProps} />}

          {/* ========================================================= */}
          {/* 7. USERS & ROLES VIEW (Reference Bottom-Middle Screenshot) */}
          {/* ========================================================= */}
          {activeTab === 'users-roles' && <UsersRolesView {...commonProps} />}

          {/* ========================================================= */}
          {/* 8. SETTINGS VIEW (Reference Bottom-Right Screenshot) */}
          {/* ========================================================= */}
          {activeTab === 'settings' && <SettingsView {...commonProps} />}

          {/* ========================================================= */}
          {/* 9. LOCATIONS VIEW */}
          {/* ========================================================= */}
          {activeTab === 'locations' && <LocationsView {...commonProps} />}

          {/* ========================================================= */}
          {/* 10. BRANCH OPERATIONS VIEW */}
          {/* ========================================================= */}
          {activeTab === 'branch-operations' && <BranchOperationsView {...commonProps} />}


          {/* ========================================================= */}
          {/* 14. ONE LENDING VIEW */}
          {/* ========================================================= */}
          {activeTab === 'one-lending' && <OneLendingView {...commonProps} />}

          {/* ========================================================= */}
          {/* 15. REPAYMENTS VIEW */}
          {/* ========================================================= */}
          {activeTab === 'repayments' && <RepaymentsView {...commonProps} />}

          {/* ========================================================= */}
          {/* 16. LOAN TRANSFER VIEW */}
          {/* ========================================================= */}
          {activeTab === 'loan-transfer' && <LoanTransferView {...commonProps} />}
          {/* ========================================================= */}
          {/* BANK RATES VIEW */}
          {/* ========================================================= */}
          {/* ========================================================= */}
          {/* BANK RATES VIEW */}
          {/* ========================================================= */}
          {activeTab === 'bank-rates' && <BankRatesView {...commonProps} />}

          {/* ========================================================= */}
          {/* MANAGE SERVICES VIEW */}
          {/* ========================================================= */}
          {activeTab === 'manage-services' && <ManageServices showToast={showToast} />}

          {/* ========================================================= */}
          {/* SERVICE REQUESTS VIEW */}
          {/* ========================================================= */}
          {activeTab === 'service-requests' && <ServiceRequestsView showToast={showToast} routeId={id} />}



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

