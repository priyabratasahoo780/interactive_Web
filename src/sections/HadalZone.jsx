import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { CreatureCard } from '../components/CreatureCard';
import { OCEAN_CREATURES } from '../data/creatures';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
  }
};

const floatingAnimation = {
  y: [0, -5, 0],
  transition: {
    duration: 8,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

const FINAL_TEXT = "The ocean covers 71% of our planet, yet more than 80% of it remains unexplored and unseen by human eyes. Below us lies a universe of mystery — waiting, breathing, alive in ways we've yet to imagine.";

function TypewriterQuote() {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isTyping && displayedText.length === 0) {
        setIsTyping(true);
        let i = 0;
        const interval = setInterval(() => {
          setDisplayedText(FINAL_TEXT.slice(0, i + 1));
          i++;
          if (i >= FINAL_TEXT.length) {
            clearInterval(interval);
            setIsTyping(false);
          }
        }, 38);
        observer.disconnect();
      }
    });

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [displayedText, isTyping]);

  return (
    <div ref={containerRef} className="text-center my-12 mx-auto max-w-[700px]">
      <blockquote 
        className={`font-head text-[clamp(1.2rem,3vw,1.8rem)] font-light italic leading-[1.6] text-white/70 min-h-[5em] ${isTyping ? 'typewriter-cursor' : ''}`}
      >
        {displayedText}
      </blockquote>
      <div className="mt-4 text-[0.85rem] text-white/30 tracking-[0.1em] uppercase">
        — The Ocean, Still Waiting
      </div>
    </div>
  );
}

export default function HadalZone({ onOpenModal, onDive, expStep, activeElementId }) {
  const isActive = expStep && expStep.id === 'hadal';
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section 
      id="hadal" 
      className={`relative min-h-screen z-[1] flex items-start px-4 md:px-6 pt-16 md:pt-32 pb-40 pl-[4.5rem] md:pl-28 overflow-hidden bg-[linear-gradient(to_bottom,rgba(0,0,5,0.1),rgba(0,0,0,0.2))] ${isActive ? 'experience-highlight' : ''}`}
    >
      {/* Hadal Depth Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1a1a2e_0%,transparent_100%)] opacity-20" />
        {[
          { w: 500, c: 'rgba(100,100,255,0.03)', t: '20%', l: '10%', d: 20 },
          { w: 400, c: 'rgba(255,255,255,0.02)', b: '10%', r: '15%', d: 25 }
        ].map((orb, i) => (
          <div 
            key={i}
            className="absolute rounded-full blur-[100px] animate-[hadal-drift_20s_ease-in-out_infinite_alternate]"
            style={{
              width: orb.w, height: orb.w,
              background: `radial-gradient(circle, ${orb.c} 0%, transparent 70%)`,
              top: orb.t, left: orb.l, bottom: orb.b, right: orb.r,
              animationDuration: `${orb.d}s`
            }}
          />
        ))}
      </div>

      <motion.div 
        className="w-full max-w-[1200px] mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full font-head text-[0.8rem] font-semibold text-white/40 tracking-widest mb-4">
            6000 – 11,000m
          </div>
          <h2 className="font-head text-[clamp(2.5rem,6vw,5rem)] font-[900] leading-[1.1] mb-6 tracking-[-0.03em] clip-text-gradient bg-gradient-to-br from-[#ffffff] via-[#666666] to-[#333333]">
            The Hadal Zone
          </h2>
          <p className="text-[clamp(1.1rem,2.2vw,1.3rem)] leading-relaxed text-white/40 max-w-[750px] mx-auto">
            Named after Hades, god of the underworld. These are the deepest trenches of our planet.
            Pressure here exceeds 1,100 times that of the surface — yet, against all odds, life endures.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {OCEAN_CREATURES.hadal.map((creature) => (
            <motion.div key={creature.id} variants={itemVariants}>
              <CreatureCard 
                creature={creature} 
                onClick={onOpenModal} 
                isHighlighted={activeElementId === creature.id.toLowerCase()} 
              />
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants}>
          <TypewriterQuote />
        </motion.div>

        <motion.div variants={itemVariants} className="text-center mt-20 mb-12">
          <button 
            onClick={onDive}
            className="group inline-flex items-center gap-4 px-12 py-5 bg-white/5 border-2 border-white/20 hover:border-white/60 hover:bg-white/10 rounded-full text-white/60 hover:text-white font-head text-[1.1rem] font-bold tracking-widest transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(255,255,255,0.1)]"
          >
            <span className="text-[1.5rem] transition-transform duration-500 group-hover:-translate-y-2">↑</span>
            <span>ASCEND TO SURFACE</span>
          </button>
          <p className="mt-6 text-[0.9rem] text-white/20 italic tracking-wider">
            You have reached the bottom. The journey back is just as long.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-24 pt-12 border-t border-white/5">
          <motion.div 
            animate={floatingAnimation}
            className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 cursor-default"
          >
            <h4 className="font-head text-white/60 font-bold mb-3 uppercase tracking-widest text-sm">Pressure Extremes</h4>
            <p className="text-white/30 text-sm leading-relaxed">
              At 11,000 meters, the water pressure is over 15,000 psi. This is equivalent to an elephant standing on your thumb.
            </p>
          </motion.div>
          <motion.div 
            animate={floatingAnimation}
            transition={{ ...floatingAnimation.transition, delay: 0.5 }}
            className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] hover:border-white/20 transition-all duration-500 cursor-default"
          >
            <h4 className="font-head text-white/60 font-bold mb-3 uppercase tracking-widest text-sm">Biological Resilience</h4>
            <p className="text-white/30 text-sm leading-relaxed">
              Creatures here have evolved transparent bodies, flexible bones, and specialized proteins to prevent their cells from being crushed.
            </p>
          </motion.div>
        </motion.div>

      </motion.div>

      <style>{`
        @keyframes hadal-drift {
          0% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          100% { transform: translate(-40px, 30px) scale(1.2); opacity: 0.6; }
        }
        .typewriter-cursor::after {
          content: '|';
          animation: blink 1s step-end infinite;
          margin-left: 2px;
          color: #fff;
        }
        @keyframes blink {
          from, to { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </section>
  );
}