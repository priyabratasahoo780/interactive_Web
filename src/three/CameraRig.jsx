import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

export default function CameraRig({ scrollRef, mouseRef }) {
  const { camera } = useThree();
  const targetRef = useRef({ x: 0, y: 0, z: 5 });
  const prevScrollRef = useRef(0);
  const scrollVelocityRef = useRef(0);

  useFrame((_, delta) => {
    const scroll = scrollRef.current;
    const mouse = mouseRef.current;

    // Compute scroll velocity for speed effects
    const rawVelocity = (scroll - prevScrollRef.current) / delta;
    prevScrollRef.current = scroll;
    // Smooth the velocity to prevent jitter
    scrollVelocityRef.current += (rawVelocity - scrollVelocityRef.current) * 0.1;

    // Camera dives from Z=5 (surface) to Z=-80 (trench)
    targetRef.current.z = 5 - scroll * 85;

    // Stronger mouse parallax — deeper layers feel slower (multiplier < 1)
    targetRef.current.x = mouse.x * 3.5;
    targetRef.current.y = mouse.y * 1.8 + scroll * -2;

    // Smooth lerp (exp decay for buttery feel)
    const lerpFactor = 1 - Math.exp(-4 * delta);
    camera.position.x += (targetRef.current.x - camera.position.x) * lerpFactor;
    camera.position.y += (targetRef.current.y - camera.position.y) * lerpFactor;
    camera.position.z += (targetRef.current.z - camera.position.z) * lerpFactor;

    // Scroll Velocity → FOV distortion (feels like rushing through water)
    const baseFov = 60;
    const speedFov = Math.abs(scrollVelocityRef.current) * 8; // boost FOV on speed
    const targetFov = THREE.MathUtils.clamp(baseFov + speedFov, baseFov, 85);
    camera.fov += (targetFov - camera.fov) * 0.1;
    camera.updateProjectionMatrix();

    // Subtle camera tilt — look slightly forward/down as we descend
    camera.lookAt(
      camera.position.x * 0.1 + mouse.x * 0.5,
      camera.position.y * 0.1 - scroll * 1.5 + mouse.y * 0.2,
      camera.position.z - 10
    );
  });

  return null;
}