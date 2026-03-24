import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    // Vertical gradient – bright at top, fades at bottom
    float gradient = pow(1.0 - vUv.y, 1.8);
    // Horizontal gradient – bright at center of ray
    float edge = 1.0 - abs(vUv.x - 0.5) * 2.0;
    edge = pow(edge, 2.5);
    // Animated shimmer
    float shimmer = 0.85 + 0.15 * sin(uTime * 1.5 + vUv.y * 10.0);

    float alpha = gradient * edge * shimmer * uOpacity;
    vec3 col = mix(vec3(0.2, 0.7, 1.0), vec3(1.0, 1.0, 1.0), edge * 0.4);
    gl_FragColor = vec4(col, alpha * 0.22);
  }
`;

const RAY_CONFIG = [
  { x: -8, z: -3, rot: 0.18, scaleX: 3, scaleY: 18 },
  { x: -4, z: -5, rot: 0.08, scaleX: 4, scaleY: 22 },
  { x:  0, z: -4, rot: -0.04, scaleX: 5, scaleY: 24 },
  { x:  4, z: -6, rot: -0.12, scaleX: 3.5, scaleY: 20 },
  { x:  8, z: -3, rot: -0.2, scaleX: 2.5, scaleY: 16 },
  { x: -12, z: -7, rot: 0.28, scaleX: 2, scaleY: 14 },
  { x: 12,  z: -7, rot: -0.28, scaleX: 2, scaleY: 14 },
];

export default function LightRays({ scrollRef }) {
  const refs = useRef([]);

  const uniforms = useMemo(() => RAY_CONFIG.map(() => ({
    uTime: { value: 0 },
    uOpacity: { value: 1 },
  })), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const scroll = scrollRef.current;
    // Rays fade out as we go deeper (gone below 40% scroll)
    const opacity = Math.max(0, 1 - scroll / 0.45);
    uniforms.forEach(u => {
      u.uTime.value = t;
      u.uOpacity.value = opacity;
    });
  });

  return (
    <group position={[0, 12, -2]}>
      {RAY_CONFIG.map((cfg, i) => (
        <mesh
          key={i}
          ref={el => refs.current[i] = el}
          position={[cfg.x, 0, cfg.z]}
          rotation={[0, 0, cfg.rot]}
          scale={[cfg.scaleX, cfg.scaleY, 1]}
        >
          <planeGeometry args={[1, 1]} />
          <shaderMaterial
            uniforms={uniforms[i]}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
