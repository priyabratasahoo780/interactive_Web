import { motion } from 'framer-motion';
import { Anchor, Search } from 'lucide-react';

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } 
  }
};

const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export default function ShipwreckZone({ onDive, expStep }) {
  const isActive = expStep && expStep.id === 'shipwreck';

  return (
    <section 
      id="shipwreck"
      className={`relative min-h-screen flex items-center justify-center py-24 overflow-hidden bg-[#000510] ${isActive ? 'experience-highlight' : ''}`}
    >
      {/* Shipwreck Atmosphere */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-b from-[#001020] via-black to-[#000510]" />
        {/* Swirling silt particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              x: [0, 40, -40, 0],
              y: [0, -30, 30, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{ duration: 10 + Math.random() * 10, repeat: Infinity }}
            className="absolute w-1 h-1 bg-[#00d4ff]/30 rounded-full blur-[2px]"
            style={{ 
              top: Math.random() * 100 + '%', 
              left: Math.random() * 100 + '%' 
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 flex flex-col items-center">
        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-12 h-12 rounded-full bg-[#00d4ff]/10 border border-[#00d4ff]/30 flex items-center justify-center">
            <Anchor className="text-[#00d4ff]" size={24} />
          </div>
          <h2 className="font-head text-[#00d4ff] text-[1.2rem] tracking-[0.4em] uppercase">
            The Resting Giant
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            animate={floatingAnimation}
            className="relative group"
          >
            {/* Shipwreck Graphic Simulation */}
            <div className="relative h-64 md:h-96 w-full rounded-2xl border border-white/5 bg-black/60 overflow-hidden shadow-2xl">
              {/* High-quality Generated Shipwreck Render */}
              <img 
                src="/assets/shipwreck.png" 
                alt="SS Azure Shipwreck" 
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
              />
              {/* Atmospheric Overlays */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#00d5ff]/20 to-[#000510]/40 mix-blend-overlay pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,5,16,0.9)_100%)] pointer-events-none" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/80 backdrop-blur-md rounded-lg border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white/80 text-[0.8rem] font-light leading-relaxed">
                  The <span className="text-[#00d4ff] font-bold">"SS Azure"</span> — lost in the Great Storm of 1902. Now a home to coral and deep-sea eels.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-6"
          >
            <p className="text-[#00d4ff]/80 font-head text-[0.85rem] tracking-[0.2em] uppercase">
              Depth: 1,450m
            </p>
            <h3 className="text-white text-[2rem] md:text-[2.5rem] font-light tracking-tight leading-none mb-4">
              A skeletal witness to <span className="text-white font-bold italic">forgotten storms.</span>
            </h3>
            <p className="text-white/60 text-[1rem] leading-relaxed mb-8 max-w-md">
              At this depth, we encounter the wreckage of the surface world. This iron hull has been slowly reclaimed by the sea for over a century.
            </p>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0,212,255,0.2)' }}
              whileTap={{ scale: 0.95 }}
              onClick={onDive}
              className="flex items-center gap-4 self-start px-8 py-4 bg-[#00d4ff]/10 border border-[#00d4ff]/30 rounded-full text-[#00d4ff] font-head text-[0.8rem] tracking-widest uppercase hover:bg-[#00d4ff]/20 transition-all"
            >
              <span>Dive into Darkness</span>
              <div className="w-6 h-[1px] bg-[#00d4ff]/50" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
