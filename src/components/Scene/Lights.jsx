/**
 * Lights.jsx
 * ----------
 * Cinematic space lighting.
 * Mostly dark environment with low ambient light and one directional "sun" 
 * to provide dramatic contrast and deep shadows on the astronaut and planets.
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { getStateAtProgress } from '../../animations/scrollEngine';

const Lights = React.memo(function Lights() {
  const ambientRef = useRef();
  const dirRef = useRef();
  const scrollProgress = useScrollProgress();

  useFrame(() => {
    if (ambientRef.current && dirRef.current) {
      const { ambientColor, ambientIntensity, transitionT } = getStateAtProgress(scrollProgress);
      
      ambientRef.current.color.lerp(new THREE.Color(ambientColor), 0.1);
      ambientRef.current.intensity = THREE.MathUtils.lerp(ambientRef.current.intensity, ambientIntensity, 0.1);
      
      // Also tweak directional light color/intensity based on planet proximity
      // For instance, sun gets slightly tinted by atmosphere when inside it
      const targetDirColor = new THREE.Color('#ffffff').lerp(new THREE.Color(ambientColor), transitionT * 0.5);
      dirRef.current.color.lerp(targetDirColor, 0.1);
      // Boost directional light inside the planet
      dirRef.current.intensity = THREE.MathUtils.lerp(dirRef.current.intensity, 1.2 + transitionT * 0.8, 0.1);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.05} color="#88aaff" />
      
      <directionalLight 
        ref={dirRef}
        position={[30, 20, 10]} 
        intensity={1.2} 
        color="#ffffff" 
      />

      {/* Localized point lights for the planets to give them a subtle glow in the dark */}
      <pointLight position={[-8, 3, -14]} intensity={0.6} color="#3a8fd8" distance={25} decay={2} />
      <pointLight position={[-7, 3, -22]} intensity={0.6} color="#8c5ce7" distance={25} decay={2} />
      <pointLight position={[9, -1, -30]} intensity={0.5} color="#d45020" distance={25} decay={2} />
      
      {/* The finale sun — bright and dramatic */}
      <pointLight position={[0, 0, -46]} intensity={4.0} color="#fdcb6e" distance={60} decay={2} />
    </>
  );
});

export default Lights;

