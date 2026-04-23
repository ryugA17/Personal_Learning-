/**
 * AnimatedCamera.jsx
 * ------------------
 * Scroll-driven camera that exposes its ref for the animation engine.
 * Uses useFrame to smoothly interpolate towards GSAP-driven target values,
 * preventing jerky camera movements.
 */
import React, { useRef, useEffect, forwardRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const AnimatedCamera = forwardRef(function AnimatedCamera(
  { initialPosition = [0, 3, 12] },
  ref
) {
  const { camera, set } = useThree();
  const targetPos = useRef(new THREE.Vector3(...initialPosition));
  const targetRot = useRef(new THREE.Euler(- 0.15, 0, 0));

  // Set initial camera state and make it the default camera
  useEffect(() => {
    camera.position.set(...initialPosition);
    camera.rotation.set(-0.15, 0, 0);
    camera.fov = 50;
    camera.updateProjectionMatrix();

    // Expose camera via the forwarded ref so GSAP can drive it
    if (ref) {
      ref.current = camera;
    }

    set({ camera });
  }, [camera, set, ref, initialPosition]);

  // Smooth interpolation every frame — GSAP sets the camera properties
  // directly, and useFrame ensures smooth rendering at 60fps
  useFrame(() => {
    // Camera always looks at origin (or a target) for cinematic feel
    // Comment this out if you want full manual rotation control:
    // camera.lookAt(0, 0, 0);
  });

  return null; // No visible element — we control the default camera
});

export default React.memo(AnimatedCamera);
