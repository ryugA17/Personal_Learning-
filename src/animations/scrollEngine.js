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
 * Planet transition zones
 * Mapped to segment startPct and endPct where planets are approached.
 * peakPct is where the planet is closest/largest.
 */
const PLANETS_INFO = [
  { index: 0, startPct: 0.28, endPct: 0.42, peakPct: 0.35, fogColor: '#103050', peakFogDensity: 0.05, ambientColor: '#3a8fd8', ambientIntensity: 0.8 },
  { index: 1, startPct: 0.42, endPct: 0.56, peakPct: 0.49, fogColor: '#2a1a4a', peakFogDensity: 0.06, ambientColor: '#8c5ce7', ambientIntensity: 0.9 },
  { index: 2, startPct: 0.56, endPct: 0.70, peakPct: 0.63, fogColor: '#4a1505', peakFogDensity: 0.07, ambientColor: '#d45020', ambientIntensity: 0.8 },
  { index: 3, startPct: 0.85, endPct: 1.00, peakPct: 1.00, fogColor: '#883300', peakFogDensity: 0.08, ambientColor: '#fdcb6e', ambientIntensity: 1.2 }
];

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
 * Color interpolation helper (Hex to Hex)
 */
function lerpColor(c1, c2, t) {
  // Simple hex string lerp
  if (c1 === c2) return c1;
  const hex1 = parseInt(c1.replace('#', ''), 16);
  const hex2 = parseInt(c2.replace('#', ''), 16);
  const r1 = (hex1 >> 16) & 255;
  const g1 = (hex1 >> 8) & 255;
  const b1 = hex1 & 255;
  const r2 = (hex2 >> 16) & 255;
  const g2 = (hex2 >> 8) & 255;
  const b2 = hex2 & 255;
  const r = Math.round(lerp(r1, r2, t));
  const g = Math.round(lerp(g1, g2, t));
  const b = Math.round(lerp(b1, b2, t));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
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

  // Calculate planet transition states
  let activePlanetIndex = -1;
  let transitionT = 0; // 0 = deep space, 1 = deep atmosphere
  let fogColor = '#000000';
  let fogDensity = lerp(fromSeg.fogDensity, toSeg.fogDensity, segT);
  let ambientColor = '#88aaff'; // default space ambient
  let ambientIntensity = 0.05;  // default space ambient intensity
  let starOpacity = 1.0;
  let cameraShake = 0;
  let cameraZoom = 0;

  for (const planet of PLANETS_INFO) {
    if (p >= planet.startPct && p <= planet.endPct) {
      activePlanetIndex = planet.index;
      // Calculate transition: 0 at start/end, 1 at peak
      if (p <= planet.peakPct) {
        // Entering
        transitionT = (p - planet.startPct) / (planet.peakPct - planet.startPct);
      } else {
        // Exiting
        transitionT = 1.0 - ((p - planet.peakPct) / (planet.endPct - planet.peakPct));
      }
      
      // Smooth curve for transitionT
      transitionT = transitionT * transitionT * (3 - 2 * transitionT); // smoothstep
      
      fogColor = lerpColor('#000000', planet.fogColor, transitionT);
      fogDensity = lerp(0, planet.peakFogDensity, transitionT);
      ambientColor = lerpColor('#88aaff', planet.ambientColor, transitionT);
      ambientIntensity = lerp(0.05, planet.ambientIntensity, transitionT);
      starOpacity = lerp(1.0, 0.0, transitionT);
      
      // Shake peaks when entering/exiting atmosphere (t ~ 0.5)
      cameraShake = Math.sin(transitionT * Math.PI); // 0 -> 1 -> 0
      
      // Zoom in as we get closer
      cameraZoom = transitionT;
      break;
    }
  }

  return {
    astronautPos: lerpVec3(fromSeg.astronaut, toSeg.astronaut, segT),
    cameraOffset: lerpCam(fromSeg.camera, toSeg.camera, segT),
    starDensity: lerp(fromSeg.starDensity, toSeg.starDensity, segT),
    bloomIntensity: lerp(fromSeg.bloomIntensity, toSeg.bloomIntensity, segT) + (cameraShake * 0.5), // Subtle bloom flare at entry/exit
    nebulaOpacity: lerp(fromSeg.nebulaOpacity, toSeg.nebulaOpacity, segT),
    activeSegment: fromSeg,
    // Planet cinematic variables
    activePlanetIndex,
    transitionT,
    fogColor,
    fogDensity,
    ambientColor,
    ambientIntensity,
    starOpacity,
    cameraShake,
    cameraZoom
  };
}

/**
 * Get all segment definitions (for overlay component to iterate)
 */
export function getSegments() {
  return segments;
}
