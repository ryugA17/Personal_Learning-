/**
 * Lights.jsx — Space scene lighting
 */
import React from 'react';

const Lights = React.memo(function Lights() {
  return (
    <>
      <ambientLight intensity={0.08} color="#a0a0ff" />
      <directionalLight position={[10, 10, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[0, 0, -46]} intensity={8} color="#fdcb6e" distance={40} decay={2} />
      <pointLight position={[-8, 3, -14]} intensity={1.5} color="#3a8fd8" distance={20} decay={2} />
      <pointLight position={[-7, 3, -22]} intensity={1.5} color="#8c5ce7" distance={22} decay={2} />
      <pointLight position={[9, -1, -30]} intensity={1.2} color="#d45020" distance={18} decay={2} />
    </>
  );
});

export default Lights;
