import { useState, useEffect, useRef } from 'react';
import OceanCanvas from './three/OceanCanvas';
import DepthMeter from './components/DepthMeter';
import Controls from './components/Controls';
import HeroSection from './sections/HeroSection';
import SunlightZone from './sections/SunlightZone';
import TwilightZone from './sections/TwilightZone';
import MidnightZone from './sections/MidnightZone';
import AbyssZone from './sections/AbyssZone';
import HadalZone from './sections/HadalZone';
import { CreatureModal } from './components/CreatureCard';
import DepthHUD from './components/DepthHUD';
import IntroScreen from './components/IntroScreen';
import { useScrollDepth, useMouseParallax } from './hooks/useScrollDepth';
import { useAudioContext } from './hooks/useAudioContext';
import Lenis from '@studio-freight/lenis';
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion';

function App() {
  const [selectedCreature, setSelectedCreature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [isCycloneActive, setIsCycloneActive] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVoid, setIsVoid] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [lightningFlash, setLightningFlash] = useState(false);
  
  const lenisRef = useRef(null);
  const { 
    isInitialized,
    initAudio: _initAudio, 
    toggleMasterMute, 
    triggerCycloneAudio, 
    stopCycloneAudio, 
    triggerLightningSound 
  } = useAudioContext();

  const initAudio = () => {
    _initAudio();
    setIsAudioEnabled(true);
    toggleMasterMute(false);
  };

  const handleToggleAudio = () => {
    if (!isInitialized) {
      initAudio();
    } else {
      const targetState = !isAudioEnabled;
      setIsAudioEnabled(targetState);
      toggleMasterMute(!targetState);
    }
  };

  const handleStartDive = () => {
    initAudio();
    setShowIntro(false);
    // Force a small scroll to ensure everything initializes
    if (lenisRef.current) {
      setTimeout(() => {
        lenisRef.current.scrollTo(0, { duration: 2, easing: (t) => t });
      }, 100);
    }
  };

  const diveToSection = (id) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(`#${id}`, { 
        duration: 2.5, 
        easing: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2 
      });
    }
  };

  // Shared refs for the 3D canvas (no re-renders)
  const scrollRef = useScrollDepth();
  const mouseRef = useMouseParallax();

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let raf;
    function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => { lenis.destroy(); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Track scroll progress for react state (for React components like DepthHUD)
  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const pct = el.scrollTop / (el.scrollHeight - el.clientHeight);
      const clamped = Math.max(0, Math.min(1, pct || 0));
      setScrollProgress(clamped);
      setIsVoid(clamped > 0.88);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleCyclone = () => {
    initAudio(); // Init audio on first interaction
    if (!isCycloneActive) {
      setIsCycloneActive(true);
      triggerCycloneAudio();
    } else {
      setIsCycloneActive(false);
      stopCycloneAudio();
    }
  };

  const handleLightningStrike = () => {
    triggerLightningSound();
    // Visual HTML lightning flash
    setLightningFlash(true);
    setTimeout(() => setLightningFlash(false), 120);
  };

  // --- Interactive Section Tilting ---
  const mouseX = useSpring(0, { stiffness: 100, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const rotateX = useTransform(mouseY, [-1, 1], [5, -5]);
  const rotateY = useTransform(mouseX, [-1, 1], [-5, 5]);

  const SectionWrapper = ({ children }) => (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="relative z-10"
    >
      {children}
    </motion.div>
  );

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center gap-6 bg-[#000005]"
          >
            <div className="relative w-20 h-20">
              <span className="absolute inset-0 rounded-full border-[3px] border-[#00d4ff] animate-[ripple-out_2s_cubic-bezier(0.16,1,0.3,1)_infinite]" />
              <span className="absolute inset-0 rounded-full border-[3px] border-[#00d4ff] animate-[ripple-out_2s_cubic-bezier(0.16,1,0.3,1)_infinite] opacity-70 [animation-delay:0.5s]" />
            </div>
            <p className="font-head text-[1.1rem] font-light text-[#00d4ff] tracking-[0.15em]">
              LOADING INTERFACE<span className="animate-[blink-dots_1.2s_steps(4)_infinite]">...</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showIntro && !loading && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999]"
          >
            <IntroScreen onStart={handleStartDive} />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes ripple-out {
          0% { transform: scale(0.3); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes blink-dots {
          0%, 100% { opacity: 0; }
          33% { opacity: 1; }
        }
        @keyframes glitch-text {
          0%   { clip-path: inset(30% 0 60% 0); transform: translate(-50%,-50%) translateX(-3px); }
          20%  { clip-path: inset(80% 0 10% 0); transform: translate(-50%,-50%) translateX(3px); }
          40%  { clip-path: inset(50% 0 30% 0); transform: translate(-50%,-50%) translateX(-2px); }
          60%  { clip-path: inset(10% 0 80% 0); transform: translate(-50%,-50%) translateX(2px); }
          80%  { clip-path: inset(60% 0 20% 0); transform: translate(-50%,-50%) translateX(-1px); }
          100% { clip-path: inset(30% 0 60% 0); transform: translate(-50%,-50%) translateX(1px); }
        }
      `}</style>

      <OceanCanvas 
        scrollRef={scrollRef} 
        mouseRef={mouseRef} 
        isCycloneActive={isCycloneActive} 
        triggerLightningSound={handleLightningStrike}
      />

      {lightningFlash && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 98,
          background: 'rgba(200, 240, 255, 0.18)',
          pointerEvents: 'none',
        }} />
      )}

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 5,
          pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23f)' opacity='0.03'/%3E%3C/svg%3E")`,
          opacity: 0.4 + scrollProgress * 0.3,
          mixBlendMode: 'overlay',
        }}
      />

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 4,
          pointerEvents: 'none',
          boxShadow: `inset 0 0 ${40 + scrollProgress * 120}px rgba(0,0,0,${0.1 + scrollProgress * 0.6})`
        }}
      />

      <Controls 
        isAudioEnabled={isAudioEnabled} 
        onToggleAudio={handleToggleAudio} 
      />
      <DepthMeter />
      <DepthHUD scrollProgress={scrollProgress} />

      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99,
          background: 'rgba(0,0,0,0.0)',
          pointerEvents: 'none',
          transition: 'opacity 1.5s',
          opacity: isVoid ? 1 : 0,
        }}
      >
        {isVoid && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            fontFamily: "'Courier New', monospace",
            color: '#ff0040',
            textShadow: '0 0 20px #ff0040',
            pointerEvents: 'none',
            animation: 'glitch-text 0.3s infinite',
          }}>
            <p style={{ fontSize: '0.65rem', letterSpacing: '0.3em', opacity: 0.7 }}>S I G N A L   L O S T</p>
            <p style={{ fontSize: '0.5rem', letterSpacing: '0.2em', marginTop: '0.5rem', opacity: 0.5 }}>── CONNECTION UNSTABLE ──</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          onClick={toggleCyclone}
          className={`relative group px-6 py-3 rounded-full font-head font-bold uppercase tracking-widest text-[0.8rem] transition-all duration-500 overflow-hidden ${
            isCycloneActive 
              ? 'bg-[#ef233c] text-white shadow-[0_0_40px_rgba(239,35,60,0.6)] border border-[#ffb3c1]' 
              : 'bg-black/40 text-[#00d4ff] backdrop-blur-md border border-[#00d4ff]/40 hover:bg-[#00d4ff]/10 hover:border-[#00d4ff]'
          }`}
        >
          {isCycloneActive && <span className="absolute inset-0 bg-white/20 animate-pulse" />}
          <span className="relative z-10 flex items-center gap-2">
            <span className={isCycloneActive ? 'animate-spin inline-block' : ''}>🌀</span>
            {isCycloneActive ? 'STOP CYCLONE' : 'ACTIVATE CYCLONE'}
          </span>
        </button>
      </div>

      <main className={`relative z-10 perspective-1000 transition-opacity duration-1000 ${showIntro ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <SectionWrapper><HeroSection onDive={() => diveToSection('sunlight')} /></SectionWrapper>
        <SectionWrapper><SunlightZone id="sunlight" onDive={() => diveToSection('twilight')} onOpenModal={setSelectedCreature} /></SectionWrapper>
        <SectionWrapper><TwilightZone id="twilight" onDive={() => diveToSection('midnight')} onOpenModal={setSelectedCreature} /></SectionWrapper>
        <SectionWrapper><MidnightZone id="midnight" onDive={() => diveToSection('abyss')} onOpenModal={setSelectedCreature} /></SectionWrapper>
        <SectionWrapper><AbyssZone    id="abyss"    onDive={() => diveToSection('hadal')} onOpenModal={setSelectedCreature} /></SectionWrapper>
        <SectionWrapper><HadalZone    id="hadal"    onDive={() => diveToSection('hero')}   onOpenModal={setSelectedCreature} /></SectionWrapper>
      </main>

      <CreatureModal
        creature={selectedCreature}
        onClose={() => setSelectedCreature(null)}
      />
    </>
  );
}

export default App;
