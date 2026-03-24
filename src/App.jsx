import { useState, useEffect } from 'react';
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
import { useScrollDepth, useMouseParallax } from './hooks/useScrollDepth';
import { useAudioContext } from './hooks/useAudioContext';
import Lenis from '@studio-freight/lenis';
import { motion, useSpring, useTransform } from 'framer-motion';

function App() {
  const [selectedCreature, setSelectedCreature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCycloneActive, setIsCycloneActive] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVoid, setIsVoid] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [lightningFlash, setLightningFlash] = useState(false);
  
  const { initAudio: _initAudio, triggerCycloneAudio, stopCycloneAudio, triggerLightningSound } = useAudioContext();

  const initAudio = () => {
    _initAudio();
    setIsAudioEnabled(true);
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

    let raf;
    function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => { lenis.destroy(); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
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
      {/* Loading Screen Overlay */}
      <div
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 bg-[radial-gradient(ellipse_at_center,#023e8a_0%,#000020_100%)] transition-all duration-700 ease-in-out ${loading ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
      >
        <div className="relative w-20 h-20">
          <span className="absolute inset-0 rounded-full border-[3px] border-[#00d4ff] animate-[ripple-out_2s_cubic-bezier(0.16,1,0.3,1)_infinite]" />
          <span className="absolute inset-0 rounded-full border-[3px] border-[#00d4ff] animate-[ripple-out_2s_cubic-bezier(0.16,1,0.3,1)_infinite] opacity-70 [animation-delay:0.5s]" />
          <span className="absolute inset-0 rounded-full border-[3px] border-[#00d4ff] animate-[ripple-out_2s_cubic-bezier(0.16,1,0.3,1)_infinite] opacity-40 [animation-delay:1s]" />
        </div>
        <p className="font-head text-[1.1rem] font-light text-[#00d4ff] tracking-[0.15em]">
          Preparing your dive<span className="animate-[blink-dots_1.2s_steps(4)_infinite]">...</span>
        </p>
        <div className="w-[250px] h-[3px] bg-white/15 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#00d4ff] to-[#9b5de5] rounded-full animate-[load-fill_2.5s_cubic-bezier(0.16,1,0.3,1)_forwards]" />
        </div>
      </div>

      <style>{`
        @keyframes ripple-out {
          0% { transform: scale(0.3); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        @keyframes blink-dots {
          0%, 100% { opacity: 0; }
          33% { opacity: 1; }
        }
        @keyframes load-fill {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        @keyframes glitch-text {
          0%   { clip-path: inset(30% 0 60% 0); transform: translate(-50%,-50%) translateX(-3px); }
          20%  { clip-path: inset(80% 0 10% 0); transform: translate(-50%,-50%) translateX(3px); }
          40%  { clip-path: inset(50% 0 30% 0); transform: translate(-50%,-50%) translateX(-2px); }
          60%  { clip-path: inset(10% 0 80% 0); transform: translate(-50%,-50%) translateX(2px); }
          80%  { clip-path: inset(60% 0 20% 0); transform: translate(-50%,-50%) translateX(-1px); }
          100% { clip-path: inset(30% 0 60% 0); transform: translate(-50%,-50%) translateX(1px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Three.js WebGL Background Canvas */}
      <OceanCanvas 
        scrollRef={scrollRef} 
        mouseRef={mouseRef} 
        isCycloneActive={isCycloneActive} 
        triggerLightningSound={handleLightningStrike}
      />

      {/* Lightning HTML screen flash */}
      {lightningFlash && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 98,
          background: 'rgba(200, 240, 255, 0.18)',
          pointerEvents: 'none',
        }} />
      )}

      {/* Water Distortion Overlay */}
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

      {/* Pressure Compression Effect (screen scales slightly) */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 4,
          pointerEvents: 'none',
          boxShadow: `inset 0 0 ${40 + scrollProgress * 120}px rgba(0,0,0,${0.1 + scrollProgress * 0.6})`
        }}
      />

      {/* VOID / Signal Lost overlay at deepest depth */}
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

      {/* Cyclone Global Toggle */}
      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          onClick={toggleCyclone}
          className={`relative group px-6 py-3 rounded-full font-head font-bold uppercase tracking-widest text-[0.8rem] transition-all duration-500 overflow-hidden ${
            isCycloneActive 
              ? 'bg-[#ef233c] text-white shadow-[0_0_40px_rgba(239,35,60,0.6)] border border-[#ffb3c1]' 
              : 'bg-black/40 text-[#00d4ff] backdrop-blur-md border border-[#00d4ff]/40 hover:bg-[#00d4ff]/10 hover:border-[#00d4ff]'
          }`}
        >
          {isCycloneActive && (
            <span className="absolute inset-0 bg-white/20 animate-pulse" />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <span className={isCycloneActive ? 'animate-spin inline-block' : ''}>🌀</span>
            {isCycloneActive ? 'STOP CYCLONE' : 'ACTIVATE CYCLONE'}
          </span>
        </button>
      </div>

      <Controls />
      <DepthMeter />
      <DepthHUD scrollProgress={scrollProgress} />

      {/* Audio Enable Button — always visible on surface */}
      <button
        onClick={initAudio}
        style={{
          position: 'fixed',
          top: 14,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 200,
          background: isAudioEnabled ? 'rgba(0,180,80,0.3)' : 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${isAudioEnabled ? 'rgba(0,255,136,0.5)' : 'rgba(0,212,255,0.3)'}`,
          color: isAudioEnabled ? '#00ff88' : '#00d4ff',
          padding: '5px 16px',
          borderRadius: '999px',
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'all 0.4s',
        }}
      >
        {isAudioEnabled ? '🔊 AUDIO ON' : '🔇 ENABLE AUDIO'}
      </button>

      <main className="relative z-10 perspective-1000">
        <SectionWrapper><HeroSection /></SectionWrapper>
        <SectionWrapper><SunlightZone onOpenModal={setSelectedCreature} /></SectionWrapper>
        <SectionWrapper><TwilightZone onOpenModal={setSelectedCreature} /></SectionWrapper>
        <SectionWrapper><MidnightZone onOpenModal={setSelectedCreature} /></SectionWrapper>
        <SectionWrapper><AbyssZone onOpenModal={setSelectedCreature} /></SectionWrapper>
        <SectionWrapper><HadalZone onOpenModal={setSelectedCreature} /></SectionWrapper>
      </main>

      {/* Global Creature Modal */}
      <CreatureModal
        creature={selectedCreature}
        onClose={() => setSelectedCreature(null)}
      />
    </>
  );
}

export default App;
