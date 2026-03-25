import { useEffect, useRef } from 'react';

/**
 * Returns a ref whose `.current` is always the normalized scroll progress [0, 1].
 * Using a ref (not state) avoids React re-renders on every scroll event —
 * Three.js reads it inside useFrame which runs outside the React render cycle.
 */
export function useScrollDepth() {
  const scrollRef = useRef(0);
  // Using pure ref, updated synchronously by Lenis in App.jsx to avoid layout thrashing
  return scrollRef;
}

/**
 * Returns a ref whose `.current` is { x, y } mouse position in [-1, 1] NDC.
 */
export function useMouseParallax() {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return mouseRef;
}
