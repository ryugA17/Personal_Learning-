/**
 * SpaceScene.jsx — Root R3F Canvas
 * Fixed behind the DOM scroll layer.
 */
import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import * as THREE from 'three';
import CinematicCamera from './CinematicCamera';
import Astronaut from './Astronaut';
import StarField from './StarField';
import Nebula from './Nebula';
import Planets from './Planets';
import Lights from './Lights';
import PostProcessing from '../Effects/PostProcessing';
import useStore from '../../store/useStore';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { getStateAtProgress } from '../../animations/scrollEngine';

function DynamicEnvironment() {
  const { scene } = useThree();
  const scrollProgress = useScrollProgress();

  useFrame(() => {
    const { fogColor, fogDensity } = getStateAtProgress(scrollProgress);
    
    // Smoothly transition background color towards the fog color
    // If not in a planet's atmosphere, it will be black/dark space.
    if (!scene.background) {
      scene.background = new THREE.Color('#03030a');
    }
    
    const targetBg = new THREE.Color(fogColor);
    // When fog is 0, keep space dark. Otherwise blend towards fog.
    if (fogDensity === 0) {
      targetBg.set('#03030a');
    }
    scene.background.lerp(targetBg, 0.1);

    // Update fog
    if (!scene.fog) {
      scene.fog = new THREE.FogExp2('#000000', 0);
    }
    scene.fog.color.lerp(new THREE.Color(fogColor), 0.1);
    // Lerp density for smooth transitions
    scene.fog.density = THREE.MathUtils.lerp(scene.fog.density, fogDensity, 0.1);
  });

  return null;
}

export default function SpaceScene() {
  const astronautRef = useRef(null);
  const setSceneReady = useStore((s) => s.setSceneReady);

  return (
    <div className="fixed inset-0 z-0 bg-[#03030a]">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={() => setSceneReady()}
      >
        <DynamicEnvironment />
        <CinematicCamera astronautRef={astronautRef} />
        <Lights />

        <Suspense fallback={null}>
          <Environment preset="night" />
          <StarField count={50000} />
          <Nebula />
          <Planets />
          <Astronaut ref={astronautRef} />
          <PostProcessing />
        </Suspense>
      </Canvas>
    </div>
  );
}

