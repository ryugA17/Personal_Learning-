/**
 * MainScene.jsx
 * -------------
 * Root Three.js scene wrapped in R3F Canvas.
 * Fixed behind the DOM scroll layer. Contains camera, lights, and 3D models.
 *
 * Performance notes:
 * - dpr clamped to [1, 1.5] to prevent GPU strain on high-DPI screens
 * - frameloop="always" since we have continuous particle animation
 * - Flat mode disabled for proper lighting
 */
import React, { Suspense, forwardRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import AnimatedCamera from './AnimatedCamera';
import HeroModel from './HeroModel';
import Lights from './Lights';

const MainScene = forwardRef(function MainScene({ cameraRef, modelRef }, ref) {
  return (
    <div className="canvas-container" ref={ref}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        {/* Camera — driven by animation engine */}
        <AnimatedCamera ref={cameraRef} initialPosition={[0, 3, 12]} />

        {/* Lighting */}
        <Lights />

        {/* Environment map for subtle reflections */}
        <Suspense fallback={null}>
          <Environment preset="night" />
        </Suspense>

        {/* Hero 3D Object — driven by animation engine */}
        <Suspense fallback={null}>
          <HeroModel ref={modelRef} />
        </Suspense>
      </Canvas>
    </div>
  );
});

export default React.memo(MainScene);
