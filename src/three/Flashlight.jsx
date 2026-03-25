import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const beamVert = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const beamFrag = /* glsl */ `
  uniform float uIntensity;
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    float fresnel = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    // Depth fade to soften the beam edge
    float distanceFade = smoothstep(10.0, 0.0, vPos.z);
    gl_FragColor = vec4(uColor, uIntensity * fresnel * distanceFade * 0.4);
  }
`;

export default function Flashlight({ mouseRef, scrollRef }) {
  const lightRef = useRef();
  const beamRef = useRef();
  const { camera } = useThree();

  const uniforms = useMemo(() => ({
    uIntensity: { value: 0 },
    uColor: { value: new THREE.Color('#e0f7fa') }
  }), []);

  useFrame((state, delta) => {
    if (!lightRef.current || !beamRef.current) return;

    const mouse = mouseRef.current;
    
    // Only activate in deeper/darker zones (scroll > 0.4)
    const scroll = scrollRef ? scrollRef.current : 0;
    const targetIntensity = scroll > 0.4 ? 0.8 : 0;
    uniforms.uIntensity.value = THREE.MathUtils.lerp(uniforms.uIntensity.value, targetIntensity, 0.1);

    // Position light slightly in front of the camera and offset by mouse
    const x = mouse.x * 5;
    const y = mouse.y * 3;
    
    lightRef.current.position.set(camera.position.x + x, camera.position.y + y, camera.position.z - 0.5);
    lightRef.current.target.position.set(camera.position.x + x * 2, camera.position.y + y * 2, camera.position.z - 15);
    lightRef.current.target.updateMatrixWorld();

    // Beam cone follows the light
    beamRef.current.position.copy(lightRef.current.position);
    beamRef.current.lookAt(lightRef.current.target.position);
  });

  return (
    <group>
      <spotLight
        ref={lightRef}
        intensity={uniforms.uIntensity.value * 15}
        distance={25}
        angle={Math.PI / 6}
        penumbra={0.5}
        decay={2}
        color="#e0f7fa"
      />
      {/* Volumetric beam cone */}
      <mesh ref={beamRef} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[2, 12, 16, 1, true]} />
        <shaderMaterial
          vertexShader={beamVert}
          fragmentShader={beamFrag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
