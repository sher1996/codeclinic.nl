'use client';

import { useEffect, useState, useRef } from 'react';

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
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const isLowEnd = window.navigator.hardwareConcurrency <= 4;
    const isMobile = window.innerWidth < 768 || window.devicePixelRatio > 2;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particleCount = (isLowEnd || prefersReducedMotion) ? 0 : (isMobile ? 20 : 30);
    
    // Create dust particles with random properties for better coverage
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1, // 1-4px
      // Exclude bottom-left corner (0-20% from left and 80-100% from top)
      left: Math.random() * 80 + 20, // 20-100%
      top: Math.random() * 80, // 0-80%
      delay: Math.random() * 5, // 0-5s
      duration: Math.random() * 4 + 6, // 6-10s
    }));
    setParticles(newParticles);
  }, [isVisible]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none">
      {isVisible && particles.map((particle) => (
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
            opacity: 0.3, // Reduced opacity
          }}
        />
      ))}
    </div>
  );
}

// Note: The dust particles are intentional for visual effect and are not a ghost artefact. 