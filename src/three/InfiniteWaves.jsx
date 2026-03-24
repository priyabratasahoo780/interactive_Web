import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Vertex shader: displaces vertices in a sine-wave pattern to create waves
const waveVert = /* glsl */ `
  uniform float uTime;
  uniform float uDepth;
  varying float vElevation;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;
    
    float wave1 = sin(pos.x * 0.4 + uTime * 1.2) * cos(pos.z * 0.3 + uTime * 0.8) * 0.6;
    float wave2 = sin(pos.x * 0.8 - uTime * 0.7) * sin(pos.z * 0.6 + uTime * 1.0) * 0.3;
    float wave3 = cos(pos.x * 0.2 + uTime * 0.4) * cos(pos.z * 0.9 - uTime * 0.5) * 0.15;

    pos.y += wave1 + wave2 + wave3;
    vElevation = pos.y;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment shader: depth-based blue tones with highlight crest shimmer
const waveFrag = /* glsl */ `
  uniform float uTime;
  uniform float uDepth;
  uniform vec3 uColor;
  varying float vElevation;
  varying vec2 vUv;

  void main() {
    // Crests are brighter (light-scattering)
    float crest = smoothstep(-0.5, 0.8, vElevation);
    // Depth fades the water toward dark
    float depthFade = 1.0 - uDepth * 0.85;

    vec3 deepColor  = vec3(0.0, 0.01, 0.07) * depthFade;
    vec3 crestColor = uColor * (0.6 + crest * 0.4);
    vec3 color = mix(deepColor, crestColor, crest * 0.7 + 0.3);

    // Shimmer sparkles on crests
    float sparkle = pow(crest, 8.0) * 0.8;
    color += vec3(sparkle * 0.4, sparkle * 0.6, sparkle);

    float alpha = 0.18 + crest * 0.25;
    gl_FragColor = vec4(color, alpha * depthFade);
  }
`;

const LAYER_COUNT = 14; // How many infinite repeat layers

export default function InfiniteWaves({ scrollRef }) {
  const meshRefs = useRef([]);

  const uniforms = useMemo(() => 
    Array.from({ length: LAYER_COUNT }, (_, i) => ({
      uTime:  { value: 0 },
      uDepth: { value: 0 },
      uColor: { value: new THREE.Color(`hsl(${195 - i * 3}, 80%, ${55 - i * 3}%)`) },
    }))
  , []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const scroll = scrollRef.current;

    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;

      // Each layer moves forward as we scroll (creates infinite tunnel illusion)
      const baseZ = -i * 10;
      const scrollShift = scroll * 140;  // Matches camera Z travel (0 → -80 mapped larger)

      // Use modulo to recycle layers — the layers wrap around infinitely
      const totalDepth = LAYER_COUNT * 10;
      const z = ((baseZ + scrollShift) % totalDepth) - totalDepth;

      mesh.position.z = z;

      // Update wave and depth uniforms through material
      const mat = mesh.material;
      mat.uniforms.uTime.value = t + i * 0.4;
      mat.uniforms.uDepth.value = scroll;
    });
  });

  return (
    <group>
      {Array.from({ length: LAYER_COUNT }, (_, i) => (
        <mesh
          key={i}
          ref={el => meshRefs.current[i] = el}
          position={[0, -1.5, -i * 10]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[80, 80, 48, 48]} />
          <shaderMaterial
            uniforms={uniforms[i]}
            vertexShader={waveVert}
            fragmentShader={waveFrag}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
