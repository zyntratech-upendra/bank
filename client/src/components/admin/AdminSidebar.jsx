import { 
  Landmark, 
  LayoutDashboard, 
  FileText, 
  Users, 
  Coins, 
  ArrowLeftRight, 
  CreditCard, 
  Wallet, 
  Receipt, 
  ShieldCheck, 
  BarChart3, 
  HelpCircle, 
  Building2, 
  UserCog, 
  Settings,
  LogOut,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'gold-loan', label: 'Gold Loan', icon: Coins },
  { id: 'loan-transfer', label: 'Loan Transfer', icon: ArrowLeftRight },
  { id: 'one-lending', label: 'One Lending', icon: CreditCard },
  { id: 'disbursements', label: 'Disbursements', icon: Wallet },
  { id: 'repayments', label: 'Repayments', icon: Receipt },
  { id: 'kyc', label: 'KYC & Documents', icon: ShieldCheck },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'service-requests', label: 'Service Requests', icon: HelpCircle },
  { id: 'manage-services', label: 'Manage Services', icon: LayoutDashboard },
  { id: 'locations', label: 'Service Locations', icon: MapPin },
  { id: 'bank-rates', label: 'Bank Gold Rates', icon: Coins },
  { id: 'branch-operations', label: 'Branch Operations', icon: Building2 },
  { id: 'users-roles', label: 'Users & Roles', icon: UserCog },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const AdminSidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen, sidebarCollapsed, setSidebarCollapsed, pendingApplicationsCount, pendingServiceRequestsCount }) => {
  const { logout } = useAdminAuth();

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 bg-white text-slate-600 flex flex-col border-r border-slate-200
      transition-all duration-300 ease-in-out
      ${sidebarCollapsed ? 'w-[88px]' : 'w-64'}
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      {/* Brand Header */}
      <div className={`h-20 flex items-center border-b border-slate-200 bg-white transition-all overflow-hidden ${sidebarCollapsed ? 'justify-center px-0' : 'px-6'}`}>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-tr from-blue-700 to-blue-500 text-white p-2.5 rounded-xl shadow-sm shrink-0">
            <Landmark size={24} className="stroke-[2.5]" />
          </div>
          {!sidebarCollapsed && (
            <div className="whitespace-nowrap">
              <h1 className="text-base font-black tracking-tight text-slate-900 leading-tight">
                BANKING SERVICES
              </h1>
              <p className="text-[10px] font-bold tracking-[0.18em] text-blue-600 leading-none mt-0.5">
                TRUSTED FINANCIAL PARTNER
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar overflow-x-hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setSidebarOpen(false);
              }}
              title={sidebarCollapsed ? item.label : undefined}
              className={`
                w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold
                transition-all duration-200 cursor-pointer group text-left
                ${sidebarCollapsed ? 'justify-center' : 'justify-between'}
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 relative' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 rounded-r-md" />
                )}
                <Icon size={18} className={`shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {!sidebarCollapsed && <span className="truncate whitespace-nowrap">{item.label}</span>}
              </div>

              {!sidebarCollapsed && item.id === 'applications' && pendingApplicationsCount > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {pendingApplicationsCount}
                </span>
              )}
              {!sidebarCollapsed && item.id === 'service-requests' && pendingServiceRequestsCount > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  {pendingServiceRequestsCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Toggle and Logout */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex flex-col gap-2">
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}
          title="Toggle Sidebar"
        >
          {!sidebarCollapsed && <span>Collapse Sidebar</span>}
          <ChevronRight size={16} className={`transition-transform duration-300 ${sidebarCollapsed ? 'rotate-0' : 'rotate-180'}`} />
        </button>

        <button
          onClick={logout}
          title={sidebarCollapsed ? "Sign Out" : undefined}
          className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}
        >
          <div className="flex items-center gap-2.5">
            <LogOut size={16} className="shrink-0" />
            {!sidebarCollapsed && <span className="whitespace-nowrap">Sign Out Admin</span>}
          </div>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
