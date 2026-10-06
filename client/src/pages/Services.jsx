import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import {
  Coins,
  RefreshCw,
  HandCoins,
  User,
  Briefcase,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Calculator,
  FileText,
  Phone,
  Clock,
  Sparkles,
  X,
  Send,
  Building2,
  Lock,
  Percent,
  Check
} from 'lucide-react';
import DynamicServiceModal from '../components/DynamicServiceModal';

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const typeParam = searchParams.get('type') || 'all';
  const applyParam = searchParams.get('apply');

  const [activeTab, setActiveTab] = useState(typeParam);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(applyParam === 'true');
  const [selectedServiceForApply, setSelectedServiceForApply] = useState('Gold Loan');

  // Sync tab with URL search parameter
  useEffect(() => {
    if (typeParam) {
      setActiveTab(typeParam);
    }
  }, [typeParam]);

  useEffect(() => {
    if (applyParam === 'true') {
      setIsApplyModalOpen(true);
    }
  }, [applyParam]);

  // Handle Tab Change
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams(tabKey === 'all' ? {} : { type: tabKey });
  };

  // Open Apply Modal
  const openApplyModal = (serviceName) => {
    setSelectedServiceForApply(serviceName || 'Gold Loan');
    setIsApplyModalOpen(true);
  };

  // Calculator State inside Services
  const [goldGrams, setGoldGrams] = useState(60);
  const [purity, setPurity] = useState('22K');
  const [tenureMonths, setTenureMonths] = useState(12);

  const [dbServices, setDbServices] = useState([]);
  const [dynamicServices, setDynamicServices] = useState([]);
  const [isDynamicModalOpen, setIsDynamicModalOpen] = useState(false);
  const [selectedDynamicService, setSelectedDynamicService] = useState('');
  
  useEffect(() => {
    api.get('/public/services').then(res => {
      setDbServices(res.data);
    }).catch(console.error);

    api.get('/public/dynamic-services').then(res => {
      setDynamicServices(res.data);
    }).catch(console.error);
  }, []);

  const getServiceData = (name) => {
    return dbServices.find(s => s.loanType === name) || {};
  };

  const goldLoanDb = getServiceData('Gold Loan');
  const transferDb = getServiceData('Loan Transfer');
  const personalDb = getServiceData('Personal Loan');
  const businessDb = getServiceData('Business Loan');

  const ratePerGram = purity === '24K' ? 7300 : purity === '22K' ? 6700 : 5500;
  const goldValue = goldGrams * ratePerGram;
  const maxLoan = Math.round(goldValue * 0.75); // 75% RBI regulatory LTV
  const annualGovtRate = (goldLoanDb.interestRate || 8.5) / 100;
  const annualPawnRate = 0.24; // 24% typical private rate
  const monthlyInterest = Math.round(maxLoan * (annualGovtRate / 12));
  const interestSavedYearly = Math.round(maxLoan * (annualPawnRate - annualGovtRate));

  // Application Form State
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    service: 'Gold Loan',
    goldGramsOrAmount: '',
    branch: 'Vijayawada Central',
    notes: ''
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  const [refNumber, setRefNumber] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    try {
      const res = await api.post('/loans/apply', {
        applicantName: formData.fullName,
        applicantMobile: formData.mobileNumber,
        loanType: formData.service,
        amount: formData.goldGramsOrAmount,
        branch: formData.branch
      });
      setFormSubmitting(false);
      setFormSuccess(true);
      setRefNumber(res.data.loan.applicationId);
    } catch (err) {
      console.error(err);
      setFormSubmitting(false);
      alert('Failed to submit application. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      mobileNumber: '',
      service: 'Gold Loan',
      goldGramsOrAmount: '',
      branch: 'Vijayawada Central',
      notes: ''
    });
    setFormSuccess(false);
    setIsApplyModalOpen(false);
  };

  // All 6 Service Definitions
  const servicesList = [
    {
      id: 'gold',
      title: 'Gold Loan',
      badge: `Lowest Rate ${goldLoanDb.interestRate || 8.5}% p.a.`,
      badgeBg: 'bg-[#faf2e6] border-[#f0d6b0] text-[#9a6414]',
      icon: Coins,
      iconColor: 'text-[#c48722]',
      iconBg: 'from-[#faedd6] to-[#fdedce]',
      desc: 'Get instant funds against your gold ornaments at lowest interest rates through nearby Government Banks.',
      highlights: [
        'Interest rate starting from 8.5% p.a.',
        'Maximum loan value up to 75% of gold market price',
        'Direct partnership with SBI, Canara & Indian Bank',
        'Sealed tamper-evident vaults with 100% insurance'
      ],
      amount: '₹10,000 - ₹50,00,000',
      tenure: '3 to 36 Months',
      ctaText: 'Apply for Gold Loan'
    },
    {
      id: 'transfer',
      title: 'Loan Transfer',
      badge: 'Save up to 60% Interest',
      badgeBg: 'bg-[#eaf3fe] border-[#c2defc] text-[#1b5cb7]',
      icon: RefreshCw,
      iconColor: 'text-[#1b5cb7]',
      iconBg: 'from-[#bdd9fc] to-[#e0edfd]',
      desc: 'Transfer your existing high-interest gold loans from private pawnbrokers or NBFCs to low-rate Government Banks.',
      highlights: [
        'Drastically reduce interest rates from 24%-36% to 8.5%',
        'Complete paperwork handled end-to-end by our officers',
        'We clear old pledge and shift directly to bank branch',
        'Doorstep verification and immediate interest savings'
      ],
      amount: 'Clear any existing loan',
      tenure: 'Flexible Bank Tenure',
      ctaText: 'Transfer Your Loan'
    },
    {
      id: 'one-lending',
      title: 'One Lending Solution',
      badge: 'Same-Day Clearance',
      badgeBg: 'bg-[#e6f7ee] border-[#b5ebd0] text-[#147a44]',
      icon: HandCoins,
      iconColor: 'text-[#157943]',
      iconBg: 'from-[#b6ebd0] to-[#dbf6e7]',
      desc: 'Need funds to release your pledged gold? We provide bridge clearance loans with minimal charges against KYC & security documents.',
      highlights: [
        'Immediate bridge funds to release your pledged jewellery',
        'Strict KYC and verified legal security documentation',
        'Zero hidden charges, transparent nominal processing fee',
        'Smooth handover and direct re-pledge into Govt. Banks'
      ],
      amount: 'Up to 100% Release Value',
      tenure: 'Short Term Bridge',
      ctaText: 'Get One Lending'
    },
    {
      id: 'personal',
      title: 'Personal Loan',
      badge: 'Instant Sanction',
      badgeBg: 'bg-[#f2edfc] border-[#d8c8f8] text-[#5b3da5]',
      icon: User,
      iconColor: 'text-[#5e3da8]',
      iconBg: 'from-[#d7caf8] to-[#eee8fd]',
      desc: 'Financial support for personal emergencies, wedding expenses, home renovation, or education with quick approval.',
      highlights: [
        'Quick processing with minimal digital documentation',
        'No collateral or physical security required',
        'Repayment tenures from 12 to 60 months',
        'Direct bank account transfer upon verification'
      ],
      amount: '₹50,000 - ₹15,00,000',
      tenure: '12 to 60 Months',
      ctaText: 'Apply for Personal Loan'
    },
    {
      id: 'business',
      title: 'Business Loan',
      badge: 'Up to ₹2 Crores',
      badgeBg: 'bg-[#fef4ea] border-[#fcdbc0] text-[#a45312]',
      icon: Briefcase,
      iconColor: 'text-[#b45d16]',
      iconBg: 'from-[#fed7b7] to-[#ffe8d6]',
      desc: 'Funding solutions for business growth, working capital expansion, machinery purchase, and inventory financing.',
      highlights: [
        'Working capital and term loan facilities',
        'Subsidized interest schemes via MSME banking programs',
        'Customized repayment schedule based on cash flow',
        'Dedicated corporate relationship manager'
      ],
      amount: '₹1 Lakh - ₹2 Crores',
      tenure: '1 to 7 Years',
      ctaText: 'Apply for Business Loan'
    },
    {
      id: 'other',
      title: 'Other Banking Services',
      badge: 'Govt. Bank Services',
      badgeBg: 'bg-[#faebee] border-[#f7c2cb] text-[#a8253b]',
      icon: Layers,
      iconColor: 'text-[#b32b43]',
      iconBg: 'from-[#fcc2cc] to-[#fedde3]',
      desc: 'Account opening assistance, high-yield fixed deposits, safe bank lockers, and comprehensive documentation guidance.',
      highlights: [
        'Priority assistance for Govt. Bank Savings & Current accounts',
        'High-yield Fixed and Recurring Deposit advisory',
        'Bank locker allocation assistance for valuables',
        'Complete KYC, CIBIL report resolution, and notary guidance'
      ],
      amount: 'Comprehensive Services',
      tenure: 'Ongoing Support',
      ctaText: 'Explore Banking Services'
    }
  ];

  return (
    <div className="bg-[#fafbfc] min-h-screen text-slate-800 selection:bg-[#c48722]/20">
      
      {/* ================================================================= */}
      {/* 1. HERO HEADER                                                    */}
      {/* ================================================================= */}
      <section className="bg-gradient-to-b from-[#f3f6fa] via-[#faf8f4] to-[#fafbfc] border-b border-slate-200/80 pt-10 pb-12 sm:pt-14 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fcedd7] border border-[#f5d7ad] text-[#935b0b] text-[13px] font-bold tracking-wide shadow-2xs mb-5">
            <ShieldCheck size={16} className="text-[#c48722]" />
            <span>Government Bank Authorized Partner • Instant Disbursal</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-[#0e274a] tracking-tight mb-4">
            Our Financial Services
          </h1>
          <p className="text-slate-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-8">
            Complete Banking and Lending Solutions for a Better Tomorrow, powered by leading Government Banks with the lowest interest rates in the market.
          </p>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
              <span className="block text-2xl sm:text-3xl font-black text-[#c48722]">8.5%</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Starting Interest p.a.</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
              <span className="block text-2xl sm:text-3xl font-black text-[#0e274a]">₹50 Lakhs</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Max Gold Loan Limit</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
              <span className="block text-2xl sm:text-3xl font-black text-[#157943]">30 Mins</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Processing</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs text-center">
              <span className="block text-2xl sm:text-3xl font-black text-[#1b5cb7]">100%</span>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Govt. Bank Vaults</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 2. INTERACTIVE SERVICE FILTER TABS                                */}
      {/* ================================================================= */}
      <section className="sticky top-[80px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
            <button
              onClick={() => handleTabChange('all')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-2xs ${
                activeTab === 'all'
                  ? 'bg-[#0e274a] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              All Services
            </button>
            <button
              onClick={() => handleTabChange('gold')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-2xs flex items-center gap-2 ${
                activeTab === 'gold'
                  ? 'bg-[#c48722] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Coins size={15} />
              <span>Gold Loan</span>
            </button>
            <button
              onClick={() => handleTabChange('transfer')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-2xs flex items-center gap-2 ${
                activeTab === 'transfer'
                  ? 'bg-[#1b5cb7] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <RefreshCw size={15} />
              <span>Loan Transfer</span>
            </button>
            <button
              onClick={() => handleTabChange('one-lending')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-2xs flex items-center gap-2 ${
                activeTab === 'one-lending'
                  ? 'bg-[#157943] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <HandCoins size={15} />
              <span>One Lending Solution</span>
            </button>
            <button
              onClick={() => handleTabChange('personal')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-2xs flex items-center gap-2 ${
                activeTab === 'personal'
                  ? 'bg-[#5e3da8] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <User size={15} />
              <span>Personal Loan</span>
            </button>
            <button
              onClick={() => handleTabChange('business')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-2xs flex items-center gap-2 ${
                activeTab === 'business'
                  ? 'bg-[#b45d16] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Briefcase size={15} />
              <span>Business Loan</span>
            </button>
            <button
              onClick={() => handleTabChange('other')}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all shadow-2xs flex items-center gap-2 ${
                activeTab === 'other'
                  ? 'bg-[#b32b43] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <Layers size={15} />
              <span>Other Services</span>
            </button>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. DEDICATED SERVICE SHOWCASE (WHEN A SPECIFIC TAB IS SELECTED)   */}
      {/* ================================================================= */}
      {activeTab === 'gold' && (
        <section className="py-12 bg-white border-b border-slate-100 animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#fefbf6] to-[#fffdf9] border-2 border-[#f5e3ca] rounded-3xl p-6 sm:p-10 shadow-lg">
              
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                
                {/* Left Specs & Application */}
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fcedd7] text-[#935b0b] text-xs font-bold">
                    <Sparkles size={14} className="text-[#c48722]" />
                    <span>Flagship Government Bank Solution</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0e274a]">
                    Gold Loan
                  </h2>

                  <p className="text-slate-600 text-base leading-relaxed">
                    Get instant funds against your gold at lowest interest rates through Government Banks. Your jewellery remains safe in nationalized bank lockers with 100% insurance coverage.
                  </p>

                  <div className="grid grid-cols-2 gap-4 py-2">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                      <span className="text-xs font-bold text-slate-500 uppercase block">Interest Rates</span>
                      <span className="text-xl font-extrabold text-[#c48722]">Starting from 8.5% p.a.</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                      <span className="text-xs font-bold text-slate-500 uppercase block">Loan Amount</span>
                      <span className="text-xl font-extrabold text-[#0e274a]">₹10,000 – ₹50,00,000</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                      <span className="text-xs font-bold text-slate-500 uppercase block">Loan Tenure</span>
                      <span className="text-xl font-extrabold text-slate-800">3 Months – 36 Months</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
                      <span className="text-xs font-bold text-slate-500 uppercase block">Quick Disbursal</span>
                      <span className="text-xl font-extrabold text-emerald-600">Within 30–45 Mins</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => openApplyModal('Gold Loan')}
                      className="px-8 py-3.5 bg-[#c48722] hover:bg-[#b07419] text-white font-bold rounded-xl shadow hover:shadow-md transition-all flex items-center gap-2"
                    >
                      <span>Check Eligibility &amp; Apply</span>
                      <ArrowRight size={18} />
                    </button>
                    <a
                      href="#gold-calculator"
                      className="px-6 py-3.5 bg-white border border-slate-300 text-slate-700 hover:text-[#0e274a] font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-2xs"
                    >
                      <Calculator size={18} className="text-[#c48722]" />
                      <span>Calculate EMI</span>
                    </a>
                  </div>
                </div>

                {/* Right Benefits & Documents */}
                <div className="flex-1 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 w-full">
                  <div>
                    <h3 className="text-lg font-bold text-[#0e274a] mb-4 flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-[#c48722]" />
                      <span>Why Choose Gold Loan Through Us?</span>
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li className="flex items-start gap-2.5">
                        <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Direct Tie-ups with Government Banks:</strong> Deal directly with SBI, Indian Bank, Canara Bank and Union Bank.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Lowest Interest Rates:</strong> Pay only 8.5%–9.5% p.a. instead of 24%–36% at private lenders.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Minimal Documentation:</strong> Only KYC identity and address proof required. No income proof needed.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Flexible Repayment:</strong> Bullet repayment, monthly interest payment, or regular EMI schedules.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Part Repayment &amp; Top-up:</strong> Make partial repayments at zero penalty, or top-up whenever gold rates rise.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Documents Required
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                        <FileText size={20} className="mx-auto text-[#c48722] mb-1" />
                        <span className="text-xs font-bold text-slate-700 block">Aadhaar Card</span>
                        <span className="text-[10px] text-slate-500">Identity Proof</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                        <FileText size={20} className="mx-auto text-[#c48722] mb-1" />
                        <span className="text-xs font-bold text-slate-700 block">PAN Card</span>
                        <span className="text-[10px] text-slate-500">Tax ID</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                        <FileText size={20} className="mx-auto text-[#c48722] mb-1" />
                        <span className="text-xs font-bold text-slate-700 block">Address Proof</span>
                        <span className="text-[10px] text-slate-500">Utility / Voter</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                        <FileText size={20} className="mx-auto text-[#c48722] mb-1" />
                        <span className="text-xs font-bold text-slate-700 block">Gold Proof</span>
                        <span className="text-[10px] text-slate-500">Bill (Optional)</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'transfer' && (
        <section className="py-12 bg-white border-b border-slate-100 animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#f2f8fe] to-[#fafcff] border-2 border-[#cbe3fd] rounded-3xl p-6 sm:p-10 shadow-lg">
              
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                
                {/* Left Specs */}
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e3effd] text-[#1b5cb7] text-xs font-bold">
                    <RefreshCw size={14} className="text-[#1b5cb7]" />
                    <span>Cut Your Existing Interest in Half</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0e274a]">
                    Transfer Your Existing Gold Loan
                  </h2>

                  <p className="text-slate-600 text-base leading-relaxed">
                    Move your high-interest gold loan to a lower interest rate through our Government Bank partners. We handle the repayment to your existing pawnbroker and securely transfer your gold into bank lockers.
                  </p>

                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Estimated Annual Savings</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-[#1b5cb7]">Save ₹15,500</span>
                      <span className="text-xs font-medium text-slate-600">per ₹1,00,000 borrowed every single year</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Based on shifting from 24% private pawnbroker rate to 8.5% nationalized Government Bank rate.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => openApplyModal('Loan Transfer')}
                      className="px-8 py-3.5 bg-[#1b5cb7] hover:bg-[#154b96] text-white font-bold rounded-xl shadow hover:shadow-md transition-all flex items-center gap-2"
                    >
                      <span>Transfer Your Loan Today</span>
                      <ArrowRight size={18} />
                    </button>
                    <a
                      href="tel:+919876543210"
                      className="px-6 py-3.5 bg-white border border-slate-300 text-slate-700 hover:text-[#0e274a] font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-2xs"
                    >
                      <Phone size={18} className="text-[#1b5cb7]" />
                      <span>Speak with Transfer Expert</span>
                    </a>
                  </div>
                </div>

                {/* Right Specs & Benefits */}
                <div className="flex-1 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 w-full">
                  <div>
                    <h3 className="text-lg font-bold text-[#0e274a] mb-4 flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-[#1b5cb7]" />
                      <span>Key Benefits of Loan Transfer</span>
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li className="flex items-start gap-2.5">
                        <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Reduce your interest burden:</strong> Drop from exorbitant 2%-3% monthly compound interest to reasonable bank rates.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>We handle the complete bank process:</strong> Our dedicated representative accompanies you to close the existing pledge.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Doorstep assistance:</strong> Zero hassle, no complicated verification steps.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Instant top-up:</strong> If gold value has increased since your original loan, get additional cash in hand!</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Documents Required for Transfer
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                        <FileText size={20} className="mx-auto text-[#1b5cb7] mb-1" />
                        <span className="text-xs font-bold text-slate-700 block">Current Receipt</span>
                        <span className="text-[10px] text-slate-500">Pawn Ticket / Bill</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                        <FileText size={20} className="mx-auto text-[#1b5cb7] mb-1" />
                        <span className="text-xs font-bold text-slate-700 block">Aadhaar Card</span>
                        <span className="text-[10px] text-slate-500">Identity Proof</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                        <FileText size={20} className="mx-auto text-[#1b5cb7] mb-1" />
                        <span className="text-xs font-bold text-slate-700 block">PAN Card</span>
                        <span className="text-[10px] text-slate-500">Tax ID</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                        <FileText size={20} className="mx-auto text-[#1b5cb7] mb-1" />
                        <span className="text-xs font-bold text-slate-700 block">Address Proof</span>
                        <span className="text-[10px] text-slate-500">Resident Proof</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'one-lending' && (
        <section className="py-12 bg-white border-b border-slate-100 animate-fadeIn">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-[#f0fbf5] to-[#f9fdfb] border-2 border-[#b8ecd1] rounded-3xl p-6 sm:p-10 shadow-lg">
              
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                
                {/* Left Specs */}
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dcf5e7] text-[#157943] text-xs font-bold">
                    <HandCoins size={14} className="text-[#157943]" />
                    <span>Special Bridge Loan Solution</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-[#0e274a]">
                    One Lending Solution
                  </h2>

                  <p className="text-slate-600 text-base leading-relaxed">
                    Short of funds to clear your existing gold loan from private pawnbrokers or lenders? We provide the exact bridge clearance amount with limited processing charges. We take security documents and complete full KYC to safeguard your ornaments.
                  </p>

                  <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">How "One Lending" Protects You:</span>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      1. We verify your pawn receipt and KYC documents.<br />
                      2. We release the necessary bridge funds directly to settle the pawnshop balance.<br />
                      3. Your jewellery is retrieved securely and immediately re-pledged in a nationalized Government Bank at 8.5% interest.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => openApplyModal('One Lending Solution')}
                      className="px-8 py-3.5 bg-[#157943] hover:bg-[#106236] text-white font-bold rounded-xl shadow hover:shadow-md transition-all flex items-center gap-2"
                    >
                      <span>Apply for One Lending Clearance</span>
                      <ArrowRight size={18} />
                    </button>
                    <Link
                      to="/contact"
                      className="px-6 py-3.5 bg-white border border-slate-300 text-slate-700 hover:text-[#0e274a] font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center gap-2 shadow-2xs"
                    >
                      <span>Visit Branch for Verification</span>
                    </Link>
                  </div>
                </div>

                {/* Right Specs & Documents */}
                <div className="flex-1 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6 w-full">
                  <div>
                    <h3 className="text-lg font-bold text-[#0e274a] mb-4 flex items-center gap-2">
                      <CheckCircle2 size={20} className="text-[#157943]" />
                      <span>Key Features &amp; Safeguards</span>
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-700">
                      <li className="flex items-start gap-2.5">
                        <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Get amount to clear existing gold loan:</strong> Complete settlement coverage so your gold is never auctioned.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Limited processing charges:</strong> No extortionate fees or predatory penalties.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Take security documents:</strong> Legally sound, transparent, and binding paperwork protecting both parties.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <Check size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Complete KYC verification:</strong> Transparent identity, bank verification, and fast track approval.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                      Documents Required for One Lending
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                        <FileText size={18} className="mx-auto text-[#157943] mb-1" />
                        <span className="text-[11px] font-bold text-slate-700 block">Aadhaar</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                        <FileText size={18} className="mx-auto text-[#157943] mb-1" />
                        <span className="text-[11px] font-bold text-slate-700 block">PAN</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                        <FileText size={18} className="mx-auto text-[#157943] mb-1" />
                        <span className="text-[11px] font-bold text-slate-700 block">Address</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                        <FileText size={18} className="mx-auto text-[#157943] mb-1" />
                        <span className="text-[11px] font-bold text-slate-700 block">Pawn Bill</span>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl text-center border border-slate-100">
                        <Lock size={18} className="mx-auto text-[#157943] mb-1" />
                        <span className="text-[11px] font-bold text-slate-700 block">Security Doc</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/* 4. ALL SERVICES GRID (3-COLUMNS X 2-ROWS)                         */}
      {/* ================================================================= */}
      <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-[#0e274a]">
              {activeTab === 'all' ? 'All Financial Offerings' : 'Related Financial Services'}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-1">
              Explore our complete suite of retail and business lending products.
            </p>
          </div>
          {activeTab !== 'all' && (
            <button
              onClick={() => handleTabChange('all')}
              className="text-sm font-bold text-[#c48722] hover:text-[#0e274a] transition-colors flex items-center gap-1"
            >
              <span>View All 6 Services</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

        {/* 3 Columns x 2 Rows Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {servicesList.map((service) => {
            const Icon = service.icon;
            const isSelected = activeTab === service.id;

            return (
              <div
                key={service.id}
                className={`bg-white rounded-3xl p-7 flex flex-col justify-between border transition-all duration-300 group shadow-sm hover:shadow-xl hover:-translate-y-1.5 ${
                  isSelected ? 'border-2 border-[#0e274a] ring-2 ring-[#0e274a]/10' : 'border-slate-200/90'
                }`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${service.iconBg} ${service.iconColor} flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                      <Icon size={26} />
                    </div>
                    <span className={`px-3 py-1 text-xs font-bold rounded-full border ${service.badgeBg}`}>
                      {service.badge}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-bold text-[#0e274a] text-xl mb-2.5">
                    {service.title}
                  </h3>
                  <p className="text-[14px] text-slate-600 leading-relaxed mb-5">
                    {service.desc}
                  </p>

                  {/* Highlights Bullets */}
                  <ul className="space-y-2 mb-6 text-xs text-slate-600 font-medium">
                    {service.highlights.slice(0, 2).map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Terms Strip */}
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs text-slate-600 mb-6 border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Limit</span>
                      <span className="font-bold text-slate-800">{service.amount}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase block font-semibold">Tenure</span>
                      <span className="font-bold text-slate-800">{service.tenure}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    onClick={() => handleTabChange(service.id)}
                    className="text-xs font-bold text-slate-600 hover:text-[#0e274a] inline-flex items-center gap-1 transition-colors"
                  >
                    <span>Details</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    onClick={() => openApplyModal(service.title)}
                    className="px-4 py-2 bg-[#0e274a] hover:bg-[#163866] text-white rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow"
                  >
                    {service.ctaText}
                  </button>
                </div>
              </div>
            );
          })}
          
          {/* Render Dynamic Services */}
          {dynamicServices.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-3xl p-7 flex flex-col justify-between border border-slate-200/90 transition-all duration-300 group shadow-sm hover:shadow-xl hover:-translate-y-1.5"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#e0f2fe] to-[#bae6fd] text-[#0284c7] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <FileText size={26} />
                  </div>
                  <span className="px-3 py-1 text-xs font-bold rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200">
                    New Service
                  </span>
                </div>
                <h3 className="font-bold text-[#0e274a] text-xl mb-2.5">
                  {service.title}
                </h3>
                <p className="text-[14px] text-slate-600 leading-relaxed mb-5">
                  {service.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => {
                    setSelectedDynamicService(service.title);
                    setIsDynamicModalOpen(true);
                  }}
                  className="px-4 py-2 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl text-xs font-bold transition-all shadow-2xs hover:shadow"
                >
                  Request Service
                </button>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Dynamic Service Modal */}
      <DynamicServiceModal 
        isOpen={isDynamicModalOpen} 
        onClose={() => setIsDynamicModalOpen(false)} 
        serviceName={selectedDynamicService} 
      />

      {/* ================================================================= */}
      {/* 5. INTERACTIVE LIVE GOLD LOAN CALCULATOR                          */}
      {/* ================================================================= */}
      <section id="gold-calculator" className="py-16 bg-[#faf7f2] border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#c48722]">Instant Estimation</span>
            <h2 className="text-3xl font-display font-extrabold text-[#0e274a] mt-1 mb-3">
              Calculate Your Gold Loan Eligibility
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Check how much loan amount you can get against your gold ornaments with our regulatory 75% LTV rate calculator.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-lg max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Sliders Column */}
              <div className="space-y-6">
                
                {/* Gold Weight */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gold Weight (Grams)</label>
                    <span className="text-lg font-black text-[#0e274a]">{goldGrams} Grams</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="250"
                    step="5"
                    value={goldGrams}
                    onChange={(e) => setGoldGrams(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c48722]"
                  />
                  <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                    <span>10g</span>
                    <span>100g</span>
                    <span>250g</span>
                  </div>
                </div>

                {/* Gold Purity */}
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Gold Purity</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['18K', '22K', '24K'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPurity(p)}
                        className={`py-2.5 rounded-xl font-bold text-xs transition-all border ${
                          purity === p
                            ? 'bg-[#c48722] text-white border-[#c48722] shadow-2xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p} Ornaments
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tenure */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Tenure (Months)</label>
                    <span className="text-sm font-bold text-[#0e274a]">{tenureMonths} Months</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[3, 6, 12, 24].map((m) => (
                      <button
                        key={m}
                        onClick={() => setTenureMonths(m)}
                        className={`py-2 rounded-xl font-bold text-xs transition-all border ${
                          tenureMonths === m
                            ? 'bg-[#0e274a] text-white border-[#0e274a]'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m} Mo.
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* Live Result Card */}
              <div className="bg-gradient-to-br from-[#0e274a] to-[#153b6e] text-white p-7 rounded-2xl shadow-xl space-y-5">
                <div>
                  <span className="text-xs text-slate-300 uppercase tracking-wider font-semibold">Eligible Loan Amount (75% LTV)</span>
                  <div className="text-3xl sm:text-4xl font-display font-extrabold text-[#f5c76c] mt-1">
                    ₹{maxLoan.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-slate-300">Total Gold Value: ₹{goldValue.toLocaleString('en-IN')}</span>
                </div>

                <div className="pt-4 border-t border-slate-700/80 space-y-2.5 text-xs text-slate-200">
                  <div className="flex justify-between">
                    <span>Monthly Interest (@ 8.5% p.a.):</span>
                    <strong className="text-white font-bold">₹{monthlyInterest.toLocaleString('en-IN')}/mo</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Pawnshop Interest (@ 24% p.a.):</span>
                    <strong className="text-rose-300 line-through">₹{Math.round(maxLoan * (0.24 / 12)).toLocaleString('en-IN')}/mo</strong>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-slate-700">
                    <span>Your Yearly Savings:</span>
                    <span>₹{interestSavedYearly.toLocaleString('en-IN')} Saved</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      service: 'Gold Loan',
                      goldGramsOrAmount: `${goldGrams}g (${purity}) - Approx ₹${maxLoan.toLocaleString('en-IN')}`
                    }));
                    setIsApplyModalOpen(true);
                  }}
                  className="w-full py-3.5 bg-[#c48722] hover:bg-[#b07419] text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>Apply with this Estimate</span>
                  <ArrowRight size={16} />
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 6. AUTHORIZED GOVERNMENT BANK TIE-UPS                            */}
      {/* ================================================================= */}
      <section className="py-14 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
            Authorized Partner Facilitating Direct Government Bank Lending
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            <div className="px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-[#1a5baf] shadow-2xs">
              State Bank of India (SBI)
            </div>
            <div className="px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-[#0f5499] shadow-2xs">
              Canara Bank
            </div>
            <div className="px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-[#006098] shadow-2xs">
              Indian Bank
            </div>
            <div className="px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-[#0d47a1] shadow-2xs">
              Union Bank of India
            </div>
            <div className="px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-[#e65100] shadow-2xs">
              Bank of Baroda
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 7. BOTTOM CTA BANNER                                              */}
      {/* ================================================================= */}
      <section className="py-14 bg-[#0e274a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/10 text-[#f2bf61] flex items-center justify-center shrink-0 border border-white/10">
                <Building2 size={30} />
              </div>
              <div>
                <h3 className="text-2xl font-bold font-display text-white">Need Financial Assistance?</h3>
                <p className="text-slate-300 text-sm mt-1">
                  Get expert guidance for gold loans, loan transfers and other financial solutions.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={() => openApplyModal('General Inquiry')}
                className="flex-1 md:flex-none px-6 py-3 bg-[#c48722] hover:bg-[#b07419] text-white font-bold rounded-xl shadow transition-all text-sm text-center"
              >
                Apply Now &rarr;
              </button>
              <Link
                to="/contact"
                className="flex-1 md:flex-none px-6 py-3 border border-white/30 hover:border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors text-sm text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 8. APPLICATION & INQUIRY MODAL                                    */}
      {/* ================================================================= */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={resetForm}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X size={20} />
            </button>

            {formSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-bold text-[#0e274a]">Application Received!</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Thank you, <strong className="text-slate-800">{formData.fullName}</strong>. Your inquiry for <strong>{formData.service}</strong> has been logged under Reference ID:
                </p>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base font-bold text-[#0e274a] inline-block">
                  {refNumber}
                </div>
                <p className="text-xs text-slate-500">
                  Our loan officer will contact you within 30 minutes at <strong>{formData.mobileNumber}</strong> to complete your application.
                </p>
                <button
                  onClick={resetForm}
                  className="w-full py-3 bg-[#0e274a] text-white font-bold rounded-xl mt-4 hover:bg-[#163866] transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-[11px] font-bold text-[#c48722] uppercase tracking-wider">Fast Track Application</span>
                  <h3 className="text-2xl font-bold font-display text-[#0e274a]">Apply for Financial Services</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill this quick 1-minute form to receive immediate bank eligibility callback.
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#c48722] focus:ring-1 focus:ring-[#c48722] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      placeholder="10-digit mobile number"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#c48722] focus:ring-1 focus:ring-[#c48722] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Service Required</label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#c48722] focus:ring-1 focus:ring-[#c48722] outline-none bg-white font-medium"
                      >
                        <option value="Gold Loan">Gold Loan</option>
                        <option value="Loan Transfer">Loan Transfer</option>
                        <option value="One Lending Solution">One Lending Solution</option>
                        <option value="Personal Loan">Personal Loan</option>
                        <option value="Business Loan">Business Loan</option>
                        <option value="Other Banking Services">Other Banking Services</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Nearest Branch</label>
                      <select
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#c48722] focus:ring-1 focus:ring-[#c48722] outline-none bg-white font-medium"
                      >
                        <option value="Vijayawada Central">Vijayawada Central</option>
                        <option value="Guntur Main Road">Guntur Main Road</option>
                        <option value="Hyderabad Jubilee Hills">Hyderabad Jubilee Hills</option>
                        <option value="Visakhapatnam Beach Road">Visakhapatnam Beach Road</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Gold Weight or Required Amount (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 50g gold ornaments OR ₹3,00,000"
                      value={formData.goldGramsOrAmount}
                      onChange={(e) => setFormData({ ...formData, goldGramsOrAmount: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-[#c48722] focus:ring-1 focus:ring-[#c48722] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Additional Notes</label>
                    <textarea
                      rows="2"
                      placeholder="Any specific questions or existing pawn loan details..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:border-[#c48722] focus:ring-1 focus:ring-[#c48722] outline-none resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full py-3.5 bg-[#0e274a] hover:bg-[#163866] text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2"
                  >
                    {formSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        <span>Processing Application...</span>
                      </span>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Application</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-400 text-center">
                    🔒 100% Confidential. Your details are secured and shared solely with partner nationalized banks.
                  </p>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

export default Services;
