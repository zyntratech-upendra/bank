import { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Building2,
  Landmark,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Gold Loan',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    api.get('/public/locations')
      .then(res => setLocations(res.data))
      .catch(console.error);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div className="bg-[#fcfdfd] text-slate-800 font-sans selection:bg-[#c48722]/20 min-h-screen">

      {/* ================================================================= */}
      {/* 1. HEADER BANNER                                                  */}
      {/* ================================================================= */}
      <section className="relative pt-10 pb-14 lg:pt-14 lg:pb-16 bg-gradient-to-b from-[#faf7f2] via-[#fbf9f5] to-white border-b border-slate-200/70 overflow-hidden">
        
        {/* Ambient background glows */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-0 top-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute left-0 bottom-0 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/3" 
        />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-[#0e274a] leading-tight mb-4">
            Get in <span className="text-[#c48722]">Touch</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We are here to help you with all your financial needs. Talk directly with our dedicated Government Bank loan advisors.
          </p>
        </motion.div>
      </section>

      {/* ================================================================= */}
      {/* 2. 3 QUICK HELPLINE CARDS                                         */}
      {/* ================================================================= */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <div className="bg-gradient-to-r from-[#fefbf2] to-white border border-[#f5e6c2] rounded-2xl p-5 flex items-center gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#faedd0] text-[#9e6912] flex items-center justify-center shrink-0">
                <Phone size={22} />
              </div>
              <div>
                <h4 className="font-bold text-[#0e274a] text-sm">Instant Loan Helpline</h4>
                <p className="text-xs text-slate-500 mt-0.5">+91 98765 43210 / 0866-2456789</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#f1f7fe] to-white border border-[#d2e4fb] rounded-2xl p-5 flex items-center gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#e0edfd] text-[#1b5cb7] flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="Shayaan Swarna Mitra Logo" className="h-8 w-auto object-contain" />
              </div>
              <div>
                <h4 className="font-bold text-[#0e274a] text-sm">Govt. Bank Transfer Desk</h4>
                <p className="text-xs text-slate-500 mt-0.5">Assistance with SBI, Canara, BoB</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#f0faf4] to-white border border-[#cbeed8] rounded-2xl p-5 flex items-center gap-4 shadow-xs">
              <div className="w-12 h-12 rounded-xl bg-[#dbf6e7] text-[#157943] flex items-center justify-center shrink-0">
                <MessageSquare size={22} />
              </div>
              <div>
                <h4 className="font-bold text-[#0e274a] text-sm">One Lending Clearance</h4>
                <p className="text-xs text-slate-500 mt-0.5">Same-day debt settlement help</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. MAIN CONTACT SECTION: CONTACT INFO + FORM (2 COLUMNS)          */}
      {/* ================================================================= */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column (5 Cols): Contact Details + Map Preview */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-gradient-to-b from-[#faf7f2] to-white border border-slate-200/90 rounded-3xl p-7 sm:p-8 shadow-sm space-y-7">
                <div>
                  <span className="text-xs font-bold text-[#c48722] uppercase tracking-[0.2em] block mb-1">
                    — Reach Us Directly —
                  </span>
                  <h3 className="text-2xl font-display font-black text-[#0e274a]">
                    Our Branches &amp; Offices
                  </h3>
                </div>

                <div className="space-y-6 text-sm">
                  {locations.length > 0 ? locations.map((loc, idx) => (
                    <div key={idx} className="flex items-start gap-4 mb-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="w-10 h-10 rounded-xl bg-[#fdf5e7] text-[#c48722] flex items-center justify-center shrink-0 border border-[#fae2c0] mt-0.5">
                        <MapPin size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#0e274a] text-base mb-1">{loc.city} Branch</h4>
                        <p className="text-slate-600 leading-relaxed">
                          {loc.address}
                        </p>
                        <p className="text-slate-600 font-semibold mt-1">Phone: {loc.contact}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-slate-500">Loading branch locations...</p>
                  )}
                </div>
              </div>

            </div>

            {/* Right Column (7 Cols): Send us a Message Form Card */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-lg">
                
                <div className="mb-8">
                  <h3 className="text-2xl sm:text-3xl font-display font-black text-[#0e274a] mb-2">
                    Send us a Message
                  </h3>
                  <p className="text-sm text-slate-500">
                    Fill out the form below and our certified bank liaison will connect with you shortly.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 size={36} />
                    </div>
                    <h4 className="text-2xl font-bold text-[#0e274a]">Thank You!</h4>
                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                      Your message has been received. One of our dedicated loan advisors will call you back within <strong>15 minutes</strong> during working hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="px-6 py-2.5 bg-[#0e274a] text-white rounded-xl text-xs font-bold hover:bg-[#163866] transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="e.g. Ramesh Kumar"
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c48722]/50 focus:border-[#c48722] text-sm font-medium transition-all"
                        />
                      </div>

                      {/* Mobile Number */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 00000"
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c48722]/50 focus:border-[#c48722] text-sm font-medium transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Email Address */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="ramesh@example.com"
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c48722]/50 focus:border-[#c48722] text-sm font-medium transition-all"
                        />
                      </div>

                      {/* Select Service */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Select Service *
                        </label>
                        <select
                          name="service"
                          value={formData.service}
                          onChange={handleChange}
                          className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c48722]/50 focus:border-[#c48722] text-sm font-medium transition-all bg-white"
                        >
                          <option value="Gold Loan">Gold Loan (Govt. Banks)</option>
                          <option value="Loan Transfer">Loan Transfer (Lower Interest)</option>
                          <option value="One Lending">One Lending Solution (Pawn Clearance)</option>
                          <option value="Personal Loan">Personal Loan</option>
                          <option value="Business Loan">Business Loan / MSME</option>
                          <option value="Other">Other Advisory</option>
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Your Message / Loan Query
                      </label>
                      <textarea
                        rows="4"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about the gold weight, existing pledge amount, or the loan value you are seeking..."
                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c48722]/50 focus:border-[#c48722] text-sm font-medium transition-all resize-none"
                      ></textarea>
                    </div>

                    {/* Privacy Guarantee Note */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 py-1">
                      <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                      <span>Your personal information and gold details are 100% confidential and secure.</span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#c48722] hover:bg-[#b07619] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-70"
                    >
                      {loading ? (
                        <span>Processing...</span>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send size={16} />
                        </>
                      )}
                    </button>

                  </form>
                )}

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. GOVERNMENT BANK PARTNERS STRIP                                 */}
      {/* ================================================================= */}
      <section className="py-14 bg-slate-50/70 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold text-[#c48722] uppercase tracking-[0.25em] block mb-2">
            — Our Bank Partners —
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-black text-[#0e274a] mb-6">
            Authorized Support Across Leading Government Banks
          </h3>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-5 sm:p-7 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 items-center">
              <span className="font-extrabold text-[#0082c9] text-lg">● SBI</span>
              <span className="font-extrabold text-[#e31e24] text-base">Union Bank</span>
              <span className="font-extrabold text-[#0093d8] text-base">▲ Canara Bank</span>
              <span className="font-extrabold text-[#113a69] text-base">★ Indian Bank</span>
              <span className="font-extrabold text-[#f35b25] text-base">Bank of Baroda</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
