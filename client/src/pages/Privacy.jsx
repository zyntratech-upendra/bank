import { Link } from 'react-router-dom';
import { Landmark, Shield, Lock, Eye, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-[#faf7f2] font-sans selection:bg-[#c48722] selection:text-white pb-20">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-6 px-6 lg:px-12 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="inline-flex items-center space-x-3 group">
            <div className="bg-[#0e274a] text-white p-2.5 rounded-xl shadow-md transition-transform group-hover:scale-105">
              <Landmark size={24} className="stroke-[2.2]" />
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
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-4 bg-emerald-100 text-emerald-600 rounded-2xl">
              <Shield size={32} />
            </div>
            <h1 className="text-4xl font-black text-[#0e274a] font-display">Privacy Policy</h1>
          </div>
          
          <p className="text-sm font-semibold text-slate-500 mb-10 pb-6 border-b border-slate-100">Effective Date: October 2026</p>

          <div className="space-y-8 text-slate-700 leading-relaxed font-medium">
            
            <section>
              <p className="text-lg">
                At Banking Services, we take your privacy and the security of your financial data extremely seriously. This Privacy Policy outlines how we collect, use, and protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#0e274a] mb-4 flex items-center gap-3">
                <Database className="text-[#c48722]" size={24} /> 1. Data We Collect
              </h2>
              <p>We collect information necessary to provide our banking and loan services securely:</p>
              <ul className="list-disc list-inside mt-3 space-y-2 pl-4 text-slate-600">
                <li><strong>Identity Data:</strong> Aadhaar Number, PAN Number, Full Name, Live selfies.</li>
                <li><strong>Contact Data:</strong> Email address, Mobile number.</li>
                <li><strong>Financial Data:</strong> Transaction history, loan application details, gold deposit records.</li>
                <li><strong>Technical Data:</strong> IP address, device type, and login timestamps for security monitoring.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#0e274a] mb-4 flex items-center gap-3">
                <Lock className="text-[#c48722]" size={24} /> 2. How We Protect Your Data
              </h2>
              <p>
                All sensitive information, including passwords and KYC documents, is protected using industry-standard 256-bit AES encryption. Documents are securely stored on our verified cloud infrastructure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-black text-[#0e274a] mb-4 flex items-center gap-3">
                <Eye className="text-[#c48722]" size={24} /> 3. Data Sharing
              </h2>
              <p>
                We do not sell your personal data to third parties. We only share information with:
              </p>
              <ul className="list-disc list-inside mt-3 space-y-2 pl-4 text-slate-600">
                <li>Regulatory bodies (RBI, Income Tax Department) as required by Indian Law.</li>
                <li>Secure third-party API providers for real-time document verification (e.g., Aadhaar/PAN verification endpoints).</li>
              </ul>
            </section>

          </div>

        </motion.div>
      </main>

    </div>
  );
};

export default Privacy;
