import { motion } from 'framer-motion';

export default function SubmarineGlass({ isEnabled }) {
  if (!isEnabled) return null;

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none overflow-hidden">
      {/* Main Porthole Frame */}
      <div 
        className="absolute inset-0 border-[40px] md:border-[100px] border-black pointer-events-none"
        style={{
          maskImage: 'radial-gradient(circle, transparent 65%, black 75%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 65%, black 75%)',
        }}
      />

      {/* Glass Texture & Reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-white/10 opacity-40 mix-blend-screen" />
      
      {/* Scratches & HUD Distortion */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.1'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Inner Metallic Rim Shadows */}
      <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,1)] opacity-80" />
      
      {/* Edge Blur / Refraction Feel */}
      <div 
        className="absolute inset-0 backdrop-blur-[2px]"
        style={{
          maskImage: 'radial-gradient(circle, transparent 55%, black 100%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 55%, black 100%)',
        }}
      />

      {/* Decorative Rivets (Optional) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[85vw] h-[85vw] md:w-[75vh] md:h-[75vh] rounded-full border-[1.5px] border-white/10 opacity-30" />
      </div>
    </div>
  );
}
