import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Lock, ShieldCheck, Smartphone, Eye, Globe } from 'lucide-react';

const SettingsTab = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight mb-1">Account Settings</h2>
          <p className="text-sm text-slate-500">Manage your security and notification preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Security Settings */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6">
            <Lock size={16} className="text-slate-400" /> Security
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">Change Password</span>
                <span className="text-xs text-slate-500">Update your login password</span>
              </div>
              <button className="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-200">Update</button>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">Two-Factor Auth</span>
                <span className="text-xs text-slate-500">Enable 2FA via SMS</span>
              </div>
              <div className="w-10 h-5 bg-blue-500 rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6">
            <Bell size={16} className="text-slate-400" /> Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">Email Alerts</span>
                <span className="text-xs text-slate-500">Loan updates & EMI reminders</span>
              </div>
              <div className="w-10 h-5 bg-blue-500 rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">SMS Alerts</span>
                <span className="text-xs text-slate-500">Instant transactional messages</span>
              </div>
              <div className="w-10 h-5 bg-blue-500 rounded-full relative cursor-pointer shadow-inner">
                <div className="absolute right-1 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Devices */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm md:col-span-2">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6">
            <Smartphone size={16} className="text-slate-400" /> Connected Devices
          </h3>
          
          <div className="flex items-center justify-between p-4 rounded-2xl border border-emerald-100 bg-emerald-50/30">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-600">
                <Globe size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-800">Chrome on Windows</span>
                <span className="text-xs text-emerald-600 font-semibold">Active Now • Vijayawada, IN</span>
              </div>
            </div>
            <button className="text-xs font-bold text-rose-500 hover:text-rose-700">Revoke</button>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default SettingsTab;
