/**
 * HeroModel.jsx
 * -------------
 * Procedural 3D hero element: wireframe icosahedron + orbiting particles.
 * Exposes a ref for the animation engine to control via GSAP.
 * Uses React.memo + useMemo to prevent unnecessary re-renders.
 */
import React, { useRef, useMemo, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Floating particles that orbit the main shape.
 * Uses instanced mesh for GPU-efficient rendering.
 */
const Particles = React.memo(function Particles({ count = 200, radius = 3 }) {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random positions on a sphere shell
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = radius + (Math.random() - 0.5) * 1.5;
      data.push({
        position: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        ),
        speed: 0.2 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
        scale: 0.015 + Math.random() * 0.025,
      });
    }
    return data;
  }, [count, radius]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    particleData.forEach((p, i) => {
      // Gentle orbital motion
      const angle = t * p.speed + p.offset;
      dummy.position.set(
        p.position.x * Math.cos(angle * 0.3) - p.position.z * Math.sin(angle * 0.3),
        p.position.y + Math.sin(t * p.speed + p.offset) * 0.3,
        p.position.x * Math.sin(angle * 0.3) + p.position.z * Math.cos(angle * 0.3)
      );
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color="#a29bfe" transparent opacity={0.6} />
    </instancedMesh>
  );
});

/**
 * Main HeroModel component.
 * The outer group is what the animation engine targets for position/rotation/scale.
 */
const HeroModel = forwardRef(function HeroModel(props, ref) {
  const innerRef = useRef();

  // Subtle idle rotation (independent of GSAP scroll animations)
  useFrame(({ clock }) => {
    if (innerRef.current) {
      const t = clock.getElapsedTime();
      innerRef.current.rotation.x = Math.sin(t * 0.15) * 0.05;
      innerRef.current.rotation.z = Math.cos(t * 0.12) * 0.03;
    }
  });

  // Memoize geometry + material to avoid re-creation
  const icoGeometry = useMemo(() => new THREE.IcosahedronGeometry(1.5, 1), []);
  const wireframeMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#6c5ce7',
        wireframe: true,
        emissive: '#6c5ce7',
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0.8,
      }),
    []
  );

  const solidMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a1a2e',
        roughness: 0.3,
        metalness: 0.8,
        transparent: true,
        opacity: 0.4,
      }),
    []
  );

  return (
    <group ref={ref} {...props}>
      <group ref={innerRef}>
        {/* Solid inner icosahedron (subtle, gives depth) */}
        <mesh geometry={icoGeometry} material={solidMaterial} scale={0.95} />

        {/* Wireframe outer icosahedron (main visual) */}
        <mesh geometry={icoGeometry} material={wireframeMaterial} />

        {/* Orbiting particles */}
        <Particles count={200} radius={3} />
      </group>
    </group>
  );
});

export default React.memo(HeroModel);
