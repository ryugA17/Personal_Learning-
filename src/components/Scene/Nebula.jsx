/**
 * Nebula.jsx
 * ----------
 * Sprite-based nebula clouds using additive blending.
 * Soft, glowing gas cloud appearance.
 * Opacity driven by scroll progress via the animation engine.
 */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { getStateAtProgress } from '../../animations/scrollEngine';

// Pre-generate a soft circular gradient texture procedurally
function createNebulaTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.3, 'rgba(200, 180, 255, 0.4)');
  gradient.addColorStop(0.7, 'rgba(100, 80, 200, 0.1)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// Nebula cloud data — positioned along the astronaut's Z travel path
const NEBULA_CLOUDS = [
  { position: [-8, 3, -10],  scale: 18, color: '#4a2080', rotation: 0.3 },
  { position: [10, -5, -16], scale: 22, color: '#1a3060', rotation: -0.5 },
  { position: [-6, 2, -22],  scale: 20, color: '#601040', rotation: 0.8 },
  { position: [8, 4, -28],   scale: 25, color: '#203060', rotation: -0.2 },
  { position: [-10, -3, -34],scale: 28, color: '#402060', rotation: 0.6 },
  { position: [5, 2, -40],   scale: 30, color: '#801030', rotation: -0.4 },
];

const NebulaCloud = React.memo(function NebulaCloud({ position, scale, color, texture, rotation }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    // Very slow rotation for living, breathing feel
    meshRef.current.rotation.z = rotation + clock.getElapsedTime() * 0.01;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <planeGeometry args={[scale, scale]} />
      <meshBasicMaterial
        map={texture}
        color={color}
        transparent
        opacity={0.6}
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
    // Fade in the entire nebula group based on scroll
    groupRef.current.children.forEach((child) => {
      if (child.material) {
        child.material.opacity = 0.6 * nebulaOpacity;
      }
    });
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
