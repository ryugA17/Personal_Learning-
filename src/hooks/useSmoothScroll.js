/**
 * useSmoothScroll.js
 * ------------------
 * Initializes Lenis smooth scrolling and syncs it with GSAP's ticker
 * and ScrollTrigger. This gives us buttery-smooth momentum scrolling
 * while keeping all GSAP scroll animations perfectly in sync.
 */
import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useSmoothScroll() {
  useEffect(() => {
    // Initialize Lenis with tuned parameters
    const lenis = new Lenis({
      duration: 1.2,           // scroll duration in seconds
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Sync Lenis scroll with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis to GSAP's ticker so it runs every frame
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000); // Lenis expects ms, GSAP gives seconds
    });

    // Prevent GSAP from using its own requestAnimationFrame
    // (Lenis handles the loop)
    gsap.ticker.lagSmoothing(0);

    // Cleanup on unmount
    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);
}
