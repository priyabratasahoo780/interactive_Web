import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FISH_COUNT = 150;

export default function Swarm({ mouseRef }) {
  const meshRef = useRef();

  // Pre-calculate geometry and material to re-use
  const { geometry, material } = useMemo(() => {
    // Simple low-poly fish: thin long cone
    const geom = new THREE.ConeGeometry(0.08, 0.6, 4);
    geom.rotateX(Math.PI / 2); // point forward along Z
    const mat = new THREE.MeshPhysicalMaterial({
      color: '#48cae4',
      metalness: 0.8,
      roughness: 0.2,
      emissive: '#0077b6',
      emissiveIntensity: 0.2
    });
    return { geometry: geom, material: mat };
  }, []);

  // Initialize swarm state
  const states = useMemo(() => {
    return Array.from({ length: FISH_COUNT }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 + 2, // Near surface/sunlight zone
        (Math.random() - 0.5) * 15 - 10
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      ).normalize().multiplyScalar(0.05),
      speed: Math.random() * 0.02 + 0.04,
      offset: Math.random() * Math.PI * 2,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const center = useMemo(() => new THREE.Vector3(), []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const mouse = mouseRef.current;

    // Follow a constantly moving center point + respond slightly to mouse
    target.set(
      Math.sin(t * 0.2) * 15 + mouse.x * 5,
      Math.cos(t * 0.3) * 4 + 2 + mouse.y * 2,
      Math.sin(t * 0.4) * 5 - 12
    );

    // Calculate swarm center for cohesion
    center.set(0, 0, 0);
    for (let i = 0; i < FISH_COUNT; i++) {
      center.add(states[i].position);
    }
    center.divideScalar(FISH_COUNT);

    states.forEach((s, i) => {
      // 1. Cohesion: move towards swarm center
      const cohesion = center.clone().sub(s.position).normalize().multiplyScalar(0.001);
      
      // 2. Goal: move towards target
      const goal = target.clone().sub(s.position).normalize().multiplyScalar(0.003);

      // 3. Wiggle: organic sine wave motion
      const wiggle = new THREE.Vector3(
        Math.sin(t * 2 + s.offset) * 0.002,
        Math.cos(t * 3 + s.offset * 2) * 0.002,
        Math.sin(t * 1.5 + s.offset) * 0.002
      );

      // 4. Mouse Repulsion: push away if too close
      const dx = s.position.x - mouse.x * 12;
      const dy = s.position.y - (mouse.y * 6 + 2);
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      const repulsion = new THREE.Vector3(dx, dy, 0).normalize().multiplyScalar(0.005 / (dist + 0.1));
      if (dist < 4.0) {
        s.velocity.add(repulsion.multiplyScalar(2.0));
      }

      s.velocity.add(cohesion).add(goal).add(wiggle);
      s.velocity.clampLength(0.02, s.speed); // Enforce speed limits

      // Update position
      s.position.add(s.velocity);

      // Apply to dummy for matrix update
      dummy.position.copy(s.position);
      
      // Look where it's going
      const lookTarget = dummy.position.clone().add(s.velocity);
      dummy.lookAt(lookTarget);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, FISH_COUNT]}
    />
  );
}
