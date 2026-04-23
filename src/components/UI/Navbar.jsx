/**
 * Navbar.jsx — Minimal top-left logo
 * Cinematic, subtle, and non-distracting.
 */
import React from 'react';

export default function Navbar() {
  return (
    <nav className="fixed top-8 left-8 md:top-12 md:left-12 z-20 pointer-events-none">
      <span className="font-body font-light text-white/60 text-[11px] tracking-[0.3em] uppercase">
        Cosmos
      </span>
    </nav>
  );
}
