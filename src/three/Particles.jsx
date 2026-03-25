import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */ `
  attribute float aTime;
  uniform float uTime;
  uniform float uScroll;

  varying float vAlpha;
  varying float vDepth;

  void main() {
    // Animate each particle with unique time offset
    vec3 pos = position;
    float t = uTime + aTime * 6.283;
    pos.x += sin(t * 0.4) * 0.5;
    pos.y += cos(t * 0.3) * 0.4;
    pos.z += sin(t * 0.5 + 1.0) * 0.3;

    // Shift entire field downward as we scroll deeper
    pos.y -= uScroll * 60.0;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    // Size decays with distance
    float dist = -mvPos.z;
    gl_PointSize = clamp(300.0 / dist, 0.5, 5.0);

    vAlpha = clamp(1.0 - dist / 80.0, 0.0, 1.0);
    // Depth-based fade: particles get dimmer toward trench
    vDepth = uScroll;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying float vDepth;

  void main() {
    // Soft circle
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    float alpha = (1.0 - dist * 2.0) * vAlpha * (0.5 + (1.0 - vDepth) * 0.5);

    // Color transitions with depth: cyan → white near surface, dim near abyss
    vec3 col = mix(vec3(0.6, 0.95, 1.0), vec3(0.85, 0.95, 1.0), vDepth);
    gl_FragColor = vec4(col, alpha * 0.7);
  }
`;

export default function Particles({ isMobile, scrollRef }) {
  const meshRef = useRef();
  const COUNT = isMobile ? 600 : 2000;

  const { positions, times } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const times = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 60;   // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 80;   // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;   // z (depth spread)
      times[i] = Math.random();
    }
    return { positions, times };
  }, [COUNT]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uScroll: { value: 0 },
  }), []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      uniforms.uTime.value = clock.getElapsedTime();
      if (scrollRef && scrollRef.current !== undefined) {
        uniforms.uScroll.value = scrollRef.current;
      }
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aTime" args={[times, 1]} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
