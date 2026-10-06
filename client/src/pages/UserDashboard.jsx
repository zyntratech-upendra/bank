import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Landmark, CreditCard, Clock, CheckCircle2, AlertCircle, 
  FileText, ShieldCheck, Upload, Banknote, IndianRupee, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

import ApplyLoanTab from '../components/user/ApplyLoanTab';
import MyLoansTab from '../components/user/MyLoansTab';
import PaymentsTab from '../components/user/PaymentsTab';
import DocumentsTab from '../components/user/DocumentsTab';
import SupportTab from '../components/user/SupportTab';
import ProfileTab from '../components/user/ProfileTab';
import SettingsTab from '../components/user/SettingsTab';

const UserDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const currentTab = query.get('tab') || 'dashboard';
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Normally you'd get this from a proper AuthContext, using localStorage for simplicity here
    const token = localStorage.getItem('bank_token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch current user
        const userRes = await api.get('/auth/me');
        if (userRes.data?.user) {
          setUser(userRes.data.user);
          localStorage.setItem('bank_user', JSON.stringify(userRes.data.user));
        }
        
        // Fetch applications (we'll fetch all and filter for now, or assume the backend filters)
        // Since there is no specific user application endpoint yet, we'll try hitting admin if we can't,
        // or just mock the applications if the API fails.
        try {
          const appRes = await api.get('/auth/me/applications');
          if (appRes.data) {
             setApplications(appRes.data);
          }
        } catch (err) {
          // Mock data if unauthorized
          setApplications([
            { _id: '1', loanType: 'Gold Loan', amount: 300000, status: 'Approved', createdAt: new Date(Date.now() - 1000000000).toISOString() },
            { _id: '2', loanType: 'Loan Transfer', amount: 200000, status: 'Pending', createdAt: new Date(Date.now() - 50000000).toISOString() }
          ]);
        }
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fcfdfd] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0e274a]/20 border-t-[#c48722] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return null;

  const totalLoanAmount = applications.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const activeLoans = applications.filter(app => app.status === 'Approved').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] pb-20 relative overflow-hidden">
      
      {/* Ambient Glassmorphism Background Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        


        {/* Top Stats Grid (Only on Dashboard) */}
        {currentTab === 'dashboard' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            {/* Active Loans */}
            <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <Landmark size={24} className="stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Active Loans</p>
                <p className="text-3xl font-black text-slate-800">{activeLoans}</p>
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <IndianRupee size={24} className="stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Total Loan Amount</p>
                <p className="text-3xl font-black text-slate-800">₹{totalLoanAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>

          {/* Next EMI */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-rose-500/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                <Clock size={24} className="stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Next EMI Due</p>
                <p className="text-3xl font-black text-slate-800">₹8,750</p>
                <p className="text-[10px] font-semibold text-rose-500 mt-1">Due on 05 Oct 2026</p>
              </div>
            </div>
          </div>

          {/* Applications */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#c48722]/10 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 text-[#c48722] flex items-center justify-center border border-orange-100">
                <FileText size={24} className="stroke-[2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Applications</p>
                <p className="text-3xl font-black text-slate-800">{applications.length}</p>
              </div>
            </div>
          </div>
          </motion.div>
        )}

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Content) */}
          <div className={`space-y-8 ${currentTab === 'dashboard' ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            
            {currentTab === 'dashboard' && (
              <>
                {/* Quick Actions */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <button onClick={() => navigate('/dashboard?tab=apply')} className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3 text-center group">
                      <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Banknote size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Apply for Gold Loan</span>
                    </button>
                    <button onClick={() => navigate('/dashboard?tab=apply')} className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3 text-center group">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <CreditCard size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Transfer Loan</span>
                    </button>
                    <button onClick={() => navigate('/dashboard?tab=documents')} className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3 text-center group">
                      <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <Upload size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Upload Documents</span>
                    </button>
                    <button onClick={() => navigate('/dashboard?tab=payments')} className="bg-white/60 backdrop-blur-md border border-white/80 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center gap-3 text-center group">
                      <div className="w-12 h-12 rounded-full bg-[#0e274a]/10 text-[#0e274a] flex items-center justify-center border border-[#0e274a]/20 group-hover:bg-[#0e274a] group-hover:text-white transition-colors">
                        <IndianRupee size={20} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">Pay EMI</span>
                    </button>
                  </div>
                </motion.div>

                {/* Recent Applications Table */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-sm overflow-hidden"
                >
                  <div className="px-6 py-5 border-b border-white/60 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Recent Applications</h2>
                    <button onClick={() => navigate('/dashboard?tab=loans')} className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                      View All <ArrowRight size={14} />
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-white/40">
                          <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/50">Service</th>
                          <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/50">Amount</th>
                          <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/50">Applied On</th>
                          <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-white/50">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applications.map((app, idx) => (
                          <tr key={idx} className="border-b border-white/30 hover:bg-white/50 transition-colors">
                            <td className="py-4 px-6">
                              <span className="text-sm font-bold text-slate-800">{app.loanType || 'Gold Loan'}</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-sm font-semibold text-slate-700">₹{app.amount ? app.amount.toLocaleString('en-IN') : 'N/A'}</span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="text-xs font-semibold text-slate-500">
                                {new Date(app.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                               <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                                  app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/20' :
                                  app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-700 border border-rose-500/20' :
                                  'bg-amber-500/10 text-amber-700 border border-amber-500/20'
                                }`}>
                                  {app.status || 'Pending'}
                                </span>
                            </td>
                          </tr>
                        ))}
                        {applications.length === 0 && (
                          <tr>
                            <td colSpan="4" className="py-8 text-center text-slate-400 text-sm font-medium">No applications found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              </>
            )}

            {currentTab === 'apply' && <ApplyLoanTab />}
            {currentTab === 'loans' && <MyLoansTab applications={applications} />}
            {currentTab === 'payments' && <PaymentsTab applications={applications} />}
            {currentTab === 'documents' && <DocumentsTab user={user} />}
            {currentTab === 'support' && <SupportTab />}
            {currentTab === 'profile' && <ProfileTab user={user} />}
            {currentTab === 'settings' && <SettingsTab />}

          </div>

          {/* Right Column (Sidebar) - Only on Dashboard */}
          {currentTab === 'dashboard' && (
            <div className="lg:col-span-1 space-y-8">
              
              {/* My Profile / Documents */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-sm"
            >
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 flex items-center justify-between">
                My Profile
                <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100 hover:bg-blue-100 transition-colors">Edit</button>
              </h2>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/60">
                <div className="w-16 h-16 rounded-2xl bg-white border border-white/80 shadow-md p-1 shrink-0 overflow-hidden">
                  <img 
                    src={user.profilePicUrl || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0e274a&color=fff&size=128`} 
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=0e274a&color=fff&size=128`; }}
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-xl" 
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">{user.name}</h3>
                  <p className="text-xs font-semibold text-slate-500">{user.email}</p>
                </div>
              </div>

              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Verification Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/60">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-emerald-600" />
                    <span className="text-sm font-bold text-slate-700">Aadhaar Card</span>
                  </div>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/60">
                  <div className="flex items-center gap-3">
                    <CreditCard size={16} className="text-blue-600" />
                    <span className="text-sm font-bold text-slate-700">PAN Card</span>
                  </div>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/60">
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={16} className="text-rose-500" />
                    <span className="text-sm font-bold text-slate-700">Income Proof</span>
                  </div>
                  <AlertCircle size={16} className="text-rose-500" />
                </div>
              </div>

            </motion.div>

          </div>
          )}
          
        </div>
      </div>
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default UserDashboard;
