/**
 * ScrollOverlay.jsx
 * -----------------
 * Fixed overlay text blocks that fade in/out as the user scrolls.
 * Each block is tied to a scroll section via GSAP ScrollTrigger.
 *
 * This creates the Apple-style "text appears as you scroll" effect.
 */
import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** Overlay text content keyed by section */
const OVERLAY_CONTENT = [
  {
    id: 'overlay-intro',
    section: '#section-intro',
    lines: ['Imagine.', 'Create.', 'Transcend.'],
    position: 'bottom-right',
  },
  {
    id: 'overlay-mid',
    section: '#section-mid',
    lines: ['Where pixels', 'become poetry.'],
    position: 'top-left',
  },
  {
    id: 'overlay-outro',
    section: '#section-outro',
    lines: ['The future is', 'scrollable.'],
    position: 'center',
  },
];

/** Map position names to CSS */
const POSITION_STYLES = {
  'bottom-right': {
    bottom: '12%',
    right: '8%',
    left: 'auto',
    top: 'auto',
    textAlign: 'right',
  },
  'top-left': {
    top: '15%',
    left: '8%',
    right: 'auto',
    bottom: 'auto',
    textAlign: 'left',
  },
  center: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
};

const ScrollOverlay = React.memo(function ScrollOverlay() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      OVERLAY_CONTENT.forEach((block) => {
        const el = document.getElementById(block.id);
        if (!el) return;

        // Fade in on section enter, fade out on leave
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: block.section,
              start: 'top 80%',
              end: 'top 20%',
              scrub: 1,
            },
          }
        );

        // Fade out as we leave the section
        gsap.fromTo(
          el,
          { opacity: 1 },
          {
            opacity: 0,
            y: -30,
            ease: 'power2.in',
            scrollTrigger: {
              trigger: block.section,
              start: 'bottom 80%',
              end: 'bottom 30%',
              scrub: 1,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="scroll-overlay" ref={containerRef}>
      {OVERLAY_CONTENT.map((block) => (
        <div
          key={block.id}
          id={block.id}
          className="overlay-text-block"
          style={{
            ...POSITION_STYLES[block.position],
            maxWidth: block.position === 'center' ? '600px' : '400px',
          }}
        >
          {block.lines.map((line, i) => (
            <p
              key={i}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                lineHeight: 1.2,
                color:
                  i === 0
                    ? 'var(--color-accent-2)'
                    : 'var(--color-text)',
                letterSpacing: '-0.02em',
              }}
            >
              {line}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
});

export default ScrollOverlay;
