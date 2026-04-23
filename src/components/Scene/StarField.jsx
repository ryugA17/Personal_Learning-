/**
 * StarField.jsx
 * -------------
 * 50,000 instanced star points rendered in a single draw call.
 * Stars subtly scale their density based on scroll progress.
 * Uses BufferGeometry + Points for maximum GPU efficiency.
 */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';

const StarField = React.memo(function StarField({ count = 50000 }) {
  const pointsRef = useRef();
  const scrollProgress = useScrollProgress();

  // Generate star positions once — spread across a large sphere volume
  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Random spherical distribution
      const radius = 30 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3]     = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Varied sizes: most tiny, a few large
      sizes[i] = Math.random() < 0.95 ? Math.random() * 1.5 + 0.5 : Math.random() * 3 + 2;
    }

    return { positions, sizes };
  }, [count]);

  // Subtle twinkle: slowly modulate opacity via material
  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle breath — slight opacity oscillation
    pointsRef.current.material.opacity = 0.7 + Math.sin(t * 0.3) * 0.15;
    // Density scaling based on scroll — stars get slightly larger/brighter
    const scale = 0.9 + scrollProgress * 0.3;
    pointsRef.current.material.size = scale;
  });

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, sizes]);

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={1.0}
        sizeAttenuation={true}
        color="#f8f9ff"
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
});

export default StarField;
