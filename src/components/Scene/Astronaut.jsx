/**
 * Astronaut.jsx
 * -------------
 * Procedural astronaut mesh assembled from Three.js primitives.
 * Bodysuit (capsule), helmet (sphere with emissive visor), limbs.
 *
 * Physics simulation via useFrame lerp + sine drift:
 * - Smoothly follows scroll-driven target position (lerp factor 0.04)
 * - Idle body bob: sine wave on Y axis
 * - Idle drift: slow rotation on all axes
 * - Damping: velocity decays exponentially
 *
 * The group ref is exposed via forwardRef so CinematicCamera
 * can read the world position each frame.
 */
import React, { useRef, forwardRef, useImperativeHandle, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { getStateAtProgress } from '../../animations/scrollEngine';

// ---- Sub-components (memoized for zero re-renders) ----

const Suit = React.memo(function Suit() {
  return (
    // Torso
    <mesh position={[0, 0, 0]}>
      <capsuleGeometry args={[0.28, 0.5, 8, 16]} />
      <meshStandardMaterial color="#e8e8ee" roughness={0.4} metalness={0.3} />
    </mesh>
  );
});

const Helmet = React.memo(function Helmet() {
  return (
    <group position={[0, 0.55, 0]}>
      {/* Helmet shell */}
      <mesh>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color="#d0d4da" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Visor — emissive golden tint */}
      <mesh position={[0, 0, 0.18]} scale={[1, 0.7, 0.5]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color="#1a1000"
          emissive="#a06010"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
});

const Arm = React.memo(function Arm({ side = 1 }) {
  return (
    <group position={[side * 0.38, 0.1, 0]} rotation={[0, 0, side * -0.4]}>
      {/* Upper arm */}
      <mesh position={[side * 0.1, -0.15, 0]}>
        <capsuleGeometry args={[0.09, 0.28, 6, 12]} />
        <meshStandardMaterial color="#d8d8e0" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Forearm */}
      <mesh position={[side * 0.12, -0.48, 0]} rotation={[0, 0, side * -0.3]}>
        <capsuleGeometry args={[0.08, 0.22, 6, 12]} />
        <meshStandardMaterial color="#c8c8d0" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Glove */}
      <mesh position={[side * 0.15, -0.72, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#333340" roughness={0.6} metalness={0.1} />
      </mesh>
    </group>
  );
});

const Leg = React.memo(function Leg({ side = 1 }) {
  return (
    <group position={[side * 0.14, -0.38, 0]}>
      {/* Thigh */}
      <mesh position={[0, -0.18, 0]}>
        <capsuleGeometry args={[0.1, 0.28, 6, 12]} />
        <meshStandardMaterial color="#d8d8e0" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Shin */}
      <mesh position={[0, -0.52, 0]}>
        <capsuleGeometry args={[0.09, 0.24, 6, 12]} />
        <meshStandardMaterial color="#c8c8d0" roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Boot */}
      <mesh position={[0, -0.75, 0.04]} scale={[1.1, 0.7, 1.3]}>
        <boxGeometry args={[0.18, 0.12, 0.28]} />
        <meshStandardMaterial color="#222228" roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
});

// Backpack life-support unit
const LifeSupport = React.memo(function LifeSupport() {
  return (
    <mesh position={[0, 0.05, -0.32]}>
      <boxGeometry args={[0.38, 0.48, 0.14]} />
      <meshStandardMaterial color="#c0c4cc" roughness={0.5} metalness={0.4} />
    </mesh>
  );
});

// ---- Main Astronaut component ----
const Astronaut = forwardRef(function Astronaut(props, ref) {
  const groupRef = useRef();

  // Target position driven by scroll (world space)
  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  // Velocity for damping effect
  const velocity = useRef(new THREE.Vector3(0, 0, 0));

  const scrollProgress = useScrollProgress();

  // Expose the group's world position to parent (for camera follow)
  useImperativeHandle(ref, () => ({
    getPosition: () => {
      if (!groupRef.current) return new THREE.Vector3();
      const pos = new THREE.Vector3();
      groupRef.current.getWorldPosition(pos);
      return pos;
    },
    mesh: groupRef,
  }));

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Get target from scroll engine
    const { astronautPos } = getStateAtProgress(scrollProgress);
    targetPos.current.set(astronautPos.x, astronautPos.y, astronautPos.z);

    const mesh = groupRef.current;

    // --- Fake physics: lerp + damping ---
    // Calculate delta toward target
    const dx = targetPos.current.x - mesh.position.x;
    const dy = targetPos.current.y - mesh.position.y;
    const dz = targetPos.current.z - mesh.position.z;

    // Add spring force to velocity
    velocity.current.x += dx * 0.015;
    velocity.current.y += dy * 0.015;
    velocity.current.z += dz * 0.025;

    // Apply damping (energy loss)
    velocity.current.multiplyScalar(0.88);

    // Apply velocity
    mesh.position.x += velocity.current.x;
    mesh.position.y += velocity.current.y;
    mesh.position.z += velocity.current.z;

    // --- Idle float: sine bob ---
    mesh.position.y += Math.sin(t * 0.8) * 0.004;

    // --- Idle drift rotations ---
    mesh.rotation.x = Math.sin(t * 0.4) * 0.08;
    mesh.rotation.z = Math.sin(t * 0.3) * 0.06;

    // Yaw toward direction of travel
    const travelAngle = Math.atan2(velocity.current.x, velocity.current.z);
    mesh.rotation.y += (travelAngle - mesh.rotation.y) * 0.05;
  });

  return (
    <group ref={groupRef}>
      <Suit />
      <Helmet />
      <Arm side={1} />
      <Arm side={-1} />
      <Leg side={1} />
      <Leg side={-1} />
      <LifeSupport />

      {/* Subtle point light attached to visor — makes astronaut glow */}
      <pointLight position={[0, 0.5, 0.3]} intensity={0.4} color="#f0c060" distance={3} />
    </group>
  );
});

export default React.memo(Astronaut);
