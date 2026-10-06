import { useState } from 'react';
import { 
  Search, 
  Bell, 
  Calendar, 
  MapPin, 
  Menu, 
  ChevronDown, 
  LogOut, 
  User, 
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminHeader = ({ 
  searchTerm, 
  setSearchTerm, 
  selectedBranch, 
  setSelectedBranch, 
  sidebarOpen, 
  setSidebarOpen 
}) => {
  const { adminUser, logout } = useAdminAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'New Gold Loan Application', desc: 'APP2026001 submitted by Suresh Babu', time: '10 min ago', unread: true },
    { id: 2, title: 'KYC Document Uploaded', desc: 'PAN & Aadhaar uploaded for Divya Nair', time: '25 min ago', unread: true },
    { id: 3, title: 'Disbursement Approved', desc: '₹1.00 Lakh approved for Lakshmi Devi', time: '1 hour ago', unread: false },
  ];

  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-3 sm:gap-6 flex-1 max-w-xl">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, application ID, loan type..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Right: Date, Branch, Notifications & Admin Profile */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        
        {/* Date Display */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
          <Calendar size={14} className="text-slate-400" />
          <span>24 Sep 2026</span>
        </div>

        {/* Notifications Icon with Popup */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Notifications (3)</h4>
                <span className="text-[10px] font-semibold text-blue-600 cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="text-xs p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-bold text-slate-800">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Box */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer"
          >
            <img
              src={adminUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250"}
              alt="Admin Avatar"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div className="hidden text-left sm:block">
              <span className="text-xs font-bold text-slate-800 block leading-tight">
                {adminUser?.name || 'Admin'}
              </span>
              <span className="text-[10px] font-medium text-slate-500 block leading-tight">
                {adminUser?.title || 'System Administrator'}
              </span>
            </div>
            <ChevronDown size={14} className="hidden sm:block text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs">
              <div className="p-3 border-b border-slate-100 mb-1">
                <p className="font-bold text-slate-800">{adminUser?.name || 'Admin'}</p>
                <p className="text-[11px] text-slate-500">{adminUser?.email || 'admin@bankingservices.com'}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  <ShieldCheck size={12} />
                  <span>Role: {adminUser?.role?.toUpperCase() || 'ADMIN'}</span>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors font-medium text-left"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
};

export default AdminHeader;
