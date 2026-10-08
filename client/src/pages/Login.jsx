import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, ArrowRight, Mail, Lock, Eye, EyeOff, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', {
        email: identifier,
        password
      });
      
      localStorage.setItem('bank_token', res.data.token);
      localStorage.setItem('bank_user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#faf7f2] font-sans selection:bg-[#c48722] selection:text-white">
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap');`}
      </style>

      {/* ================= LEFT INFORMATIVE PANEL (Desktop Only) ================= */}
      <div className="hidden lg:flex w-full lg:w-[45%] bg-gradient-to-br from-[#0e274a] via-[#122e58] to-[#163866] text-white flex-col justify-between p-12 lg:p-20 relative overflow-hidden shadow-2xl z-10">
        {/* Glassmorphic Ambient Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#c48722]/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4"></div>
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 flex flex-col items-start">
          <Link to="/" className="inline-flex items-center space-x-3 mb-16 group">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-2xl shadow-xl transition-transform group-hover:scale-105">
              <Landmark size={32} className="stroke-[2.2]" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight block leading-none">BANKING</span>
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#c48722] block mt-1">SERVICES</span>
            </div>
          </Link>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl xl:text-6xl text-white tracking-wide leading-tight mb-6"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            Welcome back to <span className="text-[#c48722]">premium banking</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/80 font-medium max-w-md leading-relaxed mb-12"
          >
            Securely access your gold loans, transfers, and applications. Experience seamless financial management.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 w-full"
          >
            <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
              <div className="p-3 bg-white/10 rounded-xl"><ShieldCheck size={24} className="text-emerald-400" /></div>
              <div>
                <h4 className="font-bold text-white text-base">Bank-Grade Security</h4>
                <p className="text-sm text-white/60 font-medium mt-0.5">256-bit encryption for your data</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 pt-12">
          <p className="text-sm font-semibold text-white/40">© 2026 Banking Services. All rights reserved.</p>
        </div>
      </div>

      {/* ================= RIGHT FORM PANEL (Responsive) ================= */}
      <div className="w-full lg:w-[55%] flex flex-col py-10 px-6 sm:px-12 lg:px-20 xl:px-32 relative justify-center bg-white min-h-screen">
        
        {/* Mobile Brand Header */}
        <div className="lg:hidden flex items-center justify-center space-x-2.5 mb-10 group mt-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#0e274a] text-white p-2.5 rounded-xl shadow-md">
              <Landmark size={28} className="stroke-[2.2]" />
            </div>
            <div className="text-left">
              <span className="text-xl font-black tracking-tight text-[#0e274a] block leading-none">BANKING</span>
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#c48722] block mt-1">SERVICES</span>
            </div>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }} 
          className="w-full max-w-lg mx-auto bg-white p-8 sm:p-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(14,39,74,0.1)] border border-slate-100 hover:shadow-[0_30px_70px_-15px_rgba(14,39,74,0.15)] transition-shadow duration-500 relative overflow-hidden"
        >
          {/* Decorative Top Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#0e274a] via-[#c48722] to-[#0e274a]"></div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-display font-black text-[#0e274a] tracking-tight mb-2">
              Sign In
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Access your accounts and applications securely.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl font-bold flex items-center justify-center text-center">
                {error}
              </motion.div>
            )}

            {/* Mobile / Email Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Mobile Number / Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter registered mobile or email"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c48722]/50 focus:border-[#c48722] text-sm font-semibold transition-all bg-slate-50 focus:bg-white"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c48722]/50 focus:border-[#c48722] text-sm font-semibold transition-all bg-slate-50 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#0e274a] focus:ring-[#c48722] border-slate-300 rounded cursor-pointer"
                />
                <span className="ml-2 font-semibold text-slate-600">Remember me</span>
              </label>

              <a href="#" className="font-bold text-[#c48722] hover:text-[#b07619] transition-colors">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#0e274a] to-[#163866] hover:from-[#163866] hover:to-[#0e274a] text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_20px_rgba(14,39,74,0.2)] hover:shadow-[0_15px_25px_rgba(14,39,74,0.3)] disabled:opacity-70 mt-4 flex items-center justify-center gap-2 transform active:scale-[0.98]"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Login</span>
                  <ArrowRight size={18} className="stroke-[3]" />
                </>
              )}
            </button>

            {/* Social / OTP Divider */}
            <div className="relative pt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="px-3 bg-white text-slate-400 font-bold tracking-wider">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Button */}
            <div className="pt-2">
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

          </form>

          {/* Register Prompt */}
          <div className="mt-8 text-center text-sm font-semibold text-slate-500 pt-6 border-t border-slate-100">
            Don't have an account?{' '}
            <Link to="/register" className="font-black text-[#c48722] hover:text-[#b07619] transition-colors">
              Register Now
            </Link>
          </div>

        </motion.div>
      </div>

    </div>
  );
};

export default Login;
