import React from 'react';
import { X, User, Phone, Mail, FileText, CreditCard, Calendar, CheckCircle2, AlertCircle, Clock, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CustomerDetailModal = ({ isOpen, onClose, customer, applications = [] }) => {
  if (!isOpen || !customer) return null;

  // Filter applications belonging to this customer
  const customerHistory = applications.filter(
    app => app.email === customer.email || app.userId === customer._id || app.customerEmail === customer.email || app.aadhaarNumber === customer.aadhaarNumber
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm">
        
        {/* Modal Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} 
          className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col rounded-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glassmorphism Background & Blobs */}
          <div className="absolute inset-0 bg-white/70 backdrop-blur-3xl border border-white/60 shadow-2xl rounded-3xl pointer-events-none z-0"></div>
          
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none z-0"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl pointer-events-none z-0"></div>

          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-500 hover:text-slate-800 bg-white/40 hover:bg-white/80 border border-white/50 shadow-sm rounded-full transition-all z-20 backdrop-blur-md"
            title="Close"
          >
            <X size={20} />
          </button>

          {/* Scrollable Content */}
          <div className="relative z-10 overflow-y-auto px-6 sm:px-10 py-10 flex-1 scrollbar-hide">
            
            {/* Top Identity Section */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-10 pb-10 border-b border-slate-200/50">
              
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-400 to-indigo-400 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white/60 p-1.5 shadow-xl backdrop-blur-sm border border-white/80 shrink-0">
                  <div className="w-full h-full rounded-full bg-slate-100/50 flex items-center justify-center text-5xl font-light text-slate-400 overflow-hidden">
                    {customer.profilePicUrl || customer.avatar ? (
                      <img src={customer.profilePicUrl || customer.avatar} alt={customer.name} className="w-full h-full object-cover" />
                    ) : (
                      customer.name?.charAt(0) || 'C'
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 w-full text-center sm:text-left mt-2 sm:mt-4">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight mb-3 drop-shadow-sm">{customer.name}</h1>
                
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-sm text-slate-600 font-medium mb-6">
                  <span className="flex items-center gap-1.5 bg-white/50 px-3 py-1.5 rounded-lg border border-white/60 shadow-sm backdrop-blur-md">
                    <User size={15} className="text-indigo-500" /> ID: {customer._id?.slice(-6).toUpperCase() || 'CUST01'}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/50 px-3 py-1.5 rounded-lg border border-white/60 shadow-sm backdrop-blur-md">
                    <Calendar size={15} className="text-blue-500" /> Joined {new Date(customer.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                  {customer.status === 'Active' ? (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
                      <CheckCircle2 size={14} /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-500/10 text-slate-700 border border-slate-500/20 text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
                      <AlertCircle size={14} /> Inactive
                    </span>
                  )}
                </div>

                {/* Actions Box */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <a 
                    href={`mailto:${customer.email}`}
                    className="px-6 py-2.5 bg-gradient-to-r from-[#0e274a] to-[#163866] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-[#0e274a]/20 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 border border-white/10"
                  >
                    <Mail size={16} /> Send Email
                  </a>
                  {customer.phone && (
                    <a 
                      href={`tel:${customer.phone.replace(/[^0-9+]/g, '')}`}
                      className="px-6 py-2.5 bg-white/60 text-slate-800 text-sm font-semibold rounded-xl hover:bg-white/90 border border-white/60 transition-all flex items-center gap-2 shadow-sm backdrop-blur-md transform hover:-translate-y-0.5"
                    >
                      <Phone size={16} className="text-blue-600" /> Call Customer
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: Contact Details & History */}
              <div className="lg:col-span-5 space-y-8">
                
                {/* Contact Block */}
                <div>
                  <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 ml-1">Contact Details</h3>
                  <div className="bg-white/40 rounded-3xl p-6 shadow-sm border border-white/60 backdrop-blur-md space-y-6">
                    <div>
                      <p className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-md bg-white/60 flex items-center justify-center border border-white/50 shadow-sm">
                          <Mail size={12} className="text-indigo-500" />
                        </div>
                        Email Address
                      </p>
                      <p className="text-sm font-semibold text-slate-800 break-all pl-7.5">{customer.email}</p>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-200/50">
                      <p className="text-[11px] font-semibold text-slate-500 mb-1 flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-md bg-white/60 flex items-center justify-center border border-white/50 shadow-sm">
                          <Phone size={12} className="text-blue-500" />
                        </div>
                        Phone Number
                      </p>
                      <p className="text-sm font-semibold text-slate-800 pl-7.5">{customer.phone || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* History Block */}
                <div>
                  <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 ml-1">Loan History</h3>
                  <div className="bg-white/40 rounded-3xl p-6 shadow-sm border border-white/60 backdrop-blur-md">
                    {customerHistory.length > 0 ? (
                      <div className="space-y-4">
                        {customerHistory.map((app, idx) => (
                          <div key={app._id || idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/50 border border-white/60 hover:bg-white/70 transition-colors cursor-default">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
                                <Banknote size={16} />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800">{app.loanType || 'Loan Application'}</p>
                                <p className="text-[10px] font-semibold text-slate-500">₹{app.amount ? app.amount.toLocaleString('en-IN') : 'N/A'}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20' :
                                app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-700 border border-rose-500/20' :
                                'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                              }`}>
                                {app.status || 'Pending'}
                              </span>
                              <p className="text-[9px] font-semibold text-slate-400 mt-1 flex items-center justify-end gap-1">
                                <Clock size={10} />
                                {new Date(app.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6 text-slate-400">
                        <Clock size={32} className="mb-2 opacity-30" />
                        <span className="text-xs font-medium uppercase tracking-widest opacity-70">No History</span>
                      </div>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column: KYC Documents */}
              <div className="lg:col-span-7">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4 ml-1">Verification Documents</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Aadhaar Card */}
                  <div className="bg-white/40 border border-white/60 rounded-3xl p-4 shadow-sm backdrop-blur-md hover:bg-white/50 transition-colors group flex flex-col">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700 drop-shadow-sm">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20">
                          <FileText size={16} />
                        </div>
                        Aadhaar Card
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 font-mono bg-white/50 px-2.5 py-1 rounded-lg border border-white/60 shadow-sm">
                        {customer.aadhaarNumber || 'N/A'}
                      </span>
                    </div>

                    <div className="w-full aspect-[4/3] bg-white/50 rounded-2xl border border-white/60 overflow-hidden relative mt-auto shadow-inner">
                      {customer.aadhaarDocUrl ? (
                        <>
                          {customer.aadhaarDocUrl.endsWith('.pdf') ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                              <FileText size={32} className="mb-2" />
                              <span className="text-xs font-medium">PDF Document</span>
                            </div>
                          ) : (
                            <img src={customer.aadhaarDocUrl} alt="Aadhaar" className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                          )}
                          <a 
                            href={customer.aadhaarDocUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[4px]"
                          >
                            <span className="px-6 py-2.5 bg-white/90 text-slate-900 text-sm font-bold rounded-xl shadow-lg border border-white transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">View Full Size</span>
                          </a>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                          <FileText size={24} className="mb-2 opacity-30" />
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">No Document</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PAN Card */}
                  <div className="bg-white/40 border border-white/60 rounded-3xl p-4 shadow-sm backdrop-blur-md hover:bg-white/50 transition-colors group flex flex-col">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700 drop-shadow-sm">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center border border-blue-500/20">
                          <CreditCard size={16} />
                        </div>
                        PAN Card
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 font-mono bg-white/50 px-2.5 py-1 rounded-lg border border-white/60 shadow-sm">
                        {customer.panNumber || 'N/A'}
                      </span>
                    </div>

                    <div className="w-full aspect-[4/3] bg-white/50 rounded-2xl border border-white/60 overflow-hidden relative mt-auto shadow-inner">
                      {customer.panDocUrl ? (
                        <>
                          {customer.panDocUrl.endsWith('.pdf') ? (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                              <FileText size={32} className="mb-2" />
                              <span className="text-xs font-medium">PDF Document</span>
                            </div>
                          ) : (
                            <img src={customer.panDocUrl} alt="PAN" className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                          )}
                          <a 
                            href={customer.panDocUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[4px]"
                          >
                            <span className="px-6 py-2.5 bg-white/90 text-slate-900 text-sm font-bold rounded-xl shadow-lg border border-white transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">View Full Size</span>
                          </a>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                          <CreditCard size={24} className="mb-2 opacity-30" />
                          <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">No Document</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
          
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
          `}</style>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CustomerDetailModal;
