/**
 * IntroSection.jsx
 * ----------------
 * First scroll section — hero intro with display heading.
 * Height provides scroll room for camera dolly animation.
 */
import React from 'react';

const IntroSection = React.memo(function IntroSection() {
  return (
    <section id="section-intro" className="scroll-section">
      <div className="section-content">
        <div className="glass-panel" style={{ textAlign: 'center' }}>
          <p className="label-text">Welcome to the Experience</p>
          <h1 className="display-heading">Beyond the Horizon</h1>
          <p className="display-subheading">
            Scroll to explore the unseen dimensions
          </p>
          <p className="body-text">
            A journey through space, light, and geometry — crafted to push the
            boundaries of what the web can feel like.
          </p>
        </div>
      </div>
    </section>
  );
});

export default IntroSection;
