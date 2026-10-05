import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, ArrowRight, Mail, Lock, Eye, EyeOff, ShieldCheck, Phone, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate authentication
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }, 800);
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-[#faf7f2] via-[#fcfaf7] to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2.5 mb-6 group">
          <div className="bg-[#0e274a] text-white p-2.5 rounded-xl shadow-md group-hover:bg-[#163866] transition-colors">
            <Landmark size={28} className="stroke-[2.2]" />
          </div>
          <div className="text-left">
            <span className="text-xl font-black tracking-tight text-[#0e274a] block leading-none">
              BANKING
            </span>
            <span className="text-[11px] font-bold tracking-[0.2em] text-[#c48722] block leading-none mt-1">
              SERVICES
            </span>
          </div>
        </Link>
        
        <h2 className="text-3xl sm:text-[34px] font-display font-black text-[#0e274a] tracking-tight">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-slate-500 font-normal">
          Login to manage your gold loans, transfers, and applications
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white py-8 px-6 sm:px-10 shadow-[0_15px_40px_rgba(15,36,65,0.08)] rounded-3xl border border-slate-200/80"
        >
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-2xl font-bold text-[#0e274a]">Login Successful!</h3>
              <p className="text-sm text-slate-500">Redirecting to your dashboard...</p>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit}>
              
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                  {error}
                </div>
              )}

              {/* Mobile / Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Mobile Number / Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Enter registered mobile or email"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c48722]/50 focus:border-[#c48722] text-sm font-medium transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Password *
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
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c48722]/50 focus:border-[#c48722] text-sm font-medium transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
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
                  <span className="ml-2 font-medium text-slate-600">Remember me</span>
                </label>

                <a href="#" className="font-bold text-[#c48722] hover:text-[#b07619] transition-colors">
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#0e274a] hover:bg-[#163866] text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-70 mt-2"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Login</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              {/* Social / OTP Divider */}
              <div className="relative pt-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-3 bg-white text-slate-400 font-bold tracking-wider">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google & OTP Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
                >
                  <Phone size={14} className="text-[#0e274a]" />
                  <span>Phone (OTP)</span>
                </button>
              </div>

            </form>
          )}

          {/* Register Prompt */}
          <div className="mt-8 text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#c48722] hover:text-[#b07619] transition-colors">
              Register Now
            </Link>
          </div>

        </motion.div>

        {/* Security Assurance Badge */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={15} className="text-emerald-600" />
          <span>Protected by 256-bit Encryption • RBI Compliant Partner</span>
        </div>

      </div>

    </div>
  );
};

export default Login;
