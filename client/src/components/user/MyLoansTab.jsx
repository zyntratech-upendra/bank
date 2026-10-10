import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, Banknote, IndianRupee, Clock, CheckCircle2, AlertCircle, 
  FileText, ShieldCheck, ArrowRight, ExternalLink, Download, Copy, 
  Check, Search, Filter, Calendar, ChevronRight, X, Phone, Building2,
  RefreshCw, Briefcase, Sparkles, Layers
} from 'lucide-react';

const getStatusBadge = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'approved') {
    return {
      label: 'Approved',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dot: 'bg-emerald-500',
      step: 3
    };
  }
  if (s === 'disbursed') {
    return {
      label: 'Disbursed & Active',
      bg: 'bg-blue-50 text-blue-700 border-blue-200/80',
      dot: 'bg-blue-500',
      step: 4
    };
  }
  if (s.includes('kyc') || s.includes('pending') || s.includes('document')) {
    return {
      label: status || 'KYC Pending',
      bg: 'bg-amber-50 text-amber-700 border-amber-200/80',
      dot: 'bg-amber-500 animate-pulse',
      step: 2
    };
  }
  if (s.includes('review')) {
    return {
      label: 'Under Review',
      bg: 'bg-sky-50 text-sky-700 border-sky-200/80',
      dot: 'bg-sky-500 animate-pulse',
      step: 2
    };
  }
  if (s === 'rejected') {
    return {
      label: 'Rejected',
      bg: 'bg-rose-50 text-rose-700 border-rose-200/80',
      dot: 'bg-rose-500',
      step: 1
    };
  }
  return {
    label: status || 'In Progress',
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    step: 2
  };
};

const getLoanIcon = (loanType = '') => {
  const lt = loanType.toLowerCase();
  if (lt.includes('transfer') || lt.includes('renew')) return RefreshCw;
  if (lt.includes('business')) return Briefcase;
  if (lt.includes('lending') || lt.includes('one')) return Landmark;
  return Banknote;
};

const MyLoansTab = ({ applications = [], user = null, onNavigate }) => {
  const [filter, setFilter] = useState('all'); // 'all', 'active', 'pending', 'disbursed'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadSanction = (loan) => {
    setDownloadSuccess(true);
    // Create simulated Sanction Letter download
    const content = `SHAYAAN SWARNA MITRA - OFFICIAL SANCTION ADVICE\n` +
      `=====================================================\n` +
      `Application ID: ${loan.applicationId || loan._id}\n` +
      `Applicant Name: ${loan.applicantName || user?.name || 'Customer'}\n` +
      `Loan Facility: ${loan.loanType || 'Personal Loan'}\n` +
      `Sanctioned Amount: Rs. ${(loan.amount || 0).toLocaleString('en-IN')}\n` +
      `Interest Rate: ${loan.interestRate || '8.5'}% p.a.\n` +
      `Tenure: ${loan.loanTenure || 12} Months\n` +
      `Current Status: ${loan.status}\n` +
      `Branch: ${loan.branch || user?.branch || 'Vijayawada'}\n` +
      `Date of Sanction: ${new Date(loan.createdAt || Date.now()).toLocaleDateString('en-GB')}\n` +
      `=====================================================\n` +
      `This is a computer-generated sanction advice letter.`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Sanction_Letter_${loan.applicationId || 'LOAN'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  // Metrics calculation
  const metrics = useMemo(() => {
    let totalSanctioned = 0;
    let activeCount = 0;
    let pendingCount = 0;
    let nextEmi = 0;

    applications.forEach(app => {
      const amt = Number(app.amount) || 0;
      const status = (app.status || '').toLowerCase();
      if (status === 'approved' || status === 'disbursed') {
        totalSanctioned += amt;
        activeCount++;
        // Rough estimate of monthly EMI (8.5% over 12m)
        const emi = app.disbursementDetails?.monthlyEmi || Math.round((amt * 1.085) / (app.loanTenure || 12));
        nextEmi += emi;
      } else if (!status.includes('rejected')) {
        pendingCount++;
      }
    });

    return {
      totalSanctioned,
      activeCount,
      pendingCount,
      nextEmi
    };
  }, [applications]);

  // Filtered list
  const filteredLoans = useMemo(() => {
    return applications.filter(app => {
      const s = (app.status || '').toLowerCase();
      
      // Status filter
      if (filter === 'active' && s !== 'approved' && s !== 'disbursed') return false;
      if (filter === 'pending' && (s === 'approved' || s === 'disbursed' || s === 'rejected')) return false;
      if (filter === 'disbursed' && s !== 'disbursed') return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const appId = (app.applicationId || app._id || '').toLowerCase();
        const type = (app.loanType || '').toLowerCase();
        const branch = (app.branch || '').toLowerCase();
        if (!appId.includes(q) && !type.includes(q) && !branch.includes(q)) return false;
      }

      return true;
    });
  }, [applications, filter, searchQuery]);

  const totalPages = Math.ceil(filteredLoans.length / ITEMS_PER_PAGE);
  const currentLoans = filteredLoans.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Top Header & Metrics Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
              Customer Portal
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="text-xs font-semibold text-slate-500">Live Loan Tracking</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">My Loans & Applications</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor active loans, track application status, and view EMI payment schedules in real time.
          </p>
        </div>

        <button 
          onClick={() => onNavigate ? onNavigate('apply') : null}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#0e274a] via-[#1a3a6b] to-[#c48722] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-900/15 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all self-start md:self-auto shrink-0"
        >
          <Sparkles size={16} className="text-amber-300" />
          Apply for New Loan
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-blue-500/10 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Sanctioned</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            ₹{metrics.totalSanctioned.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-1">
            <ShieldCheck size={13} /> Across {metrics.activeCount} active facility
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-emerald-500/10 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Loans</p>
          <p className="text-xl sm:text-2xl font-black text-emerald-600">{metrics.activeCount}</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 size={13} /> Disbursed or Approved
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-amber-500/10 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">In Verification / KYC</p>
          <p className="text-xl sm:text-2xl font-black text-amber-600">{metrics.pendingCount}</p>
          <p className="text-[11px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
            <Clock size={13} /> Under officer review
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-3 -top-3 w-16 h-16 bg-indigo-500/10 rounded-full group-hover:scale-125 transition-transform duration-300"></div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimated Monthly EMI</p>
          <p className="text-xl sm:text-2xl font-black text-slate-900">
            ₹{metrics.nextEmi.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1 flex items-center gap-1">
            <Calendar size={13} /> Due on 10th of next month
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2">
        {/* Filter Pills */}
        <div className="inline-flex items-center p-1.5 bg-slate-200/60 backdrop-blur-md rounded-2xl gap-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === 'all' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Loans
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700">
              {applications.length}
            </span>
          </button>
          
          <button
            onClick={() => setFilter('active')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === 'active' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approved & Active
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
              {metrics.activeCount}
            </span>
          </button>

          <button
            onClick={() => setFilter('pending')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === 'pending' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Review / KYC
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800">
              {metrics.pendingCount}
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or loan type..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-slate-200/90 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-xs"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Loans Grid / Cards */}
      {filteredLoans.length === 0 ? (
        <div className="bg-white/70 backdrop-blur-xl border border-white/90 rounded-3xl p-12 text-center shadow-sm max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-inner">
            <img src="/logo.png" alt="Shayaan Swarna Mitra Logo" className="h-8 w-auto object-contain" />
          </div>
          <h3 className="text-base font-bold text-slate-800">
            {searchQuery ? 'No matching loans found' : 'No Loans Found in this category'}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6 leading-relaxed">
            {searchQuery 
              ? 'Try modifying your search term or select "All Loans" to view all your loan facilities.'
              : 'You have no loans under this filter. You can submit a fresh application in less than 2 minutes.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all"
              >
                Clear Search
              </button>
            )}
            <button
              onClick={() => onNavigate ? onNavigate('apply') : null}
              className="px-5 py-2.5 rounded-xl bg-[#0e274a] text-white text-xs font-bold hover:bg-[#153a6d] transition-all flex items-center gap-1.5 shadow-md shadow-blue-900/10"
            >
              <Sparkles size={14} className="text-amber-400" />
              Apply for Loan
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {currentLoans.map((loan, idx) => {
            const statusInfo = getStatusBadge(loan.status);
            const LoanIcon = getLoanIcon(loan.loanType);
            const appId = loan.applicationId || (loan._id ? `APP2026${loan._id.slice(-3).toUpperCase()}` : `LOAN-${1000 + idx}`);
            const amount = Number(loan.amount) || 0;
            const tenure = loan.loanTenure || (loan.tenure ? parseInt(loan.tenure) : 12);
            const rate = loan.interestRate || 8.5;
            const emi = loan.disbursementDetails?.monthlyEmi || Math.round((amount * (1 + (rate / 100))) / tenure);
            const isApproved = (loan.status || '').toLowerCase() === 'approved';
            const isDisbursed = (loan.status || '').toLowerCase() === 'disbursed';
            const isSanctioned = isApproved || isDisbursed;

            // Stepper status
            const currentStep = statusInfo.step; // 1, 2, 3, 4

            return (
              <div 
                key={loan._id || idx}
                className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.12)] hover:border-blue-200 transition-all duration-300 relative overflow-hidden group"
              >
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isSanctioned ? 'from-emerald-400 to-teal-500' : 'from-blue-400 to-indigo-500'}`}></div>
                
                {/* Top Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-50 to-indigo-50 border border-blue-100/80 text-blue-700 flex items-center justify-center shrink-0 shadow-xs">
                      <LoanIcon size={22} className="stroke-[2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900">{loan.loanType || 'Personal Loan'}</h3>
                        <span className="text-slate-300 text-xs">•</span>
                        <div className="inline-flex items-center gap-1 text-xs font-mono font-bold text-slate-500 bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/60">
                          <span>#{appId}</span>
                          <button 
                            onClick={() => handleCopyId(appId)} 
                            className="text-slate-400 hover:text-slate-700 transition-colors"
                            title="Copy Application ID"
                          >
                            {copiedId === appId ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                          </button>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5 flex items-center gap-1.5">
                        <Building2 size={12} className="text-slate-400" />
                        <span>Branch: {loan.branch || user?.branch || 'Vijayawada Main Branch'}</span>
                        <span>•</span>
                        <Calendar size={12} className="text-slate-400" />
                        <span>
                          Applied: {new Date(loan.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] ${statusInfo.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dot}`}></span>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Financial Overview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5 border-b border-slate-100">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Loan Amount</p>
                    <p className="text-lg sm:text-xl font-black text-slate-900 flex items-baseline">
                      ₹{amount ? amount.toLocaleString('en-IN') : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Interest Rate</p>
                    <p className="text-base sm:text-lg font-bold text-slate-800">
                      {isSanctioned ? (
                        <>{rate}% <span className="text-xs font-medium text-slate-400">p.a.</span></>
                      ) : (
                        <span className="text-sm font-semibold text-slate-400 italic">Pending Admin</span>
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Tenure</p>
                    <p className="text-base sm:text-lg font-bold text-slate-800">
                      {tenure} <span className="text-xs font-medium text-slate-400">Months</span>
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Estimated EMI</p>
                    <p className={`text-base sm:text-lg font-bold ${isSanctioned ? 'text-blue-700' : 'text-slate-400'}`}>
                      {isSanctioned ? (
                        <>₹{emi ? emi.toLocaleString('en-IN') : 'N/A'} <span className="text-[10px] font-medium text-slate-400">/ mo</span></>
                      ) : (
                        <span className="text-sm font-semibold italic">Pending Admin</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Interactive Status Stepper */}
                <div className="pt-5 pb-3">
                  <div className="relative">
                    <div className="hidden sm:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-slate-100 z-0" />
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative z-10">
                      {/* Step 1 */}
                      <div className="flex items-center sm:flex-col sm:text-center gap-2 sm:gap-1.5 p-2 rounded-xl bg-slate-50/60 sm:bg-transparent">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shadow-xs shrink-0">
                          <Check size={14} className="stroke-[3]" />
                        </div>
                        <div>
                          <p className="text-[11px] font-bold text-slate-800">Submitted</p>
                          <p className="text-[10px] text-slate-400 hidden sm:block">Application received</p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="flex items-center sm:flex-col sm:text-center gap-2 sm:gap-1.5 p-2 rounded-xl bg-slate-50/60 sm:bg-transparent">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-xs shrink-0 ${
                          currentStep >= 2 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {currentStep > 2 ? <Check size={14} className="stroke-[3]" /> : '2'}
                        </div>
                        <div>
                          <p className={`text-[11px] font-bold ${currentStep >= 2 ? 'text-slate-800' : 'text-slate-400'}`}>
                            KYC & Documents
                          </p>
                          <p className="text-[10px] text-slate-400 hidden sm:block">Identity verification</p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex items-center sm:flex-col sm:text-center gap-2 sm:gap-1.5 p-2 rounded-xl bg-slate-50/60 sm:bg-transparent">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-xs shrink-0 ${
                          currentStep >= 3 
                            ? 'bg-emerald-500 text-white' 
                            : currentStep === 2 
                            ? 'bg-amber-400 text-amber-900 animate-pulse' 
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {currentStep >= 3 ? <Check size={14} className="stroke-[3]" /> : '3'}
                        </div>
                        <div>
                          <p className={`text-[11px] font-bold ${currentStep >= 3 ? 'text-slate-800' : 'text-slate-400'}`}>
                            Credit Approval
                          </p>
                          <p className="text-[10px] text-slate-400 hidden sm:block">Bank manager sanction</p>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="flex items-center sm:flex-col sm:text-center gap-2 sm:gap-1.5 p-2 rounded-xl bg-slate-50/60 sm:bg-transparent">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-xs shrink-0 ${
                          currentStep >= 4 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          {currentStep >= 4 ? <Check size={14} className="stroke-[3]" /> : '4'}
                        </div>
                        <div>
                          <p className={`text-[11px] font-bold ${currentStep >= 4 ? 'text-blue-700' : 'text-slate-400'}`}>
                            Disbursed
                          </p>
                          <p className="text-[10px] text-slate-400 hidden sm:block">Amount transferred</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 mt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>Govt. Bank Partner Protocol</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* View Details Button */}
                    <button
                      onClick={() => setSelectedLoan(loan)}
                      className="px-4 py-2 bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <FileText size={14} />
                      Loan Details
                    </button>

                    {/* Download Sanction Letter if approved */}
                    {(isApproved || isDisbursed) && (
                      <button
                        onClick={() => handleDownloadSanction(loan)}
                        className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 border border-blue-200/60"
                      >
                        <Download size={14} />
                        Sanction Letter
                      </button>
                    )}

                    {/* Pay EMI button if approved or disbursed */}
                    {(isApproved || isDisbursed) && (
                      <button
                        onClick={() => onNavigate ? onNavigate('payments') : null}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
                      >
                        <IndianRupee size={13} />
                        Pay EMI
                      </button>
                    )}

                    {/* If KYC/Document Pending, button to upload documents */}
                    {!isApproved && !isDisbursed && (
                      <button
                        onClick={() => onNavigate ? onNavigate('documents') : null}
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Clock size={14} />
                        Check Verification
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && filteredLoans.length > 0 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <span className="text-xs text-slate-500 font-medium">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredLoans.length)} of {filteredLoans.length} Loans
          </span>
          <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-slate-600 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              Prev
            </button>
            <div className="flex items-center gap-1 px-1 border-x border-slate-100">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                    currentPage === i + 1 
                      ? 'bg-[#0e274a] text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg text-slate-600 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Loan Details Modal */}
      <AnimatePresence>
        {selectedLoan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100 p-6 sm:p-8 relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 font-bold">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900">
                      Loan Facility Details
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                      #{selectedLoan.applicationId || selectedLoan._id}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedLoan(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="py-6 space-y-6">
                {/* Summary Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-blue-800 uppercase tracking-wider">Sanctioned Facility</p>
                    <p className="text-xl font-black text-slate-900 mt-0.5">
                      ₹{Number(selectedLoan.amount || 0).toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {selectedLoan.loanType} • {selectedLoan.loanTenure || 12} Months
                    </p>
                  </div>
                  <div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(selectedLoan.status).bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${getStatusBadge(selectedLoan.status).dot}`}></span>
                      {selectedLoan.status || 'Active'}
                    </span>
                  </div>
                </div>

                {/* Terms Breakdown */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Facility Breakdown</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Interest Rate</span>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">
                        {((selectedLoan.status || '').toLowerCase() === 'approved' || (selectedLoan.status || '').toLowerCase() === 'disbursed') 
                          ? `${selectedLoan.interestRate || '8.5'}% p.a.` 
                          : <span className="text-slate-400 italic font-medium">Pending Admin</span>}
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Processing Fee</span>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">0.5% (Waived)</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Tenure</span>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">{selectedLoan.loanTenure || 12} Months</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Repayment Mode</span>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">Monthly Auto-Debit / UPI</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Branch Code</span>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">{selectedLoan.branch || user?.branch || 'Vijayawada'}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned Officer</span>
                      <p className="text-sm font-bold text-slate-800 mt-0.5">{selectedLoan.assignedTo || 'Ravi Kumar'}</p>
                    </div>
                  </div>
                </div>

                {/* Document Verification State */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Document Checklist</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-150 text-xs">
                      <span className="font-bold text-slate-700">Aadhaar Card UIDAI</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={14} /> Verified
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-150 text-xs">
                      <span className="font-bold text-slate-700">PAN Card Income Tax Dept</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={14} /> Verified
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-150 text-xs">
                      <span className="font-bold text-slate-700">Bank Statement & Repayment Mandate</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 size={14} /> Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Need help row */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-amber-700 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-900">Branch Helpdesk Support</p>
                      <p className="text-[11px] text-amber-700">Contact Vijayawada branch representative at 1800-425-BANK</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigate ? onNavigate('support') : null}
                    className="text-xs font-bold text-amber-800 hover:underline"
                  >
                    Open Ticket
                  </button>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedLoan(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadSanction(selectedLoan)}
                    className="px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    Download Sanction
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLoan(null);
                      if (onNavigate) onNavigate('payments');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#0e274a] text-white text-xs font-bold hover:bg-[#153a6d] transition-colors"
                  >
                    Make Payment
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyLoansTab;
