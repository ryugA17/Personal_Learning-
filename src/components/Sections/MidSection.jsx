/**
 * MidSection.jsx
 * --------------
 * Middle storytelling section — narrative text + video area.
 * Triggers model rotation and camera pan animations.
 */
import React from 'react';
import ScrollVideo from '../Video/ScrollVideo';

const MidSection = React.memo(function MidSection() {
  return (
    <section id="section-mid" className="scroll-section">
      <div className="section-content">
        <div className="glass-panel" style={{ textAlign: 'left' }}>
          <p className="label-text">Chapter One</p>
          <h2
            className="display-heading"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            The Architecture of Light
          </h2>
          <p className="body-text">
            Every surface reflects a story. Every angle reveals a new
            perspective. As you scroll deeper, the geometry unfolds — revealing
            the intricate lattice of connections that bind our digital universe.
          </p>
          <p className="body-text">
            This is where design meets dimension. Where flat pixels become
            living structures.
          </p>
        </div>
      </div>
    </section>
  );
});

export default MidSection;
