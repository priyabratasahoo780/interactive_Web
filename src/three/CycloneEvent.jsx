import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 3000;

export default function CycloneEvent({ isActive, onLightningStrike }) {
  const meshRef = useRef();
  const lightRef = useRef();

  // Procedural spiral states
  const states = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => {
      const radius = Math.random() * 20 + 2; // initial orbit
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 100; // stretches tall
      return {
        angle,
        radius,
        baseRadius: radius,
        y,
        speed: (Math.random() * 0.05) + 0.02,
        scale: Math.random() * 0.4 + 0.1,
      };
    });
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Easing value for smoothly turning the cyclone on/off
  const intensityRef = useRef(0);
  const flashDecayRef = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smoothly ramp the intensity up/down based on isActive state
    if (isActive && intensityRef.current < 1) {
      intensityRef.current += delta * 0.5;
    } else if (!isActive && intensityRef.current > 0) {
      intensityRef.current -= delta * 0.5;
    }
    
    // Clamp
    intensityRef.current = Math.max(0, Math.min(1, intensityRef.current));

    const intensity = intensityRef.current;
    
    // Hide entirely if fully inactive
    if (intensity === 0) {
      meshRef.current.visible = false;
      return;
    } else {
      meshRef.current.visible = true;
    }

    states.forEach((s, i) => {
      // Swirl faster when active
      s.angle -= s.speed * (1 + intensity * 5);
      
      // Pull particles inwards to form a tight tornado when active
      s.radius = THREE.MathUtils.lerp(s.baseRadius, s.baseRadius * 0.2 + Math.abs(s.y) * 0.1, intensity);
      
      // Suck upwards
      s.y += s.speed * 20 * intensity;
      if (s.y > 50) s.y = -50;

      const x = Math.cos(s.angle) * s.radius;
      const z = Math.sin(s.angle) * s.radius;

      dummy.position.set(x, s.y, z);
      // Stretch particles vertically as they spin faster
      dummy.scale.set(s.scale, s.scale * (1 + intensity * 4), s.scale);
      
      // Point them along their velocity slightly
      dummy.rotation.x = intensity * (Math.PI / 4);
      dummy.rotation.z = s.angle;

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;

    // --- Lightning (Bjali) Logic ---
    if (isActive && intensity > 0.8) {
      // 2% chance per frame to trigger a strike when fully active
      if (Math.random() < 0.02 && flashDecayRef.current <= 0) {
        flashDecayRef.current = 1.0; // Max brightness
        if (onLightningStrike) onLightningStrike();
      }
    }

    // Decay the lightning flash rapidly
    if (flashDecayRef.current > 0) {
      flashDecayRef.current -= delta * 5; // Decays in 0.2 seconds
      if (flashDecayRef.current < 0) flashDecayRef.current = 0;
    }

    if (lightRef.current) {
      lightRef.current.intensity = flashDecayRef.current * 10;
    }
  });

  return (
    <group position={[0, -20, -15]} visible={false} ref={(grp) => {
      // Sync group visibility with mesh visibility
      if (grp && meshRef.current) grp.visible = meshRef.current.visible;
    }}>
      <instancedMesh ref={meshRef} args={[null, null, PARTICLE_COUNT]}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshPhysicalMaterial
          color="#a0e4ff"
          emissive="#00d4ff"
          emissiveIntensity={1.5}
          transparent
          opacity={0.6}
          roughness={0.1}
          metalness={0.8}
        />
      </instancedMesh>
      
      {/* Center explosive light for the lightning flash */}
      <pointLight ref={lightRef} color="#e0f7fa" intensity={0} distance={100} decay={2} position={[0, 0, 0]} />
    </group>
  );
}