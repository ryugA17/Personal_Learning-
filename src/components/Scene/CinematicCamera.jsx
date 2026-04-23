/**
 * CinematicCamera.jsx — follows astronaut with lerp + parallax
 */
import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { getStateAtProgress } from '../../animations/scrollEngine';

export default function CinematicCamera({ astronautRef }) {
  const { camera, set } = useThree();
  const scrollProgress = useScrollProgress();
  const lookAtTarget = useRef(new THREE.Vector3());
  const cameraTarget = useRef(new THREE.Vector3(0, 1.5, 8));

  useEffect(() => {
    camera.fov = 52;
    camera.near = 0.1;
    camera.far = 300;
    camera.position.set(0, 1.5, 8);
    camera.updateProjectionMatrix();
    set({ camera });
  }, [camera, set]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const { cameraOffset } = getStateAtProgress(scrollProgress);

    let astroPos = new THREE.Vector3(0, 0, 0);
    if (astronautRef?.current?.getPosition) {
      astroPos = astronautRef.current.getPosition();
    }

    // Idle parallax drift
    const idleX = Math.sin(t * 0.15) * 0.15;
    const idleY = Math.sin(t * 0.22) * 0.08;

    cameraTarget.current.set(
      astroPos.x + cameraOffset.offsetX + idleX,
      astroPos.y + cameraOffset.offsetY + idleY,
      astroPos.z + cameraOffset.offsetZ
    );

    // Cinematic lag lerp
    camera.position.lerp(cameraTarget.current, 0.04);

    // Lead lookAt slightly ahead in Z
    lookAtTarget.current.set(
      astroPos.x * 0.8,
      astroPos.y * 0.8,
      astroPos.z + 1
    );
    camera.lookAt(lookAtTarget.current);
  });

  return null;
}
