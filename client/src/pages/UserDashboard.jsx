import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Landmark, CreditCard, Clock, CheckCircle2, AlertCircle, 
  FileText, ShieldCheck, Upload, Banknote, IndianRupee, ArrowRight,
  MapPin, Loader2, Navigation, Coins, Sparkles, TrendingUp, ChevronDown,
  Building2, Briefcase, Home, RefreshCw, Zap
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const formatBankName = (name = '') => {
  if (!name) return 'Partner Bank';
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const getBankMeta = (bankName = '') => {
  const name = (bankName || '').toLowerCase();
  if (name.includes('union')) {
    return {
      initials: 'UBI',
      gradient: 'from-blue-600 via-indigo-600 to-red-600',
    };
  }
  if (name.includes('canara')) {
    return {
      initials: 'CB',
      gradient: 'from-sky-500 via-blue-600 to-amber-500',
    };
  }
  if (name.includes('indian')) {
    return {
      initials: 'IB',
      gradient: 'from-blue-700 via-indigo-800 to-sky-700',
    };
  }
  if (name.includes('sbi') || name.includes('state bank')) {
    return {
      initials: 'SBI',
      gradient: 'from-sky-600 via-blue-700 to-cyan-700',
    };
  }
  if (name.includes('hdfc')) {
    return {
      initials: 'HDFC',
      gradient: 'from-blue-800 via-indigo-800 to-rose-600',
    };
  }
  if (name.includes('icici')) {
    return {
      initials: 'ICICI',
      gradient: 'from-amber-600 via-orange-600 to-rose-700',
    };
  }
  if (name.includes('baroda') || name.includes('bob')) {
    return {
      initials: 'BOB',
      gradient: 'from-orange-500 via-amber-600 to-rose-600',
    };
  }
  if (name.includes('pnb') || name.includes('punjab')) {
    return {
      initials: 'PNB',
      gradient: 'from-rose-700 via-red-800 to-amber-700',
    };
  }
  
  const initials = bankName
    ? bankName.split(' ').map(w => w[0]).join('').slice(0, 3).toUpperCase()
    : 'BNK';
  return {
    initials: initials || 'BNK',
    gradient: 'from-slate-700 via-slate-800 to-slate-900',
  };
};

const getServiceMeta = (serviceTitle = '') => {
  const title = (serviceTitle || '').toLowerCase();
  if (title.includes('business')) {
    return {
      icon: Briefcase,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      badge: 'Low Rate'
    };
  }
  if (title.includes('home')) {
    return {
      icon: Home,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      badge: 'Long Tenure'
    };
  }
  if (title.includes('renew') || title.includes('transfer')) {
    return {
      icon: RefreshCw,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      badge: 'Quick Switch'
    };
  }
  return {
    icon: ShieldCheck,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    badge: 'Fast Disbursal'
  };
};

import ApplyLoanTab from '../components/user/ApplyLoanTab';
import MyLoansTab from '../components/user/MyLoansTab';
import PaymentsTab from '../components/user/PaymentsTab';
import DocumentsTab from '../components/user/DocumentsTab';
import SupportTab from '../components/user/SupportTab';
import ProfileTab from '../components/user/ProfileTab';
import SettingsTab from '../components/user/SettingsTab';

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const currentTab = query.get('tab') || 'dashboard';
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bank_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [applications, setApplications] = useState([]);
  const [bankRates, setBankRates] = useState([]);
  const [dynamicServices, setDynamicServices] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [loading, setLoading] = useState(!localStorage.getItem('bank_user'));
  const [selectedCity, setSelectedCity] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  const filteredBankRates = useMemo(() => {
    if (!bankRates || bankRates.length === 0) return [];
    if (!selectedCity) return bankRates;
    return bankRates.filter(r => (r.cityName || '').toLowerCase() === selectedCity.toLowerCase());
  }, [bankRates, selectedCity]);

  const maxGoldRate = useMemo(() => {
    if (!filteredBankRates.length) return 0;
    return Math.max(...filteredBankRates.map(r => Number(r.goldRatePerGram) || 0));
  }, [filteredBankRates]);

  const minInterestRate = useMemo(() => {
    if (!filteredBankRates.length) return 999;
    return Math.min(...filteredBankRates.map(r => Number(r.interestRate) || 999));
  }, [filteredBankRates]);

  const handleDetectLocation = () => {
    setIsDetecting(true);
    if (!navigator.geolocation) {
      setIsDetecting(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.village || 'Vijayawada';
        setSelectedCity(city);
      } catch (err) {
        console.error(err);
      } finally {
        setIsDetecting(false);
      }
    }, () => {
      setIsDetecting(false);
    });
  };

  useEffect(() => {
    const token = localStorage.getItem('bank_token') || localStorage.getItem('bank_admin_token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Safety timeout: Never keep the user waiting on a spinner longer than 1 second
    const safetyTimer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    const fetchDashboardData = async () => {
      try {
        // Fetch current user with fast timeout
        try {
          const userRes = await api.get('/auth/me');
          if (userRes.data?.user) {
            setUser(userRes.data.user);
            setSelectedCity(userRes.data.user.branch || 'Vijayawada');
            localStorage.setItem('bank_user', JSON.stringify(userRes.data.user));
          }
        } catch (uErr) {
          console.warn('User info fallback to cached profile:', uErr.message);
          const cachedUser = localStorage.getItem('bank_user');
          if (cachedUser) {
            try {
              setUser(JSON.parse(cachedUser));
            } catch (e) {}
          }
        }
        
        // Fetch applications and service requests
        try {
          const [appRes, srRes] = await Promise.all([
            api.get('/auth/me/applications').catch(() => ({ data: [] })),
            api.get('/auth/me/service-requests').catch(() => ({ data: [] }))
          ]);
          
          let combined = [];
          if (appRes.data && Array.isArray(appRes.data)) {
            combined = [...appRes.data];
          }
          if (srRes.data && Array.isArray(srRes.data)) {
            const formattedSRs = srRes.data.map(sr => {
              // Try to extract an amount from formData
              let extractedAmount = null;
              if (sr.formData) {
                const keysToCheck = ['Issued Amount', 'Expected Return Amount', 'Loan Amount Outstanding', 'Loan Amount', 'Amount', 'Final Settlement Value'];
                for (const key of keysToCheck) {
                  if (sr.formData[key]) {
                    const val = Number(sr.formData[key].toString().replace(/[^0-9.]/g, ''));
                    if (!isNaN(val) && val > 0) {
                      extractedAmount = val;
                      break;
                    }
                  }
                }
                if (!extractedAmount) {
                  for (const [key, value] of Object.entries(sr.formData)) {
                    if ((key.toLowerCase().includes('amount') || key.toLowerCase().includes('value')) && value) {
                      const val = Number(value.toString().replace(/[^0-9.]/g, ''));
                      if (!isNaN(val) && val > 0) {
                        extractedAmount = val;
                        break;
                      }
                    }
                  }
                }
              }

              return {
                _id: sr._id,
                applicationId: sr.requestId || `SR${sr._id.slice(-6).toUpperCase()}`,
                loanType: sr.serviceName,
                amount: extractedAmount,
                status: sr.status,
                createdAt: sr.createdAt,
                isServiceRequest: true
              };
            });
            combined = [...combined, ...formattedSRs];
          }
          
          // Sort by newest first
          combined.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
          setApplications(combined);
        } catch (err) {
          console.warn('Applications fetch failed, using fallback:', err.message);
        }
      } catch (error) {
        console.error('Failed to load dashboard:', error);
      } finally {
        clearTimeout(safetyTimer);
        setLoading(false);
      }
    };

    const fetchPublicData = async () => {
      try {
        const [ratesRes, servicesRes, locRes] = await Promise.all([
          api.get('/public/bank-rates'),
          api.get('/public/dynamic-services'),
          api.get('/public/locations')
        ]);
        setBankRates(ratesRes.data || []);
        setDynamicServices(servicesRes.data || []);
        setLocationsList(locRes.data || []);
      } catch (err) {
        console.error('Failed to load public data', err);
      }
    };

    fetchDashboardData();
    fetchPublicData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfdfd] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0e274a]/20 border-t-[#c48722] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const totalLoanAmount = applications.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const activeLoans = applications.filter(app => app.status === 'Approved').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] pb-20 relative overflow-hidden">
      
      {/* Ambient Glassmorphism Background Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        


        {/* Top Stats Grid (Only on Dashboard) */}
        {currentTab === 'dashboard' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {/* Active Loans */}
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <img src="/logo.png" alt="Shayaan Swarna Mitra Logo" className="h-8 w-auto object-contain" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Active Loans</p>
                <p className="text-3xl font-black text-slate-800">{activeLoans}</p>
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <IndianRupee size={24} className="stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Loan Amount</p>
                <p className="text-3xl font-black text-slate-800">₹{totalLoanAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>



          {/* Applications */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#c48722]/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#c48722] flex items-center justify-center border border-orange-100">
                <FileText size={24} className="stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Applications</p>
                <p className="text-3xl font-black text-slate-800">{applications.length}</p>
              </div>
            </div>
          </div>
          </motion.div>
        )}

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Content) */}
          <div className={`space-y-8 ${currentTab === 'dashboard' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            
            {currentTab === 'dashboard' && (
              <>
                {/* Quick Actions */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <button onClick={() => navigate('/dashboard?tab=apply')} className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3 text-center group">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Banknote size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Apply for Gold Loan</span>
                    </button>
                    <button onClick={() => navigate('/dashboard?tab=apply')} className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3 text-center group">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <CreditCard size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Transfer Loan</span>
                    </button>
                    <button onClick={() => navigate('/dashboard?tab=documents')} className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3 text-center group">
                      <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <Upload size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Upload Documents</span>
                    </button>
                    <button onClick={() => navigate('/dashboard?tab=payments')} className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3 text-center group">
                      <div className="w-12 h-12 rounded-full bg-[#0e274a]/10 text-[#0e274a] flex items-center justify-center border border-[#0e274a]/20 group-hover:bg-[#0e274a] group-hover:text-white transition-colors">
                        <IndianRupee size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Pay EMI</span>
                    </button>
                  </div>
                </motion.div>

                {/* Today's Gold Rates & Available Services */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Today's Gold Rates Card */}
                  <div className="bg-white/80 backdrop-blur-xl border border-amber-200/70 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group/card">
                    {/* Ambient Warm Golden Glow */}
                    <div className="absolute -top-16 -right-16 w-44 h-44 bg-gradient-to-br from-amber-300/30 via-yellow-200/15 to-transparent rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500" />

                    <div>
                      {/* Card Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white flex items-center justify-center shadow-md shadow-amber-500/20 ring-4 ring-amber-50 shrink-0">
                            <Coins size={20} className="stroke-[2.2]" />
                          </div>
                          <div>
                            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                              Today's Gold Rates
                            </h2>
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700 mt-0.5">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                              </span>
                              Live Market LTV • 22K & 24K
                            </div>
                          </div>
                        </div>

                        {/* City / Branch Selector */}
                        <div className="relative inline-flex items-center bg-white/90 border border-slate-200/90 hover:border-amber-400 focus-within:border-amber-500 rounded-xl px-2.5 py-1.5 shadow-xs text-xs font-bold text-slate-700 transition-all">
                          <MapPin size={12} className="text-amber-600 mr-1.5 shrink-0" />
                          <select 
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="appearance-none bg-transparent text-xs font-bold text-slate-700 outline-none pr-4 cursor-pointer hover:text-slate-900 transition-colors"
                          >
                            <option value="">All Branches</option>
                            {locationsList.map((loc, i) => {
                              const cName = loc.city || loc.cityName || loc.name || 'Branch';
                              return <option key={i} value={cName}>{cName}</option>;
                            })}
                            {locationsList.length === 0 && (
                              <>
                                <option value="Vijayawada">Vijayawada</option>
                                <option value="Hyderabad">Hyderabad</option>
                                <option value="Chennai">Chennai</option>
                              </>
                            )}
                          </select>
                          <ChevronDown size={12} className="text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* Rates List */}
                      {filteredBankRates && filteredBankRates.length > 0 ? (
                        <div className="space-y-3">
                          {filteredBankRates.slice(0, 3).map((rate, idx) => {
                            const bankMeta = getBankMeta(rate.bankName);
                            const isHighestRate = maxGoldRate > 0 && Number(rate.goldRatePerGram) === maxGoldRate;
                            const isLowestInterest = minInterestRate < 999 && Number(rate.interestRate) === minInterestRate;

                            return (
                              <div 
                                key={idx} 
                                onClick={() => navigate('/dashboard?tab=apply')}
                                className="group/item cursor-pointer p-3.5 rounded-2xl bg-white border border-slate-150/80 hover:border-amber-400 hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3 relative overflow-hidden"
                              >
                                {/* Left Accent Strip on Hover */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />

                                {/* Bank Brand & Info */}
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bankMeta.gradient} text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0 tracking-tight`}>
                                    {bankMeta.initials}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-sm font-bold text-slate-900 group-hover/item:text-amber-800 transition-colors truncate">
                                        {formatBankName(rate.bankName || 'Partner Bank')}
                                      </span>
                                      {isHighestRate && (
                                        <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md border border-amber-200">
                                          ★ Best LTV
                                        </span>
                                      )}
                                      {isLowestInterest && !isHighestRate && (
                                        <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold uppercase tracking-wide bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md border border-emerald-200">
                                          ⚡ Low ROI
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                                      <MapPin size={10} className="text-slate-400 shrink-0" />
                                      <span className="truncate">{rate.branchName || rate.cityName || 'City Branch'}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Rates Columns */}
                                <div className="flex items-center gap-3 shrink-0">
                                  <div className="text-right">
                                    <div className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-none">
                                      ₹{Number(rate.goldRatePerGram).toLocaleString('en-IN')}
                                      <span className="text-[10px] font-medium text-slate-400 ml-0.5">/g</span>
                                    </div>
                                    <div className="mt-1 flex items-center justify-end">
                                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 rounded-md leading-tight">
                                        {rate.interestRate}% <span className="font-normal text-slate-500">p.a</span>
                                      </span>
                                    </div>
                                  </div>

                                  <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover/item:bg-amber-500 text-slate-500 group-hover/item:text-white flex items-center justify-center transition-all shrink-0">
                                    <ArrowRight size={13} />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-8 bg-slate-50/70 rounded-2xl text-center border border-dashed border-slate-200">
                          <Coins size={28} className="text-slate-300 mx-auto mb-2" />
                          <p className="text-xs font-semibold text-slate-600">No rates listed for {selectedCity || 'this branch'}</p>
                          <button 
                            onClick={() => setSelectedCity('')} 
                            className="mt-2 text-[11px] font-bold text-amber-600 hover:text-amber-800 underline"
                          >
                            View all branches
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Card Bottom CTA Strip */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100/90 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1 font-medium">
                        <Sparkles size={12} className="text-amber-500" /> Instant pledge valuation
                      </span>
                      <button 
                        onClick={() => navigate('/dashboard?tab=apply')}
                        className="font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
                      >
                        Apply Gold Loan <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Featured Services Card */}
                  <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between group/card">
                    {/* Ambient Blue Glow & Top Line */}
                    <div className="absolute -top-16 -right-16 w-44 h-44 bg-gradient-to-br from-blue-300/20 via-indigo-200/10 to-transparent rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-400 to-sky-400" />

                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center shadow-md shadow-blue-500/20 ring-4 ring-blue-50 shrink-0">
                            <ShieldCheck size={20} className="stroke-[2.2]" />
                          </div>
                          <div>
                            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                              Featured Services
                            </h2>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                              Tailored lending & credit solutions
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => navigate('/services')}
                          className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                        >
                          View All <ArrowRight size={11} />
                        </button>
                      </div>

                      {dynamicServices && dynamicServices.length > 0 ? (
                        <div className="space-y-3">
                          {dynamicServices.slice(0, 3).map((service, idx) => {
                            const meta = getServiceMeta(service.title);
                            const ServiceIcon = meta.icon;
                            return (
                              <div 
                                key={idx} 
                                onClick={() => navigate('/services')}
                                className="group/srv cursor-pointer p-3.5 rounded-2xl bg-white border border-slate-150/80 hover:border-blue-400 hover:shadow-md transition-all duration-200 flex items-center justify-between gap-3 relative overflow-hidden"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 transition-colors ${meta.color} group-hover/srv:bg-blue-600 group-hover/srv:text-white group-hover/srv:border-blue-600`}>
                                    <ServiceIcon size={18} />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-sm font-bold text-slate-800 group-hover/srv:text-blue-700 transition-colors truncate capitalize">
                                        {service.title}
                                      </span>
                                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60 hidden sm:inline-block">
                                        {meta.badge}
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                                      {service.description || 'Explore competitive interest rates and rapid approvals.'}
                                    </p>
                                  </div>
                                </div>

                                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover/srv:bg-blue-600 text-slate-500 group-hover/srv:text-white flex items-center justify-center transition-all shrink-0">
                                  <ArrowRight size={13} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-8 bg-slate-50/70 rounded-2xl text-center border border-dashed border-slate-200">
                          <ShieldCheck size={28} className="text-slate-300 mx-auto mb-2" />
                          <p className="text-xs font-semibold text-slate-500">More services coming soon.</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3.5 border-t border-slate-100/90 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1 font-medium">
                        <CheckCircle2 size={12} className="text-emerald-500" /> Fast approvals with zero paperwork hassle
                      </span>
                      <button 
                        onClick={() => navigate('/services')}
                        className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline"
                      >
                        Explore All <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>
                </motion.div>

                {/* Recent Applications Table */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-5 border-b border-white/60 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Recent Applications & Requests</h2>
                    <button onClick={() => navigate('/dashboard?tab=loans')} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      View All <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/40">
                          <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/50">Service</th>
                          <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/50">Amount</th>
                          <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/50">Applied On</th>
                          <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/50">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app, idx) => (
                          <tr key={idx} className="border-b border-white/30 hover:bg-white/50 transition-colors">
                            <td className="py-4 px-6">
                              <span className="text-sm font-bold text-slate-800">{app.loanType || 'Gold Loan'}</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-sm font-semibold text-slate-700">₹{app.amount ? app.amount.toLocaleString('en-IN') : 'N/A'}</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-xs font-semibold text-slate-500">
                                {new Date(app.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                               <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                                  app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20' :
                                  app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-700 border border-rose-500/20' :
                                  'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                                }`}>
                                  {app.status || 'Pending'}
                                </span>
                            </td>
                          </tr>
                        ))}
                        {applications.length === 0 && (
                          <tr>
                            <td colSpan="4" className="py-8 text-center text-slate-400 text-sm font-medium">No applications found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </>
            )}

            {currentTab === 'apply' && (
              <ApplyLoanTab 
                user={user}
                bankRates={bankRates}
                dynamicServices={dynamicServices}
                locationsList={locationsList}
                onApplicationSubmitted={(newApp) => {
                  setApplications(prev => [newApp, ...prev]);
                }}
              />
            )}
            {currentTab === 'loans' && (
              <MyLoansTab 
                applications={applications} 
                user={user} 
                onNavigate={(tab) => navigate('/dashboard?tab=' + tab)} 
              />
            )}
            {currentTab === 'payments' && <PaymentsTab applications={applications} />}
            {currentTab === 'documents' && <DocumentsTab user={user} />}
            {currentTab === 'support' && <SupportTab />}
            {currentTab === 'profile' && <ProfileTab user={user} />}
            {currentTab === 'settings' && <SettingsTab />}

          </div>

          {/* Right Column (Sidebar) - Only on Dashboard */}
          {currentTab === 'dashboard' && (
            <div className="lg:col-span-1 space-y-8">
              
              {/* My Profile / Documents */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm"
            >
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center justify-between">
                My Profile
                <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 hover:bg-blue-100 transition-colors">Edit</button>
              </h2>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/60">
                <div className="w-16 h-16 rounded-2xl bg-white border border-white/80 shadow-md p-1 shrink-0 overflow-hidden">
                  <img 
                    src={user.profilePicUrl || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0e274a&color=fff&size=128`} 
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0e274a&color=fff&size=128`; }}
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-xl" 
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">{user.name}</h3>
                  <p className="text-xs font-semibold text-slate-500">{user.email}</p>
                </div>
              </div>

              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Verification Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/60">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-emerald-600" />
                    <span className="text-sm font-bold text-slate-700">Aadhaar Card</span>
                  </div>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/60">
                  <div className="flex items-center gap-3">
                    <CreditCard size={16} className="text-blue-600" />
                    <span className="text-sm font-bold text-slate-700">PAN Card</span>
                  </div>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/60">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-rose-500" />
                    <span className="text-sm font-bold text-slate-700">Income Proof</span>
                  </div>
                  <AlertCircle size={16} className="text-rose-500" />
                </div>
              </div>

            </motion.div>

          </div>
          )}
          
        </div>
      </div>
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
