import React, { useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { getStateAtProgress } from '../../animations/scrollEngine';

const AstronautModel = React.memo(function AstronautModel() {
  const group = useRef();
  const { scene, animations } = useGLTF('/astronaut.glb');
  const { actions } = useAnimations(animations, group);

  // Play the first animation found in the GLB automatically
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const firstActionKey = Object.keys(actions)[0];
      actions[firstActionKey].play();
    }
  }, [actions]);

  return (
    <group ref={group}>
      <primitive 
        object={scene} 
        scale={1} 
        position={[0, -0.5, 0]} 
      />
    </group>
  );
});

// Preload
useGLTF.preload('/astronaut.glb');

// ---- Main Astronaut component ----
const Astronaut = forwardRef(function Astronaut(props, ref) {
  const groupRef = useRef();

  const targetPos = useRef(new THREE.Vector3(0, 0, 0));
  const velocity = useRef(new THREE.Vector3(0, 0, 0));

  const scrollProgress = useScrollProgress();

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

    const { astronautPos } = getStateAtProgress(scrollProgress);
    targetPos.current.set(astronautPos.x, astronautPos.y, astronautPos.z);

    const mesh = groupRef.current;

    // --- Path Following: lerp + damping ---
    const dx = targetPos.current.x - mesh.position.x;
    const dy = targetPos.current.y - mesh.position.y;
    const dz = targetPos.current.z - mesh.position.z;

    velocity.current.x += dx * 0.015;
    velocity.current.y += dy * 0.015;
    velocity.current.z += dz * 0.025;

    velocity.current.multiplyScalar(0.88);

    mesh.position.x += velocity.current.x;
    mesh.position.y += velocity.current.y;
    mesh.position.z += velocity.current.z;

    // --- Cinematic Tumble ---
    // The astronaut rotates (tumbles) depending entirely on how far the user has scrolled.
    // We blend this with a tiny bit of sine-wave idle drift.
    mesh.rotation.x = (scrollProgress * Math.PI * 2.5) + Math.sin(t * 0.4) * 0.05;
    mesh.rotation.z = (scrollProgress * Math.PI * 1.5) + Math.sin(t * 0.3) * 0.05;

    // Yaw slowly shifts over the scroll distance
    mesh.rotation.y = (scrollProgress * Math.PI * 2.0);
  });

  return (
    <group ref={groupRef}>
      <React.Suspense fallback={null}>
        <AstronautModel />
      </React.Suspense>
      
      {/* Subtle point light attached to the astronaut */}
      <pointLight position={[0, 0.5, 0.5]} intensity={0.5} color="#f0c060" distance={4} />
    </group>
  );
});

export default React.memo(Astronaut);
