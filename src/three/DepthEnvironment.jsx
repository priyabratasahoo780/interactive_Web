import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

// Depth color stops: [scrollProgress, fogColor, bgColor]
// Simulates real light absorption: red disappears first, then green, then blue
const DEPTH_COLORS = [
  { p: 0.00, fog: new THREE.Color('#00bfff'), bg: new THREE.Color('#0080b0') },
  { p: 0.10, fog: new THREE.Color('#0099cc'), bg: new THREE.Color('#005c80') },
  { p: 0.25, fog: new THREE.Color('#0077aa'), bg: new THREE.Color('#004068') },
  { p: 0.42, fog: new THREE.Color('#004488'), bg: new THREE.Color('#001a4d') },
  { p: 0.60, fog: new THREE.Color('#002266'), bg: new THREE.Color('#000d33') },
  { p: 0.75, fog: new THREE.Color('#000a22'), bg: new THREE.Color('#000511') },
  { p: 0.88, fog: new THREE.Color('#000000'), bg: new THREE.Color('#000000') },
  { p: 1.00, fog: new THREE.Color('#000000'), bg: new THREE.Color('#000000') },
];

function lerpColors(stops, t) {
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i], b = stops[i + 1];
    if (t >= a.p && t <= b.p) {
      const fac = (t - a.p) / (b.p - a.p);
      return {
        fog: a.fog.clone().lerp(b.fog, fac),
        bg: a.bg.clone().lerp(b.bg, fac),
      };
    }
  }
  return { fog: stops[stops.length - 1].fog.clone(), bg: stops[stops.length - 1].bg.clone() };
}

export default function DepthEnvironment({ scrollRef }) {
  const { scene } = useThree();

  useFrame(() => {
    const t = scrollRef.current;
    const { fog, bg } = lerpColors(DEPTH_COLORS, t);

    // Fog density increases with depth
    const density = 0.03 + t * 0.12;
    if (!scene.fog) {
      scene.fog = new THREE.FogExp2(fog.getHex(), density);
    } else {
      scene.fog.color.copy(fog);
      scene.fog.density = density;
    }
    scene.background = bg;
  });

  return null;
}