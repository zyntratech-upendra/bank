import { Link } from 'react-router-dom';
import { Landmark, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans selection:bg-[#c48722] selection:text-white pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-6 px-6 lg:px-12 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <div className="bg-[#0e274a] text-white p-2.5 rounded-xl shadow-md transition-transform group-hover:scale-105">
              <img src="/logo.png" alt="Shayaan Swarna Mitra Logo" className="h-8 w-auto object-contain" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight block leading-none text-[#0e274a]">BANKING</span>
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#c48722] block mt-1">SERVICES</span>
            </div>
          </Link>
          <button onClick={() => window.close()} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#0e274a] transition-colors">
             Close Window
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 mt-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 lg:p-12 rounded-3xl shadow-xl border border-slate-100">
          
          <h1 className="text-4xl font-black text-[#0e274a] mb-4 font-display">Terms and Conditions</h1>
          <p className="text-sm font-semibold text-slate-500 mb-10 pb-6 border-b border-slate-100">Last updated: October 2026</p>

          <div className="space-y-8 text-slate-700 leading-relaxed font-medium">
            
            <section>
              <h2 className="text-2xl font-black text-[#0e274a] mb-4 flex items-center gap-3">
                <CheckCircle2 className="text-[#c48722]" size={24} /> 1. Acceptance of Terms
              </h2>
              <p>
                By creating an account and using the services provided by Shayaan Swarna Mitra ("we", "us", or "our"), you ("user", "customer") agree to comply with and be bound by these Terms and Conditions. These terms govern your access to our online platform, gold loan services, deposits, and digital transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#0e274a] mb-4 flex items-center gap-3">
                <CheckCircle2 className="text-[#c48722]" size={24} /> 2. KYC Identity Verification
              </h2>
              <p>
                As a registered financial institution, we are required by law to perform Know Your Customer (KYC) verification. You agree that:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 pl-4 text-slate-600">
                <li>All documents submitted (Aadhaar, PAN, Profile Photo) are genuine and belong to you.</li>
                <li>You will not use automated systems or third-party identities to bypass verification.</li>
                <li>We reserve the right to reject any application if the provided documents are illegible or fail AI verification checks.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#0e274a] mb-4 flex items-center gap-3">
                <CheckCircle2 className="text-[#c48722]" size={24} /> 3. Service Usage and Liabilities
              </h2>
              <p>
                Our services are provided "as is". While we maintain 256-bit secure encryption and bank-grade infrastructure, we are not liable for losses incurred due to:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 pl-4 text-slate-600">
                <li>Compromise of your account password or device.</li>
                <li>Delays in inter-bank transfer networks.</li>
                <li>Fluctuations in the market value of gold affecting loan margins.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#0e274a] mb-4 flex items-center gap-3">
                <CheckCircle2 className="text-[#c48722]" size={24} /> 4. Account Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate your account immediately, without prior notice, if we detect fraudulent activity, money laundering attempts, or violations of these Terms and Conditions.
              </p>
            </section>

          </div>

        </motion.div>
      </main>

    </div>
  );
};

export default Terms;
