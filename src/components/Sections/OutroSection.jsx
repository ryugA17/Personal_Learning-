/**
 * OutroSection.jsx
 * ----------------
 * Final scroll section — closing statement + CTA.
 * Triggers camera push-in and model scale-up.
 */
import React from 'react';

const OutroSection = React.memo(function OutroSection() {
  return (
    <section id="section-outro" className="scroll-section" style={{ minHeight: '250vh' }}>
      <div className="section-content">
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <p className="label-text">The Finale</p>
          <h2
            className="display-heading"
            style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}
          >
            Built for the Future
          </h2>
          <p className="body-text">
            This is just the beginning. The convergence of 3D, animation, and
            storytelling creates experiences that linger — long after the last
            scroll.
          </p>
          <button className="cta-button" id="cta-explore">
            Start Your Journey
            <span style={{ fontSize: '1.2em' }}>→</span>
          </button>
        </div>
      </div>
    </section>
  );
});

export default OutroSection;
