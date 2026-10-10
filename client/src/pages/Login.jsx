import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
      setError(err.response?.data?.message || 'Invalid credentials. Please verify your email/mobile and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-800 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar */}
      <header className="w-full bg-white border-b border-slate-200/80 py-4 px-6 sm:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-tr from-blue-700 to-blue-600 text-white p-2.5 rounded-xl shadow-md transition-transform group-hover:scale-105">
            <img src="/logo.png" alt="Shayaan Swarna Mitra Logo" className="h-8 w-auto object-contain" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 leading-none block font-display">
              BANKING
            </span>
            <span className="text-[10px] font-bold tracking-[0.22em] text-blue-600 leading-none block mt-0.5">
              SERVICES
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-xs font-semibold text-slate-500">
            Don't have an account?
          </span>
          <Link 
            to="/register" 
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-xl transition-all"
          >
            Register
          </Link>
        </div>
      </header>

      {/* Main Content Area - NxtWave Split Layout */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 xl:gap-20">
          
          {/* Left Side: Clean NxtWave Banking Vector Illustration */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center order-2 lg:order-1">
            <div className="relative w-full max-w-md sm:max-w-lg">
              <img 
                src="/images/iconscout_banking_vector.png" 
                alt="Banking Website Portal Illustration" 
                className="w-full h-auto object-contain max-h-[360px] sm:max-h-[440px] drop-shadow-md mx-auto transition-transform duration-500 hover:scale-102"
              />
            </div>
            
            <div className="mt-4 sm:mt-6 max-w-md">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight">
                Secure Banking at Your Fingertips
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
                Track live gold loan rates, manage active disbursals, and experience quick, transparent financial services.
              </p>
            </div>
          </div>

          {/* Right Side: Clean NxtWave White Form Card */}
          <div className="w-full lg:w-1/2 max-w-md order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-7 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-slate-200/80">
              
              {/* Form Card Header */}
              <div className="mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 border border-blue-100">
                  <img src="/logo.png" alt="Shayaan Swarna Mitra Logo" className="h-8 w-auto object-contain" />
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
                  Sign In
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Please enter your credentials to login
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Error Banner */}
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl font-bold">
                    *{error}
                  </div>
                )}

                {/* Username / Mobile / Email */}
                <div>
                  <label 
                    htmlFor="username" 
                    className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5"
                  >
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail size={17} />
                    </div>
                    <input
                      id="username"
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="Enter registered email or mobile"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label 
                      htmlFor="password" 
                      className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider"
                    >
                      Password
                    </label>
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); alert("Password reset instructions will be sent to your registered email."); }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock size={17} />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all bg-slate-50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center pt-0.5">
                  <label className="flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded cursor-pointer"
                    />
                    <span className="ml-2 text-xs font-semibold text-slate-600">Remember me</span>
                  </label>
                </div>

                {/* NxtWave Style Solid Primary Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 flex items-center justify-center gap-2 transform active:scale-[0.99] cursor-pointer mt-2"
                >
                  {loading ? (
                    <span>Logging in...</span>
                  ) : (
                    <>
                      <span>Login</span>
                      <ArrowRight size={17} className="stroke-[2.5]" />
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-100" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-3 bg-white text-slate-400 font-bold tracking-wider text-[10px]">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign-in */}
                <button
                  type="button"
                  onClick={() => alert("Google Single Sign-On is available for verified accounts.")}
                  className="w-full inline-flex items-center justify-center gap-2.5 py-3 px-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span>Sign in with Google</span>
                </button>

              </form>

              {/* Bottom Prompt */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs font-semibold text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                  Register Now
                </Link>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Clean Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white">
        © 2026 Shayaan Swarna Mitra. All rights reserved. • ISO 27001 Certified • Bank-Grade Security
      </footer>

    </div>
  );
};

export default Login;
