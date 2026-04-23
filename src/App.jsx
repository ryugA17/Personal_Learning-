/**
 * App.jsx
 * -------
 * Root application component. Orchestrates:
 * 1. Lenis smooth scrolling (via hook)
 * 2. R3F 3D scene (fixed behind scroll)
 * 3. Scroll sections (DOM content on top)
 * 4. GSAP animation engine (driven by JSON config)
 * 5. Overlay text + scroll progress indicator
 */
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import MainScene from './components/Scene/MainScene';
import IntroSection from './components/Sections/IntroSection';
import MidSection from './components/Sections/MidSection';
import OutroSection from './components/Sections/OutroSection';
import ScrollVideo from './components/Video/ScrollVideo';
import ScrollOverlay from './components/Overlay/ScrollOverlay';

import { useSmoothScroll } from './hooks/useSmoothScroll';
import { applyAnimations, cleanupAnimations } from './animations/animationEngine';
import animationConfig from './animations/animationConfig.json';

import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  // Refs for 3D objects — shared between scene and animation engine
  const cameraRef = useRef(null);
  const modelRef = useRef(null);
  const progressRef = useRef(null);

  // Initialize smooth scrolling
  useSmoothScroll();

  // Scroll progress indicator
  useEffect(() => {
    const progressBar = progressRef.current;
    if (!progressBar) return;

    gsap.to(progressBar, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.3,
      },
    });
  }, []);

  // Apply JSON-driven animations once refs are ready
  useEffect(() => {
    // Small delay to ensure R3F has mounted and refs are populated
    const timer = setTimeout(() => {
      const refs = {
        camera: cameraRef,
        model: modelRef,
      };

      const triggers = applyAnimations(animationConfig, refs, {
        markers: false, // set to true for debugging
      });

      return () => cleanupAnimations(triggers);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Scroll progress bar — top of viewport */}
      <div
        ref={progressRef}
        className="scroll-progress"
        style={{ transform: 'scaleX(0)' }}
      />

      {/* Minimal navigation */}
      <nav className="navbar" id="navbar">
        <div className="navbar-logo">✦ SCROLL STORY</div>
        <ul className="navbar-links">
          <li><a href="#section-intro">Intro</a></li>
          <li><a href="#section-mid">Story</a></li>
          <li><a href="#section-outro">Finale</a></li>
        </ul>
      </nav>

      {/* Fixed 3D scene behind scroll content */}
      <MainScene cameraRef={cameraRef} modelRef={modelRef} />

      {/* Overlay text that fades per section */}
      <ScrollOverlay />

      {/* Scrollable DOM sections */}
      <div className="scroll-container">
        <IntroSection />
        <MidSection />

        {/* Scroll-synced video (between mid and outro) */}
        <ScrollVideo />

        <OutroSection />
      </div>
    </>
  );
}

export default App;
