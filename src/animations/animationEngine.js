/**
 * Animation Engine
 * ----------------
 * Reads the JSON animation config and applies GSAP ScrollTrigger
 * animations dynamically. This decouples animation definitions from
 * component code — designers can tweak the JSON without touching React.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Resolve a dot-notation target string ("camera.position") to the
 * actual Three.js object property to animate.
 *
 * @param {string} targetPath - e.g. "camera.position", "model.rotation"
 * @param {Object} refs       - { camera: cameraRef, model: modelRef }
 * @returns {Object|null}     - The Three.js Vector3/Euler to tween
 */
function resolveTarget(targetPath, refs) {
  const [objectKey, property] = targetPath.split('.');
  const ref = refs[objectKey];
  if (!ref?.current) return null;
  return ref.current[property] ?? null;
}

/**
 * Apply all animations defined in the config JSON.
 *
 * @param {Object}   config          - Parsed animationConfig.json
 * @param {Object}   refs            - Map of ref names → React refs
 * @param {Object}   [options]       - Extra options
 * @param {boolean}  [options.markers] - Show GSAP markers for debugging
 * @returns {ScrollTrigger[]}        - Array of created ScrollTriggers (for cleanup)
 */
export function applyAnimations(config, refs, options = {}) {
  const triggers = [];

  config.animations.forEach((anim) => {
    const target = resolveTarget(anim.target, refs);
    if (!target) {
      console.warn(`[AnimEngine] Could not resolve target: ${anim.target}`);
      return;
    }

    // Build the tween vars from the "to" values
    const tweenVars = { ...anim.to };

    // Build the "from" vars if specified
    const fromVars = anim.from ? { ...anim.from } : null;

    // ScrollTrigger configuration — scrub ties animation to scroll position
    const scrollTriggerConfig = {
      trigger: anim.section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,          // 1-second smoothing for buttery scrolling
      markers: options.markers || false,
    };

    let tween;
    if (fromVars) {
      // fromTo animation — explicit start and end values
      tween = gsap.fromTo(target, fromVars, {
        ...tweenVars,
        ease: anim.ease || 'power2.inOut',
        scrollTrigger: scrollTriggerConfig,
      });
    } else {
      // "to" only animation
      tween = gsap.to(target, {
        ...tweenVars,
        ease: anim.ease || 'power2.inOut',
        scrollTrigger: scrollTriggerConfig,
      });
    }

    if (tween.scrollTrigger) {
      triggers.push(tween.scrollTrigger);
    }
  });

  return triggers;
}

/**
 * Kill all ScrollTriggers created by the animation engine.
 * Call this in a useEffect cleanup to prevent memory leaks.
 *
 * @param {ScrollTrigger[]} triggers
 */
export function cleanupAnimations(triggers) {
  triggers.forEach((st) => st.kill());
}
