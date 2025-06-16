'use client';

import { useEffect, useState } from 'react';

interface DustParticle {
  id: number;
  size: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
}

export default function DustParticles() {
  const [particles, setParticles] = useState<DustParticle[]>([]);

  useEffect(() => {
    // Create 20 dust particles with random properties
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1, // 1-4px
      left: Math.random() * 100, // 0-100%
      top: Math.random() * 100, // 0-100%
      delay: Math.random() * 5, // 0-5s
      duration: Math.random() * 4 + 6, // 6-10s
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="dust-particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
} 