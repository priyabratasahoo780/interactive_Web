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
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

export default function TwilightZone({ onOpenModal, onDive }) {
  return (
    <section 
      id="twilight" 
      className="relative min-h-screen z-[1] flex items-start px-4 md:px-6 pt-16 md:pt-32 pb-16 md:pb-32 pl-[4.5rem] md:pl-28 overflow-hidden bg-[linear-gradient(to_bottom,rgba(2,62,138,0.2),rgba(3,4,94,0.25))]"
    >
      {/* Fading light overlay */}
      <div className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-[#023e8a]/80 to-transparent pointer-events-none" />

      <motion.div 
        className="w-full max-w-[1200px] mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-[#9b5de5]/15 border border-[#9b5de5]/40 rounded-full font-head text-[0.8rem] font-semibold text-[#9b5de5] tracking-widest mb-4">
            200 – 1000m
          </div>
          <h2 className="font-head text-[clamp(2.2rem,5vw,4rem)] font-[900] leading-[1.1] mb-4 tracking-[-0.02em] text-white drop-shadow-[0_0_40px_rgba(155,93,229,0.6)]">
            The Twilight Zone
          </h2>
          <p className="text-[clamp(1rem,2vw,1.15rem)] leading-relaxed text-white/75 max-w-[680px] mx-auto">
            Light fades to a dim blue twilight. The crushing pressure begins. Life here has
            evolved extraordinary adaptations — including the ability to generate their own light.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { icon: '🌡️', text: '5–10°C' },
            { icon: '💡', text: 'Bioluminescence begins' },
            { icon: '⚡', text: '50x surface pressure' },
            { icon: '👁️', text: 'Large eyes evolved' }
          ].map((fact, i) => (
            <div key={i} className="flex items-center gap-2 px-4 py-2 bg-[#9b5de5]/10 border border-[#9b5de5]/40 rounded-full text-[0.85rem] text-white/85 backdrop-blur-md transition-all">
              <span>{fact.icon}</span>
              <span>{fact.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Bioluminescence visual */}
        <motion.div variants={itemVariants} className="relative h-[120px] my-12 mx-auto max-w-[600px] flex items-center justify-center flex-wrap gap-4" aria-hidden="true">
          {[
            { c: '#39ff14', s: 14, d: 0 },
            { c: '#00ffcc', s: 8, d: 0.4 },
            { c: '#9b5de5', s: 20, d: 0.8 },
            { c: '#00d4ff', s: 10, d: 1.2 },
            { c: '#ff0055', s: 16, d: 0.2 },
            { c: '#ffd166', s: 12, d: 0.6 },
            { c: '#48cae4', s: 7, d: 1 },
            { c: '#7b2fff', s: 18, d: 0.3 }
          ].map((orb, i) => (
            <div 
              key={i}
              className="rounded-full animate-[bio-pulse-orb_3s_ease-in-out_infinite]"
              style={{
                width: orb.s, height: orb.s, backgroundColor: orb.c,
                boxShadow: `0 0 ${orb.s}px ${orb.c}, 0 0 ${orb.s*2}px ${orb.c}88`,
                animationDelay: `${orb.d}s`
              }}
            />
          ))}
        </motion.div>
        
        <motion.p variants={itemVariants} className="text-center text-[0.85rem] text-white/45 italic -mt-6 mb-12">
          ↑ Bioluminescent organisms emit light in the darkness
        </motion.p>

        <motion.h3 variants={itemVariants} className="font-head text-[1.3rem] font-bold mt-12 mb-6 text-white/90 tracking-[-0.01em]">
          Creatures of the Twilight
        </motion.h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {OCEAN_CREATURES.twilight.map((creature) => (
            <motion.div key={creature.id} variants={itemVariants}>
              <CreatureCard creature={creature} onClick={onOpenModal} />
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="flex justify-center mt-12 pb-12">
          <button 
            onClick={onDive}
            className="group relative flex items-center gap-3 px-10 py-4 bg-transparent border border-[#9b5de5]/40 rounded-full text-[#9b5de5] font-head text-[1rem] font-bold tracking-widest hover:bg-[#9b5de5]/10 hover:border-[#9b5de5] hover:-translate-y-1 transition-all duration-300 shadow-[0_0_20px_rgba(155,93,229,0.1)]"
          >
            <span className="relative z-10">Dive into Darkness</span>
            <span className="relative z-10 animate-bounce">↓</span>
            <div className="absolute inset-0 bg-[#9b5de5]/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </motion.div>
      </motion.div>

      <style>{`
        @keyframes bio-pulse-orb {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.5); opacity: 1; }
        }
      `}</style>
    </section>
  );
}
