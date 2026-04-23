/**
 * App.jsx — Root orchestrator
 * Wires: Lenis smooth scroll → Zustand state → 3D scene + DOM overlays
 */
import React from 'react';
import SpaceScene from './components/Scene/SpaceScene';
import StoryOverlay from './components/Overlay/StoryOverlay';
import Navbar from './components/UI/Navbar';
import ScrollProgress from './components/UI/ScrollProgress';
import { useSmoothScroll } from './hooks/useSmoothScroll';

// Total scroll height = 7 sections × 120vh each
const TOTAL_SCROLL_HEIGHT = '840vh';

export default function App() {
  // Init Lenis + sync to Zustand
  useSmoothScroll();

  return (
    <>
      {/* ── Fixed 3D scene (z-0, behind everything) ── */}
      <SpaceScene />

      {/* ── Fixed UI (z-10/20, above scene) ── */}
      <Navbar />
      <StoryOverlay />
      <ScrollProgress />

      {/* ── Scroll driver ── */}
      {/* This invisible tall div creates the scroll space.
          The 3D scene is fixed; scrolling this div drives
          Lenis → Zustand → all animations. */}
      <div
        id="scroll-driver"
        style={{ height: TOTAL_SCROLL_HEIGHT }}
        className="relative z-[1] pointer-events-none"
      />
    </>
  );
}
