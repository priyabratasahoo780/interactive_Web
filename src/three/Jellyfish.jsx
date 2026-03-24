import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const glowVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const glowFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vPos;

  void main() {
    // Fresnel rim glow
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.5);
    // Pulsing bioluminescence
    float pulse = 0.6 + 0.4 * sin(uTime * 1.8 + vPos.y * 4.0);
    float alpha = fresnel * pulse;
    gl_FragColor = vec4(uColor, alpha * 0.75);
  }
`;

function SingleJellyfish({ position, color, speed, scale }) {
  const groupRef = useRef();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) },
  }), [color]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() * speed;

    // Gentle floating
    groupRef.current.position.y = position[1] + Math.sin(t) * 1.2;
    groupRef.current.position.x = position[0] + Math.sin(t * 0.4) * 1.5;
    groupRef.current.rotation.y = t * 0.2;

    uniforms.uTime.value = clock.getElapsedTime();
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Bell */}
      <mesh>
        <sphereGeometry args={[1, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={glowVert}
          fragmentShader={glowFrag}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Inner bell glow */}
      <mesh scale={0.85}>
        <sphereGeometry args={[1, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} />
      </mesh>
      {/* Tentacles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const rx = Math.cos(angle) * 0.55;
        const rz = Math.sin(angle) * 0.55;
        return (
          <mesh key={i} position={[rx, -0.3, rz]}>
            <cylinderGeometry args={[0.025, 0.01, 2.5 + Math.random() * 1.5, 4]} />
            <meshBasicMaterial color={color} transparent opacity={0.35} />
          </mesh>
        );
      })}
      {/* Core light */}
      <pointLight color={color} intensity={0.6} distance={4} decay={2} />
    </group>
  );
}

const JELLYFISH_CONFIGS = [
  { pos: [-6, -14, -10], color: '#9b5de5', speed: 0.4, scale: 1.2 },
  { pos: [8,  -18, -15], color: '#00ffcc', speed: 0.3, scale: 0.9 },
  { pos: [-3, -24, -18], color: '#ff0055', speed: 0.5, scale: 0.7 },
  { pos: [5,  -32, -22], color: '#7b2fff', speed: 0.35, scale: 1.4 },
  { pos: [-10,-38, -26], color: '#ff69b4', speed: 0.25, scale: 1.0 },
];

export default function Jellyfish() {
  return (
    <>
      {JELLYFISH_CONFIGS.map((cfg, i) => (
        <SingleJellyfish
          key={i}
          position={cfg.pos}
          color={cfg.color}
          speed={cfg.speed}
          scale={cfg.scale}
        />
      ))}
    </>
  );
}
