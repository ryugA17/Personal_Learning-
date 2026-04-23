/**
 * SpaceScene.jsx — Root R3F Canvas
 * Fixed behind the DOM scroll layer.
 */
import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import CinematicCamera from './CinematicCamera';
import Astronaut from './Astronaut';
import StarField from './StarField';
import Nebula from './Nebula';
import Planets from './Planets';
import Lights from './Lights';
import PostProcessing from '../Effects/PostProcessing';
import useStore from '../../store/useStore';

export default function SpaceScene() {
  const astronautRef = useRef(null);
  const setSceneReady = useStore((s) => s.setSceneReady);

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        style={{ background: '#03030a' }}
        onCreated={() => setSceneReady()}
      >
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
