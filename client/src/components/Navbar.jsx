import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Landmark, Menu, X, Search, Coins, RefreshCw, HandCoins, User, Briefcase, Phone, ArrowRight, ShieldCheck, LogOut, Settings } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Re-check authentication when route changes (e.g. after login/logout navigation)
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('bank_token');
      const userStr = localStorage.getItem('bank_user');
      if (token && userStr) {
        try {
          setUser(JSON.parse(userStr));
        } catch (e) {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    checkAuth();
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('bank_token');
    localStorage.removeItem('bank_user');
    setUser(null);
    navigate('/login');
  };

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname, location.search]);

  // Click outside listener for search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isSearchOpen]);

  const publicNavLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const userNavLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Apply Loan', path: '/dashboard?tab=apply' },
    { name: 'My Loans', path: '/dashboard?tab=loans' },
    { name: 'Payments', path: '/dashboard?tab=payments' },
    { name: 'Documents', path: '/dashboard?tab=documents' },
    { name: 'Support', path: '/dashboard?tab=support' },
  ];

  const currentNavLinks = user ? userNavLinks : publicNavLinks;

  const searchableServices = [
    { name: 'Gold Loan', path: '/services?type=gold', desc: 'Starting from 8.5% p.a. via Govt. Banks', icon: Coins },
    { name: 'Loan Transfer', path: '/services?type=transfer', desc: 'Move from private moneylenders to bank rates', icon: RefreshCw },
    { name: 'One Lending Solution', path: '/services?type=one-lending', desc: 'Bridge funds to clear existing loans against KYC', icon: HandCoins },
    { name: 'Personal Loan', path: '/services?type=personal', desc: 'Instant sanction with minimal paperwork', icon: User },
    { name: 'Business Loan', path: '/services?type=business', desc: 'Growth capital up to ₹2 Crores for enterprises', icon: Briefcase },
    { name: 'Contact & Branch Support', path: '/contact', desc: 'Branch address, phone & direct customer care', icon: Phone },
  ];

  const filteredServices = searchQuery.trim() === ''
    ? searchableServices
    : searchableServices.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.desc.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const isLinkActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' && !location.search;
    }
    // Compare full path + search
    const currentFullPath = location.pathname + location.search;
    if (path.includes('?')) {
      return currentFullPath === path;
    }
    // For base paths like '/dashboard' without query params, only match if there is no ?tab= or similar
    // unless it's exactly the path (e.g. /about)
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' && (!location.search || location.search === '?tab=dashboard');
    }
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" ref={searchRef}>
        <div className="flex justify-between items-center h-20">
          
          {/* Logo - Matches Mockup: Blue temple icon without box + text */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-2.5 group shrink-0">
            <Landmark size={30} className="stroke-[2.2] text-[#0e274a] group-hover:scale-105 transition-transform shrink-0" />
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-black tracking-tight text-[#0e274a] leading-none">
                BANKING
              </span>
              <span className="text-[10px] sm:text-[11px] font-extrabold tracking-[0.22em] text-[#0e274a] leading-none mt-1">
                SERVICES
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {currentNavLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[14px] font-semibold transition-all duration-200 relative py-1 ${
                    active
                      ? (user ? 'text-blue-600 font-bold' : 'text-[#b38318] font-bold')
                      : 'text-slate-700 hover:text-[#0e274a]'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full ${user ? 'bg-blue-600' : 'bg-[#b38318]'}`} />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Elements: Search Icon, Login Button, Register Button */}
          <div className="hidden sm:flex items-center space-x-3 lg:space-x-4">
            
            {/* Search Toggle (Hidden when logged in) */}
            {!user && (
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
                className="p-2 text-slate-700 hover:text-[#0e274a] hover:bg-slate-100 rounded-full transition-colors"
              >
                <Search size={20} />
              </button>
            )}

            {/* User Profile Dropdown OR Login/Register */}
            {user ? (
              <div className="relative group">
                <button
                  className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-full hover:bg-slate-50 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <div className="w-7 h-7 rounded-full bg-[#0e274a] text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                    <img 
                      src={user.avatar || user.profilePicUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0e274a&color=fff&size=64`} 
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0e274a&color=fff&size=64`; }}
                      alt="User" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-800 hidden lg:block">My Account</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                  <div className="px-4 py-2 border-b border-slate-100 mb-1">
                    <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                  
                  <Link to="/dashboard?tab=profile" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-colors">
                    <User size={16} className="text-slate-400" /> My Profile
                  </Link>
                  <Link to="/dashboard?tab=settings" className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-colors">
                    <Settings size={16} className="text-slate-400" /> Settings
                  </Link>
                  
                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-rose-50 text-sm font-semibold text-rose-600 transition-colors">
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Login Button (Outlined) */}
                <Link
                  to="/login"
                  className="px-5 lg:px-6 py-2 text-[14px] font-semibold text-slate-800 hover:text-[#0e274a] border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all shadow-xs"
                >
                  Login
                </Link>

                {/* Register Button (Solid Dark Blue) */}
                <Link
                  to="/register"
                  className="px-5 lg:px-6 py-2 text-[14px] font-semibold text-white bg-[#0e274a] hover:bg-[#163866] rounded-lg transition-all shadow-xs hover:shadow"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Navigation Controls */}
          <div className="sm:hidden flex items-center space-x-1.5">
            {!user && (
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Search size={20} />
              </button>
            )}
            {user ? (
              <Link
                to="/dashboard"
                className="w-8 h-8 rounded-full bg-[#0e274a] text-white flex items-center justify-center text-sm font-bold shadow-sm border border-slate-200"
              >
                {user.name?.charAt(0) || 'U'}
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-xs font-semibold px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
              >
                Login
              </Link>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>

        {/* Fully Responsive Search Dropdown (Mobile + Tablet + Desktop) */}
        {isSearchOpen && (
          <div className="absolute right-4 sm:right-6 lg:right-8 top-full mt-1 w-[calc(100vw-2rem)] sm:w-96 max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-fadeIn">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                placeholder="Search Gold loan, Transfer, Rates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-none text-slate-800 placeholder-slate-400 font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-slate-600 px-1">
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {filteredServices.length > 0 ? (
                filteredServices.map((svc) => {
                  const Icon = svc.icon;
                  return (
                    <button
                      key={svc.name}
                      onClick={() => {
                        navigate(svc.path);
                        setIsSearchOpen(false);
                      }}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#faf5eb] text-[#c48722] flex items-center justify-center shrink-0">
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 group-hover:text-[#0e274a]">
                            {svc.name}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {svc.desc}
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-slate-300 group-hover:text-[#0e274a] transition-all shrink-0 ml-2" />
                    </button>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No matching services found.</p>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-5 pt-3 pb-6 space-y-1.5 shadow-xl animate-fadeIn">
          {currentNavLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  active
                    ? (user ? 'bg-blue-50 text-blue-600 font-bold border-l-4 border-blue-600' : 'bg-[#faf5eb] text-[#b38318] font-bold border-l-4 border-[#b38318]')
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#0e274a]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 bg-[#0e274a] text-white rounded-lg font-semibold text-sm shadow hover:bg-[#163866] transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2.5 bg-[#0e274a] text-white rounded-lg font-semibold text-sm shadow hover:bg-[#163866] transition-colors"
              >
                Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
