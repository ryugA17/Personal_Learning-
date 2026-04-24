/**
 * Planets.jsx
 * -----------
 * Places distinct planets along the astronaut's scroll path.
 * Updated with darker, more realistic cinematic colors.
 */
import React from 'react';
import Planet from './Planet';

const PLANET_DATA = [
  {
    // Discovery — deep oceanic world
    position: [8, -2, -14],
    radius: 2.5,
    baseColor: '#020508',
    atmosphereColor: '#103050',
    hasRings: false,
    rotationSpeed: 0.001,
  },
  {
    // Exploration — dark gas giant
    position: [-7, 3, -22],
    radius: 3.5,
    baseColor: '#050208',
    atmosphereColor: '#2a1a4a',
    hasRings: true,
    rotationSpeed: 0.0008,
  },
  {
    // Encounter — obsidian rocky world
    position: [9, -1, -30],
    radius: 1.8,
    baseColor: '#0a0302',
    atmosphereColor: '#4a1505',
    hasRings: false,
    rotationSpeed: 0.0015,
  },
  {
    // Finale — massive dying star / anomaly
    position: [0, 0, -46],
    radius: 6,
    baseColor: '#1a0500',
    atmosphereColor: '#883300',
    hasRings: false,
    rotationSpeed: 0.0005,
  },
];

const Planets = React.memo(function Planets() {
  return (
    <group>
      {PLANET_DATA.map((planet, i) => (
        <Planet key={i} index={i} {...planet} />
      ))}
    </group>
  );
});

export default Planets;
