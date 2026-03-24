import { useState, useEffect } from 'react';
import { Sun, Moon, Volume2, VolumeX, Eye, EyeOff } from 'lucide-react';

export default function Controls({ 
  isAudioEnabled, 
  onToggleAudio,
  isSubmarineMode,
  onToggleSubmarine
}) {
  const [isDayMode, setIsDayMode] = useState(false);

  useEffect(() => {
    if (isDayMode) {
      document.body.classList.add('day-mode');
    } else {
      document.body.classList.remove('day-mode');
    }
  }, [isDayMode]);

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

      {/* Submarine Mode Toggle */}
      <button 
        onClick={onToggleSubmarine}
        className={`flex items-center justify-center w-[38px] h-[38px] rounded-full transition-all shadow-lg border ${
          isSubmarineMode 
            ? 'bg-[#00d4ff] border-white text-[#00143c]' 
            : 'bg-[#00143c]/60 backdrop-blur-md border-[#00d4ff]/30 text-white hover:bg-[#00d4ff]/20'
        }`}
        aria-label="Toggle Submarine Mode"
      >
        {isSubmarineMode ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>

      <button 
        onClick={onToggleAudio}
        className="flex items-center justify-center w-[38px] h-[38px] bg-[#00143c]/60 backdrop-blur-md border border-[#00d4ff]/30 rounded-full text-white hover:bg-[#00d4ff]/20 hover:border-[#00d4ff] hover:-translate-y-0.5 transition-all shadow-lg"
        aria-label="Toggle Sound"
      >
        {isAudioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>
    </div>
  );
}
