/**
 * Navbar.jsx — Minimal fixed nav
 */
import React from 'react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-20 flex items-center justify-between px-8 md:px-16 py-6">
      <span className="font-display font-bold text-white/80 text-lg tracking-tight">
        ✦ COSMOS
      </span>
      <p className="text-white/30 text-xs font-body tracking-widest uppercase">
        Scroll to explore
      </p>
    </nav>
  );
}
