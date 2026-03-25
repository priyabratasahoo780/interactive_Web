import { motion, animate } from 'framer-motion';
import { useEffect, useRef } from 'react';
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
  y: [0, -8, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

function AnimatedCounter({ from, to }) {
  const nodeRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animate(from, to, {
          duration: 2,
          ease: "easeOut",
          onUpdate(val) {
            if (nodeRef.current) {
              nodeRef.current.textContent = Math.round(val).toLocaleString();
            }
          }
        });
        observer.disconnect();
      }
    });
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, [from, to]);

  return <span ref={nodeRef}>{from}</span>;
}

export default function MidnightZone({ onOpenModal, onDive, expStep, activeElementId }) {
  const isActive = expStep && expStep.id === 'midnight';

  return (
    <section 
      id="midnight" 
      className={`relative min-h-screen z-[1] flex items-start px-4 md:px-6 pt-16 md:pt-32 pb-16 md:pb-32 pl-[4.5rem] md:pl-28 overflow-hidden bg-[linear-gradient(to_bottom,rgba(3,4,94,0.15),rgba(1,0,16,0.2))] ${isActive ? 'experience-highlight' : ''}`}
    >
      <motion.div 
        className="w-full max-w-[1200px] mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-[#ef233c]/10 border border-[#ef233c]/30 rounded-full font-head text-[0.8rem] font-semibold text-[#ff6b8a] tracking-widest mb-4">
            1000 – 4000m
          </div>
          <h2 className="font-head text-[clamp(2.2rem,5vw,4rem)] font-[900] leading-[1.1] mb-4 tracking-[-0.02em] text-white animate-[pulse-title-glow_4s_ease-in-out_infinite]">
            The Midnight Zone
          </h2>
          <p className="text-[clamp(1rem,2vw,1.15rem)] leading-relaxed text-white/75 max-w-[680px] mx-auto">
            Total, absolute darkness. No photosynthesis, no sun. Only immense pressure,
            freezing cold, and creatures that defy imagination.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-10">
          {[
            { t: 400, l: 'times surface pressure', delay: 0 },
            { t: 2, l: '°C avg temperature', delay: 0.2 },
            { t: 95, l: '% unexplored', delay: 0.4 },
            { t: 8000, l: 'new species discovered yearly', delay: 0.6 }
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              animate={floatingAnimation}
              transition={{ ...floatingAnimation.transition, delay: stat.delay }}
              className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/[0.08] hover:-translate-y-1 hover:border-[#ef233c]/40 hover:shadow-[0_10px_40px_rgba(239,35,60,0.2)] transition-all duration-300 cursor-default"
            >
              <div className="font-head text-[clamp(1.8rem,4vw,3rem)] font-[900] text-[#00d4ff] tracking-[-0.04em] tabular-nums">
                <AnimatedCounter from={0} to={stat.t} />
              </div>
              <div className="text-[0.8rem] text-white/50 leading-[1.4] mt-1.5">
                {stat.l}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.h3 variants={itemVariants} className="font-head text-[1.3rem] font-bold mt-12 mb-6 text-white/90 tracking-[-0.01em]">
          Denizens of Eternal Dark
        </motion.h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {OCEAN_CREATURES.midnight.map((creature) => (
            <motion.div key={creature.id} variants={itemVariants}>
              <CreatureCard 
                creature={creature} 
                onClick={onOpenModal} 
                isHighlighted={activeElementId === creature.id.toLowerCase()} 
              />
            </motion.div>
          ))}
        </div>

        {/* Pressure Visualization */}
        <motion.div variants={itemVariants} className="my-12 mx-auto max-w-[480px] text-center">
          <div className="flex flex-col items-stretch gap-2 mb-4">
            <div className="font-head text-[0.8rem] text-white/50 text-left">Surface: 1 ATM</div>
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                viewport={{ once: true }}
                className="h-full bg-gradient-to-r from-[#00d4ff] via-[#9b5de5] to-[#ef233c] rounded-full"
              />
            </div>
            <div className="font-head text-[0.8rem] text-white/50 text-right">Here: ~400 ATM</div>
          </div>
          <p className="text-[0.9rem] text-white/60 leading-[1.6] italic">
            At 4,000m, the pressure is equivalent to 35 adult elephants standing on your shoulders.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center mt-12 pb-12">
          <button 
            onClick={onDive}
            className="group relative flex items-center gap-3 px-10 py-4 bg-transparent border border-[#ef233c]/40 rounded-full text-[#ff6b8a] font-head text-[1rem] font-bold tracking-widest hover:bg-[#ef233c]/10 hover:border-[#ef233c] hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(239,35,60,0.1)]"
          >
            <span className="relative z-10">Dive into the Abyss</span>
            <span className="relative z-10 animate-bounce">↓</span>
            <div className="absolute inset-0 bg-[#ef233c]/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes pulse-title-glow {
          0%, 100% { text-shadow: 0 0 30px rgba(239,35,60,0.4); }
          50% { text-shadow: 0 0 60px rgba(239,35,60,0.8), 0 0 100px rgba(239,35,60,0.4); }
        }
      `}</style>
    </section>
  );
}