import { useRef, useCallback } from 'react';

export function useAudioContext() {
  const audioCtxRef = useRef(null);
  const droneGainRef = useRef(null);
  const cycloneNodeRef = useRef(null);
  const lightningNodeRef = useRef(null);
  const masterGainRef = useRef(null);

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) {
      // Resume if it was suspended
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    // ── MASTER VOLUME ──────────────────────────────────────────────
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.6;
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    // ── AMBIENT UNDERWATER DRONE (Layered oscillators) ─────────────
    // Layer 1: Sub bass with harmonics — audible on ALL speakers
    const createOscLayer = (freq, type, gainVal) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      osc.frequency.value = freq;

      const gain = ctx.createGain();
      gain.gain.value = gainVal;

      const lpf = ctx.createBiquadFilter();
      lpf.type = 'lowpass';
      lpf.frequency.value = 500;

      osc.connect(gain);
      gain.connect(lpf);
      lpf.connect(masterGain);
      osc.start();
      return { osc, gain };
    };

    const droneGroup = {
      layers: [
        createOscLayer(80,  'sine',     0.5), // Root bass — audible on speakers
        createOscLayer(120, 'sine',     0.3), // 3rd harmonic
        createOscLayer(160, 'triangle', 0.2), // 5th harmonic — adds warmth
        createOscLayer(240, 'sine',     0.1), // High harmonic — presence
      ],
    };

    // Add slow LFO wobble to main drone for "breathing" effect
    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.12; // Very slow wobble
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.15;
    lfo.connect(lfoGain);
    lfoGain.connect(droneGroup.layers[0].gain.gain);
    lfo.start();

    droneGainRef.current = droneGroup;

    // ── AMBIENT BUBBLE SOUNDS (Random plucks) ──────────────────────
    const triggerBubble = () => {
      if (!ctx || ctx.state !== 'running') return;
      
      // Random bubble pop: short sine burst
      const bubOsc = ctx.createOscillator();
      bubOsc.type = 'sine';
      const pitch = 200 + Math.random() * 600;
      bubOsc.frequency.setValueAtTime(pitch, ctx.currentTime);
      bubOsc.frequency.exponentialRampToValueAtTime(pitch * 0.3, ctx.currentTime + 0.08);

      const bubGain = ctx.createGain();
      bubGain.gain.setValueAtTime(0.05 + Math.random() * 0.05, ctx.currentTime);
      bubGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

      bubOsc.connect(bubGain);
      bubGain.connect(masterGain);
      bubOsc.start();
      bubOsc.stop(ctx.currentTime + 0.15);

      // Schedule next bubble after random delay
      const nextDelay = 800 + Math.random() * 3000;
      setTimeout(triggerBubble, nextDelay);
    };
    // Start bubbles after a short delay
    setTimeout(triggerBubble, 1200);

    // ── CYCLONE WHITE NOISE (Looped + Sweeping Filter) ─────────────
    const bufferSize = ctx.sampleRate * 4; // 4 seconds
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const outputData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      outputData[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const cycloneFilter = ctx.createBiquadFilter();
    cycloneFilter.type = 'bandpass';
    cycloneFilter.frequency.value = 300;
    cycloneFilter.Q.value = 3;

    const cycloneGain = ctx.createGain();
    cycloneGain.gain.value = 0;

    noiseSource.connect(cycloneFilter);
    cycloneFilter.connect(cycloneGain);
    cycloneGain.connect(masterGain);
    noiseSource.start();

    cycloneNodeRef.current = { gain: cycloneGain, filter: cycloneFilter };

    // ── LIGHTNING CRACKLE (Bjali) ─────────────────────────────────
    const lightningFilter = ctx.createBiquadFilter();
    lightningFilter.type = 'highpass';
    lightningFilter.frequency.value = 1500;

    const lightningGain = ctx.createGain();
    lightningGain.gain.value = 0;

    lightningFilter.connect(lightningGain);
    lightningGain.connect(masterGain);
    lightningNodeRef.current = { filter: lightningFilter, gain: lightningGain };

  }, []);

  const triggerLightningSound = useCallback(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    if (!lightningNodeRef.current) return;

    const { gain, filter } = lightningNodeRef.current;
    const now = ctx.currentTime;

    const noiseSource = ctx.createBufferSource();
    const bufferSize = Math.ceil(ctx.sampleRate * 0.35);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    noiseSource.buffer = noiseBuffer;
    noiseSource.connect(filter);

    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(1.2, now + 0.005); // Instant crack
    gain.gain.exponentialRampToValueAtTime(0.3, now + 0.05);  // Echo tail
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noiseSource.start(now);
    noiseSource.stop(now + 0.4);
  }, []);

  const triggerCycloneAudio = useCallback(() => {
    if (!audioCtxRef.current || !cycloneNodeRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const now = ctx.currentTime;
    const { gain, filter } = cycloneNodeRef.current;

    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(0.8, now + 3);

    // Continuous slow sweep of the filter even while active
    const sweepCyclone = () => {
      if (!cycloneNodeRef.current || cycloneNodeRef.current.gain.gain.value < 0.05) return;
      const t = ctx.currentTime;
      filter.frequency.cancelScheduledValues(t);
      filter.frequency.setValueAtTime(200, t);
      filter.frequency.exponentialRampToValueAtTime(2000, t + 4);
      filter.frequency.exponentialRampToValueAtTime(200, t + 8);
      setTimeout(sweepCyclone, 8000);
    };
    sweepCyclone();

    // Dim ambient drone
    if (droneGainRef.current) {
      droneGainRef.current.layers.forEach(({ gain: g }) => {
        g.gain.cancelScheduledValues(now);
        g.gain.linearRampToValueAtTime(g.gain.value * 0.3, now + 2);
      });
    }
  }, []);

  const stopCycloneAudio = useCallback(() => {
    if (!audioCtxRef.current || !cycloneNodeRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime;
    const { gain } = cycloneNodeRef.current;

    gain.gain.cancelScheduledValues(now);
    gain.gain.linearRampToValueAtTime(0, now + 2);

    // Restore drone
    if (droneGainRef.current) {
      const volumes = [0.5, 0.3, 0.2, 0.1];
      droneGainRef.current.layers.forEach(({ gain: g }, i) => {
        g.gain.cancelScheduledValues(now);
        g.gain.linearRampToValueAtTime(volumes[i], now + 3);
      });
    }
  }, []);

  return { initAudio, triggerCycloneAudio, stopCycloneAudio, triggerLightningSound };
}
