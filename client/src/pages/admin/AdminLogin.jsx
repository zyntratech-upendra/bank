import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  Landmark, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle,
  KeyRound,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const { login, isAuthenticated, isAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      const target = location.state?.from?.pathname || '/admin/dashboard';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate, location]);

  const handleFillDemo = () => {
    setEmail('admin@bankingservices.com');
    setPassword('Admin@123');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        const target = location.state?.from?.pathname || '/admin/dashboard';
        navigate(target, { replace: true });
      }, 700);
    } else {
      setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-sm mb-5">
            <div className="bg-gradient-to-tr from-blue-700 to-blue-500 p-2.5 rounded-xl text-white shadow-sm">
              <Landmark size={24} className="stroke-[2.5]" />
            </div>
            <div className="text-left">
              <span className="text-lg font-black tracking-tight text-slate-900 block leading-tight">
                BANKING SERVICES
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-blue-600 block leading-none">
                TRUSTED FINANCIAL PARTNER
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-semibold uppercase tracking-wider mb-2">
            <KeyRound size={12} />
            <span>Branch Administrator Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Access Verification
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Sign in with authorized administrative credentials to manage branch operations
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl text-slate-800 relative z-20">
          
          {/* Quick Demo Fill Bar */}
          <div className="mb-6 p-3 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-500" />
              <div className="text-left">
                <p className="text-xs font-bold text-amber-800">Testing Admin Demo?</p>
                <p className="text-[10px] text-amber-600/80">admin@bankingservices.com</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-3 py-1.5 text-xs font-semibold bg-white border border-amber-200 hover:bg-amber-100 text-amber-700 rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              Autofill Demo
            </button>
          </div>

          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Authorization Confirmed</h3>
              <p className="text-xs text-slate-500">Opening Banking Services Admin Dashboard...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-xs text-red-700 font-medium">
                  <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Staff Email / Admin ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@bankingservices.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Security Passkey / Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter security password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Session */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 bg-white text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                  />
                  <span className="ml-2 font-medium text-slate-600">Keep session active</span>
                </label>
                <span className="text-[11px] text-slate-500">Role: Branch Admin</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl font-bold text-sm tracking-wide bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
                    <span>Validating Security Token...</span>
                  </div>
                ) : (
                  <>
                    <span>Authenticate & Access Dashboard</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer note */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500 flex items-center justify-between">
            <Link to="/" className="text-slate-500 hover:text-slate-800 transition-colors">
              ← Return to Main Website
            </Link>
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Customer Login
            </Link>
          </div>
        </div>

        {/* RBI Compliance Footer */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck size={16} className="text-emerald-500" />
          <span>RBI IT Governance Compliant • 256-Bit SSL Encrypted Admin Console</span>
        </div>

      </motion.div>
    </div>
  );
};

export default AdminLogin;
