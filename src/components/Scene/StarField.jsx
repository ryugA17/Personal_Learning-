/**
 * StarField.jsx
 * -------------
 * Multi-layered star system.
 * Updated to feel more realistic: smaller star sizes, pure white/faint blue colors,
 * avoiding cartoonish "snowball" stars.
 */
import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';

function createStarLayer(count, spreadX, spreadY, spreadZ) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * spreadX;
    positions[i3 + 1] = (Math.random() - 0.5) * spreadY;
    positions[i3 + 2] = 20 - Math.random() * spreadZ;
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return geometry;
}

const StarLayer = React.memo(function StarLayer({ 
  count, spreadX, spreadY, spreadZ, 
  size, color, opacity, 
  rotationSpeedX, rotationSpeedY, rotationSpeedZ 
}) {
  const pointsRef = useRef();
  
  const geometry = useMemo(
    () => createStarLayer(count, spreadX, spreadY, spreadZ),
    [count, spreadX, spreadY, spreadZ]
  );

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();
    pointsRef.current.rotation.x = t * rotationSpeedX;
    pointsRef.current.rotation.y = t * rotationSpeedY;
    pointsRef.current.rotation.z = t * rotationSpeedZ;
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        size={size}
        sizeAttenuation={true}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
});

const StarField = React.memo(function StarField() {
  const groupRef = useRef();
  const scrollProgress = useScrollProgress();

  useFrame(() => {
    if (groupRef.current) {
      // Endless universe: The starfield rushes towards the camera as the user scrolls.
      // Combined with the astronaut flying forward, this creates massive parallax speed.
      groupRef.current.position.z = scrollProgress * 250;
    }
  });

  return (
    <group ref={groupRef}>
      {/* 1. FAR LAYER: Spread deeply to -600 so we never run out of background */}
      <StarLayer 
        count={25000} 
        spreadX={300} spreadY={300} spreadZ={600}
        size={0.4} 
        color="#ffffff" 
        opacity={0.3} 
        rotationSpeedX={0.0001} 
        rotationSpeedY={0.0002} 
        rotationSpeedZ={0.0001} 
      />
      
      {/* 2. MID LAYER: Spread to -500 */}
      <StarLayer 
        count={8000} 
        spreadX={200} spreadY={200} spreadZ={500}
        size={0.7} 
        color="#f0f4ff" 
        opacity={0.5} 
        rotationSpeedX={-0.0003} 
        rotationSpeedY={0.0004} 
        rotationSpeedZ={-0.0002} 
      />
      
      {/* 3. NEAR LAYER: Spread to -400. As these move +250z on scroll, the closest ones will whip past the camera! */}
      <StarLayer 
        count={1500} 
        spreadX={100} spreadY={100} spreadZ={400}
        size={1.2} 
        color="#ffffff" 
        opacity={0.8} 
        rotationSpeedX={0.0008} 
        rotationSpeedY={-0.0005} 
        rotationSpeedZ={0.0006} 
      />
    </group>
  );
});

export default StarField;
