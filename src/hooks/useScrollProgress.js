/**
 * useScrollProgress.js
 * --------------------
 * Convenience hook — returns current scrollProgress (0→1)
 * from Zustand store with a selector for minimal re-renders.
 */
import useStore from '../store/useStore';

export function useScrollProgress() {
  return useStore((s) => s.scrollProgress);
}

export function useActiveSection() {
  return useStore((s) => s.activeSection);
}
