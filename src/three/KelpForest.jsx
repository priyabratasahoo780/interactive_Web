import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const KELP_COUNT = 15;

const kelpVert = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    // Swaying motion: more intense at the top (uv.y)
    float sway = sin(uTime * 1.5 + pos.y * 0.5) * 0.8 * uv.y;
    pos.x += sway;
    pos.z += cos(uTime * 1.2 + pos.y * 0.4) * 0.5 * uv.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const kelpFrag = /* glsl */ `
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    // Gradient from dark bottom to lighter translucent top
    float alpha = 0.4 + vUv.y * 0.5;
    vec3 finalColor = mix(uColor * 0.4, uColor, vUv.y);
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

function SingleKelp({ position, scale, color }) {
  const meshRef = useRef();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(color) }
  }), [color]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      uniforms.uTime.value = clock.getElapsedTime() + position[0] * 0.5;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <cylinderGeometry args={[0.08, 0.25, 12, 8, 12]} />
      <shaderMaterial
        vertexShader={kelpVert}
        fragmentShader={kelpFrag}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function KelpForest() {
  const kelps = useMemo(() => {
    return Array.from({ length: KELP_COUNT }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20, 
        -15 - Math.random() * 20, 
        2 + Math.random() * 2 // VERY CLOSE TO CAMERA for high parallax
      ],
      scale: [1, 1 + Math.random() * 0.5, 1],
      color: '#2d6a4f'
    }));
  }, []);

  return (
    <group>
      {kelps.map((k, i) => (
        <SingleKelp key={i} {...k} />
      ))}
    </group>
  );
}
