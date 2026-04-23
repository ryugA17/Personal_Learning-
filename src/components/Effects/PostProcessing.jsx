/**
 * PostProcessing.jsx
 * ------------------
 * Applies Bloom selectively to the brightest elements (stars, emissive materials).
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
        // High threshold ensures planets and nebulas don't glow, only stars and emissives do
        luminanceThreshold={0.5} 
        luminanceSmoothing={0.9}
        blendFunction={BlendFunction.SCREEN}
      />
      <Vignette
        offset={0.5}
        darkness={0.6}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
