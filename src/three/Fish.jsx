import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// One procedural fish = merged body (elongated sphere) + tail (cone)
function createFishGeometry() {
  const body = new THREE.SphereGeometry(0.5, 8, 6);
  // Squish into fish shape
  body.scale(1.8, 0.7, 0.7);
  return body;
}

function SingleFish({ offsetX, offsetY, offsetZ, speed, scale, color }) {
  const groupRef = useRef();
  const bodyRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() * speed;

    // Swim in a wide looping path
    groupRef.current.position.x = Math.cos(t) * 18 + offsetX;
    groupRef.current.position.y = Math.sin(t * 0.5) * 2 + offsetY;
    groupRef.current.position.z = offsetZ + Math.sin(t * 0.3) * 3;

    // Face direction of travel
    const dx = -Math.sin(t) * 18;
    const dy = Math.cos(t * 0.5);
    groupRef.current.rotation.y = Math.atan2(-dx, -1);
    groupRef.current.rotation.z = Math.atan2(dy, Math.abs(dx)) * 0.3;

    // Tail wag
    if (bodyRef.current) {
      bodyRef.current.rotation.y = Math.sin(t * 6) * 0.25;
    }
  });

  return (
    <group ref={groupRef} scale={scale}>
      {/* Body */}
      <mesh castShadow={false}>
        <sphereGeometry args={[0.5, 8, 6]} />
        <meshPhysicalMaterial
          color={color}
          roughness={0.3}
          metalness={0.1}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Tail */}
      <mesh ref={bodyRef} position={[-0.6, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.35, 0.6, 6]} />
        <meshPhysicalMaterial color={color} roughness={0.4} emissive={color} emissiveIntensity={0.1} />
      </mesh>
      {/* Eye */}
      <mesh position={[0.3, 0.12, 0.28]}>
        <sphereGeometry args={[0.06, 5, 5]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

const FISH_CONFIGS = [
  { x: 5,  y:  2, z: -8,  speed: 0.18, scale: 0.6, color: '#48cae4' },
  { x: -8, y: -1, z: -12, speed: 0.22, scale: 0.5, color: '#0096c7' },
  { x: 12, y:  0, z: -6,  speed: 0.15, scale: 0.8, color: '#90e0ef' },
  { x: -5, y:  3, z: -10, speed: 0.20, scale: 0.45, color: '#ade8f4' },
  // Deeper fish (appear around midnight zone)
  { x: 3,  y: -15, z: -20, speed: 0.12, scale: 0.7, color: '#7b2fff' },
  { x: -9, y: -18, z: -18, speed: 0.14, scale: 0.55, color: '#ff0055' },
  { x: 7,  y: -22, z: -22, speed: 0.10, scale: 0.9, color: '#39ff14' },
  { x: -3, y: -28, z: -25, speed: 0.08, scale: 0.65, color: '#ff4500' },
];

export default function Fish() {
  return (
    <>
      {FISH_CONFIGS.map((cfg, i) => (
        <SingleFish
          key={i}
          offsetX={cfg.x}
          offsetY={cfg.y}
          offsetZ={cfg.z}
          speed={cfg.speed}
          scale={cfg.scale}
          color={cfg.color}
        />
      ))}
    </>
  );
}