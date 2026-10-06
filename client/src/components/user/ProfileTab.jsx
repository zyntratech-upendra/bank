import React from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Building2, CalendarDays } from 'lucide-react';

const ProfileTab = ({ user }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight mb-1">My Profile</h2>
          <p className="text-sm text-slate-500">View and manage your personal information.</p>
        </div>
        <button className="px-5 py-2.5 bg-[#0e274a] text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:bg-[#163866] transition-all">
          Edit Profile
        </button>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-8 shadow-sm relative overflow-hidden">
        {/* Banner/Header */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-t-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6 mt-12 mb-8">
          <div className="w-24 h-24 rounded-3xl bg-white border-4 border-white shadow-xl p-1 shrink-0 overflow-hidden">
            <img 
              src={user.profilePicUrl || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0e274a&color=fff&size=256`} 
              onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0e274a&color=fff&size=256`; }}
              alt="Profile" 
              className="w-full h-full object-cover rounded-2xl" 
            />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">{user.name}</h3>
            <p className="text-sm font-semibold text-slate-500 flex items-center gap-2 mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span> Active Customer
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 pt-6 border-t border-slate-100/50">
          
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><User size={14} /> Full Name</p>
            <p className="text-sm font-bold text-slate-800">{user.name}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Mail size={14} /> Email Address</p>
            <p className="text-sm font-bold text-slate-800">{user.email}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Phone size={14} /> Phone Number</p>
            <p className="text-sm font-bold text-slate-800">{user.phone || '+91 98765 43210'}</p>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Building2 size={14} /> Occupation</p>
            <p className="text-sm font-bold text-slate-800">{user.occupation || 'Business Owner'}</p>
          </div>

          <div className="space-y-1 md:col-span-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={14} /> Residential Address</p>
            <p className="text-sm font-bold text-slate-800">{user.address || '123 Main Street, Sample Block, Vijayawada, AP 520010, India'}</p>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default ProfileTab;
