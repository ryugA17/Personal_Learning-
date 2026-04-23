/**
 * ScrollProgress.jsx — Minimal top progress bar
 * A subtle 2px line at the top of the screen tracking scroll progress.
 */
import React from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-30 bg-white/10 pointer-events-none">
      <div 
        className="h-full bg-white/60 origin-left will-change-transform"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
