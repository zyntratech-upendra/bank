import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Landmark, ArrowRight, User, Mail, Phone, Lock, Eye, EyeOff, 
  ShieldCheck, CheckCircle2, FileText, CreditCard, UploadCloud, 
  Camera, Check, X, ArrowLeft
} from 'lucide-react';
import api from '../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    aadhaarNumber: '',
    panNumber: '',
    aadhaarDocUrl: '',
    panDocUrl: '',
    profilePicUrl: '',
    terms: false
  });

  const [uploadingDoc, setUploadingDoc] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Step State for Multi-step Form (1: Personal & KYC, 2: Uploads & Security)
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleNextStep = () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.aadhaarNumber || !formData.panNumber) {
      setError('Please fill in all personal and identity fields before continuing.');
      return;
    }
    setError('');
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep(1);
  };

  // Webcam States
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);

  const startCamera = async () => {
    setShowCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      setMediaStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access denied", err);
      alert("Camera access denied or unavailable. Please upload a photo file instead.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      // Mirror image
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], "profile_pic.jpg", { type: "image/jpeg" });
        handleFileUpload({ target: { files: [file] } }, 'profilePicUrl');
        stopCamera();
      }, 'image/jpeg', 0.85);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingDoc(field);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await api.post("/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.data.secure_url) {
        setFormData(prev => ({ ...prev, [field]: res.data.secure_url }));
      } else {
        setFormData(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
      }
    } catch (err) {
      console.error("Upload Error", err);
      setFormData(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
    } finally {
      setUploadingDoc('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify your password entry.');
      return;
    }

    if (!formData.terms) {
      setError('Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', formData);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1800);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
            Already registered?
          </span>
          <Link 
            to="/login" 
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-xl transition-all"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Content Area - NxtWave Split Layout */}
      <main className="flex-1 flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-12">
        <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 xl:gap-20">
          
          {/* Left Side: Clean NxtWave Banking Transfer Illustration */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center order-2 lg:order-1">
            <div className="relative w-full max-w-md sm:max-w-lg">
              <img 
                src="/images/iconscout_digital_transfer.png" 
                alt="Digital Banking Transfer & Onboarding Illustration" 
                className="w-full h-auto object-contain max-h-[360px] sm:max-h-[440px] drop-shadow-md mx-auto transition-transform duration-500 hover:scale-102"
              />
            </div>
            
            <div className="mt-4 sm:mt-6 max-w-md">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display tracking-tight">
                Paperless Digital Account Onboarding
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1.5 leading-relaxed">
                Complete your identity verification in minutes. Enjoy instant loan approvals, low rates, and seamless transfers.
              </p>
            </div>
          </div>

          {/* Right Side: Clean NxtWave Form Card */}
          <div className="w-full lg:w-1/2 max-w-lg order-1 lg:order-2">
            
            {success ? (
              <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-slate-200/80 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <CheckCircle2 size={36} className="stroke-[2.5]" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-display">
                  Account Created Successfully!
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-2">
                  Your identity verification has been processed. Redirecting you to login...
                </p>
                <div className="mt-6 flex justify-center">
                  <div className="w-7 h-7 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-7 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-slate-200/80">
                
                {/* Form Card Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold tracking-wider text-blue-600 uppercase bg-blue-50 px-2.5 py-1 rounded-lg">
                      Step {currentStep} of 2
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      {currentStep === 1 ? 'Personal Info' : 'KYC & Password'}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
                    Create Account
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                    {currentStep === 1 ? 'Enter your personal details to begin' : 'Upload your documents to complete KYC'}
                  </p>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full transition-all duration-300" 
                      style={{ width: currentStep === 1 ? '50%' : '100%' }}
                    />
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Error Banner */}
                  {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs rounded-xl font-bold">
                      *{error}
                    </div>
                  )}

                  {/* ================= STEP 1 ================= */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Full Name as per Aadhaar *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <User size={17} />
                          </div>
                          <input 
                            type="text" 
                            name="name" 
                            required 
                            value={formData.name} 
                            onChange={handleChange} 
                            placeholder="Enter your full name" 
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all bg-slate-50 focus:bg-white" 
                          />
                        </div>
                      </div>

                      {/* Mobile & Email Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Mobile Number *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                              <Phone size={17} />
                            </div>
                            <input 
                              type="tel" 
                              name="phone" 
                              required 
                              value={formData.phone} 
                              onChange={handleChange} 
                              placeholder="+91 98765 00000" 
                              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all bg-slate-50 focus:bg-white" 
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Email Address *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                              <Mail size={17} />
                            </div>
                            <input 
                              type="email" 
                              name="email" 
                              required 
                              value={formData.email} 
                              onChange={handleChange} 
                              placeholder="name@example.com" 
                              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all bg-slate-50 focus:bg-white" 
                            />
                          </div>
                        </div>
                      </div>

                      {/* Aadhaar & PAN Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Aadhaar Number *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                              <FileText size={17} />
                            </div>
                            <input 
                              type="text" 
                              name="aadhaarNumber" 
                              required 
                              maxLength={12} 
                              value={formData.aadhaarNumber} 
                              onChange={handleChange} 
                              placeholder="12-digit UIDAI" 
                              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all bg-slate-50 focus:bg-white tracking-wider" 
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            PAN Number *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                              <CreditCard size={17} />
                            </div>
                            <input 
                              type="text" 
                              name="panNumber" 
                              required 
                              maxLength={10} 
                              value={formData.panNumber} 
                              onChange={(e) => setFormData({...formData, panNumber: e.target.value.toUpperCase()})} 
                              placeholder="10-digit PAN" 
                              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all bg-slate-50 focus:bg-white uppercase tracking-wider" 
                            />
                          </div>
                        </div>
                      </div>

                      <button 
                        type="button" 
                        onClick={handleNextStep} 
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 flex items-center justify-center gap-2 transform active:scale-[0.99] cursor-pointer mt-2"
                      >
                        <span>Continue to Verification</span>
                        <ArrowRight size={17} className="stroke-[2.5]" />
                      </button>
                    </div>
                  )}

                  {/* ================= STEP 2 ================= */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      {/* Document Uploads */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className={`flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-all ${formData.aadhaarDocUrl ? 'border-emerald-500 bg-emerald-50/60' : 'border-dashed border-slate-200 hover:border-blue-500 bg-slate-50'}`}>
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-lg ${formData.aadhaarDocUrl ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-400'}`}>
                              {formData.aadhaarDocUrl ? <Check size={16} /> : <FileText size={16} />}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">Aadhaar Card</p>
                              <p className="text-[10px] font-semibold text-slate-400">
                                {uploadingDoc === 'aadhaarDocUrl' ? 'Uploading...' : formData.aadhaarDocUrl ? 'Uploaded ✓' : 'Upload File'}
                              </p>
                            </div>
                          </div>
                          <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'aadhaarDocUrl')} />
                        </label>

                        <label className={`flex items-center justify-between p-3 border-2 rounded-xl cursor-pointer transition-all ${formData.panDocUrl ? 'border-emerald-500 bg-emerald-50/60' : 'border-dashed border-slate-200 hover:border-blue-500 bg-slate-50'}`}>
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-lg ${formData.panDocUrl ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-400'}`}>
                              {formData.panDocUrl ? <Check size={16} /> : <CreditCard size={16} />}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">PAN Card</p>
                              <p className="text-[10px] font-semibold text-slate-400">
                                {uploadingDoc === 'panDocUrl' ? 'Uploading...' : formData.panDocUrl ? 'Uploaded ✓' : 'Upload File'}
                              </p>
                            </div>
                          </div>
                          <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'panDocUrl')} />
                        </label>
                      </div>

                      {/* Live Selfie Camera Capture */}
                      <div className="p-3.5 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex items-center gap-2.5">
                            <div className={`p-2 rounded-lg ${formData.profilePicUrl ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-400'}`}>
                              {formData.profilePicUrl ? <Check size={16} /> : <Camera size={16} />}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-800">Live Selfie Match</p>
                              <p className="text-[10px] font-semibold text-slate-400">
                                {uploadingDoc === 'profilePicUrl' ? 'Processing...' : formData.profilePicUrl ? 'Selfie Saved ✓' : 'Required for KYC'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {showCamera ? (
                          <div className="relative rounded-xl overflow-hidden bg-black mb-2.5">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-44 object-cover transform scale-x-[-1]" />
                            <canvas ref={canvasRef} className="hidden" />
                            <button 
                              type="button" 
                              onClick={stopCamera} 
                              className="absolute top-2 right-2 p-1 bg-black/60 text-white rounded-full hover:bg-black/80"
                            >
                              <X size={15} />
                            </button>
                            <div className="absolute bottom-2.5 left-0 right-0 flex justify-center">
                              <button 
                                type="button" 
                                onClick={capturePhoto} 
                                className="w-10 h-10 bg-white rounded-full border-4 border-slate-300 shadow cursor-pointer active:scale-90"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <button 
                              type="button" 
                              onClick={startCamera} 
                              className="flex-1 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Camera size={14} /> Open Camera
                            </button>
                            <label className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-center gap-1.5 text-center">
                              <UploadCloud size={14} /> Upload File
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'profilePicUrl')} />
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Password Fields */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Password *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                              <Lock size={17} />
                            </div>
                            <input 
                              type={showPassword ? 'text' : 'password'} 
                              name="password" 
                              required 
                              value={formData.password} 
                              onChange={handleChange} 
                              placeholder="Min 6 characters" 
                              className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all bg-slate-50 focus:bg-white" 
                            />
                            <button 
                              type="button" 
                              onClick={() => setShowPassword(!showPassword)} 
                              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Confirm Password *
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                              <Lock size={17} />
                            </div>
                            <input 
                              type={showConfirmPassword ? 'text' : 'password'} 
                              name="confirmPassword" 
                              required 
                              value={formData.confirmPassword} 
                              onChange={handleChange} 
                              placeholder="Re-enter password" 
                              className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 text-sm font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal transition-all bg-slate-50 focus:bg-white" 
                            />
                            <button 
                              type="button" 
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Terms */}
                      <label className="flex items-start cursor-pointer select-none pt-1">
                        <input 
                          type="checkbox" 
                          name="terms" 
                          checked={formData.terms} 
                          onChange={handleChange} 
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded mt-0.5 cursor-pointer" 
                        />
                        <span className="ml-2.5 text-xs font-medium text-slate-600 leading-snug">
                          I declare all KYC details are correct and agree to the{' '}
                          <Link to="/terms" className="font-bold text-blue-600 hover:underline" target="_blank">Terms</Link> and{' '}
                          <Link to="/privacy" className="font-bold text-blue-600 hover:underline" target="_blank">Privacy Policy</Link>.
                        </span>
                      </label>

                      {/* Buttons */}
                      <div className="flex gap-3 pt-2">
                        <button 
                          type="button" 
                          onClick={handlePrevStep} 
                          className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <ArrowLeft size={16} /> Back
                        </button>

                        <button 
                          type="submit" 
                          disabled={loading} 
                          className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-70 flex items-center justify-center gap-2 transform active:scale-[0.99] cursor-pointer"
                        >
                          {loading ? 'Creating Account...' : <>Complete Registration <Check size={18} className="stroke-[2.5]" /></>}
                        </button>
                      </div>
                    </div>
                  )}

                </form>

                {/* Bottom Prompt */}
                <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs font-semibold text-slate-500">
                  Already have an account?{' '}
                  <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    Login Here
                  </Link>
                </div>

              </div>
            )}

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

export default Register;
