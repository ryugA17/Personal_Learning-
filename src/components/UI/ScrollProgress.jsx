/**
 * ScrollProgress.jsx — Vertical progress bar on right edge
 */
import React from 'react';
import { useScrollProgress } from '../../hooks/useScrollProgress';

export default function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-1">
      {/* Track */}
      <div className="w-px h-32 bg-white/10 rounded-full relative overflow-hidden">
        {/* Fill */}
        <div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-accent-violet to-accent-cyan rounded-full transition-none"
          style={{ height: `${progress * 100}%` }}
        />
      </div>
      <span className="text-white/30 text-[10px] font-body tracking-widest mt-1">
        {Math.round(progress * 100)}%
      </span>
    </div>
  );
}
