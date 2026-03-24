import { useEffect, useRef, useState } from 'react';

const ZONES = [
  { depth: 0,    name: 'Surface',       temp: 25,  pressure: 1 },
  { depth: 200,  name: 'Sunlight Zone', temp: 18,  pressure: 20 },
  { depth: 1000, name: 'Twilight Zone', temp: 10,  pressure: 100 },
  { depth: 4000, name: 'Midnight Zone', temp: 2,   pressure: 400 },
  { depth: 6000, name: 'Abyss Zone',    temp: -1,  pressure: 600 },
  { depth: 11000, name: 'Hadal Trench', temp: -2,  pressure: 1100 },
];

export default function DepthHUD({ scrollProgress, scannedCount = 0 }) {
  const [glitch, setGlitch] = useState(false);
  const totalSpecies = 15;

  // Interpolate actual meter depth from scroll progress 0→1 mapped to 0→11000m
  const depthM = Math.round(scrollProgress * 11000);
  
  // Find current zone
  const zone = (() => {
    for (let i = ZONES.length - 1; i >= 0; i--) {
      if (depthM >= ZONES[i].depth) return ZONES[i];
    }
    return ZONES[0];
  })();

  // Interpolated values
  const progress = Math.min(depthM / 11000, 1);
  const temp = parseFloat((ZONES[0].temp + (ZONES[5].temp - ZONES[0].temp) * progress).toFixed(1));
  const pressure = Math.round(ZONES[0].pressure + (ZONES[5].pressure - ZONES[0].pressure) * progress);

  // Glitch effect when going very deep
  useEffect(() => {
    if (scrollProgress > 0.82) {
      const interval = setInterval(() => {
        setGlitch(g => !g);
      }, 300 + Math.random() * 400);
      return () => clearInterval(interval);
    } else {
      setGlitch(false);
    }
  }, [scrollProgress]);

  // Signal strength 0→100% (inverted by depth)
  const signal = Math.max(0, Math.round((1 - scrollProgress * 1.1) * 100));

  return (
    <div
      className="fixed left-4 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '0.7rem',
        color: scrollProgress > 0.8 ? '#ff4040' : '#00ff88',
        textShadow: scrollProgress > 0.8 ? '0 0 8px #ff4040' : '0 0 8px #00ff88',
        opacity: 0.85,
        filter: glitch ? 'blur(1px) brightness(2)' : 'none',
        transition: 'filter 0.05s',
      }}
    >
      <div style={{
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(8px)',
        border: `1px solid ${scrollProgress > 0.8 ? 'rgba(255,64,64,0.4)' : 'rgba(0,255,136,0.25)'}`,
        borderRadius: '6px',
        padding: '10px 14px',
        minWidth: '150px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
      }}>
        {/* Title */}
        <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', opacity: 0.6, borderBottom: '1px solid #333', paddingBottom: '4px', marginBottom: '2px' }}>
          ◈ SUB-NAUTICAL HUD
        </div>

        {/* Discovery Counter */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[0.6rem] opacity-60 uppercase">Discovery Log:</span>
          <span className="font-bold">{scannedCount}/{totalSpecies}</span>
        </div>

        {/* Zone */}
        <div style={{ letterSpacing: '0.08em' }}>{glitch ? '████ ZONE' : `◑ ${zone.name}`}</div>

        {/* Depth */}
        <div>
          ↓ <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>
            {glitch ? '?????' : `${depthM.toLocaleString()}m`}
          </span>
        </div>

        {/* Temp */}
        <div>⊕ Temp: {temp}°C</div>

        {/* Pressure */}
        <div>⊗ ATM: {pressure}x</div>

        {/* Signal bar */}
        <div style={{ marginTop: '4px' }}>
          <div style={{ fontSize: '0.55rem', opacity: 0.6 }}>SIGNAL: {glitch ? 'LOST' : `${signal}%`}</div>
          <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginTop: '2px' }}>
            <div style={{
              height: '100%',
              width: `${signal}%`,
              background: signal > 50 ? '#00ff88' : signal > 20 ? '#ffcc00' : '#ff4040',
              borderRadius: '2px',
              transition: 'width 0.3s, background 0.5s',
            }} />
          </div>
        </div>

        {/* Void warning */}
        {scrollProgress > 0.85 && (
          <div style={{
            marginTop: '4px',
            color: '#ff4040',
            animation: 'pulse 0.8s ease-in-out infinite',
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
          }}>
            ⚠ VOID ZONE DETECTED
          </div>
        )}
      </div>
    </div>
  );
}
