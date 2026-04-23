/**
 * Planet.jsx
 * ----------
 * Cinematic, realistic planets. Dark base materials relying on
 * the single strong directional light to create dramatic crescents.
 * Uses AdditiveBlending for atmospheric scattering on the edges.
 */
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Planet = React.memo(function Planet({
  position = [0, 0, 0],
  radius = 2,
  baseColor = '#02050a',
  atmosphereColor = '#1a3a5c',
  hasRings = false,
  rotationSpeed = 0.001,
}) {
  const planetRef = useRef();
  const ringRef = useRef();

  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += rotationSpeed;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += rotationSpeed * 0.3;
    }
  });

  return (
    <group position={position}>
      {/* 
        Planet core: Dark standard material.
        Realism comes from shadows cast by the main directional sun.
      */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          color={baseColor}
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* 
        Atmosphere: Additive blending creates a realistic, 
        ethereal scatter effect at the planet's rim.
      */}
      <mesh scale={1.06}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshBasicMaterial
          color={atmosphereColor}
          transparent
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Optional rings */}
      {hasRings && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[radius * 1.5, radius * 2.5, 128]} />
          <meshStandardMaterial
            color="#8899aa"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            depthWrite={false}
            roughness={0.8}
          />
        </mesh>
      )}
    </group>
  );
});

export default Planet;
