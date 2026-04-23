/**
 * Lights.jsx
 * ----------
 * Scene lighting setup for the storytelling environment.
 * Uses ambient + directional + accent point lights for depth.
 */
import React from 'react';

const Lights = React.memo(function Lights() {
  return (
    <>
      {/* Soft ambient fill */}
      <ambientLight intensity={0.15} color="#a29bfe" />

      {/* Key light — top-right */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        color="#f0f0f5"
        castShadow={false}
      />

      {/* Accent light — violet glow from left */}
      <pointLight
        position={[-4, 2, 3]}
        intensity={0.8}
        color="#6c5ce7"
        distance={15}
        decay={2}
      />

      {/* Accent light — teal glow from right-below */}
      <pointLight
        position={[4, -2, 2]}
        intensity={0.5}
        color="#00cec9"
        distance={12}
        decay={2}
      />

      {/* Subtle rim light from behind */}
      <pointLight
        position={[0, 3, -5]}
        intensity={0.4}
        color="#a29bfe"
        distance={20}
        decay={2}
      />
    </>
  );
});

export default Lights;
