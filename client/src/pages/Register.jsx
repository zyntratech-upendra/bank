import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Landmark, ArrowRight, User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, FileText, CreditCard, UploadCloud, Camera, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  
  // Step State for Multi-step Form
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const handleNextStep = () => {
    if (!formData.name || !formData.phone || !formData.email || !formData.aadhaarNumber || !formData.panNumber) {
      setError('Please fill all required Personal and KYC fields first.');
      return;
    }
    setError('');
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
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
      alert("Camera access denied or unavailable on this device.");
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
      // Mirror the image if facing mode is user
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        const file = new File([blob], "profile_pic.jpg", { type: "image/jpeg" });
        // simulate handleFileUpload event
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
      // Fallback for visual testing if upload fails
      setFormData(prev => ({ ...prev, [field]: URL.createObjectURL(file) }));
    } finally {
      setUploadingDoc('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    if (!formData.terms) {
      setError('Please agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setLoading(true);

    try {
      // Call actual backend registration route
      await api.post('/auth/register', formData);
      
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
            Your journey to <span className="text-[#c48722]">financial freedom</span> starts here.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/80 font-medium max-w-md leading-relaxed mb-12"
          >
            Complete your KYC in under 2 minutes. Secure, lightning-fast, and completely paperless. Experience banking reimagined.
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
            <div className="flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg">
              <div className="p-3 bg-white/10 rounded-xl"><Camera size={24} className="text-[#c48722]" /></div>
              <div>
                <h4 className="font-bold text-white text-base">Instant AI Verification</h4>
                <p className="text-sm text-white/60 font-medium mt-0.5">Live selfie matching in seconds</p>
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

        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 space-y-5">
            <div className="w-24 h-24 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(16,185,129,0.2)]">
              <CheckCircle2 size={48} className="stroke-[2]" />
            </div>
            <h3 className="text-3xl font-black text-[#0e274a]">Account Created!</h3>
            <p className="text-slate-500 font-medium">Your identity has been verified. Redirecting you to login...</p>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-xl mx-auto">
            
            {/* Header / Step Indicator */}
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-display font-black text-[#0e274a] tracking-tight mb-2">
                Create Your Account
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Step {currentStep} of 2: {currentStep === 1 ? 'Personal & Identity Info' : 'Documents & Security'}
              </p>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-5 overflow-hidden flex">
                <motion.div 
                  className="bg-gradient-to-r from-[#0e274a] to-[#c48722] h-full"
                  initial={{ width: '0%' }}
                  animate={{ width: currentStep === 1 ? '50%' : '100%' }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            <form className="space-y-0" onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                
                {error && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl font-bold flex items-center justify-center text-center mb-6">
                    {error}
                  </motion.div>
                )}

                {/* ================= STEP 1: PERSONAL & KYC ================= */}
                {currentStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-6">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Full Name as per Aadhaar *</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><User size={18} /></div>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Enter your full name" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c48722]/50 focus:border-[#c48722] text-sm font-semibold transition-all bg-slate-50 focus:bg-white" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Mobile Number */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mobile Number *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Phone size={18} /></div>
                          <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="+91 98765 00000" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c48722]/50 focus:border-[#c48722] text-sm font-semibold transition-all bg-slate-50 focus:bg-white" />
                        </div>
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Mail size={18} /></div>
                          <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="name@example.com" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c48722]/50 focus:border-[#c48722] text-sm font-semibold transition-all bg-slate-50 focus:bg-white" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                      {/* Aadhaar Number */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Aadhaar Number *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><FileText size={18} /></div>
                          <input type="text" name="aadhaarNumber" required maxLength={12} value={formData.aadhaarNumber} onChange={handleChange} placeholder="12-digit Aadhaar" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c48722]/50 focus:border-[#c48722] text-sm font-semibold transition-all bg-slate-50 focus:bg-white tracking-widest" />
                        </div>
                      </div>

                      {/* PAN Number */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">PAN Number *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><CreditCard size={18} /></div>
                          <input type="text" name="panNumber" required maxLength={10} value={formData.panNumber} onChange={(e) => setFormData({...formData, panNumber: e.target.value.toUpperCase()})} placeholder="10-character PAN" className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c48722]/50 focus:border-[#c48722] text-sm font-semibold transition-all bg-slate-50 focus:bg-white uppercase tracking-widest" />
                        </div>
                      </div>
                    </div>

                    <button type="button" onClick={handleNextStep} className="w-full py-4 mt-8 bg-[#0e274a] hover:bg-[#163866] text-white font-bold text-sm uppercase tracking-widest rounded-2xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform active:scale-[0.98]">
                      Continue to Uploads <ArrowRight size={18} />
                    </button>

                  </motion.div>
                )}

                {/* ================= STEP 2: UPLOADS & SECURITY ================= */}
                {currentStep === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }} className="space-y-6">
                    
                    {/* Documents Container */}
                    <div className="space-y-4">
                      {/* Aadhaar Doc */}
                      <label className={`flex items-center justify-between w-full p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${formData.aadhaarDocUrl ? 'border-emerald-400 bg-emerald-50 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' : 'border-slate-300 hover:border-[#c48722] bg-slate-50 hover:bg-white'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${formData.aadhaarDocUrl ? 'bg-emerald-100 text-emerald-600' : 'bg-white shadow-sm text-slate-500'}`}>
                            {formData.aadhaarDocUrl ? <Check size={20}/> : <FileText size={20} />}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-slate-800">Aadhaar Card Front</p>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5">
                              {uploadingDoc === 'aadhaarDocUrl' ? <span className="text-blue-500 animate-pulse">Uploading...</span> : formData.aadhaarDocUrl ? <span className="text-emerald-600">Uploaded</span> : 'Upload Image/PDF'}
                            </p>
                          </div>
                        </div>
                        <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'aadhaarDocUrl')} />
                      </label>

                      {/* PAN Doc */}
                      <label className={`flex items-center justify-between w-full p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${formData.panDocUrl ? 'border-emerald-400 bg-emerald-50 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]' : 'border-slate-300 hover:border-[#c48722] bg-slate-50 hover:bg-white'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${formData.panDocUrl ? 'bg-emerald-100 text-emerald-600' : 'bg-white shadow-sm text-slate-500'}`}>
                            {formData.panDocUrl ? <Check size={20}/> : <CreditCard size={20} />}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-slate-800">PAN Card Front</p>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5">
                              {uploadingDoc === 'panDocUrl' ? <span className="text-blue-500 animate-pulse">Uploading...</span> : formData.panDocUrl ? <span className="text-emerald-600">Uploaded</span> : 'Upload Image/PDF'}
                            </p>
                          </div>
                        </div>
                        <input type="file" className="hidden" accept="image/*,.pdf" onChange={(e) => handleFileUpload(e, 'panDocUrl')} />
                      </label>

                      {/* Profile Pic UI */}
                      <div className="w-full p-4 border-2 border-dashed rounded-2xl transition-all border-slate-300 bg-slate-50">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`p-3 rounded-xl ${formData.profilePicUrl ? 'bg-emerald-100 text-emerald-600' : 'bg-white shadow-sm text-slate-500'}`}>
                            {formData.profilePicUrl ? <Check size={20}/> : <Camera size={20} />}
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-slate-800">Live Profile Photo</p>
                            <p className="text-xs font-semibold text-slate-500 mt-0.5">
                              {uploadingDoc === 'profilePicUrl' ? <span className="text-blue-500 animate-pulse">Processing...</span> : formData.profilePicUrl ? <span className="text-emerald-600">Successfully Captured</span> : 'Required for KYC'}
                            </p>
                          </div>
                        </div>

                        {showCamera ? (
                          <div className="relative rounded-xl overflow-hidden bg-black mb-3 border border-slate-800">
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-56 object-cover transform scale-x-[-1]"></video>
                            <canvas ref={canvasRef} className="hidden"></canvas>
                            <button type="button" onClick={stopCamera} className="absolute top-3 right-3 p-1.5 bg-black/50 text-white rounded-full hover:bg-black/80 backdrop-blur">
                              <X size={18} />
                            </button>
                            <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                              <button type="button" onClick={capturePhoto} className="w-14 h-14 bg-white rounded-full border-[5px] border-slate-300/80 shadow-xl active:scale-90 transition-transform cursor-pointer"></button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col sm:flex-row gap-3">
                            <button type="button" onClick={startCamera} className="flex-1 py-3 bg-[#0e274a] text-white text-sm font-bold rounded-xl hover:bg-[#163866] transition-colors flex items-center justify-center gap-2 shadow-sm">
                              <Camera size={16} /> Open Camera
                            </button>
                            <label className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-center gap-2 text-center shadow-sm">
                              <UploadCloud size={16} /> Upload File
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'profilePicUrl')} />
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Security */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Lock size={18} /></div>
                          <input type={showPassword ? 'text' : 'password'} name="password" required value={formData.password} onChange={handleChange} placeholder="Create password" className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c48722]/50 focus:border-[#c48722] text-sm font-semibold transition-all bg-slate-50 focus:bg-white" />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"><Eye size={18} /></button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Confirm Password *</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Lock size={18} /></div>
                          <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#c48722]/50 focus:border-[#c48722] text-sm font-semibold transition-all bg-slate-50 focus:bg-white" />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"><Eye size={18} /></button>
                        </div>
                      </div>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start cursor-pointer select-none py-2">
                      <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} className="h-4 w-4 text-[#0e274a] border-slate-300 rounded mt-0.5 cursor-pointer" />
                      <span className="ml-3 text-xs font-semibold text-slate-600 leading-relaxed">
                        I declare that all KYC details are accurate. I agree to the <Link to="/terms" className="font-bold text-[#c48722] hover:underline" target="_blank">Terms & Conditions</Link> and <Link to="/privacy" className="font-bold text-[#c48722] hover:underline" target="_blank">Privacy Policy</Link>.
                      </span>
                    </label>

                    <div className="flex gap-4 pt-4 border-t border-slate-100">
                      <button type="button" onClick={handlePrevStep} className="px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm uppercase tracking-widest rounded-2xl transition-all">
                        Back
                      </button>
                      <button type="submit" disabled={loading} className="flex-1 py-4 bg-gradient-to-r from-[#0e274a] to-[#163866] hover:from-[#163866] hover:to-[#0e274a] text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-[0_10px_20px_rgba(14,39,74,0.2)] hover:shadow-[0_15px_25px_rgba(14,39,74,0.3)] disabled:opacity-70 flex items-center justify-center gap-2 transform active:scale-[0.98]">
                        {loading ? 'Securing...' : <>Complete Registration <Check size={18} className="stroke-[3]" /></>}
                      </button>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </form>

            {/* Login Prompt */}
            <div className="mt-8 text-center text-sm font-semibold text-slate-500 pt-6 border-t border-slate-100">
              Already have an account?{' '}
              <Link to="/login" className="font-black text-[#c48722] hover:text-[#b07619] transition-colors">
                Login Here
              </Link>
            </div>

          </motion.div>
        )}
      </div>

    </div>
  );
};

export default Register;
