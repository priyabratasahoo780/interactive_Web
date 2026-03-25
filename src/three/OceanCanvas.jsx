import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import CameraRig from './CameraRig';
import DepthEnvironment from './DepthEnvironment';
import LightRays from './LightRays';
import Particles from './Particles';
import Bubbles3D from './Bubbles3D';
import Fish from './Fish';
import Jellyfish from './Jellyfish';
import Swarm from './Swarm';
import Whale from './Whale';
import FloatingRocks from './FloatingRocks';
import CycloneEvent from './CycloneEvent';
import InfiniteWaves from './InfiniteWaves';
import KelpForest from './KelpForest';
import Flashlight from './Flashlight';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

function OceanScene({ scrollRef, mouseRef, isMobile, isCycloneActive, triggerLightningSound }) {
  return (
    <>
      <CameraRig scrollRef={scrollRef} mouseRef={mouseRef} />
      <DepthEnvironment scrollRef={scrollRef} />

      {/* Ambient + directional lighting */}
      <ambientLight color="#003060" intensity={0.8} />
      <directionalLight
        position={[10, 20, 5]}
        color="#48cae4"
        intensity={0.6}
      />
      {/* Surface caustics point light */}
      <pointLight position={[0, 15, 0]} color="#90e0ef" intensity={2} distance={40} decay={2} />

      <LightRays scrollRef={scrollRef} />
      <InfiniteWaves scrollRef={scrollRef} />
      <Particles isMobile={isMobile} scrollRef={scrollRef} />
      {!isMobile && <Bubbles3D mouseRef={mouseRef} />}
      {!isMobile && <Swarm mouseRef={mouseRef} />}
      <Fish />
      <Whale />
      <Jellyfish />
      <FloatingRocks />
      <KelpForest />
      <Flashlight mouseRef={mouseRef} scrollRef={scrollRef} />
      <CycloneEvent isActive={isCycloneActive} onLightningStrike={triggerLightningSound} />

      {!isMobile && (
        <EffectComposer disableNormalPass>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} />
        </EffectComposer>
      )}
    </>
  );
}

export default function OceanCanvas({ scrollRef, mouseRef, isCycloneActive, triggerLightningSound }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ fov: 60, near: 0.1, far: 500, position: [0, 0, 5] }}
        gl={{
          antialias: !isMobile,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          alpha: false,
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={isMobile ? [1, 1] : [1, 2]}
        style={{ width: '100%', height: '100%', background: '#000005' }}
      >
        <AdaptiveDpr pixelated />
        <AdaptiveEvents />
        <Suspense fallback={null}>
          <OceanScene 
            scrollRef={scrollRef} 
            mouseRef={mouseRef} 
            isMobile={isMobile} 
            isCycloneActive={isCycloneActive} 
            triggerLightningSound={triggerLightningSound}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
