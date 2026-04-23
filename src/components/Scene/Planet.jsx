/**
 * Planet.jsx
 * ----------
 * Reusable planet component with procedural texture, rings option,
 * atmosphere glow, and slow self-rotation.
 */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Generate a procedural planet surface texture
 * using canvas + noise-like pattern
 */
function createPlanetTexture(baseColor, highlightColor) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Base color fill
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 0, size, size);

  // Add surface variation bands
  for (let i = 0; i < 12; i++) {
    const y = (size / 12) * i;
    const h = (size / 12) + Math.random() * 20 - 10;
    ctx.fillStyle = `rgba(${hexToRgb(highlightColor)}, ${Math.random() * 0.15})`;
    ctx.fillRect(0, y, size, h);
  }

  // Noise blobs
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 30 + 5;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(${hexToRgb(highlightColor)}, ${Math.random() * 0.2})`);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '128,128,128';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

/**
 * Single Planet mesh with atmosphere + optional rings
 */
const Planet = React.memo(function Planet({
  position = [0, 0, 0],
  radius = 2,
  baseColor = '#2d4a6b',
  highlightColor = '#4a7a9b',
  atmosphereColor = '#3a6fd8',
  hasRings = false,
  rotationSpeed = 0.002,
}) {
  const planetRef = useRef();
  const ringRef = useRef();

  const texture = useMemo(
    () => createPlanetTexture(baseColor, highlightColor),
    [baseColor, highlightColor]
  );

  const roughnessMap = useMemo(
    () => createPlanetTexture('#333333', '#666666'),
    []
  );

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
      {/* Planet sphere */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[radius, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          roughnessMap={roughnessMap}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh scale={1.08}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color={atmosphereColor}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Thick atmosphere rim */}
      <mesh scale={1.15}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshBasicMaterial
          color={atmosphereColor}
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Optional rings */}
      {hasRings && (
        <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[radius * 1.4, radius * 2.2, 64]} />
          <meshBasicMaterial
            color={highlightColor}
            transparent
            opacity={0.35}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
});

export default Planet;
