import { motion } from 'framer-motion';

export default function PressureDistortion({ depth }) {
  // Only trigger at high pressure (Abyss/Hadal)
  const intensity = Math.max(0, (depth - 4000) / 7000);
  if (intensity <= 0) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Chromatic Aberration Simulation */}
      <div 
        className="absolute inset-0 transition-all duration-300"
        style={{
          boxShadow: `inset 0 0 ${100 + intensity * 200}px rgba(255, 0, 0, ${intensity * 0.2})`,
        }}
      />
      
      {/* High Pressure Flicker Overlay */}
      <motion.div
        animate={{
          opacity: [0, intensity * 0.1, 0, intensity * 0.15, 0],
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatDelay: Math.random() * 5 + 2,
        }}
        className="absolute inset-0 bg-white"
      />

      {/* Static / Interference */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
          transform: `scale(${1 + intensity * 0.1})`,
        }}
      />
    </div>
  );
}
