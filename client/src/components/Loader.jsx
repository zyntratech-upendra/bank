import { motion } from 'framer-motion';
import { Landmark, ShieldCheck } from 'lucide-react';
import { useEffect } from 'react';

const Loader = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1250);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-[#faf8f4] via-[#ffffff] to-[#f4eee3] text-slate-800 overflow-hidden select-none"
    >
      {/* Ambient background glows */}
      <div className="absolute w-[600px] h-[600px] bg-[#c48722]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute w-80 h-80 bg-[#0e274a]/5 rounded-full blur-[90px] pointer-events-none" />

      {/* Decorative concentric watermark rings */}
      <div className="absolute w-[440px] h-[440px] rounded-full border border-[#c48722]/15 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full border border-slate-200/50 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        
        {/* Animated Brand Emblem */}
        <div className="relative mb-6">
          {/* Subtle spinning dashed golden halo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
            className="absolute -inset-3.5 rounded-full border border-dashed border-[#c48722]/40"
          />

          {/* Soft breathing golden glow */}
          <motion.div
            animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.65, 0.35] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
            className="absolute -inset-2.5 rounded-3xl bg-gradient-to-tr from-[#c48722]/40 to-amber-200/50 blur-lg"
          />

          {/* Main Icon Container - Deep Navy with Gold Border */}
          <motion.div
            initial={{ scale: 0.75, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 bg-[#0e274a] border-2 border-[#c48722] rounded-3xl flex items-center justify-center shadow-[0_12px_30px_rgba(14,39,74,0.18)]"
          >
            <Landmark className="w-12 h-12 sm:w-14 sm:h-14 text-[#f5c76c] stroke-[2.2] drop-shadow-sm" />
          </motion.div>
        </div>

        {/* Brand Name Typography */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-1.5"
        >
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#0e274a] font-display">
            BANKING
          </h1>
          <p className="text-xs sm:text-sm font-extrabold tracking-[0.35em] text-[#c48722] uppercase">
            SERVICES
          </p>

          <div className="pt-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#fcedd7] border border-[#f5d7ad] text-[#935b0b] text-xs font-bold tracking-wide shadow-2xs">
              <ShieldCheck size={14} className="text-[#c48722]" />
              <span>Government Bank Tie-up Partner</span>
            </span>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default Loader;
