import { Link } from 'react-router-dom';
import {
  Landmark,
  Compass,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  Star,
  ChevronRight,
  ArrowRight,
  Building2,
  FileCheck2,
  Lock,
  HandCoins,
  Percent,
  Check
} from 'lucide-react';

const About = () => {
  return (
    <div className="bg-[#fcfdfd] text-slate-800 font-sans selection:bg-[#c48722]/20">

      {/* ================================================================= */}
      {/* 1. HERO SECTION: CLEAN, PRESTIGIOUS HEADER BANNER                 */}
      {/* ================================================================= */}
      <section className="relative pt-8 pb-16 lg:pt-12 lg:pb-20 bg-gradient-to-b from-[#faf7f2] via-[#fbf9f5] to-white border-b border-slate-200/70 overflow-hidden">
        
        {/* Subtle decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute left-0 bottom-0 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-[#0e274a] leading-[1.12] tracking-tight mb-5">
              About <span className="text-[#c48722]">BANKING SERVICES</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              Committed to Making Financial Services Simple, Safe and Accessible for Everyone through our authorized Nationalized Government Bank tie-ups.
            </p>

            {/* Trust Highlights Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
                <Landmark size={14} className="text-[#0e274a]" />
                <span>Govt. Bank Facilitated</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>100% Safe Strongroom Lockers</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
                <Percent size={14} className="text-[#c48722]" />
                <span>Starting from 8.50% p.a.</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 2. OUR STORY & THREE PILLARS (MISSION, VISION, VALUES)            */}
      {/* ================================================================= */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left Column (7 cols): Our Story Narrative + Handshake Photo + Stat Grid */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#c48722] uppercase tracking-[0.2em] block mb-1">
                  — Foundation &amp; Journey —
                </span>
                <h2 className="text-3xl sm:text-4xl font-display font-black text-[#0e274a]">
                  Our Story
                </h2>
              </div>

              <p className="text-[15.5px] sm:text-[16.5px] text-slate-600 leading-relaxed">
                <strong className="text-[#0e274a] font-bold">BANKING SERVICES</strong> was founded with a singular, resolute mission: to democratize institutional credit for every Indian family and enterprise. For decades, millions of hardworking borrowers have been trapped in the vicious cycle of local pawn brokers and unregulated private moneylenders charging extortionate interest rates of 24% to 36% p.a.
              </p>

              <p className="text-[15.5px] sm:text-[16.5px] text-slate-600 leading-relaxed">
                We bridge that divide. Working in close partnership with premier Nationalized Government Banks, we streamline the entire process of obtaining gold loans, transferring existing high-interest loans, and providing same-day <strong>One Lending</strong> bridge financing. Our customers enjoy legitimate bank interest rates starting from 8.50% p.a., insured strongroom storage, and zero predatory valuation cuts.
              </p>

              {/* Handshake & Document Signing Image */}
              <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-lg mt-6">
                <img
                  src="/images/about_handshake.jpg"
                  alt="Banking partnership agreement signing"
                  className="w-full h-[280px] sm:h-[340px] object-cover"
                />
              </div>

              {/* 4 Stat Pills Underneath */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
                <div className="bg-gradient-to-b from-[#fefbf2] to-white border border-[#f5e6c2] rounded-2xl p-4 text-center shadow-xs">
                  <h4 className="text-2xl sm:text-3xl font-black text-[#0e274a]">10+</h4>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                    Years Experience
                  </p>
                </div>

                <div className="bg-gradient-to-b from-[#fefbf2] to-white border border-[#f5e6c2] rounded-2xl p-4 text-center shadow-xs">
                  <h4 className="text-2xl sm:text-3xl font-black text-[#0e274a]">50,000+</h4>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                    Happy Customers
                  </p>
                </div>

                <div className="bg-gradient-to-b from-[#fefbf2] to-white border border-[#f5e6c2] rounded-2xl p-4 text-center shadow-xs">
                  <h4 className="text-2xl sm:text-3xl font-black text-[#0e274a]">10+</h4>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                    Govt. Bank Partners
                  </p>
                </div>

                <div className="bg-gradient-to-b from-[#fefbf2] to-white border border-[#f5e6c2] rounded-2xl p-4 text-center shadow-xs">
                  <h4 className="text-2xl sm:text-3xl font-black text-[#0e274a]">4.8/5</h4>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                    Customer Rating
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column (5 cols): Three Pillar Cards (Mission, Vision, Values) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Card 1: Our Mission */}
              <div className="bg-gradient-to-br from-[#f8faff] to-white border border-[#d6e5fb] rounded-3xl p-7 shadow-[0_4px_25px_rgba(37,99,235,0.06)] hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-[#0e274a] text-white flex items-center justify-center mb-4 shadow-sm">
                  <Compass size={26} className="stroke-[2.2]" />
                </div>
                <h3 className="text-xl font-bold text-[#0e274a] mb-2">Our Mission</h3>
                <p className="text-[14.5px] text-slate-600 leading-relaxed">
                  To provide reliable, transparent, and customer-centric financial solutions with absolute integrity. We exist to protect borrowers' gold assets and reduce their interest liabilities through fair institutional banking.
                </p>
              </div>

              {/* Card 2: Our Vision */}
              <div className="bg-gradient-to-br from-[#fbf9fe] to-white border border-[#ebdffc] rounded-3xl p-7 shadow-[0_4px_25px_rgba(139,92,246,0.06)] hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-[#5e3da8] text-white flex items-center justify-center mb-4 shadow-sm">
                  <Eye size={26} className="stroke-[2.2]" />
                </div>
                <h3 className="text-xl font-bold text-[#0e274a] mb-2">Our Vision</h3>
                <p className="text-[14.5px] text-slate-600 leading-relaxed">
                  To be India's most trusted financial service facilitator, ensuring that every citizen has frictionless access to subsidized, government-backed credit without fear of compounding debt or loss of family wealth.
                </p>
              </div>

              {/* Card 3: Our Values */}
              <div className="bg-gradient-to-br from-[#fefbf2] to-white border border-[#f5e6c2] rounded-3xl p-7 shadow-[0_4px_25px_rgba(234,179,8,0.06)] hover:shadow-lg transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-[#c48722] text-white flex items-center justify-center mb-4 shadow-sm">
                  <ShieldCheck size={26} className="stroke-[2.2]" />
                </div>
                <h3 className="text-xl font-bold text-[#0e274a] mb-3">Our Values</h3>
                <ul className="space-y-3 text-[14px] text-slate-700 font-medium">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="text-[#c48722] shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Customer First:</strong> Your gold security and peace of mind guide every single recommendation.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="text-[#c48722] shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">100% Transparency:</strong> Zero hidden processing fees, stone deductions, or auction threats.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="text-[#c48722] shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Ethical Banking:</strong> Full adherence to RBI loan-to-value norms and government bank bylaws.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 size={17} className="text-[#c48722] shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">Long-term Relationships:</strong> Committed to supporting your family through every financial need.</span>
                  </li>
                </ul>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. OUR BANKING PARTNERS                                           */}
      {/* ================================================================= */}
      <section className="py-16 sm:py-20 bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="mb-10">
            <span className="text-xs sm:text-[13px] font-bold text-[#c48722] uppercase tracking-[0.25em] block mb-1">
              — Institutional Backing —
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-display font-black text-[#0e274a]">
              Our Banking Partners
            </h2>
            <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
              We facilitate official credit directly through India's premier nationalized banking institutions.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 items-center">
              
              {/* SBI */}
              <div className="flex items-center justify-center gap-2.5 py-3 px-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#0082c9] text-white flex items-center justify-center font-black text-sm shadow-xs">
                  ●
                </div>
                <span className="font-extrabold text-[#0082c9] tracking-wider text-xl">SBI</span>
              </div>

              {/* Union Bank */}
              <div className="flex items-center justify-center gap-2.5 py-3 px-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#e31e24] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  U
                </div>
                <div className="text-left leading-none">
                  <span className="font-extrabold text-[#e31e24] text-base block">Union Bank</span>
                  <span className="text-[10px] text-slate-400 font-bold">of India</span>
                </div>
              </div>

              {/* Canara Bank */}
              <div className="flex items-center justify-center gap-2.5 py-3 px-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#0093d8] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  ▲
                </div>
                <div className="text-left leading-none">
                  <span className="text-[10px] text-slate-500 font-bold block">केनरा बैंक</span>
                  <span className="font-extrabold text-[#0093d8] text-base">Canara Bank</span>
                </div>
              </div>

              {/* Indian Bank */}
              <div className="flex items-center justify-center gap-2.5 py-3 px-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#f39c12] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  ★
                </div>
                <div className="text-left leading-none">
                  <span className="text-[10px] text-slate-500 font-bold block">इंडियन बैंक</span>
                  <span className="font-extrabold text-[#113a69] text-base">Indian Bank</span>
                </div>
              </div>

              {/* Bank of Baroda */}
              <div className="flex items-center justify-center gap-2.5 py-3 px-2 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#f35b25] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  B
                </div>
                <div className="text-left leading-none">
                  <span className="text-[10px] text-slate-500 font-bold block">बैंक ऑफ़ बड़ौदा</span>
                  <span className="font-extrabold text-[#f35b25] text-base">Bank of Baroda</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. READY TO GET STARTED CTA BANNER                                */}
      {/* ================================================================= */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-[#0b1f3b] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#c48722] text-[#0b1f3b] flex items-center justify-center shrink-0 shadow-lg">
                <Landmark size={32} className="stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-display font-black text-white mb-2">
                  Ready to Experience Safe &amp; Transparent Banking?
                </h3>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  Join over 50,000 satisfied borrowers who secured lower interest rates through our authorized government bank partners.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0 z-10 w-full sm:w-auto">
              <Link
                to="/services"
                className="px-7 py-3.5 rounded-xl bg-[#c48722] hover:bg-[#b07619] text-[#0b1f3b] font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                Apply for Loan
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="px-7 py-3.5 rounded-xl bg-[#142e54] hover:bg-[#1a3a6b] text-white border border-slate-600/70 font-bold text-xs sm:text-sm uppercase tracking-wider transition-all text-center"
              >
                Contact Us
              </Link>
            </div>

            <div className="absolute right-0 bottom-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          </div>

        </div>
      </section>

    </div>
  );
};

export default About;
