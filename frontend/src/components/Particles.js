import React, { useEffect, useRef } from 'react';

const PARTICLE_COUNT = 25;

const Particles = ({ color = '#22c55e', opacity = 0.5 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('div');

      const size = Math.random() * 6 + 3;
      const left = Math.random() * 100;
      const duration = Math.random() * 12 + 8;
      const delay = Math.random() * 10;

      p.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        bottom: -20px;
        border-radius: 50%;
        background: ${color};
        opacity: 0;
        animation: particleFloat ${duration}s ${delay}s linear infinite;
        pointer-events: none;
        z-index: 1;
      `;

      container.appendChild(p);
      particles.push(p);
    }

    return () => {
      particles.forEach(p => {
        if (container.contains(p)) container.removeChild(p);
      });
    };
  }, [color]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
};

export default Particles;
