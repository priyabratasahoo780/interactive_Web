import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const BUBBLE_COUNT = 120;

export default function Bubbles3D({ mouseRef }) {
  const meshRef = useRef();

  // Store per-instance state in refs (no re-renders)
  const states = useMemo(() => {
    return Array.from({ length: BUBBLE_COUNT }, () => ({
      originX: (Math.random() - 0.5) * 50,
      x: 0,
      y: Math.random() * -60 - 5,
      originZ: (Math.random() - 0.5) * 20,
      z: 0,
      vx: 0,
      vz: 0,
      speed: Math.random() * 0.04 + 0.02,
      wobble: Math.random() * Math.PI * 2,
      scale: Math.random() * 0.25 + 0.05,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    
    // Convert 2D mouse [-1, 1] to approximate 3D world space at z=0 plane
    // Camera is roughly at z=5 looking at z=-10, visible width is ~30 units
    const mouseX = mouseRef.current.x * 15;
    const mouseY = mouseRef.current.y * 10;

    states.forEach((s, i) => {
      s.y += s.speed;
      
      // Reset when bubble rises out of view
      if (s.y > 30) {
        s.y = Math.random() * -60 - 10;
        s.originX = (Math.random() - 0.5) * 50;
        s.x = s.originX;
        s.vx = 0;
      }

      // Base sine wobble
      const targetX = s.originX + Math.sin(t * 0.5 + s.wobble) * 0.4;
      const targetZ = s.originZ;

      // Mouse repulsion
      // Only react if bubble is somewhat near the "screen plane" (z > -10)
      if (s.z > -10 && s.z < 5) {
        const dx = s.x - mouseX;
        const dy = s.y - mouseY;
        const distSq = dx * dx + dy * dy;
        
        // Repel if within radius (distSq < 16 = radius 4)
        if (distSq < 16 && distSq > 0.1) {
          const force = (16 - distSq) / 16; // 0 to 1
          s.vx += (dx / Math.sqrt(distSq)) * force * 0.15;
        }
      }

      // Spring back to origin + friction
      s.vx += (targetX - s.x) * 0.02;
      s.vx *= 0.92; // Friction

      s.x += s.vx;
      s.z = targetZ;

      dummy.position.set(s.x, s.y, s.z);
      dummy.scale.setScalar(s.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, BUBBLE_COUNT]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshPhysicalMaterial
        color="#a0e4ff"
        transparent
        opacity={0.12}
        roughness={0}
        metalness={0}
        transmission={0.9}
        thickness={0.5}
        side={THREE.DoubleSide}
      />
    </instancedMesh>
  );
}