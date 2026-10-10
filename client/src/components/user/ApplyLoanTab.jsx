import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Landmark, ArrowRight, ShieldCheck, Briefcase, IndianRupee, 
  MapPin, Calendar, FileText, User, Phone, Mail, 
  CheckCircle2, AlertCircle, Loader2, RefreshCw
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/api';

const ApplyLoanTab = ({ 
  user = null, 
  bankRates = [], 
  dynamicServices = [], 
  locationsList = [],
  onApplicationSubmitted 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const preselectedBank = query.get('bank') || '';
  const preselectedType = query.get('type') || '';

  // Local fallback state if props not loaded
  const [servicesData, setServicesData] = useState(dynamicServices);
  const [ratesData, setRatesData] = useState(bankRates);
  const [branchesData, setBranchesData] = useState(locationsList);

  useEffect(() => {
    if (dynamicServices.length > 0) setServicesData(dynamicServices);
    if (bankRates.length > 0) setRatesData(bankRates);
    if (locationsList.length > 0) setBranchesData(locationsList);
  }, [dynamicServices, bankRates, locationsList]);

  // If props were empty, fetch from public API
  useEffect(() => {
    if (servicesData.length === 0 || ratesData.length === 0 || branchesData.length === 0) {
      const fetchPublicData = async () => {
        try {
          const [srvRes, ratesRes, locRes] = await Promise.all([
            api.get('/public/dynamic-services').catch(() => ({ data: [] })),
            api.get('/public/bank-rates').catch(() => ({ data: [] })),
            api.get('/public/locations').catch(() => ({ data: [] }))
          ]);
          if (srvRes.data?.length > 0) setServicesData(srvRes.data);
          if (ratesRes.data?.length > 0) setRatesData(ratesRes.data);
          if (locRes.data?.length > 0) setBranchesData(locRes.data);
        } catch (err) {
          console.error('Error fetching public options:', err);
        }
      };
      fetchPublicData();
    }
  }, []);

  // Form State without gold data
  const [formData, setFormData] = useState({
    applicantName: user?.name || user?.fullName || '',
    applicantMobile: user?.phone || user?.mobile || '',
    applicantEmail: user?.email || '',
    branch: user?.branch || 'Vijayawada',
    loanType: preselectedType || 'Personal Loan',
    amount: '',
    tenure: '12',
    purpose: ''
  });

  // Keep form updated when user loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        applicantName: prev.applicantName || user.name || user.fullName || '',
        applicantMobile: prev.applicantMobile || user.phone || user.mobile || '',
        applicantEmail: prev.applicantEmail || user.email || '',
        branch: prev.branch || user.branch || 'Vijayawada'
      }));
    }
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedApp, setSubmittedApp] = useState(null);

  // Derived Dynamic Loan Types List
  const loanTypeOptions = useMemo(() => {
    const defaultTypes = ['Personal Loan', 'Business Loan', 'Home Loans', 'Loan Transfer', 'Education Loan', 'One Lending'];
    const dynamicTitles = servicesData.map(s => {
      if (typeof s === 'string') return s;
      if (s && typeof s === 'object') return s.title || s.name || '';
      return '';
    }).filter(Boolean);
    const combined = Array.from(new Set([...defaultTypes, ...dynamicTitles]));
    return combined;
  }, [servicesData]);

  // Derived Locations List
  const branchOptions = useMemo(() => {
    const list = branchesData.map(b => {
      if (typeof b === 'string') return b;
      if (b && typeof b === 'object') return b.city || b.cityName || b.name || '';
      return '';
    }).filter(Boolean);
    const defaults = ['Vijayawada', 'Hyderabad', 'Chennai', 'Bengaluru', 'Visakhapatnam'];
    return Array.from(new Set([...list, ...defaults]));
  }, [branchesData]);

  // Quick Amount presets
  const amountChips = [100000, 300000, 500000, 1000000, 1500000];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleChipClick = (val) => {
    setFormData(prev => ({ ...prev, amount: String(val) }));
    if (errorMsg) setErrorMsg('');
  };

  const handlePurposePreset = (purposeText) => {
    setFormData(prev => ({ ...prev, purpose: purposeText }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.applicantName.trim()) {
      setErrorMsg('Please enter applicant full name');
      return;
    }
    if (!formData.applicantMobile.trim() || formData.applicantMobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      setErrorMsg('Please specify a valid loan amount');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        applicantName: formData.applicantName.trim(),
        applicantMobile: formData.applicantMobile.trim(),
        applicantEmail: formData.applicantEmail.trim(),
        loanType: formData.loanType,
        amount: Number(formData.amount),
        branch: formData.branch,
        tenure: Number(formData.tenure) || 12,
        purpose: formData.purpose || 'Financial requirement',
        userId: user?._id || user?.id || null
      };

      const res = await api.post('/loans/apply', payload);
      
      const newApplication = res.data?.application || res.data?.loan || {
        applicationId: res.data?.applicationId || `APP${Date.now()}`,
        ...payload,
        status: 'KYC Pending',
        createdAt: new Date().toISOString()
      };

      setSubmittedApp(newApplication);

      if (onApplicationSubmitted) {
        onApplicationSubmitted(newApplication);
      }
    } catch (err) {
      console.error('Failed to submit loan application:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to submit application. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedApp(null);
    setFormData({
      applicantName: user?.name || user?.fullName || '',
      applicantMobile: user?.phone || user?.mobile || '',
      applicantEmail: user?.email || '',
      branch: user?.branch || 'Vijayawada',
      loanType: 'Personal Loan',
      amount: '',
      tenure: '12',
      purpose: ''
    });
  };

  // Success State View
  if (submittedApp) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-xl border border-emerald-200/80 rounded-3xl p-8 shadow-lg text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />
        
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border-4 border-emerald-50 shadow-sm animate-bounce-once">
          <CheckCircle2 size={36} />
        </div>

        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          Submitted to Admin Processing Desk
        </span>

        <h2 className="text-2xl font-black text-slate-900 mt-4 tracking-tight">
          Application Received Successfully!
        </h2>
        <p className="text-sm text-slate-500 max-w-lg mx-auto mt-2">
          Your loan request has been routed directly to our administration review team. Our branch loan officer will verify your details promptly.
        </p>

        {/* Application Summary Card */}
        <div className="max-w-md mx-auto my-6 p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-left shadow-2xs space-y-3">
          <div className="flex justify-between items-center pb-3 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Application ID</span>
            <span className="text-sm font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
              #{submittedApp.applicationId || 'APP2026'}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Loan Type</span>
            <span className="font-bold text-slate-800">{submittedApp.loanType}</span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Requested Amount</span>
            <span className="text-base font-black text-slate-900">
              ₹{Number(submittedApp.amount).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Processing Branch</span>
            <span className="font-bold text-slate-800">{submittedApp.branch || 'Vijayawada'}</span>
          </div>

          <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100">
            <span className="text-slate-500 font-medium">Initial Status</span>
            <span className="font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {submittedApp.status || 'KYC Pending'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button 
            onClick={() => navigate('/dashboard?tab=loans')}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            Track in My Loans <ArrowRight size={14} />
          </button>
          <button 
            onClick={handleResetForm}
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw size={14} /> Apply Another Loan
          </button>
        </div>
      </motion.div>
    );
  }

  // Active Form View
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
    >
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 font-black text-sm">
              <img src="/logo.png" alt="Shayaan Swarna Mitra Logo" className="h-8 w-auto object-contain" />
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Apply for a New Loan
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Fill in the details below. Applications are processed directly with authorized PSU & scheduled bank partners.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-bold">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>Govt. Bank Interest Rates from 7.0% p.a.</span>
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Section 1: Applicant Details */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <User size={13} className="text-slate-400" /> 1. Applicant Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input 
                  type="text"
                  name="applicantName"
                  value={formData.applicantName}
                  onChange={handleInputChange}
                  placeholder="e.g. Rama Raju"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-2xs text-xs sm:text-sm font-semibold text-slate-800 transition-all"
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input 
                  type="tel"
                  name="applicantMobile"
                  value={formData.applicantMobile}
                  onChange={handleInputChange}
                  placeholder="e.g. 9876543210"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-2xs text-xs sm:text-sm font-semibold text-slate-800 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input 
                  type="email"
                  name="applicantEmail"
                  value={formData.applicantEmail}
                  onChange={handleInputChange}
                  placeholder="e.g. name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-2xs text-xs sm:text-sm font-semibold text-slate-800 transition-all"
                />
              </div>
            </div>

            {/* Branch / City */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Branch Location *
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select 
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-2xs text-xs sm:text-sm font-semibold text-slate-800 transition-all appearance-none cursor-pointer"
                >
                  {branchOptions.map((b, i) => (
                    <option key={i} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Loan Particulars */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Briefcase size={13} className="text-slate-400" /> 2. Loan Requirements & Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Dynamic Loan Type Dropdown */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Loan Type / Service *
                </label>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  {loanTypeOptions.length} Options
                </span>
              </div>
              <div className="relative">
                <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select 
                  name="loanType"
                  value={formData.loanType}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-2xs text-xs sm:text-sm font-bold text-slate-900 transition-all appearance-none cursor-pointer capitalize"
                >
                  {loanTypeOptions.map((t, idx) => (
                    <option key={idx} value={t} className="capitalize">{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Loan Tenure Dropdown */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Loan Tenure *
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <select 
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-2xs text-xs sm:text-sm font-semibold text-slate-800 transition-all appearance-none cursor-pointer"
                >
                  <option value="6">6 Months (Short Term)</option>
                  <option value="12">12 Months / 1 Year (Standard)</option>
                  <option value="24">24 Months / 2 Years</option>
                  <option value="36">36 Months / 3 Years</option>
                  <option value="60">60 Months / 5 Years</option>
                </select>
              </div>
            </div>

          </div>
        </div>

        {/* Section 3: Amount & Quick Chips */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="block text-[11px] font-black text-slate-800 uppercase tracking-wider">
              Requested Loan Amount (₹) *
            </label>
            {formData.amount && Number(formData.amount) > 0 && (
              <span className="text-xs font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-md">
                ₹{Number(formData.amount).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-slate-400 text-base">
              ₹
            </div>
            <input 
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="e.g. 500000"
              required
              min="5000"
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-xs text-sm sm:text-base font-black text-slate-900 tracking-wide transition-all"
            />
          </div>

          {/* Quick Selection Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Select:</span>
            {amountChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  Number(formData.amount) === chip 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs' 
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                }`}
              >
                ₹{(chip / 100000).toFixed(chip % 100000 === 0 ? 0 : 1)} Lakh
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Purpose of Loan */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Purpose of Loan
            </label>
            <span className="text-[10px] text-slate-400">Optional</span>
          </div>
          <div className="relative">
            <FileText size={16} className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none" />
            <textarea 
              name="purpose"
              rows="2"
              value={formData.purpose}
              onChange={handleInputChange}
              placeholder="e.g. Business expansion, working capital, personal needs, education, medical..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-2xs text-xs sm:text-sm font-medium text-slate-800 transition-all resize-none"
            />
          </div>

          {/* Quick Purpose Suggestion Pills */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[10px] font-bold text-slate-400">Suggestions:</span>
            {['Business Expansion', 'Personal & Family', 'Agriculture / Farm', 'Medical Emergency', 'Debt Consolidation', 'Home Renovation'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handlePurposePreset(tag)}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Security / Processing Note */}
        <div className="flex items-center gap-3 bg-blue-50/60 p-4 rounded-2xl border border-blue-100">
          <ShieldCheck size={22} className="text-blue-600 shrink-0" />
          <p className="text-xs text-slate-600 leading-relaxed">
            Your application is securely encrypted and submitted straight to our centralized <strong className="text-slate-800 font-bold">Admin Applications Desk</strong>. A unique tracking ID will be generated upon submission.
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0e274a] hover:bg-[#163866] text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-[#0e274a]/15 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Transmitting to Admin Processing...</span>
              </>
            ) : (
              <>
                <span>Submit Application to Admin</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ApplyLoanTab;
