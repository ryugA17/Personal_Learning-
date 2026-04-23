/**
 * scrollEngine.js — JSON → Animation Values
 * ------------------------------------------
 * Reads storyConfig.json and interpolates between segment keyframes
 * based on the current scrollProgress (0→1).
 *
 * Returns all animated values for a given progress value.
 * This is used by components to read their target state each frame.
 */
import config from './storyConfig.json';

const { segments } = config;

/**
 * Linear interpolation helper
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Clamp t between 0 and 1
 */
function clamp01(t) {
  return Math.max(0, Math.min(1, t));
}

/**
 * Interpolate a plain {x,y,z} object between two keyframes
 */
function lerpVec3(a, b, t) {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    z: lerp(a.z, b.z, t),
  };
}

/**
 * Interpolate camera offset between two keyframes
 */
function lerpCam(a, b, t) {
  return {
    offsetX: lerp(a.offsetX, b.offsetX, t),
    offsetY: lerp(a.offsetY, b.offsetY, t),
    offsetZ: lerp(a.offsetZ, b.offsetZ, t),
  };
}

/**
 * Get the animated state for the current scroll progress.
 *
 * @param {number} progress - 0→1 scroll progress
 * @returns {Object} - Interpolated values for all animated properties
 */
export function getStateAtProgress(progress) {
  const p = clamp01(progress);

  // Find which two segments we're between
  let fromSeg = segments[0];
  let toSeg = segments[1];
  let segT = 0;

  for (let i = 0; i < segments.length - 1; i++) {
    const s = segments[i];
    const e = segments[i + 1];
    if (p >= s.startPct && p <= e.endPct) {
      fromSeg = s;
      toSeg = e;
      const range = e.startPct - s.startPct;
      segT = range > 0 ? clamp01((p - s.startPct) / range) : 0;
      break;
    }
    // Past last transition — hold final segment
    if (p > e.startPct) {
      fromSeg = e;
      toSeg = e;
      segT = 1;
    }
  }

  return {
    astronautPos: lerpVec3(fromSeg.astronaut, toSeg.astronaut, segT),
    cameraOffset: lerpCam(fromSeg.camera, toSeg.camera, segT),
    starDensity: lerp(fromSeg.starDensity, toSeg.starDensity, segT),
    bloomIntensity: lerp(fromSeg.bloomIntensity, toSeg.bloomIntensity, segT),
    nebulaOpacity: lerp(fromSeg.nebulaOpacity, toSeg.nebulaOpacity, segT),
    fogDensity: lerp(fromSeg.fogDensity, toSeg.fogDensity, segT),
    activeSegment: fromSeg,
  };
}

/**
 * Get all segment definitions (for overlay component to iterate)
 */
export function getSegments() {
  return segments;
}
