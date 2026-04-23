/**
 * useSmoothScroll.js
 * ------------------
 * Lenis smooth scroll + GSAP ticker sync + Zustand progress update.
 * Lenis handles momentum; ScrollTrigger uses native scroll events.
 */
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useStore from '../store/useStore';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  const setScrollProgress = useStore((s) => s.setScrollProgress);
  const setActiveSection = useStore((s) => s.setActiveSection);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,    // slower = more cinematic feel
      touchMultiplier: 1.5,
    });

    // Update Zustand scroll progress on every scroll tick
    lenis.on('scroll', ({ progress }) => {
      setScrollProgress(progress);

      // Determine active section from progress
      // 7 sections: each ~14.3% of total scroll
      const sectionIndex = Math.min(6, Math.floor(progress * 7));
      setActiveSection(sectionIndex);

      // Keep ScrollTrigger in sync
      ScrollTrigger.update();
    });

    // Plug Lenis into GSAP ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, [setScrollProgress, setActiveSection]);
}
