/**
 * Lights.jsx
 * ----------
 * Cinematic space lighting.
 * Mostly dark environment with low ambient light and one directional "sun" 
 * to provide dramatic contrast and deep shadows on the astronaut and planets.
 */
import React from 'react';

const Lights = React.memo(function Lights() {
  return (
    <>
      {/* Very low ambient light to barely fill shadows with a cool tone */}
      <ambientLight intensity={0.05} color="#88aaff" />
      
      {/* Distant main sun providing hard directional light and shadows */}
      <directionalLight 
        position={[30, 20, 10]} 
        intensity={1.2} 
        color="#ffffff" 
      />

      {/* Localized point lights for the planets to give them a subtle glow in the dark */}
      <pointLight position={[-8, 3, -14]} intensity={0.6} color="#3a8fd8" distance={25} decay={2} />
      <pointLight position={[-7, 3, -22]} intensity={0.6} color="#8c5ce7" distance={25} decay={2} />
      <pointLight position={[9, -1, -30]} intensity={0.5} color="#d45020" distance={25} decay={2} />
      
      {/* The finale sun — bright and dramatic */}
      <pointLight position={[0, 0, -46]} intensity={4.0} color="#fdcb6e" distance={60} decay={2} />
    </>
  );
});

export default Lights;
