import { motion } from 'framer-motion';

export default function HeroSection({ onDive }) {
  return (
    <section 
      id="hero" 
      className="relative min-h-screen pt-0 pb-0 flex flex-col items-center justify-center overflow-hidden z-[1]"
      aria-label="Hero — Ocean Surface"
    >
      {/* Animated wave layers */}
      <div className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none z-[2] overflow-hidden max-md:h-[30%]">
        <svg className="absolute bottom-0 left-0 w-[200%] h-full wave-1" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path className="wave-path" fill="rgba(0,119,182,0.35)" d="M0,160 C360,260 720,60 1080,160 C1260,210 1350,180 1440,160 L1440,320 L0,320Z"/>
        </svg>
        <svg className="absolute bottom-0 left-0 w-[200%] h-full wave-2" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path className="wave-path" fill="rgba(0,180,216,0.25)" d="M0,200 C240,100 480,280 720,200 C960,120 1200,240 1440,200 L1440,320 L0,320Z"/>
        </svg>
        <svg className="absolute bottom-0 left-0 w-[200%] h-full wave-3" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path className="wave-path" fill="rgba(144,224,239,0.15)" d="M0,240 C480,140 960,320 1440,240 L1440,320 L0,320Z"/>
        </svg>
      </div>

      {/* Floating particles (pure CSS) */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className="absolute rounded-full bg-white/40 animate-[float-particle_6s_ease-in-out_infinite]"
            style={{ 
              width: [8, 5, 12, 6, 10, 7][i], 
              height: [8, 5, 12, 6, 10, 7][i],
              top: ['15%', '30%', '55%', '70%', '20%', '80%'][i],
              left: ['10%', '75%', '20%', '85%', '50%', '40%'][i],
              animationDuration: ['7s', '5s', '9s', '6s', '8s', '7.5s'][i],
              animationDelay: ['0s', '1s', '2s', '0.5s', '3s', '1.5s'][i]
            }}
          />
        ))}
      </div>

      <div className="relative z-[3] flex flex-col items-center gap-5 p-8 max-w-[800px] text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-head text-[0.9rem] font-semibold tracking-[0.25em] text-white/70 uppercase"
        >
          An Immersive Ocean Journey
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="font-head text-[clamp(2.4rem,10vw,7rem)] font-[900] leading-[1.0] tracking-[-0.04em] flex flex-col"
        >
          <span className="text-white drop-shadow-[0_4px_40px_rgba(0,0,0,0.3)]">Dive Into the</span>
          <span className="clip-text-gradient bg-gradient-to-br from-[#00d4ff] via-[#48cae4] to-[#90e0ef]">Ocean Depths</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-[clamp(0.95rem,2.2vw,1.2rem)] text-white/80 leading-[1.8] max-w-[600px]"
        >
          Journey from the sunlit surface to the crushing darkness of the abyss —<br />
          a world stranger than fiction, and mostly unexplored.
        </motion.p>

        <motion.button 
          onClick={onDive}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
          className="group relative inline-flex items-center gap-2.5 px-10 py-4 bg-gradient-to-br from-[#00d4ff] to-[#0077b6] rounded-full text-white font-head text-[1rem] font-bold tracking-wide shadow-[0_8px_40px_rgba(0,212,255,0.4),0_2px_10px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:scale-105 hover:shadow-[0_16px_60px_rgba(0,212,255,0.6),0_4px_20px_rgba(0,0,0,0.3)] transition-all duration-300 overflow-hidden"
          aria-label="Start the dive journey"
        >
          <div className="absolute inset-0 bg-white/15 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          <span className="relative z-10">Start the Journey</span>
          <span className="relative z-10 text-[1.3rem] animate-[bounce-arrow_1.5s_ease-in-out_infinite]">↓</span>
        </motion.button>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex flex-col items-center gap-1.5 text-[0.75rem] text-white/50 tracking-[0.1em] uppercase mt-4" 
          aria-hidden="true"
        >
          <span className="block w-[1px] h-10 bg-gradient-to-b from-transparent to-white/50 animate-[scroll-line_1.5s_ease-in-out_infinite]" />
          <span>Scroll to dive</span>
        </motion.div>
      </div>

      {/* Hero Fish purely decorative */}
      <div className="absolute inset-0 pointer-events-none z-[2] overflow-hidden">
        <div className="absolute text-[1.5rem] top-[25%] animate-[swim-across_22s_linear_infinite] drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">🐟</div>
        <div className="absolute text-[2.5rem] top-[60%] animate-[swim-across_16s_linear_infinite_-6s] drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">🐠</div>
        <div className="absolute text-[3rem] top-[40%] animate-[swim-across_28s_linear_infinite_-12s] drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]">🐬</div>
      </div>

      <style>{`
        @keyframes scroll-line {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.3); }
        }
        @keyframes bounce-arrow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        @keyframes swim-across {
          0% { transform: translateX(-15vw) scaleX(1); opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { transform: translateX(115vw) scaleX(1); opacity: 0; }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
        }
      `}</style>
    </section>
  );
}