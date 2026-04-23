/**
 * PostProcessing.jsx — Bloom + Vignette
 * Intensity driven by scroll progress (peaks at finale)
 */
import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useScrollProgress } from '../../hooks/useScrollProgress';
import { getStateAtProgress } from '../../animations/scrollEngine';

export default function PostProcessing() {
  const scrollProgress = useScrollProgress();
  const { bloomIntensity } = getStateAtProgress(scrollProgress);

  return (
    <EffectComposer>
      <Bloom
        intensity={bloomIntensity}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        blendFunction={BlendFunction.SCREEN}
      />
      <Vignette
        offset={0.4}
        darkness={0.7}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
