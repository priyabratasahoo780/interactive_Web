import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ZONE_THRESHOLDS = [
  { name: "Surface",  threshold: 0 },
  { name: "Sunlight", threshold: 0.12 },
  { name: "Twilight", threshold: 0.35 },
  { name: "Midnight", threshold: 0.60 },
  { name: "Abyss",   threshold: 0.82 },
  { name: "Hadal",   threshold: 0.88 },
];

export default function DepthMeter() {
  const { scrollYProgress } = useScroll();
  const [depth, setDepth] = useState(0);
  const [zone, setZone] = useState('Surface');

  // Height of the fill inside the meter
  const meterHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useEffect(() => {
    return scrollYProgress.on('change', (latest) => {
      // Non-linear depth calculation to make abyss feel deeper
      const calculatedDepth = Math.round(Math.pow(latest, 1.4) * 11000);
      setDepth(calculatedDepth);

      let currentZone = ZONE_THRESHOLDS[0].name;
      for (const z of ZONE_THRESHOLDS) {
        if (latest >= z.threshold) currentZone = z.name;
      }
      setZone(currentZone);
    });
  }, [scrollYProgress]);

  return (
    <aside className="fixed left-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2 w-14">
      {/* Track */}
      <div className="relative w-1.5 h-[220px] bg-white/10 rounded-full">
        {/* Fill */}
        <motion.div 
          className="absolute top-0 left-0 right-0 rounded-full bg-gradient-to-b from-[#00d4ff] via-[#9b5de5] to-[#000050]"
          style={{ height: meterHeight }}
        />
        
        {/* Thumb */}
        <motion.div 
          className="absolute left-1/2 -translate-x-1/2 w-4 h-4"
          style={{ top: meterHeight, y: '-50%' }}
        >
          <div className="w-full h-full rounded-full border-2 border-white/60 bg-[radial-gradient(circle_at_30%_30%,#fff,#00d4ff)] shadow-[0_0_10px_#00d4ff] animate-pulse" />
        </motion.div>
      </div>

      {/* Depth Labels (visual only) */}
      <div className="absolute top-[16px] bottom-[16px] left-[20px] pointer-events-none flex flex-col justify-between text-[10px] text-white/30 font-head leading-none h-[220px]">
        <span>0m</span>
        <span>2750m</span>
        <span>5500m</span>
        <span>8250m</span>
        <span>11km</span>
      </div>

      {/* Readout */}
      <div className="mt-2 flex items-baseline gap-0.5 bg-[#00143c]/70 border border-[#00d4ff]/30 rounded-lg px-1.5 py-1 backdrop-blur-sm">
        <span className="font-head text-[15px] font-bold text-[#00d4ff] min-w-[3ch] text-right tabular-nums tracking-tighter">
          {depth.toLocaleString()}
        </span>
        <span className="text-[10px] text-white/50">m</span>
      </div>

      {/* Zone Label */}
      <div className="font-head text-[9px] font-semibold text-white/50 text-center tracking-widest uppercase break-words leading-tight max-w-full">
        {zone}
      </div>
    </aside>
  );
}
