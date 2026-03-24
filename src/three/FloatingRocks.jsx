import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ROCK_COUNT = 35;

export default function FloatingRocks() {
  const meshRef = useRef();

  // Generate random rock data
  const rocks = useMemo(() => {
    return Array.from({ length: ROCK_COUNT }, () => ({
      x: (Math.random() - 0.5) * 60,
      y: (Math.random() - 0.5) * 40 - 70, // Deep in Abyss/Hadal sizes
      z: (Math.random() - 0.5) * 30 - 10,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      rotZ: Math.random() * Math.PI,
      vRotX: (Math.random() - 0.5) * 0.005,
      vRotY: (Math.random() - 0.5) * 0.005,
      vRotZ: (Math.random() - 0.5) * 0.005,
      scale: Math.random() * 2.5 + 0.5,
    }));
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    if (!meshRef.current) return;

    rocks.forEach((r, i) => {
      // Extremely slow eerie rotation
      r.rotX += r.vRotX;
      r.rotY += r.vRotY;
      r.rotZ += r.vRotZ;

      dummy.position.set(r.x, r.y, r.z);
      dummy.rotation.set(r.rotX, r.rotY, r.rotZ);
      dummy.scale.setScalar(r.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, ROCK_COUNT]}>
      {/* Low-poly jagged look */}
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#081020"
        roughness={0.9}
        metalness={0.1}
        bumpScale={0.2}
      />
    </instancedMesh>
  );
}
