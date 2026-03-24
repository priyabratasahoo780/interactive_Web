import { useEffect, useRef } from 'react';

/**
 * Returns a ref whose `.current` is always the normalized scroll progress [0, 1].
 * Using a ref (not state) avoids React re-renders on every scroll event —
 * Three.js reads it inside useFrame which runs outside the React render cycle.
 */
export function useScrollDepth() {
  const scrollRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      scrollRef.current = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
