import { useState, useEffect, useRef, useCallback } from 'react';
import { NARRATION_DATA } from '../data/narration';

export function useExperienceMode(lenis) {
  const [status, setStatus] = useState('idle'); // 'idle', 'playing', 'paused'
  const [currentStep, setCurrentStep] = useState(null);
  const [activeElementId, setActiveElementId] = useState(null);
  const [progress, setProgress] = useState(0);
  
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const stepIndexRef = useRef(-1);

  const stop = useCallback(() => {
    if (synthRef.current) synthRef.current.cancel();
    setStatus('idle');
    setCurrentStep(null);
    setActiveElementId(null);
    stepIndexRef.current = -1;
    setProgress(0);
  }, []);

  const speak = useCallback((text, onEnd) => {
    if (synthRef.current) synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google US English') || v.name.includes('Samantha')) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    
    utteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  }, []);

  const nextStep = useCallback(async () => {
    stepIndexRef.current += 1;
    const allSteps = NARRATION_DATA.sections;
    
    if (stepIndexRef.current >= allSteps.length) {
      speak(NARRATION_DATA.outro.script, () => {
        stop();
      });
      return;
    }

    const step = allSteps[stepIndexRef.current];
    setCurrentStep(step);
    setActiveElementId(null);
    setProgress(((stepIndexRef.current + 1) / allSteps.length) * 100);

    if (lenis) {
      lenis.scrollTo(`#${step.id}`, { duration: 2.5 });
    }

    // 1. Narrate Section
    setTimeout(() => {
      speak(step.script, async () => {
        // 2. Narrate specific elements if any
        if (step.elements && step.elements.length > 0) {
          for (const el of step.elements) {
            await new Promise(resolve => {
              setActiveElementId(el.id);
              // Scroll element into view if needed? 
              // For now just highlight
              speak(el.script, () => {
                setTimeout(resolve, 1000);
              });
            });
          }
        }
        
        setActiveElementId(null);
        // 3. Move to next section
        setTimeout(() => {
          if (stepIndexRef.current !== -1) nextStep();
        }, 2000);
      });
    }, 1500);
  }, [lenis, speak, stop]);

  const start = useCallback(() => {
    setStatus('playing');
    stepIndexRef.current = -1;
    
    // Start with Intro
    speak(NARRATION_DATA.intro.script, () => {
      nextStep();
    });
  }, [speak, nextStep]);

  const pause = useCallback(() => {
    if (synthRef.current) synthRef.current.pause();
    setStatus('paused');
  }, []);

  const resume = useCallback(() => {
    if (synthRef.current) synthRef.current.resume();
    setStatus('playing');
  }, []);

  return {
    status,
    currentStep,
    progress,
    start,
    pause,
    resume,
    stop,
    speakManual: speak // For interactive cards
  };
}
