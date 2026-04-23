/**
 * useStore.js — Zustand global state
 * ------------------------------------
 * Single source of truth for scroll progress (0→1).
 * Consumed by camera, astronaut, overlay — avoids prop drilling.
 */
import { create } from 'zustand';

const useStore = create((set) => ({
  // Core scroll progress: 0 = page top, 1 = page bottom
  scrollProgress: 0,
  setScrollProgress: (v) => set({ scrollProgress: v }),

  // Current story section index (0–6)
  activeSection: 0,
  setActiveSection: (i) => set({ activeSection: i }),

  // Whether scene is ready (R3F mounted)
  sceneReady: false,
  setSceneReady: () => set({ sceneReady: true }),
}));

export default useStore;
