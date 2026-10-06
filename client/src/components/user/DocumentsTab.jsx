import React from 'react';
import { motion } from 'framer-motion';
import { FileText, CreditCard, ShieldCheck, UploadCloud, CheckCircle2 } from 'lucide-react';

const DocumentsTab = ({ user }) => {
  const docs = [
    { name: 'Aadhaar Card', icon: FileText, status: user?.aadhaarDocUrl ? 'Verified' : 'Not Uploaded', color: user?.aadhaarDocUrl ? 'emerald' : 'slate', url: user?.aadhaarDocUrl },
    { name: 'PAN Card', icon: CreditCard, status: user?.panDocUrl ? 'Verified' : 'Not Uploaded', color: user?.panDocUrl ? 'blue' : 'slate', url: user?.panDocUrl },
    { name: 'Income Proof', icon: ShieldCheck, status: 'Not Uploaded', color: 'slate', url: null },
    { name: 'Address Proof', icon: FileText, status: 'Not Uploaded', color: 'slate', url: null },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight mb-1">My Documents</h2>
          <p className="text-sm text-slate-500">Manage your KYC and loan verification documents.</p>
        </div>
        <button className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100 rounded-xl text-sm font-bold transition-colors flex items-center gap-2">
          <UploadCloud size={16} /> Upload New
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {docs.map((doc, idx) => {
          const Icon = doc.icon;
          return (
            <div key={idx} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-${doc.color}-50 text-${doc.color}-500 flex items-center justify-center border border-${doc.color}-100`}>
                    <Icon size={24} />
                  </div>
                  {doc.status === 'Verified' && <CheckCircle2 size={18} className="text-emerald-500" />}
                </div>
                
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-1">{doc.name}</h3>
                  <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    doc.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' :
                    doc.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {doc.status}
                  </span>
                </div>
                
                {doc.url && (
                  <a 
                    href={doc.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-2 block w-full h-24 rounded-xl overflow-hidden border border-slate-200 hover:border-blue-400 transition-colors relative group/img"
                  >
                    <img src={doc.url} alt={doc.name} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover/img:opacity-100 text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-md transition-opacity">View Document</span>
                    </div>
                  </a>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  );
};

export default DocumentsTab;
