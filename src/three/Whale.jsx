import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Whale() {
  const groupRef = useRef();
  const tailRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Very slow progression across the background
    groupRef.current.position.x = -60 + (t * 1.5) % 150; // Slowly swims from left to right
    groupRef.current.position.y = -35 + Math.sin(t * 0.2) * 2; // Deep in the Midnight zone
    
    // Slow, heavy tail wag
    if (tailRef.current) {
      tailRef.current.rotation.y = Math.sin(t * 1.2) * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[-60, -35, -45]} scale={12}>
      {/* Massive body */}
      <mesh castShadow={false}>
        <cylinderGeometry args={[0.5, 0.8, 4, 8]} />
        <meshBasicMaterial color="#010c1c" fog={true} />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, -2, 0]}>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshBasicMaterial color="#010c1c" fog={true} />
      </mesh>
      
      {/* Tail section */}
      <group ref={tailRef} position={[0, 2, 0]}>
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.1, 0.5, 3, 6]} />
          <meshBasicMaterial color="#010c1c" fog={true} />
        </mesh>
        {/* Flukes */}
        <mesh position={[0, 3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.8, 0.2, 4]} />
          <meshBasicMaterial color="#010c1c" fog={true} />
        </mesh>
      </group>
      
      {/* Pectoral fins */}
      <mesh position={[0.9, -1, 0]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.2, 1.5, 4]} />
        <meshBasicMaterial color="#010c1c" fog={true} />
      </mesh>
      <mesh position={[-0.9, -1, 0]} rotation={[0, 0, -Math.PI / 4]}>
        <coneGeometry args={[0.2, 1.5, 4]} />
        <meshBasicMaterial color="#010c1c" fog={true} />
      </mesh>
    </group>
  );
}
