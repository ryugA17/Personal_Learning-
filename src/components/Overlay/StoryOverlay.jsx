/**
 * StoryOverlay.jsx — Tailwind text overlay
 * Shows the current section's story text. Fades in/out with scroll.
 */
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useActiveSection } from '../../hooks/useScrollProgress';
import { getSegments } from '../../animations/scrollEngine';

const segments = getSegments();

export default function StoryOverlay() {
  const activeSection = useActiveSection();
  const textRef = useRef(null);
  const prevSection = useRef(-1);

  useEffect(() => {
    if (!textRef.current || activeSection === prevSection.current) return;
    prevSection.current = activeSection;

    // Animate text change: fade out → update → fade in
    gsap.to(textRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(textRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        });
      },
    });
  }, [activeSection]);

  const segment = segments[Math.min(activeSection, segments.length - 1)];

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-end pb-16 px-8 md:px-16">
      {/* Section label — top left */}
      <div className="absolute top-24 left-8 md:left-16">
        <div className="flex gap-2 items-center">
          {segments.map((seg, i) => (
            <div
              key={seg.id}
              className={`h-0.5 transition-all duration-500 rounded-full ${
                i === activeSection
                  ? 'w-8 bg-accent-lavender'
                  : i < activeSection
                  ? 'w-4 bg-accent-lavender/40'
                  : 'w-4 bg-white/20'
              }`}
            />
          ))}
        </div>
        <p className="mt-2 text-xs font-body tracking-widest uppercase text-white/40">
          {segment?.label || ''}
        </p>
      </div>

      {/* Main story text — bottom */}
      <div ref={textRef} className="max-w-xl opacity-0">
        <p className="text-white/30 text-xs font-body tracking-widest uppercase mb-3">
          {String(activeSection + 1).padStart(2, '0')} / {String(segments.length).padStart(2, '0')}
        </p>
        <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight text-white/90 drop-shadow-lg">
          {segment?.overlay || ''}
        </h2>
      </div>
    </div>
  );
}
