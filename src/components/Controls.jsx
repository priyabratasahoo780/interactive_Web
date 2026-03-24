import { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react';

export default function Controls() {
  const [isDayMode, setIsDayMode] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(false);
  
  // Audio context ref
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    // Toggle body class for day mode
    if (isDayMode) {
      document.body.classList.add('day-mode');
    } else {
      document.body.classList.remove('day-mode');
    }
  }, [isDayMode]);

  const toggleSound = () => {
    const newState = !isSoundOn;
    setIsSoundOn(newState);

    if (newState) {
      if (!audioCtxRef.current) {
        try {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          const ctx = new AudioContext();
          audioCtxRef.current = ctx;

          // Create pink noise buffer
          const bufferSize = ctx.sampleRate * 3;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.03;
          }

          const source = ctx.createBufferSource();
          source.buffer = buffer;
          source.loop = true;

          const filter = ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.value = 400;
          filter.Q.value = 0.5;

          const gain = ctx.createGain();
          gain.gain.value = 0.4;
          gainNodeRef.current = gain;

          source.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          source.start();
        } catch (e) {
          console.warn("Web Audio API not supported", e);
        }
      } else if (gainNodeRef.current) {
        // Resume
        gainNodeRef.current.gain.setTargetAtTime(0.4, audioCtxRef.current.currentTime, 0.5);
      }
    } else {
      // Mute
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setTargetAtTime(0, audioCtxRef.current.currentTime, 0.5);
      }
    }
  };

  return (
    <div className="fixed top-5 right-5 z-[800] flex gap-2.5 items-center max-md:top-auto max-md:bottom-5 max-md:flex-col-reverse">
      <button 
        onClick={() => setIsDayMode(!isDayMode)}
        className="flex items-center gap-2 px-4 py-2 bg-[#00143c]/60 backdrop-blur-md border border-[#00d4ff]/30 rounded-full text-white font-head text-[13px] font-semibold tracking-wide hover:bg-[#00d4ff]/20 hover:border-[#00d4ff] hover:-translate-y-0.5 transition-all shadow-lg"
        aria-label="Toggle Day Mode"
      >
        {isDayMode ? <Moon size={16} /> : <Sun size={16} />}
        <span className="max-md:hidden">{isDayMode ? 'Deep Mode' : 'Day Mode'}</span>
      </button>

      <button 
        onClick={toggleSound}
        className="flex items-center justify-center w-[38px] h-[38px] bg-[#00143c]/60 backdrop-blur-md border border-[#00d4ff]/30 rounded-full text-white hover:bg-[#00d4ff]/20 hover:border-[#00d4ff] hover:-translate-y-0.5 transition-all shadow-lg"
        aria-label="Toggle Sound"
      >
        {isSoundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>
    </div>
  );
}
