import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, Mail, MessageSquare, MapPin } from 'lucide-react';

const SupportTab = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight mb-1">Help & Support</h2>
          <p className="text-sm text-slate-500">Get in touch with your branch or customer care.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Options */}
        <div className="space-y-4">
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 shrink-0">
              <PhoneCall size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Toll Free Support</p>
              <h3 className="text-lg font-black text-slate-800">1800 123 4567</h3>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100 shrink-0">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Us</p>
              <h3 className="text-base font-bold text-slate-800">support@bankingservices.com</h3>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100 shrink-0">
              <MessageSquare size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Live Chat</p>
              <h3 className="text-sm font-bold text-slate-800">Start a conversation</h3>
            </div>
          </div>
        </div>

        {/* Branch Info */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/60">
            <div className="w-12 h-12 bg-orange-50 text-[#c48722] rounded-xl flex items-center justify-center border border-orange-100 shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Your Home Branch</p>
              <h3 className="text-lg font-black text-slate-800">Vijayawada Main</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Address</p>
              <p className="text-sm font-semibold text-slate-700 leading-relaxed">
                40-1-12, MG Road,<br/>
                Beside Trendset Mall,<br/>
                Vijayawada, AP 520010
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Branch Manager</p>
              <p className="text-sm font-semibold text-slate-700">Ravi Kumar (Manager)</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Working Hours</p>
              <p className="text-sm font-semibold text-slate-700">Mon - Sat: 10:00 AM - 4:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SupportTab;
