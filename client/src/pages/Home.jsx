import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Percent,
  Landmark,
  Zap,
  ArrowRight,
  FileText,
  Users,
  Star,
  Coins,
  RefreshCw,
  HandCoins,
  User,
  Briefcase,
  Layers,
  ChevronDown,
  Calculator,
  CheckCircle2
} from 'lucide-react';

const Home = () => {
  // Calculator state
  const [goldGrams, setGoldGrams] = useState(50);
  const [purity, setPurity] = useState('22K');
  const [tenureMonths, setTenureMonths] = useState(12);

  // Approximate gold rate calculations
  const ratePerGram = purity === '24K' ? 7300 : purity === '22K' ? 6700 : 5500;
  const goldValue = goldGrams * ratePerGram;
  const maxLoan = Math.round(goldValue * 0.75); // 75% RBI regulatory LTV
  const monthlyRate = 0.085 / 12; // 8.5% annual rate
  const monthlyInterest = Math.round(maxLoan * monthlyRate);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'What is the "One Lending" service to clear existing gold loans?',
      a: 'If your gold is pledged with private lenders or pawnbrokers at high interest rates (24%–36% p.a.), we provide bridge clearance funds with minimal charges against your KYC and security verification. Once released, we assist you in re-pledging your gold in a Government Bank at lowest interest rates (starting from 8.5% p.a.).'
    },
    {
      q: 'Which Government Banks are your primary partners?',
      a: 'We facilitate loans directly with leading nationalized banks including State Bank of India (SBI), Canara Bank, Indian Bank, Bank of Baroda, and Union Bank of India.'
    },
    {
      q: 'What is the maximum loan value (LTV) I can get for my gold?',
      a: 'Under Reserve Bank of India (RBI) directives, you can obtain up to 75% of the appraised market value of your 18K to 24K gold ornaments with zero valuation penalties.'
    },
    {
      q: 'Is my gold safe and insured during the loan tenure?',
      a: 'Yes. Unlike unorganized private shops, your gold is sealed in tamper-evident pouches in your presence and deposited securely into nationalized bank strongroom lockers with 100% full insurance coverage.'
    },
    {
      q: 'What documents are required for application?',
      a: 'Minimal paperwork: Just your Aadhaar Card, PAN Card, passport size photograph, and proof of address. No complex income proofs or high CIBIL scores are required for standard gold loans.'
    }
  ];

  return (
    <div className="bg-[#ffffff] text-slate-800 font-sans selection:bg-[#c48722]/20">

      {/* ================================================================= */}
      {/* 1. HERO SECTION: 5-STAR LUXURY 3D COMPOSITION                     */}
      {/* ================================================================= */}
      <section className="relative min-h-[620px] lg:min-h-[680px] flex items-center overflow-hidden bg-[#faf7f2] border-b border-slate-200/80">
        
        {/* Pristine 3D Government Bank & 24K Bullion Background (Zero street, zero people) */}
        <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[65%] xl:w-[62%] z-0 overflow-hidden pointer-events-none">
          <img
            src="/images/luxury_bank_gold_hero.jpg"
            alt="3D Government Bank Headquarters and 24K Gold Ornaments"
            className="w-full h-full object-cover object-[center_right] lg:object-left"
          />
          
          {/* Subtle multi-stop gradient seamlessly merging into the warm cream page background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#faf7f2] via-[#faf7f2]/90 lg:via-[#faf7f2]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#faf7f2] via-transparent to-transparent lg:hidden" />
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-[#faf7f2] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#faf7f2] to-transparent" />
        </div>

        {/* Left Column: Heading, Badges & Calls to Action */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-16 lg:py-24">
          <div className="max-w-2xl text-left space-y-6">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fcedd7] border border-[#f5d7ad] text-[#935b0b] text-[13px] font-bold tracking-wide shadow-2xs">
              <ShieldCheck size={16} className="text-[#c48722]" />
              <span>Trusted • Safe • Government Bank Tie-ups</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[60px] xl:text-[66px] font-display font-extrabold text-[#0e274a] leading-[1.12] tracking-tight">
              Gold Loans <span className="text-[#c48722] font-serif italic font-normal">&amp;</span><br />
              Financial Solutions
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-xl">
              Get low interest gold loans through nearby Government Banks and easy financial solutions for your personal and business needs.
            </p>

            {/* Four Feature Badges (Single Row on Desktop/Tablet, 2x2 on Mobile) */}
            <div className="flex flex-wrap sm:flex-nowrap gap-2.5 pt-2 pb-1">
              
              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl px-3.5 py-2.5 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-[#dbe8fa] text-[#0f2441] flex items-center justify-center shrink-0">
                  <Percent size={13} className="stroke-[2.5]" />
                </div>
                <span className="text-[12.5px] font-bold text-slate-800 whitespace-nowrap">Low Interest Rates</span>
              </div>

              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl px-3.5 py-2.5 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-[#dbe8fa] text-[#0f2441] flex items-center justify-center shrink-0">
                  <Landmark size={13} className="stroke-[2.5]" />
                </div>
                <span className="text-[12.5px] font-bold text-slate-800 whitespace-nowrap">Govt. Bank Tie-ups</span>
              </div>

              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl px-3.5 py-2.5 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-[#faebd7] text-[#c48722] flex items-center justify-center shrink-0">
                  <Zap size={13} className="stroke-[2.5]" />
                </div>
                <span className="text-[12.5px] font-bold text-slate-800 whitespace-nowrap">Quick Approval</span>
              </div>

              <div className="flex items-center gap-2 bg-white/95 backdrop-blur-xs border border-slate-200/90 rounded-xl px-3.5 py-2.5 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-[#d5f3e2] text-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck size={13} className="stroke-[2.5]" />
                </div>
                <span className="text-[12.5px] font-bold text-slate-800 whitespace-nowrap">Safe &amp; Secure</span>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#c48722] hover:bg-[#b07619] text-white font-bold text-[15px] tracking-wide shadow-md hover:shadow-lg transition-all transform active:scale-95 text-center"
              >
                Apply for Gold Loan
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-[15px] hover:bg-slate-50 transition-all shadow-xs text-center"
              >
                Explore Services
              </Link>
            </div>

          </div>
        </div>

      </section>

      {/* ================================================================= */}
      {/* 2. SERVICES SECTION: TWO ROWS (3 CARDS PER ROW)                   */}
      {/* ================================================================= */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Heading */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs sm:text-[13px] font-bold text-[#c48722] uppercase tracking-[0.25em] block mb-2">
              — Our Services —
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-[#0e274a]">
              Comprehensive Financial Solutions
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-2">
              Low-interest gold credit, loan clearance bridge funding, and bank facilities under one roof.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            
            {/* ROW 1 - Card 1: Gold Loan */}
            <div className="bg-gradient-to-b from-[#fefbf2] to-[#fffdf7] border border-[#f5e6c2] rounded-3xl p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(234,179,8,0.06)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#f6dda3] to-[#faedd0] text-[#9e6912] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <Coins size={28} />
                  </div>
                  <span className="px-3 py-1 bg-[#fdf5e3] border border-[#f6dda3] text-[#9e6912] text-xs font-bold rounded-full">
                    From 8.50% p.a.
                  </span>
                </div>
                <h3 className="font-bold text-[#0e274a] text-xl mb-2.5">Gold Loan</h3>
                <p className="text-[14px] text-slate-600 leading-relaxed mb-5">
                  Get instant gold loans at the lowest interest rates through our authorized tie-ups with leading Government Banks.
                </p>
                <ul className="space-y-2 mb-6 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Instant appraisal with certified carat meters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Full insurance coverage in bank strongrooms</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-[#faeed2] flex items-center justify-between">
                <Link to="/services?type=gold" className="text-sm font-bold text-[#9e6912] hover:text-[#0e274a] inline-flex items-center gap-1.5 transition-colors">
                  Know More <ArrowRight size={15} />
                </Link>
                <Link to="/services?type=gold" className="px-4 py-2 bg-[#9e6912] hover:bg-[#85560c] text-white rounded-xl text-xs font-bold transition-colors">
                  Apply Now
                </Link>
              </div>
            </div>

            {/* ROW 1 - Card 2: Loan Transfer */}
            <div className="bg-gradient-to-b from-[#f1f7fe] to-[#f8faff] border border-[#d2e4fb] rounded-3xl p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(37,99,235,0.06)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#bdd9fc] to-[#e0edfd] text-[#1b5cb7] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <RefreshCw size={28} />
                  </div>
                  <span className="px-3 py-1 bg-[#e7f1fd] border border-[#c4ddfc] text-[#1b5cb7] text-xs font-bold rounded-full">
                    Save up to 60% Interest
                  </span>
                </div>
                <h3 className="font-bold text-[#0e274a] text-xl mb-2.5">Loan Transfer</h3>
                <p className="text-[14px] text-slate-600 leading-relaxed mb-5">
                  Transfer your existing high-interest gold loans from local moneylenders to lower rates through our government bank partners.
                </p>
                <ul className="space-y-2 mb-6 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Complete documentation handled by our team</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Reduce your monthly EMI burden significantly</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-[#dce9fb] flex items-center justify-between">
                <Link to="/services?type=transfer" className="text-sm font-bold text-[#1b5cb7] hover:text-[#0e274a] inline-flex items-center gap-1.5 transition-colors">
                  Know More <ArrowRight size={15} />
                </Link>
                <Link to="/services?type=transfer" className="px-4 py-2 bg-[#1b5cb7] hover:bg-[#154b96] text-white rounded-xl text-xs font-bold transition-colors">
                  Transfer Loan
                </Link>
              </div>
            </div>

            {/* ROW 1 - Card 3: One Lending Solution */}
            <div className="bg-gradient-to-b from-[#f0faf4] to-[#f7fcf9] border border-[#cbeed8] rounded-3xl p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(16,185,129,0.06)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#b6ebd0] to-[#dbf6e7] text-[#157943] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <HandCoins size={28} />
                  </div>
                  <span className="px-3 py-1 bg-[#e3f7ec] border border-[#b6ebd0] text-[#157943] text-xs font-bold rounded-full">
                    Same-Day Clearance
                  </span>
                </div>
                <h3 className="font-bold text-[#0e274a] text-xl mb-2.5">One Lending Solution</h3>
                <p className="text-[14px] text-slate-600 leading-relaxed mb-5">
                  Need funds to release your pledged gold? We provide bridge loans with minimal charges against KYC and security verification.
                </p>
                <ul className="space-y-2 mb-6 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Quick clearance of pawn shop/private lender debts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Safe release &amp; immediate re-pledge into Govt. Banks</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-[#d8f3e2] flex items-center justify-between">
                <Link to="/services?type=one-lending" className="text-sm font-bold text-[#157943] hover:text-[#0e274a] inline-flex items-center gap-1.5 transition-colors">
                  Know More <ArrowRight size={15} />
                </Link>
                <Link to="/services?type=one-lending" className="px-4 py-2 bg-[#157943] hover:bg-[#106236] text-white rounded-xl text-xs font-bold transition-colors">
                  Get Clearance
                </Link>
              </div>
            </div>

            {/* ROW 2 - Card 4: Personal Loan */}
            <div className="bg-gradient-to-b from-[#f7f5fe] to-[#faf9ff] border border-[#e5dcfa] rounded-3xl p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(139,92,246,0.06)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#d7caf8] to-[#eee8fd] text-[#5e3da8] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <User size={28} />
                  </div>
                  <span className="px-3 py-1 bg-[#f0eafc] border border-[#d9ccf8] text-[#5e3da8] text-xs font-bold rounded-full">
                    Minimal KYC
                  </span>
                </div>
                <h3 className="font-bold text-[#0e274a] text-xl mb-2.5">Personal Loan</h3>
                <p className="text-[14px] text-slate-600 leading-relaxed mb-5">
                  Unsecured personal financial assistance for medical emergencies, wedding expenses, home renovation, or education.
                </p>
                <ul className="space-y-2 mb-6 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Flexible repayment tenure from 12 to 60 months</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Quick approval with direct bank account credit</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-[#ece4fc] flex items-center justify-between">
                <Link to="/services" className="text-sm font-bold text-[#5e3da8] hover:text-[#0e274a] inline-flex items-center gap-1.5 transition-colors">
                  Know More <ArrowRight size={15} />
                </Link>
                <Link to="/services" className="px-4 py-2 bg-[#5e3da8] hover:bg-[#4d318b] text-white rounded-xl text-xs font-bold transition-colors">
                  Check Eligibility
                </Link>
              </div>
            </div>

            {/* ROW 2 - Card 5: Business Loan */}
            <div className="bg-gradient-to-b from-[#fef5f0] to-[#fff9f6] border border-[#f9dfd0] rounded-3xl p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(249,115,22,0.06)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#fbd0b7] to-[#fee6d7] text-[#b8561d] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <Briefcase size={28} />
                  </div>
                  <span className="px-3 py-1 bg-[#fdede3] border border-[#facfba] text-[#b8561d] text-xs font-bold rounded-full">
                    MSME &amp; Commercial
                  </span>
                </div>
                <h3 className="font-bold text-[#0e274a] text-xl mb-2.5">Business Loan</h3>
                <p className="text-[14px] text-slate-600 leading-relaxed mb-5">
                  Customized funding solutions for business expansion, working capital, inventory replenishment, and commercial equipment.
                </p>
                <ul className="space-y-2 mb-6 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Collateral-free and secured loan options available</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Special government subsidy schemes for MSMEs</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-[#fae4d7] flex items-center justify-between">
                <Link to="/services" className="text-sm font-bold text-[#b8561d] hover:text-[#0e274a] inline-flex items-center gap-1.5 transition-colors">
                  Know More <ArrowRight size={15} />
                </Link>
                <Link to="/services" className="px-4 py-2 bg-[#b8561d] hover:bg-[#974515] text-white rounded-xl text-xs font-bold transition-colors">
                  Grow Business
                </Link>
              </div>
            </div>

            {/* ROW 2 - Card 6: Other Financial Services */}
            <div className="bg-gradient-to-b from-[#fef3f4] to-[#fff9f9] border border-[#fad5d7] rounded-3xl p-7 flex flex-col justify-between shadow-[0_4px_20px_rgba(244,63,94,0.06)] hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group">
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#fac6c9] to-[#fee2e3] text-[#b6303c] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                    <Layers size={28} />
                  </div>
                  <span className="px-3 py-1 bg-[#fde9eb] border border-[#f8c8cb] text-[#b6303c] text-xs font-bold rounded-full">
                    End-to-End Advisory
                  </span>
                </div>
                <h3 className="font-bold text-[#0e274a] text-xl mb-2.5">Other Financial Services</h3>
                <p className="text-[14px] text-slate-600 leading-relaxed mb-5">
                  Dedicated documentation assistance, KYC compliance, mortgage guidance, and structured financial consulting.
                </p>
                <ul className="space-y-2 mb-6 text-xs text-slate-600 font-medium">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Hassle-free legal and valuation coordination</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                    <span>Dedicated banking relationship manager</span>
                  </li>
                </ul>
              </div>
              <div className="pt-4 border-t border-[#fbdadc] flex items-center justify-between">
                <Link to="/services" className="text-sm font-bold text-[#b6303c] hover:text-[#0e274a] inline-flex items-center gap-1.5 transition-colors">
                  Know More <ArrowRight size={15} />
                </Link>
                <Link to="/contact" className="px-4 py-2 bg-[#b6303c] hover:bg-[#96252f] text-white rounded-xl text-xs font-bold transition-colors">
                  Contact Advisor
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. KEY METRICS & STATS BAR                                        */}
      {/* ================================================================= */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-4 items-center divide-y md:divide-y-0 md:divide-x divide-slate-200">
              
              <div className="flex items-center gap-4 px-3">
                <div className="text-[#c48722] shrink-0">
                  <Users size={36} />
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-black text-[#0e274a]">50,000+</h4>
                  <p className="text-[13px] font-semibold text-slate-500">Happy Customers</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-3 pt-4 md:pt-0">
                <div className="text-[#c48722] shrink-0">
                  <Landmark size={36} />
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-black text-[#0e274a]">10+</h4>
                  <p className="text-[13px] font-semibold text-slate-500">Govt. Bank Partners</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-3 pt-4 md:pt-0">
                <div className="text-[#c48722] shrink-0">
                  <FileText size={36} />
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-black text-[#0e274a]">95%</h4>
                  <p className="text-[13px] font-semibold text-slate-500">Loan Approval Rate</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-3 pt-4 md:pt-0">
                <div className="text-[#c48722] shrink-0">
                  <Percent size={36} />
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-black text-[#0e274a]">Lowest</h4>
                  <p className="text-[13px] font-semibold text-slate-500">Interest Rates</p>
                </div>
              </div>

              <div className="flex items-center gap-4 px-3 pt-4 md:pt-0">
                <div className="text-[#c48722] shrink-0">
                  <Star size={36} />
                </div>
                <div>
                  <h4 className="text-2xl sm:text-3xl font-black text-[#0e274a]">12+</h4>
                  <p className="text-[13px] font-semibold text-slate-500">Years of Experience</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. HOW IT WORKS (4 Simple Steps)                                  */}
      {/* ================================================================= */}
      <section className="py-16 sm:py-20 bg-[#fdfefe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="mb-14">
            <span className="text-xs sm:text-[13px] font-bold text-[#c48722] uppercase tracking-[0.25em] block mb-2">
              — How It Works —
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-display font-black text-[#0e274a]">
              Get Your Gold Loan in 4 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative group">
              <div className="w-16 h-16 rounded-full bg-[#c48722] text-white font-black text-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform">
                1
              </div>
              <h3 className="font-bold text-[#0e274a] text-lg sm:text-[19px] mb-2">Apply Online</h3>
              <p className="text-[13px] text-slate-600 max-w-[220px] leading-relaxed">
                Fill a simple application form with basic details.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center relative group">
              <div className="w-16 h-16 rounded-full bg-[#c48722] text-white font-black text-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform">
                2
              </div>
              <h3 className="font-bold text-[#0e274a] text-lg sm:text-[19px] mb-2">Document Verification</h3>
              <p className="text-[13px] text-slate-600 max-w-[220px] leading-relaxed">
                Submit KYC and gold details for verification.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center relative group">
              <div className="w-16 h-16 rounded-full bg-[#c48722] text-white font-black text-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform">
                3
              </div>
              <h3 className="font-bold text-[#0e274a] text-lg sm:text-[19px] mb-2">Bank Processing</h3>
              <p className="text-[13px] text-slate-600 max-w-[220px] leading-relaxed">
                We process with our government bank partners.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center relative group">
              <div className="w-16 h-16 rounded-full bg-[#c48722] text-white font-black text-2xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-105 transition-transform">
                4
              </div>
              <h3 className="font-bold text-[#0e274a] text-lg sm:text-[19px] mb-2">Get Loan Amount</h3>
              <p className="text-[13px] text-slate-600 max-w-[220px] leading-relaxed">
                Receive the loan amount quickly at lowest interest rates.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 5. INFORMATIVE FEATURE: LIVE GOLD LOAN & EMI ESTIMATOR            */}
      {/* ================================================================= */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-[#f2f6fc] border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-[#fef5e7] text-[#c48722] flex items-center justify-center shrink-0">
                  <Calculator size={28} />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-[26px] font-display font-black text-[#0e274a]">
                    Instant Gold Loan &amp; EMI Estimator
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Calculated per current RBI 75% Loan-To-Value (LTV) regulation
                  </p>
                </div>
              </div>
              <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs sm:text-sm font-bold">
                ✓ Starting Rate: 8.50% p.a.
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Controls */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Gold Weight */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-700">Gold Ornament Weight</label>
                    <span className="text-base font-extrabold text-[#c48722] bg-[#fdf5e7] px-3.5 py-1 rounded-lg">
                      {goldGrams} Grams
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={goldGrams}
                    onChange={(e) => setGoldGrams(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#c48722]"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>10g</span>
                    <span>250g</span>
                    <span>500g</span>
                  </div>
                </div>

                {/* Gold Purity */}
                <div>
                  <label className="text-sm font-bold text-slate-700 block mb-2">Ornament Purity</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['18K', '22K', '24K'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPurity(p)}
                        className={`py-3 rounded-xl font-bold text-xs sm:text-sm tracking-wider border transition-all ${
                          purity === p
                            ? 'bg-[#0e274a] text-white border-[#0e274a] shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {p} Hallmark
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tenure */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-bold text-slate-700">Tenure (Months)</label>
                    <span className="text-sm font-bold text-slate-800">{tenureMonths} Months</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="36"
                    step="3"
                    value={tenureMonths}
                    onChange={(e) => setTenureMonths(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0e274a]"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>3 Months</span>
                    <span>12 Months</span>
                    <span>36 Months</span>
                  </div>
                </div>

              </div>

              {/* Estimate Summary Box */}
              <div className="lg:col-span-5 bg-[#0b1f3b] text-white rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl">
                <span className="text-xs uppercase tracking-widest text-[#d8a349] font-bold block">
                  Eligible Loan Breakdown
                </span>

                <div className="border-b border-slate-700/80 pb-4">
                  <span className="text-xs sm:text-sm text-slate-300 block mb-1">Max Loan Amount (75% LTV)</span>
                  <div className="text-3xl sm:text-4xl font-black text-white">
                    ₹{maxLoan.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[12px] text-slate-400">Total Gold Value: ₹{goldValue.toLocaleString('en-IN')}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                  <div>
                    <span className="text-[12px] text-slate-300 block">Interest / Month</span>
                    <span className="text-xl font-bold text-[#d8a349]">
                      ₹{monthlyInterest.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[12px] text-slate-300 block">Bank Annual Rate</span>
                    <span className="text-xl font-bold text-emerald-400">8.50% p.a.</span>
                  </div>
                </div>

                <Link
                  to="/services"
                  className="w-full py-3.5 bg-[#c48722] hover:bg-[#b07619] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 mt-4"
                >
                  Apply For This Amount
                  <ArrowRight size={15} />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 6. OUR BANK PARTNERS (Logos Pill Container)                       */}
      {/* ================================================================= */}
      <section className="py-14 sm:py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="mb-8">
            <span className="text-xs sm:text-[13px] font-bold text-[#c48722] uppercase tracking-[0.25em] block mb-1">
              — Our Bank Partners —
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-display font-black text-[#0e274a]">
              Trusted Government Banks
            </h2>
          </div>

          <div className="bg-slate-50/70 rounded-2xl shadow-sm border border-slate-200/80 p-5 sm:p-7 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center">
              
              {/* SBI */}
              <div className="flex items-center justify-center gap-2.5 py-2">
                <div className="w-9 h-9 rounded-full bg-[#0082c9] text-white flex items-center justify-center font-black text-sm">
                  ●
                </div>
                <span className="font-extrabold text-[#0082c9] tracking-wider text-lg">SBI</span>
              </div>

              {/* Indian Bank */}
              <div className="flex items-center justify-center gap-2.5 py-2">
                <div className="w-9 h-9 rounded-full bg-[#f39c12] text-white flex items-center justify-center text-xs font-bold">
                  ★
                </div>
                <div className="text-left leading-none">
                  <span className="text-[10px] text-slate-500 font-bold block">इंडियन बैंक</span>
                  <span className="font-extrabold text-[#113a69] text-sm">Indian Bank</span>
                </div>
              </div>

              {/* Bank of Baroda */}
              <div className="flex items-center justify-center gap-2.5 py-2">
                <div className="w-9 h-9 rounded-full bg-[#f35b25] text-white flex items-center justify-center font-bold text-xs">
                  B
                </div>
                <div className="text-left leading-none">
                  <span className="text-[10px] text-slate-500 font-bold block">बैंक ऑफ़ बड़ौदा</span>
                  <span className="font-extrabold text-[#f35b25] text-sm">Bank of Baroda</span>
                </div>
              </div>

              {/* Canara Bank */}
              <div className="flex items-center justify-center gap-2.5 py-2">
                <div className="w-9 h-9 rounded-full bg-[#0093d8] text-white flex items-center justify-center font-bold text-xs">
                  ▲
                </div>
                <div className="text-left leading-none">
                  <span className="text-[10px] text-slate-500 font-bold block">केनरा बैंक</span>
                  <span className="font-extrabold text-[#0093d8] text-sm">Canara Bank</span>
                </div>
              </div>

              {/* Union Bank */}
              <div className="flex items-center justify-center gap-2.5 py-2">
                <div className="w-9 h-9 rounded-full bg-[#e31e24] text-white flex items-center justify-center font-bold text-xs">
                  U
                </div>
                <div className="text-left leading-none">
                  <span className="font-extrabold text-[#e31e24] text-sm block">Union Bank</span>
                  <span className="text-[10px] text-slate-400 font-bold">of India</span>
                </div>
              </div>

              {/* and More... */}
              <div className="py-2 text-slate-500 font-bold text-sm tracking-wider">
                and More...
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 7. INFORMATIVE FAQ SECTION                                        */}
      {/* ================================================================= */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <span className="text-xs sm:text-[13px] font-bold text-[#c48722] uppercase tracking-[0.25em] block mb-2">
              — Questions Answered —
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-[#0e274a]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/50"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex justify-between items-center gap-4 hover:bg-slate-100/60 transition-colors"
                  >
                    <span className="font-bold text-[#0e274a] text-base sm:text-[17px]">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#c48722]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-[14px] text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 8. BOTTOM CTA BANNER (Dark Navy with Curved Shape & Actions)      */}
      {/* ================================================================= */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-[#0b1f3b] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            
            {/* Left side: Icon + Title + Description */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#c48722] text-[#0b1f3b] flex items-center justify-center shrink-0 shadow-lg">
                <Landmark size={32} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white mb-2">
                  Need Financial Assistance?
                </h3>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  Get expert guidance for gold loans, loan transfers and other financial solutions.
                </p>
              </div>
            </div>

            {/* Right side: Two Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0 z-10 w-full sm:w-auto">
              <Link
                to="/services"
                className="px-7 py-3.5 rounded-xl bg-[#c48722] hover:bg-[#b07619] text-[#0b1f3b] font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                Apply Now
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="px-7 py-3.5 rounded-xl bg-[#142e54] hover:bg-[#1a3a6b] text-white border border-slate-600/70 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all text-center"
              >
                Contact Us
              </Link>
            </div>

            {/* Subtle background curved glow */}
            <div className="absolute right-0 bottom-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
