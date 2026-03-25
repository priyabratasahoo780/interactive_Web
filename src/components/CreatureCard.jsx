import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export const CreatureCard = React.memo(({ creature, onClick, isHighlighted }) => {
  return (
    <motion.article
      layoutId={`card-${creature.id}`}
      onClick={() => onClick(creature)}
      className={`relative bg-white/5 border border-white/10 rounded-[20px] p-6 cursor-pointer overflow-hidden backdrop-blur-md group ${isHighlighted ? 'experience-highlight' : ''}`}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Hover glow effect */}
      <div 
        className="absolute -inset-px rounded-[21px] opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${creature.glowColor}, transparent 60%)` }}
      />
      
      <motion.span 
        layoutId={`emoji-${creature.id}`}
        className="text-[3rem] block mb-3 drop-shadow-[0_0_12px_rgba(0,212,255,0.6)] group-hover:drop-shadow-[0_0_20px_rgba(0,212,255,0.9)] transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 origin-bottom"
        style={{ filter: `drop-shadow(0 0 12px ${creature.glowColor})` }}
      >
        {creature.emoji}
      </motion.span>
      
      <motion.div layoutId={`name-${creature.id}`} className="font-head text-[1.1rem] font-bold mb-1 text-white">
        {creature.name}
      </motion.div>
      <div className="text-[0.8rem] text-white/50 mb-3 tracking-wide">
        📍 {creature.depth}
      </div>
      <p className="text-[0.88rem] text-white/70 leading-relaxed line-clamp-2">
        {creature.description}
      </p>
      
      <div 
        className="mt-4 font-head text-[0.75rem] font-semibold tracking-widest uppercase flex items-center gap-1 group-hover:gap-2 transition-all"
        style={{ color: creature.glowColor }}
      >
        Explore <span aria-hidden="true">→</span>
      </div>
    </motion.article>
  );
});

export function CreatureModal({ creature, onClose }) {
  if (!creature) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#000514]/85 backdrop-blur-sm cursor-pointer"
        />
        
        <motion.div 
          layoutId={`card-${creature.id}`}
          className="relative z-10 w-full max-w-[520px] max-h-[85vh] overflow-y-auto bg-gradient-to-br from-[#02143c]/95 to-[#010519]/98 border rounded-[24px] p-8 md:p-10 shadow-[0_30px_100px_rgba(0,0,0,0.7),0_0_60px_rgba(0,212,255,0.1)]"
          style={{ borderColor: `${creature.glowColor}55` }}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-[#ef233c]/20 border border-white/15 hover:border-[#ef233c]/50 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-all hover:scale-110"
          >
            <X size={18} />
          </button>

          <motion.span layoutId={`emoji-${creature.id}`} className="text-[4rem] block mb-4" style={{ filter: `drop-shadow(0 0 20px ${creature.glowColor})` }}>
            {creature.emoji}
          </motion.span>
          
          <motion.h2 layoutId={`name-${creature.id}`} className="font-head text-2xl md:text-3xl font-extrabold text-white mb-2">
            {creature.name}
          </motion.h2>

          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-[#00d4ff]/15 border border-[#00d4ff]/30 text-[#00d4ff] font-head text-[12px] font-semibold tracking-wide">
              📍 {creature.depth}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#9b5de5]/15 border border-[#9b5de5]/30 text-[#9b5de5] font-head text-[12px] font-semibold tracking-wide">
              {creature.zone}
            </span>
          </div>

          <p className="text-[15px] text-white/75 leading-relaxed mb-8">
            {creature.description}
          </p>

          <div className="flex flex-col gap-2.5">
            {creature.facts.map((fact, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/10 text-[14px] text-white/70 leading-snug"
              >
                <div className="text-[#00d4ff] mt-1 shrink-0 text-[10px]">◆</div>
                <div>{fact}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
