import { motion, AnimatePresence } from 'framer-motion';

export default function ExperienceOverlay({ 
  status, 
  currentStep, 
  progress 
}) {
  if (status === 'idle') return null;

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-full max-w-[500px] px-6">
      <AnimatePresence mode="wait">
        {currentStep && (
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 text-center shadow-2xl"
          >
            <div className="text-[0.65rem] text-[#00d4ff] font-head font-bold uppercase tracking-[0.3em] mb-1">
              {currentStep.depth || 'Current Position'}
            </div>
            <h3 className="text-white text-[1.2rem] font-head font-black uppercase tracking-tight">
              {currentStep.title}
            </h3>
            
            <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#00d4ff] shadow-[0_0_10px_#00d4ff]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
