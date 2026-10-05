import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Landmark, Menu, X, Search, Coins, RefreshCw, HandCoins, User, Briefcase, Phone, ArrowRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);

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

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

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
      return location.pathname === '/';
    }
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo - Matches Mockup Exactly: Blue temple icon without box + text */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <Landmark size={32} className="stroke-[2.2] text-[#0e274a] group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-[#0e274a] leading-none">
                BANKING
              </span>
              <span className="text-[11px] font-extrabold tracking-[0.22em] text-[#0e274a] leading-none mt-1">
                SERVICES
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-[14px] font-semibold transition-all duration-200 relative py-1 ${
                    active
                      ? 'text-[#b38318] font-bold'
                      : 'text-slate-700 hover:text-[#0e274a]'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#b38318] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Elements: Search Icon, Login Button, Register Button */}
          <div className="hidden sm:flex items-center space-x-4">
            
            {/* Search Toggle */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
                className="p-2 text-slate-700 hover:text-[#0e274a] hover:bg-slate-100 rounded-full transition-colors"
              >
                <Search size={20} />
              </button>

              {/* Minimalist Search Popup */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 animate-fadeIn">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
                    <Search size={18} className="text-slate-400" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search Gold loan, Transfer, Rates..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full text-sm outline-none text-slate-800 placeholder-slate-400 font-medium"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="text-xs text-slate-400 hover:text-slate-600">
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
                              <div className="w-8 h-8 rounded-lg bg-[#faf5eb] text-[#c48722] flex items-center justify-center">
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
                            <ArrowRight size={14} className="text-slate-300 group-hover:text-[#0e274a] transition-all" />
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

            {/* Login Button (Outlined) */}
            <Link
              to="/login"
              className="px-6 py-2 text-[14px] font-semibold text-slate-800 hover:text-[#0e274a] border border-slate-300 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all shadow-xs"
            >
              Login
            </Link>

            {/* Register Button (Solid Dark Blue) */}
            <Link
              to="/register"
              className="px-6 py-2 text-[14px] font-semibold text-white bg-[#0e274a] hover:bg-[#163866] rounded-lg transition-all shadow-xs hover:shadow"
            >
              Register
            </Link>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
            >
              <Search size={20} />
            </button>
            <Link
              to="/login"
              className="text-xs font-semibold px-3 py-1.5 border border-slate-300 rounded-md text-slate-700"
            >
              Login
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 px-5 pt-3 pb-6 space-y-1.5 shadow-xl animate-fadeIn">
          {navLinks.map((link) => {
            const active = isLinkActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-[#faf5eb] text-[#b38318] font-bold border-l-4 border-[#b38318]'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-[#0e274a]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/register"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2.5 bg-[#0e274a] text-white rounded-lg font-semibold text-sm shadow hover:bg-[#163866] transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
