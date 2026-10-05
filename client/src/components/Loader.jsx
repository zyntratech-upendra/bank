import { motion } from 'framer-motion';
import { Landmark } from 'lucide-react';
import { useState, useEffect } from 'react';

const Loader = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onFinish && onFinish(), 300);
          return 100;
        }
        return prev + 5;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeInOut' } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#08182f] text-white"
    >
      {/* Background glowing ambient light */}
      <div className="absolute w-96 h-96 bg-[#c48722]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        
        {/* Animated Emblem with Golden Aura */}
        <div className="relative mb-6">
          {/* Pulsing ring */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="absolute -inset-3 rounded-2xl bg-gradient-to-tr from-[#c48722] to-amber-200 blur-md opacity-40"
          />

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-20 h-20 bg-gradient-to-br from-[#0e274a] to-[#08182f] border-2 border-[#c48722] rounded-2xl flex items-center justify-center shadow-2xl"
          >
            <Landmark size={40} className="text-[#e5a83b] stroke-[2.2]" />
          </motion.div>
        </div>

        {/* Brand Name */}
        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-1"
        >
          <h2 className="text-3xl font-black tracking-tight text-white font-display">
            BANKING
          </h2>
          <p className="text-xs font-bold tracking-[0.35em] text-[#d89e34] uppercase">
            SERVICES
          </p>
          <p className="text-[11px] text-slate-400 font-medium tracking-wider pt-2">
            Government Bank Tie-up Partner
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="w-56 h-1.5 bg-slate-800 rounded-full mt-8 overflow-hidden relative">
          <motion.div
            className="h-full bg-gradient-to-r from-[#c48722] to-amber-300 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>

        <span className="text-[11px] font-mono text-slate-400 mt-2">
          {progress}%
        </span>
      </div>
    </motion.div>
  );
};

export default Loader;
