import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroScreen({ onStart }) {
  const [textIndex, setTextIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  const messages = [
    "Preparing Dive Systems...",
    "Initializing Pressure Seals...",
    "Calibrating Depth Sensors...",
    "System Status: READY"
  ];

  useEffect(() => {
    if (textIndex < messages.length - 1) {
      const timer = setTimeout(() => {
        setTextIndex(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setIsReady(true);
    }
  }, [textIndex, messages.length]);

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#000010] overflow-hidden">
      {/* Cinematic Background Overlay */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="w-full h-full object-cover opacity-30 grayscale"
        >
          {/* Fallback to a nice dark gradient if video isn't found */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-underwater-bubbles-and-sun-rays-41366-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#000020]/40 to-[#000010]" />
        
        {/* Particle/Bubble Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
           {[...Array(15)].map((_, i) => (
             <motion.div
               key={i}
               initial={{ y: '110vh', opacity: 0 }}
               animate={{ 
                 y: '-10vh', 
                 opacity: [0, 1, 1, 0],
                 x: Math.random() * 100 + 'vw'
               }}
               transition={{ 
                 duration: 5 + Math.random() * 5, 
                 repeat: Infinity,
                 delay: Math.random() * 5,
                 ease: "linear"
               }}
               className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
             />
           ))}
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-head text-[#00d4ff] text-[0.8rem] tracking-[0.4em] uppercase mb-8"
        >
          Project: Deep Abyss
        </motion.div>

        <div className="h-12 flex items-center justify-center mb-12">
          <AnimatePresence mode="wait">
            <motion.p
              key={textIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="font-head text-white text-[1.1rem] md:text-[1.4rem] font-light tracking-wide italic"
            >
              {messages[textIndex]}
              <span className="inline-block w-1 h-5 bg-[#00d4ff] ml-2 animate-pulse" />
            </motion.p>
          </AnimatePresence>
        </div>

        {isReady && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,212,255,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="group relative px-12 py-5 bg-transparent border border-[#00d4ff]/50 rounded-full overflow-hidden transition-all duration-500"
          >
            <div className="absolute inset-0 bg-[#00d4ff]/10 group-hover:bg-[#00d4ff]/20 transition-colors" />
            <span className="relative z-10 font-head text-[#00d4ff] text-[1.2rem] font-bold tracking-[0.2em] uppercase">
              Click to Start Dive
            </span>
            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-[#00d4ff]/30 to-transparent skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </motion.button>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        className="fixed bottom-10 left-10 text-[0.6rem] text-white/40 font-mono tracking-widest uppercase"
      >
        Elevation: 0m | Pressure: 1 ATM
      </motion.div>
    </div>
  );
}
