"use client";

import { useEffect, useCallback, useRef } from 'react';
import TextAnimation from './TextAnimation';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const isLowEnd = typeof window !== 'undefined' ? window.navigator.hardwareConcurrency <= 4 : false;

  // Intersection Observer for fade-in effect
  useEffect(() => {
    if (isLowEnd) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, [isLowEnd]);

  const handleMouseMove = useCallback(() => {
    if (isLowEnd) return;
    requestAnimationFrame(() => {
      // Mouse move handling for future use
    });
  }, [isLowEnd]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className={`relative isolate overflow-hidden ${isLowEnd ? 'bg-[#1F2C90]/20' : 'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1F2C90]/30 via-[#2B3CA0]/20 to-[#4F4F00]/20'} min-h-screen flex items-center`}
      aria-label="Hero section"
      onMouseMove={handleMouseMove}
      style={{ willChange: isLowEnd ? 'auto' : 'transform', transform: isLowEnd ? 'none' : 'translateZ(0)' }}
    >
      {/* Subtle dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/10 mix-blend-overlay pointer-events-none" style={{ willChange: 'transform', transform: 'translateZ(0)' }}></div>
      
      {/* Content */}
      <div
        className="transition-all duration-700 relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full opacity-100 scale-100 z-50"
      >
        {/* Left column — copy */}
        <div className="text-white lg:col-span-12 py-20 sm:py-24 lg:py-32">
          <TextAnimation startWriting={true} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className="absolute bottom-24 left-1/2 transform -translate-x-1/2 transition-all duration-500 z-40 opacity-100 translate-y-0"
      >
        <div className="scroll-indicator">
          <span className="scroll-indicator-text">Scroll om meer te zien</span>
          <div className="scroll-indicator-arrow">
            <div className="scroll-indicator-dot"></div>
          </div>
        </div>
      </div>
    </section>
  );
}