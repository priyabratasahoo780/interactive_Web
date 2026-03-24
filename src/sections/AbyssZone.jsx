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


export default function AbyssZone({ onOpenModal }) {
  return (
    <section 
      id="abyss" 
      className="relative min-h-screen z-[1] flex items-start px-4 md:px-6 pt-16 md:pt-32 pb-40 pl-[4.5rem] md:pl-28 overflow-hidden bg-[linear-gradient(to_bottom,rgba(3,4,94,0.15),rgba(0,0,5,0.2))]"
    >
      {/* Abyss Glow Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {[
          { w: 400, c: 'rgba(0,212,255,0.08)', t: '10%', l: '-10%', d: 14, del: 0 },
          { w: 300, c: 'rgba(155,93,229,0.1)', b: '20%', r: '-5%', d: 10, del: -4 },
          { w: 500, c: 'rgba(0,0,50,0.5)', t: '50%', l: '30%', d: 16, del: -2 }
        ].map((orb, i) => (
          <div 
            key={i}
            className="absolute rounded-full blur-[60px] animate-[abyss-orb-drift_12s_ease-in-out_infinite_alternate]"
            style={{
              width: orb.w, height: orb.w,
              background: `radial-gradient(circle, ${orb.c} 0%, transparent 70%)`,
              top: orb.t, left: orb.l, bottom: orb.b, right: orb.r,
              animationDuration: `${orb.d}s`, animationDelay: `${orb.del}s`
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
          <div className="inline-block px-4 py-1.5 bg-[#00d4ff]/5 border border-[#00d4ff]/20 rounded-full font-head text-[0.8rem] font-semibold text-[#00d4ff]/70 tracking-widest mb-4">
            4000 – 6000m
          </div>
          <h2 className="font-head text-[clamp(2.2rem,5vw,4rem)] font-[900] leading-[1.1] mb-4 tracking-[-0.02em] clip-text-gradient bg-gradient-to-br from-[#ffffff] via-[#90e0ef] to-[#00d4ff]">
            The Abyss
          </h2>
          <p className="text-[clamp(1rem,2vw,1.15rem)] leading-relaxed text-white/55 max-w-[680px] mx-auto">
            The Abyssal Zone remains in perpetual darkness. Cold, still, and immense, it is the vastest ecosystem on Earth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {OCEAN_CREATURES.abyss.map((creature) => (
            <motion.div key={creature.id} variants={itemVariants}>
              <CreatureCard creature={creature} onClick={onOpenModal} />
            </motion.div>
          ))}
        </div>

        {/* Facts */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {[
            { icon: '🌍', text: "We've mapped more of Mars than the ocean floor" },
            { icon: '🔬', text: 'New species are discovered in the deep sea every year' },
            { icon: '🦑', text: 'Gigantism is common: creatures grow larger to survive the cold' }
          ].map((fact, i) => (
            <div key={i} className="flex items-start gap-3 p-5 bg-white/5 border border-[#00d4ff]/10 rounded-[14px] hover:border-[#00d4ff]/30 hover:bg-[#00d4ff]/5 hover:-translate-y-1 transition-all">
              <span className="text-[1.5rem] shrink-0">{fact.icon}</span>
              <span className="text-[0.9rem] text-white/60 leading-[1.5]">{fact.text}</span>
            </div>
          ))}
        </motion.div>


      </motion.div>

      <style>{`
        @keyframes abyss-orb-drift {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, -20px) scale(1.1); }
        }
        @keyframes rise-bubble {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-300px) translateX(20px); opacity: 0; }
        }
        @keyframes bob-up {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </section>
  );
}