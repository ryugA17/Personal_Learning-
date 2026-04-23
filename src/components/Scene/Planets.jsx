/**
 * Planets.jsx
 * -----------
 * Places distinct planets along the astronaut's scroll path.
 * Each planet has a unique personality to match the story segments.
 */
import React from 'react';
import Planet from './Planet';

// Planets positioned at decreasing Z values matching astronaut's journey
const PLANET_DATA = [
  {
    // Discovery — icy blue world
    position: [8, -2, -14],
    radius: 2.5,
    baseColor: '#0d2137',
    highlightColor: '#1e5080',
    atmosphereColor: '#3a8fd8',
    hasRings: false,
    rotationSpeed: 0.001,
  },
  {
    // Exploration — lush violet gas giant
    position: [-7, 3, -22],
    radius: 3.5,
    baseColor: '#1a0a2e',
    highlightColor: '#6c3aab',
    atmosphereColor: '#8c5ce7',
    hasRings: true,
    rotationSpeed: 0.0008,
  },
  {
    // Encounter — red/orange rocky world
    position: [9, -1, -30],
    radius: 1.8,
    baseColor: '#2a0c08',
    highlightColor: '#8b3a20',
    atmosphereColor: '#d45020',
    hasRings: false,
    rotationSpeed: 0.0015,
  },
  {
    // Finale — massive golden star (the centerpiece)
    position: [0, 0, -46],
    radius: 6,
    baseColor: '#3a1a00',
    highlightColor: '#c87000',
    atmosphereColor: '#fdcb6e',
    hasRings: false,
    rotationSpeed: 0.0005,
  },
];

const Planets = React.memo(function Planets() {
  return (
    <group>
      {PLANET_DATA.map((planet, i) => (
        <Planet key={i} {...planet} />
      ))}
    </group>
  );
});

export default Planets;
