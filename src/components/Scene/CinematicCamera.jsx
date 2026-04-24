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
    const { cameraOffset, cameraShake, cameraZoom } = getStateAtProgress(scrollProgress);

    let astroPos = new THREE.Vector3(0, 0, 0);
    if (astronautRef?.current?.getPosition) {
      astroPos = astronautRef.current.getPosition();
    }

    // Idle parallax drift + Cinematic Shake
    // Shake is intense during atmosphere entry/exit (when cameraShake is > 0)
    const shakeX = (Math.random() - 0.5) * cameraShake * 0.1;
    const shakeY = (Math.random() - 0.5) * cameraShake * 0.1;
    const idleX = Math.sin(t * 0.15) * 0.15 + shakeX;
    const idleY = Math.sin(t * 0.22) * 0.08 + shakeY;

    // Cinematic zoom: push camera closer to astronaut when zooming
    // base offset Z is usually around 4 to 8. We reduce it by up to 50%
    const zoomedOffsetZ = cameraOffset.offsetZ - (cameraOffset.offsetZ * 0.5 * cameraZoom);

    cameraTarget.current.set(
      astroPos.x + cameraOffset.offsetX + idleX,
      astroPos.y + cameraOffset.offsetY + idleY,
      astroPos.z + zoomedOffsetZ
    );

    // Cinematic lag lerp - slower lag when zooming in for dramatic feel
    const lerpFactor = 0.04 - (0.02 * cameraZoom);
    camera.position.lerp(cameraTarget.current, lerpFactor);
    
    // Also smoothly transition FOV tighter
    camera.fov = THREE.MathUtils.lerp(camera.fov, 52 - (15 * cameraZoom), 0.05);
    camera.updateProjectionMatrix();

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
