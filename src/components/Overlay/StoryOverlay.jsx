/**
 * StoryOverlay.jsx — Cinematic text overlay
 * Focuses purely on minimal UI, typography, layout, and smooth scrub animation.
 */
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { getSegments } from '../../animations/scrollEngine';
import { useScrollProgress } from '../../hooks/useScrollProgress';

gsap.registerPlugin(ScrollTrigger);
const segments = getSegments();

export default function StoryOverlay() {
  const containerRef = useRef(null);
  const scrollProgress = useScrollProgress();

  useEffect(() => {
    if (!containerRef.current) return;

    // Master timeline mapped to the overall scroll driver
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-driver',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
      }
    });

    // Set timeline to exactly duration 1 so absolute positioning maps to scrollProgress 0-1
    tl.to({}, { duration: 1 }, 0);

    const textEls = containerRef.current.querySelectorAll('.story-text');

    textEls.forEach((el, index) => {
      const seg = segments[index];
      const start = seg.startPct;
      const end = seg.endPct;
      const duration = end - start;

      // Calculate relative times (timeline duration is 1.0)
      const fadeInDuration = 0.05;
      const fadeOutDuration = 0.04;
      
      const inTime = start + (duration * 0.1); 
      const outTime = end - fadeOutDuration - 0.01;

      // Initial state: hidden and slightly lowered
      gsap.set(el, { opacity: 0, y: 30 });

      // Fade in & move up
      tl.to(el, {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        duration: fadeInDuration,
      }, inTime);

      // Fade out & slight upward drift
      tl.to(el, {
        opacity: 0,
        y: -20,
        ease: 'power2.inOut',
        duration: fadeOutDuration,
      }, outTime);
    });

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-10 pointer-events-none">
      {segments.map((seg) => (
        <div
          key={seg.id}
          // Positioned slightly in the lower third
          className="story-text absolute left-1/2 top-[60%] w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 px-8 text-center"
        >
          {/* Cinematic Space Grotesk text, thin weight, high letter spacing */}
          <h2 className="font-story font-light tracking-[0.2em] text-white/80 text-2xl md:text-4xl leading-relaxed">
            {seg.overlay}
          </h2>
        </div>
      ))}
      
      {/* Scroll hint */}
      <div 
        className="absolute bottom-12 w-full text-center transition-opacity duration-1000 ease-in-out"
        style={{ opacity: scrollProgress > 0.02 ? 0 : 1 }}
      >
        <p className="font-body text-[10px] tracking-[0.4em] text-white/40 animate-pulse-slow">
          SCROLL TO EXPLORE
        </p>
      </div>
    </div>
  );
}
