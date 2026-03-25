import { motion } from 'framer-motion';
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
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } 
  }
};

const floatingAnimation = {
  y: [0, -12, 0],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export default function SunlightZone({ onOpenModal, onDive, expStep, activeElementId }) {
  const isActive = expStep && expStep.id === 'sunlight';

  return (
    <section 
      id="sunlight" 
      className={`relative min-h-screen z-[1] flex items-start px-4 md:px-6 pt-16 md:pt-32 pb-16 md:pb-32 pl-[4.5rem] md:pl-28 section-sunlight overflow-hidden bg-[linear-gradient(to_bottom,rgba(0,150,199,0.18),rgba(0,119,182,0.22),rgba(2,62,138,0.28))] ${isActive ? 'experience-highlight' : ''}`}
    >
      {/* Sun Rays */}
      <div className="absolute -top-[10%] left-0 right-0 h-[60%] pointer-events-none overflow-hidden">
        {[
          { l: '10%', rot: -15, w: 80, d: 0 },
          { l: '25%', rot: -5, w: 120, d: 1 },
          { l: '45%', rot: 5, w: 60, d: 2 },
          { l: '65%', rot: -8, w: 100, d: 0.5 },
          { l: '80%', rot: 10, w: 80, d: 1.5 }
        ].map((ray, i) => (
          <div 
            key={i}
            className="absolute top-0 h-[120%] bg-gradient-to-b from-white/15 to-transparent rounded-b-full origin-top animate-[ray-sway_8s_ease-in-out_infinite]"
            style={{ 
              left: ray.l, 
              width: ray.w, 
              transform: `rotate(${ray.rot}deg)`, 
              animationDelay: `${ray.d}s` 
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
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-[#00d4ff]/15 border border-[#00d4ff]/40 rounded-full font-head text-[0.8rem] font-semibold text-[#00d4ff] tracking-widest mb-4">
            0 – 200m
          </div>
          <h2 className="font-head text-[clamp(2.2rem,5vw,4rem)] font-[900] leading-[1.1] mb-4 tracking-[-0.02em]">
            The Sunlight Zone
          </h2>
          <p className="text-[clamp(1rem,2vw,1.15rem)] leading-relaxed text-white/75 max-w-[680px] mx-auto">
            The euphotic zone where photosynthesis is possible. Warm, vibrant, and teeming with 90%
            of all marine life — the ocean's most dazzling stage.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { icon: '🌡️', text: '20–30°C avg temperature', delay: 0 },
            { icon: '☀️', text: 'Photosynthesis zone', delay: 0.2 },
            { icon: '🌊', text: '90% of marine life', delay: 0.4 },
            { icon: '📡', text: 'Fully explored zone', delay: 0.6 }
          ].map((fact, i) => (
            <motion.div 
              key={i} 
              animate={floatingAnimation}
              transition={{ ...floatingAnimation.transition, delay: fact.delay }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-[0.85rem] text-white/85 backdrop-blur-md hover:bg-white/20 hover:-translate-y-1 hover:border-[#00d4ff]/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.2)] transition-all duration-300 cursor-default"
            >
              <span>{fact.icon}</span>
              <span>{fact.text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Swimming Fish Strip */}
        <motion.div variants={itemVariants} className="relative h-[60px] md:h-[80px] overflow-hidden my-8 rounded-xl bg-black/15 border border-white/10" aria-hidden="true">
          {[
            { e: '🐠', d: 14, del: 0, t: '30%', s: '1.8rem' },
            { e: '🐡', d: 10, del: -4, t: '65%', s: '1.3rem' },
            { e: '🐟', d: 18, del: -8, t: '45%', s: '2rem' },
            { e: '🦈', d: 22, del: -12, t: '25%', s: '2.5rem' },
            { e: '🐙', d: 12, del: -2, t: '70%', s: '1.5rem' }
          ].map((f, i) => (
            <div 
              key={i} 
              className="absolute animate-[swim-fish-anim_linear_infinite]"
              style={{ top: f.t, fontSize: f.s, animationDuration: `${f.d}s`, animationDelay: `${f.del}s` }}
            >
              {f.e}
            </div>
          ))}
        </motion.div>

        <motion.h3 variants={itemVariants} className="font-head text-[1.3rem] font-bold mt-12 mb-6 text-white/90 tracking-[-0.01em]">
          Meet the Residents
        </motion.h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {OCEAN_CREATURES.sunlight.map((creature, i) => (
            <motion.div key={creature.id} variants={itemVariants}>
              <CreatureCard 
                creature={creature} 
                onClick={onOpenModal} 
                isHighlighted={activeElementId === creature.id.toLowerCase()} 
              />
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="flex justify-center mt-12 pb-12">
          <button 
            onClick={onDive}
            className="group relative flex items-center gap-3 px-10 py-4 bg-transparent border border-[#00d4ff]/40 rounded-full text-[#00d4ff] font-head text-[1rem] font-bold tracking-widest hover:bg-[#00d4ff]/10 hover:border-[#00d4ff] hover:-translate-y-1 transition-all duration-300"
          >
            <span className="relative z-10">Dive Deeper</span>
            <span className="relative z-10 animate-bounce">↓</span>
            <div className="absolute inset-0 bg-[#00d4ff]/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes ray-sway {
          0%, 100% { opacity: 0.6; transform-origin: top center; }
          50% { opacity: 1; }
        }
        @keyframes swim-fish-anim {
          0% { left: -8%; opacity: 0; }
          5% { opacity: 1; }
          95% { opacity: 1; }
          100% { left: 108%; opacity: 0; }
        }
      `}</style>
    </section>
  );
}