/**
 * Nebula.jsx
 * ----------
 * Large, soft nebula clouds using transparent sprite textures.
 * Placed at different depths to provide atmospheric volume and subtle color
 * without dominating the darkness of space.
 */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { getStateAtProgress } from '../../animations/scrollEngine';

// Pre-generate a very soft, diffused circular gradient texture
function createNebulaTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  gradient.addColorStop(0.4, 'rgba(200, 180, 255, 0.15)');
  gradient.addColorStop(0.7, 'rgba(100, 80, 200, 0.05)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

// Atmosphere clouds positioned very deeply into Z
// We push them out to -300 so that when they move +200 on scroll, they still cover the deep background.
const NEBULA_CLOUDS = [
  { position: [-25, 15, -20],  scale: 60, color: '#1a1040', rotationBase: 0.1,  rotationSpeed: 0.002 },
  { position: [30, -20, -50],  scale: 80, color: '#0a1a40', rotationBase: -0.5, rotationSpeed: -0.001 },
  { position: [-15, -10, -100], scale: 100, color: '#2a0a40', rotationBase: 0.8,  rotationSpeed: 0.0015 },
  { position: [25, 25, -150],  scale: 120, color: '#0a2040', rotationBase: -0.2, rotationSpeed: -0.002 },
  { position: [-30, 20, -200], scale: 150, color: '#101a40', rotationBase: 0.6,  rotationSpeed: 0.001 },
  { position: [10, -15, -260], scale: 180, color: '#0a1530', rotationBase: -0.4,  rotationSpeed: -0.001 },
];

const NebulaCloud = React.memo(function NebulaCloud({ position, scale, color, texture, rotationBase, rotationSpeed }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    // Extremely slow rotation for an ethereal, drifting feel
    meshRef.current.rotation.z = rotationBase + clock.getElapsedTime() * rotationSpeed;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[scale, scale]} />
      <meshBasicMaterial
        map={texture}
        color={color}
        transparent
        // Keep baseline opacity very low so it just tints the darkness
        opacity={0.3}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
});

const Nebula = React.memo(function Nebula() {
  const groupRef = useRef();
  const scrollProgress = useScrollProgress();

  const texture = useMemo(() => createNebulaTexture(), []);

  useFrame(() => {
    if (!groupRef.current) return;
    const { nebulaOpacity } = getStateAtProgress(scrollProgress);
    
    // Scale the opacity based on the scroll engine config
    groupRef.current.children.forEach((child) => {
      if (child.material) {
        // Base max opacity is 0.4. Multiply by story config value.
        child.material.opacity = 0.4 * nebulaOpacity;
      }
    });

    // Move nebulas towards the camera to enhance the endless journey
    // They move slower than the stars to maintain deep atmospheric parallax
    groupRef.current.position.z = scrollProgress * 180;
  });

  return (
    <group ref={groupRef}>
      {NEBULA_CLOUDS.map((cloud, i) => (
        <NebulaCloud key={i} {...cloud} texture={texture} />
      ))}
    </group>
  );
});

export default Nebula;
