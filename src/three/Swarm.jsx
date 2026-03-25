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
  
  // Persistent temp vectors to avoid allocations in useFrame
  const tempV1 = useMemo(() => new THREE.Vector3(), []);
  const tempV2 = useMemo(() => new THREE.Vector3(), []);
  const tempV3 = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const mouse = mouseRef.current;

    target.set(
      Math.sin(t * 0.2) * 15 + mouse.x * 5,
      Math.cos(t * 0.3) * 4 + 2 + mouse.y * 2,
      Math.sin(t * 0.4) * 5 - 12
    );

    center.set(0, 0, 0);
    for (let i = 0; i < FISH_COUNT; i++) {
      center.add(states[i].position);
    }
    center.divideScalar(FISH_COUNT);

    states.forEach((s, i) => {
      // 1. Cohesion (using tempV1)
      tempV1.copy(center).sub(s.position).normalize().multiplyScalar(0.001);
      
      // 2. Goal (using tempV2)
      tempV2.copy(target).sub(s.position).normalize().multiplyScalar(0.003);

      // 3. Wiggle (using tempV3)
      tempV3.set(
        Math.sin(t * 2 + s.offset) * 0.002,
        Math.cos(t * 3 + s.offset * 2) * 0.002,
        Math.sin(t * 1.5 + s.offset) * 0.002
      );

      // 4. Mouse Repulsion
      const dx = s.position.x - mouse.x * 12;
      const dy = s.position.y - (mouse.y * 6 + 2);
      const mDist = Math.sqrt(dx*dx + dy*dy);
      
      if (mDist < 4.0) {
        // reuse tempV1/V2 if finished
        const rep = tempV1.set(dx, dy, 0).normalize().multiplyScalar(0.01 / (mDist + 0.1));
        s.velocity.add(rep);
      }

      s.velocity.add(tempV1).add(tempV2).add(tempV3);
      s.velocity.clampLength(0.02, s.speed);

      s.position.add(s.velocity);

      dummy.position.copy(s.position);
      
      // Look direction
      tempV1.copy(s.position).add(s.velocity);
      dummy.lookAt(tempV1);

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
