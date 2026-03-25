import { Play, Pause, X, FastForward } from 'lucide-react';

export default function ExperienceControls({ 
  status, 
  onStart, 
  onPause, 
  onResume, 
  onStop 
}) {
  if (status === 'idle') {
    return (
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[50]">
        <button
          onClick={onStart}
          className="group relative px-8 py-4 bg-[#00d4ff] text-[#00143c] rounded-full font-head font-bold uppercase tracking-widest text-[1rem] transition-all duration-500 hover:scale-110 hover:shadow-[0_0_40px_rgba(0,212,255,0.6)]"
        >
          <span className="relative z-10 flex items-center gap-3">
            <Play size={20} fill="currentColor" />
            Start Experience
          </span>
          <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-0 group-hover:opacity-40" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[50] flex items-center gap-4 px-6 py-3 bg-black/60 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-center gap-2 mr-4 pr-4 border-r border-white/10">
        <div className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
        <span className="text-white/60 font-head text-[0.7rem] uppercase tracking-widest">Guided Tour</span>
      </div>

      <button
        onClick={status === 'playing' ? onPause : onResume}
        className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110"
        title={status === 'playing' ? 'Pause' : 'Resume'}
      >
        {status === 'playing' ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
      </button>

      <button
        onClick={onStop}
        className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-500 transition-all hover:scale-110"
        title="Stop"
      >
        <X size={20} strokeWidth={3} />
      </button>
    </div>
  );
}
